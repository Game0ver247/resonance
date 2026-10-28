# Resonance

A native Mac music dashboard for the Spotify desktop app. Built locally for this Apple silicon Mac. macOS 14 or later.

## Start

1. Open `Resonance.app` (you may move the app to Applications).
2. Open Spotify and play a track.
3. Click **Connect to Spotify** and allow macOS Automation access when prompted.
4. Optionally click **Use system audio** and allow **Screen & System Audio Recording** in System Settings → Privacy & Security. You may need to quit and reopen Resonance after granting access.

The connected Spotify desktop app supplies track title, artist, album artwork, progress, and previous/play/pause/next controls. No Spotify developer account, API key, or web login is required. This version connects to Spotify running on this Mac; playback on a remote Spotify Connect device may not be reflected reliably.

## Visuals

- **Waves / Spectrum** switches the visualizer.
- Color dots select sage, iris, or amber.
- The slider adjusts visual intensity.
- The bottom-right focus button hides settings.
- The top-right button toggles fullscreen.
- Album artwork opens the current track in Spotify.

**Ambient mode is independent animation, not beat detection.** System-audio mode analyzes live audio output from the Mac and reacts to it, including sound from other apps. It works with headphones. Silence gives a flat visualizer. The app does not record or upload audio or screen frames. The system capture framework supplies a minimal video stream alongside audio; video frames are discarded. Protected content may not be capturable.

## Permissions and troubleshooting

If Spotify connection is denied, enable Resonance under Privacy & Security → Automation, then reconnect. If Spotify is closed, open it and start a track first. Track details refresh approximately every 1.5 seconds.

If system audio fails, verify Screen & System Audio Recording permission, quit and reopen Resonance, and retry. Ambient mode remains usable without that permission.

This is a locally built, ad-hoc signed app, not a notarized distribution. Keep it on this Mac. Source is included for inspection and rebuilding.

## Rebuild

Run `./build.command` from this folder with Apple's command-line developer tools installed. The script builds and ad-hoc signs `Resonance.app`. Rebuilding may require granting permissions again.

## Verification

Verified: successful compilation, ad-hoc signature, bundle validation, app launch, rendered interface, and live Spotify connection with track metadata and progress. System-audio capture and playback commands have not been exercised; system audio requires your macOS permission grant.

## Synced lyrics

The **Lyrics** button in the top bar switches between the lyrics panel and the full visualizer. Lyrics load automatically for the current track from [LRCLIB](https://lrclib.net/docs), using track title, artist, album, and duration. These metadata are sent to LRCLIB; no Spotify credentials or audio are sent. Availability and timing depend on the community database.

The current line is highlighted, with surrounding lines shown for context. Playback position is interpolated between Spotify updates and corrected on the next poll after a pause or seek (up to approximately 1.5 seconds). Use **− / +** for quarter-second timing adjustments; click the offset to reset it. Positive offsets show lyrics earlier. Instrumental recordings, missing lyrics, plain-text-only lyrics, and network failures have separate fallback states. Successful lookups are cached in memory until the app closes.

Verified the updated app against a live Spotify track: timestamped lyrics loaded, highlighted lines advanced with playback, and the album artwork and controls fit the window. Parser checks cover multiple timestamps, offsets, instrumental gaps, timestamp boundaries, backward seeks, invalid timestamps, and empty input.
