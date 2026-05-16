"""
Repository for Comprehensive Rules tables.

Two halves:
  - upsert_*  : called by the ingestion script, replaces all rows
  - get_*     : called by the tools layer, returns Confidence-friendly dicts
"""

from __future__ import annotations

import json
from typing import Any

from commander_mcp.db.connection import get_connection
from commander_mcp.services.rules_loader import ParsedRules


# --- Ingestion ---------------------------------------------------------------
async def replace_rules(parsed: ParsedRules) -> dict[str, int]:
    """Replace all CR data atomically. Returns row counts."""
    conn = await get_connection()
    try:
        await conn.execute("BEGIN")
        # Drop existing data — schema stays; rows go.
        await conn.execute("DELETE FROM cr_rule_fts")
        await conn.execute("DELETE FROM cr_glossary_fts")
        await conn.execute("DELETE FROM cr_rule")
        await conn.execute("DELETE FROM cr_glossary")
        await conn.execute("DELETE FROM cr_section")
        await conn.execute("DELETE FROM cr_metadata")

        for k, v in parsed.metadata.items():
            await conn.execute(
                "INSERT INTO cr_metadata(key, value) VALUES (?, ?)", (k, v)
            )

        for sec in parsed.sections:
            await conn.execute(
                "INSERT INTO cr_section(number, chapter, title) VALUES (?, ?, ?)",
                (sec.number, sec.chapter, sec.title),
            )

        for rule in parsed.rules:
            await conn.execute(
                """INSERT INTO cr_rule(rule_number, section, parent, body, examples)
                   VALUES (?, ?, ?, ?, ?)""",
                (
                    rule.rule_number,
                    rule.section,
                    rule.parent,
                    rule.body,
                    json.dumps(rule.examples) if rule.examples else None,
                ),
            )
            await conn.execute(
                "INSERT INTO cr_rule_fts(rule_number, body) VALUES (?, ?)",
                (rule.rule_number, rule.body),
            )

        for entry in parsed.glossary:
            await conn.execute(
                "INSERT OR REPLACE INTO cr_glossary(term, definition) VALUES (?, ?)",
                (entry.term, entry.definition),
            )
            await conn.execute(
                "INSERT INTO cr_glossary_fts(term, definition) VALUES (?, ?)",
                (entry.term, entry.definition),
            )

        await conn.commit()
        return {
            "sections": len(parsed.sections),
            "rules": len(parsed.rules),
            "glossary_terms": len(parsed.glossary),
        }
    except Exception:
        await conn.rollback()
        raise
    finally:
        await conn.close()


# --- Reads -------------------------------------------------------------------
async def get_rule(rule_number: str) -> dict[str, Any] | None:
    conn = await get_connection()
    try:
        cur = await conn.execute(
            "SELECT rule_number, section, parent, body, examples FROM cr_rule WHERE rule_number = ?",
            (rule_number,),
        )
        row = await cur.fetchone()
        if row is None:
            return None
        return _rule_row_to_dict(row)
    finally:
        await conn.close()


async def get_section_rules(section: str) -> list[dict[str, Any]]:
    """Return rule 'XYZ.N' first, then all subrules 'XYZ.Na'..., ordered."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT rule_number, section, parent, body, examples FROM cr_rule
               WHERE section = ? ORDER BY rule_number""",
            (section,),
        )
        return [_rule_row_to_dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def search_rules(query: str, limit: int = 20) -> list[dict[str, Any]]:
    """FTS5 search across rule bodies."""
    conn = await get_connection()
    try:
        cur = await conn.execute(
            """SELECT cr_rule.rule_number, cr_rule.section, cr_rule.parent,
                      cr_rule.body, cr_rule.examples
               FROM cr_rule_fts
               JOIN cr_rule ON cr_rule.rule_number = cr_rule_fts.rule_number
               WHERE cr_rule_fts MATCH ?
               ORDER BY bm25(cr_rule_fts) LIMIT ?""",
            (_fts_phrase(query), limit),
        )
        return [_rule_row_to_dict(r) for r in await cur.fetchall()]
    finally:
        await conn.close()


async def lookup_glossary_term(term: str) -> dict[str, Any] | None:
    conn = await get_connection()
    try:
        # Exact match first (case-insensitive), then FTS fallback.
        cur = await conn.execute(
            "SELECT term, definition FROM cr_glossary WHERE LOWER(term) = LOWER(?)",
            (term,),
        )
        row = await cur.fetchone()
        if row:
            return {"term": row["term"], "definition": row["definition"], "match": "exact"}

        # FTS fallback — pick the top hit.
        cur = await conn.execute(
            """SELECT term, definition FROM cr_glossary_fts
               WHERE cr_glossary_fts MATCH ? ORDER BY bm25(cr_glossary_fts) LIMIT 1""",
            (_fts_phrase(term),),
        )
        row = await cur.fetchone()
        if row:
            return {"term": row["term"], "definition": row["definition"], "match": "fuzzy"}
        return None
    finally:
        await conn.close()


def _fts_phrase(query: str) -> str:
    """
    Escape an arbitrary user query for SQLite FTS5.

    FTS5 treats `-`, `:`, `"`, `(`, `)`, etc. as operators. The safe move is
    to split on whitespace, wrap each token in double quotes (escaping any
    internal quotes), and join with spaces — turning the query into an
    implicit-AND of literal phrases.
    """
    tokens = [t for t in query.strip().split() if t]
    if not tokens:
        return '""'
    return " ".join('"' + t.replace('"', '""') + '"' for t in tokens)


async def get_metadata() -> dict[str, str]:
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT key, value FROM cr_metadata")
        return {r["key"]: r["value"] for r in await cur.fetchall()}
    finally:
        await conn.close()


async def is_ingested() -> bool:
    conn = await get_connection()
    try:
        cur = await conn.execute("SELECT COUNT(*) AS c FROM cr_rule")
        row = await cur.fetchone()
        return bool(row and row["c"] > 0)
    finally:
        await conn.close()


def _rule_row_to_dict(row) -> dict[str, Any]:
    return {
        "rule_number": row["rule_number"],
        "section": row["section"],
        "parent": row["parent"],
        "body": row["body"],
        "examples": json.loads(row["examples"]) if row["examples"] else [],
    }
