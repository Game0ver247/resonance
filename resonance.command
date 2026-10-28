#!/bin/zsh
set -euo pipefail
project_dir="$(cd "$(dirname "$0")" && pwd)"
exec /usr/bin/python3 "$project_dir/maintenance.py" "$@"
