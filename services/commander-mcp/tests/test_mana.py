"""Unit tests for the mana-cost decomposer."""

from commander_mcp.services.mana import decompose


def test_empty_cost():
    r = decompose("")
    assert r["mana_value"] == 0
    assert r["color_identity"] == []
    assert r["symbols"] == []


def test_pure_generic():
    r = decompose("{3}")
    assert r["mana_value"] == 3
    assert r["color_identity"] == []
    assert r["symbols"][0]["kind"] == "generic"


def test_variable_x_contributes_zero():
    r = decompose("{X}{X}{R}")
    assert r["mana_value"] == 1
    assert r["color_identity"] == ["R"]
    kinds = [s["kind"] for s in r["symbols"]]
    assert kinds == ["variable", "variable", "colored"]


def test_simple_colored():
    r = decompose("{W}{U}{B}{R}{G}")
    assert r["mana_value"] == 5
    # Color identity must be WUBRG-ordered
    assert r["color_identity"] == ["W", "U", "B", "R", "G"]


def test_colorless_and_snow():
    r = decompose("{C}{S}")
    assert r["mana_value"] == 2  # both count as 1 toward mana value
    assert r["color_identity"] == []
    kinds = [s["kind"] for s in r["symbols"]]
    assert kinds == ["colorless", "snow"]


def test_mono_color_hybrid():
    # Boros Reckoner: three pips of red/white hybrid
    r = decompose("{R/W}{R/W}{R/W}")
    assert r["mana_value"] == 3
    assert r["color_identity"] == ["W", "R"]
    for s in r["symbols"]:
        assert s["kind"] == "hybrid"
        assert sorted(s["colors"]) == ["R", "W"]


def test_twobrid_counts_two_toward_mana_value():
    # Spectral Procession: three twobrid-white pips → CMC 6, color identity = W
    r = decompose("{2/W}{2/W}{2/W}")
    assert r["mana_value"] == 6
    assert r["color_identity"] == ["W"]
    for s in r["symbols"]:
        assert s["kind"] == "twobrid"
        assert s["colors"] == ["W"]
        assert s["cmc_contribution"] == 2


def test_phyrexian_monocolor():
    # Birthing Pod: {1}{G/P}
    r = decompose("{1}{G/P}")
    assert r["mana_value"] == 2
    assert r["color_identity"] == ["G"]
    phy = r["symbols"][1]
    assert phy["kind"] == "phyrexian"
    assert phy["colors"] == ["G"]
    assert "2 life" in phy["notes"]


def test_hybrid_phyrexian():
    # March of Otherworldly Light: {X}{W/U/P}
    r = decompose("{X}{W/U/P}")
    assert r["mana_value"] == 1
    assert r["color_identity"] == ["W", "U"]
    hp = r["symbols"][1]
    assert hp["kind"] == "hybrid_phyrexian"
    assert sorted(hp["colors"]) == ["U", "W"]


def test_reaper_king_five_color_twobrid():
    # Reaper King: {2/W}{2/U}{2/B}{2/R}{2/G}
    r = decompose("{2/W}{2/U}{2/B}{2/R}{2/G}")
    assert r["mana_value"] == 10
    assert r["color_identity"] == ["W", "U", "B", "R", "G"]
    assert r["totals"]["twobrid"] == 5


def test_mixed_real_world_cost():
    # Made-up but exercises everything at once
    r = decompose("{2/W}{W/U}{G/P}{X}{C}{S}{3}")
    assert r["mana_value"] == (2 + 1 + 1 + 0 + 1 + 1 + 3)
    assert r["color_identity"] == ["W", "U", "G"]
    totals = r["totals"]
    assert totals["twobrid"] == 1
    assert totals["hybrid"] == 1
    assert totals["phyrexian"] == 1
    assert totals["variable"] == 1
    assert totals["colorless"] == 1
    assert totals["snow"] == 1
    assert totals["generic"] == 1


def test_unrecognized_symbol_falls_back():
    r = decompose("{Z}{??}")  # {Z} is valid variable; {??} is gibberish
    assert any(s["kind"] == "unknown" for s in r["symbols"])
