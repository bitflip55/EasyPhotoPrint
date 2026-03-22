#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GENERATOR_BIN="${FLATPAK_NODE_GENERATOR:-flatpak-node-generator}"

mkdir -p "${ROOT_DIR}/flatpak"
"${GENERATOR_BIN}" npm "${ROOT_DIR}/package-lock.json" -o "${ROOT_DIR}/flatpak/npm-sources.json"
