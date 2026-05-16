"""Unit tests for the Comprehensive Rules parser."""

from commander_mcp.services.rules_loader import CRParser
from tests.fixtures import SAMPLE_CR_TEXT


def test_metadata_capture():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    assert parsed.metadata["effective_date"] == "January 1, 2099"


def test_sections_parsed():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    numbers = {s.number for s in parsed.sections}
    # Contents and body both produce the same section line — must be deduped.
    assert numbers == {"100", "101", "613"}
    sec_613 = next(s for s in parsed.sections if s.number == "613")
    assert sec_613.chapter == "6"
    assert sec_613.title == "Interaction of Continuous Effects"


def test_top_level_rule_and_continuation():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    r = next(r for r in parsed.rules if r.rule_number == "100.1")
    assert "Test rule body line one." in r.body
    # The continuation line should be folded in.
    assert "continuation line" in r.body
    assert r.parent is None


def test_subrules_parsed_with_examples():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    r = next(r for r in parsed.rules if r.rule_number == "100.1b")
    assert r.parent == "100.1"
    assert "Subrule body for letter b." in r.body
    assert len(r.examples) == 2
    assert r.examples[0] == "A flavor example sentence."
    assert r.examples[1] == "A second example."


def test_layer_subrules_present():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    layer_rules = [r for r in parsed.rules if r.rule_number.startswith("613.1")]
    # 613.1 + 613.1a..613.1g = 8 rules
    assert len(layer_rules) == 8
    for n in range(1, 8):
        match = next(r for r in layer_rules if f"Layer {n}:" in r.body)
        assert match.parent == "613.1"


def test_glossary_parsed():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    terms = {g.term: g.definition for g in parsed.glossary}
    assert "Active Player" in terms
    assert terms["Active Player"] == "The player whose turn it is."
    assert "See rule 903.10." in terms["Commander Damage"]
    assert "Toxic" in terms


def test_credits_not_in_glossary():
    parsed = CRParser().parse(SAMPLE_CR_TEXT)
    # No glossary term should be "Magic: The Gathering was designed..." etc.
    for entry in parsed.glossary:
        assert "Richard Garfield" not in entry.term
        assert "Richard Garfield" not in entry.definition
