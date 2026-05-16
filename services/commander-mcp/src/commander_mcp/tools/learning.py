"""
Phase 5 — Feedback loop tools.

Closes the self-correction loop:

  record_feedback         user corrects or confirms a claim the agent made
  get_learned_synergy     look up the learned weight for a card pair
  top_learned_synergies   surface the strongest learned signals (+/-)
  review_feedback_log     triage view of recent corrections / confirmations
  learning_status         counts: events by kind, pairs with feedback, etc.

Confidence bands:
  - record_feedback           CERTAIN — pure DB writes, deterministic.
  - get_learned_synergy       CERTAIN if found; UNKNOWN if no history.
  - top_learned_synergies     HIGH    — counts and means from the DB.
  - review_feedback_log       CERTAIN — log read.
  - learning_status           CERTAIN — counts.

The learned weights are READ by Phase 3's synergy scorer (see
services/synergy.py:score_pair_with_learning) to blend with the heuristic.
"""

from __future__ import annotations

from typing import Annotated, Any, Literal
from pydantic import Field

from commander_mcp.confidence import Confidence, Band
from commander_mcp.db import feedback_repo


def register(mcp) -> None:
    @mcp.tool()
    async def record_feedback(
        kind: Annotated[
            Literal["correction", "confirmation", "uncertainty"],
            Field(description=(
                "'correction' when the user contradicts the agent; "
                "'confirmation' when the user endorses; "
                "'uncertainty' when the user flags ambiguity (logged but no weight update)."
            )),
        ],
        claim: Annotated[
            str,
            Field(description="The exact claim the agent made (so we can audit it later)."),
        ],
        correction: Annotated[
            str | None,
            Field(description="What the user said back. Optional for confirmations."),
        ] = None,
        cards_involved: Annotated[
            list[str] | None,
            Field(description=(
                "Cards the claim was about. Every unordered pair drawn from "
                "this list has its synergy_weight updated when kind is "
                "correction or confirmation."
            )),
        ] = None,
        context: Annotated[
            str | None,
            Field(description=(
                "Free-form scope tag, e.g. 'commander/jund-toxic'. Weights are "
                "stored per-context so corrections in one archetype don't "
                "poison scores in another."
            )),
        ] = None,
    ) -> dict[str, Any]:
        """
        Record user feedback on a claim and update learned weights.

        Use IMMEDIATELY when the user corrects or confirms a synergy/strategy
        claim the agent made. Don't batch — record each correction the
        moment it happens, so the weights reflect the conversation.
        """
        result = await feedback_repo.record_feedback(
            kind=kind,
            claim=claim,
            correction=correction,
            cards_involved=cards_involved,
            context=context,
        )
        return Confidence(
            band=Band.CERTAIN,
            data=result,
            sources=["local:feedback_event", "local:synergy_weight"],
        ).model_dump()

    @mcp.tool()
    async def get_learned_synergy(
        card_a: Annotated[str, Field(description="One card name.")],
        card_b: Annotated[str, Field(description="The other card name.")],
        context: Annotated[
            str | None,
            Field(description="Optional context tag (must match the one used when feedback was recorded)."),
        ] = None,
    ) -> dict[str, Any]:
        """
        Return the learned weight + sample size for a card pair.

        Returns UNKNOWN if no feedback has ever been recorded for the pair.
        A positive weight means accumulated confirmations; negative means
        accumulated corrections.
        """
        row = await feedback_repo.get_synergy_weight(card_a, card_b, context)
        if row is None:
            return Confidence.unknown(
                f"No feedback recorded for ({card_a}, {card_b}) in context {context!r}."
            ).model_dump()
        # CERTAIN that this is what's stored; the *interpretation* of the
        # weight as a real-world synergy verdict is still subject to sample size.
        caveats = []
        if row["sample_size"] < 3:
            caveats.append(
                f"Only {row['sample_size']} feedback event(s) — treat the "
                f"weight as low-confidence until more samples accumulate."
            )
        return Confidence(
            band=Band.CERTAIN,
            data=row,
            sources=["local:synergy_weight"],
            caveats=caveats,
        ).model_dump()

    @mcp.tool()
    async def top_learned_synergies(
        context: Annotated[
            str | None,
            Field(description="Context tag, e.g. 'commander/jund-toxic'."),
        ] = None,
        direction: Annotated[
            Literal["positive", "negative"],
            Field(description="'positive' = strongest confirmed pairs; 'negative' = pairs the user keeps correcting."),
        ] = "positive",
        min_sample_size: Annotated[int, Field(ge=1, le=100)] = 2,
        limit: Annotated[int, Field(ge=1, le=100)] = 25,
    ) -> dict[str, Any]:
        """
        Strongest learned synergies (positive or negative).

        Filter by min_sample_size to ignore pairs with only a single event.
        Use 'negative' direction to surface what the user has been correcting —
        a window into the agent's recurring blind spots.
        """
        rows = await feedback_repo.top_learned_synergies(
            context=context,
            direction=direction,
            min_sample_size=min_sample_size,
            limit=limit,
        )
        return Confidence(
            band=Band.HIGH,
            data={
                "context": context,
                "direction": direction,
                "min_sample_size": min_sample_size,
                "pairs": rows,
            },
            sources=["local:synergy_weight"],
            caveats=(
                ["No learned weights match this filter yet."]
                if not rows else []
            ),
        ).model_dump()

    @mcp.tool()
    async def review_feedback_log(
        kind: Annotated[
            Literal["correction", "confirmation", "uncertainty"] | None,
            Field(description="Optional filter — defaults to all kinds."),
        ] = None,
        context: Annotated[
            str | None,
            Field(description="Optional context filter."),
        ] = None,
        limit: Annotated[int, Field(ge=1, le=100)] = 25,
    ) -> dict[str, Any]:
        """
        Recent feedback events, newest first.

        Useful for self-review: 'what corrections has the user given me
        lately?' or 'has my advice been confirmed in this archetype?'.
        """
        events = await feedback_repo.list_feedback_events(
            kind=kind, context=context, limit=limit
        )
        return Confidence(
            band=Band.CERTAIN,
            data={
                "kind_filter": kind,
                "context_filter": context,
                "returned": len(events),
                "events": events,
            },
            sources=["local:feedback_event"],
        ).model_dump()

    @mcp.tool()
    async def learning_status() -> dict[str, Any]:
        """
        Snapshot of the feedback loop's state: events by kind, total
        learned pairs, and how many of those pairs have enough samples
        (≥2) to be treated as more than noise.
        """
        stats = await feedback_repo.feedback_stats()
        return Confidence(
            band=Band.CERTAIN,
            data=stats,
            sources=["local:feedback_event", "local:synergy_weight"],
        ).model_dump()
