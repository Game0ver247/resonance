# 4.10.1 — Homebrew installation

- Add a packaged launcher that runs maintenance from a temporary writable copy.
- Document Homebrew and terminal installation for macOS, Windows and Linux.

# 4.10.0 — Fedora / Linux

- Linux entry points for install/update, health checks, uninstall and bundle building.
- Native Spotify version detection and deployment-matched Flatpak runtime queries.
- Fedora setup guide and automated checks on Fedora, Ubuntu, Windows and macOS.
- Existing listening interface and preferences remain unchanged.

# Changes

## 4.9.0

- A progress drag canceled by a track change or blur can no longer seek a replacement song.
- Late instrumental lyric responses cannot overwrite the current song’s state.
- The heart waits for unknown library state and ignores stale reads after a mutation; lookup failures remain retryable.
- Saved installation metadata is type-checked; the Mac Restore helper supports Spicetify on PATH and both common Homebrew locations.
- Build and maintenance share one bundle builder.
- Settings are grouped into Look & layout, Visualizer, Lyrics and Advanced. Escape dismisses settings before exiting the listening view.
- Artwork is sized to available space to avoid lyric overlap in compact windows. Metadata contrast, button focus and compact header spacing are improved.
- Added deterministic concurrency regressions, state/Restore tests and an isolated real-browser layout fixture.

## 4.8.0

Windows launchers, native executable version reading, shared Python build and Windows/macOS automated checks.
