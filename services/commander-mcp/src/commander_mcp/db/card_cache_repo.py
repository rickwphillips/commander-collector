"""
Card-cache repository.

Wraps the `card_cache` table so any tool that needs Scryfall card payloads
can check the cache first instead of hitting the API. The cache is keyed
on lowercased card name; values are the full Scryfall JSON payload.

Two entry points:

  get_cached(names)   -> dict mapping the original input name -> payload
                         (only for names found in cache)
  persist(cards)      -> upsert a list of Scryfall card payloads

The split — cache lookup separate from the network call — lets the caller
fall back to ScryfallClient for misses and feed the results back through
persist(). Keeps the cache in step with whatever Scryfall returns without
coupling either layer to the other.
"""

from __future__ import annotations

import json
from typing import Any

from commander_mcp.db.connection import get_connection


async def get_cached(names: list[str]) -> dict[str, dict[str, Any]]:
    """
    Look up cached Scryfall payloads by name (case-insensitive).

    Returns a dict keyed by the *original* input name (preserving the
    user's casing) -> Scryfall payload. Misses are simply absent from
    the result; callers compare keys to drive the fetch.
    """
    if not names:
        return {}

    # Build a lower -> original map so we can return results keyed on the
    # caller's casing.
    lower_to_original: dict[str, str] = {}
    for n in names:
        if n and n.lower() not in lower_to_original:
            lower_to_original[n.lower()] = n
    if not lower_to_original:
        return {}

    placeholders = ",".join("?" * len(lower_to_original))
    conn = await get_connection()
    try:
        cur = await conn.execute(
            f"SELECT name, payload FROM card_cache WHERE LOWER(name) IN ({placeholders})",
            list(lower_to_original.keys()),
        )
        rows = await cur.fetchall()
    finally:
        await conn.close()

    out: dict[str, dict[str, Any]] = {}
    for r in rows:
        original = lower_to_original.get(r["name"].lower())
        if original is None:
            continue
        try:
            out[original] = json.loads(r["payload"])
        except json.JSONDecodeError:
            # Corrupted cache entry — skip, will be refreshed by the next persist.
            continue
    return out


async def persist(cards: list[dict[str, Any]]) -> int:
    """
    Upsert Scryfall card payloads into card_cache.

    Returns the number of rows written. Cards missing a Scryfall id are
    skipped (we can't key them).
    """
    if not cards:
        return 0

    rows = []
    for card in cards:
        scryfall_id = card.get("id")
        if not scryfall_id:
            continue
        rows.append((
            scryfall_id,
            card.get("oracle_id", ""),
            card.get("name", ""),
            card.get("type_line", ""),
            card.get("oracle_text"),
            card.get("mana_cost"),
            card.get("cmc"),
            json.dumps(card.get("color_identity", [])),
            json.dumps(card.get("keywords", [])),
            json.dumps(card),
        ))

    if not rows:
        return 0

    conn = await get_connection()
    try:
        await conn.executemany(
            """INSERT OR REPLACE INTO card_cache
                  (scryfall_id, oracle_id, name, type_line, oracle_text,
                   mana_cost, cmc, color_identity, keywords, payload)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            rows,
        )
        await conn.commit()
    finally:
        await conn.close()
    return len(rows)


async def stats() -> dict[str, Any]:
    """Quick counts for diagnostics."""
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT COUNT(*) AS n FROM card_cache")
        row = await cur.fetchone()
        return {"cached_cards": row["n"]}
    finally:
        await conn.close()
