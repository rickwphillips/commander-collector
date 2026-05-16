# Commander Collector MCP

A Model Context Protocol server that gives an AI agent the **brains** for
[Commander Collector](https://github.com/rickwphillips/commander-collector):
intimate knowledge of Magic cards, the Comprehensive Rules (including the
layer system), Oracle rulings, deck archetypes, and learned synergy weights.

## Design principles

1. **Never confidently suggest something wrong.** Every tool response is wrapped
   in a `Confidence` envelope with bands `certain | high | moderate | low | unknown`.
   The agent must refuse to assert any claim whose band is `unknown`.
2. **Authoritative sources beat heuristics.** Scryfall card data, the
   Comprehensive Rules, and Oracle rulings are `CERTAIN`. Learned synergy
   weights are at most `MODERATE`.
3. **Graduate from primitives to reasoning.** Get card lookup rock solid
   first; deck-level analysis builds on top of that.

## Build phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Card primitives — name, text, type, advanced, full-schema, rulings | ✅ implemented |
| 2 | Comprehensive Rules + Layer System + Glossary lookup | ✅ implemented |
| 3 | Deck analysis, card-for-deck suggestions, synergy / anti-pattern detection | ✅ implemented |
| 4 | Daily crawler — Archidekt + EDHREC live, Moxfield/MTGGoldfish/TappedOut stubbed | ✅ implemented |
| 5 | Feedback loop — weight adjustment from conversation corrections, mistake triage | ✅ implemented |

## Layout

```
src/commander_mcp/
├── server.py            # FastMCP entry, transport selection
├── config.py            # Settings loaded from .env / CMC_* vars
├── confidence.py        # Confidence envelope for every tool response
├── tools/
│   ├── cards.py         # Phase 1 — Scryfall-backed card primitives
│   ├── rules.py         # Phase 2 — Comp Rules + layer system (stubs)
│   └── decks.py         # Phase 3 — deck analysis + suggestions (stubs)
├── services/
│   └── scryfall.py      # Async, rate-limited Scryfall client
├── db/
│   ├── schema.sql       # SQLite: card cache, decklist corpus, weights, feedback log
│   └── connection.py
└── learning/            # Phase 5 — weights + feedback (implemented)
```

## Tools exposed

### Phase 1 — cards (live, hitting Scryfall)
| Tool | Purpose |
|------|---------|
| `get_card` | Full Scryfall schema for one card |
| `search_cards_by_name` | Substring match on card name |
| `search_cards_by_text` | Substring match on Oracle text (abilities live here) |
| `search_cards_by_type` | Substring match on type line |
| `search_cards_advanced` | Full Scryfall query syntax pass-through |
| `get_card_rulings` | Official Oracle rulings for a card |

### Phase 2 — Comprehensive Rules (live, reading from local DB)
| Tool | Purpose |
|------|---------|
| `lookup_comprehensive_rule` | Exact rule (`613.1a`) or full section (`613`) |
| `search_comprehensive_rules` | FTS5 search across rule bodies |
| `explain_layer` | Returns CR 613 with focused rules for layer N |
| `lookup_glossary_term` | Glossary lookup with fuzzy fallback |

### Phase 3 — Decks (live, hitting Scryfall + local heuristics)
| Tool | Purpose |
|------|---------|
| `analyze_deck` | Color identity, mana curve, type & role mix, keyword density, lands, weak-spot warnings |
| `suggest_cards_for_deck` | Color-identity- and format-legality-filtered Scryfall suggestions, optionally theme-driven |
| `identify_synergies` | Pair-level synergies, heuristic blended with learned weights from the feedback loop |
| `identify_anti_patterns` | Flags pairs the user has corrected (negative learned weight, ≥2 samples) |

### Phase 5 — Feedback loop (live, reads/writes local DB)
| Tool | Purpose |
|------|---------|
| `record_feedback` | Log a `correction` / `confirmation` / `uncertainty` event; updates every pair drawn from `cards_involved` |
| `get_learned_synergy` | Look up the learned weight + sample size for one pair |
| `top_learned_synergies` | Strongest learned pairs in either direction (positive / negative) |
| `review_feedback_log` | Recent feedback events, newest first — triage view |
| `learning_status` | Counts by kind + total learned pairs + how many are past the noise threshold |

### Phase 4 — Decklist corpus (live, reads from local DB after crawl)
| Tool | Purpose |
|------|---------|
| `search_decklists` | Filter the corpus by commander / format / archetype / tier / source |
| `get_decklist_cards` | Full card list for a corpus deck by id |
| `popular_cards_for_commander` | Aggregate: which cards appear in what % of corpus decks for a commander |
| `popular_cards_in_archetype` | Aggregate: top cards across decks tagged with a given archetype |
| `corpus_status` | Counts of decks / commanders / sources currently ingested |

## Running the daily crawler

```bash
# Crawl every configured source (defaults: archidekt, edhrec) for commander format.
python -m commander_mcp.scripts.crawl_decklists

# Override sources / formats / per-source limit.
python -m commander_mcp.scripts.crawl_decklists \
    --sources archidekt edhrec --formats commander --limit 50
```

Schedule via cron:

```
0 5 * * * rick /path/to/.venv/bin/python -m commander_mcp.scripts.crawl_decklists
```

Adapter status:

| Source | Status | Notes |
|--------|--------|-------|
| `archidekt`   | ✅ implemented | Public REST API, polite 1.5s rate limit |
| `edhrec`      | ✅ implemented | JSON data API used by their Next.js site |
| `moxfield`    | 🚧 stub        | Partner-key gated since 2024 |
| `tappedout`   | 🚧 stub        | Requires authenticated user token |
| `mtggoldfish` | 🚧 stub        | No public API; would need HTML scraping |

The Phase 4 tools return `Confidence.unknown` until the crawl has run at least once.

## Ingesting the Comprehensive Rules

```bash
# Download the current revision and load into the DB.
python -m commander_mcp.scripts.ingest_rules

# Pin to a specific revision (handy when WotC publishes a new one).
python -m commander_mcp.scripts.ingest_rules \
    --url "https://media.wizards.com/2026/downloads/MagicCompRules%2020260227.txt"

# Parse a local file (offline / reproducible).
python -m commander_mcp.scripts.ingest_rules --from-file ./data/MagicCompRules.txt
```

The Phase 2 tools return `Confidence.unknown` until ingestion has run.

## Run

```bash
# install
uv venv && source .venv/bin/activate
uv pip install -e ".[dev]"

# stdio (Claude Desktop / agent config)
commander-mcp

# HTTP for local debugging
commander-mcp --http
# then connect MCP Inspector to http://localhost:8000/mcp

# tests
pytest
```

## Claude Desktop config

```jsonc
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "commander-collector": {
      "command": "/path/to/.venv/bin/commander-mcp"
    }
  }
}
```

## Next steps

1. **Verify against a real deck** — run `analyze_deck` and `suggest_cards_for_deck` against your Atraxa Jund-toxic build to see what the heuristics actually produce.
2. **Phase 4 — daily crawler** — start ingesting decklists from MTGGoldfish (competitive), EDHREC (Commander), and Moxfield/TappedOut (casual) into the `decklist` / `decklist_card` tables.
3. **Wire up to Commander Collector** — expose this MCP from the same host as the PHP API (Bluehost) via Streamable HTTP, or run alongside the Next.js dev server.
