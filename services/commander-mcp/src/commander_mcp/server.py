"""
Commander Collector MCP server — entry point.

Run:
    uv run commander-mcp
    # or
    python -m commander_mcp.server

Transports:
    Default is stdio (works with Claude Desktop config). Pass --http to expose
    a streamable HTTP server on :8000 for local agent testing.
"""

from __future__ import annotations

import asyncio
import sys
from mcp.server.fastmcp import FastMCP

from commander_mcp.db.connection import init_db
from commander_mcp.tools import cards, rules, decks, corpus, learning, patterns, scoring


def build_server() -> FastMCP:
    from commander_mcp.config import settings as _settings

    mcp = FastMCP(
        name="commander-collector",
        instructions=(
            "Magic: The Gathering knowledge server. Tools wrap Scryfall, the "
            "Comprehensive Rules, and Oracle rulings. Every response carries a "
            "Confidence envelope; never assert a claim whose band is 'unknown'. "
            "Prefer authoritative sources (CERTAIN) over learned synergy weights "
            "(MODERATE/LOW) when they disagree."
        ),
        host=_settings.http_host,
        port=_settings.http_port,
    )

    cards.register(mcp)
    rules.register(mcp)
    decks.register(mcp)
    corpus.register(mcp)
    learning.register(mcp)
    patterns.register(mcp)
    scoring.register(mcp)

    return mcp


def main() -> None:
    asyncio.run(init_db())
    mcp = build_server()

    if "--http" in sys.argv:
        mcp.run(transport="streamable-http")
    else:
        mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
