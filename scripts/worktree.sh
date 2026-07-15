#!/usr/bin/env bash
# worktree.sh - manage git worktrees for the current repo.
#
# Usage:
#   ./scripts/worktree.sh add <slug> [branch]   Create worktree at <repo>-wt/<slug>
#                                               If <branch> omitted, creates feat/<slug>
#                                               If branch already exists, checks it out instead
#   ./scripts/worktree.sh list                  List worktrees
#   ./scripts/worktree.sh rm <slug>             Remove worktree (must be clean)
#   ./scripts/worktree.sh build <slug>          npm ci + npm run build (if package.json present)
#   ./scripts/worktree.sh path <slug>           Print absolute path
#
# Auto-detects repo root via git rev-parse. Worktrees live in a sibling
# directory named <repo>-wt/ so they do not pollute the main checkout.

set -euo pipefail

REPO="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO")"
WT_ROOT="$(dirname "$REPO")/${REPO_NAME}-wt"

usage() {
  sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-1}"
}

cmd_add() {
  local slug="${1:-}"
  [ -z "$slug" ] && usage
  local branch="${2:-feat/$slug}"
  local target="$WT_ROOT/$slug"
  if [ -e "$target" ]; then
    echo "error: $target already exists" >&2
    exit 1
  fi
  mkdir -p "$WT_ROOT"
  if git -C "$REPO" show-ref --verify --quiet "refs/heads/$branch"; then
    git -C "$REPO" worktree add "$target" "$branch"
  else
    git -C "$REPO" worktree add "$target" -b "$branch" main
  fi
  if [ -f "$target/package.json" ]; then
    echo "-> npm ci in $target"
    ( cd "$target"; npm ci )
    echo "-> npm run build in $target"
    ( cd "$target"; npm run build )
  fi
  echo ""
  echo "Worktree ready: $target"
}

cmd_list() { git -C "$REPO" worktree list; }

cmd_rm() {
  local slug="${1:-}"
  [ -z "$slug" ] && usage
  local target="$WT_ROOT/$slug"
  if [ -d "$target" ]; then
    git -C "$REPO" worktree remove "$target"
    echo "removed: $target"
  else
    echo "no worktree dir at $target; pruning stale entries"
    git -C "$REPO" worktree prune
  fi
}

cmd_build() {
  local slug="${1:-}"
  [ -z "$slug" ] && usage
  local target="$WT_ROOT/$slug"
  [ ! -d "$target" ] && { echo "no worktree: $target" >&2; exit 1; }
  ( cd "$target"; npm ci )
  ( cd "$target"; npm run build )
}

cmd_path() {
  local slug="${1:-}"
  [ -z "$slug" ] && usage
  echo "$WT_ROOT/$slug"
}

case "${1:-}" in
  add)   shift; cmd_add "$@" ;;
  list)  shift; cmd_list ;;
  rm)    shift; cmd_rm "$@" ;;
  build) shift; cmd_build "$@" ;;
  path)  shift; cmd_path "$@" ;;
  ""|-h|--help) usage 0 ;;
  *) usage ;;
esac
