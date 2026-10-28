#!/bin/sh
# Portable Linux entry point. Run as your normal desktop user.
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if ! command -v python3 >/dev/null 2>&1; then
    echo 'Python 3.9+ is required. On Fedora: sudo dnf install python3' >&2
    exit 2
fi
python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3,9) else 1)' || {
    echo 'Python 3.9 or newer is required.' >&2
    exit 2
}
# The official Spicetify installer uses this location; no global PATH edit.
PATH="$PATH:$HOME/.spicetify"
export PATH
exec python3 "$project_dir/maintenance.py" "$@"
