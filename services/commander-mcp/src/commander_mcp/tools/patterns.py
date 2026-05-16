"""
Verified pattern library tools.

Surfaces the ingested MTG rules guru patterns (mtg-rules/interactions/*.md)
as MCP tools. The pattern library is the brain's ground truth: hand-verified
card interactions with CR citations, distinct from the heuristic synergy
scoring and the learning loop.

Confidence bands:
  - found in verified_pattern  -> CERTAIN (hand-verified, CR-grounded)
  - no match                   -> UNKNOWN
  - learned weight overlay     -> attached as a separate field; CERTAIN that
                                  the stored value is X, MODERATE on whether
                                  X is the real-world verdict (sample size).
"""

from __future__ import annotations

from typing import Annotated, Any
from pydantic import Field

from commander_mcp.confidence import Band, Confidence
from commander_mcp.db import feedback_repo, patterns_repo


_NOT_INGESTED = (
    "Pattern library has not been ingested. Run: "
    "python -m commander_mcp.scripts.ingest_patterns"
)


def register(mcp) -> None:
    @mcp.tool()
    async def lookup_interaction(
        card_a: Annotated[str, Field(description="One card name (case-insensitive).")],
        card_b: Annotated[str, Field(description="The other card name.")],
        context: Annotated[
            str | None,
            Field(description="Optional context tag for the learned-weight overlay (e.g. 'commander/jund-toxic')."),
        ] = None,
    ) -> dict[str, Any]:
        """
        Look up the verified interaction between two cards.

        Returns every hand-verified pattern in the library that names both
        cards (any role), plus the cited CR rules and any learned synergy
        weight from the feedback loop. This is the first call to make when
        the user asks 'does X work with Y' or 'do these cards combo'.

        If no verified pattern exists, the brain falls back to UNKNOWN.
        Don't fabricate an answer; tell the user no verified pattern exists
        and offer to search by mechanic instead.
        """
        if not await patterns_repo.is_ingested():
            return Confidence.unknown(_NOT_INGESTED).model_dump()

        a = card_a.strip().lower()
        b = card_b.strip().lower()
        patterns = await patterns_repo.find_by_pair(a, b)
        learned = await feedback_repo.get_synergy_weight(a, b, context)

        cr_refs: set[str] = set()
        for p in patterns:
            cr_refs.update(p.get("cr_refs", []))

        if not patterns:
            return Confidence.unknown(
                f"No verified pattern in the library names both {card_a!r} and {card_b!r}. "
                f"Try find_card_patterns or search_verified_patterns."
            ).model_dump()

        return Confidence(
            band=Band.CERTAIN,
            data={
                "card_a": a,
                "card_b": b,
                "context": context,
                "patterns": patterns,
                "cr_refs_cited": sorted(cr_refs),
                "learned_weight": learned,
            },
            sources=[f"local:verified_pattern x{len(patterns)}"]
            + (["local:synergy_weight"] if learned else []),
        ).model_dump()

    @mcp.tool()
    async def find_card_patterns(
        card_name: Annotated[str, Field(description="Card name (case-insensitive).")],
        role: Annotated[
            str | None,
            Field(description="Optional role filter: 'subject', 'example', 'foil', or 'mentioned'."),
        ] = None,
    ) -> dict[str, Any]:
        """
        Return every verified pattern that names this card.

        Roles describe HOW the card appears:
          - 'subject'   : headline card of the pattern (named in slug or tags)
          - 'foil'      : appears in 'Commonly Confused With' (often anti-pattern)
          - 'example'   : used as an example in Additional Examples
          - 'mentioned' : referenced elsewhere in the body
        """
        if not await patterns_repo.is_ingested():
            return Confidence.unknown(_NOT_INGESTED).model_dump()

        if role is not None and role not in {"subject", "example", "foil", "mentioned"}:
            return Confidence.unknown(
                f"Invalid role {role!r}. Use one of: subject, example, foil, mentioned."
            ).model_dump()

        name = card_name.strip().lower()
        patterns = await patterns_repo.find_by_card(name, role=role)
        if not patterns:
            return Confidence.unknown(
                f"No verified patterns reference {card_name!r}"
                + (f" with role {role!r}" if role else "")
                + "."
            ).model_dump()

        return Confidence(
            band=Band.CERTAIN,
            data={
                "card_name": name,
                "role_filter": role,
                "returned": len(patterns),
                "patterns": patterns,
            },
            sources=[f"local:verified_pattern x{len(patterns)}"],
        ).model_dump()

    @mcp.tool()
    async def get_verified_pattern(
        pattern_id: Annotated[
            str,
            Field(description="Pattern id like 'p001', 'p825', 'P523'. Case-insensitive."),
        ],
    ) -> dict[str, Any]:
        """
        Fetch a single pattern by id, including cards, cross-references,
        and the full markdown body. Use when following an xref from another
        pattern, or when the user names a specific pattern.
        """
        if not await patterns_repo.is_ingested():
            return Confidence.unknown(_NOT_INGESTED).model_dump()

        pid = pattern_id.strip().lower()
        pattern = await patterns_repo.get_pattern(pid)
        if pattern is None:
            return Confidence.unknown(f"No verified pattern {pattern_id!r}.").model_dump()

        return Confidence(
            band=Band.CERTAIN,
            data=pattern,
            sources=[f"local:verified_pattern/{pid}", pattern["source_path"]],
        ).model_dump()

    @mcp.tool()
    async def search_verified_patterns(
        query: Annotated[
            str,
            Field(description="Full-text query, e.g. 'landfall clue counter', 'deathtouch trample'."),
        ],
        max_results: Annotated[int, Field(ge=1, le=50)] = 10,
    ) -> dict[str, Any]:
        """
        Full-text search across pattern abstracts and bodies (FTS5).

        Use when the user describes a mechanic or interaction by topic
        rather than naming specific cards. Returns the strongest matches
        ranked by BM25 relevance.
        """
        if not await patterns_repo.is_ingested():
            return Confidence.unknown(_NOT_INGESTED).model_dump()

        results = await patterns_repo.search_patterns(query, limit=max_results)
        if not results:
            return Confidence(
                band=Band.HIGH,
                data={"query": query, "returned": 0, "patterns": []},
                sources=["local:verified_pattern_fts"],
                caveats=[f"No verified patterns matched the query {query!r}."],
            ).model_dump()

        return Confidence(
            band=Band.CERTAIN,
            data={"query": query, "returned": len(results), "patterns": results},
            sources=["local:verified_pattern_fts"],
        ).model_dump()
