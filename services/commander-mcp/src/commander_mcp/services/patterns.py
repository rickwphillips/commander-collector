"""
Pattern markdown parser + card extractor.

Source files live at mtg-rules/interactions/*.md and have the shape:

    ---
    id: p001
    name: ...
    category: combat
    cr_refs: [510.1d, 702.2]
    tags: [trample, deathtouch]
    created: 2026-03-28
    examples_count: 4
    ---

    # P001 - ...
    ## Abstract
    ...
    ## Commonly Confused With
    - [P007](p007-...md) - ...

Pure logic, no I/O. The ingest script reads files and passes contents in.
"""

from __future__ import annotations

import re
from pathlib import Path

from commander_mcp.db.patterns_repo import ParsedPattern


_FRONTMATTER_RE = re.compile(r"^---\s*$(.*?)^---\s*$", re.MULTILINE | re.DOTALL)
_XREF_RE = re.compile(r"\[(P\d{3,4})\]", re.IGNORECASE)
_PATTERN_ID_RE = re.compile(r"^p\d{3,4}", re.IGNORECASE)
_CAP_PHRASE_RE = re.compile(
    r"\b([A-Z][a-zA-Z'’\-]+(?:\s+(?:of\s+|the\s+|and\s+|to\s+|in\s+|from\s+)?[A-Z][a-zA-Z'’\-]+){0,5})\b"
)

# Single-word card names that overlap with common MTG vocabulary. These ARE
# real cards, but in rules-prose context they almost always refer to the
# keyword/action/concept of the same name. Filtering them avoids huge false-
# positive bloat in the verified_pattern_card table.
_AMBIGUOUS_SINGLE_WORDS = {
    # basic lands
    "forest", "island", "swamp", "mountain", "plains", "wastes",
    # keyword actions and effect verbs
    "sacrifice", "regeneration", "exile", "return", "destroy", "counter",
    "copy", "attach", "scry", "reveal", "search", "shuffle", "tap", "untap",
    "discard", "cycling", "investigate", "explore", "transform", "flicker",
    "bounce", "draw", "mill", "fight", "block", "attack", "create", "transform",
    # text-reference words
    "oracle", "tracker", "champion", "knight", "soldier", "wizard", "spirit",
    "treasure", "clue", "food", "blood", "powerstone", "incubator",
    "token", "permanent", "creature", "artifact", "enchantment", "planeswalker",
}
_FOIL_HEADING = "Commonly Confused With"
_EXAMPLES_HEADING = "Additional Examples"


def parse_pattern_file(
    path: Path,
    *,
    source_root: Path,
    card_names_lc: set[str] | None = None,
) -> ParsedPattern | None:
    """
    Parse a single pattern markdown file into a ParsedPattern.

    Returns None if the file does not look like a pattern (no frontmatter, no id).
    `card_names_lc` is a lowercased canonical-name set for matching cards in the
    text. If None, card extraction is skipped (the pattern still ingests).
    """
    text = path.read_text(encoding="utf-8")
    m = _FRONTMATTER_RE.search(text)
    if not m:
        return None
    fm_text = m.group(1)
    body = text[m.end():].lstrip("\n")

    fm = _parse_frontmatter(fm_text)
    pattern_id = (fm.get("id") or "").strip().lower()
    if not pattern_id or not _PATTERN_ID_RE.match(pattern_id):
        return None

    name = fm.get("name") or pattern_id.upper()
    category = (fm.get("category") or "").strip() or None
    cr_refs = _coerce_list(fm.get("cr_refs"))
    tags = _coerce_list(fm.get("tags"))
    created_at = (fm.get("created") or "").strip() or None

    abstract = _extract_section(body, "Abstract")
    foil_section = _extract_section(body, _FOIL_HEADING)
    examples_section = _extract_section(body, _EXAMPLES_HEADING)
    xrefs = _extract_xrefs(foil_section)

    # Card extraction across three signals
    cards: list[tuple[str, str]] = []
    if card_names_lc:
        subjects = _cards_from_filename(path.stem, card_names_lc)
        subjects |= _cards_from_tags(tags, card_names_lc)
        cards.extend((c, "subject") for c in sorted(subjects))

        foil_cards = _cards_from_prose(foil_section, card_names_lc) - subjects
        cards.extend((c, "foil") for c in sorted(foil_cards))

        example_cards = (
            _cards_from_prose(examples_section, card_names_lc)
            - subjects - foil_cards
        )
        cards.extend((c, "example") for c in sorted(example_cards))

        # Remaining prose matches anywhere in the body.
        body_cards = (
            _cards_from_prose(body, card_names_lc)
            - subjects - foil_cards - example_cards
        )
        cards.extend((c, "mentioned") for c in sorted(body_cards))

    return ParsedPattern(
        pattern_id=pattern_id,
        name=name,
        category=category,
        cr_refs=cr_refs,
        tags=tags,
        abstract=abstract,
        body=body,
        source_path=str(path.relative_to(source_root)),
        created_at=created_at,
        cards=cards,
        xrefs=[x.lower() for x in xrefs],
    )


