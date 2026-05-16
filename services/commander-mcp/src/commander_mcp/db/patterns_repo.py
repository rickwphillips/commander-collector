"""
Repository for the verified pattern library (MTG rules guru).

Source of truth: markdown files at mtg-rules/interactions/*.md.
This table is a projection, refreshed atomically by ingest_patterns.py.

Layout matches rules_repo: replace_* for ingest, get_/find_/search_ for reads.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

from commander_mcp.db.connection import get_connection


@dataclass
class ParsedPattern:
    pattern_id: str
    name: str
    category: str | None
    cr_refs: list[str]
    tags: list[str]
    abstract: str
    body: str
    source_path: str
    created_at: str | None
    cards: list[tuple[str, str]] = field(default_factory=list)  # (card_name, role)
    xrefs: list[str] = field(default_factory=list)               # target pattern_ids


async def replace_patterns(patterns: list[ParsedPattern]) -> dict[str, int]:
    """Replace all pattern data atomically. Returns row counts."""
    conn = await get_connection()
    try:
        await conn.execute("BEGIN")
        await conn.execute("DELETE FROM verified_pattern_fts")
        await conn.execute("DELETE FROM verified_pattern_xref")
        await conn.execute("DELETE FROM verified_pattern_card")
        await conn.execute("DELETE FROM verified_pattern")

        card_rows = 0
        xref_rows = 0
        for p in patterns:
            await conn.execute(
                """INSERT INTO verified_pattern
                      (pattern_id, name, category, cr_refs, tags,
                       abstract, body, source_path, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    p.pattern_id,
                    p.name,
                    p.category,
                    json.dumps(p.cr_refs),
                    json.dumps(p.tags),
                    p.abstract,
                    p.body,
                    p.source_path,
                    p.created_at,
                ),
            )
            await conn.execute(
                """INSERT INTO verified_pattern_fts
                      (pattern_id, name, abstract, body) VALUES (?, ?, ?, ?)""",
                (p.pattern_id, p.name, p.abstract, p.body),
            )
            # Deduplicate (card_name, role) tuples per pattern.
            seen_cards: set[tuple[str, str]] = set()
            for card_name, role in p.cards:
                key = (card_name, role)
                if key in seen_cards:
                    continue
                seen_cards.add(key)
                await conn.execute(
                    """INSERT INTO verified_pattern_card
                          (pattern_id, card_name, role) VALUES (?, ?, ?)""",
                    (p.pattern_id, card_name, role),
                )
                card_rows += 1
            seen_xrefs: set[str] = set()
            for target in p.xrefs:
                if target == p.pattern_id or target in seen_xrefs:
                    continue
                seen_xrefs.add(target)
                await conn.execute(
                    """INSERT INTO verified_pattern_xref
                          (pattern_id, refers_to) VALUES (?, ?)""",
                    (p.pattern_id, target),
                )
                xref_rows += 1

        await conn.commit()
        return {
            "patterns": len(patterns),
            "card_links": card_rows,
            "xrefs": xref_rows,
        }
    except Exception:
        await conn.rollback()
        raise
    finally:
        await conn.close()


