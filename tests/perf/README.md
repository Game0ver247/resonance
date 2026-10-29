# Optional browser performance measurements

Requires Node 22+ (global WebSocket/fetch) and Google Chrome on macOS. Does not run with the normal test suite. No Spotify account or credentials needed; all playback and network responses are fixtures.

```sh
node tests/perf/measure-browser.cjs --seconds=10 --repeat=3 --out=/tmp/resonance-perf.json
node tests/perf/measure-browser.cjs --requests
ONLY=paused-open node tests/perf/measure-browser.cjs --seconds=10 --repeat=3
```

Set CHROME to a different Chromium executable if needed. Pass an alternative bundle path to compare builds. Interleave baseline and candidate runs on the same machine to reduce thermal/load drift. Results include all Chrome processes and headless overhead; they do not measure real Spotify CPU, battery, heat or isolated GPU cost. Keep generated profiles/results outside the repository.
