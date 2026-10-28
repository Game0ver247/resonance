import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest


class HomebrewLauncherTests(unittest.TestCase):
    def test_runs_from_writable_copy_and_preserves_exit_code(self):
        launcher = Path(__file__).resolve().parents[1] / 'homebrew-launcher.py'
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder)
            for name in ('build.py', 'lyrics-engine.js', 'display-ui.js'):
                (source / name).write_text('original')
            (source / 'maintenance.py').write_text('''import sys
from pathlib import Path
assert sys.argv[1:] == ['check', '--json']
assert (Path(__file__).parent / 'display-ui.js').read_text() == 'original'
(Path(__file__).parent / 'display-ui.js').write_text('changed')
sys.exit(7)
''')
            spec = importlib.util.spec_from_file_location('homebrew_launcher', launcher)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            self.assertEqual(module.main(source, ['check', '--json']), 7)
            self.assertEqual((source / 'display-ui.js').read_text(), 'original')
