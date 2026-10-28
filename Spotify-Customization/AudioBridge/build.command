#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p 'Resonance Audio Bridge.app/Contents/MacOS'
xcrun swiftc -swift-version 5 -O -parse-as-library Source/AudioBridge.swift -o 'Resonance Audio Bridge.app/Contents/MacOS/ResonanceAudioBridge' -framework SwiftUI -framework ScreenCaptureKit -framework AVFoundation -framework Network -module-cache-path "${TMPDIR:-/tmp}/resonance-swift-cache"
cp Source/Info.plist 'Resonance Audio Bridge.app/Contents/Info.plist'
codesign --force --sign - 'Resonance Audio Bridge.app'
