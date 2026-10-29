# 4.16.0-linux.1 — Fedora / Linux update

- Bring Linux packages up to the shared interface from Mac preview 5: category search in Spotify order, selected-album drawer, album-context track playback, playlist queue, missing-lyrics fallback, and optional slow Mesh color rotation.
- Include the Up Next pointer-input fix and progress-following vinyl tonearm.
- Include idle-render scheduling and safe negative-result caching; transient provider failures remain retryable. No new runtime dependency or audio-capture permission.
- Retain Linux native/Flatpak version detection, installer, health checks, backups and uninstall. The transaction lock from the Mac preview remains Mac-specific.
- Update Linux source commands to use this preview branch. Mac, Windows, main and Homebrew releases are unchanged.
- Automated verification covers Fedora container and Ubuntu; interactive Linux/Wayland/X11 Spotify testing is still outside the verified scope.

# 4.16.0-mac.5 — Progress-following vinyl tonearm

- Start the tonearm at the outer groove and slowly move inward with song progress.
- Keep the arm in place when paused, follow seeks, and reset for the next track. Unknown duration uses the outer groove.
- Reuse the existing metadata update cycle, cache unchanged transforms and use a short linear CSS transition. No new timer or animation loop; reduced motion disables the transition.
- Mac preview only; stable/Homebrew/Windows/Linux unchanged.

# 4.16.0-mac.4 — Clickable Up Next in lyrics view

- Put the Up Next button above the scrolling lyrics pane so pointer clicks reach it instead of seeking a lyric underneath.
- Verify actual browser hit testing and mouse input, in addition to the existing playback-handler regression test.
- Mac preview only; stable main, Homebrew and other platform releases unchanged.

# 4.16.0-mac.3 — Mac performance and request review

- Idle states (paused, Low power, reduced motion) wait on a ~100 ms timer between redraws instead of waking for every display frame. In a mocked-Spotify Chrome page this cut paused/Low-power CPU by about a third; no playback improvement was established. These are whole-browser mock-page comparisons, not actual Spotify CPU or battery measurements. Measured with `tests/perf/measure-browser.cjs`.
- Album background lookups no longer repeat a Wikipedia request on every track change when Wikipedia has no verified match; failed lookups still retry.
- "No lyrics" answers are remembered for 10 minutes when both sources answered definitively (not after timeouts/errors).
- A failed track-analysis request is no longer cached as "no analysis" for that track; revisiting it can retry, without a continuous retry loop.
- Treat resolved Spotify/Wikipedia error payloads and malformed provider responses as retryable failures, not confirmed missing content.
- Add regression tests for the above and an optional real-browser measurement script (not part of `npm test`).

# 4.16.0-mac.2 — Native search order and contextual playback

Mac preview only; stable main, Homebrew and Windows/Linux remain unchanged.

- Separate artist and album controls onto their own lines with clear spacing in lyrics view.
- Remove ownership filtering/reranking from search. Preserve Spotify's returned category ordering for songs, albums and playlists; keep bounded, on-demand pagination.
- Play and open the selected album in Resonance's album-details drawer from all album-name actions. The drawer no longer depends on waiting for current playback metadata to change.
- Play album tracks with the album context and Spotify's `skipTo.uri` option, letting Spotify continue the remaining album according to the user's existing shuffle/repeat settings. Do not duplicate tracks into the manual queue.
- Play a playlist and open Spotify's live queue in Resonance. Existing queued items and Spotify's queue semantics are preserved.
- Make Up Next a keyboard-accessible button that invokes Spotify's normal next-track action.
- Add Mesh color rotation: Off (default), Time (12 seconds), or Beats (32 detected beats), with eight-second crossfades through the album palette. Use the existing rendering clock; no new loops or per-frame gradient rebuilding. Skip initiation when paused, hidden, reduced motion or Low power.
- Strengthen the artwork pulse with estimated rhythm energy and a small directional shake; keep motion disabled under reduced motion/Low power. This uses track-analysis onset/beat proxies, not live bass-frequency capture.

Validation: full JavaScript regression suite, Python suite and Mac installation checks. Real-browser geometry confirms distinct title/artist/album rows with no overlap in the checked lyrics layout. Context playback arguments match the installed Spotify player interface.

# 4.16.0-mac.1 — Mac preview: discovery and lyric fallback

This preview is for macOS. Stable main, Homebrew, Windows and Linux remain on 4.15.0 until the Mac changes have been tried.

- Temporarily show artwork and song details when synced lyrics are unavailable, with a clear message. Restore the preferred lyrics layout when a track supplies lyrics; preserve the saved preference.
- Add Songs, Albums and Playlists search tabs. Fetch only the selected category, debounce typing, deduplicate results and cap previews at 60 items.
- Prefer relevant Spotify-owned mixes/playlists and current-user playlists within the returned search window. Use other creators when no preferred result is present. This is bounded search, not a complete library scan.
- Artist names in song details, the bottom summary and Album details now search inside Resonance. Playlist names play their playlist context; album names still play albums.
- Skip lyric requests when Lyrics is Off. Skip track-analysis requests when no enabled visual feature consumes them, and avoid detailed extraction while paused unless debugging.
- Add deadlines to library, shuffle, repeat, queue and playback requests so stalled Spotify promises release controls. Timeout messages distinguish unconfirmed actions from success; they do not automatically retry mutations.
- Prevent overlapping Mac update/uninstall transactions with an advisory lock.
- Consolidate context playback and category result normalization. Retain existing rendering limits and Low power behavior; add no animation loops or dependencies.

Search relies on Spotify internal APIs. Category definitions are lazily discovered from the installed local search route without executing its source. Native definitions take priority, with modal/Web API fallbacks; Spotify changes can still affect discovery. Only ownership from returned metadata is used—third-party playlists cannot be certified as official by their names.

See [code review and validation](docs/reviews/2026-10-28-mac-preview.md).

# 4.15.0 — Richer colors, opaque backgrounds and album playback

- Reveal the lyrics scrollbar only during manual wheel, touch or keyboard scrolling; hide it after a short idle delay. Hover and automatic lyric movement leave it hidden.
- Make the root background fully opaque to prevent Spotify UI showing through Artwork or Mesh.
- Use chromatic album accents with stronger saturation, and a vivid blue fallback for monochrome covers.
- Retain the dominant cover tone plus smaller distinct colorful details in an up-to-eight-color palette; place visible gradient splashes across the mesh.
- Play the full album context when clicking album names in song details, the bottom summary, Album details or search.
- Keep mesh motion transform-only and preserve Low power behavior.

# 4.14.1 — Quiet scrollbar and consistent instrumental notes

- Use matching inline music-note indicators for all instrumental rows and remove the duplicate floating notes.
- Hide the lyrics scrollbar thumb until the pane is hovered, focused or actively used.
- Keep scrollbar width stable to avoid shifting the artwork/lyrics layout; use CSS only, without polling or animation loops.

# 4.14.0 — Lyrics + artwork layout

- Replace Karaoke with a combined artwork-and-scrolling-lyrics view.
- Show title, artist and album along the bottom; use responsive stacked artwork/lyrics on narrow windows.
- Preserve existing saved Karaoke layout preferences and low-power behavior.

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