def _parse_frontmatter(text: str) -> dict[str, str]:
    """
    Hand-rolled YAML subset parser.

    Handles:
      key: scalar              -> {'key': 'scalar'}
      key: [a, b, c]           -> {'key': '[a, b, c]'}      (caller coerces)
      key: a, b, c             -> {'key': 'a, b, c'}        (caller coerces)
      key: "quoted with - dash" -> {'key': 'quoted with - dash'}
    Skips continuation lines (none of the pattern files use them today).
    """
    out: dict[str, str] = {}
    for line in text.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        # Strip wrapping quotes if balanced.
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        out[key] = value
    return out


def _coerce_list(raw: str | None) -> list[str]:
    """
    Accept bracketed (`[a, b]`) or unbracketed (`a, b`) flow sequences. Always
    returns a list of trimmed strings, possibly empty.
    """
    if not raw:
        return []
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        raw = raw[1:-1]
    parts = [p.strip().strip('"').strip("'") for p in raw.split(",")]
    return [p for p in parts if p]


def _extract_section(body: str, heading: str) -> str:
    """
    Return the text under '## {heading}' up to the next '## ' or EOF.
    Heading match is case-insensitive on the leading word(s).
    """
    pattern = re.compile(
        rf"^##\s+{re.escape(heading)}\s*$(.*?)(?=^##\s+|\Z)",
        re.MULTILINE | re.DOTALL | re.IGNORECASE,
    )
    m = pattern.search(body)
    return m.group(1).strip() if m else ""


def _extract_xrefs(text: str) -> list[str]:
    """All [Pxxx] / [Pxxxx] references inside the given chunk."""
    return [m.group(1) for m in _XREF_RE.finditer(text)]


def _cards_from_filename(stem: str, names_lc: set[str]) -> set[str]:
    """
    Match longest contiguous runs of slug words against the card-name set.
    `stem` looks like 'p754-endure-tdm-pawn-of-ulamog-...'.
    """
    parts = stem.split("-")
    # drop leading pattern id token
    if parts and _PATTERN_ID_RE.match(parts[0]):
        parts = parts[1:]
    return _longest_match_run(parts, names_lc)


def _cards_from_tags(tags: list[str], names_lc: set[str]) -> set[str]:
    out: set[str] = set()
    for tag in tags:
        norm = tag.strip().lower().replace("_", "-")
        candidate = norm.replace("-", " ")
        if candidate in names_lc:
            out.add(candidate)
    return out


def _cards_from_prose(text: str, names_lc: set[str]) -> set[str]:
    if not text:
        return set()
    out: set[str] = set()
    for m in _CAP_PHRASE_RE.finditer(text):
        phrase = m.group(1)
        # Try the full phrase, then shrink from the right.
        words = phrase.split()
        n = len(words)
        while n >= 1:
            candidate = " ".join(words[:n]).lower()
            if candidate in names_lc and candidate not in _AMBIGUOUS_SINGLE_WORDS:
                out.add(candidate)
                break
            n -= 1
    return out


def _longest_match_run(parts: list[str], names_lc: set[str]) -> set[str]:
    """
    Walk a token list left-to-right, greedy-longest-match against the name set.
    Returns lowercase card names that matched.
    """
    out: set[str] = set()
    i = 0
    while i < len(parts):
        # Try from current position outward, longest first (up to 6 tokens).
        matched = None
        for span in range(min(6, len(parts) - i), 0, -1):
            candidate = " ".join(parts[i : i + span]).lower()
            if candidate in names_lc and candidate not in _AMBIGUOUS_SINGLE_WORDS:
                matched = (candidate, span)
                break
        if matched is None:
            i += 1
        else:
            out.add(matched[0])
            i += matched[1]
    return out
