import configparser
import importlib.util
from pathlib import Path
import plistlib
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import sys
import os
import shutil

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))

spec=importlib.util.spec_from_file_location('maintenance',Path(__file__).resolve().parents[1]/'maintenance.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class MaintenanceTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name);self.project=self.root/'project';self.project.mkdir()
        (self.project/'lyrics-engine.js').write_text('// engine')
        (self.project/'display-ui.js').write_text('// [Resonance] Artwork display ready')
        self.config_path=self.root/'config'/'config-xpui.ini';self.config_path.parent.mkdir()
        self.resources=self.root/'Spotify.app'/'Contents'/'Resources';self.resources.mkdir(parents=True)
        self.version='1.3.6.1921';self.write_version()
        self.config=configparser.ConfigParser();self.config.read_dict({'Setting':{'spotify_path':str(self.resources),'current_theme':''},'AdditionalOptions':{'extensions':module.EXTENSION,'custom_apps':''},'Backup':{'version':self.version+'.ghash'}});self.save_config()
        self.manager=module.Resonance(self.project,cli='fake-spicetify',config_path=self.config_path,runner=self.run_cli)
        self.manager.installed.parent.mkdir();self.manager.installed.write_bytes(self.manager.source_bundle());self.apply()
    def tearDown(self):self.temp.cleanup()
    def write_version(self):
        with (self.resources.parent/'Info.plist').open('wb') as stream:plistlib.dump({'CFBundleShortVersionString':self.version},stream)
    def save_config(self):
        with self.config_path.open('w', encoding='utf-8') as stream:self.config.write(stream)
    def apply(self):
        self.manager.xpui.mkdir(parents=True,exist_ok=True);(self.manager.xpui/'helper').mkdir(exist_ok=True);(self.manager.xpui/'helper'/'spicetifyWrapper.js').write_text('wrapper')
        self.manager.applied.parent.mkdir(exist_ok=True)
        index='helper/spicetifyWrapper.js'
        if module.EXTENSION in self.config['AdditionalOptions']['extensions'].split('|'):
            index+=' extensions/'+module.EXTENSION;self.manager.applied.write_bytes(self.manager.installed.read_bytes())
        elif self.manager.applied.exists():self.manager.applied.unlink()
        (self.manager.xpui/'index.html').write_text(index)
    def run_cli(self,cmd,**kwargs):
        args=cmd[1:]
        if args[0]=='config':
            items=self.config['AdditionalOptions']['extensions'].split('|');name=args[2]
            if name.endswith('-'):items=[i for i in items if i!=name[:-1]]
            elif name not in items:items.append(name)
            self.config['AdditionalOptions']['extensions']='|'.join(items);self.save_config()
        elif args==['restore']:(self.manager.xpui/'index.html').write_text('vanilla')
        else:
            if args[0]=='backup':self.config['Backup']['version']=self.version+'.ghash';self.save_config()
            self.apply()
        return subprocess.CompletedProcess(cmd,0)
    def test_healthy_and_missing_injection(self):
        self.assertEqual(self.manager.check()['status'],'healthy')
        (self.manager.xpui/'index.html').write_text('vanilla')
        self.assertTrue(any('loader' in x for x in self.manager.check()['issues']))
    def test_version_change_uses_backup_and_records_success(self):
        self.version='1.4.0.1';self.write_version();self.manager.update()
        self.assertIn(['backup','apply'],self.manager.commands)
        self.assertEqual(self.manager.check()['status'],'healthy')
        self.version='1.5.0.1';self.write_version()
        self.assertTrue(any('changed since' in x for x in self.manager.check()['issues']))
    def test_dry_run_changes_nothing(self):
        before={p:p.read_bytes() for p in self.root.rglob('*') if p.is_file()}
        self.manager.update(dry_run=True);self.manager.uninstall(dry_run=True)
        after={p:p.read_bytes() for p in self.root.rglob('*') if p.is_file()}
        self.assertEqual(before,after)
    def test_uninstall_preserves_other_customizations(self):
        self.config['AdditionalOptions']['extensions']+='|other.js';self.save_config();self.manager.uninstall()
        self.assertIn(['apply'],self.manager.commands);self.assertNotIn(['restore'],self.manager.commands)
        self.assertEqual(module.read_config(self.config_path)['AdditionalOptions']['extensions'],'other.js')
        self.assertFalse(self.manager.installed.exists());self.assertTrue((self.project/'display-ui.js').exists())
    def test_sole_extension_uninstall_restores_vanilla(self):
        self.manager.uninstall();self.assertIn(['restore'],self.manager.commands)
        self.assertEqual((self.manager.xpui/'index.html').read_text(),'vanilla')
    def test_uninstall_does_not_restore_stale_backup(self):
        self.version='1.5.0.1';self.write_version()
        with self.assertRaisesRegex(RuntimeError,'backup differ'):self.manager.uninstall()
        self.assertEqual(self.manager.commands,[])
    def test_failure_does_not_record_healthy_state(self):
        def fail(*args,**kwargs):raise subprocess.CalledProcessError(1,args[0])
        self.manager.runner=fail
        with self.assertRaises(subprocess.CalledProcessError):self.manager.update()
        self.assertFalse(self.manager.state_path.exists())
    def test_non_object_state_is_treated_as_missing_metadata(self):
        self.manager.state_path.parent.mkdir(parents=True,exist_ok=True)
        for payload in ['[]','null','false','42','"old"']:
            with self.subTest(payload=payload):
                self.manager.state_path.write_text(payload,encoding='utf-8')
                self.assertEqual(self.manager.check()['status'],'healthy')

    def test_applied_corruption(self):
        self.manager.applied.write_text('broken')
        self.assertTrue(any('different extension' in x for x in self.manager.check()['issues']))

class WindowsMaintenanceTests(MaintenanceTests):
    """Exercise all lifecycle paths with a Windows Spotify layout."""
    def setUp(self):
        super().setUp()
        self.resources=self.root/'Spotify Windows \u03a9';self.resources.mkdir()
        (self.resources/'Spotify.exe').write_bytes(b'fixture')
        self.config['Setting']['spotify_path']=str(self.resources);self.save_config()
        version_patch=patch.object(module,'windows_file_version',side_effect=lambda path:self.version)
        version_patch.start();self.addCleanup(version_patch.stop)
        self.manager.reload();self.apply()

    def test_windows_version_and_install_paths(self):
        self.assertEqual(self.manager.version,self.version)
        self.assertEqual(self.manager.xpui,self.resources/'Apps'/'xpui')
        self.assertEqual(self.manager.installed,self.config_path.parent/'Extensions'/module.EXTENSION)
        self.manager.update()
        self.assertEqual(self.manager.check()['status'],'healthy')

    def test_unreadable_windows_version_stops_before_mutations(self):
        with patch.object(module,'windows_file_version',return_value=''):
            with self.assertRaisesRegex(RuntimeError,'version is unreadable'):
                self.manager.update()
        self.assertEqual(self.manager.commands,[])


class RestoreWrapperTests(unittest.TestCase):
    @unittest.skipUnless(shutil.which('zsh'),'zsh wrapper test requires zsh')
    def test_restore_uses_the_cli_on_path(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);binary=root/'spicetify';record=root/'called'
            binary.write_text('#!/bin/sh\nprintf "%s" "$1" > "$RESONANCE_TEST_RECORD"\n',encoding='utf-8');binary.chmod(0o755)
            wrapper=Path(__file__).resolve().parents[1]/'Restore Spotify.command'
            # Block the old absolute command so this test can never alter real Spotify.
            script='function /opt/homebrew/bin/spicetify { return 127 }; source "$1"'
            result=subprocess.run([shutil.which('zsh'),'-c',script,'test',str(wrapper)],env={**os.environ,'PATH':str(root),'RESONANCE_TEST_RECORD':str(record)},capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertEqual(record.read_text(),'restore')


class NativeWindowsVersionTests(unittest.TestCase):
    @unittest.skipUnless(sys.platform=='win32','native executable version check requires Windows')
    def test_reads_real_executable(self):
        self.assertRegex(module.windows_file_version(Path(sys.executable)),r'^\d+\.\d+\.\d+\.\d+$')

    @unittest.skipUnless(sys.platform=='win32','native executable version check requires Windows')
    def test_missing_executable_has_no_version(self):
        self.assertEqual(module.windows_file_version(Path('missing-resonance-test-file.exe')),'')


if __name__=='__main__':unittest.main()
