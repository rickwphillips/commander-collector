"""Unit tests for db/card_cache_repo. Uses an isolated SQLite file per test."""

import os
import tempfile
from pathlib import Path

import pytest

from commander_mcp.config import settings
from commander_mcp.db import card_cache_repo
from commander_mcp.db.connection import init_db


@pytest.fixture
async def fresh_db(monkeypatch):
    """Point settings.db_path at a fresh temp file and run schema migrations."""
    fd, path = tempfile.mkstemp(suffix=".db", prefix="cc-cache-")
    os.close(fd)
    monkeypatch.setattr(settings, "db_path", Path(path))
    await init_db()
    yield Path(path)
    try:
        os.unlink(path)
    except OSError:
        pass


def _card(scryfall_id: str, name: str, **extras):
    return {
        "id": scryfall_id,
        "oracle_id": f"oracle-{scryfall_id}",
        "name": name,
        "type_line": extras.get("type_line", "Creature"),
        "oracle_text": extras.get("oracle_text", ""),
        "mana_cost": extras.get("mana_cost"),
        "cmc": extras.get("cmc", 1),
        "color_identity": extras.get("color_identity", []),
        "keywords": extras.get("keywords", []),
        "legalities": extras.get("legalities", {"commander": "legal"}),
    }


async def test_empty_lookup_returns_empty(fresh_db):
    result = await card_cache_repo.get_cached([])
    assert result == {}


async def test_miss_returns_empty(fresh_db):
    result = await card_cache_repo.get_cached(["Sol Ring"])
    assert result == {}


async def test_persist_then_lookup(fresh_db):
    cards = [_card("a-1", "Sol Ring"), _card("a-2", "Lightning Bolt")]
    written = await card_cache_repo.persist(cards)
    assert written == 2

    result = await card_cache_repo.get_cached(["Sol Ring", "Lightning Bolt"])
    assert set(result.keys()) == {"Sol Ring", "Lightning Bolt"}
    assert result["Sol Ring"]["id"] == "a-1"
    assert result["Lightning Bolt"]["id"] == "a-2"


async def test_lookup_is_case_insensitive(fresh_db):
    await card_cache_repo.persist([_card("a-1", "Sol Ring")])
    result = await card_cache_repo.get_cached(["sol ring"])
    assert "sol ring" in result
    assert result["sol ring"]["name"] == "Sol Ring"


async def test_lookup_preserves_input_casing(fresh_db):
    """The result dict should be keyed on whatever casing the caller passed in."""
    await card_cache_repo.persist([_card("a-1", "Sol Ring")])
    result = await card_cache_repo.get_cached(["SOL RING"])
    assert "SOL RING" in result
    assert "Sol Ring" not in result


async def test_persist_skips_cards_without_id(fresh_db):
    """Defensive: a malformed payload missing 'id' shouldn't blow up."""
    written = await card_cache_repo.persist([{"name": "Broken"}])
    assert written == 0


async def test_persist_is_upsert(fresh_db):
    """Re-persisting the same id should update, not error."""
    await card_cache_repo.persist([_card("a-1", "Sol Ring", oracle_text="v1")])
    await card_cache_repo.persist([_card("a-1", "Sol Ring", oracle_text="v2")])
    result = await card_cache_repo.get_cached(["Sol Ring"])
    assert result["Sol Ring"]["oracle_text"] == "v2"


async def test_stats(fresh_db):
    await card_cache_repo.persist([
        _card("a-1", "Sol Ring"),
        _card("a-2", "Lightning Bolt"),
        _card("a-3", "Counterspell"),
    ])
    stats = await card_cache_repo.stats()
    assert stats["cached_cards"] == 3
