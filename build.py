#!/usr/bin/env python3
"""Build the dependency-free extension without platform-specific shell commands."""
from pathlib import Path


def build(root):
    bundle = (root / 'lyrics-engine.js').read_bytes() + b'\n' + (root / 'display-ui.js').read_bytes()
    (root / 'resonanceDisplay.js').write_bytes(bundle)
    return bundle


if __name__ == '__main__':
    build(Path(__file__).resolve().parent)
    print('Built resonanceDisplay.js')
