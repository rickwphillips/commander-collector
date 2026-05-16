"""
Deck-level scoring with bracket assignment.

Builds a DeckState from resolved Scryfall payloads, evaluates a catalog of
signed signals (each signal contributes a small amount of strength), then
maps the cumulative score to Wizards' official Bracket 1-5 system.

Each signal that fires attaches a trace entry with name, contribution, and a
human-readable reason. The trace is the explainability hook: this is what
'discuss strength' surfaces in prose.

The named card sets (FAST_MANA, TUTORS, GAME_CHANGERS, ...) are seeded inline
for v1. Later iteration: migrate to card_note rows with kind tags so they're
data-driven and the brain can learn new entries from feedback.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from commander_mcp.services import deck_analysis


# ── Card sets ────────────────────────────────────────────────────────────────
# Card names stored lowercased; comparison is case-insensitive at lookup time.

FAST_MANA = {
    # Sol Ring is deliberately excluded: it's universal across all brackets in
    # Commander, so counting it would inflate every deck's strength score.
    "mana crypt", "mana vault", "jeweled lotus", "chrome mox", "mox diamond",
    "mox opal", "mox amber", "lotus petal", "ancient tomb", "city of traitors",
    "grim monolith",
}

TUTORS = {
    "demonic tutor", "vampiric tutor", "imperial seal", "grim tutor",
    "diabolic intent", "mystical tutor", "enlightened tutor", "worldly tutor",
    "personal tutor", "survival of the fittest", "gamble", "eladamri's call",
    "green sun's zenith", "natural order", "tooth and nail",
}

# Wizards' "Game Changers" subset that show up commonly. Not exhaustive.
GAME_CHANGERS = {
    "mana crypt", "jeweled lotus", "smothering tithe", "trouble in pairs",
    "cyclonic rift", "vampiric tutor", "demonic tutor", "imperial seal",
    "survival of the fittest", "drannith magistrate", "mana drain",
    "force of will", "thassa's oracle", "necropotence", "ad nauseam",
    "fierce guardianship", "kindred discovery", "rhystic study", "the one ring",
}

# Mass land destruction (Bracket 3+ only by Wizards' guidelines).
MASS_LAND_DESTRUCTION = {
    "armageddon", "ravages of war", "wildfire", "obliterate", "decree of annihilation",
    "catastrophe", "boom // bust", "jokulhaups", "cataclysm",
}

# Stax pieces (resource denial).
STAX_PIECES = {
    "winter orb", "static orb", "stasis", "tangle wire", "smokestack",
    "rule of law", "deafening silence", "drannith magistrate",
    "thalia, guardian of thraben", "collector ouphe", "null rod",
    "stony silence", "linvala, keeper of silence", "kataki, war's wage",
    "torpor orb", "humility", "blood moon", "back to basics",
}

# Two-card and small combo pieces. Presence of multiple suggests a combo deck.
COMBO_PIECES = {
    "thassa's oracle", "demonic consultation", "tainted pact",
    "dramatic reversal", "isochron scepter",
    "kiki-jiki, mirror breaker", "felidar guardian", "restoration angel",
    "deadeye navigator", "peregrine drake",
    "food chain", "eternal scourge", "squee, the immortal",
    "underworld breach", "lotus petal", "brain freeze",
    "ad nauseam", "angel's grace",
    "godo, bandit warlord", "helm of the host",
    "protean hulk", "flash",
}


# ── DeckState + signals ──────────────────────────────────────────────────────

@dataclass
class DeckState:
    cards: list[dict[str, Any]]
    name_set_lc: set[str]
    total_cards: int
    land_count: int
    nonland_count: int
    avg_cmc: float
    role_counts: dict[str, int]                 # ramp/draw/removal/interaction/wincon
    fast_mana_count: int
    tutor_count: int
    game_changer_count: int
    combo_piece_count: int
    mld_count: int
    stax_count: int
    color_identity: list[str]


def build_deck_state(cards: list[dict[str, Any]]) -> DeckState:
    names_lc = {c.get("name", "").lower() for c in cards if c.get("name")}
    roles = deck_analysis.role_buckets(cards)
    role_counts = {k: len(v) for k, v in roles.items()}
    return DeckState(
        cards=cards,
        name_set_lc=names_lc,
        total_cards=len(cards),
        land_count=deck_analysis.land_count(cards),
        nonland_count=len(cards) - deck_analysis.land_count(cards),
        avg_cmc=deck_analysis.average_cmc(cards),
        role_counts=role_counts,
        fast_mana_count=len(names_lc & FAST_MANA),
        tutor_count=len(names_lc & TUTORS),
        game_changer_count=len(names_lc & GAME_CHANGERS),
        combo_piece_count=len(names_lc & COMBO_PIECES),
        mld_count=len(names_lc & MASS_LAND_DESTRUCTION),
        stax_count=len(names_lc & STAX_PIECES),
        color_identity=deck_analysis.color_identity_union(cards),
    )


@dataclass
class Signal:
    name: str
    contribution: float
    reason: str
    data: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        out = {
            "name": self.name,
            "contribution": round(self.contribution, 4),
            "reason": self.reason,
        }
        if self.data is not None:
            out["data"] = self.data
        return out


# Contribution caps tune how much any one signal can sway the strength score.
# Sum of all caps roughly defines the max score range.
_FAST_MANA_PER = 0.10
_FAST_MANA_CAP = 0.40
_GAME_CHANGER_PER = 0.10
_GAME_CHANGER_CAP = 0.40
_COMBO_PER = 0.08
_COMBO_CAP = 0.24
_TUTOR_DENSE_THRESHOLD = 4
_TUTOR_DENSE_HEAVY_THRESHOLD = 8


def evaluate_signals(state: DeckState) -> list[Signal]:
    out: list[Signal] = []

    # Fast mana
    if state.fast_mana_count > 0:
        contribution = min(state.fast_mana_count * _FAST_MANA_PER, _FAST_MANA_CAP)
        hits = sorted(state.name_set_lc & FAST_MANA)
        out.append(Signal(
            "fast_mana", contribution,
            f"{state.fast_mana_count} fast-mana piece(s) detected; T1-2 acceleration shifts bracket up.",
            {"hits": hits},
        ))

    # Game changers
    if state.game_changer_count > 0:
        contribution = min(state.game_changer_count * _GAME_CHANGER_PER, _GAME_CHANGER_CAP)
        hits = sorted(state.name_set_lc & GAME_CHANGERS)
        out.append(Signal(
            "game_changers", contribution,
            f"{state.game_changer_count} Wizards 'Game Changer' card(s); each pushes the deck above Bracket 2.",
            {"hits": hits},
        ))

    # Tutor density
    if state.tutor_count >= _TUTOR_DENSE_HEAVY_THRESHOLD:
        out.append(Signal(
            "tutors_heavy", 0.30,
            f"{state.tutor_count} tutor(s); deck consistently finds its win pieces.",
            {"count": state.tutor_count},
        ))
    elif state.tutor_count >= _TUTOR_DENSE_THRESHOLD:
        out.append(Signal(
            "tutors_dense", 0.15,
            f"{state.tutor_count} tutor(s); meaningful tutor density.",
            {"count": state.tutor_count},
        ))

    # Combo pieces
    if state.combo_piece_count >= 2:
        contribution = min(state.combo_piece_count * _COMBO_PER, _COMBO_CAP)
        hits = sorted(state.name_set_lc & COMBO_PIECES)
        out.append(Signal(
            "combo_pieces", contribution,
            f"{state.combo_piece_count} known combo piece(s); deck likely runs at least one 2-card line.",
            {"hits": hits},
        ))

    # Mass land destruction (Bracket 3+ allowed only)
    if state.mld_count > 0:
        hits = sorted(state.name_set_lc & MASS_LAND_DESTRUCTION)
        out.append(Signal(
            "mass_land_destruction", 0.20,
            f"{state.mld_count} mass-land-destruction effect(s); Wizards restricts these to Bracket 3+.",
            {"hits": hits},
        ))

    # Stax
    if state.stax_count >= 3:
        hits = sorted(state.name_set_lc & STAX_PIECES)[:8]
        out.append(Signal(
            "stax_engine", 0.20,
            f"{state.stax_count} stax piece(s); resource denial signals high-power / Bracket 4+.",
            {"hits": hits},
        ))
    elif state.stax_count > 0:
        hits = sorted(state.name_set_lc & STAX_PIECES)
        out.append(Signal(
            "stax_sprinkle", 0.08,
            f"{state.stax_count} stax piece(s); a few resource-denial tools but not a full engine.",
            {"hits": hits},
        ))

    # Curve
    if state.nonland_count > 0 and state.avg_cmc <= 2.5:
        out.append(Signal(
            "low_curve", 0.10,
            f"Average non-land CMC is {state.avg_cmc} (lean, fast deck).",
            {"avg_cmc": state.avg_cmc},
        ))
    elif state.nonland_count > 0 and state.avg_cmc >= 4.0:
        out.append(Signal(
            "high_curve", -0.10,
            f"Average non-land CMC is {state.avg_cmc} (slower battlecruiser feel).",
            {"avg_cmc": state.avg_cmc},
        ))

    # Land balance
    if state.total_cards >= 50:
        land_pct = state.land_count / max(state.total_cards, 1)
        if land_pct < 0.28:
            out.append(Signal(
                "low_lands", -0.05,
                f"Lands at {round(100 * land_pct)}% of deck; below the casual norm.",
                {"land_pct": round(land_pct, 3)},
            ))
        elif land_pct > 0.42:
            out.append(Signal(
                "high_lands", -0.05,
                f"Lands at {round(100 * land_pct)}% of deck; above the casual norm.",
                {"land_pct": round(land_pct, 3)},
            ))

    # Removal density
    removal = state.role_counts.get("removal", 0)
    if removal >= 10:
        out.append(Signal(
            "removal_dense", 0.05,
            f"{removal} removal/interaction piece(s); robust answer suite.",
        ))

    # Ramp density
    ramp = state.role_counts.get("ramp", 0)
    if ramp >= 12:
        out.append(Signal(
            "ramp_dense", 0.05,
            f"{ramp} ramp piece(s); efficient mana acceleration plan.",
        ))

    return out


# ── Bracket assignment ───────────────────────────────────────────────────────

@dataclass
class DeckScore:
    bracket: int                   # 1..5
    bracket_name: str
    strength_score: float          # clamped [-1, +1]
    signals: list[Signal] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    color_identity: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "bracket": self.bracket,
            "bracket_name": self.bracket_name,
            "strength_score": round(self.strength_score, 4),
            "signals": [s.to_dict() for s in self.signals],
            "warnings": self.warnings,
            "color_identity": self.color_identity,
        }


_BRACKET_NAMES = {
    1: "Exhibition (Bracket 1)",
    2: "Core (Bracket 2)",
    3: "Upgraded (Bracket 3)",
    4: "Optimized (Bracket 4)",
    5: "cEDH (Bracket 5)",
}


def score_to_bracket(score: float, *, has_mld_or_heavy_stax: bool) -> int:
    """
    Map strength to Wizards' 1-5 system.

    A deck cannot land in Bracket 1 or 2 if it contains MLD or a real stax
    engine, per Wizards' published guidance.
    """
    if score >= 0.55:
        b = 5
    elif score >= 0.30:
        b = 4
    elif score >= 0.10:
        b = 3
    elif score >= -0.10:
        b = 2
    else:
        b = 1
    if has_mld_or_heavy_stax and b < 3:
        b = 3
    return b


def score_deck(cards: list[dict[str, Any]]) -> DeckScore:
    state = build_deck_state(cards)
    signals = evaluate_signals(state)

    total = sum(s.contribution for s in signals)
    total = max(-1.0, min(1.0, total))

    has_mld_or_heavy_stax = state.mld_count > 0 or state.stax_count >= 3
    bracket = score_to_bracket(total, has_mld_or_heavy_stax=has_mld_or_heavy_stax)

    warnings = deck_analysis.detect_weak_spots(cards)
    return DeckScore(
        bracket=bracket,
        bracket_name=_BRACKET_NAMES[bracket],
        strength_score=total,
        signals=signals,
        warnings=warnings,
        color_identity=state.color_identity,
    )


def discuss_score(score: DeckScore) -> str:
    """Format a DeckScore as readable prose for chat consumption."""
    lines = [f"**{score.bracket_name}** (strength score {score.strength_score:+.2f})"]
    if score.color_identity:
        lines.append(f"Color identity: {'/'.join(score.color_identity)}")
    if score.signals:
        lines.append("\n**Signals fired:**")
        for s in score.signals:
            lines.append(f"- {s.name} ({s.contribution:+.2f}): {s.reason}")
    else:
        lines.append("\nNo bracket-shifting signals fired; treat as default mid-bracket guidance.")
    if score.warnings:
        lines.append("\n**Composition warnings:**")
        for w in score.warnings:
            lines.append(f"- {w}")
    return "\n".join(lines)
