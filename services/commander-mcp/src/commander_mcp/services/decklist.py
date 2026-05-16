"""
Decklist parsing.

Accepts the kind of mess users actually paste:
    Sol Ring
    1 Sol Ring
    1x Sol Ring
    4 Lightning Bolt
    SB: 2 Negate          (sideboard marker - dropped for now)
    // a comment
    <blank line>
    *CMDR* Atraxa, Praetors' Voice
    Atraxa, Praetors' Voice *CMDR*

Returns a list of DeckEntry(name, quantity, role). Role is one of:
  - 'commander' (marked with *CMDR* / CMDR: / a commander_hint param)
  - 'mainboard' (the default)
  - 'sideboard' (marked with SB: / SIDEBOARD)
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable


@dataclass
class DeckEntry:
    name: str
    quantity: int
    role: str  # 'commander' | 'mainboard' | 'sideboard'

    def __post_init__(self) -> None:
        if self.quantity < 1:
            raise ValueError(f"quantity must be >= 1, got {self.quantity}")
        if self.role not in ("commander", "mainboard", "sideboard"):
            raise ValueError(f"unknown role {self.role!r}")


_QTY_PREFIX = re.compile(r"^(\d{1,3})\s*[xX]?\s+(.+)$")
_SB_PREFIX = re.compile(r"^(?:SB[:\s]|SIDEBOARD[:\s]|SIDEBOARD\s*$|SB\s*$)", re.IGNORECASE)
_CMDR_PREFIX = re.compile(r"^(?:CMDR[:\s]|COMMANDER[:\s]|CMDR\s*$|COMMANDER\s*$)", re.IGNORECASE)
_CMDR_INLINE = re.compile(r"\*CMDR\*", re.IGNORECASE)
_COMMENT = re.compile(r"^\s*(?://|#)")


def parse_decklist(lines: Iterable[str], commander_hint: str | None = None) -> list[DeckEntry]:
    """
    Parse a list of strings (or any iterable of strings) into DeckEntry records.

    `commander_hint`, if provided, marks any matching entry (case-insensitive
    name match) as the commander, even if the line wasn't tagged.
    """
    entries: list[DeckEntry] = []
    section = "mainboard"
    hint = commander_hint.strip().lower() if commander_hint else None

    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if _COMMENT.match(line):
            continue

        # Section toggles
        if _SB_PREFIX.match(line):
            line = _SB_PREFIX.sub("", line, count=1).strip()
            if not line:
                section = "sideboard"
                continue
            entries.extend(_parse_one(line, "sideboard"))
            continue

        if _CMDR_PREFIX.match(line) or _CMDR_INLINE.search(line):
            stripped = _CMDR_PREFIX.sub("", line, count=1).strip()
            stripped = _CMDR_INLINE.sub("", stripped).strip()
            entries.extend(_parse_one(stripped, "commander"))
            continue

        entries.extend(_parse_one(line, section))

    # Apply commander hint by name (case-insensitive).
    if hint:
        for e in entries:
            if e.name.lower() == hint and e.role != "commander":
                e.role = "commander"

    return _coalesce(entries)


def _parse_one(line: str, role: str) -> list[DeckEntry]:
    m = _QTY_PREFIX.match(line)
    if m:
        qty = int(m.group(1))
        name = m.group(2).strip()
    else:
        qty = 1
        name = line.strip()

    # Strip trailing set-code annotations like "(NEO) 123"
    name = re.sub(r"\s*\([A-Z0-9]{2,6}\)\s*\d*\s*$", "", name).strip()
    if not name:
        return []
    return [DeckEntry(name=name, quantity=qty, role=role)]


def _coalesce(entries: list[DeckEntry]) -> list[DeckEntry]:
    """Merge duplicate (name, role) pairs by summing quantity."""
    seen: dict[tuple[str, str], DeckEntry] = {}
    order: list[tuple[str, str]] = []
    for e in entries:
        key = (e.name.lower(), e.role)
        if key in seen:
            seen[key].quantity += e.quantity
        else:
            seen[key] = DeckEntry(name=e.name, quantity=e.quantity, role=e.role)
            order.append(key)
    return [seen[k] for k in order]
