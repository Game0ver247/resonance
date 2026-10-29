> **Word-sync preview:** [4.17.0-preview.1](https://github.com/Game0ver247/resonance/releases/tag/v4.17.0-preview.1) adds genuine fine-timed lyrics and local diagnostic reports. [Testing guide](docs/testing/word-sync-preview.md). This branch is experimental; stable main/Homebrew remain 4.16.1.

# Resonance

An album-focused listening interface inside Spotify desktop, built with Spicetify. Includes macOS, Windows and Linux (including Fedora) installation tools. Current release: **4.16.1**, available for macOS, Windows and Linux (including Fedora). [Changelog](CHANGELOG.md).

[![Cross-platform checks](https://github.com/Game0ver247/resonance/actions/workflows/tests.yml/badge.svg)](https://github.com/Game0ver247/resonance/actions/workflows/tests.yml)

## Features

- Album artwork, full artist credits, playback context and smooth artwork transitions.
- Play/pause, previous/next, seek bar, save/unsave, shuffle and repeat.
- Queue drawer with thumbnails, durations, next-track preview, refresh/clear controls and supported jump/reorder/remove actions.
- Art-left, centered-art, lyrics-only and Lyrics + artwork layouts, with song details along the bottom in the combined view.
- Synced single-line and scrolling lyrics, click-to-seek, optional translations and per-song timing adjustments.
- Album-colored keyword emphasis, automatic lyric contrast and animated musical-note interludes.
- Cover or BPM-driven vinyl artwork, progress-following tonearm, coasting pause animation and optional beat pulse.
- Opaque Dark, Artwork, animated album-color Mesh and static Accent backgrounds; Mesh uses up to eight distinct cover-color splashes with optional slow time- or beat-based color rotation.
- Five accent colors or vivid album-matching accents, with a colorful fallback for monochrome covers.
- Waves, Ribbon, Bars and Dots; Calm, Tight, Flow and Punch motion presets.
- Album details, playable tracklists with Add to queue, clickable artist names, credits and available sourced album background information.
- Click outside settings, search, album details or the queue to dismiss the panel.
- Compact expandable search: six results initially, more fetched as you scroll (up to 60 ranked preview results). Choose Songs, Albums or Playlists tabs in Spotify result order. Artist names search within Resonance; albums play and open details, playlists play and open the queue, and album tracks retain album context.
- Balanced rendering capped near 30 fps, paused-frame reuse, hidden-page suspension and a Low power option under Advanced.
- Reduced-motion support, fullscreen controls, local preference storage and optional diagnostics.
- Update, uninstall and installation-health commands with recovery backups.

## Power usage

Under **resonance → Advanced → Power usage**, choose **Low power** to pause mesh movement and vinyl rotation, hide the visualizer and beat glow, and disable animated lyric blur/transitions. Lyrics, search and playback controls remain available. Switching back to Balanced restores your selected appearance settings.

Balanced keeps the visualizer near 30 fps, reuses unchanged paused frames, limits canvas pixel density and samples, and suspends rendering/polling while the page is hidden. Mesh motion uses transforms rather than animating large gradient positions. Expensive full-window backdrop blur has been removed.

The heaviest optional visuals are the moving mesh background, waveform rendering (especially Punch glow), vinyl rotation and animated lyric effects. Choose **Dark** or **Accent** backgrounds, **Cover** artwork and **Visualizer Off** to reduce individual effects without enabling Low power. Spotify can also consume CPU outside Resonance; these changes do not guarantee a particular total CPU load or temperature.

## Install

Resonance runs inside Spotify desktop. Install Spotify, sign in, and finish [Spicetify's platform-specific setup](https://spicetify.app/docs/getting-started) before applying Resonance. Python 3.9+ is required for source installs; Homebrew installs Python automatically. Source commands below also require Git. Downloads are available from [Releases](https://github.com/Game0ver247/resonance/releases).

### macOS — Homebrew

```sh
brew install Game0ver247/resonance/resonance
resonance update
```

Homebrew installs Python and Spicetify CLI as dependencies. If this is your first Spicetify installation, complete its setup before running `resonance update`. Installing the formula alone does not modify Spotify.

Upgrade later:

```sh
brew update
brew upgrade Game0ver247/resonance/resonance
resonance update
```

Check or remove the Spotify customization:

```sh
resonance check
resonance uninstall
```

Then `brew uninstall resonance` removes the command itself. Removing the Homebrew package alone does not undo Spotify customization. Recovery backups stay in your Spicetify config directory.

### macOS — source / Terminal

After setting up Spotify, Spicetify and Python:

```sh
git clone https://github.com/Game0ver247/resonance.git
cd resonance
./resonance.command update
```

### Fedora / Linux — Terminal

Follow [the Linux setup guide](LINUX.md) to configure Flatpak or native Spotify and its permissions. On Fedora, install prerequisites with `sudo dnf install python3 git`. Then:

```sh
git clone https://github.com/Game0ver247/resonance.git
cd resonance
sh resonance.sh update
```

Use `sh resonance.sh check` or `sh resonance.sh uninstall` for maintenance. No Node.js is required to install. On other Linux distributions, install Python and Git with your package manager first.

### Windows — Terminal

After installing Spotify, Spicetify, Python 3.9+ and Git, run in PowerShell or Command Prompt:

```powershell
git clone https://github.com/Game0ver247/resonance.git
cd resonance
.\resonance.cmd update
```

Use `.\resonance.cmd check` or `.\resonance.cmd uninstall` for maintenance. If you downloaded a ZIP instead, open a terminal in its extracted folder and run those commands without cloning.

Spotify restarts when changes are applied. Open **Resonance** near the top of Spotify, then click the **resonance** name for settings. Source installs update the files in that folder: run `git pull` before applying an upgrade. Double-clickable Mac and Windows maintenance scripts are also included.

## Windows setup details

1. Install Spotify desktop and sign in. Set up Spicetify using its [official Windows instructions](https://spicetify.app/docs/getting-started). For example, its documented Winget package is `Spicetify.Spicetify`. Reopen Terminal after installing so Spicetify is on PATH.
2. Install **Python 3.9+** with its launcher or Python on PATH. No other Python packages are needed.
3. Download and extract the Windows ZIP from [Releases](https://github.com/Game0ver247/resonance/releases/latest), or clone this repository.
4. Double-click **Install Resonance.cmd**, or open Command Prompt in the extracted folder and run:

```bat
resonance.cmd update
```

Spotify restarts after installation. The same Resonance interface and features are used on both systems, with Windows font fallbacks.

**Check Resonance.cmd**, **Update Resonance.cmd** and **Uninstall Resonance.cmd** provide the corresponding actions. To build the extension without changing Spotify, use **build-extension.cmd** or `py -3 build.py`.

The installer uses the Spotify path from Spicetify’s configuration and reads the actual `Spotify.exe` product version. It does not guess the installed version from an old backup. If the version cannot be read, it stops before changing Spotify. It does not install dependencies, change execution policy, or request administrator access.

### Windows validation

GitHub Actions runs the JS and maintenance suites on Windows and macOS, including a native Windows executable-version check and Windows launcher smoke tests. Tests simulate Spotify’s filesystem and commands; they do not run Spotify playback. **Live Spotify on Windows has not yet been verified.** Spotify service/API compatibility remains dependent on the installed client, account and Spicetify version.

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

Requires Node.js 18+ for JavaScript tests and Python 3.9+ for maintenance/tests. The macOS command wrappers use zsh and `/usr/bin/python3`. Windows `.cmd` launchers use `py -3`, with `python` as a fallback.

```sh
./build-extension.command
node tests/check-extension.cjs
node tests/check-lyrics.cjs
node tests/check-races.cjs
python3 -m unittest discover -s tests -p test_maintenance.py
```

Tests cover playback/library actions, queues, lyric timing and translations, offsets, visual features, artwork/layout state, failure handling and maintenance operations. Live service compatibility cannot be established by mocked tests alone.


### Optional layout QA

`tests/preview/` is an isolated browser fixture with authored demo artwork and fictional lyrics; it does not connect to a Spotify account. Serve this repository on loopback with `python3 -m http.server 8766 --bind 127.0.0.1`, then open `http://127.0.0.1:8766/tests/preview/`. With agent-browser, open Resonance, enable reduced motion for stable measurements and evaluate `tests/preview/assert-layout.js` at the desired viewport. The checks catch artwork/lyrics overlap and off-screen controls across all four layouts.
