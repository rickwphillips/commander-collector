"""Phase 4 tests — crawler adapters, repo, orchestrator, corpus tools."""

import json
import pytest
from unittest.mock import AsyncMock, patch

from commander_mcp.crawl.adapters.archidekt import ArchidektAdapter
from commander_mcp.crawl.adapters.edhrec import EdhrecAdapter
from commander_mcp.crawl.adapters.stubs import (
    MoxfieldAdapter, TappedOutAdapter, MTGGoldfishAdapter,
)
from commander_mcp.crawl.base import CrawledDecklist, CrawledCard
from commander_mcp.crawl import repo, orchestrator
from commander_mcp.config import settings
from commander_mcp.db.connection import init_db
from commander_mcp.server import build_server


# --- Adapter normalization ---------------------------------------------------

ARCHIDEKT_LISTING = {
    "results": [
        {"id": 12345, "name": "Atraxa Toxic", "createdAt": "2026-01-15T00:00:00Z"},
        {"id": 67890, "name": "Brewer", "createdAt": "2026-01-14T00:00:00Z"},
    ]
}

ARCHIDEKT_DETAIL = {
    "id": 12345,
    "name": "Atraxa Toxic",
    "owner": {"username": "rickw"},
    "createdAt": "2026-01-15T00:00:00Z",
    "deckTags": [{"name": "Toxic"}, {"name": "Proliferate"}],
    "cards": [
        {"quantity": 1, "category": "Commander",
         "card": {"oracleCard": {"name": "Atraxa, Praetors' Voice"}}},
        {"quantity": 1, "category": "Mainboard",
         "card": {"oracleCard": {"name": "Sol Ring"}}},
        {"quantity": 1, "category": "Mainboard",
         "card": {"oracleCard": {"name": "Crystalline Giant"}}},
        {"quantity": 1, "category": "Maybeboard",
         "card": {"oracleCard": {"name": "Tezzeret's Gambit"}}},
    ],
}


async def test_archidekt_adapter_normalizes_to_canonical_record(monkeypatch):
    adapter = ArchidektAdapter()
    # Patch the adapter's HTTP gateway: first call returns listing, second returns detail.
    calls = {"n": 0}
    async def fake_get_json(path, params=None):
        calls["n"] += 1
        if "/api/decks/v3" in path:
            return ARCHIDEKT_LISTING
        if path.startswith("/api/decks/12345"):
            return ARCHIDEKT_DETAIL
        if path.startswith("/api/decks/67890"):
            raise RuntimeError("simulate one bad deck")
        return {}
    monkeypatch.setattr(adapter, "_get_json", fake_get_json)

    try:
        decks = await adapter.fetch_recent(format="commander", limit=2)
    finally:
        await adapter.aclose()

    # One bad deck shouldn't blow up the run; we get the good one.
    assert len(decks) == 1
    deck = decks[0]
    assert deck.source == "archidekt"
    assert deck.source_url == "https://archidekt.com/decks/12345"
    assert deck.format == "commander"
    assert deck.commander == "Atraxa, Praetors' Voice"
    assert deck.archetype == "Toxic, Proliferate"
    roles = {c.name: c.role for c in deck.cards}
    assert roles["Atraxa, Praetors' Voice"] == "commander"
    assert roles["Sol Ring"] == "mainboard"
    assert roles["Tezzeret's Gambit"] == "maybeboard"


async def test_edhrec_adapter_handles_top_then_decks(monkeypatch):
    adapter = EdhrecAdapter()
    top_page = {
        "container": {
            "json_dict": {
                "cardlists": [
                    {"cardviews": [
                        {"name": "Atraxa, Praetors' Voice", "sanitized": "atraxa-praetors-voice"},
                    ]}
                ]
            }
        }
    }
    decks_page = {
        "commander": "Atraxa, Praetors' Voice",
        "table": [
            {"url": "/deck/abc", "cards": ["Sol Ring", "Crystalline Giant"], "tag": "toxic"},
            {"url": "https://edhrec.com/deck/xyz", "cards": ["Cultivate"]},
        ],
    }

    async def fake_get_json(path, params=None):
        if path == "/pages/top.json":
            return top_page
        if path.endswith("atraxa-praetors-voice.json"):
            return decks_page
        return {}
    monkeypatch.setattr(adapter, "_get_json", fake_get_json)

    try:
        decks = await adapter.fetch_recent(format="commander", limit=2)
    finally:
        await adapter.aclose()

    assert len(decks) == 2
    first = decks[0]
    assert first.commander == "Atraxa, Praetors' Voice"
    # Commander is prepended; mainboard cards follow.
    assert first.cards[0].role == "commander"
    assert any(c.name == "Sol Ring" for c in first.cards)
    # Relative URL gets canonicalized; absolute URL is preserved.
    assert decks[0].source_url == "https://edhrec.com/deck/abc"
    assert decks[1].source_url == "https://edhrec.com/deck/xyz"


async def test_edhrec_ignores_non_commander_format(monkeypatch):
    adapter = EdhrecAdapter()
    try:
        out = await adapter.fetch_recent(format="modern", limit=5)
    finally:
        await adapter.aclose()
    assert out == []


