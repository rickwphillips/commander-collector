#!/bin/bash
# Stop all local dev servers

echo "Stopping PHP server..."
pkill -f 'php -S localhost:8080' 2>/dev/null

echo "Stopping Next.js dev server..."
pkill -f 'next dev' 2>/dev/null

echo "Stopping MySQL..."
brew services stop mysql 2>/dev/null

echo "All dev servers stopped."
