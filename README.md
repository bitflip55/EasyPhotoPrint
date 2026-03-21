# EasyPhotoPrint

EasyPhotoPrint is a lightweight modern photo layout and print app for Linux, inspired by classic tools such as PhotoPrint.

## Downloads

- [Latest releases](https://github.com/bitflip55/EasyPhotoPrint/releases)
- [Ubuntu `.deb` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.9/EasyPhotoPrint.0.1.9.amd64.deb)
- [Linux `.rpm` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.9/EasyPhotoPrint.0.1.9.x86_64.rpm)

## Typical Use

EasyPhotoPrint is built for simple local print workflows:

- Load one or many local photos
- Choose page format, orientation, rows, columns, margins and spacing
- Use `Fit` or `Fill` placement
- Preview the exact page layout live
- Export the same layout as a multi-page PDF
- Print through the system printer with configurable copy count

## Features

- Local image import
- Configurable page formats: `A6`, `A5`, `A4`, `A3`, `B5`, `Letter`, `Legal`, `Executive`, `Tabloid`
- Portrait and landscape
- Configurable rows, columns, margins and gaps
- `Fit` and `Fill` placement modes
- Live preview from the same layout engine used for PDF and print
- Multi-page PDF export
- System printing with configurable copy count

## Stack

- Tauri 2
- React 19
- TypeScript strict mode
- Vite 8

## Architecture

- `src/domain`: layout engine and domain types
- `src/render`: render model plus preview and PDF rendering
- `src/ui`: application UI
- `src/state`: local state and persistence
- `src-tauri`: Linux desktop shell and native commands

## Development Prerequisites

- Node.js `>=20.19.0`
- npm
- Rust toolchain
- Debian/Ubuntu packages:

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

## Development Workflow

```bash
npm run doctor
npm install
npm run tauri dev
```

## Build Linux Packages

```bash
npm run build:linux
```

Artifacts are generated under:

- `src-tauri/target/release/bundle/deb/`
- `src-tauri/target/release/bundle/rpm/`
- `src-tauri/target/release/bundle/appimage/`

## Install On Ubuntu

See [docs/INSTALL-ubuntu.md](docs/INSTALL-ubuntu.md).

## Release Checklist

See [docs/RELEASE.md](docs/RELEASE.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
