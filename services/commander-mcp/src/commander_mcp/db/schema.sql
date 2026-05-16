-- Commander Collector MCP — local persistence schema.
--
-- Four concerns live here:
--   1. Scryfall card cache       (avoid hammering the API)
--   2. Decklist corpus           (daily crawl results)
--   3. Synergy weights           (learned via conversation feedback)
--   4. Feedback / mistake log    (closes the self-correction loop)

PRAGMA foreign_keys = ON;

-- 1. Card cache ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS card_cache (
    scryfall_id   TEXT PRIMARY KEY,
    oracle_id     TEXT NOT NULL,
    name          TEXT NOT NULL,
    type_line     TEXT NOT NULL,
    oracle_text   TEXT,
    mana_cost     TEXT,
    cmc           REAL,
    color_identity TEXT,            -- JSON array, e.g. ["B","R","G"]
    keywords      TEXT,             -- JSON array
    payload       TEXT NOT NULL,    -- full Scryfall JSON
    fetched_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_card_cache_name        ON card_cache(name);
CREATE INDEX IF NOT EXISTS idx_card_cache_oracle_id   ON card_cache(oracle_id);

-- 2. Decklist corpus -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS decklist (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    source        TEXT NOT NULL,        -- 'mtggoldfish', 'edhrec', 'moxfield', ...
    source_url    TEXT,
    format        TEXT NOT NULL,        -- 'commander', 'modern', 'standard', ...
    archetype     TEXT,                 -- 'jund toxic', 'aristocrats', ...
    tier          TEXT,                 -- 'competitive', 'casual', 'budget'
    commander     TEXT,                 -- nullable for non-commander formats
    win_rate      REAL,                 -- if tournament data attaches it
    fetched_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS decklist_card (
    decklist_id   INTEGER NOT NULL REFERENCES decklist(id) ON DELETE CASCADE,
    card_name     TEXT NOT NULL,
    quantity      INTEGER NOT NULL DEFAULT 1,
    role          TEXT,                 -- 'commander', 'mainboard', 'sideboard'
    PRIMARY KEY (decklist_id, card_name, role)
);

CREATE INDEX IF NOT EXISTS idx_decklist_format    ON decklist(format);
CREATE INDEX IF NOT EXISTS idx_decklist_archetype ON decklist(archetype);
CREATE INDEX IF NOT EXISTS idx_decklist_card_name ON decklist_card(card_name);

-- 3. Synergy weights -----------------------------------------------------------
-- Pair-level synergy score, scoped by context. Updated by the feedback loop.
CREATE TABLE IF NOT EXISTS synergy_weight (
    card_a        TEXT NOT NULL,
    card_b        TEXT NOT NULL,
    context       TEXT NOT NULL,        -- e.g. 'commander/jund-toxic'
    weight        REAL NOT NULL DEFAULT 0.0,    -- -1.0 .. +1.0
    sample_size   INTEGER NOT NULL DEFAULT 0,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (card_a, card_b, context),
    CHECK (card_a < card_b)             -- canonical ordering, no duplicates
);

-- 4. Feedback / mistake log ----------------------------------------------------
-- Triage data: when the agent's recommendation is corrected, log it here.
CREATE TABLE IF NOT EXISTS feedback_event (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    kind          TEXT NOT NULL,        -- 'correction', 'confirmation', 'uncertainty'
    context       TEXT,
    claim         TEXT NOT NULL,        -- what the agent said
    correction    TEXT,                 -- what the user said back (nullable)
    cards_involved TEXT,                -- JSON array
    weight_delta  REAL,                 -- how much weights shifted as a result
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_kind ON feedback_event(kind);

-- 5. Comprehensive Rules -------------------------------------------------------
-- Authoritative source of truth (alongside Oracle text). Refreshed via the
-- scripts/ingest_rules.py CLI whenever Wizards publishes a new revision.

CREATE TABLE IF NOT EXISTS cr_metadata (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cr_section (
    number      TEXT PRIMARY KEY,       -- "100", "613", "903"
    chapter     TEXT NOT NULL,          -- "1", "6", "9"
    title       TEXT NOT NULL           -- "General", "Interaction of Continuous Effects"
);

CREATE TABLE IF NOT EXISTS cr_rule (
    rule_number TEXT PRIMARY KEY,       -- "100.1", "613.1a", "903.10"
    section     TEXT NOT NULL,          -- "100"
    parent      TEXT,                   -- "100.1" for subrule "100.1a"; NULL for top-level
    body        TEXT NOT NULL,
    examples    TEXT,                   -- JSON array of example strings
    FOREIGN KEY (section) REFERENCES cr_section(number)
);

CREATE INDEX IF NOT EXISTS idx_cr_rule_section ON cr_rule(section);
CREATE INDEX IF NOT EXISTS idx_cr_rule_parent  ON cr_rule(parent);

CREATE TABLE IF NOT EXISTS cr_glossary (
    term        TEXT PRIMARY KEY,
    definition  TEXT NOT NULL
);

-- FTS5 indexes for fuzzy text search across rule bodies and glossary entries.
-- Maintained manually (standalone FTS) — populated alongside the source tables.
CREATE VIRTUAL TABLE IF NOT EXISTS cr_rule_fts USING fts5(
    rule_number UNINDEXED,
    body,
    tokenize = 'porter unicode61'
);

CREATE VIRTUAL TABLE IF NOT EXISTS cr_glossary_fts USING fts5(
    term,
    definition,
    tokenize = 'porter unicode61'
);

-- 6. Verified pattern library (MTG rules guru) --------------------------------
-- Markdown patterns at FreddyRhetorickProjects/mtg-rules/interactions/*.md
-- are canonical; this table is a projection refreshed via ingest_patterns.py.
CREATE TABLE IF NOT EXISTS verified_pattern (
    pattern_id    TEXT PRIMARY KEY,         -- 'p001', 'p825'
    name          TEXT NOT NULL,
    category      TEXT,                     -- 'combat', 'triggered', 'costs', ...
    cr_refs       TEXT,                     -- JSON array of CR rule numbers
    tags          TEXT,                     -- JSON array
    abstract      TEXT,                     -- ## Abstract section only
    body          TEXT NOT NULL,            -- full markdown body
    source_path   TEXT NOT NULL,            -- relative path of source file
    created_at    DATE                      -- frontmatter `created:`
);

CREATE INDEX IF NOT EXISTS idx_verified_pattern_category ON verified_pattern(category);

CREATE TABLE IF NOT EXISTS verified_pattern_card (
    pattern_id    TEXT NOT NULL REFERENCES verified_pattern(pattern_id) ON DELETE CASCADE,
    card_name     TEXT NOT NULL,            -- canonical Scryfall name
    role          TEXT NOT NULL,            -- 'subject', 'example', 'foil', 'mentioned'
    PRIMARY KEY (pattern_id, card_name, role)
);

CREATE INDEX IF NOT EXISTS idx_verified_pattern_card_name ON verified_pattern_card(card_name);

CREATE TABLE IF NOT EXISTS verified_pattern_xref (
    pattern_id    TEXT NOT NULL REFERENCES verified_pattern(pattern_id) ON DELETE CASCADE,
    refers_to     TEXT NOT NULL,            -- target pattern_id
    PRIMARY KEY (pattern_id, refers_to)
);

CREATE INDEX IF NOT EXISTS idx_verified_pattern_xref_refers_to ON verified_pattern_xref(refers_to);

CREATE VIRTUAL TABLE IF NOT EXISTS verified_pattern_fts USING fts5(
    pattern_id UNINDEXED,
    name,
    abstract,
    body,
    tokenize = 'porter unicode61'
);

-- 7. Card notes ---------------------------------------------------------------
-- Single-card facts: bans, traps, staples, situational, requirement. The
-- scoring service reads this table for per-card priors before considering
-- pair-level synergy.
CREATE TABLE IF NOT EXISTS card_note (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    card_name     TEXT NOT NULL,            -- canonical Scryfall name, lowercased
    format        TEXT,                     -- 'commander', 'modern', ... NULL = any format
    archetype     TEXT,                     -- 'jund-toxic', ... NULL = any archetype
    kind          TEXT NOT NULL,            -- 'banned', 'trap', 'staple', 'situational', 'requirement'
    weight        REAL NOT NULL,            -- -1.0 .. +1.0
    source        TEXT NOT NULL,            -- 'seed:v1', 'pattern:Pxxx', 'feedback:N'
    message       TEXT NOT NULL,            -- human-readable explanation
    sample_size   INTEGER NOT NULL DEFAULT 1,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (card_name, format, archetype, kind, source)
);

CREATE INDEX IF NOT EXISTS idx_card_note_card    ON card_note(card_name);
CREATE INDEX IF NOT EXISTS idx_card_note_format  ON card_note(format);
