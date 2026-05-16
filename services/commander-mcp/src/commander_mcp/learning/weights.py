"""
Pure weight-update math for the feedback loop.

Two operations:

1. `update_weight(old_weight, old_sample_size, delta)`
   Running mean: combine a prior weight with a new feedback event.
   Sample size grows by 1; the influence of any single event shrinks as
   we accumulate evidence. Returns (new_weight, new_sample_size).

2. `blend_heuristic_with_learned(heuristic, learned, sample_size)`
   Combine the cold-start heuristic score (from Phase 3) with the
   learned weight (from feedback). The learned signal is trusted more
   as sample_size grows; with no feedback at all, the heuristic stands
   alone.

Both functions are pure, deterministic, and have no DB or network
dependencies, so they're trivial to unit-test in isolation.
"""

from __future__ import annotations

# Deltas mapped from feedback kinds.
DELTA_CONFIRMATION = +1.0
DELTA_CORRECTION = -1.0
DELTA_UNCERTAINTY = 0.0

# Sample sizes at which the learned weight gets a given share of the blend.
# At sample_size = 0  -> alpha = 0    (pure heuristic)
# At sample_size = 1  -> alpha = 0.20
# At sample_size = 5  -> alpha = 0.56
# At sample_size = 20 -> alpha = 0.83
# Asymptotically  ->   alpha → 1.0   (pure learned weight)
_BLEND_HALF_LIFE = 4.0


def update_weight(
    old_weight: float,
    old_sample_size: int,
    delta: float,
) -> tuple[float, int]:
    """
    Incorporate one new feedback event into a running mean.

    The "weight" is the mean of all deltas observed so far. Each event
    contributes 1/(n+1) of the way toward its delta. Bounded to [-1, +1]
    because each delta is bounded there.
    """
    if old_sample_size < 0:
        raise ValueError("sample_size must be non-negative")
    n = old_sample_size
    new_weight = (old_weight * n + delta) / (n + 1)
    # Clamp to be safe against floating-point drift over many updates.
    if new_weight > 1.0:
        new_weight = 1.0
    elif new_weight < -1.0:
        new_weight = -1.0
    return new_weight, n + 1


def blend_alpha(sample_size: int) -> float:
    """
    Fraction of the final score contributed by the learned weight.

    Uses sample_size / (sample_size + half_life). With zero feedback the
    heuristic carries all the weight; with lots of feedback the learned
    signal dominates.
    """
    if sample_size <= 0:
        return 0.0
    return sample_size / (sample_size + _BLEND_HALF_LIFE)


def blend_heuristic_with_learned(
    heuristic: float,
    learned: float,
    sample_size: int,
) -> float:
    """
    Combine a cold-start heuristic score with a feedback-derived weight.

    `heuristic` is expected in [0.0, 1.0] (cooperative pairs only).
    `learned` is in [-1.0, 1.0] (corrections push negative).
    Returns a blended score in [-1.0, 1.0].
    """
    alpha = blend_alpha(sample_size)
    return (1.0 - alpha) * heuristic + alpha * learned


def canonical_pair(card_a: str, card_b: str) -> tuple[str, str]:
    """
    Canonical ordering for synergy_weight rows.

    The schema CHECK constraint requires `card_a < card_b` so each
    unordered pair has a single row. Always sort before DB writes.
    """
    if card_a == card_b:
        raise ValueError("a card cannot pair with itself")
    return (card_a, card_b) if card_a < card_b else (card_b, card_a)
