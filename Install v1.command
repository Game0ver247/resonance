#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p "$HOME/.config/spicetify/Extensions"
cp Spotify-Customization/resonanceDisplay.js "$HOME/.config/spicetify/Extensions/resonanceDisplay.js"
/opt/homebrew/bin/spicetify config extensions resonanceDisplay.js
/opt/homebrew/bin/spicetify apply
