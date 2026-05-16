"""Unit tests for the synergy heuristic. No network, no DB."""

from commander_mcp.services import synergy


def _card(name, type_line, oracle="", cmc=2, ci=None, kw=None, legalities=None):
    return {
        "name": name,
        "type_line": type_line,
        "oracle_text": oracle,
        "cmc": cmc,
        "color_identity": ci or [],
        "keywords": kw or [],
        "legalities": legalities or {"commander": "legal"},
    }


def test_synergy_shared_tribe():
    elf_a = _card("Llanowar Elves", "Creature — Elf Druid", ci=["G"])
    elf_b = _card("Elvish Mystic", "Creature — Elf Druid", ci=["G"])
    result = synergy.score_pair(elf_a, elf_b)
    assert result["score"] > 0
    assert any("tribe" in r for r in result["reasons"])


def test_synergy_shared_keyword():
    a = _card("A", "Creature", kw=["Toxic", "Flying"])
    b = _card("B", "Creature", kw=["Toxic"])
    result = synergy.score_pair(a, b)
    assert result["score"] > 0
    assert any("toxic" in r.lower() for r in result["reasons"])


def test_synergy_mechanical_overlap():
    a = _card("A", "Instant", oracle="Proliferate. Each player gets a poison counter.")
    b = _card("B", "Creature", oracle="When this creature deals combat damage, proliferate.")
    result = synergy.score_pair(a, b)
    assert result["score"] > 0
    reasons = " ".join(result["reasons"])
    assert "proliferate" in reasons.lower()


def test_synergy_no_overlap_zero():
    a = _card("A", "Instant", oracle="Counter target spell.")
    b = _card("B", "Creature — Bear", oracle="")
    result = synergy.score_pair(a, b)
    assert result["score"] == 0.0


def test_synergy_score_is_capped_at_one():
    """Pile up tribe + keywords + mechanical overlap; score should clamp to 1.0."""
    a = _card(
        "A", "Creature — Elf Druid",
        oracle="Proliferate. Sacrifice a creature. Each player gets a poison counter. +1/+1 counter.",
        kw=["Toxic", "Flying", "Trample"],
    )
    b = _card(
        "B", "Creature — Elf Druid",
        oracle="Proliferate. Sacrifice a creature. Each player gets a poison counter. +1/+1 counter.",
        kw=["Toxic", "Flying", "Trample"],
    )
    result = synergy.score_pair(a, b)
    assert result["score"] <= 1.0
    assert result["score"] > 0.5