async def get_pattern(pattern_id: str) -> dict[str, Any] | None:
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT pattern_id, name, category, cr_refs, tags,
                      abstract, body, source_path, created_at
               FROM verified_pattern WHERE pattern_id = ?""",
            (pattern_id,),
        )
        row = await cur.fetchone()
        if row is None:
            return None

        cards = await _cards_for(conn, pattern_id)
        xrefs = await _xrefs_for(conn, pattern_id)
        return {**_row_to_dict(row), "cards": cards, "xrefs": xrefs}
    finally:
        await conn.close()


async def find_by_card(card_name: str, role: str | None = None) -> list[dict[str, Any]]:
    """Return all patterns that reference a card. Role filter is optional."""
    conn = await get_connection()
    try:
        params: list[Any] = [card_name]
        clause = "WHERE vpc.card_name = ?"
        if role is not None:
            clause += " AND vpc.role = ?"
            params.append(role)
        cur = await conn.execute(
            f"""SELECT vp.pattern_id, vp.name, vp.category, vp.cr_refs, vp.tags,
                       vp.abstract, vp.body, vp.source_path, vp.created_at,
                       vpc.role
                FROM verified_pattern_card vpc
                JOIN verified_pattern vp ON vp.pattern_id = vpc.pattern_id
                {clause}
                ORDER BY vp.pattern_id""",
            params,
        )
        rows = await cur.fetchall()
        return [{**_row_to_dict(r), "role": r["role"]} for r in rows]
    finally:
        await conn.close()


async def find_by_pair(card_a: str, card_b: str) -> list[dict[str, Any]]:
    """Patterns that mention both cards (any role)."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT DISTINCT vp.pattern_id, vp.name, vp.category, vp.cr_refs,
                      vp.tags, vp.abstract, vp.body, vp.source_path, vp.created_at
               FROM verified_pattern vp
               JOIN verified_pattern_card a ON a.pattern_id = vp.pattern_id AND a.card_name = ?
               JOIN verified_pattern_card b ON b.pattern_id = vp.pattern_id AND b.card_name = ?
               ORDER BY vp.pattern_id""",
            (card_a, card_b),
        )
        return [_row_to_dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def search_patterns(query: str, limit: int = 20) -> list[dict[str, Any]]:
    """FTS5 search across abstract + body."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT vp.pattern_id, vp.name, vp.category, vp.cr_refs, vp.tags,
                      vp.abstract, vp.body, vp.source_path, vp.created_at
               FROM verified_pattern_fts
               JOIN verified_pattern vp ON vp.pattern_id = verified_pattern_fts.pattern_id
               WHERE verified_pattern_fts MATCH ?
               ORDER BY bm25(verified_pattern_fts) LIMIT ?""",
            (_fts_phrase(query), limit),
        )
        return [_row_to_dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def get_xrefs(pattern_id: str) -> list[str]:
    conn = await get_connection()
    try:
        return await _xrefs_for(conn, pattern_id)
    finally:
        await conn.close()


async def is_ingested() -> bool:
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT COUNT(*) AS c FROM verified_pattern")
        row = await cur.fetchone()
        return bool(row and row["c"] > 0)
    finally:
        await conn.close()


async def stats() -> dict[str, int]:
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT COUNT(*) AS c FROM verified_pattern")
        patterns = (await cur.fetchone())["c"]
        cur = await conn.execute("SELECT COUNT(*) AS c FROM verified_pattern_card")
        cards = (await cur.fetchone())["c"]
        cur = await conn.execute("SELECT COUNT(*) AS c FROM verified_pattern_xref")
        xrefs = (await cur.fetchone())["c"]
        return {"patterns": patterns, "card_links": cards, "xrefs": xrefs}
    finally:
        await conn.close()


async def _cards_for(conn, pattern_id: str) -> list[dict[str, str]]:
    cur = await conn.execute(
        """SELECT card_name, role FROM verified_pattern_card
           WHERE pattern_id = ? ORDER BY role, card_name""",
        (pattern_id,),
    )
    return [{"card_name": r["card_name"], "role": r["role"]} for r in await cur.fetchall()]


async def _xrefs_for(conn, pattern_id: str) -> list[str]:
    cur = await conn.execute(
        "SELECT refers_to FROM verified_pattern_xref WHERE pattern_id = ? ORDER BY refers_to",
        (pattern_id,),
    )
    return [r["refers_to"] for r in await cur.fetchall()]


def _row_to_dict(row) -> dict[str, Any]:
    return {
        "pattern_id": row["pattern_id"],
        "name": row["name"],
        "category": row["category"],
        "cr_refs": json.loads(row["cr_refs"]) if row["cr_refs"] else [],
        "tags": json.loads(row["tags"]) if row["tags"] else [],
        "abstract": row["abstract"],
        "body": row["body"],
        "source_path": row["source_path"],
        "created_at": row["created_at"],
    }


def _fts_phrase(query: str) -> str:
    """Escape an arbitrary user query for SQLite FTS5. Mirrors rules_repo."""
    tokens = [t for t in query.strip().split() if t]
    if not tokens:
        return '""'
    return " ".join('"' + t.replace('"', '""') + '"' for t in tokens)
