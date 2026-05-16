"""
Card-scoring tools.

Surfaces the layered scoring service as an MCP tool. The trace returned
alongside the score is the explainability hook: each entry names a layer,
its contribution, and the reason it fired.
"""

from __future__ import annotations

from typing import Annotated, Any
from pydantic import Field

from commander_mcp.confidence import Band, Confidence
from commander_mcp.services.card_scoring import score_card_in_deck


def register(mcp) -> None:
    @mcp.tool()
    async def score_card_in_deck_tool(
        card_name: Annotated[str, Field(description="Card to score (case-insensitive).")],
        decklist: Annotated[
            list[str],
            Field(description="Other cards in the deck. Used to look up learned synergy weights."),
        ],
        commander: Annotated[
            str | None,
            Field(description="The commander, for context. Currently informational."),
        ] = None,
        format: Annotated[
            str,
            Field(description="Format scope for card_note lookups (e.g. 'commander')."),
        ] = "commander",
        archetype: Annotated[
            str | None,
            Field(description="Optional archetype slug (e.g. 'jund-toxic') for more-specific notes."),
        ] = None,
    ) -> dict[str, Any]:
        """
        Score a card in deck context with full explainability.

        Layered composition (each layer attaches a trace entry):
          1. card_note banned   -> short-circuit, score -1.0, band CERTAIN
          2. card_note other    -> staple/trap/etc prior weight
          3. verified_pattern   -> informational mentions of the card
          4. learned synergy    -> averaged weight against deck pairs

        Use when the user asks 'should I include X in this deck' or
        'is X a good fit here'. The trace is the WHY of the score: surface
        the layers that fired, not just the number.
        """
        result = await score_card_in_deck(
            card_name=card_name,
            decklist=decklist,
            commander=commander,
            format=format,
            archetype=archetype,
        )
        data = result.to_dict()
        sources = ["local:card_note", "local:verified_pattern", "local:synergy_weight"]
        if result.short_circuit:
            return Confidence(
                band=Band.CERTAIN,
                data=data,
                sources=sources,
                caveats=["Score short-circuited by a hard-rule layer (e.g. format ban)."],
            ).model_dump()
        return Confidence(
            band=result.band,
            data=data,
            sources=sources,
        ).model_dump()
