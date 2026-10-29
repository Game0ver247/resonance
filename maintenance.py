#!/usr/bin/env python3
"""Local Resonance lifecycle commands. Standard library only; Python 3.9+."""
import argparse
import configparser
from datetime import datetime, timezone
from functools import wraps
import hashlib
import json
from pathlib import Path
import plistlib
import os
import re
import shutil
import subprocess
import sys
from build import build_bundle

EXTENSION = 'resonanceDisplay.js'



def mac_maintenance_transaction(action):
    """Serialize Mac mutations across Finder, source and Homebrew invocations."""
    @wraps(action)
    def locked(self, dry_run=False):
        if sys.platform != 'darwin' or dry_run:
            return action(self, dry_run=dry_run)
        import fcntl
        lock_path = self.config_dir / 'Resonance' / 'maintenance.lock'
        lock_path.parent.mkdir(parents=True, exist_ok=True)
        # Keep the file: unlinking it would let another process lock a new inode.
        # Closing releases the advisory lock on success, errors, or process exit.
        with lock_path.open('a') as owner:
            try:
                fcntl.flock(owner, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                raise RuntimeError('Resonance maintenance is already running. Wait for it to finish and retry.') from None
            return action(self, dry_run=dry_run)
    return locked


def read_config(path):
    config = configparser.ConfigParser(interpolation=None, strict=False)
    if not config.read(path, encoding='utf-8-sig'):
        raise RuntimeError('Spicetify config not found: ' + str(path))
    return config


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None


def compatible(version, backup):
    return bool(version and backup and (backup == version or backup.startswith(version + '.')))


def windows_file_version(path):
    """Read the executable's fixed product version with the native Windows API."""
    if sys.platform != 'win32':
        return ''
    import ctypes
    from ctypes import wintypes
    class FixedFileInfo(ctypes.Structure):
        _fields_ = [(name, wintypes.DWORD) for name in (
            'signature', 'struct_version', 'file_ms', 'file_ls', 'product_ms',
            'product_ls', 'flags_mask', 'flags', 'os', 'type', 'subtype', 'date_ms', 'date_ls')]
    api = ctypes.WinDLL('version', use_last_error=True)
    api.GetFileVersionInfoSizeW.argtypes = [wintypes.LPCWSTR, ctypes.POINTER(wintypes.DWORD)]
    api.GetFileVersionInfoSizeW.restype = wintypes.DWORD
    api.GetFileVersionInfoW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD, ctypes.c_void_p]
    api.GetFileVersionInfoW.restype = wintypes.BOOL
    api.VerQueryValueW.argtypes = [ctypes.c_void_p, wintypes.LPCWSTR, ctypes.POINTER(ctypes.c_void_p), ctypes.POINTER(wintypes.UINT)]
    api.VerQueryValueW.restype = wintypes.BOOL
    size = api.GetFileVersionInfoSizeW(str(path), None)
    if not size:
        return ''
    buffer = ctypes.create_string_buffer(size)
    if not api.GetFileVersionInfoW(str(path), 0, size, buffer):
        return ''
    pointer, length = ctypes.c_void_p(), wintypes.UINT()
    if not api.VerQueryValueW(buffer, '\\', ctypes.byref(pointer), ctypes.byref(length)) or length.value < ctypes.sizeof(FixedFileInfo):
        return ''
    info = ctypes.cast(pointer, ctypes.POINTER(FixedFileInfo)).contents
    if info.signature != 0xFEEF04BD:
        return ''
    ms, ls = (info.product_ms, info.product_ls) if info.product_ms else (info.file_ms, info.file_ls)
    return '.'.join(str(value) for value in (ms >> 16, ms & 0xffff, ls >> 16, ls & 0xffff))


def linux_spotify_version(resources):
    """Query the configured installation, entering Flatpak's runtime when needed."""
    def query(args):
        result = subprocess.run(args, check=True, capture_output=True, text=True,
                                encoding='utf-8', errors='replace', timeout=10)
        return result.stdout.strip()

    try:
        if 'com.spotify.Client' in resources.parts:
            # Resolve active symlinks and compare deployments: never inspect a
            # different user/system installation just because it is available.
            for scope in ('--user', '--system'):
                try:
                    location = Path(query(['flatpak', 'info', scope, '--show-location', 'com.spotify.Client']))
                    if not location.is_absolute():
                        continue
                    expected = location / 'files' / 'extra' / 'share' / 'spotify'
                    if expected.resolve() == resources.resolve():
                        output = query(['flatpak', 'run', scope, 'com.spotify.Client', '--version'])
                        break
                except (OSError, subprocess.SubprocessError):
                    continue
            else:
                return ''
        else:
            output = query([str(resources / 'spotify'), '--version'])
        match = re.search(r'(?i)Spotify(?: version)?\s+(\d+\.\d+\.\d+\.\d+)', output)
        return match.group(1) if match else ''
    except (OSError, subprocess.SubprocessError):
        return ''


