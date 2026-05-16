"""
Deck analysis primitives.

All functions in this module operate on already-resolved Scryfall card
payloads (the dicts returned by /cards/named or /cards/collection). The
tools layer handles the network/IO; this module is pure logic and easy
to unit-test.

The metrics here are objective — they don't rely on learned weights.
That comes later in Phase 5. Right now we compute things any spreadsheet
could compute: curve, colors, type mix, keyword density, land count,
role buckets via oracle-text heuristics, weak-spot warnings.
"""

from __future__ import annotations

import re
from collections import Counter
from typing import Any

from commander_mcp.services.decklist import DeckEntry


# Five WUBRG colors plus C for colorless reference. We use Scryfall's letters.
_COLORS = ("W", "U", "B", "R", "G")

# Role classifier patterns. Each rule fires on a regex over the lowercase
# oracle text. A card can match multiple roles (a Cultivate is ramp + draw-ish).
_ROLE_PATTERNS: dict[str, list[re.Pattern[str]]] = {
    "ramp": [
        re.compile(r"\badd \{[wubrgc]\}"),                       # mana dorks/rocks
        re.compile(r"\bsearch your library for [^.]*?\bland"),    # any land-search (Cultivate, Kodama's Reach, fetch lands)
        re.compile(r"\bput (?:a |that |those |it )?land(?:s)? card(?:s)? onto the battlefield"),
        re.compile(r"\btreasure token"),                          # treasures as ramp
    ],
    "draw": [
        re.compile(r"\bdraws? (?:a|two|three|four|x|that many) cards?\b"),
        re.compile(r"\bdraw cards equal"),
    ],
    "removal": [
        re.compile(r"\bdestroy target\b"),
        re.compile(r"\bexile target\b"),
        re.compile(r"\bcounter target\b"),
        re.compile(r"\b-\d+/-\d+\b"),                             # -2/-2 etc.
        re.compile(r"\breturn target .* to (its|their) owner'?s? hand"),  # bounce
        re.compile(r"\bdeal[s]? \d+ damage to (?:any target|target creature|target planeswalker)"),
    ],
    "interaction": [
        re.compile(r"\bcounter target spell\b"),
        re.compile(r"\bhexproof\b"),
        re.compile(r"\bindestructible\b"),
        re.compile(r"\bprotection from\b"),
    ],
    "wincon": [
        re.compile(r"\beach (?:other )?(?:opponent|player) loses the game"),
        re.compile(r"\bwins the game\b"),
        re.compile(r"\bcombat damage to a player by a commander"),
    ],
}


def color_identity_union(cards: list[dict[str, Any]]) -> list[str]:
    """Union of color_identity across all cards, ordered WUBRG."""
    seen: set[str] = set()
    for c in cards:
        for letter in c.get("color_identity", []) or []:
            seen.add(letter)
    return [c for c in _COLORS if c in seen]


def mana_curve(cards: list[dict[str, Any]]) -> dict[str, int]:
    """
    Histogram of converted mana cost, bucketed 0..7+. Lands are excluded
    (their `cmc` is 0 but they aren't really part of a 'curve').
    """
    buckets: dict[str, int] = {str(i): 0 for i in range(7)}
    buckets["7+"] = 0
    for c in cards:
        if _is_land(c):
            continue
        cmc = int(c.get("cmc") or 0)
        key = str(cmc) if cmc < 7 else "7+"
        buckets[key] = buckets.get(key, 0) + 1
    return buckets


def type_distribution(cards: list[dict[str, Any]]) -> dict[str, int]:
    """Count cards whose primary type-line tokens match each major type."""
    types = [
        "Creature", "Instant", "Sorcery", "Enchantment", "Artifact",
        "Planeswalker", "Battle", "Land",
    ]
    counts: dict[str, int] = {t: 0 for t in types}
    for c in cards:
        type_line = c.get("type_line", "") or ""
        for t in types:
            if t in type_line:
                counts[t] += 1
                break  # primary type wins; avoid double-counting Artifact Creature
    return counts


