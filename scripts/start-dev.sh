#!/bin/bash
# Start all local dev servers (all in background)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Starting MySQL..."
brew services start mysql

echo "Waiting for MySQL to start..."
sleep 2

echo "Starting PHP server on port 8080..."
cd "$PROJECT_DIR/app"
php -S localhost:8080 > /tmp/php-server.log 2>&1 &
echo "PHP server PID: $!"

echo "Starting Next.js dev server..."
cd "$PROJECT_DIR"
npm run dev > /tmp/nextjs-server.log 2>&1 &
echo "Next.js PID: $!"

sleep 3
echo ""
echo "✓ All servers started!"
echo "  - PHP API:  http://localhost:8080/php-api/"
echo "  - Next.js:  http://localhost:3000"
echo ""
echo "Logs:"
echo "  - PHP:     tail -f /tmp/php-server.log"
echo "  - Next.js: tail -f /tmp/nextjs-server.log"
echo ""
echo "Run ./scripts/stop-dev.sh to stop all servers"
