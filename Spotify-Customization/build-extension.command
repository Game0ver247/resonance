#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
cat lyrics-engine.js display-ui.js > resonanceDisplay.js
printf 'Built resonanceDisplay.js from lyrics-engine.js and display-ui.js\n'
