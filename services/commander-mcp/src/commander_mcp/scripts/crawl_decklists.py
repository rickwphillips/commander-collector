"""
Daily crawler CLI.

Usage:
    python -m commander_mcp.scripts.crawl_decklists
        [--sources archidekt edhrec]
        [--formats commander modern]
        [--limit 25]

Default behaviour: pull recent decks from every source in `settings.crawl_sources`,
for the 'commander' format, up to 25 decks per source. Writes to the local
`decklist` / `decklist_card` tables. Idempotent — re-running just refreshes
existing rows.

Suggested schedule (Linux):
    # /etc/cron.d/commander-collector
    0 5 * * * rick /path/to/.venv/bin/python -m commander_mcp.scripts.crawl_decklists

Or systemd timer — see docs.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys

from commander_mcp.db.connection import init_db
from commander_mcp.crawl.orchestrator import run_daily


async def run(sources: list[str] | None, formats: list[str] | None, limit: int) -> int:
    await init_db()
    report = await run_daily(sources=sources, formats=formats, per_source_limit=limit)
    print(json.dumps(report.to_dict(), indent=2))
    return 0


def main() -> None:
    p = argparse.ArgumentParser(description="Crawl decklist sources into the local corpus.")
    p.add_argument("--sources", nargs="*", help="Source adapter names to enable.")
    p.add_argument("--formats", nargs="*", help="Formats to crawl (default: commander).")
    p.add_argument("--limit", type=int, default=25, help="Max decks per source per format.")
    args = p.parse_args()
    sys.exit(asyncio.run(run(args.sources, args.formats, args.limit)))


if __name__ == "__main__":
    main()
