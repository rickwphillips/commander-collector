"""
Per-card scoring with layered composition.

Read-time stack (each layer attaches a trace entry; layers may short-circuit):

  1. card_note (kind = 'banned') -> hard short-circuit, score = -1.0
  2. card_note (other kinds)     -> prior weight from most-specific note
  3. verified_pattern presence   -> informational only in v1 (no score shift)
  4. learned synergy_weight      -> average across deck pairs, scaled
  5. heuristic synergy           -> deferred to a later milestone

Confidence band reflects DATA PRESENCE, not score magnitude:
  - banned                       -> CERTAIN
  - explicit card_note hit       -> HIGH
  - only learned data            -> MODERATE
  - no signal                    -> LOW
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from commander_mcp.confidence import Band
from commander_mcp.db import card_notes_repo, feedback_repo, patterns_repo


@dataclass
class TraceEntry:
    layer: str
    kind: str
    contribution: float
    reason: str
    data: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        out = {
            "layer": self.layer,
            "kind": self.kind,
            "contribution": round(self.contribution, 4),
            "reason": self.reason,
        }
        if self.data is not None:
            out["data"] = self.data
        return out


@dataclass
class ScoreResult:
    card_name: str
    score: float
    band: Band
    short_circuit: bool
    trace: list[TraceEntry] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "card_name": self.card_name,
            "score": round(self.score, 4),
            "band": self.band.value,
            "short_circuit": self.short_circuit,
            "trace": [t.to_dict() for t in self.trace],
        }


# Influence of the learned-synergy pair-mean on the final card score. Kept low
# so a couple of strong pair weights don't dominate the prior.
LEARNED_SYNERGY_SCALE = 0.3


async def score_card_in_deck(
    card_name: str,
    *,
    decklist: list[str],
    commander: str | None = None,
    format: str = "commander",
    archetype: str | None = None,
    learning_context: str | None = None,
) -> ScoreResult:
    """
    Compose a per-card score from the layered data sources.

    decklist is the rest of the deck (commander included or not, won't double-
    count). `learning_context` is the scope used when looking up synergy_weight
    rows; passing None matches the legacy "no-context" rows recorded before
    contexts were tagged.
    """
    name = card_name.strip().lower()
    score = 0.0
    trace: list[TraceEntry] = []
    band = Band.LOW

    # Layer 1+2: card_note
    notes = await card_notes_repo.find_for_card(
        name, format=format, archetype=archetype
    )
    banned = next((n for n in notes if n["kind"] == "banned"), None)
    if banned is not None:
        return ScoreResult(
            card_name=name,
            score=-1.0,
            band=Band.CERTAIN,
            short_circuit=True,
            trace=[TraceEntry(
                layer="card_note",
                kind="banned",
                contribution=-1.0,
                reason=banned["message"],
                data={"source": banned["source"], "format": banned["format"]},
            )],
        )

    note_applied = next((n for n in notes if n["kind"] != "banned"), None)
    if note_applied is not None:
        score += note_applied["weight"]
        band = Band.HIGH
        trace.append(TraceEntry(
            layer="card_note",
            kind=note_applied["kind"],
            contribution=note_applied["weight"],
            reason=note_applied["message"],
            data={
                "source": note_applied["source"],
                "format": note_applied["format"],
                "archetype": note_applied["archetype"],
                "specificity": note_applied["specificity"],
            },
        ))

    # Layer 3: verified_pattern presence (informational, no score shift in v1)
    if await patterns_repo.is_ingested():
        pattern_hits = await patterns_repo.find_by_card(name, role="subject")
        if pattern_hits:
            trace.append(TraceEntry(
                layer="verified_pattern",
                kind="mention",
                contribution=0.0,
                reason=(
                    f"{len(pattern_hits)} verified pattern(s) feature this card "
                    f"as a subject; consult lookup_interaction for details."
                ),
                data={"pattern_ids": [p["pattern_id"] for p in pattern_hits]},
            ))

    # Layer 4: learned synergy against the deck
    if decklist:
        pair_weights: list[float] = []
        examined = 0
        for other in decklist:
            other_n = other.strip().lower()
            if not other_n or other_n == name:
                continue
            examined += 1
            row = await feedback_repo.get_synergy_weight(name, other_n, learning_context)
            if row:
                pair_weights.append(row["weight"])
        if pair_weights:
            avg = sum(pair_weights) / len(pair_weights)
            contribution = avg * LEARNED_SYNERGY_SCALE
            score += contribution
            if band == Band.LOW:
                band = Band.MODERATE
            trace.append(TraceEntry(
                layer="learned_synergy",
                kind="avg_pair_weight",
                contribution=contribution,
                reason=(
                    f"Average learned weight against {len(pair_weights)} of "
                    f"{examined} deck card(s): {avg:+.3f}."
                ),
                data={
                    "deck_cards_with_weights": len(pair_weights),
                    "deck_cards_examined": examined,
                    "avg_pair_weight": round(avg, 4),
                    "scale": LEARNED_SYNERGY_SCALE,
                },
            ))

    # Layer 5: heuristic synergy — deferred. Requires Scryfall card payloads
    # for every card in the deck; that round-trip will land in M5 alongside the
    # deck-level analyzer that fetches them anyway.

    if not trace:
        trace.append(TraceEntry(
            layer="fallback",
            kind="no_signal",
            contribution=0.0,
            reason=(
                "No card_note, verified pattern, or learned weight applied. "
                "Score reflects pure heuristic baseline (0.0)."
            ),
        ))

    score = max(-1.0, min(1.0, score))
    return ScoreResult(
        card_name=name,
        score=score,
        band=band,
        short_circuit=False,
        trace=trace,
    )
