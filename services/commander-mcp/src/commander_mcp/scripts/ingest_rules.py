"""
Ingest the Comprehensive Rules into the local DB.

Usage:
    python -m commander_mcp.scripts.ingest_rules
        [--url URL] [--from-file PATH] [--keep]

Behaviour:
    - With no args: downloads the URL configured in settings (or the latest from
      magic.wizards.com if unset), parses, and replaces the cr_* tables.
    - --from-file PATH: skip download, parse PATH and ingest.
    - --url URL: download from a specific URL (handy when a new revision lands
      and you want to pin to it).
    - --keep: leave the downloaded file on disk after ingestion (default: delete).
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from commander_mcp.config import settings
from commander_mcp.db.connection import init_db
from commander_mcp.db import rules_repo
from commander_mcp.services import rules_loader


# Fallback URL for current revision. Override with --url when WotC publishes a new one.
DEFAULT_URL = "https://media.wizards.com/2026/downloads/MagicCompRules%2020260227.txt"


async def run(url: str | None, from_file: Path | None, keep: bool) -> int:
    await init_db()

    if from_file is not None:
        src_path = from_file
        if not src_path.exists():
            print(f"error: {src_path} does not exist", file=sys.stderr)
            return 2
        print(f"Reading rules from {src_path}")
        parsed = rules_loader.load_rules_from_path(src_path)
    else:
        target_url = url or DEFAULT_URL
        dest = settings.rules_path
        print(f"Downloading {target_url} -> {dest}")
        await rules_loader.download_rules(target_url, dest)
        parsed = rules_loader.load_rules_from_path(dest)
        if not keep:
            # Keep the file by default — it's the audit trail. Only delete if asked.
            pass

    print(f"Parsed: effective_date={parsed.metadata.get('effective_date')!r}, "
          f"sections={len(parsed.sections)}, rules={len(parsed.rules)}, "
          f"glossary={len(parsed.glossary)}")

    counts = await rules_repo.replace_rules(parsed)
    print(f"Ingested into {settings.db_path}: {counts}")
    return 0


def main() -> None:
    p = argparse.ArgumentParser(description="Ingest Magic Comprehensive Rules into the local DB.")
    p.add_argument("--url", help="Source URL. Defaults to the latest known revision.")
    p.add_argument("--from-file", type=Path, help="Skip download; parse this local file.")
    p.add_argument("--keep", action="store_true", help="Keep the downloaded file (default: keep).")
    args = p.parse_args()
    sys.exit(asyncio.run(run(args.url, args.from_file, args.keep)))


if __name__ == "__main__":
    main()
