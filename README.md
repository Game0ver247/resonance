# Resonance — archived v1 snapshot

This is the earliest saved snapshot currently available, originally saved October 25, 2026 (Spotify extension source revision 2.3). It is being committed as an archive today; it does not reconstruct the earlier development commits.

The current supported version remains on the repository's `main` branch. This archive contains the early Spotify extension, its tests, and the original native macOS app and audio bridge source. Compiled apps and the personal work log are omitted. Documentation paths have been generalized; application source is preserved.

## Contents

- `Spotify-Customization/`: Spicetify extension and its original scripts, plus audio bridge experiment source.
- `Resonance/`: original native Mac app source and build script, predating the Spicetify interface.
- `tests/`: original extension and lyrics regression checks.
- `SHA256.json`: checksums for the archived source files.

This version targets macOS. Its original scripts assume an existing Spicetify setup and may use Homebrew-specific paths. They are retained for historical reference; use `main` for current installation instructions and Linux/Windows support.

Run the original JavaScript checks from this folder with `node tests/check-extension.cjs` and `node tests/check-lyrics.cjs`.
