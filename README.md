# EasyPhotoPrint

EasyPhotoPrint is a lightweight modern photo layout and print desktop app, inspired by classic tools such as PhotoPrint.

## Downloads

- [Latest releases](https://github.com/bitflip55/EasyPhotoPrint/releases)
- [Linux `.deb` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_amd64.deb)
- [Linux `.rpm` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint-0.2.2-1.x86_64.rpm)
- [Windows `.msi` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_x64_en-US.msi)
- [macOS `.dmg` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_aarch64.dmg)

Mainline release artifacts are planned as:

- Linux `.deb`
- Linux `.rpm`
- Windows `.msi`
- macOS `.dmg` for Apple Silicon (`arm64`) currently

Current channel:

- `main`: stable releases
- `develop`: active development branch with build artifacts for Linux, Windows and macOS

## Install On Linux

Direct download:

- [EasyPhotoPrint_0.2.2_amd64.deb](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_amd64.deb)

Install with `apt`:

```bash
wget "https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_amd64.deb"
sudo apt install "./EasyPhotoPrint_0.2.2_amd64.deb"
```

Start the app:

```bash
easy-photo-print
```

## Install On Fedora

Direct download:

- [EasyPhotoPrint-0.2.2-1.x86_64.rpm](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint-0.2.2-1.x86_64.rpm)

Install with `dnf`:

```bash
wget "https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint-0.2.2-1.x86_64.rpm"
sudo dnf install "./EasyPhotoPrint-0.2.2-1.x86_64.rpm"
```

Start the app:

```bash
easy-photo-print
```

## Install On Windows

Direct download:

- [EasyPhotoPrint_0.2.2_x64_en-US.msi](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_x64_en-US.msi)

Install steps:

1. Download the `.msi` file.
2. Double-click it.
3. Follow the installer.
4. Start `EasyPhotoPrint` from the Start menu.

## Install On macOS

Direct download:

- [EasyPhotoPrint_0.2.2_aarch64.dmg](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.2.2/EasyPhotoPrint_0.2.2_aarch64.dmg)

Install steps:

1. Download the `.dmg` file.
2. Open it and drag `EasyPhotoPrint.app` to `Applications`.
3. If macOS blocks the app, run this in Terminal:

```bash
xattr -dr com.apple.quarantine /Applications/EasyPhotoPrint.app
```

4. Start `EasyPhotoPrint` from `Applications`.

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
- Linux release packages for Debian/Ubuntu and Fedora

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

Local development and Linux testing happen on your machine. Cross-platform build verification happens on GitHub Actions from `develop`.

## Build Linux Packages

```bash
npm run build:linux
```

Default release artifacts are generated under:

- `src-tauri/target/release/bundle/deb/`

## Branch And Release Flow

1. Develop and test the Linux app locally on `develop`.
2. Let GitHub Actions build Linux, Windows and macOS artifacts from `develop`.
3. Open a PR from `develop` to `main` and let CodeRabbit review it.
4. Merge into `main`.
5. Create the next version tag on `main` to publish the stable release.

## Install On Ubuntu

See [docs/INSTALL-ubuntu.md](docs/INSTALL-ubuntu.md).

## Release Checklist

See [docs/RELEASE.md](docs/RELEASE.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
