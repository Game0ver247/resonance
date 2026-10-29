# Genuine timed lyrics preview

Approved direction: Better Lyrics TTML first, LRCLIB genuine word timing fallback, existing line timing when unavailable. Match recording metadata/duration and validate timestamps. Never invent timing. Keep optional word highlighting, honor low-power/reduced-motion and lyric offset, handle seeks/pause. Preview on Mac first.

1. Verify provider payloads/access with a small public-track sample; report coverage and blockers honestly.
2. Write red tests for timing validation, provider matching/stale responses and active-word progress. Parse XML with native DOMParser, treating text as text, not HTML. Parse Lyricsfile with a bounded safe YAML parser if records supply it.
3. Show existing Spotify line lyrics promptly; enrich only with validated fine timing. One bounded lookup per provider/track, cache and respect rate-limit backoff; no audio processing or new frame loop.
4. Render fine-timed spans in single and expanded views, update only current line, restore prior active line on seek. Keep translations intact and keyword emphasis separate from timing.
5. Full JS/Python suites, actual browser parsing/render checks and small live-provider coverage test; install Mac preview, publish notes with manual test guidance. Stable main/Homebrew remain unchanged until preview accepted.