def spotify_version(resources):
    executable = resources / 'Spotify.exe'
    if executable.is_file():
        return windows_file_version(executable)
    if (resources / 'spotify').is_file():
        return linux_spotify_version(resources)
    try:
        with (resources.parent / 'Info.plist').open('rb') as stream:
            return plistlib.load(stream).get('CFBundleShortVersionString', '')
    except (OSError, ValueError, plistlib.InvalidFileException):
        return ''


class Resonance:
    def __init__(self, project, cli=None, config_path=None, runner=None):
        self.project = Path(project).resolve()
        self.cli = cli or shutil.which('spicetify') or next((p for p in ['/opt/homebrew/bin/spicetify', '/usr/local/bin/spicetify'] if Path(p).is_file()), None)
        if not self.cli:
            raise RuntimeError('Spicetify is missing. Install spicetify-cli, then run this command again.')
        self.runner = runner or subprocess.run
        if config_path is None:
            result = self.runner([self.cli, '-c'], check=True, capture_output=True, text=True, encoding='utf-8')
            config_path = result.stdout.strip()
        self.config_path = Path(config_path).expanduser()
        self.config_dir = self.config_path.parent
        self.state_path = self.config_dir / 'Resonance' / 'install-state.json'
        self.commands = []
        self.reload()

    def reload(self):
        self.config = read_config(self.config_path)
        self.resources = Path(os.path.expandvars(self.config.get('Setting', 'spotify_path'))).expanduser()
        self.xpui = self.resources / 'Apps' / 'xpui'
        self.installed = self.config_dir / 'Extensions' / EXTENSION
        self.applied = self.xpui / 'extensions' / EXTENSION
        self.version = spotify_version(self.resources)
        self.backup_version = self.config.get('Backup', 'version', fallback='')
        self.index = (self.xpui / 'index.html').read_text(encoding='utf-8', errors='replace') if (self.xpui / 'index.html').is_file() else ''
        try:
            state = json.loads(self.state_path.read_text(encoding='utf-8'))
            self.state = state if isinstance(state,dict) else {}
        except (OSError, ValueError):
            self.state = {}

    def extensions(self):
        return [item.strip() for item in self.config.get('AdditionalOptions', 'extensions', fallback='').split('|') if item.strip()]

    def check(self):
        self.reload()
        issues = []
        if not self.version:
            issues.append('Spotify version cannot be read. Check the configured spotify_path.')
        if self.state.get('spotify_version') and self.state['spotify_version'] != self.version:
            issues.append('Spotify changed since the last successful Resonance update.')
        if not compatible(self.version, self.backup_version):
            issues.append('Spicetify backup does not match this Spotify version.')
        if EXTENSION not in self.extensions():
            issues.append('Resonance is not enabled in Spicetify.')
        if 'helper/spicetifyWrapper.js' not in self.index or not (self.xpui / 'helper' / 'spicetifyWrapper.js').is_file():
            issues.append('Spotify is missing the Spicetify loader; an update may have replaced it.')
        if 'extensions/' + EXTENSION not in self.index:
            issues.append('Spotify is missing the Resonance script tag.')
        if not self.installed.is_file():
            issues.append('Installed extension file is missing.')
        if not self.applied.is_file():
            issues.append('Applied extension file is missing from Spotify.')
        elif digest(self.installed) != digest(self.applied):
            issues.append('Spotify has a different extension build than Spicetify; reapply it.')
        if self.installed.is_file() and '[Resonance] Artwork display ready' not in self.installed.read_text(encoding='utf-8', errors='replace'):
            issues.append('Installed Resonance extension looks incomplete.')
        source = self.source_bundle()
        return {
            'status': 'needs_attention' if issues else 'healthy',
            'spotify_version': self.version,
            'backup_version': self.backup_version,
            'last_successful_update': self.state.get('updated_at'),
            'issues': issues,
            'local_update_available': bool(self.installed.is_file() and hashlib.sha256(source).hexdigest() != digest(self.installed)),
            'scope': 'Version, configuration, loader, and file integrity. Live playback/API behavior is not tested.',
        }

    def source_bundle(self):
        return build_bundle(self.project)

    def command(self, *args, dry_run=False):
        self.commands.append(list(args))
        print(('Would run: ' if dry_run else 'Running: ') + 'spicetify ' + ' '.join(args), flush=True)
        if not dry_run:
            self.runner([self.cli] + list(args), check=True, stdin=subprocess.DEVNULL)

    def snapshot(self):
        path = self.config_dir / 'Resonance' / 'backups' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
        path.mkdir(parents=True)
        shutil.copy2(self.config_path, path / self.config_path.name)
        if self.installed.is_file():
            shutil.copy2(self.installed, path / EXTENSION)
        print('Recovery copy: ' + str(path), flush=True)
        return path

    def save_state(self, **values):
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        values['updated_at'] = datetime.now(timezone.utc).isoformat()
        temporary = self.state_path.with_suffix('.tmp')
        temporary.write_text(json.dumps(values, indent=2) + '\n', encoding='utf-8')
        temporary.replace(self.state_path)

    @mac_maintenance_transaction
    def update(self, dry_run=False):
        self.reload()
        if not self.version:
            raise RuntimeError('Spotify version is unreadable; update stopped before making changes.')
        bundle = self.source_bundle()
        needs_backup = not compatible(self.version, self.backup_version) or not self.backup_version
        print('Rebuild and install the local Resonance source. Spotify will restart.', flush=True)
        if not dry_run:
            self.snapshot()
            (self.project / EXTENSION).write_bytes(bundle)
            self.installed.parent.mkdir(parents=True, exist_ok=True)
            temporary = self.installed.with_suffix('.tmp')
            temporary.write_bytes(bundle)
            temporary.replace(self.installed)
        self.command('config', 'extensions', EXTENSION, dry_run=dry_run)
        # Use Spicetify's documented refresh workflow after Spotify updates.
        self.command(*(['backup', 'apply'] if needs_backup else ['apply']), dry_run=dry_run)
        if dry_run:
            return
        report = self.check()
        if report['issues']:
            # The recorded previous version is deliberately compared by check(); it is
            # expected to change here after a successful update. Verify all other checks.
            remaining = [issue for issue in report['issues'] if not issue.startswith('Spotify changed since')]
            if remaining:
                raise RuntimeError('Update did not pass verification: ' + ' '.join(remaining))
        self.save_state(spotify_version=self.version, extension_sha256=digest(self.installed), installed=True)
        print('Resonance updated; installation checks passed.', flush=True)

    @mac_maintenance_transaction
    def uninstall(self, dry_run=False):
        self.reload()
        other_extensions = [name for name in self.extensions() if name != EXTENSION]
        other_customizations = bool(other_extensions or self.config.get('Setting', 'current_theme', fallback='').strip() or self.config.get('AdditionalOptions', 'custom_apps', fallback='').strip())
        patched = 'helper/spicetifyWrapper.js' in self.index
        if patched and not compatible(self.version, self.backup_version):
            raise RuntimeError('Spotify and its backup differ. Run update before uninstalling, so an old backup is not restored over a newer Spotify.')
        print('Remove Resonance. Project files, saved v1, Spotify library, and other extensions are preserved.', flush=True)
        if not dry_run:
            self.snapshot()
        self.command('config', 'extensions', EXTENSION + '-', dry_run=dry_run)
        if patched:
            self.command('apply' if other_customizations else 'restore', dry_run=dry_run)
        if not dry_run:
            self.reload()
            if EXTENSION in self.extensions() or 'extensions/' + EXTENSION in self.index:
                raise RuntimeError('Uninstall did not fully apply. Recovery copies are in the Spicetify Resonance/backups folder.')
            if self.installed.is_file():
                self.installed.unlink()  # Recovery copy was saved above.
            self.save_state(spotify_version=self.version, installed=False)
            print('Resonance uninstalled. Run update to reinstall.', flush=True)


