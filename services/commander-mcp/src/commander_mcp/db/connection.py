"""Async SQLite connection / migration helper."""

from __future__ import annotations

from pathlib import Path
import aiosqlite

from commander_mcp.config import settings

_SCHEMA_FILE = Path(__file__).parent / "schema.sql"


async def get_connection() -> aiosqlite.Connection:
    settings.db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = await aiosqlite.connect(settings.db_path)
    conn.row_factory = aiosqlite.Row
    return conn


async def init_db() -> None:
    """Apply schema.sql. Safe to run on every start (idempotent CREATE IF NOT EXISTS)."""
    conn = await get_connection()
    try:
        sql = _SCHEMA_FILE.read_text(encoding="utf-8")
        await conn.executescript(sql)
        await conn.commit()
    finally:
        await conn.close()
