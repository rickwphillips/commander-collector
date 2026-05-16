"""Phase 5 — feedback loop tests. No network."""

from __future__ import annotations

import asyncio
import os
import tempfile
from pathlib import Path

import pytest

from commander_mcp.learning import weights


# --- pure math ---------------------------------------------------------------
def test_update_weight_first_event_equals_delta():
    w, n = weights.update_weight(0.0, 0, +1.0)
    assert w == 1.0 and n == 1
    w, n = weights.update_weight(0.0, 0, -1.0)
    assert w == -1.0 and n == 1


def test_update_weight_runs_running_mean():
    # Two confirmations then one correction = +1, +1, -1 -> mean 1/3.
    w, n = weights.update_weight(0.0, 0, +1.0)
    w, n = weights.update_weight(w, n, +1.0)
    w, n = weights.update_weight(w, n, -1.0)
    assert n == 3
    assert abs(w - (1.0 / 3.0)) < 1e-9


def test_update_weight_clamps_to_bounds():
    # Even with floating-point drift, weight cannot exceed [-1, +1].
    w, n = 0.0, 0
    for _ in range(50):
        w, n = weights.update_weight(w, n, +1.0)
    assert w <= 1.0
    for _ in range(100):
        w, n = weights.update_weight(w, n, -1.0)
    assert w >= -1.0


def test_blend_alpha_grows_with_samples():
    assert weights.blend_alpha(0) == 0.0
    a1 = weights.blend_alpha(1)
    a10 = weights.blend_alpha(10)
    a100 = weights.blend_alpha(100)
    assert 0 < a1 < a10 < a100 < 1.0


def test_blend_zero_samples_returns_heuristic():
    assert weights.blend_heuristic_with_learned(0.5, 0.9, 0) == 0.5
    assert weights.blend_heuristic_with_learned(0.0, -1.0, 0) == 0.0


def test_blend_many_samples_dominated_by_learned():
    # With 1000 events, alpha is ~0.996; blended ≈ learned.
    blended = weights.blend_heuristic_with_learned(0.5, -0.8, 1000)
    assert blended < 0  # learned signal dominates
    assert abs(blended - (-0.8)) < 0.01


def test_canonical_pair_orders_lexicographically():
    assert weights.canonical_pair("Sol Ring", "Atraxa") == ("Atraxa", "Sol Ring")
    assert weights.canonical_pair("a", "b") == ("a", "b")


def test_canonical_pair_rejects_self_pair():
    with pytest.raises(ValueError):
        weights.canonical_pair("Sol Ring", "Sol Ring")


# --- repo round-trip ---------------------------------------------------------
# These tests spin up a real (temp) SQLite, run init_db, then exercise the
# repo. Slow-ish but worth it: the SQL is the load-bearing piece.

@pytest.fixture
def temp_db(monkeypatch):
    """Point settings.db_path at a temp file and run init_db."""
    from commander_mcp import config
    from commander_mcp.db.connection import init_db

    fd, path = tempfile.mkstemp(suffix=".sqlite")
    os.close(fd)
    p = Path(path)
    monkeypatch.setattr(config.settings, "db_path", p)
    asyncio.run(init_db())
    yield p
    try:
        p.unlink()
    except FileNotFoundError:
        pass


