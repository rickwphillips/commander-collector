"""Decklist parser unit tests."""

from commander_mcp.services.decklist import parse_decklist


def test_bare_name():
    out = parse_decklist(["Sol Ring"])
    assert len(out) == 1
    assert out[0].name == "Sol Ring"
    assert out[0].quantity == 1
    assert out[0].role == "mainboard"


def test_quantity_prefix_variants():
    out = parse_decklist(["1 Sol Ring", "1x Sol Ring", "4 Forest", "10x Forest"])
    by_name = {e.name: e.quantity for e in out}
    # "Sol Ring" entries coalesce; "Forest" entries coalesce
    assert by_name["Sol Ring"] == 2
    assert by_name["Forest"] == 14


def test_strips_set_codes():
    out = parse_decklist(["1 Sol Ring (NEO) 123", "Lightning Bolt (LEA) 161"])
    names = sorted(e.name for e in out)
    assert names == ["Lightning Bolt", "Sol Ring"]


def test_commander_markers():
    out = parse_decklist([
        "*CMDR* Atraxa, Praetors' Voice",
        "CMDR: Yawgmoth, Thran Physician",
        "1 Sol Ring",
    ])
    cmdr_names = {e.name for e in out if e.role == "commander"}
    assert "Atraxa, Praetors' Voice" in cmdr_names
    assert "Yawgmoth, Thran Physician" in cmdr_names
    main_names = {e.name for e in out if e.role == "mainboard"}
    assert "Sol Ring" in main_names


def test_sideboard_section_marker():
    out = parse_decklist([
        "4 Lightning Bolt",
        "SIDEBOARD",
        "2 Negate",
        "1 Pithing Needle",
    ])
    roles = {e.name: e.role for e in out}
    assert roles["Lightning Bolt"] == "mainboard"
    assert roles["Negate"] == "sideboard"
    assert roles["Pithing Needle"] == "sideboard"


def test_sb_inline_prefix():
    out = parse_decklist(["SB: 2 Negate", "SB: 1 Duress"])
    assert {e.role for e in out} == {"sideboard"}


def test_commander_hint_promotes():
    out = parse_decklist(
        ["1 Atraxa, Praetors' Voice", "1 Sol Ring"],
        commander_hint="Atraxa, Praetors' Voice",
    )
    by_name = {e.name: e.role for e in out}
    assert by_name["Atraxa, Praetors' Voice"] == "commander"
    assert by_name["Sol Ring"] == "mainboard"


def test_comments_and_blanks_skipped():
    out = parse_decklist([
        "// the ramp",
        "",
        "# more comments",
        "1 Sol Ring",
    ])
    assert len(out) == 1
    assert out[0].name == "Sol Ring"


def test_empty_input():
    assert parse_decklist([]) == []
    assert parse_decklist(["", "  ", "// only a comment"]) == []
