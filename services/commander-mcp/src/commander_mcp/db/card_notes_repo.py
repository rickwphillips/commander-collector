"""
Card-note repository.

Single-card facts: bans, traps, staples, situational, requirement. Reads use
'most-specific-match wins' semantics: a row with (format, archetype) both
matching beats a row with only format matching, beats a row with neither.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from commander_mcp.db.connection import get_connection


# Closed kind enum. Add to this only if you also extend the scorer to handle
# the new kind in `services/card_scoring.py`.
KIND_BANNED = "banned"
KIND_TRAP = "trap"
KIND_STAPLE = "staple"
KIND_SITUATIONAL = "situational"
KIND_REQUIREMENT = "requirement"
KINDS = {KIND_BANNED, KIND_TRAP, KIND_STAPLE, KIND_SITUATIONAL, KIND_REQUIREMENT}


@dataclass
class CardNote:
    card_name: str
    kind: str
    weight: float
    source: str
    message: str
    format: str | None = None
    archetype: str | None = None
    sample_size: int = 1


async def upsert_notes(notes: list[CardNote]) -> int:
    """
    Insert-or-replace card notes by (card_name, format, archetype, kind, source).
    Returns the count written.
    """
    if not notes:
        return 0
    rows = []
    for n in notes:
        if n.kind not in KINDS:
            raise ValueError(f"Unknown card_note kind: {n.kind!r}")
        rows.append((
            n.card_name.lower().strip(),
            n.format,
            n.archetype,
            n.kind,
            n.weight,
            n.source,
            n.message,
            n.sample_size,
        ))
    conn = await get_connection()
    try:
        await conn.executemany(
            """INSERT OR REPLACE INTO card_note
                  (card_name, format, archetype, kind, weight, source, message, sample_size)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            rows,
        )
        await conn.commit()
    finally:
        await conn.close()
    return len(rows)


async def find_for_card(
    card_name: str,
    *,
    format: str | None = None,
    archetype: str | None = None,
) -> list[dict[str, Any]]:
    """
    All matching notes for a card, scored by specificity.

    Returns rows where:
      - format matches (or note's format is NULL = any), AND
      - archetype matches (or note's archetype is NULL = any)

    Each row gets an added `specificity` field (0..2) the caller can use to
    pick the most-specific note per kind.
    """
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT card_name, format, archetype, kind, weight, source, message,
                      sample_size, updated_at
               FROM card_note
               WHERE card_name = ?
                 AND (format    IS NULL OR format    = ?)
                 AND (archetype IS NULL OR archetype = ?)""",
            (card_name.lower().strip(), format, archetype),
        )
        rows = await cur.fetchall()
    finally:
        await conn.close()

    out = []
    for r in rows:
        spec = 0
        if r["format"] is not None:
            spec += 1
        if r["archetype"] is not None:
            spec += 1
        out.append({
            "card_name": r["card_name"],
            "format": r["format"],
            "archetype": r["archetype"],
            "kind": r["kind"],
            "weight": r["weight"],
            "source": r["source"],
            "message": r["message"],
            "sample_size": r["sample_size"],
            "updated_at": r["updated_at"],
            "specificity": spec,
        })
    # Sort: highest specificity first, then by kind priority (banned > trap > others).
    kind_priority = {KIND_BANNED: 0, KIND_TRAP: 1, KIND_REQUIREMENT: 2, KIND_SITUATIONAL: 3, KIND_STAPLE: 4}
    out.sort(key=lambda n: (-n["specificity"], kind_priority.get(n["kind"], 99)))
    return out


async def is_seeded() -> bool:
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT COUNT(*) AS c FROM card_note")
        row = await cur.fetchone()
        return bool(row and row["c"] > 0)
    finally:
        await conn.close()


async def stats() -> dict[str, int]:
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT COUNT(*) AS c FROM card_note")
        total = (await cur.fetchone())["c"]
        cur = await conn.execute(
            "SELECT kind, COUNT(*) AS c FROM card_note GROUP BY kind"
        )
        by_kind = {r["kind"]: r["c"] for r in await cur.fetchall()}
        return {"total": total, **{f"kind_{k}": v for k, v in by_kind.items()}}
    finally:
        await conn.close()
