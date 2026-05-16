"""
Ingest the MTG rules guru pattern library.

Walks `<source>/*.md`, parses each via services.patterns, atomically replaces
the contents of `verified_pattern` (and friends) via patterns_repo.

The pattern markdown files are the source of truth; this script only writes
to the projection table. Re-running is safe and idempotent (whole-table replace).

Usage:
    python -m commander_mcp.scripts.ingest_patterns \\
        --source /Users/rick/FreddyRhetorickProjects/mtg-rules/interactions \\
        [--no-cards]    # skip card extraction (faster, no Scryfall fetch)
        [--dry-run]     # parse only, don't write
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

import httpx

from commander_mcp.config import settings
from commander_mcp.db.connection import init_db
from commander_mcp.db.patterns_repo import ParsedPattern, replace_patterns
from commander_mcp.services.patterns import parse_pattern_file


CATALOG_URL = "https://api.scryfall.com/catalog/card-names"


async def fetch_card_names() -> set[str]:
    """Fetch the Scryfall canonical card-names catalog. Returns lowercased set."""
    headers = {
        "User-Agent": settings.scryfall_user_agent,
        "Accept": "application/json",
    }
    async with httpx.AsyncClient(timeout=30.0, headers=headers) as client:
        resp = await client.get(CATALOG_URL)
        resp.raise_for_status()
        data = resp.json()
    return {n.lower() for n in data.get("data", []) if n}


async def run(source: Path, *, with_cards: bool, dry_run: bool) -> int:
    files = sorted(source.glob("*.md"))
    if not files:
        print(f"No .md files under {source}", file=sys.stderr)
        return 1

    card_names_lc: set[str] | None = None
    if with_cards:
        print(f"Fetching Scryfall card-names catalog ...")
        card_names_lc = await fetch_card_names()
        print(f"  {len(card_names_lc):,} canonical names")

    by_id: dict[str, ParsedPattern] = {}
    duplicates: list[tuple[str, str, str]] = []  # (pattern_id, kept, dropped)
    skipped: list[str] = []
    for path in files:
        try:
            parsed = parse_pattern_file(
                path, source_root=source, card_names_lc=card_names_lc
            )
        except Exception as e:
            print(f"  ERROR parsing {path.name}: {e}", file=sys.stderr)
            skipped.append(path.name)
            continue
        if parsed is None:
            skipped.append(path.name)
            continue

        existing = by_id.get(parsed.pattern_id)
        if existing is None:
            by_id[parsed.pattern_id] = parsed
            continue

        # Conflict: keep the longer body (likely the more authoritative version),
        # but always report.
        if len(parsed.body) > len(existing.body):
            duplicates.append((parsed.pattern_id, parsed.source_path, existing.source_path))
            by_id[parsed.pattern_id] = parsed
        else:
            duplicates.append((parsed.pattern_id, existing.source_path, parsed.source_path))

    patterns = list(by_id.values())
    print(f"Parsed {len(patterns)} unique patterns (skipped {len(skipped)}, duplicates {len(duplicates)})")

    if duplicates:
        print("\n  ⚠ Duplicate pattern_ids detected (kept longer body, dropped other):")
        for pid, kept, dropped in duplicates:
            print(f"    {pid}: KEPT {kept}")
            print(f"          DROPPED {dropped}")

    if skipped:
        for s in skipped[:10]:
            print(f"  skipped: {s}")
        if len(skipped) > 10:
            print(f"  ... and {len(skipped) - 10} more")

    if dry_run:
        print("Dry run; not writing.")
        return 0

    await init_db()
    stats = await replace_patterns(patterns)
    print(
        f"Wrote {stats['patterns']} patterns, "
        f"{stats['card_links']} card links, "
        f"{stats['xrefs']} xrefs."
    )
    return 0


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--source",
        type=Path,
        default=Path("/Users/rick/FreddyRhetorickProjects/mtg-rules/interactions"),
        help="Directory of pattern markdown files",
    )
    ap.add_argument("--no-cards", action="store_true", help="Skip card extraction")
    ap.add_argument("--dry-run", action="store_true", help="Parse only; don't write")
    args = ap.parse_args()

    exit(asyncio.run(run(args.source, with_cards=not args.no_cards, dry_run=args.dry_run)))


if __name__ == "__main__":
    main()
