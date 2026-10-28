import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import test_maintenance as base
module = base.module


class LinuxVersionTests(unittest.TestCase):
    def test_native_uses_configured_binary(self):
        with tempfile.TemporaryDirectory() as folder:
            resources = Path(folder)
            (resources / 'spotify').touch()
            with patch.object(module.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, 'Spotify version 1.3.4.123.gabcdef\n', '')) as run:
                self.assertEqual(module.spotify_version(resources), '1.3.4.123')
                self.assertEqual(run.call_args.args[0], [str(resources / 'spotify'), '--version'])
                self.assertEqual(run.call_args.kwargs['timeout'], 10)

    def test_flatpak_matches_configured_deployment(self):
        with tempfile.TemporaryDirectory() as folder:
            deployment = Path(folder) / 'com.spotify.Client' / 'deployment'
            resources = deployment / 'files/extra/share/spotify'
            resources.mkdir(parents=True)
            (resources / 'spotify').touch()
            def run(args, **kwargs):
                if '--show-location' in args:
                    location = str(deployment) if '--system' in args else folder + '/different'
                    return subprocess.CompletedProcess(args, 0, location, '')
                self.assertEqual(args, ['flatpak', 'run', '--system', 'com.spotify.Client', '--version'])
                return subprocess.CompletedProcess(args, 0, 'Spotify version 1.3.4.123.gabcdef', '')
            with patch.object(module.subprocess, 'run', side_effect=run):
                self.assertEqual(module.spotify_version(resources), '1.3.4.123')

    def test_flatpak_does_not_query_wrong_installation(self):
        with tempfile.TemporaryDirectory() as folder:
            resources = Path(folder) / 'com.spotify.Client/files/extra/share/spotify'
            resources.mkdir(parents=True); (resources / 'spotify').touch()
            with patch.object(module.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, folder + '/other', '')) as run:
                self.assertEqual(module.spotify_version(resources), '')
                self.assertTrue(all(call.args[0][1] == 'info' for call in run.call_args_list))

    def test_timeout_or_invalid_output_is_unknown(self):
        with tempfile.TemporaryDirectory() as folder:
            resources = Path(folder); (resources / 'spotify').touch()
            for result in [subprocess.TimeoutExpired('spotify', 10), subprocess.CompletedProcess([], 0, 'not a version', '')]:
                with self.subTest(result=result):
                    with patch.object(module.subprocess, 'run', **({'side_effect': result} if isinstance(result, Exception) else {'return_value': result})):
                        self.assertEqual(module.spotify_version(resources), '')


class LinuxMaintenanceTests(base.MaintenanceTests):
    def write_version(self):
        (self.resources / 'spotify').touch()

    def setUp(self):
        self.version_patch = patch.object(module, 'linux_spotify_version', side_effect=lambda path: self.version)
        self.version_patch.start()
        self.addCleanup(self.version_patch.stop)
        super().setUp()
