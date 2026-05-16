"""
Synergy detection.

A pair of cards (a, b) gets a synergy score in [0.0, 1.0] based on:
  - Shared creature subtypes (tribe synergy)
  - Shared keyword abilities (Toxic + Toxic, Proliferate + Proliferate)
  - Shared mechanical nouns in oracle text (+1/+1 counter, poison, sacrifice, ...)

This is HEURISTIC, not authoritative. Confidence band: MODERATE.

The learned synergy_weight table (Phase 5) will refine these scores via the
feedback loop. Until then, this gives us a reasonable cold-start baseline.
"""

from __future__ import annotations

import re
from typing import Any

# Mechanical nouns that strongly indicate intentional synergy when shared.
_MECHANICAL_NOUNS = [
    "poison counter",
    "+1/+1 counter",
    "-1/-1 counter",
    "treasure token",
    "food token",
    "blood token",
    "clue token",
    "energy",
    "experience counter",
    "loyalty counter",
    "saproling",
    "zombie token",
    "soldier token",
    "sacrifice a creature",
    "graveyard",
    "exile",
    "proliferate",
    "scry",
    "explore",
    "convoke",
    "delirium",
    "monarch",
    "initiative",
    "venture",
    "discover",
    "manifest",
]


def _subtypes(card: dict[str, Any]) -> set[str]:
    """Extract creature subtypes from the type line (everything after em-dash)."""
    tl = card.get("type_line") or ""
    if "—" not in tl:
        return set()
    _, subs = tl.split("—", 1)
    return {s.strip() for s in subs.split() if s.strip()}


def _keywords(card: dict[str, Any]) -> set[str]:
    return {k.lower() for k in (card.get("keywords") or [])}


def _mechanical_signals(card: dict[str, Any]) -> set[str]:
    text = (card.get("oracle_text") or "").lower()
    return {n for n in _MECHANICAL_NOUNS if n in text}


def score_pair(a: dict[str, Any], b: dict[str, Any]) -> dict[str, Any]:
    """Score a single pair. Returns score + the components that contributed."""
    reasons: list[str] = []
    score = 0.0

    # Tribal: shared creature subtypes (weighted lightly per shared subtype).
    shared_tribes = _subtypes(a) & _subtypes(b)
    if shared_tribes:
        bump = min(0.35, 0.18 * len(shared_tribes))
        score += bump
        reasons.append(f"shared tribe(s): {', '.join(sorted(shared_tribes))}")

    # Shared keyword abilities.
    shared_kw = _keywords(a) & _keywords(b)
    if shared_kw:
        bump = min(0.35, 0.15 * len(shared_kw))
        score += bump
        reasons.append(f"shared keyword(s): {', '.join(sorted(shared_kw))}")

    # Mechanical noun overlap.
    shared_mech = _mechanical_signals(a) & _mechanical_signals(b)
    if shared_mech:
        bump = min(0.40, 0.15 * len(shared_mech))
        score += bump
        reasons.append(f"shared mechanics: {', '.join(sorted(shared_mech))}")

    # Cap at 1.0 — these are heuristics, not guarantees.
    score = min(score, 1.0)
    return {
        "score": round(score, 3),
        "reasons": reasons,
    }


def synergies_in_deck(found: dict[str, dict[str, Any]], *, top_n: int = 25) -> list[dict[str, Any]]:
    """Return the top-N synergy pairs within a deck. Drops zero-score pairs."""
    names = sorted(found.keys())
    pairs: list[dict[str, Any]] = []
    for i, a_name in enumerate(names):
        for b_name in names[i + 1:]:
            result = score_pair(found[a_name], found[b_name])
            if result["score"] > 0:
                pairs.append({
                    "card_a": a_name,
                    "card_b": b_name,
                    "score": result["score"],
                    "reasons": result["reasons"],
                })
    pairs.sort(key=lambda p: p["score"], reverse=True)
    return pairs[:top_n]


def synergies_for_card(
    target: dict[str, Any],
    candidates: dict[str, dict[str, Any]],
    *,
    top_n: int = 15,
) -> list[dict[str, Any]]:
    """For a target card, rank candidates by synergy score."""
    results: list[dict[str, Any]] = []
    target_name = target.get("name", "?")
    for name, card in candidates.items():
        if name == target_name:
            continue
        r = score_pair(target, card)
        if r["score"] > 0:
            results.append({
                "card": name,
                "score": r["score"],
                "reasons": r["reasons"],
            })
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_n]
