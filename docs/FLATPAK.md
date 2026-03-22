# Flatpak

## Scope

This project ships a Flatpak manifest for local testing and later Flathub submission.

- App name: `EasyPhotoPrint`
- App ID: `net.iot55.easyphotoprint`
- Current target architecture: `x86_64`

## Host Requirements

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y flatpak flatpak-builder
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

On Fedora:

```bash
sudo dnf install -y flatpak flatpak-builder
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

## Refresh Offline Dependency Inputs

The Flatpak build uses generated npm sources and vendored Cargo crates.

```bash
python3 -m venv /tmp/flatpak-nodegen
/tmp/flatpak-nodegen/bin/pip install flatpak-node-generator
FLATPAK_NODE_GENERATOR=/tmp/flatpak-nodegen/bin/flatpak-node-generator ./scripts/prepare-flatpak-node-sources.sh
./scripts/prepare-flatpak-rust-vendor.sh
```

Or run both:

```bash
python3 -m venv /tmp/flatpak-nodegen
/tmp/flatpak-nodegen/bin/pip install flatpak-node-generator
FLATPAK_NODE_GENERATOR=/tmp/flatpak-nodegen/bin/flatpak-node-generator ./scripts/prepare-flatpak-sources.sh
```

## Build Locally

```bash
flatpak-builder --user --install --force-clean --install-deps-from=flathub flatpak-build net.iot55.easyphotoprint.yml
```

## Run

```bash
flatpak run net.iot55.easyphotoprint
```

If the app fails on some Wayland/GBM setups with a message like `Failed to create GBM buffer`, the manifest already forces:

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1
```

The `colorreload-gtk-module` and `window-decorations-gtk-module` warnings are host-theme warnings and are usually harmless.

## Rebuild Fast

```bash
flatpak-builder --user --force-clean flatpak-build net.iot55.easyphotoprint.yml
flatpak-builder --user --run flatpak-build net.iot55.easyphotoprint.yml easy-photo-print
```

## What To Test

1. Open images through the in-app file picker.
2. Save a PDF through the save dialog.
3. Open the print-ready PDF through `Open print-ready PDF (Print with Options)`.
4. Confirm that `Quick print` is disabled in the Flatpak build.
5. External release links.

## Known Flatpak-Specific Checks

- The in-app file open/save flow is portal-friendly through the Tauri dialog plugin.
- `Quick print` is intentionally disabled in the Flatpak build, because the sandbox does not provide the `lp` client tool and a direct host print path would be less portal-friendly.
- `Open print-ready PDF (Print with Options)` and external links rely on Linux openers and should be verified inside the sandbox.
- Startup image paths passed on the command line still need real Flatpak validation, because sandboxed file access may differ from the regular desktop package behavior.
- The manifest forces `WEBKIT_DISABLE_DMABUF_RENDERER=1` to avoid WebKitGTK GBM buffer failures seen on some Wayland drivers.
