#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "${ROOT_DIR}/flatpak/cargo"
cargo vendor \
  --manifest-path "${ROOT_DIR}/src-tauri/Cargo.toml" \
  "${ROOT_DIR}/flatpak/cargo/vendor" > "${ROOT_DIR}/flatpak/cargo/config.toml"
