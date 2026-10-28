# Resonance

An album-focused listening interface inside Spotify desktop, built with Spicetify. Designed and tested on macOS. Current source revision: **4.7**.

## Features

- Album artwork, full artist credits, playback context and smooth artwork transitions.
- Play/pause, previous/next, seek bar, save/unsave, shuffle and repeat.
- Queue drawer with thumbnails, durations, next-track preview and supported jump/reorder actions.
- Art-left, centered-art, lyrics-only and large-type Karaoke layouts.
- Synced single-line and scrolling lyrics, click-to-seek, optional translations and per-song timing adjustments.
- Album-colored keyword emphasis, automatic lyric contrast and animated musical-note interludes.
- Cover or BPM-driven vinyl artwork, coasting pause animation and optional beat pulse.
- Dark, Artwork, animated album-color Mesh and static Accent backgrounds.
- Five accent colors or automatic album-matching accent.
- Waves, Ribbon, Bars and Dots; Calm, Tight, Flow and Punch motion presets.
- Album details, tracklists, credits and available sourced album background information.
- Reduced-motion support, fullscreen controls, local preference storage and optional diagnostics.
- Update, uninstall and installation-health commands with recovery backups.

## Install on macOS

1. Install and sign in to Spotify desktop.
2. Set up [Spicetify using its official instructions](https://spicetify.app/docs/getting-started). The maintenance commands require an existing Spicetify configuration.
3. Clone or download this repository, open Terminal in its folder and run:

```sh
./resonance.command update
```

The updater rebuilds the bundle, registers the extension and applies it. Spotify restarts. Open **Resonance** near the top of Spotify. Click the **resonance** name inside the view for appearance settings. Escape returns to Spotify.

The updater is local: it installs the source in this folder, without downloading a newer release. After pulling a repository update, run it again. Double-clickable Update, Check and Uninstall command files are also included.

Manual installation of the generated `resonanceDisplay.js` follows the [Spicetify extension instructions](https://spicetify.app/docs/customization/extensions).

## Maintenance

```sh
./resonance.command check
./resonance.command update
./resonance.command uninstall
```

See [MAINTENANCE.md](MAINTENANCE.md) for recovery behavior, dry runs and limitations. Installation checks inspect versions, files and injection; they do not certify live Spotify APIs.

## Shortcuts

These apply while the Resonance view is open, outside typing fields:

| Key | Action |
| --- | --- |
| Escape | Return to Spotify |
| `[` | Show this song’s lyrics 0.1 seconds earlier |
| `]` | Show this song’s lyrics 0.1 seconds later |
| Backslash | Reset this song’s lyric offset |
| D | Toggle the debug overlay |

Timing adjustments are limited to ±5 seconds and stored locally per track.

## How it works

`display-ui.js` provides the interface, playback integration and Canvas visuals. `lyrics-engine.js` parses line timestamps. `resonanceDisplay.js` is the combined installable bundle. No package dependencies are required at runtime.

The visualizer uses precomputed Spotify track analysis and playback position. It is a musical interpretation, **not live frequency analysis or instrument isolation**. It needs no system-audio capture permission or helper window. Unsupported analysis falls back to ambient animation.

Lyrics use Spotify first and LRCLIB when synced Spotify lines are unavailable. Translations appear only when supplied by Spotify. Keyword emphasis is a local heuristic, not timed word highlighting. Some capabilities depend on Spotify’s internal interfaces and may break after updates. This project is not affiliated with Spotify.

## Data and external services

- Playback and library operations use the existing Spotify session; this repository contains no account credentials.
- A fallback lyric lookup sends track title, artist, album and duration to LRCLIB.
- Available album background excerpts may be requested from Wikipedia and include a source link.
- Preferences and lyric offsets are stored locally in Spotify’s browser storage.
- The debug overlay is local and does not upload diagnostics.

## Development and tests

Requires Node.js 18+ for JavaScript tests and Python 3.9+ for maintenance/tests. The macOS command wrappers use zsh and `/usr/bin/python3`.

```sh
./build-extension.command
node tests/check-extension.cjs
node tests/check-lyrics.cjs
python3 -m unittest discover -s tests -p test_maintenance.py
```

Tests cover playback/library actions, queues, lyric timing and translations, offsets, visual features, artwork/layout state, failure handling and maintenance operations. Live service compatibility cannot be established by mocked tests alone.
