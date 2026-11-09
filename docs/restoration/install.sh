#!/usr/bin/env bash
set -euo pipefail
setup_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$setup_dir/../.." && pwd)"
cd "$repo_root/application"
npm ci --cache "${STUDENTCONNECT_NPM_CACHE:-/tmp/studentconnect-npm-cache}" --no-audit --no-fund
npm run build
env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH docker --host=unix:///var/run/docker.sock pull mongo@sha256:8bb4442761a63a8dda452744082cdac9644b429807eb977b42324a63cef59ca4
