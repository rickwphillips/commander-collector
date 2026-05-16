#!/bin/bash
# Restart Commander MCP if its process is dead or its port isn't listening.
# Designed for cron */5 * * * *.
#
# Failure backoff: if start.sh has recently failed (within FAIL_BACKOFF_SECS),
# skip retry. One bad startup costs 15 min of downtime instead of flooding the
# log with EADDRINUSE retries every cron tick.

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$PROJECT_DIR/run.pid"
FAIL_MARKER="$PROJECT_DIR/.startup-failed-at"
LOG_DIR="$PROJECT_DIR/logs"
PORT="${CMC_HTTP_PORT:-8001}"
HOST="${CMC_HTTP_HOST:-127.0.0.1}"
FAIL_BACKOFF_SECS=900   # 15 minutes
mkdir -p "$LOG_DIR"

stamp() { date '+%Y-%m-%d %H:%M:%S'; }

is_alive() {
    [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null
}

is_listening() {
    # Bash built-in TCP open; works without netstat/ss/curl on the path.
    (exec 3<>"/dev/tcp/$HOST/$PORT") 2>/dev/null && exec 3>&- 3<&-
}

if is_alive && is_listening; then
    exit 0
fi

# Back off if we recently failed to start.
if [ -f "$FAIL_MARKER" ]; then
    last=$(cat "$FAIL_MARKER" 2>/dev/null || echo 0)
    now=$(date +%s)
    age=$(( now - last ))
    if [ "$age" -lt "$FAIL_BACKOFF_SECS" ]; then
        echo "[$(stamp)] backing off; last startup failed ${age}s ago (waiting ${FAIL_BACKOFF_SECS}s)" >> "$LOG_DIR/keepalive.log"
        exit 0
    fi
fi

echo "[$(stamp)] not healthy (alive=$(is_alive && echo y || echo n) listening=$(is_listening && echo y || echo n)); restarting" >> "$LOG_DIR/keepalive.log"

if [ -f "$PID_FILE" ]; then
    kill -9 "$(cat "$PID_FILE")" 2>/dev/null
    rm -f "$PID_FILE"
fi
"$PROJECT_DIR/bin/start.sh" >> "$LOG_DIR/keepalive.log" 2>&1
