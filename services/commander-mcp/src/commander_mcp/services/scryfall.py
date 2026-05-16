"""
Scryfall HTTP client.

Wraps the public Scryfall API with:
  - polite rate limiting (Scryfall requests 50-100ms between calls)
  - identifying User-Agent
  - structured exceptions
  - thin pydantic models for the few fields we use internally

The full card payload is returned to the LLM as-is via the tools layer;
this client is intentionally low-level.

Docs: https://scryfall.com/docs/api
"""

from __future__ import annotations

import asyncio
import time
from typing import Any
import httpx

from commander_mcp.config import settings


class ScryfallError(RuntimeError):
    pass


class ScryfallNotFound(ScryfallError):
    pass


class ScryfallClient:
    def __init__(self) -> None:
        self._client = httpx.AsyncClient(
            base_url=settings.scryfall_base_url,
            headers={
                "User-Agent": settings.scryfall_user_agent,
                "Accept": "application/json",
            },
            timeout=15.0,
        )
        self._last_call_monotonic: float = 0.0
        self._rate_lock = asyncio.Lock()

    async def aclose(self) -> None:
        await self._client.aclose()

    async def _throttle(self) -> None:
        async with self._rate_lock:
            elapsed_ms = (time.monotonic() - self._last_call_monotonic) * 1000
            wait_ms = settings.scryfall_rate_limit_ms - elapsed_ms
            if wait_ms > 0:
                await asyncio.sleep(wait_ms / 1000)
            self._last_call_monotonic = time.monotonic()

    async def _get(self, path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        await self._throttle()
        resp = await self._client.get(path, params=params)
        if resp.status_code == 404:
            raise ScryfallNotFound(f"Scryfall 404: {path} {params or ''}")
        if resp.status_code >= 400:
            raise ScryfallError(f"Scryfall {resp.status_code}: {resp.text[:200]}")
        return resp.json()

    # --- High-level endpoints --------------------------------------------------

    async def named(self, name: str, *, fuzzy: bool = True) -> dict[str, Any]:
        """GET /cards/named — exact or fuzzy name lookup."""
        key = "fuzzy" if fuzzy else "exact"
        return await self._get("/cards/named", {key: name})

    async def search(self, query: str, *, unique: str = "cards", order: str = "name", page: int = 1) -> dict[str, Any]:
        """GET /cards/search — Scryfall search syntax pass-through."""
        return await self._get(
            "/cards/search",
            {"q": query, "unique": unique, "order": order, "page": page},
        )

    async def card_by_id(self, scryfall_id: str) -> dict[str, Any]:
        return await self._get(f"/cards/{scryfall_id}")

    async def rulings(self, scryfall_id: str) -> dict[str, Any]:
        """GET /cards/:id/rulings — Oracle rulings for a specific card."""
        return await self._get(f"/cards/{scryfall_id}/rulings")

    async def collection(
        self, identifiers: list[dict[str, str]]
    ) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
        """
        POST /cards/collection — batch lookup. Accepts up to 75 identifiers per
        call (Scryfall's limit). Returns (found_cards, not_found_identifiers).

        Each identifier is a dict like {"name": "Sol Ring"} or {"id": "<uuid>"}.
        Handles >75 by paging internally.
        """
        found: list[dict[str, Any]] = []
        missing: list[dict[str, str]] = []
        BATCH = 75
        for start in range(0, len(identifiers), BATCH):
            chunk = identifiers[start : start + BATCH]
            await self._throttle()
            resp = await self._client.post(
                "/cards/collection", json={"identifiers": chunk}
            )
            if resp.status_code >= 400:
                raise ScryfallError(f"Scryfall {resp.status_code}: {resp.text[:200]}")
            body = resp.json()
            found.extend(body.get("data", []))
            missing.extend(body.get("not_found", []))
        return found, missing
