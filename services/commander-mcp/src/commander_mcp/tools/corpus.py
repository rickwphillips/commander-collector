"""
Phase 4 tools — query the crawled decklist corpus.

The crawl itself runs as a separate CLI job (scripts/crawl_decklists.py).
These tools just READ from the resulting DB tables. If the corpus is empty,
every tool returns Confidence.unknown pointing at the ingestion command —
so the agent never invents data.
"""

from __future__ import annotations

from typing import Annotated, Any
from pydantic import Field

from commander_mcp.confidence import Confidence, Band
from commander_mcp.crawl import repo


def register(mcp) -> None:
    @mcp.tool()
    async def search_decklists(
        commander: Annotated[
            str | None,
            Field(description="Filter by commander (case-insensitive exact match)."),
        ] = None,
        format: Annotated[
            str | None,
            Field(description="Format filter, e.g. 'commander', 'modern'."),
        ] = "commander",
        archetype: Annotated[
            str | None,
            Field(description="Archetype substring, e.g. 'toxic', 'aristocrats'."),
        ] = None,
        tier: Annotated[
            str | None,
            Field(description="Tier filter: 'competitive', 'casual', 'budget'."),
        ] = None,
        source: Annotated[
            str | None,
            Field(description="Source filter: 'archidekt', 'edhrec', etc."),
        ] = None,
        max_results: Annotated[int, Field(ge=1, le=100)] = 25,
    ) -> dict[str, Any]:
        """
        Search the crawled decklist corpus. Returns matching deck summaries
        ordered by most recently fetched.

        Use `get_decklist_cards(decklist_id=...)` to retrieve the full card
        list of any returned deck.
        """
        stats = await repo.corpus_stats()
        if stats["decks"] == 0:
            return Confidence.unknown(
                "The decklist corpus is empty. Run: "
                "python -m commander_mcp.scripts.crawl_decklists"
            ).model_dump()

        results = await repo.search_decklists(
            commander=commander,
            format=format,
            archetype=archetype,
            tier=tier,
            source=source,
            limit=max_results,
        )
        return Confidence(
            band=Band.CERTAIN if results else Band.MODERATE,
            data={
                "filters": {
                    "commander": commander,
                    "format": format,
                    "archetype": archetype,
                    "tier": tier,
                    "source": source,
                },
                "returned": len(results),
                "corpus_total": stats["decks"],
                "decks": results,
            },
            sources=["local:corpus.decklist"],
            caveats=(
                ["No matching decks found; loosen the filters or run the crawler."]
                if not results else []
            ),
        ).model_dump()

    @mcp.tool()
    async def get_decklist_cards(
        decklist_id: Annotated[int, Field(description="Deck id from search_decklists.")],
    ) -> dict[str, Any]:
        """Return the full card list for a single deck in the corpus."""
        cards = await repo.cards_in_decklist(decklist_id)
        if not cards:
            return Confidence.unknown(
                f"No cards found for decklist id={decklist_id}."
            ).model_dump()
        return Confidence(
            band=Band.CERTAIN,
            data={"decklist_id": decklist_id, "cards": cards},
            sources=["local:corpus.decklist_card"],
        ).model_dump()

    @mcp.tool()
    async def popular_cards_for_commander(
        commander: Annotated[str, Field(description="Commander name (case-insensitive).")],
        max_results: Annotated[int, Field(ge=1, le=100)] = 30,
        format: Annotated[str, Field(description="Format filter.")] = "commander",
    ) -> dict[str, Any]:
        """
        Aggregate the corpus: which cards appear most often across decks with
        this commander, and in what fraction of them. Useful for answering
        "what does an Atraxa deck usually run?"
        """
        stats = await repo.corpus_stats()
        if stats["decks"] == 0:
            return Confidence.unknown(
                "The decklist corpus is empty. Run: "
                "python -m commander_mcp.scripts.crawl_decklists"
            ).model_dump()

        rows = await repo.popular_cards_for_commander(
            commander, limit=max_results, format=format
        )
        if not rows:
            return Confidence(
                band=Band.MODERATE,
                data={"commander": commander, "format": format, "cards": []},
                sources=["local:corpus.decklist"],
                caveats=[
                    f"No decks in corpus for commander={commander!r} format={format!r}. "
                    "Run the crawler with broader settings."
                ],
            ).model_dump()

        return Confidence(
            band=Band.HIGH,
            data={
                "commander": commander,
                "format": format,
                "deck_count_in_corpus": rows[0]["deck_count"] if rows else 0,
                "cards": rows,
            },
            sources=["local:corpus.decklist"],
            caveats=[
                "Percentages reflect the local corpus only — they are not a "
                "metagame snapshot until the crawl has run across enough sources."
            ],
        ).model_dump()

    @mcp.tool()
    async def popular_cards_in_archetype(
        archetype: Annotated[str, Field(description="Archetype substring, e.g. 'toxic'.")],
        max_results: Annotated[int, Field(ge=1, le=100)] = 30,
        format: Annotated[str | None, Field(description="Optional format filter.")] = None,
    ) -> dict[str, Any]:
        """Most common cards across decks tagged with the given archetype."""
        stats = await repo.corpus_stats()
        if stats["decks"] == 0:
            return Confidence.unknown(
                "The decklist corpus is empty. Run: "
                "python -m commander_mcp.scripts.crawl_decklists"
            ).model_dump()

        rows = await repo.popular_cards_in_archetype(
            archetype, limit=max_results, format=format
        )
        return Confidence(
            band=Band.HIGH if rows else Band.MODERATE,
            data={
                "archetype": archetype,
                "format": format,
                "cards": rows,
            },
            sources=["local:corpus.decklist"],
            caveats=(
                ["No decks tagged with this archetype yet — corpus may need broader crawl."]
                if not rows else []
            ),
        ).model_dump()

    @mcp.tool()
    async def corpus_status() -> dict[str, Any]:
        """Summary numbers for the local decklist corpus."""
        stats = await repo.corpus_stats()
        return Confidence(
            band=Band.CERTAIN,
            data=stats,
            sources=["local:corpus.decklist"],
        ).model_dump()
