"""
Feedback / learning repository.

Backs the `feedback_event` and `synergy_weight` tables. Every call to
`record_feedback` writes ONE event row, and for kinds that imply a
positive/negative signal (confirmation/correction), it ALSO updates the
synergy_weight row for every unordered pair drawn from cards_involved.
Both updates happen inside a single transaction so the DB never holds
half a feedback record.
"""

from __future__ import annotations

import json
from itertools import combinations
from typing import Any

from commander_mcp.db.connection import get_connection
from commander_mcp.learning.weights import (
    DELTA_CONFIRMATION,
    DELTA_CORRECTION,
    DELTA_UNCERTAINTY,
    canonical_pair,
    update_weight,
)


_KIND_TO_DELTA = {
    "confirmation": DELTA_CONFIRMATION,
    "correction": DELTA_CORRECTION,
    "uncertainty": DELTA_UNCERTAINTY,
}


async def record_feedback(
    *,
    kind: str,
    claim: str,
    correction: str | None,
    cards_involved: list[str] | None,
    context: str | None,
) -> dict[str, Any]:
    """
    Log a feedback event and propagate its weight delta to every card pair.

    Returns a summary dict: event_id, weight_delta, pairs_updated.
    """
    if kind not in _KIND_TO_DELTA:
        raise ValueError(f"unknown feedback kind: {kind!r}")
    delta = _KIND_TO_DELTA[kind]
    cards = [c.strip() for c in (cards_involved or []) if c and c.strip()]
    # Dedupe while preserving order so a user listing 'Bolt, Bolt' doesn't
    # double-count.
    seen: set[str] = set()
    deduped: list[str] = []
    for c in cards:
        if c not in seen:
            seen.add(c)
            deduped.append(c)
    cards = deduped

    pairs_updated: list[dict[str, Any]] = []

    conn = await get_connection()
    try:
        await conn.execute("BEGIN")

        # 1) Log the event.
        cur = await conn.execute(
            """INSERT INTO feedback_event
                  (kind, context, claim, correction, cards_involved, weight_delta)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                kind,
                context,
                claim,
                correction,
                json.dumps(cards) if cards else None,
                delta,
            ),
        )
        event_id = cur.lastrowid

        # 2) Update synergy_weight for every unordered pair (skipped for
        #    uncertainty events, which carry zero delta).
        if delta != 0.0 and len(cards) >= 2:
            ctx = context or ""
            for a, b in combinations(cards, 2):
                if a == b:
                    continue
                ca, cb = canonical_pair(a, b)
                summary = await _apply_delta(conn, ca, cb, ctx, delta)
                pairs_updated.append(summary)

        await conn.commit()
    except Exception:
        await conn.rollback()
        raise
    finally:
        await conn.close()

    return {
        "event_id": event_id,
        "kind": kind,
        "weight_delta": delta,
        "pairs_updated": pairs_updated,
    }


async def _apply_delta(conn, card_a: str, card_b: str, context: str, delta: float) -> dict[str, Any]:
    """Run one weight update inside an existing transaction. Returns a summary."""
    cur = await conn.execute(
        """SELECT weight, sample_size FROM synergy_weight
           WHERE card_a = ? AND card_b = ? AND context = ?""",
        (card_a, card_b, context),
    )
    row = await cur.fetchone()
    if row is None:
        new_weight, new_n = update_weight(0.0, 0, delta)
        await conn.execute(
            """INSERT INTO synergy_weight (card_a, card_b, context, weight, sample_size)
               VALUES (?, ?, ?, ?, ?)""",
            (card_a, card_b, context, new_weight, new_n),
        )
    else:
        new_weight, new_n = update_weight(row["weight"], row["sample_size"], delta)
        await conn.execute(
            """UPDATE synergy_weight
                  SET weight = ?, sample_size = ?, updated_at = CURRENT_TIMESTAMP
                WHERE card_a = ? AND card_b = ? AND context = ?""",
            (new_weight, new_n, card_a, card_b, context),
        )
    return {
        "card_a": card_a,
        "card_b": card_b,
        "context": context,
        "weight": round(new_weight, 4),
        "sample_size": new_n,
    }


async def get_synergy_weight(
    card_a: str,
    card_b: str,
    context: str | None = None,
) -> dict[str, Any] | None:
    """Return the learned weight for a pair, or None if nothing has been recorded."""
    ca, cb = canonical_pair(card_a, card_b)
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT weight, sample_size, updated_at FROM synergy_weight
               WHERE card_a = ? AND card_b = ? AND context = ?""",
            (ca, cb, context or ""),
        )
        row = await cur.fetchone()
        if row is None:
            return None
        return {
            "card_a": ca,
            "card_b": cb,
            "context": context or "",
            "weight": row["weight"],
            "sample_size": row["sample_size"],
            "updated_at": row["updated_at"],
        }
    finally:
        await conn.close()


