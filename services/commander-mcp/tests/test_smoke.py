"""Smoke tests — verify the server builds and tools are registered."""

import pytest

from commander_mcp.server import build_server
from commander_mcp.confidence import Confidence, Band


def test_server_builds():
    mcp = build_server()
    assert mcp.name == "commander-collector"


@pytest.mark.asyncio
async def test_tools_registered():
    mcp = build_server()
    tools = await mcp.list_tools()
    names = {t.name for t in tools}
    # Phase 1 fundamentals
    assert "get_card" in names
    assert "search_cards_by_name" in names
    assert "search_cards_by_text" in names
    assert "search_cards_by_type" in names
    assert "search_cards_advanced" in names
    assert "get_card_rulings" in names
    assert "decompose_mana_cost" in names
    # Phase 2 — Comprehensive Rules
    assert "lookup_comprehensive_rule" in names
    assert "search_comprehensive_rules" in names
    assert "explain_layer" in names
    assert "lookup_glossary_term" in names
    # Phase 3 — Decks
    assert "analyze_deck" in names
    assert "suggest_cards_for_deck" in names
    assert "identify_synergies" in names
    assert "identify_anti_patterns" in names
    # Phase 4 — Corpus
    assert "search_decklists" in names
    assert "get_decklist_cards" in names
    assert "popular_cards_for_commander" in names
    assert "popular_cards_in_archetype" in names
    assert "corpus_status" in names


def test_confidence_unknown_has_no_data():
    c = Confidence.unknown("nothing matched")
    assert c.band == Band.UNKNOWN
    assert c.data is None
    assert c.caveats == ["nothing matched"]
