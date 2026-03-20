# Easy Photo Print

Modern Linux desktop app for laying out local photos on a single A4 page and using one shared layout engine for preview, PDF export and printing.

## Stack

- Tauri 2
- React 19
- TypeScript with strict mode
- Vite 8

## Architecture Direction

- `src/domain`: domain model and layout engine
- `src/render`: renderer-neutral render model plus output-specific renderers
- `src/ui`: application shell and UI components
- `src/state`: local app state and defaults
- `src-tauri`: desktop shell, file access and print/export integration

## Milestone Status

- M1: project shell and architecture scaffold
- M2+: image import, layout engine, preview renderer, PDF and print

## Expected Local Workflow

## Local Prerequisites

- Node.js `>=20.19.0`
- npm
- Rust toolchain
- Linux packages required by Tauri WebKit runtime, for example on Debian/Ubuntu:
  - `libwebkit2gtk-4.1-dev`
  - `build-essential`
  - `curl`
  - `wget`
  - `file`
  - `libxdo-dev`
  - `libssl-dev`
  - `libayatana-appindicator3-dev`
  - `librsvg2-dev`

## Expected Local Workflow

1. `npm run doctor`
2. `npm install`
3. `npm run tauri dev`

## Current Environment Status

- The current machine is on Node `18.19.1`, which is too old for Vite 8.
- The current machine is also missing `webkit2gtk-4.1`, `javascriptcoregtk-4.1` and `libsoup-3.0` development packages required by Tauri on Linux.

## Debian/Ubuntu Example

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  curl \
  file \
  libayatana-appindicator3-dev \
  libsoup-3.0-dev \
  libssl-dev \
  libwebkit2gtk-4.1-dev \
  libxdo-dev \
  librsvg2-dev \
  wget
```

Then install a newer Node.js release, for example Node 20 LTS or newer, and rerun:

1. `npm install`
2. `npm run doctor`
3. `npm run tauri dev`

## Notes

- Layout calculations will be defined once in millimeters and reused across preview, PDF and print.
- PDF is intended to be the canonical output path for v1 printing.
