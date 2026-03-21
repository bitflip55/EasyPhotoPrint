# Changelog

All notable changes to this project will be documented in this file.

## 0.1.13 - 2026-03-21

- Allowed recursive read access to the user's home directory so `Open With` and startup file import can load images from folders like `Documents`.
- Reduced automated releases to Linux `.deb` only for faster iteration.

## 0.1.12 - 2026-03-21

- Retained the `Open With` fix and switched GitHub release automation to the lean artifact set: `.deb`, `.msi`, and `.dmg`.

## 0.1.11 - 2026-03-21

- Fixed startup and `Open With` image loading by reading desktop-selected files as bytes instead of relying on asset URLs for dimension detection.
- Simplified future GitHub release builds to `deb`, `msi`, and `dmg` artifacts only.

## 0.1.10 - 2026-03-21

- Fixed Linux `Open With` file handoff by bundling a desktop entry with `Exec=%F`.
- Added native macOS and Windows release automation through GitHub Actions.
- Added platform-specific application icons for macOS and Windows bundles.
- Moved the update notice from the sidebar into the top version area.

## 0.1.9 - 2026-03-21

- Renamed release artifacts to user-facing dotted filenames for better presentation when opening local packages.
- Kept the visible product name as `EasyPhotoPrint`, with MIT license metadata and Patrick Weiss as author.

## 0.1.8 - 2026-03-21

- Switched release artifact names to technical package-style filenames.
- Updated package metadata author to Patrick Weiss.

## 0.1.7 - 2026-03-21

- Changed the visible product name to `EasyPhotoPrint` for more consistent package manager presentation.
- Updated Linux metadata and UI strings to use the compact product name.

## 0.1.6 - 2026-03-21

- Added Linux AppStream metainfo metadata for better package manager presentation.
- Bundled the metainfo file into `.deb` and `.rpm` packages.

## 0.1.5 - 2026-03-21

- Added Linux file associations for common image formats.
- Added startup image import so files opened via `Open With` are loaded directly into the app.

## 0.1.4 - 2026-03-21

- Fixed the preview title so it reflects the selected page format instead of always showing `A4`.
- Added a dedicated project changelog.

## 0.1.3 - 2026-03-21

- Simplified the Ubuntu installation instructions to the normal `apt install` flow.
- Simplified the update area in the app to automatic status plus a release link.

## 0.1.2 - 2026-03-21

- Added the in-app update check against GitHub Releases.
- Refreshed release download links and installation documentation.

## 0.1.1 - 2026-03-21

- Published the first packaged Linux release.
- Added `.deb` and `.rpm` release artifacts.
