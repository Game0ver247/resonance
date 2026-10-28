# Resonance inside Spotify

Installed with Homebrew Spicetify 2.46.3 for Spotify 1.3.6 on this Mac.

## Use

- Click **Resonance** near the top-right of Spotify to open the listening view.
- **Fullscreen** expands the listening view.
- **Back to Spotify** or **Escape** returns to browsing.
- Previous, play/pause, and next operate Spotify’s existing playback controls.
- The view displays album art, title, artist, album, and progress.
- Waves are ambient animation, not audio-reactive analysis. They stop moving when playback is paused and respect Reduce Motion.

The extension does not request Spotify credentials, capture audio, or contact a lyrics provider. Artwork comes from the track metadata already available in Spotify. No additional external service is required for the view.

## Installed files

- Extension source: `resonanceDisplay.js` in this folder.
- Installed extension: `~/.config/spicetify/Extensions/resonanceDisplay.js`
- Spicetify configuration: `~/.config/spicetify/config-xpui.ini`
- Spicetify original-file backup: `~/.config/spicetify/Backup`

Only the Resonance display extension is enabled. Theme color replacement, Home customization, and experimental-feature helpers are disabled.

## Restore original Spotify

Run **Restore Spotify.command** in this folder, or run:

```
/opt/homebrew/bin/spicetify restore
```

This restores original Spotify interface files while retaining the Spicetify configuration and extension source.

## After Spotify updates

Spotify updates can replace customizations. Run **Reapply Customization.command** to back up the new Spotify version and reapply. If compatibility fails, restore Spotify and update Spicetify through Homebrew before trying again.

```
/opt/homebrew/bin/brew upgrade spicetify-cli
/opt/homebrew/bin/spicetify backup apply
```

## Verification

Passed JavaScript syntax validation. Verified live in the Spotify desktop app: launch button, artwork view, title/artist/album, progress updates, next track, previous track, and fullscreen entry. Playback was on a Spotify Connect device during control verification. Future Spotify-version compatibility is not implied by these checks.

The Spotify original files were backed up before applying changes. Developer tools were enabled for startup diagnostics; no remote debugging port was enabled.

## October 25 update — heart button and helper removed

A heart next to the playback controls adds the current track directly to Liked Songs. A filled heart means it is saved. Clicking a filled heart removes the track from Liked Songs (updated in version 1.4). Save failures remain retryable. The saved state is checked when a track changes or the listening view opens.

Playback icons now use crisp vector graphics. Waves retain a subtle ambient motion and are explicitly not audio-reactive. The installed extension makes no audio-helper connection and needs no capture permission or extra window.

An experimental local audio bridge was built while investigating audio response. Capture was initially active but produced silence; a revised capture setup encountered macOS permission errors. At the user’s request, this approach was abandoned. Its source and local app remain under `AudioBridge/` for historical reference, but are not needed or launched by the installed extension. No login item or background launch agent was installed.

Verified: JavaScript syntax, mocked save success/failure, duplicate-save protection, saved-state display, track changes, finite ambient canvas output, and absence of audio connections. The heart is visible in Spotify. Live save behavior still needs a user-selected track to be saved; no arbitrary track was added just for testing.

## Current version 1.4 — anchored artwork, single-line lyrics, shuffle

- Album artwork now occupies a fixed grid column; song-title length no longer changes its position or size. Long titles are limited to three lines.
- The Lyrics button shows/hides one lyric line. Words highlight individually as playback advances. The lyric area retains its space when hidden so the cover stays anchored.
- Spotify’s existing lyrics service is tried first through Spicetify; LRCLIB is a fallback. Spotify session credentials are handled by its existing resolver and are not extracted or sent to other providers. LRCLIB receives title, artist, album, and duration.
- Real word timing is used for Spotify syllable data or enhanced LRC word tags. Line-only data gets proportional word timing, explicitly labelled **Estimated word timing**. This is approximate and cannot guarantee alignment with each sung word. The live song tested supplied line timing, not word timestamps.
- Pauses/seeks use Spotify’s playback clock. Blank lines and gaps show a music note. Missing synced lyrics show a message rather than fabricated lyrics.
- The heart is now a true toggle: click to save; click a filled heart to remove the track from Liked Songs.
- A shuffle button shows Spotify’s current state and changes it through Spicetify. It is disabled when Spotify reports shuffle unavailable.
- The subtle waves remain ambient. No audio helper, capture permission, or additional window is needed.

### Source and build

`display-ui.js` contains the UI/provider integration; `lyrics-engine.js` contains the timing parsers and active-word selection. Run `build-extension.command` to combine them into the standalone installable `resonanceDisplay.js`. Copy the generated file to the installed Extensions directory, then run `spicetify apply`.

### Verification

A browser layout regression test confirmed identical cover x/y/width/height for short and very long titles. Parser tests cover genuine word timestamps, syllable-to-whole-word grouping, estimated timing, seeking, and instrumental gaps. Mocked UI tests cover save/remove calls for the exact track, errors, shuffle on/off, and the existing controls. In Spotify, the lyric line, word highlighting, fixed cover layout, shuffle state, and heart toggle control were visibly present. An actual library save/removal was not performed on an arbitrary song as a test.

## Version 1.5 — smoother single-line lyrics

