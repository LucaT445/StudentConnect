#!/usr/bin/env bash
set -euo pipefail
setup_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$setup_dir/../.." && pwd)"
cd "$repo_root/application"
export PORT=3001 HOST=127.0.0.1 BROWSER=none
export NODE_OPTIONS="${NODE_OPTIONS:-} --require=$setup_dir/dev-host.cjs"
exec npm start
