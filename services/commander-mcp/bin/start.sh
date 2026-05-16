#!/bin/bash
# Start the Commander MCP HTTP server.
# Idempotent: if already running, exits successfully. Designed to be called by
# bin/keepalive.sh and by cron @reboot.
#
# On startup failure (bind error, immediate crash), writes a timestamp to
# .startup-failed-at so keepalive.sh can back off instead of retrying every
# minute and flooding the log.

set -e
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$PROJECT_DIR/run.pid"
FAIL_MARKER="$PROJECT_DIR/.startup-failed-at"
mkdir -p "$LOG_DIR"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "[start] already running (pid $(cat "$PID_FILE"))"
    exit 0
fi

cd "$PROJECT_DIR"
nohup "$PROJECT_DIR/.venv/bin/python" -m commander_mcp.server --http \
    >> "$LOG_DIR/server.log" 2>&1 &
echo $! > "$PID_FILE"
sleep 2
if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    rm -f "$FAIL_MARKER"
    echo "[start] launched pid $(cat "$PID_FILE")"
else
    date +%s > "$FAIL_MARKER"
    echo "[start] FAILED, process died immediately; see $LOG_DIR/server.log" >&2
    rm -f "$PID_FILE"
    exit 1
fi
