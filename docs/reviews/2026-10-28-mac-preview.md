# Mac preview review — October 28, 2026

Scope: current UI, lyric engine, build pipeline, maintenance, launchers and tests; followed by review of the preview diff against the requested behavior. Two independent read-only reviews covered UI and maintenance. No new platform packages beyond Mac.

## Confirmed findings addressed

- Lyrics Off still fetched Spotify/LRCLIB on track changes. Loading is now lazy and disabled when Off.
- Hung Spotify library and mutation promises could leave controls busy indefinitely. Bounded waits release controls; ambiguous timeouts instruct users to check state before retrying.
- No enabled analysis consumer still triggered analysis downloads/preparation. Gated requests and paused detailed extraction; reused ambient feature data.
- Mac update/uninstall transactions could interleave fixed temporary files and apply/restore. A nonblocking advisory lock now covers each entire mutation transaction and releases on failure/process exit.
- Follow-up review found filtered playlist pagination could stop before later preferred matches; continuation now follows bounded provider pagination.
- Follow-up review found route-relative search asset discovery and an inherited pointer-events issue on the summary artist; corrected to root-relative discovery and an interactive button.

## Validation

- Full JavaScript regression suite passes, including missing-lyrics fallback/restoration, category bootstrap, stale search dismissal, ownership priority/fallback, later-page preferred matches, playlist playback, stalled control recovery and unused analysis loading.
- Python unittest discovery: 48 tests, passing, 2 platform skips on Mac. Includes lock contention, subprocess coverage and release after failure.
- Local Mac build and maintenance apply pass installation integrity checks.
- Live Spotify native search returned song results and playlist results including Spotify-owned mixes and the current user's playlist.
- Existing deterministic waveform workload remains 81,000 active points, 2,700 paused points and zero in Low power/hidden modes. This is a test workload, not a measurement of Spotify's overall CPU or heat.

## Limits and follow-ups

- Spotify APIs remain internal and can change. No guarantee of exhaustive library/mix discovery; search windows stop at 60. Ownership preference is applied to relevant results returned by Spotify.
- Timed-out mutations may still complete in Spotify; automatic retries would risk duplicate queue entries or toggles and are deliberately avoided.
- Long-session library-state maps are small but currently unbounded; bounding them is a future improvement. Other existing lyric, analysis and artwork caches already have limits.
- Avoid splitting/reformatting the entire legacy UI during a behavior release. Shared playback/normalization were consolidated; a larger module extraction deserves separate validation.
- Windows/Linux packaging and native QA deferred as requested. Stable main and Homebrew are unchanged.