@pytest.mark.parametrize("adapter_cls", [MoxfieldAdapter, TappedOutAdapter, MTGGoldfishAdapter])
async def test_stub_adapters_raise_not_implemented(adapter_cls):
    adapter = adapter_cls()
    try:
        with pytest.raises(NotImplementedError):
            await adapter.fetch_recent(format="commander", limit=5)
    finally:
        await adapter.aclose()


# --- Repo persistence ---------------------------------------------------------

@pytest.fixture
async def fresh_db(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "db_path", tmp_path / "corpus.sqlite")
    await init_db()
    yield


def _sample_deck(source: str, url: str, commander: str, archetype: str | None = None) -> CrawledDecklist:
    return CrawledDecklist(
        source=source,
        source_url=url,
        format="commander",
        commander=commander,
        archetype=archetype,
        cards=[
            CrawledCard(name=commander, quantity=1, role="commander"),
            CrawledCard(name="Sol Ring", quantity=1, role="mainboard"),
            CrawledCard(name="Cultivate", quantity=1, role="mainboard"),
        ],
    )


async def test_upsert_and_search(fresh_db):
    await repo.upsert_decklist(_sample_deck("archidekt", "https://a.com/1", "Atraxa, Praetors' Voice", "toxic"))
    await repo.upsert_decklist(_sample_deck("edhrec", "https://e.com/1", "Atraxa, Praetors' Voice", "proliferate"))
    await repo.upsert_decklist(_sample_deck("archidekt", "https://a.com/2", "Yawgmoth, Thran Physician"))

    all_atraxa = await repo.search_decklists(commander="Atraxa, Praetors' Voice")
    assert len(all_atraxa) == 2
    just_arch = await repo.search_decklists(source="archidekt")
    assert len(just_arch) == 2
    toxic = await repo.search_decklists(archetype="toxic")
    assert len(toxic) == 1


async def test_upsert_replaces_existing(fresh_db):
    await repo.upsert_decklist(_sample_deck("archidekt", "https://a.com/1", "Atraxa, Praetors' Voice"))
    # Same (source, source_url) → replaced, not duplicated.
    await repo.upsert_decklist(_sample_deck("archidekt", "https://a.com/1", "Atraxa, Praetors' Voice"))
    stats = await repo.corpus_stats()
    assert stats["decks"] == 1


async def test_popular_cards_for_commander_aggregates(fresh_db):
    for i in range(3):
        await repo.upsert_decklist(
            _sample_deck("archidekt", f"https://a.com/{i}", "Atraxa, Praetors' Voice")
        )
    rows = await repo.popular_cards_for_commander("Atraxa, Praetors' Voice")
    # Each of the 3 decks contributes 1 commander + 2 mainboard. Sol Ring appears in all 3.
    by_name = {r["card_name"]: r["deck_count"] for r in rows}
    assert by_name["Sol Ring"] == 3
    assert by_name["Cultivate"] == 3


# --- Orchestrator -----------------------------------------------------------

async def test_orchestrator_isolates_source_failures(fresh_db, monkeypatch):
    # archidekt: real one good deck. edhrec: raises an error mid-run.
    async def archidekt_fetch(self, format="commander", limit=20):
        return [_sample_deck("archidekt", "https://a.com/orch", "Atraxa, Praetors' Voice")]
    async def edhrec_fetch(self, format="commander", limit=20):
        raise RuntimeError("simulated edhrec outage")

    monkeypatch.setattr(ArchidektAdapter, "fetch_recent", archidekt_fetch)
    monkeypatch.setattr(EdhrecAdapter, "fetch_recent", edhrec_fetch)

    report = await orchestrator.run_daily(
        sources=["archidekt", "edhrec"], formats=["commander"], per_source_limit=5
    )
    by_source = {s.source: s for s in report.per_source}
    assert by_source["archidekt"].written == 1
    assert by_source["archidekt"].error is None
    assert by_source["edhrec"].written == 0
    assert "simulated edhrec outage" in by_source["edhrec"].error
    assert report.total_written == 1


async def test_orchestrator_handles_stub_not_implemented(fresh_db, monkeypatch):
    # archidekt: returns nothing; mtggoldfish: raises NotImplementedError.
    async def empty_fetch(self, format="commander", limit=20):
        return []
    monkeypatch.setattr(ArchidektAdapter, "fetch_recent", empty_fetch)

    report = await orchestrator.run_daily(
        sources=["archidekt", "mtggoldfish"], formats=["commander"], per_source_limit=5
    )
    by_source = {s.source: s for s in report.per_source}
    assert by_source["mtggoldfish"].error is not None
    assert "not implemented" in by_source["mtggoldfish"].error


# --- Corpus tools registered & wired ----------------------------------------

async def test_phase4_tools_registered():
    mcp = build_server()
    names = {t.name for t in await mcp.list_tools()}
    assert "search_decklists" in names
    assert "get_decklist_cards" in names
    assert "popular_cards_for_commander" in names
    assert "popular_cards_in_archetype" in names
    assert "corpus_status" in names
