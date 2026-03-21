# Changelog

All notable changes to this project will be documented in this file.

## 0.2.0-beta.3 - 2026-03-21

- Introduced the new branch model: `develop` for fast integration and `main` for stable beta releases.
- Added pinned GitHub Actions workflows: fast Linux `.deb` CI on `develop`, and tag-based Linux/Windows/macOS publishing on `main`.
- Documented current release-channel behavior and ARM-only macOS release support.
- Switched the internal app/package version to an MSI-compatible numeric prerelease scheme for cross-platform beta publishing.
- Added PR-to-main full-platform verification so cross-platform issues are caught before tagging a beta release.

## 0.1.24 - 2026-03-21

- Switched the image reorder drag overlay to `@dnd-kit/modifiers` `snapCenterToCursor` for a cleaner, more predictable cursor anchor.

## 0.1.23 - 2026-03-21

- Moved the image reorder drag overlay offset into a real `dnd-kit` overlay modifier so the grabbed card tracks the mouse pointer more accurately.

## 0.1.22 - 2026-03-21

- Adjusted the image reorder drag overlay offset so the grabbed item tracks closer to the mouse pointer.

## 0.1.21 - 2026-03-21

- Fixed `dnd-kit` image reordering to use direct index-based moves in the reducer, matching the sortable list semantics and avoiding erratic reorder results.

## 0.1.20 - 2026-03-21

- Replaced the custom image reordering implementation with a `dnd-kit` sortable list and drag overlay for more reliable, smoother reordering in the React/Tauri UI.

## 0.1.19 - 2026-03-21

- Added live in-list reorder preview while dragging, so image entries visibly shift before drop.

## 0.1.18 - 2026-03-21

- Improved image reordering feedback with a floating drag preview under the cursor and clearer drop target highlighting.

## 0.1.17 - 2026-03-21

- Replaced HTML5 drag reordering with a pointer-based reorder handle for more reliable image reordering in the desktop app.

## 0.1.16 - 2026-03-21

- Added drag reordering in the image list and fixed the interaction between internal reordering drags and app-wide file drop handling.

## 0.1.15 - 2026-03-21

- Fixed desktop file drag and drop by listening to native Tauri window drag-drop events in addition to the webview drop handlers.

## 0.1.14 - 2026-03-21

- Added drag and drop image import across the app window with a visual drop overlay.

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
