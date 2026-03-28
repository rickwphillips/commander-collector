#!/bin/bash
# Start local dev servers
# Usage:
#   ./start-dev.sh          — starts PHP + core (port 3001)
#   ./start-dev.sh all      — starts PHP + core + decks + rules-guru
#   ./start-dev.sh decks    — starts PHP + decks only (port 3002)
#   ./start-dev.sh guru     — starts PHP + rules-guru only (port 3003)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
MODE="${1:-core}"

echo "Starting MySQL..."
brew services start mysql
echo "Waiting for MySQL..."
sleep 2

echo "Starting PHP server on port 8081..."
cd "$PROJECT_DIR/apps/core/app"
php -S localhost:8081 -t "$PROJECT_DIR/apps/core/app" > /tmp/php-server.log 2>&1 &
PHP_PID=$!
echo "PHP server PID: $PHP_PID"

sleep 1

if [ "$MODE" = "all" ] || [ "$MODE" = "core" ] || [ "$MODE" = "" ]; then
  echo "Starting apps/core on port 3001..."
  cd "$PROJECT_DIR/apps/core"
  npm run dev > /tmp/nextjs-core.log 2>&1 &
  echo "apps/core PID: $!"
fi

if [ "$MODE" = "all" ] || [ "$MODE" = "decks" ]; then
  echo "Starting apps/decks on port 3002..."
  cd "$PROJECT_DIR/apps/decks"
  npm run dev > /tmp/nextjs-decks.log 2>&1 &
  echo "apps/decks PID: $!"
fi

if [ "$MODE" = "all" ] || [ "$MODE" = "guru" ]; then
  echo "Starting apps/rules-guru on port 3003..."
  cd "$PROJECT_DIR/apps/rules-guru"
  npm run dev > /tmp/nextjs-guru.log 2>&1 &
  echo "apps/rules-guru PID: $!"
fi

sleep 3
echo ""
echo "✓ Servers started!"
echo "  PHP API:     http://localhost:8081/php-api/"
[ "$MODE" = "all" ] || [ "$MODE" = "core" ]  && echo "  Core:        http://localhost:3001"
[ "$MODE" = "all" ] || [ "$MODE" = "decks" ] && echo "  Decks:       http://localhost:3002"
[ "$MODE" = "all" ] || [ "$MODE" = "guru" ]  && echo "  Rules Guru:  http://localhost:3003"
echo ""
echo "Logs: tail -f /tmp/php-server.log /tmp/nextjs-*.log"
echo "Stop: ./scripts/stop-dev.sh"
