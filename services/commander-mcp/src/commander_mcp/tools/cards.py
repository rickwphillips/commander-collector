"""
Phase 1 — fundamental card tools.

These are the primitives an agent needs before any deck-level reasoning is possible:
  - search by name           (search_cards_by_name)
  - search Oracle text       (search_cards_by_text)  -- where abilities live
  - search type line         (search_cards_by_type)
  - free-form Scryfall query (search_cards_advanced)
  - full card schema lookup  (get_card)

All tools return Confidence envelopes. Scryfall data is treated as CERTAIN
because it's Wizards' published Oracle text via Scryfall's mirror.
"""

from __future__ import annotations

from typing import Annotated, Any
from pydantic import Field

from commander_mcp.services.scryfall import ScryfallClient, ScryfallNotFound
from commander_mcp.services import mana
from commander_mcp.confidence import Confidence, Band

_scryfall: ScryfallClient | None = None


def _client() -> ScryfallClient:
    global _scryfall
    if _scryfall is None:
        _scryfall = ScryfallClient()
    return _scryfall


def register(mcp) -> None:  # mcp: FastMCP instance
    """Attach all card tools to the given FastMCP server."""

    @mcp.tool()
    async def get_card(
        name: Annotated[str, Field(description="Card name. Fuzzy match by default.")],
        exact: Annotated[bool, Field(description="Require exact name match.")] = False,
    ) -> dict[str, Any]:
        """
        Return the full Scryfall card schema for a single card.

        Includes: mana_cost, cmc, type_line, oracle_text, power/toughness,
        color_identity, keywords, legalities (per format), prices, and printings.
        Use this whenever the agent needs the intimate details of one card.
        """
        try:
            card = await _client().named(name, fuzzy=not exact)
            return Confidence.certain(
                data=card,
                sources=[f"scryfall:cards/named?{'exact' if exact else 'fuzzy'}={name}"],
            ).model_dump()
        except ScryfallNotFound:
            return Confidence.unknown(f"No card matched name={name!r}").model_dump()

    @mcp.tool()
    async def search_cards_by_name(
        name_fragment: Annotated[str, Field(description="Substring to match in card name.")],
        max_results: Annotated[int, Field(ge=1, le=175, description="Hard cap on results.")] = 20,
    ) -> dict[str, Any]:
        """Find all cards whose name contains the given fragment."""
        return await _search(f'name:"{name_fragment}"', max_results)

    @mcp.tool()
    async def search_cards_by_text(
        text_fragment: Annotated[str, Field(description="Substring to match in Oracle text. Use this for abilities and keywords.")],
        max_results: Annotated[int, Field(ge=1, le=175)] = 20,
    ) -> dict[str, Any]:
        """
        Find all cards whose Oracle text contains the given fragment.

        Examples:
          - "toxic"               -> all Toxic cards
          - "whenever ~ attacks"  -> attack triggers (~ is Scryfall's self-name token)
          - "proliferate"         -> proliferate cards
        """
        return await _search(f'oracle:"{text_fragment}"', max_results)

    @mcp.tool()
    async def search_cards_by_type(
        type_fragment: Annotated[str, Field(description="Substring to match in type line, e.g. 'Phyrexian', 'Saga', 'Equipment'.")],
        max_results: Annotated[int, Field(ge=1, le=175)] = 20,
    ) -> dict[str, Any]:
        """Find all cards whose type line contains the given fragment."""
        return await _search(f'type:"{type_fragment}"', max_results)

    @mcp.tool()
    async def search_cards_advanced(
        query: Annotated[str, Field(description="Full Scryfall search syntax. See https://scryfall.com/docs/syntax")],
        max_results: Annotated[int, Field(ge=1, le=175)] = 50,
    ) -> dict[str, Any]:
        """
        Pass-through to Scryfall's search syntax — full power.

        Examples:
          - 'id<=BRG t:creature o:toxic'  (Jund-legal toxic creatures)
          - 'is:commander id=BRG'         (Jund-color legal commanders)
          - 'f:commander cmc<=3 o:"draw a card"'
        """
        return await _search(query, max_results)

    @mcp.tool()
    async def get_card_rulings(
        name: Annotated[str, Field(description="Card name (fuzzy match).")],
    ) -> dict[str, Any]:
        """
        Fetch official Oracle rulings for a card.

        Rulings clarify edge cases that the card text alone doesn't resolve.
        Treat as another source of confidence alongside the Comprehensive Rules.
        """
        try:
            card = await _client().named(name, fuzzy=True)
            rulings = await _client().rulings(card["id"])
            return Confidence.certain(
                data={"card_name": card["name"], "rulings": rulings.get("data", [])},
                sources=[f"scryfall:cards/{card['id']}/rulings"],
            ).model_dump()
        except ScryfallNotFound:
            return Confidence.unknown(f"No card matched name={name!r}").model_dump()

    @mcp.tool()
    async def decompose_mana_cost(
        mana_cost: Annotated[
            str,
            Field(description="A Scryfall-style mana cost string, e.g. '{2/W}{W/U}{G/P}{X}{C}{S}'. Get this from the `mana_cost` field on any card payload."),
        ],
    ) -> dict[str, Any]:
        """
        Parse a mana cost into structured per-symbol records plus aggregates.

        Handles every symbol type Wizards prints: generic ({N}), variable
        ({X}/{Y}/{Z}), colored ({W}/{U}/{B}/{R}/{G}), colorless ({C}), snow
        ({S}), mono-color hybrid ({W/U}), monocolored hybrid a.k.a. twobrid
        ({2/W}), Phyrexian ({W/P}), and hybrid Phyrexian ({W/U/P}).

        Returns mana value (CMC) computed per CR 202.3b — including the rule
        that twobrid contributes 2 — and color identity per CR 903.4 — including
        both colors of any hybrid symbol and the colored half of a twobrid.

        Each symbol record carries human-readable notes (e.g. "Pay {2} OR {W}";
        "Pay {G} OR 2 life") for the agent to surface verbatim.
        """
        result = mana.decompose(mana_cost)
        return Confidence(
            band=Band.CERTAIN,
            data=result,
            sources=[
                "internal:mana-cost-parser",
                "CR 107.4 (mana symbols)",
                "CR 202.3b (mana value)",
                "CR 702.158 (Phyrexian mana)",
                "CR 903.4 (Commander color identity)",
            ],
        ).model_dump()


async def _search(query: str, max_results: int) -> dict[str, Any]:
    try:
        result = await _client().search(query)
        cards = result.get("data", [])[:max_results]
        return Confidence.certain(
            data={
                "query": query,
                "total_cards": result.get("total_cards"),
                "returned": len(cards),
                "has_more": result.get("has_more", False),
                "cards": cards,
            },
            sources=[f"scryfall:cards/search?q={query}"],
        ).model_dump()
    except ScryfallNotFound:
        return Confidence.certain(
            data={"query": query, "total_cards": 0, "returned": 0, "cards": []},
            sources=[f"scryfall:cards/search?q={query}"],
        ).model_dump()
