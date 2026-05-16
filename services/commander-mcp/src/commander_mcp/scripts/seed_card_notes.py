"""
Seed the card_note table with a hand-curated v1 set.

The seed covers cards whose verdict is stable and non-controversial enough to
encode as ground truth: format bans, near-universal commander staples, and a
few well-known traps. Run after schema init; idempotent on the unique key.

Usage:
    python -m commander_mcp.scripts.seed_card_notes
"""

from __future__ import annotations

import asyncio

from commander_mcp.db.card_notes_repo import (
    KIND_BANNED, KIND_STAPLE, KIND_TRAP,
    CardNote, upsert_notes,
)
from commander_mcp.db.connection import init_db


SOURCE = "seed:v1"

# Commander banned list (effective as of late 2025; the deep cuts only).
# Bumping this list means re-running the seed script.
_COMMANDER_BANNED = [
    ("mana crypt",         "Banned in Commander (Sept 2024 update)."),
    ("jeweled lotus",      "Banned in Commander (Sept 2024 update)."),
    ("dockside extortionist", "Banned in Commander (Sept 2024 update)."),
    ("nadu, winged wisdom", "Banned in Commander (2024)."),
    ("emrakul, the aeons torn", "Banned as commander; banned in 99 too."),
    ("griselbrand",        "Banned in Commander."),
    ("karakas",            "Banned in Commander."),
    ("primeval titan",     "Banned in Commander."),
    ("fastbond",           "Banned in Commander."),
    ("shahrazad",          "Banned in Commander."),
    ("tinker",             "Banned in Commander."),
    ("ancestral recall",   "Banned in Commander."),
    ("time walk",          "Banned in Commander."),
    ("black lotus",        "Banned in Commander."),
    ("library of alexandria", "Banned in Commander."),
]

# Near-universal commander staples. These get a positive prior; specific decks
# can still override via feedback if the user thinks otherwise.
_COMMANDER_STAPLES = [
    ("sol ring",           "Commander staple: T1 mana acceleration in every color."),
    ("arcane signet",      "Commander staple: cheap two-color mana rock."),
    ("command tower",      "Commander staple land: untapped any-color land."),
    ("exotic orchard",     "Commander staple land in 2+ color decks."),
    ("counterspell",       "Blue staple removal/interaction."),
    ("swords to plowshares", "White staple removal: 1-mana exile."),
    ("path to exile",      "White staple removal."),
    ("cyclonic rift",      "Blue staple sweeper."),
    ("demonic tutor",      "Black staple tutor (legal in Commander)."),
    ("rhystic study",      "Blue card-draw staple."),
]

# Well-known traps: cards that *look* like staples but underperform in
# common contexts. Negative prior, but soft enough that feedback can override.
_COMMANDER_TRAPS = [
    ("maze of ith",        "Trap: colorless utility land too slow for most decks; better in voltron only."),
    ("pithing needle",     "Situational: only good against activated-ability commanders / artifacts."),
    ("planar void",        "Trap: exiles your own graveyard too; only works in dedicated hate."),
    ("aetherflux reservoir", "Trap unless deck is dedicated lifegain or storm — slow and easy to kill."),
    ("paradox haze",       "Trap: 3-mana enchantment with no immediate impact; needs upkeep payoffs."),
]


def build_seed_notes() -> list[CardNote]:
    notes: list[CardNote] = []
    for name, msg in _COMMANDER_BANNED:
        notes.append(CardNote(
            card_name=name, format="commander", kind=KIND_BANNED,
            weight=-1.0, source=SOURCE, message=msg,
        ))
    for name, msg in _COMMANDER_STAPLES:
        notes.append(CardNote(
            card_name=name, format="commander", kind=KIND_STAPLE,
            weight=0.5, source=SOURCE, message=msg,
        ))
    for name, msg in _COMMANDER_TRAPS:
        notes.append(CardNote(
            card_name=name, format="commander", kind=KIND_TRAP,
            weight=-0.5, source=SOURCE, message=msg,
        ))
    return notes


async def run() -> int:
    await init_db()
    notes = build_seed_notes()
    written = await upsert_notes(notes)
    print(f"Seeded {written} card notes ({SOURCE}).")
    return 0


def main() -> None:
    exit(asyncio.run(run()))


if __name__ == "__main__":
    main()