def test_record_confirmation_then_read_back(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        result = await feedback_repo.record_feedback(
            kind="confirmation",
            claim="Atraxa and Inexorable Tide work well together.",
            correction=None,
            cards_involved=["Atraxa, Praetors' Voice", "Inexorable Tide"],
            context="commander/atraxa-toxic",
        )
        assert result["event_id"] is not None
        assert result["weight_delta"] == +1.0
        assert len(result["pairs_updated"]) == 1

        row = await feedback_repo.get_synergy_weight(
            "Inexorable Tide", "Atraxa, Praetors' Voice",  # any order
            context="commander/atraxa-toxic",
        )
        assert row is not None
        assert row["weight"] == 1.0
        assert row["sample_size"] == 1

    asyncio.run(go())


def test_correction_after_confirmation_averages(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        cards = ["Card A", "Card B"]
        await feedback_repo.record_feedback(
            kind="confirmation",
            claim="A and B synergize.",
            correction=None,
            cards_involved=cards,
            context="ctx1",
        )
        await feedback_repo.record_feedback(
            kind="correction",
            claim="A and B synergize.",
            correction="Actually they fight for the same slot.",
            cards_involved=cards,
            context="ctx1",
        )
        row = await feedback_repo.get_synergy_weight("Card A", "Card B", context="ctx1")
        assert row["sample_size"] == 2
        assert abs(row["weight"] - 0.0) < 1e-9  # (+1 + -1) / 2 == 0

    asyncio.run(go())


def test_uncertainty_logs_but_does_not_move_weight(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        result = await feedback_repo.record_feedback(
            kind="uncertainty",
            claim="Maybe X and Y combo?",
            correction=None,
            cards_involved=["X", "Y"],
            context="ctx2",
        )
        assert result["weight_delta"] == 0.0
        assert result["pairs_updated"] == []  # no weight rows touched
        assert await feedback_repo.get_synergy_weight("X", "Y", context="ctx2") is None

    asyncio.run(go())


def test_three_cards_create_three_pairs(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        result = await feedback_repo.record_feedback(
            kind="confirmation",
            claim="All three of these combo together.",
            correction=None,
            cards_involved=["A", "B", "C"],
            context="ctx3",
        )
        # 3 choose 2 = 3 pairs
        assert len(result["pairs_updated"]) == 3
        pairs = {(p["card_a"], p["card_b"]) for p in result["pairs_updated"]}
        assert pairs == {("A", "B"), ("A", "C"), ("B", "C")}

    asyncio.run(go())


def test_batch_lookup(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        await feedback_repo.record_feedback(
            kind="confirmation",
            claim="combo",
            correction=None,
            cards_involved=["P", "Q"],
            context="b",
        )
        results = await feedback_repo.get_synergy_weights_batch(
            [("P", "Q"), ("nonexistent", "pair")], context="b"
        )
        assert ("P", "Q") in results
        assert ("nonexistent", "pair") not in results

    asyncio.run(go())


def test_top_learned_picks_extremes(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        # Three confirmations of A,B -> weight +1
        for _ in range(3):
            await feedback_repo.record_feedback(
                kind="confirmation", claim="x", correction=None,
                cards_involved=["A", "B"], context="t",
            )
        # Two corrections of C,D -> weight -1
        for _ in range(2):
            await feedback_repo.record_feedback(
                kind="correction", claim="y", correction="no",
                cards_involved=["C", "D"], context="t",
            )

        positive = await feedback_repo.top_learned_synergies(
            context="t", direction="positive", min_sample_size=2, limit=5
        )
        assert positive[0]["card_a"] == "A" and positive[0]["card_b"] == "B"

        negative = await feedback_repo.top_learned_synergies(
            context="t", direction="negative", min_sample_size=2, limit=5
        )
        assert negative[0]["card_a"] == "C" and negative[0]["card_b"] == "D"

    asyncio.run(go())


def test_feedback_stats(temp_db):
    from commander_mcp.db import feedback_repo

    async def go():
        await feedback_repo.record_feedback(
            kind="confirmation", claim="x", correction=None,
            cards_involved=["A", "B"], context="s",
        )
        await feedback_repo.record_feedback(
            kind="correction", claim="y", correction="no",
            cards_involved=["A", "B"], context="s",
        )
        stats = await feedback_repo.feedback_stats()
        assert stats["events_total"] == 2
        assert stats["events_by_kind"]["confirmation"] == 1
        assert stats["events_by_kind"]["correction"] == 1
        assert stats["pairs_with_weight"] == 1
        assert stats["pairs_with_two_or_more_samples"] == 1

    asyncio.run(go())


# --- learning-aware synergy scorer ------------------------------------------
def test_synergy_learned_blends(temp_db):
    from commander_mcp.db import feedback_repo
    from commander_mcp.services import synergy_learned

    async def go():
        # Record a STRONG negative on the elf pair so the learned weight
        # overwhelms a positive heuristic match.
        for _ in range(10):
            await feedback_repo.record_feedback(
                kind="correction", claim="elves bad", correction="trust me",
                cards_involved=["Llanowar Elves", "Elvish Mystic"],
                context="ctx",
            )

        found = {
            "Llanowar Elves": {
                "name": "Llanowar Elves",
                "type_line": "Creature — Elf Druid",
                "oracle_text": "{T}: Add {G}.",
                "keywords": [],
            },
            "Elvish Mystic": {
                "name": "Elvish Mystic",
                "type_line": "Creature — Elf Druid",
                "oracle_text": "{T}: Add {G}.",
                "keywords": [],
            },
        }
        pairs = await synergy_learned.synergies_in_deck_with_learning(
            found, context="ctx", top_n=5
        )
        assert len(pairs) == 1
        p = pairs[0]
        assert p["heuristic_score"] > 0   # tribe match
        assert p["learned_weight"] == -1.0
        assert p["sample_size"] == 10
        assert p["blended_score"] < 0      # learned dominates

    asyncio.run(go())


# --- tool registration -------------------------------------------------------
def test_learning_tools_registered():
    from commander_mcp.server import build_server

    mcp = build_server()
    names = {t.name for t in asyncio.run(mcp.list_tools())}
    assert "record_feedback" in names
    assert "get_learned_synergy" in names
    assert "top_learned_synergies" in names
    assert "review_feedback_log" in names
    assert "learning_status" in names
    # And the deck tools that depend on Phase 5:
    assert "identify_synergies" in names
    assert "identify_anti_patterns" in names
