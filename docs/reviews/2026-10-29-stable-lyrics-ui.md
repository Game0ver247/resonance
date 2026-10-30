# Stable lyrics UI review — 4.16.2

Scope: changes from main 6c5708049222643f1b12fcf667154ea8ccbd9659. User requested stable UI polish on main and shared Windows/Linux packages; timed words remain experimental.

## Standards / platform review

No blocking standards or platform integration findings. Shared UI follows the existing settings pattern and adds no platform-specific API, polling loop or provider request. Windows/Ubuntu/Fedora launchers use the same generated bundle. Version and platform docs updated for release.

## Spec review

One confirmed visibility bug, now fixed: existing CSS hid the lyrics note whenever artwork layouts hid single-line lyrics. This overrode source-info On and could hide the missing-lyrics notice. Removed that blanket rule; ordinary hidden state controls the note. Re-review found no remaining requirement issues.

## Verification

- Full JavaScript regression suite, including provider-only source Off/On/persistence and retained layout settings.
- Python suite: 48 tests, two native Windows skips locally on Mac. Native platform checks also run in GitHub CI.
- Browser regression `tests/preview/check-lyric-source.js`: failed before CSS fix; passed after. Checks computed visibility of the missing-lyrics notice and source info with single-line Off, default hidden provider, and absent inline shortcut.
- Linux shell syntax and help entry point; reproducible extension build; clean diff whitespace check.
- No new timed-word provider in stable. No interactive Windows/Linux Spotify session was available for this review.

To repeat browser regression, serve repository root with `python3 -m http.server 8766 --bind 127.0.0.1`, open `/tests/preview/index.html` and evaluate the browser regression script. Fixtures use authored lyrics and mocked Spotify metadata, not a logged-in account.
