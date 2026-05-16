"""
Stub adapters for sources whose APIs are restricted, deprecated, or require
HTML scraping. Each documents the endpoint shape so they can be implemented
in follow-up work — but they raise NotImplementedError today rather than
returning fake data.

  Moxfield   — api2.moxfield.com was open through 2023; partner-key gated
               since 2024. Implementing requires an approved partner key.
               https://www.moxfield.com/help/api

  TappedOut  — has an API but requires login + an API token tied to a user
               account. Public deck pages have JSON via /api/deck/<id>/.

  MTGGoldfish — no public API. Scraping their HTML is fragile; their
               metagame pages are at /metagame/<format> and /archetype/.

Add these to the orchestrator's source list only after their real
implementations land.
"""

from __future__ import annotations

from commander_mcp.crawl.base import SourceAdapter, CrawledDecklist


class MoxfieldAdapter(SourceAdapter):
    source_name = "moxfield"
    base_url = "https://api2.moxfield.com"
    rate_limit_ms = 2000

    async def fetch_recent(self, *, format: str = "commander", limit: int = 20) -> list[CrawledDecklist]:
        raise NotImplementedError(
            "Moxfield's API is partner-key gated as of 2024; implement after "
            "obtaining a key via https://www.moxfield.com/help/api"
        )


class TappedOutAdapter(SourceAdapter):
    source_name = "tappedout"
    base_url = "https://tappedout.net"
    rate_limit_ms = 2000

    async def fetch_recent(self, *, format: str = "commander", limit: int = 20) -> list[CrawledDecklist]:
        raise NotImplementedError(
            "TappedOut requires an authenticated session + per-user API token; "
            "implement when a service account is configured."
        )


class MTGGoldfishAdapter(SourceAdapter):
    source_name = "mtggoldfish"
    base_url = "https://www.mtggoldfish.com"
    rate_limit_ms = 3000

    async def fetch_recent(self, *, format: str = "commander", limit: int = 20) -> list[CrawledDecklist]:
        raise NotImplementedError(
            "MTGGoldfish has no public API; needs HTML scraping of /metagame/<format>."
        )
