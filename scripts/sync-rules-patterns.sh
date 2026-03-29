#!/bin/bash
# Sync MTG rules interaction patterns from the local skill folder into the repo.
# Copies new and updated .md files from the interactions/ directory to
# apps/core/app/php-api/rules/, then optionally re-seeds the local DB.
#
# Usage:
#   ./scripts/sync-rules-patterns.sh                        — dry run (shows what would change)
#   ./scripts/sync-rules-patterns.sh --apply                — copy files
#   ./scripts/sync-rules-patterns.sh --apply --seed         — copy + seed local DB
#   ./scripts/sync-rules-patterns.sh --apply --seed --prune — copy + seed + delete removed patterns

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

SRC="/Users/rick/FreddyRhetorickProjects/mtg-rules/interactions"
DEST="$PROJECT_DIR/apps/core/app/php-api/rules"

APPLY=false
SEED=false
PRUNE=false
for arg in "$@"; do
  case $arg in
    --apply) APPLY=true ;;
    --seed)  SEED=true ;;
    --prune) PRUNE=true ;;
  esac
done

if [ ! -d "$SRC" ]; then
  echo "Source not found: $SRC"
  exit 1
fi

echo "Comparing $SRC → $DEST"
echo ""

COPIED=0
SKIPPED=0

for src_file in "$SRC"/p[0-9][0-9][0-9]*.md; do
  [ -f "$src_file" ] || continue
  filename=$(basename "$src_file")
  dest_file="$DEST/$filename"

  if [ ! -f "$dest_file" ]; then
    echo "  + NEW:     $filename"
    if [ "$APPLY" = true ]; then
      cp "$src_file" "$dest_file"
    fi
    COPIED=$((COPIED + 1))
  elif ! cmp -s "$src_file" "$dest_file"; then
    echo "  ~ UPDATED: $filename"
    if [ "$APPLY" = true ]; then
      cp "$src_file" "$dest_file"
    fi
    COPIED=$((COPIED + 1))
  else
    SKIPPED=$((SKIPPED + 1))
  fi
done

echo ""
if [ "$APPLY" = false ]; then
  echo "Dry run: $COPIED file(s) would be copied, $SKIPPED unchanged."
  echo "Run with --apply to copy."
else
  echo "Done: $COPIED file(s) copied, $SKIPPED unchanged."
fi

PRUNED=0
if [ "$PRUNE" = true ]; then
  for dest_file in "$DEST"/p[0-9][0-9][0-9]*.md; do
    [ -f "$dest_file" ] || continue
    filename=$(basename "$dest_file")
    src_file="$SRC/$filename"
    if [ ! -f "$src_file" ]; then
      echo "  - REMOVED: $filename"
      if [ "$APPLY" = true ]; then
        rm "$dest_file"
      fi
      PRUNED=$((PRUNED + 1))
    fi
  done
  if [ "$PRUNED" -gt 0 ] && [ "$APPLY" = false ]; then
    echo "Dry run: $PRUNED file(s) would be pruned."
  fi
fi

if [ "$APPLY" = true ] && [ "$SEED" = true ] && [ "$COPIED" -gt 0 -o "$PRUNED" -gt 0 ]; then
  echo ""
  echo "Seeding local DB..."
  php "$DEST/seed.php"
fi
