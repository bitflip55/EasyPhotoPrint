#!/usr/bin/env bash

set -u

failures=0

check_command() {
  local command_name="$1"

  if command -v "$command_name" >/dev/null 2>&1; then
    echo "[ok] command available: $command_name"
  else
    echo "[missing] command not found: $command_name"
    failures=$((failures + 1))
  fi
}

check_pkg_config() {
  local package_name="$1"

  if pkg-config --exists "$package_name"; then
    local version
    version="$(pkg-config --modversion "$package_name")"
    echo "[ok] pkg-config package available: $package_name ($version)"
  else
    echo "[missing] pkg-config package missing: $package_name"
    failures=$((failures + 1))
  fi
}

echo "Easy Photo Print doctor"
echo

check_command node
check_command npm
check_command cargo
check_command rustc
check_command pkg-config

if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "process.versions.node.split('.')[0]")"
  node_minor="$(node -p "process.versions.node.split('.')[1]")"

  if [ "$node_major" -gt 20 ] || { [ "$node_major" -eq 20 ] && [ "$node_minor" -ge 19 ]; }; then
    echo "[ok] node version is compatible with Vite 8: $(node -v)"
  else
    echo "[missing] node version is too old for Vite 8: $(node -v)"
    echo "          required: >=20.19.0 or >=22.12.0"
    failures=$((failures + 1))
  fi
fi

if command -v pkg-config >/dev/null 2>&1; then
  check_pkg_config webkit2gtk-4.1
  check_pkg_config javascriptcoregtk-4.1
  check_pkg_config libsoup-3.0
fi

echo

if [ "$failures" -eq 0 ]; then
  echo "Doctor check passed."
  exit 0
fi

echo "Doctor check failed with $failures issue(s)."
exit 1
