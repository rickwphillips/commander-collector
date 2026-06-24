#!/bin/bash
# Sync MTG rules interaction patterns from the mtg-rules repo into the local DB.
# Reads .md files directly from the source directory — no copy step needed.
#
# Usage:
#   ./scripts/sync-rules-patterns.sh                — dry run (shows what would seed)
#   ./scripts/sync-rules-patterns.sh --apply        — seed local DB
#   ./scripts/sync-rules-patterns.sh --apply --prune — seed + delete removed patterns from DB

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

SRC="/Users/rickphillips/FreddyRhetorickContexts/mtg-rules/interactions"
SEED_PHP="$PROJECT_DIR/apps/core/app/php-api/rules/seed.php"

APPLY=false
PRUNE=false
for arg in "$@"; do
  case $arg in
    --apply) APPLY=true ;;
    --prune) PRUNE=true ;;
  esac
done

if [ ! -d "$SRC" ]; then
  echo "Source not found: $SRC"
  exit 1
fi

PATTERN_COUNT=$(ls "$SRC"/p[0-9][0-9][0-9]*.md 2>/dev/null | wc -l | tr -d ' ')
echo "Found $PATTERN_COUNT pattern files in $SRC"

if [ "$APPLY" = true ]; then
  echo "Seeding local DB from source..."
  php "$SEED_PHP" --source "$SRC"
else
  echo "Dry run:"
  php "$SEED_PHP" --source "$SRC" --dry-run
fi

if [ "$PRUNE" = true ] && [ "$APPLY" = true ]; then
  echo ""
  echo "Pruning removed patterns from DB..."
  # Build list of pattern IDs on disk
  DISK_IDS=$(for f in "$SRC"/p[0-9][0-9][0-9]*.md; do
    grep -m1 '^id:' "$f" 2>/dev/null | sed 's/^id: *//'
  done | tr '\n' ',' | sed 's/,$//')

  if [ -n "$DISK_IDS" ]; then
    mysql -u root commander_collector -e "
      DELETE FROM rules_patterns
      WHERE pattern_id NOT IN ($(echo "$DISK_IDS" | sed "s/[^,]*/'\0'/g"));
    " 2>/dev/null && echo "Prune complete." || echo "Prune skipped (DB error)."
  fi
fi
