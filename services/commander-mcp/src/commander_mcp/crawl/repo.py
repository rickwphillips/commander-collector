"""
Repository for the crawled-decklist corpus.

Backed by the `decklist` and `decklist_card` tables defined in schema.sql.
Persistence is idempotent: a CrawledDecklist with the same (source, source_url)
as an existing row replaces it on next run (so we always have the latest copy).

Read paths feed the corpus MCP tools.
"""

from __future__ import annotations

from typing import Any

from commander_mcp.crawl.base import CrawledDecklist
from commander_mcp.db.connection import get_connection


async def upsert_decklist(deck: CrawledDecklist) -> int:
    """Insert or replace a single decklist. Returns the deck's rowid."""
    conn = await get_connection()
    try:
        await conn.execute("BEGIN")
        # Replace any existing record for the same (source, source_url).
        cur = await conn.execute(
            "SELECT id FROM decklist WHERE source = ? AND source_url = ?",
            (deck.source, deck.source_url),
        )
        existing = await cur.fetchone()
        if existing is not None:
            await conn.execute("DELETE FROM decklist_card WHERE decklist_id = ?", (existing["id"],))
            await conn.execute("DELETE FROM decklist WHERE id = ?", (existing["id"],))

        cur = await conn.execute(
            """INSERT INTO decklist(source, source_url, format, archetype, tier, commander, win_rate)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                deck.source,
                deck.source_url,
                deck.format,
                deck.archetype,
                deck.tier,
                deck.commander,
                deck.win_rate,
            ),
        )
        deck_id = cur.lastrowid

        for card in deck.cards:
            await conn.execute(
                """INSERT OR REPLACE INTO decklist_card(decklist_id, card_name, quantity, role)
                   VALUES (?, ?, ?, ?)""",
                (deck_id, card.name, card.quantity, card.role),
            )

        await conn.commit()
        return deck_id
    except Exception:
        await conn.rollback()
        raise
    finally:
        await conn.close()


async def upsert_many(decks: list[CrawledDecklist]) -> int:
    """Upsert a batch. Returns the count successfully written."""
    written = 0
    for d in decks:
        try:
            await upsert_decklist(d)
            written += 1
        except Exception:
            # Skip individual failures; one bad record shouldn't take down the batch.
            continue
    return written


# -- Queries ------------------------------------------------------------------
async def search_decklists(
    *,
    commander: str | None = None,
    format: str | None = None,
    archetype: str | None = None,
    tier: str | None = None,
    source: str | None = None,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """Filter the corpus by any combination of fields."""
    where_clauses = []
    params: list[Any] = []
    if commander:
        where_clauses.append("LOWER(commander) = LOWER(?)")
        params.append(commander)
    if format:
        where_clauses.append("format = ?")
        params.append(format)
    if archetype:
        where_clauses.append("LOWER(archetype) LIKE LOWER(?)")
        params.append(f"%{archetype}%")
    if tier:
        where_clauses.append("tier = ?")
        params.append(tier)
    if source:
        where_clauses.append("source = ?")
        params.append(source)
    where = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

    conn = await get_connection()
    try:
        cur = await conn.execute(
            f"""SELECT id, source, source_url, format, archetype, tier,
                       commander, win_rate, fetched_at
                FROM decklist
                {where}
                ORDER BY fetched_at DESC
                LIMIT ?""",
            (*params, limit),
        )
        rows = await cur.fetchall()
        return [dict(r) for r in rows]
    finally:
        await conn.close()


async def cards_in_decklist(decklist_id: int) -> list[dict[str, Any]]:
    conn = await get_connection()
    try:
        cur = await conn.execute(
            "SELECT card_name, quantity, role FROM decklist_card WHERE decklist_id = ? ORDER BY role, card_name",
            (decklist_id,),
        )
        return [dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def popular_cards_for_commander(
    commander: str,
    *,
    limit: int = 30,
    format: str = "commander",
) -> list[dict[str, Any]]:
    """How often each card appears across all corpus decks with this commander."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT decklist_card.card_name AS card_name,
                      COUNT(DISTINCT decklist.id) AS deck_count,
                      ROUND(COUNT(DISTINCT decklist.id) * 100.0 /
                            NULLIF((SELECT COUNT(*) FROM decklist
                                    WHERE LOWER(commander) = LOWER(?) AND format = ?), 0),
                            2) AS percent_of_decks
               FROM decklist
               JOIN decklist_card ON decklist_card.decklist_id = decklist.id
               WHERE LOWER(decklist.commander) = LOWER(?)
                 AND decklist.format = ?
                 AND decklist_card.role IN ('mainboard', 'commander')
               GROUP BY decklist_card.card_name
               ORDER BY deck_count DESC, card_name ASC
               LIMIT ?""",
            (commander, format, commander, format, limit),
        )
        return [dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def popular_cards_in_archetype(
    archetype: str,
    *,
    limit: int = 30,
    format: str | None = None,
) -> list[dict[str, Any]]:
    """How often each card appears across decks tagged with this archetype."""
    fmt_clause = " AND decklist.format = ?" if format else ""
    params: list[Any] = [f"%{archetype}%"]
    if format:
        params.append(format)
    params.append(limit)

    conn = await get_connection()
    try:
        cur = await conn.execute(
            f"""SELECT decklist_card.card_name AS card_name,
                       COUNT(DISTINCT decklist.id) AS deck_count
                FROM decklist
                JOIN decklist_card ON decklist_card.decklist_id = decklist.id
                WHERE LOWER(decklist.archetype) LIKE LOWER(?){fmt_clause}
                  AND decklist_card.role IN ('mainboard', 'commander')
                GROUP BY decklist_card.card_name
                ORDER BY deck_count DESC, card_name ASC
                LIMIT ?""",
            params,
        )
        return [dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def corpus_stats() -> dict[str, Any]:
    """Summary numbers for `is_ingested`-style checks and the agent's intros."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT COUNT(*) AS decks,
                      COUNT(DISTINCT commander) AS commanders,
                      COUNT(DISTINCT source) AS sources
               FROM decklist"""
        )
        row = await cur.fetchone()
        return {
            "decks": (row["decks"] if row else 0) or 0,
            "commanders": (row["commanders"] if row else 0) or 0,
            "sources": (row["sources"] if row else 0) or 0,
        }
    finally:
        await conn.close()
