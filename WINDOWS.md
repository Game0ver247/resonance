# Resonance for Windows

Release 4.16 includes the latest shared search, playback, lyrics, Mesh, vinyl tonearm and efficiency updates.

Start with the Windows section of [README.md](README.md). After installing Spotify, Spicetify and Python 3.9+, extract this entire folder and double-click **Install Resonance.cmd**.

| File | Action |
| --- | --- |
| Install Resonance.cmd | Build and install into Spotify |
| Update Resonance.cmd | Rebuild/apply the local source |
| Check Resonance.cmd | Read-only installation health check |
| Uninstall Resonance.cmd | Remove Resonance, preserving other customizations |
| build-extension.cmd | Build the extension without installing |

Command Prompt alternatives:

```bat
resonance.cmd update
resonance.cmd check
resonance.cmd uninstall
resonance.cmd update --dry-run
```

Use a normal user terminal. These tools use existing Spicetify configuration, do not download project updates, and do not modify execution policy. Keep the full folder together. Paths with spaces and Unicode names are covered by lifecycle fixtures. Recovery backups are stored beneath the Spicetify configuration directory. See [MAINTENANCE.md](MAINTENANCE.md).

GitHub CI tests Windows launchers, native executable-version reading, mocked install/update/uninstall behavior and JavaScript logic. It does not run a live Spotify session. Live Windows playback and layout still need a Windows user’s verification.
