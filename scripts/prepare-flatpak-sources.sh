#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"${ROOT_DIR}/scripts/prepare-flatpak-node-sources.sh"
"${ROOT_DIR}/scripts/prepare-flatpak-rust-vendor.sh"
