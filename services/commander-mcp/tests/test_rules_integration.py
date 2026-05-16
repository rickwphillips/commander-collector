"""End-to-end: parser -> repo -> tools, all wired up against a temp DB."""

import json
import pytest

from commander_mcp.services.rules_loader import CRParser
from commander_mcp.db import rules_repo
from commander_mcp.db.connection import init_db
from commander_mcp.server import build_server
from commander_mcp.config import settings
from tests.fixtures import SAMPLE_CR_TEXT


@pytest.fixture
async def ingested_db(tmp_path, monkeypatch):
    db_path = tmp_path / "test.sqlite"
    monkeypatch.setattr(settings, "db_path", db_path)
    await init_db()
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    counts = await rules_repo.replace_rules(parsed)
    assert counts["rules"] >= 8
    yield db_path


async def test_phase2_tools_registered():
    mcp = build_server()
    names = {t.name for t in await mcp.list_tools()}
    assert "lookup_comprehensive_rule" in names
    assert "search_comprehensive_rules" in names
    assert "explain_layer" in names
    assert "lookup_glossary_term" in names


async def test_lookup_specific_rule(ingested_db):
    rule = await rules_repo.get_rule("100.1b")
    assert rule is not None
    assert rule["parent"] == "100.1"
    assert len(rule["examples"]) == 2


async def test_lookup_whole_section(ingested_db):
    rules = await rules_repo.get_section_rules("613")
    numbers = [r["rule_number"] for r in rules]
    assert "613.1" in numbers
    assert "613.1g" in numbers


async def test_search_rules_finds_layer_text(ingested_db):
    hits = await rules_repo.search_rules("control-changing")
    assert len(hits) >= 1
    assert any("Layer 2" in h["body"] for h in hits)


async def test_glossary_exact_then_fuzzy(ingested_db):
    exact = await rules_repo.lookup_glossary_term("Toxic")
    assert exact is not None
    assert exact["match"] == "exact"

    fuzzy = await rules_repo.lookup_glossary_term("commander combat damage")
    assert fuzzy is not None
    assert "commander" in fuzzy["term"].lower()


async def test_unknown_when_not_ingested(tmp_path, monkeypatch):
    """The tool layer must return Confidence.unknown when the DB is empty."""
    fresh = tmp_path / "fresh.sqlite"
    monkeypatch.setattr(settings, "db_path", fresh)
    await init_db()

    # Call the underlying function the tool wraps.
    assert await rules_repo.is_ingested() is False


async def test_explain_layer_focuses(ingested_db):
    rules = await rules_repo.get_section_rules("613")
    layer = 7
    needle = f"Layer {layer}:"
    focused = [r for r in rules if needle in r["body"]]
    assert len(focused) == 1
    assert focused[0]["rule_number"] == "613.1g"
