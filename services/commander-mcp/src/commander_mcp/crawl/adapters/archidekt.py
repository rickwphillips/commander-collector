"""
Archidekt adapter.

Archidekt exposes a public REST API documented in their forum threads. The
deck-search endpoint returns paginated deck summaries; the deck-detail
endpoint returns the full card list.

Endpoints:
  GET /api/decks/v3/?orderBy=-createdAt&pageSize=50&deckFormat=3
       deckFormat: 1=Standard, 2=Modern, 3=Commander, 4=Legacy, 5=Vintage,
                   6=Pauper, 7=Pioneer, 9=Brawl, 12=Historic, 13=Penny Dreadful
  GET /api/decks/{id}/
       Full card listing under `cards`, each entry has `card.oracleCard.name`,
       `quantity`, and `category` (Commander/Maybeboard/Sideboard/Mainboard).

This adapter does NOT pull every detail — that would be expensive. It pulls
the listing, normalizes summaries, then fetches per-deck cards only for the
top-N most recent in this run.

Sandbox note: archidekt.com is not in this container's egress allowlist, so
the adapter cannot be exercised against the live API in CI. Tests use mocked
HTTP responses. On the user's machine the endpoints are publicly reachable.
"""

from __future__ import annotations

from typing import Any

from commander_mcp.crawl.base import SourceAdapter, CrawledDecklist, CrawledCard


_FORMAT_TO_CODE = {
    "standard": 1,
    "modern": 2,
    "commander": 3,
    "legacy": 4,
    "vintage": 5,
    "pauper": 6,
    "pioneer": 7,
    "brawl": 9,
    "historic": 12,
}

_CATEGORY_TO_ROLE = {
    "Commander": "commander",
    "Mainboard": "mainboard",
    "Sideboard": "sideboard",
    "Maybeboard": "maybeboard",
    None: "mainboard",
}


class ArchidektAdapter(SourceAdapter):
    source_name = "archidekt"
    base_url = "https://archidekt.com"
    rate_limit_ms = 1500   # extra polite — Archidekt is community-funded

    async def fetch_recent(
        self,
        *,
        format: str = "commander",
        limit: int = 20,
    ) -> list[CrawledDecklist]:
        fmt_code = _FORMAT_TO_CODE.get(format.lower())
        if fmt_code is None:
            return []

        listing = await self._get_json(
            "/api/decks/v3/",
            {
                "orderBy": "-createdAt",
                "pageSize": min(limit, 50),
                "deckFormat": fmt_code,
            },
        )

        results: list[CrawledDecklist] = []
        for summary in listing.get("results", [])[:limit]:
            deck_id = summary.get("id")
            if deck_id is None:
                continue
            try:
                detail = await self._get_json(f"/api/decks/{deck_id}/")
            except Exception:
                # One bad deck shouldn't kill the run.
                continue
            results.append(self._normalize(detail, format=format))

        return results

    def _normalize(self, detail: dict[str, Any], *, format: str) -> CrawledDecklist:
        deck_id = detail.get("id")
        cards: list[CrawledCard] = []
        commander_name: str | None = None

        for entry in detail.get("cards", []) or []:
            qty = int(entry.get("quantity") or 1)
            category = entry.get("category")
            role = _CATEGORY_TO_ROLE.get(category, "mainboard")
            name = (
                ((entry.get("card") or {}).get("oracleCard") or {}).get("name")
                or (entry.get("card") or {}).get("name")
            )
            if not name:
                continue
            cards.append(CrawledCard(name=name, quantity=qty, role=role))
            if role == "commander" and commander_name is None:
                commander_name = name

        tags = detail.get("deckTags") or []
        archetype = ", ".join(t.get("name") for t in tags if t.get("name")) or None

        return CrawledDecklist(
            source=self.source_name,
            source_url=f"https://archidekt.com/decks/{deck_id}",
            format=format,
            archetype=archetype,
            tier=None,  # Archidekt doesn't categorize tiers
            commander=commander_name,
            win_rate=None,
            cards=cards,
            raw_metadata={
                "name": detail.get("name"),
                "owner": (detail.get("owner") or {}).get("username"),
                "created_at": detail.get("createdAt"),
            },
        )
