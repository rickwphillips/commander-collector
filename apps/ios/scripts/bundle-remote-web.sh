#!/bin/bash
# Copies the web app's static export (apps/core/out) into the iPad app as the
# RemoteWeb bundle: the player panel page phones open from the table's own web
# server, plus the chunks and assets it loads. Run after `npm run build` in
# apps/core (or pass --build to run it here), then `xcodegen generate`.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CORE="$HERE/../../core"
OUT="$CORE/out"
DEST="$HERE/../CommanderGameManager/App/Resources/RemoteWeb"

if [ "${1:-}" = "--build" ]; then
  (cd "$CORE" && npm run build)
fi
if [ ! -f "$OUT/game-manager/remote/index.html" ]; then
  echo "No static export at $OUT; run 'npm run build' in apps/core first (or pass --build)." >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST/game-manager/remote" "$DEST/_next"
cp "$OUT/game-manager/remote/index.html" "$DEST/game-manager/remote/"
cp -R "$OUT/_next/static" "$DEST/_next/static"
for f in symbols audio dungeon.jpg card-not-found.webp card-not-found-small.webp favicon.ico; do
  [ -e "$OUT/$f" ] && cp -R "$OUT/$f" "$DEST/"
done
echo "RemoteWeb: $(du -sh "$DEST" | cut -f1) from $OUT"
