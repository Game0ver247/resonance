# Resonance maintenance

On macOS, run these from this folder or double-click the matching `.command` file in Finder. On Windows, use the corresponding `.cmd` file; commands are `resonance.cmd update`, `resonance.cmd check`, and `resonance.cmd uninstall`.

```sh
./resonance.command update
./resonance.command check
./resonance.command uninstall
```

- **Update Resonance.command** rebuilds from this folder’s source and installs it into the existing Spicetify setup. It does not download project code from a remote repository. After a Spotify version change, it runs `spicetify backup apply`; otherwise it reapplies the current build. Spotify restarts.
- **Check Resonance.command** is read-only and runs on demand. It compares Spotify’s installed version with the last successful update and Spicetify backup, checks the loader/script injection, and compares installed/applied extension files. It reports whether local source differs. It cannot certify live Spotify APIs or third-party lyric/analysis services.
- **Uninstall Resonance.command** removes Resonance’s configuration entry and installed extension. It restores vanilla Spotify when Resonance is the only customization; otherwise it reapplies the other extensions/theme. It preserves the project, saved v1, and Spotify library. It does not uninstall the Spicetify CLI. If the backup is stale while Spotify is patched, it stops rather than restoring an older Spotify backup.

Before each change, recovery copies of the Spicetify configuration and installed extension are saved under the Spicetify config folder’s `Resonance/backups/`. Successful updates record a local baseline in `Resonance/install-state.json`. Project snapshots are not modified.

Preview an action without changing anything:

```sh
./resonance.command update --dry-run
./resonance.command uninstall --dry-run
./resonance.command check --json
```

Check exit codes: 0 = healthy; 1 = needs attention; 2 = command/setup failure. There is no background monitor or scheduled task.

If Spotify changes, run the updater. If Spicetify cannot apply to the new Spotify build, update Spicetify using the package manager used to install it (on macOS with Homebrew: `brew upgrade spicetify-cli`), then retry. The script reports failures and leaves its recovery copies available; it does not block Spotify updates or silently download another CLI.

Requires an existing Spicetify configuration and Python 3.9+. macOS wrappers use `/usr/bin/python3`; Windows launchers try `py -3` then `python`. Version detection reads the macOS application plist or Windows executable product-version metadata. Tests: `python -m unittest discover -s tests -p test_maintenance.py`. Windows lifecycle tests use simulated Spotify commands; native executable version reading is checked on Windows runners. Live Spotify on Windows has not been verified.

Spicetify workflow reference: https://spicetify.app/docs/getting-started/#updating