def role_buckets(cards: list[dict[str, Any]]) -> dict[str, list[str]]:
    """Classify each card into 0+ roles via oracle-text regex matching."""
    out: dict[str, list[str]] = {role: [] for role in _ROLE_PATTERNS}
    for c in cards:
        text = (c.get("oracle_text") or "").lower()
        name = c.get("name", "<unknown>")
        for role, patterns in _ROLE_PATTERNS.items():
            if any(p.search(text) for p in patterns):
                out[role].append(name)
    return out


def keyword_density(cards: list[dict[str, Any]], top: int = 15) -> list[tuple[str, int]]:
    """Most common Scryfall-declared keywords across the deck."""
    counter: Counter[str] = Counter()
    for c in cards:
        for kw in c.get("keywords", []) or []:
            counter[kw] += 1
    return counter.most_common(top)


def land_count(cards: list[dict[str, Any]]) -> int:
    return sum(1 for c in cards if _is_land(c))


def average_cmc(cards: list[dict[str, Any]]) -> float:
    nonland = [c for c in cards if not _is_land(c)]
    if not nonland:
        return 0.0
    total = sum(float(c.get("cmc") or 0) for c in nonland)
    return round(total / len(nonland), 2)


def detect_weak_spots(
    cards: list[dict[str, Any]],
    *,
    target_deck_size: int = 100,
) -> list[str]:
    """
    Heuristic warnings. These are deliberately conservative so the agent
    doesn't confidently flag a deliberate brew as broken — anything reported
    here is a directional signal, not a verdict.
    """
    warnings: list[str] = []
    total = len(cards)
    if total < target_deck_size:
        warnings.append(
            f"Only {total} cards resolved; expected {target_deck_size}. "
            "Some names may not have matched Scryfall."
        )

    lands = land_count(cards)
    # Commander rule of thumb: ~36-38 lands for a 99 + commander. For other
    # formats this is way off; treat <30% lands as a warning regardless.
    if total >= 50 and lands < int(total * 0.30):
        warnings.append(
            f"Land count is low ({lands}/{total}, {round(100*lands/total)}%). "
            "Most 100-card decks run 35-38 lands."
        )

    roles = role_buckets(cards)
    if total >= 50:
        if len(roles["ramp"]) < 6:
            warnings.append(
                f"Ramp count is light ({len(roles['ramp'])} cards). "
                "Most Commander decks run 8-12 sources of ramp."
            )
        if len(roles["draw"]) < 6:
            warnings.append(
                f"Card-draw count is light ({len(roles['draw'])} cards). "
                "Commander decks typically want 8-12 sources of card advantage."
            )
        if len(roles["removal"]) < 5:
            warnings.append(
                f"Removal/interaction is light ({len(roles['removal'])} cards). "
                "Most decks want at least 8 pieces of removal."
            )

    return warnings


def analyze(
    cards: list[dict[str, Any]],
    *,
    entries: list[DeckEntry] | None = None,
    missing: list[str] | None = None,
) -> dict[str, Any]:
    """
    Full deck report. `entries` lets us echo the original quantities and
    flag the commander(s); `missing` is the list of names Scryfall couldn't
    resolve so the LLM can surface them.
    """
    commanders: list[str] = []
    if entries:
        commanders = [e.name for e in entries if e.role == "commander"]

    return {
        "totals": {
            "resolved_cards": len(cards),
            "unique_names": len({c.get("name") for c in cards}),
            "lands": land_count(cards),
            "missing": missing or [],
        },
        "commanders": commanders,
        "color_identity": color_identity_union(cards),
        "mana_curve": mana_curve(cards),
        "average_cmc_nonland": average_cmc(cards),
        "type_distribution": type_distribution(cards),
        "roles": role_buckets(cards),
        "keyword_density": [{"keyword": k, "count": n} for k, n in keyword_density(cards)],
        "warnings": detect_weak_spots(cards),
    }


# --- helpers -----------------------------------------------------------------
def _is_land(card: dict[str, Any]) -> bool:
    return "Land" in (card.get("type_line") or "")
