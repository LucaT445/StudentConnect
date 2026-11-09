#!/usr/bin/env bash
set -euo pipefail
docker_local() { env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH docker --host=unix:///var/run/docker.sock "$@"; }
name=studentconnect-demo-mongo
image=mongo@sha256:8bb4442761a63a8dda452744082cdac9644b429807eb977b42324a63cef59ca4
if docker_local container inspect "$name" >/dev/null 2>&1; then
  test "$(docker_local inspect -f '{{index .Config.Labels "studentconnect.purpose"}}' "$name")" = synthetic-local-demo
  test "$(docker_local inspect -f '{{.Config.Image}}' "$name")" = "$image"
  test "$(docker_local inspect -f '{{(index (index .HostConfig.PortBindings "27017/tcp") 0).HostIp}}' "$name")" = 127.0.0.1
  docker_local start "$name" >/dev/null
else
  docker_local run -d --name "$name" --label studentconnect.purpose=synthetic-local-demo -p 127.0.0.1:27017:27017 -v studentconnect-demo-data:/data/db "$image" --bind_ip_all
fi
ready=false
for attempt in {1..30}; do
 if docker_local exec "$name" mongosh --quiet --eval 'if(db.runCommand({ping:1}).ok!==1) quit(1)' >/dev/null 2>&1; then ready=true; break; fi
 sleep 1
done
$ready || { echo 'Local MongoDB did not become ready' >&2; exit 1; }
setup_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$setup_dir/../.." && pwd)"
cd "$repo_root/application"
test -f build/index.html || npm run build
export URI=mongodb://127.0.0.1:27017/studentconnect_synthetic
export PORT=3000
exec npm run server
