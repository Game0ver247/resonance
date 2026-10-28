#!/usr/bin/env python3
"""Run packaged maintenance without writing into Homebrew's Cellar."""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


def main(source=None, args=None):
    source = Path(source) if source is not None else Path(__file__).resolve().parent
    args = sys.argv[1:] if args is None else args
    with tempfile.TemporaryDirectory(prefix='resonance-') as directory:
        project = Path(directory)
        for name in ('maintenance.py', 'build.py', 'lyrics-engine.js', 'display-ui.js'):
            shutil.copyfile(source / name, project / name)
        return subprocess.call([sys.executable, str(project / 'maintenance.py'), *args])


if __name__ == '__main__':
    sys.exit(main())
