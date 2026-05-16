"""
EDHREC adapter.

EDHREC publishes per-commander deck data via the same JSON files its Next.js
site consumes. The shape:

  https://json.edhrec.com/pages/commanders/<commander-slug>.json
  https://json.edhrec.com/pages/top.json
  https://json.edhrec.com/pages/decks/<commander-slug>.json

The /decks/ endpoint returns recent decklists matching the commander, each
with a list of card names. This is the most useful for our purposes — it
gives us *actual* community decks rather than aggregated "what people play"
recommendations.

This adapter is scoped to the commander format only (EDHREC is Commander-
focused). The orchestrator routes `format='commander'` requests here.

Sandbox note: same as Archidekt — edhrec.com / json.edhrec.com are not in
this container's egress allowlist. Tests use mocked HTTP.
"""

from __future__ import annotations

import re
from typing import Any

from commander_mcp.crawl.base import SourceAdapter, CrawledDecklist, CrawledCard


def _slugify(name: str) -> str:
    """Match EDHREC's slug convention: lowercase, hyphens, ascii-fold-ish."""
    name = name.lower()
    name = re.sub(r"[^a-z0-9]+", "-", name)
    return name.strip("-")


class EdhrecAdapter(SourceAdapter):
    source_name = "edhrec"
    base_url = "https://json.edhrec.com"
    rate_limit_ms = 1500

    async def fetch_recent(
        self,
        *,
        format: str = "commander",
        limit: int = 20,
    ) -> list[CrawledDecklist]:
        if format.lower() != "commander":
            return []   # EDHREC is commander-only

        # 1) Get the current top commanders (most-active list).
        try:
            top = await self._get_json("/pages/top.json")
        except Exception:
            return []

        commander_slugs = self._extract_top_commander_slugs(top, limit=max(3, limit // 5))

        # 2) For each top commander, pull recent decks.
        results: list[CrawledDecklist] = []
        for slug in commander_slugs:
            if len(results) >= limit:
                break
            try:
                decks_page = await self._get_json(f"/pages/decks/{slug}.json")
            except Exception:
                continue
            results.extend(self._extract_decks(decks_page, slug, limit - len(results)))

        return results

    # -- internals -----------------------------------------------------------

    def _extract_top_commander_slugs(self, top_page: dict[str, Any], *, limit: int) -> list[str]:
        """EDHREC's top page nests commanders in `container.json_dict.cardlists`."""
        slugs: list[str] = []
        container = top_page.get("container") or {}
        json_dict = container.get("json_dict") or {}
        cardlists = json_dict.get("cardlists") or []
        for clist in cardlists:
            for entry in (clist.get("cardviews") or []):
                slug = entry.get("sanitized") or _slugify(entry.get("name", ""))
                if slug:
                    slugs.append(slug)
                if len(slugs) >= limit:
                    return slugs
        return slugs

    def _extract_decks(
        self,
        decks_page: dict[str, Any],
        commander_slug: str,
        remaining: int,
    ) -> list[CrawledDecklist]:
        """The /decks/<slug>.json page has `table` with rows that each list cards."""
        out: list[CrawledDecklist] = []
        commander_name = decks_page.get("commander") or commander_slug.replace("-", " ").title()
        table = decks_page.get("table") or []

        for row in table[:remaining]:
            url = row.get("url") or row.get("link")
            if not url:
                continue
            card_names = row.get("cards") or []
            if not card_names:
                continue

            cards = [
                CrawledCard(name=commander_name, quantity=1, role="commander")
            ] + [
                CrawledCard(name=n, quantity=1, role="mainboard")
                for n in card_names
                if n and n != commander_name
            ]

            out.append(
                CrawledDecklist(
                    source=self.source_name,
                    source_url=url if url.startswith("http") else f"https://edhrec.com{url}",
                    format="commander",
                    archetype=row.get("theme") or row.get("tag"),
                    tier=None,
                    commander=commander_name,
                    win_rate=None,
                    cards=cards,
                    raw_metadata={
                        "commander_slug": commander_slug,
                        "tribe": row.get("tribe"),
                        "price": row.get("price"),
                    },
                )
            )
        return out
