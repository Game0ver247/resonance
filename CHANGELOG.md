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