Word-by-word color highlighting is removed. Lyrics now render as one uniformly colored line in the Mac system font (`-apple-system` / SF Pro Display), with a heavier weight and tighter spacing inspired by Apple Music. New lines fade out over 130 ms and fade/slide in over 280 ms; Reduce Motion uses an immediate text change. The source name remains, but word/estimated-timing labels are removed.

Successful Added/Removed from Liked Songs confirmations now clear after 2.4 seconds. Error messages remain visible. Mocked tests cover single-text rendering, transition sequencing and confirmation expiry, in addition to save/remove and shuffle. Verified the updated appearance in Spotify. Layout, heart toggling, shuffle and ambient waves remain in place.


### Progress seeking and Up next — version 1.6
- Progress bar now supports clicking, dragging, and keyboard arrows with an accessible position label and a 24px hit area around the subtle 4px track.
- Drag preview is protected from polling; a track change cancels the pending seek. Seek values use integer milliseconds.
- Shifted the title/artist/album group slightly right while retaining the fixed artwork grid.
- A subtle Up next card appears in the last 20 seconds using Spotify’s queued track metadata, hides when seeking away, and indicates repeat-one playback.
- Validation: mocked forward/back seeking, drag/polling, track-change guard, preview threshold, and prior regression checks passed. Live Spotify confirmed seeking updates native playback and the preview displays the actual next queued track. Returned the paused song to its original 1:17 position.


### Balanced details and full artist credits — version 1.7
- Centered title, artist credits, album, and kicker within the right-hand column; artwork remains anchored.
- Show all credited artists from Spotify’s structured artist list or numbered artist metadata, in order without duplicates. Preserve Spotify’s title including any feat./with text; do not invent featured roles where metadata only supplies names. Up next uses the same credits formatter.
- Validation: artist ordering/deduplication and existing extension regression checks passed. Live visual check confirmed centered details and “Drake, Rihanna” on Take Care.


### Queue, repeat, and fullscreen auto-hide — version 1.8
- Queue button opens a subtle drawer with the next five songs and full artist credits, refreshed while open.
- Repeat cycles off → all → one, with active styling and a one-song indicator. End-of-song preview respects repeat one.
- Fullscreen controls fade after three seconds while playing, return on pointer/keyboard activity, and remain visible for queue viewing, seeking, keyboard focus, or paused playback. Layout remains reserved so artwork does not shift.
- Volume control removed per the user's follow-up. No sleep timer added.
- Validation: mocked queue, repeat cycle, idle/wake/fullscreen guards and existing regression checks pass; live Spotify verified five queued songs, repeat all/one and absence of the custom volume control. Applied through Spicetify.


### Playback source and header spacing — version 1.9
- Added a discreet top-right playback-context line above the action buttons, displaying source type and available name. Reads the active Spotify context, with exact-context link matching as a name fallback; updates when context changes.
- Lowered the header to clear macOS window controls, including compact-window spacing; repositioned the queue drawer below it.
- Regression checks passed. Live Spotify verified “PLAYING FROM Playlist · Drizzy drake rnb” and clear spacing above the Resonance brand. Applied through Spicetify.


### Clickable and expanded lyrics — version 2.0
- Current synced lyric is a keyboard-accessible button that seeks to the line start. Expanded lyrics offers five nearby lines beside the artwork, with the current line brighter; each line seeks independently.
- Expand/Collapse lyrics preserves artwork positioning and returns to the default song details. Hiding lyrics also collapses expanded mode. The duplicate single-line lyric is hidden in expanded mode while its layout space stays reserved.
- Track identity is captured on each lyric button so stale lyrics cannot seek a different song. Non-lyric loading/instrumental messages cannot be clicked.
- Validation: synthetic provider tests cover nearby lines, current-line selection, exact seek timestamp, stale-track protection, collapse, and existing regression checks. Live Spotify verified the expanded layout and timestamp-labeled lyric buttons. Applied through Spicetify.


### Expanded lyric scrolling and song summary — version 2.1
- Expanded mode replaces the lower single-line lyric with title, full artists, and album in the same reserved area. Collapse returns to single-line lyrics.
- Expanded lyrics retain a continuous list of clickable lines instead of rebuilding a five-line window. Active lines smoothly scroll to center; surrounding lines fade at viewport edges. Initial loading and reduced-motion use immediate positioning.
- Regression checks cover persistent line elements, smooth scrolling after a line change, summary visibility, seeking, and collapse. Live Spotify verified centered active lyrics and the lower song details. Applied through Spicetify.


### Accent themes and subtle transparency — version 2.2
- Click the Resonance brand to reveal five accent swatches: Sage, Sky, Lavender, Rose, and Amber. Selection is saved locally and updates controls, progress, accent labels, focus outlines, and ambient waves.
- Main backdrop uses 96% opacity with background blur for a very slight increase in transparency while keeping text readable.
- Theme menu supports keyboard buttons and selected-state labels, dismisses on outside pointer activity, and keeps fullscreen controls awake while open.
- Regression checks passed including theme selection and invalid stored-name fallback. Live Spotify verified the swatches and Sky accent across the interface. Applied through Spicetify.


### v1 saved release — status fade
- Liked/unliked confirmation stays visible for 2.4 seconds, then fades over 450ms before clearing. New status messages cancel stale fades. Reduced-motion preference skips animation.
- Regression checks cover fade duration, clear-on-completion, and replacement-message protection. Installed extension is source revision 2.3; the full saved product release is named Resonance v1.
