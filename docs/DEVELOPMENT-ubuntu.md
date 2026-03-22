# Ubuntu Development Setup

This document is for a fresh Ubuntu test system that should become a full EasyPhotoPrint development machine.

## Scope

After this setup, the machine should be able to:

- run the Linux desktop app locally
- build local Linux release packages
- run the repo checks
- build and install the local Flatpak test build

## 1. Clone The Repository

```bash
git clone https://github.com/bitflip55/EasyPhotoPrint.git
cd EasyPhotoPrint
git checkout develop
```

## 2. Install Host Dependencies

Run the repo setup script:

```bash
bash ./scripts/setup-ubuntu-dev.sh
```

This installs:

- desktop build dependencies for Tauri/WebKitGTK
- Flatpak and `flatpak-builder`
- `fuse3`
- Rust via `rustup` if missing

It does not install Node.js automatically. Use Node `22 LTS` or at least `20.19.0`.

## 3. Install Node Dependencies

```bash
npm install
```

## 4. Verify The Development Environment

```bash
npm run doctor
./node_modules/.bin/tsc -p tsconfig.app.json --noEmit
cargo check --manifest-path src-tauri/Cargo.toml
```

## 5. Run The App Locally

```bash
npm run tauri dev
```

## 6. Build Local Linux Packages

```bash
npm run build:linux
```

Expected package output:

- `src-tauri/target/release/bundle/deb/`
- `src-tauri/target/release/bundle/rpm/`

## 7. Prepare Flatpak Offline Inputs

The Flatpak build uses offline npm and Cargo inputs.

```bash
python3 -m venv /tmp/flatpak-nodegen
/tmp/flatpak-nodegen/bin/pip install flatpak-node-generator
FLATPAK_NODE_GENERATOR=/tmp/flatpak-nodegen/bin/flatpak-node-generator ./scripts/prepare-flatpak-sources.sh
```

This updates:

- `flatpak/npm-sources.json`
- `flatpak/cargo/config.toml`
- `flatpak/cargo/vendor/`

## 8. Build And Install The Local Flatpak

```bash
flatpak-builder --user --install --force-clean flatpak-build net.iot55.easyphotoprint.yml
```

Run it:

```bash
flatpak run net.iot55.easyphotoprint
```

## 9. Recommended Smoke Tests

Desktop package path:

1. Start the app.
2. Import local images.
3. Change rows, columns, margins and gaps.
4. Export a PDF.
5. Open the print flow.
6. Test drag reordering in the image list.

Flatpak path:

1. Start the Flatpak app.
2. Import images through the file picker.
3. Export a PDF.
4. Test the print dialog.
5. Test drag and drop.

## 10. Known Flatpak Caveat

Flatpak on mixed desktop stacks can depend heavily on a working `xdg-desktop-portal` backend. On Pop!_OS with KDE Plasma, portal-backed print and drag-and-drop may behave differently than on standard Ubuntu GNOME or Fedora KDE.

Use the Ubuntu test system to validate:

- print dialog behavior
- drag and drop
- file chooser behavior

before treating the Flatpak setup as release-ready.
