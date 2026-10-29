# 4.13.0 — Lower rendering load and expanding search

- Cap active rendering near 30 fps, cache canvas sizing, bound waveform samples and reuse geometry across lines.
- Reuse unchanged paused frames and suspend hidden-page rendering/polling; localize beat-pulse styles to the artwork rather than the whole view.
- Make mesh drift transform-only, pause unused/paused background motion and remove full-window backdrop blur.
- Add Advanced → Power usage → Low power to stop expensive visual effects while preserving lyrics and controls.
- Fetch larger ranked search windows on scroll, deduplicate entries and stop at 60 preview results. Keep More results as a keyboard-accessible alternative.
- Make album result rows and the current album name open the album page.

# 4.12.0 — Queue controls and outside-click dismissal

- Add queue Refresh and Clear buttons, plus remove controls for individual upcoming entries.
- Use queue entry IDs to distinguish repeated songs; disable ambiguous removals and unsupported actions.
- Serialize queue changes and recover controls after failures.
- Dismiss settings, search, album details and queue panels on outside pointer clicks, preserving focus on the clicked control.

# 4.11.0 — Search and discovery

- Add a compact header search control with debounced native Spotify search, up to six results, keyboard access and full-search fallback.
- Play songs and add them to the queue from search results and album tracklists.
- Link credited artist names to their Spotify pages, with name-search fallback when an artist URI is missing.
- Guard against late search responses after another query or closing the panel; show recoverable playback/queue/search errors.

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