def main():
    parser = argparse.ArgumentParser(description='Maintain the local Resonance Spotify customization.')
    parser.add_argument('action', nargs='?', default='check', choices=['update', 'uninstall', 'check'])
    parser.add_argument('--dry-run', action='store_true', help='Print update/uninstall actions without changing files or restarting Spotify.')
    parser.add_argument('--json', action='store_true', help='Output the check as JSON.')
    args = parser.parse_args()
    try:
        manager = Resonance(Path(__file__).resolve().parent)
        if args.action == 'check':
            report = manager.check()
            if args.json:
                print(json.dumps(report, indent=2))
            else:
                print('Resonance: ' + ('OK' if not report['issues'] else 'NEEDS ATTENTION'))
                print('Spotify ' + (report['spotify_version'] or 'unknown'))
                for issue in report['issues']:
                    print(' - ' + issue)
                if report['local_update_available']:
                    print('Local source is newer/different; run update to install it.')
                if report['issues']:
                    print('Repair: run this command with update. If Spicetify cannot apply, update Spicetify using your package manager or its official instructions and retry.')
                print(report['scope'])
            return 1 if report['issues'] else 0
        getattr(manager, args.action)(dry_run=args.dry_run)
        return 0
    except (OSError, ValueError, configparser.Error, subprocess.CalledProcessError, RuntimeError) as error:
        print('Resonance: ' + str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
