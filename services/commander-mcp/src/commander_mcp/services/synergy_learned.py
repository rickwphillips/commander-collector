"""
Learning-aware synergy scorer.

Wraps the pure `services/synergy` heuristic with a DB-backed blend against
the feedback-derived weights from `db/feedback_repo`. Kept separate from
`synergy.py` so the pure module stays free of I/O and trivially testable.

Output shape mirrors `synergy.synergies_in_deck` but adds:
  - learned_weight   the weight currently stored in synergy_weight
  - sample_size      how many feedback events back this weight
  - blended_score    heuristic + learned, weighted by sample size
"""

from __future__ import annotations

from itertools import combinations
from typing import Any

from commander_mcp.services import synergy as _synergy
from commander_mcp.db import feedback_repo
from commander_mcp.learning import weights as _weights


async def synergies_in_deck_with_learning(
    found: dict[str, dict[str, Any]],
    *,
    context: str | None = None,
    top_n: int = 25,
) -> list[dict[str, Any]]:
    """
    Score every pair in a deck using heuristic + learned weights.

    Returns pairs ranked by blended_score (descending). Pairs with zero
    heuristic AND no learned weight are dropped to keep the list useful.
    """
    names = sorted(found.keys())
    if len(names) < 2:
        return []

    # 1) Heuristic pass (pure, in-process).
    heuristics: dict[tuple[str, str], dict[str, Any]] = {}
    pair_keys: list[tuple[str, str]] = []
    for a_name, b_name in combinations(names, 2):
        result = _synergy.score_pair(found[a_name], found[b_name])
        ca, cb = _weights.canonical_pair(a_name, b_name)
        heuristics[(ca, cb)] = {
            "heuristic": result["score"],
            "reasons": result["reasons"],
        }
        pair_keys.append((ca, cb))

    # 2) One DB call for all learned weights.
    learned = await feedback_repo.get_synergy_weights_batch(pair_keys, context=context)

    # 3) Blend.
    out: list[dict[str, Any]] = []
    for (ca, cb), h in heuristics.items():
        lw = learned.get((ca, cb))
        learned_weight = lw["weight"] if lw else 0.0
        sample_size = lw["sample_size"] if lw else 0
        blended = _weights.blend_heuristic_with_learned(
            h["heuristic"], learned_weight, sample_size
        )
        # Skip empties: no heuristic signal AND no feedback.
        if h["heuristic"] == 0.0 and sample_size == 0:
            continue
        out.append({
            "card_a": ca,
            "card_b": cb,
            "heuristic_score": round(h["heuristic"], 3),
            "learned_weight": round(learned_weight, 3),
            "sample_size": sample_size,
            "blended_score": round(blended, 3),
            "reasons": h["reasons"],
        })

    out.sort(key=lambda p: p["blended_score"], reverse=True)
    return out[:top_n]


async def score_pair_with_learning(
    a: dict[str, Any],
    b: dict[str, Any],
    *,
    context: str | None = None,
) -> dict[str, Any]:
    """Single-pair variant; mirrors the structure above for one (a, b)."""
    heuristic = _synergy.score_pair(a, b)
    name_a, name_b = a.get("name"), b.get("name")
    if not name_a or not name_b or name_a == name_b:
        return {
            "heuristic_score": heuristic["score"],
            "learned_weight": 0.0,
            "sample_size": 0,
            "blended_score": heuristic["score"],
            "reasons": heuristic["reasons"],
        }
    ca, cb = _weights.canonical_pair(name_a, name_b)
    learned = await feedback_repo.get_synergy_weights_batch([(ca, cb)], context=context)
    lw = learned.get((ca, cb))
    learned_weight = lw["weight"] if lw else 0.0
    sample_size = lw["sample_size"] if lw else 0
    blended = _weights.blend_heuristic_with_learned(
        heuristic["score"], learned_weight, sample_size
    )
    return {
        "card_a": ca,
        "card_b": cb,
        "heuristic_score": round(heuristic["score"], 3),
        "learned_weight": round(learned_weight, 3),
        "sample_size": sample_size,
        "blended_score": round(blended, 3),
        "reasons": heuristic["reasons"],
    }
