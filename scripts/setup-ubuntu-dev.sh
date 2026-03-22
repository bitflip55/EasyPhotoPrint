#!/usr/bin/env bash

set -euo pipefail

echo "EasyPhotoPrint Ubuntu development setup"
echo

if ! command -v sudo >/dev/null 2>&1; then
  echo "sudo is required on Ubuntu for package installation."
  exit 1
fi

sudo apt update
sudo apt install -y \
  build-essential \
  curl \
  file \
  flatpak \
  flatpak-builder \
  fuse3 \
  git \
  libayatana-appindicator3-dev \
  libsoup-3.0-dev \
  libssl-dev \
  libwebkit2gtk-4.1-dev \
  libxdo-dev \
  librsvg2-dev \
  pkg-config \
  wget

flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

if ! command -v rustup >/dev/null 2>&1; then
  echo
  echo "Installing rustup..."
  curl https://sh.rustup.rs -sSf | sh -s -- -y
fi

if [ -f "$HOME/.cargo/env" ]; then
  # shellcheck source=/dev/null
  . "$HOME/.cargo/env"
fi

if ! command -v cargo >/dev/null 2>&1; then
  echo "cargo is still not available after rustup installation."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo
  echo "Node.js is not installed."
  echo "Install Node 22 LTS or Node >=20.19.0, then re-run:"
  echo "  https://nodejs.org/"
  echo "  or https://github.com/nvm-sh/nvm"
  exit 1
fi

echo
echo "Host packages installed."
echo "Next steps:"
echo "  npm install"
echo "  npm run doctor"
echo "  npm run tauri dev"
echo
echo "Optional Flatpak prep:"
echo "  python3 -m venv /tmp/flatpak-nodegen"
echo "  /tmp/flatpak-nodegen/bin/pip install flatpak-node-generator"
echo "  FLATPAK_NODE_GENERATOR=/tmp/flatpak-nodegen/bin/flatpak-node-generator ./scripts/prepare-flatpak-sources.sh"
