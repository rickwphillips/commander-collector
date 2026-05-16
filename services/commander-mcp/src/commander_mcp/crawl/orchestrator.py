"""
Crawl orchestrator.

Walks every configured adapter, collects decklists, persists them, and
returns a summary the CLI prints. Faults in one adapter don't stop the
others — every source is wrapped in its own try/except.

Sources are selected by `settings.crawl_sources`; the default is the
two implemented adapters (Archidekt and EDHREC). Adding 'moxfield',
'tappedout', or 'mtggoldfish' will currently raise NotImplementedError
from the stub adapters — that's intentional, and the orchestrator
catches it and reports the source as unavailable.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from commander_mcp.config import settings
from commander_mcp.crawl import repo
from commander_mcp.crawl.base import SourceAdapter
from commander_mcp.crawl.adapters.archidekt import ArchidektAdapter
from commander_mcp.crawl.adapters.edhrec import EdhrecAdapter
from commander_mcp.crawl.adapters.stubs import (
    MoxfieldAdapter,
    TappedOutAdapter,
    MTGGoldfishAdapter,
)


_REGISTRY: dict[str, type[SourceAdapter]] = {
    "archidekt": ArchidektAdapter,
    "edhrec": EdhrecAdapter,
    "moxfield": MoxfieldAdapter,
    "tappedout": TappedOutAdapter,
    "mtggoldfish": MTGGoldfishAdapter,
}


@dataclass
class SourceResult:
    source: str
    fetched: int
    written: int
    error: str | None = None


@dataclass
class CrawlReport:
    per_source: list[SourceResult]

    @property
    def total_written(self) -> int:
        return sum(s.written for s in self.per_source)

    def to_dict(self) -> dict[str, Any]:
        return {
            "per_source": [s.__dict__ for s in self.per_source],
            "total_written": self.total_written,
        }


async def run_daily(
    *,
    sources: list[str] | None = None,
    formats: list[str] | None = None,
    per_source_limit: int = 25,
) -> CrawlReport:
    """
    Run a single crawl pass.

    Args:
        sources : adapter names to enable. Defaults to `settings.crawl_sources`.
        formats : formats to crawl, e.g. ['commander']. Defaults to ['commander'].
        per_source_limit : max decklists per source per format.
    """
    chosen = sources or settings.crawl_sources
    fmts = formats or ["commander"]
    results: list[SourceResult] = []

    for name in chosen:
        cls = _REGISTRY.get(name)
        if cls is None:
            results.append(SourceResult(name, 0, 0, error=f"unknown source {name!r}"))
            continue

        adapter = cls()
        fetched = 0
        written = 0
        error: str | None = None
        try:
            for fmt in fmts:
                try:
                    decks = await adapter.fetch_recent(format=fmt, limit=per_source_limit)
                except NotImplementedError as exc:
                    error = f"adapter not implemented: {exc}"
                    continue
                except Exception as exc:
                    error = f"{type(exc).__name__}: {exc}"
                    continue

                fetched += len(decks)
                written += await repo.upsert_many(decks)
        finally:
            await adapter.aclose()

        results.append(SourceResult(name, fetched, written, error))

    return CrawlReport(per_source=results)
