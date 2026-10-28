#!/bin/zsh
set -euo pipefail
spicetify_cli="$(command -v spicetify || true)"
if [[ -z "$spicetify_cli" ]]; then
  for candidate in /opt/homebrew/bin/spicetify /usr/local/bin/spicetify; do
    if [[ -x "$candidate" ]]; then spicetify_cli="$candidate"; break; fi
  done
fi
if [[ -z "$spicetify_cli" ]]; then
  print -u2 'Spicetify was not found. Install it or add it to PATH, then retry.'
  exit 2
fi
exec "$spicetify_cli" restore
