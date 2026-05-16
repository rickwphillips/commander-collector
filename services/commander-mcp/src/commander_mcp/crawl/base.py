"""
Crawler base interface.

Each external decklist source (Archidekt, EDHREC, Moxfield, ...) implements
`SourceAdapter`. The orchestrator iterates whatever adapters are configured,
collects `CrawledDecklist` records, and hands them to the repo for
persistence.

Politeness is enforced at the base class level: every adapter gets an async
rate-limit gate plus a configurable User-Agent header. Sub-classes only have
to implement `fetch_recent`.
"""

from __future__ import annotations

import abc
import asyncio
import time
from dataclasses import dataclass, field
from typing import Any

import httpx


@dataclass
class CrawledCard:
    name: str
    quantity: int = 1
    role: str = "mainboard"     # 'commander' | 'mainboard' | 'sideboard' | 'maybeboard'


@dataclass
class CrawledDecklist:
    source: str                  # 'archidekt', 'edhrec', ...
    source_url: str              # canonical URL on the source site (used for dedupe)
    format: str                  # 'commander', 'modern', ...
    cards: list[CrawledCard]
    archetype: str | None = None
    tier: str | None = None      # 'competitive' | 'casual' | 'budget'
    commander: str | None = None
    win_rate: float | None = None
    raw_metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.source:
            raise ValueError("source is required")
        if not self.source_url:
            raise ValueError("source_url is required")
        if not self.format:
            raise ValueError("format is required")


class SourceAdapter(abc.ABC):
    """
    Base adapter. Concrete subclasses implement `fetch_recent`.

    Configuration knobs:
      - source_name           : machine-readable id, e.g. 'archidekt'
      - base_url              : the API origin
      - rate_limit_ms         : minimum delay between HTTP calls
      - user_agent            : identifying string sent on every request
    """

    source_name: str = "abstract"
    base_url: str = ""
    rate_limit_ms: int = 1000   # 1s default — be polite to anything unauthenticated

    def __init__(
        self,
        *,
        user_agent: str = "CommanderCollector/0.1 (contact: rickwphillips)",
        timeout: float = 20.0,
    ) -> None:
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "User-Agent": user_agent,
                "Accept": "application/json",
            },
            timeout=timeout,
        )
        self._lock = asyncio.Lock()
        self._last_call: float = 0.0

    async def aclose(self) -> None:
        await self._client.aclose()

    async def _throttle(self) -> None:
        async with self._lock:
            elapsed_ms = (time.monotonic() - self._last_call) * 1000
            wait_ms = self.rate_limit_ms - elapsed_ms
            if wait_ms > 0:
                await asyncio.sleep(wait_ms / 1000)
            self._last_call = time.monotonic()

    async def _get_json(self, path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        await self._throttle()
        resp = await self._client.get(path, params=params)
        resp.raise_for_status()
        return resp.json()

    @abc.abstractmethod
    async def fetch_recent(
        self,
        *,
        format: str = "commander",
        limit: int = 20,
    ) -> list[CrawledDecklist]:
        """Fetch the most recent decks of the given format. Returns up to `limit`."""
