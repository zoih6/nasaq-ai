#!/usr/bin/env bash
# Runs the U2.2 Research Playwright spec against a local dev server while
# staying resilient to sandbox memory pressure: the dev server is
# health-checked before every batch and restarted automatically if the kernel
# or the platform reaped it. Chromium runs single-process inside a small JS
# heap so the whole loop fits in this box (never run `next build` here: it is
# OOM-killed).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB="$ROOT/apps/web"
PORT="${U2_E2E_PORT:-3000}"
BASE="http://127.0.0.1:$PORT"
LOG_DIR="${U2_E2E_LOG_DIR:-/tmp}"
BATCHES=(
  "walks the eight stages|resume restores"
  "shows the three warning states|a topic with no relevant sources"
  "steering regenerates|cancelled shared run"
  "axe violation|keyboard alone"
  "RTL layout|200% reflow|reduced motion keeps|forced colors keeps"
)

dev_pid=""

server_up() {
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/ar/app/research" 2>/dev/null)" = "200" ]
}

start_dev() {
  if server_up; then
    return 0
  fi
  pkill -f "[c]hrome-headless" 2>/dev/null || true
  ( cd "$WEB" && NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=560" \
      nohup npx next dev -H 127.0.0.1 -p "$PORT" >"$LOG_DIR/u2-rsh-e2e-dev.log" 2>&1 & echo $! >"$LOG_DIR/u2-rsh-e2e-dev.pid" )
  dev_pid="$(cat "$LOG_DIR/u2-rsh-e2e-dev.pid")"
  for _ in $(seq 1 40); do
    if server_up; then
      echo "[run-research-e2e] dev server ready (pid $dev_pid)"
      return 0
    fi
    sleep 2
  done
  echo "[run-research-e2e] dev server did NOT become ready; tail of $LOG_DIR/u2-rsh-e2e-dev.log:"
  tail -20 "$LOG_DIR/u2-rsh-e2e-dev.log"
  return 1
}

status=0
for batch in "${BATCHES[@]}"; do
  start_dev || exit 2
  echo "[run-research-e2e] batch: $batch"
  log="$LOG_DIR/u2-rsh-e2e-${batch//|/_}.log"
  ( cd "$WEB" && PLAYWRIGHT_LOW_MEMORY=1 PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/tmp/nasaq-playwright}" \
      npx playwright test tests/e2e/service-research.spec.ts --project=chromium \
      --reporter=list --workers=1 --retries=1 --grep "$batch" ) >"$log" 2>&1
  code=$?
  summary="$(sed -e 's/\x1b\[[0-9;]*m//g' "$log" | grep -E "^ +[0-9]+ (passed|failed|flaky)" | tr '\n' ' ')"
  echo "[run-research-e2e] batch $batch -> exit=$code ${summary:-<no summary>}"
  if [ "$code" -ne 0 ]; then
    status=1
    sed -e 's/\x1b\[[0-9;]*m//g' "$log" | grep -E "Error:|✘|failed$" | head -20
  fi
  # Give the box a moment (and the reaper no reason) before the next batch.
  pkill -f "[c]hrome-headless" 2>/dev/null || true
  sleep 2
done

exit "$status"
