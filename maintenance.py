#!/usr/bin/env python3
"""Local Resonance lifecycle commands. Standard library only; Python 3.9+."""
import argparse
import configparser
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import plistlib
import re
import shutil
import subprocess
import sys

EXTENSION = 'resonanceDisplay.js'


def read_config(path):
    config = configparser.ConfigParser(interpolation=None, strict=False)
    if not config.read(path):
        raise RuntimeError('Spicetify config not found: ' + str(path))
    return config


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None


def compatible(version, backup):
    return bool(version and backup and (backup == version or backup.startswith(version + '.')))


class Resonance:
    def __init__(self, project, cli=None, config_path=None, runner=None):
        self.project = Path(project).resolve()
        self.cli = cli or shutil.which('spicetify') or next((p for p in ['/opt/homebrew/bin/spicetify', '/usr/local/bin/spicetify'] if Path(p).is_file()), None)
        if not self.cli:
            raise RuntimeError('Spicetify is missing. Install spicetify-cli, then run this command again.')
        self.runner = runner or subprocess.run
        if config_path is None:
            result = self.runner([self.cli, '-c'], check=True, capture_output=True, text=True)
            config_path = result.stdout.strip()
        self.config_path = Path(config_path).expanduser()
        self.config_dir = self.config_path.parent
        self.state_path = self.config_dir / 'Resonance' / 'install-state.json'
        self.commands = []
        self.reload()

    def reload(self):
        self.config = read_config(self.config_path)
        self.resources = Path(self.config.get('Setting', 'spotify_path')).expanduser()
        self.xpui = self.resources / 'Apps' / 'xpui'
        self.installed = self.config_dir / 'Extensions' / EXTENSION
        self.applied = self.xpui / 'extensions' / EXTENSION
        self.version = ''
        try:
            with (self.resources.parent / 'Info.plist').open('rb') as stream:
                info = plistlib.load(stream)
            self.version = info.get('CFBundleShortVersionString', '')
        except (OSError, ValueError, plistlib.InvalidFileException):
            pass
        self.backup_version = self.config.get('Backup', 'version', fallback='')
        self.index = (self.xpui / 'index.html').read_text(errors='replace') if (self.xpui / 'index.html').is_file() else ''
        try:
            self.state = json.loads(self.state_path.read_text())
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
        if self.installed.is_file() and '[Resonance] Artwork display ready' not in self.installed.read_text(errors='replace'):
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
        return (self.project / 'lyrics-engine.js').read_bytes() + b'\n' + (self.project / 'display-ui.js').read_bytes()

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
        temporary.write_text(json.dumps(values, indent=2) + '\n')
        temporary.replace(self.state_path)

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
                    print('Repair: run this command with update. If Spicetify cannot apply, update spicetify-cli through Homebrew and retry.')
                print(report['scope'])
            return 1 if report['issues'] else 0
        getattr(manager, args.action)(dry_run=args.dry_run)
        return 0
    except (OSError, ValueError, configparser.Error, subprocess.CalledProcessError, RuntimeError) as error:
        print('Resonance: ' + str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
