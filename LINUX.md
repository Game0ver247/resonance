# Resonance on Fedora / Linux

Resonance runs inside the Spotify desktop app through Spicetify. This is the same listening interface as the Mac and Windows versions, packaged with Linux maintenance commands. It is not a separate audio player or an RPM.

Release 4.16 includes search tabs with Spotify result ordering, album-context playback and album drawer, playlist queue, clickable Up Next, missing-lyrics artwork fallback, gradual Mesh rotation, progress-following vinyl tonearm, and reduced idle wakeups/request caching. Mesh effects respect Low power and reduced motion.

Use the `main` branch for source updates. The same archive supports configured native Spotify and Flatpak installations. No separate Flatpak build is needed.

## Set up Spotify and Spicetify

1. Install Python 3.9 or later. On Fedora: `sudo dnf install python3`.
2. Install Spotify desktop (Flatpak or a native installation), sign in, play something, and quit it once so its preferences file exists.
3. Install and configure Spicetify using its [official Linux setup instructions](https://spicetify.app/docs/getting-started). Complete the Linux-specific directory permissions step for your actual installation. Run Spicetify and Resonance as your normal desktop user.

For Flatpak, find the deployment you actually use:

```sh
flatpak info --user --show-location com.spotify.Client
# If installed system-wide instead:
flatpak info --system --show-location com.spotify.Client
```

Append `/files/extra/share/spotify` to that deployment path and use it as `spotify_path`. For example, replacing `/actual/deployment` with the returned path:

```sh
spicetify config spotify_path "/actual/deployment/files/extra/share/spotify"
spicetify config prefs_path "$HOME/.var/app/com.spotify.Client/config/spotify/prefs"
```

For native Spotify, configure the directory containing the `spotify` executable and `Apps` directory. Native preferences usually live at `$HOME/.config/spotify/prefs`. Follow Spicetify's installation-specific instructions rather than guessing a package path. Snap and the browser player are not supported by this package.

## Install

Extract the Fedora release archive, open a terminal in the extracted folder, and run:

```sh
sh resonance.sh update
```

Spotify restarts. Open **Resonance** inside Spotify. No Node.js installation, build toolchain or audio capture helper is needed.

## Update, check and uninstall

```sh
sh resonance.sh check
sh resonance.sh check --json
sh resonance.sh update --dry-run
sh resonance.sh update
sh resonance.sh uninstall
```

`update` installs the source in this folder. Download a newer Linux release or pull main first to upgrade Resonance. From an existing clean Git checkout:

```sh
git fetch origin
git switch main
git pull --ff-only
sh resonance.sh update
```

Commit or save any local edits before switching branches. Recovery copies live in your Spicetify config directory under `Resonance/backups`. Uninstall preserves your source files and other extensions.

After a Spotify/Flatpak update, update Spicetify if needed, recheck its configured path and write permissions, then run `update` again. The checker detects mismatched Spotify backups, missing injection and file drift; it cannot verify playback APIs or live lyrics.

Linux version detection queries the configured native binary with `--version`. For Flatpak it matches that configured path to the user or system deployment, then queries Spotify inside that runtime. An unreadable version blocks an update instead of trusting an old backup. Custom named Flatpak installations are not automatically resolved; use a standard user/system deployment.

## Verification scope

Automated tests cover maintenance lifecycle, version detection, Flatpak deployment selection, JavaScript regressions and launchers on a Fedora container plus Ubuntu, macOS and Windows. They do not exercise an interactive Fedora Spotify session. Wayland/X11 appearance and Spotify-version-specific API behavior still need a live desktop check.
