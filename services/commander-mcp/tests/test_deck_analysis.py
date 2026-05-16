"""Unit tests for the deck_analysis module."""

from commander_mcp.services import deck_analysis
from commander_mcp.services.decklist import DeckEntry


def _card(
    name: str,
    *,
    type_line: str = "Creature — Goblin",
    cmc: float = 1,
    color_identity: list[str] | None = None,
    oracle_text: str = "",
    keywords: list[str] | None = None,
) -> dict:
    return {
        "name": name,
        "type_line": type_line,
        "cmc": cmc,
        "color_identity": color_identity or [],
        "oracle_text": oracle_text,
        "keywords": keywords or [],
    }


def test_color_identity_union_orders_wubrg():
    cards = [
        _card("a", color_identity=["G"]),
        _card("b", color_identity=["B", "R"]),
        _card("c", color_identity=["R"]),
    ]
    assert deck_analysis.color_identity_union(cards) == ["B", "R", "G"]


def test_mana_curve_excludes_lands_and_buckets_7plus():
    cards = [
        _card("Forest", type_line="Basic Land — Forest", cmc=0),
        _card("Bolt", cmc=1),
        _card("Bolt2", cmc=1),
        _card("Big", cmc=8),
        _card("Bigger", cmc=12),
    ]
    curve = deck_analysis.mana_curve(cards)
    assert curve["0"] == 0  # land excluded
    assert curve["1"] == 2
    assert curve["7+"] == 2


def test_type_distribution_primary_type_wins():
    # Artifact Creature counts as Creature (primary type checked first).
    cards = [
        _card("Walker", type_line="Artifact Creature — Construct"),
        _card("Sol Ring", type_line="Artifact"),
        _card("Lightning Bolt", type_line="Instant"),
        _card("Forest", type_line="Basic Land — Forest"),
    ]
    dist = deck_analysis.type_distribution(cards)
    assert dist["Creature"] == 1
    assert dist["Artifact"] == 1
    assert dist["Instant"] == 1
    assert dist["Land"] == 1


def test_role_buckets_detect_ramp_draw_removal():
    cards = [
        _card("Llanowar Elves", oracle_text="{T}: Add {G}."),
        _card("Cultivate", oracle_text="Search your library for up to two basic land cards..."),
        _card("Divination", oracle_text="Draw two cards."),
        _card("Doom Blade", oracle_text="Destroy target nonblack creature."),
        _card("Counterspell", oracle_text="Counter target spell."),
        _card("Vanilla", oracle_text="A normal creature."),
    ]
    roles = deck_analysis.role_buckets(cards)
    assert "Llanowar Elves" in roles["ramp"]
    assert "Cultivate" in roles["ramp"]
    assert "Divination" in roles["draw"]
    assert "Doom Blade" in roles["removal"]
    assert "Counterspell" in roles["removal"]
    assert "Counterspell" in roles["interaction"]
    assert "Vanilla" not in (roles["ramp"] + roles["draw"] + roles["removal"])


def test_keyword_density():
    cards = [
        _card("a", keywords=["Toxic", "Flying"]),
        _card("b", keywords=["Toxic"]),
        _card("c", keywords=["Flying", "Vigilance"]),
    ]
    top = dict(deck_analysis.keyword_density(cards))
    assert top["Toxic"] == 2
    assert top["Flying"] == 2
    assert top["Vigilance"] == 1


def test_land_count_and_average_cmc():
    cards = [
        _card("Forest", type_line="Basic Land — Forest", cmc=0),
        _card("Mountain", type_line="Basic Land — Mountain", cmc=0),
        _card("Bolt", cmc=1),
        _card("Big", cmc=5),
    ]
    assert deck_analysis.land_count(cards) == 2
    # Average over nonland: (1 + 5) / 2 = 3.0
    assert deck_analysis.average_cmc(cards) == 3.0


def test_weak_spots_flag_low_lands_ramp_draw_removal():
    cards = [_card(f"x{i}", oracle_text="vanilla") for i in range(60)]  # 60 cards, no lands/ramp/draw/removal
    warnings = deck_analysis.detect_weak_spots(cards, target_deck_size=100)
    # 60 < 100 → resolved-count warning
    assert any("Only 60 cards resolved" in w for w in warnings)
    assert any("Land count is low" in w for w in warnings)
    assert any("Ramp count is light" in w for w in warnings)
    assert any("Card-draw count is light" in w for w in warnings)
    assert any("Removal/interaction is light" in w for w in warnings)


def test_analyze_full_report_shape():
    cards = [
        _card("Atraxa", type_line="Legendary Creature — Phyrexian Angel Horror", cmc=4, color_identity=["W","U","B","G"]),
        _card("Forest", type_line="Basic Land — Forest", cmc=0),
    ]
    entries = [
        DeckEntry(name="Atraxa", quantity=1, role="commander"),
        DeckEntry(name="Forest", quantity=1, role="mainboard"),
    ]
    report = deck_analysis.analyze(cards, entries=entries, missing=["Phantom Card"])
    assert report["totals"]["resolved_cards"] == 2
    assert report["totals"]["missing"] == ["Phantom Card"]
    assert report["commanders"] == ["Atraxa"]
    assert "W" in report["color_identity"]
    assert "type_distribution" in report
    assert "roles" in report
    assert "warnings" in report
