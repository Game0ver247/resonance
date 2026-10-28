#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p Resonance.app/Contents/MacOS
xcrun swiftc -swift-version 5 -O -parse-as-library Source/Resonance.swift Source/Lyrics.swift -o Resonance.app/Contents/MacOS/Resonance -framework SwiftUI -framework AppKit -framework ScreenCaptureKit -framework AVFoundation -module-cache-path "${TMPDIR:-/tmp}/resonance-swift-cache"
cp Source/Info.plist Resonance.app/Contents/Info.plist
codesign --force --sign - Resonance.app
printf 'Built Resonance.app\n'