async def get_synergy_weights_batch(
    pairs: list[tuple[str, str]],
    context: str | None = None,
) -> dict[tuple[str, str], dict[str, Any]]:
    """
    Bulk lookup keyed by canonical pair. Used by the Phase 3 synergy blend
    to avoid one-DB-call-per-pair when scoring a 100-card deck.
    """
    if not pairs:
        return {}
    canonical = {canonical_pair(a, b) for a, b in pairs}
    conn = await get_connection()
    try:
        out: dict[tuple[str, str], dict[str, Any]] = {}
        # SQLite caps parameter count; chunk if needed. 200 pairs * 2 = 400
        # params per chunk is well under the default 999 limit.
        CHUNK = 200
        canonical_list = list(canonical)
        ctx = context or ""
        for i in range(0, len(canonical_list), CHUNK):
            chunk = canonical_list[i:i + CHUNK]
            placeholders = ",".join("(?, ?)" for _ in chunk)
            params: list[Any] = []
            for a, b in chunk:
                params.extend([a, b])
            params.append(ctx)
            sql = (
                f"SELECT card_a, card_b, weight, sample_size FROM synergy_weight "
                f"WHERE (card_a, card_b) IN ({placeholders}) AND context = ?"
            )
            cur = await conn.execute(sql, params)
            for row in await cur.fetchall():
                out[(row["card_a"], row["card_b"])] = {
                    "weight": row["weight"],
                    "sample_size": row["sample_size"],
                }
        return out
    finally:
        await conn.close()


async def top_learned_synergies(
    context: str | None = None,
    *,
    direction: str = "positive",     # 'positive' | 'negative'
    min_sample_size: int = 2,
    limit: int = 25,
) -> list[dict[str, Any]]:
    """List the strongest learned pairs (positive or negative) by weight."""
    order_dir = "DESC" if direction == "positive" else "ASC"
    conn = await get_connection()
    try:
        cur = await conn.execute(
            f"""SELECT card_a, card_b, context, weight, sample_size, updated_at
                  FROM synergy_weight
                 WHERE context = ?
                   AND sample_size >= ?
                 ORDER BY weight {order_dir}
                 LIMIT ?""",
            (context or "", min_sample_size, limit),
        )
        return [
            {
                "card_a": row["card_a"],
                "card_b": row["card_b"],
                "context": row["context"],
                "weight": row["weight"],
                "sample_size": row["sample_size"],
                "updated_at": row["updated_at"],
            }
            for row in await cur.fetchall()
        ]
    finally:
        await conn.close()


async def list_feedback_events(
    *,
    kind: str | None = None,
    context: str | None = None,
    limit: int = 25,
) -> list[dict[str, Any]]:
    """Recent feedback events, newest first. Used by the triage tool."""
    where: list[str] = []
    params: list[Any] = []
    if kind is not None:
        where.append("kind = ?")
        params.append(kind)
    if context is not None:
        where.append("context = ?")
        params.append(context)
    where_clause = ("WHERE " + " AND ".join(where)) if where else ""
    params.append(limit)

    conn = await get_connection()
    try:
        cur = await conn.execute(
            f"""SELECT id, kind, context, claim, correction, cards_involved,
                       weight_delta, created_at
                  FROM feedback_event
                  {where_clause}
                 ORDER BY id DESC
                 LIMIT ?""",
            params,
        )
        rows = await cur.fetchall()
        out: list[dict[str, Any]] = []
        for r in rows:
            out.append({
                "id": r["id"],
                "kind": r["kind"],
                "context": r["context"],
                "claim": r["claim"],
                "correction": r["correction"],
                "cards_involved": json.loads(r["cards_involved"]) if r["cards_involved"] else [],
                "weight_delta": r["weight_delta"],
                "created_at": r["created_at"],
            })
        return out
    finally:
        await conn.close()


async def feedback_stats() -> dict[str, Any]:
    """Counts by kind + total learned pairs. For the triage / status tool."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            "SELECT kind, COUNT(*) AS n FROM feedback_event GROUP BY kind"
        )
        by_kind = {row["kind"]: row["n"] for row in await cur.fetchall()}

        cur = await conn.execute("SELECT COUNT(*) AS n FROM synergy_weight")
        weight_rows = (await cur.fetchone())["n"]

        cur = await conn.execute(
            "SELECT COUNT(*) AS n FROM synergy_weight WHERE sample_size >= 2"
        )
        confirmed_rows = (await cur.fetchone())["n"]

        return {
            "events_by_kind": by_kind,
            "events_total": sum(by_kind.values()),
            "pairs_with_weight": weight_rows,
            "pairs_with_two_or_more_samples": confirmed_rows,
        }
    finally:
        await conn.close()
