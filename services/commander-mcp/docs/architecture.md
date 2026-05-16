# Commander Collector MCP — Architecture Diagrams

Four diagrams covering the server end to end. All Mermaid — paste into anything that renders Mermaid (GitHub, VS Code, claude.ai canvas, Notion, Obsidian, Typora).

---

## 1. System layers

The server is a four-layer onion: tools at the edge, services in the middle, DB repos closest to storage, SQLite + external APIs at the bottom.

```mermaid
flowchart TB
    Client["Claude Desktop / MCP Inspector"]

    subgraph Tools["Tool layer — 25 MCP tools"]
        direction LR
        T1["cards (6)"]
        T2["mana (1)"]
        T3["rules (4)"]
        T4["decks (4)"]
        T5["corpus (5)"]
        T6["learning (5)"]
    end

    subgraph Services["Service layer — pure logic"]
        direction LR
        Sc["scryfall<br/>async client"]
        Dl["decklist<br/>parser"]
        Da["deck_analysis<br/>metrics + roles"]
        Sy["synergy<br/>heuristic"]
        Sl["synergy_learned<br/>heuristic + DB blend"]
        Rl["rules_loader"]
        Mn["mana"]
    end

    subgraph Repos["DB repo layer"]
        direction LR
        Cc["card_cache_repo"]
        Fb["feedback_repo"]
        Rr["rules_repo"]
    end

    subgraph Storage["SQLite + external"]
        direction LR
        DB[("SQLite<br/>9 tables + FTS5")]
        Ext["Scryfall<br/>Archidekt<br/>EDHREC<br/>Wizards CR"]
    end

    Client --> Tools
    Tools --> Services
    Tools --> Repos
    Services --> Repos
    Services --> Ext
    Repos --> DB

    classDef toolLayer fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef serviceLayer fill:#1f2937,stroke:#10b981,color:#fff
    classDef repoLayer fill:#3b2f1f,stroke:#f59e0b,color:#fff
    classDef storageLayer fill:#3f1f3f,stroke:#a855f7,color:#fff

    class T1,T2,T3,T4,T5,T6 toolLayer
    class Sc,Dl,Da,Sy,Sl,Rl,Mn serviceLayer
    class Cc,Fb,Rr repoLayer
    class DB,Ext storageLayer
```

**Why the split.** Tools register with FastMCP and validate input. Services hold the math and parsing — no I/O, trivially unit-testable. Repos own the DB. The strict layering means each test can mock the layer below it.

---

## 2. Request flow — `analyze_deck`

What happens when the agent calls one of the deck tools. The cache-first resolver means a warm cache costs zero API calls; a cold cache costs ~2.

```mermaid
sequenceDiagram
    autonumber
    participant A as Agent
    participant T as analyze_deck
    participant P as decklist.parse_decklist
    participant R as card_cache_repo
    participant S as ScryfallClient
    participant X as deck_analysis.analyze

    A->>T: decklist[], commander, target_size
    T->>P: parse lines
    P-->>T: [DeckEntry(name, qty, role), ...]

    T->>R: get_cached([names])
    R-->>T: {hit_name → payload, ...}

    alt cache has misses
        T->>S: collection([{"name": miss}, ...])
        S-->>T: (fetched, not_found)
        T->>R: persist(fetched)
        R-->>T: rows_written
    end

    T->>X: analyze(found, entries, missing)
    X-->>T: {curve, colors, types, roles, warnings, ...}

    T-->>A: Confidence{band, data, sources, caveats}
```

**Band selection logic.** All cards resolved → `HIGH`. Some unresolved → `MODERATE` with the missing names in `caveats`. Empty decklist → `UNKNOWN`.

---

## 3. Phase 5 feedback loop

User corrections become weight deltas that shape future synergy scoring. The loop is bounded — `update_weight` is a running mean clamped to [-1, +1], so no single bad day swings the score.

```mermaid
flowchart LR
    subgraph Write["Write path — record_feedback"]
        U["User: 'Sol Ring doesn't<br/>synergize with Ramos<br/>in this build'"]
        RF["record_feedback tool<br/>kind: correction"]
        FR["feedback_repo<br/>(one transaction)"]
        FE[("feedback_event<br/>append-only log")]
        SW[("synergy_weight<br/>running mean per pair")]

        U --> RF
        RF --> FR
        FR --> FE
        FR --> SW
    end

    subgraph Read["Read path — identify_synergies"]
        IS["identify_synergies tool"]
        SL["synergy_learned"]
        SY["synergy.score_pair<br/>(heuristic, 0..1)"]
        LB["blend by sample_size<br/>(half-life = 4)"]
        OUT["blended_score in [-1, +1]"]

        IS --> SL
        SL --> SY
        SY --> LB
        SW -.->|"batch lookup"| SL
        SL --> LB
        LB --> OUT
    end

    Write -.->|"next call sees updated weights"| Read

    classDef writeNode fill:#3b2f1f,stroke:#f59e0b,color:#fff
    classDef readNode fill:#1f3a2f,stroke:#10b981,color:#fff
    classDef store fill:#3f1f3f,stroke:#a855f7,color:#fff

    class U,RF,FR writeNode
    class IS,SL,SY,LB,OUT readNode
    class FE,SW store
```

**Blend formula.** `alpha = n / (n + 4)`. At `n=0` (no feedback), the heuristic carries 100%. At `n=4`, learned weight is 50%. At `n=20`, learned weight is ~83%. The heuristic is the cold-start; feedback gradually takes over as evidence accumulates.

**Anti-pattern detection** uses the same `synergy_weight` table but reads in the opposite direction — pairs with `weight ≤ -0.25` and `sample_size ≥ 2` get flagged. That's how `identify_anti_patterns` knows what *not* to suggest.

---

## 4. Database schema

Nine tables across four concerns: card cache (1), decklist corpus (2), feedback loop (2), and Comprehensive Rules (4 incl. FTS5 mirrors).

```mermaid
erDiagram
    decklist ||--o{ decklist_card : "contains"
    cr_section ||--o{ cr_rule : "groups"
    cr_rule ||--o| cr_rule_fts : "indexed by"
    cr_glossary ||--o| cr_glossary_fts : "indexed by"

    card_cache {
        TEXT scryfall_id PK
        TEXT oracle_id
        TEXT name
        TEXT type_line
        TEXT oracle_text
        TEXT mana_cost
        REAL cmc
        TEXT color_identity "JSON"
        TEXT keywords "JSON"
        TEXT payload "full Scryfall JSON"
        TIMESTAMP fetched_at
    }

    decklist {
        INTEGER id PK
        TEXT source "archidekt | edhrec | ..."
        TEXT source_url
        TEXT format "commander | modern | ..."
        TEXT archetype
        TEXT tier "competitive | casual | budget"
        TEXT commander
        REAL win_rate
        TIMESTAMP fetched_at
    }

    decklist_card {
        INTEGER decklist_id FK
        TEXT card_name
        INTEGER quantity
        TEXT role "commander | mainboard | sideboard"
    }

    synergy_weight {
        TEXT card_a PK "card_a less than card_b"
        TEXT card_b PK
        TEXT context PK "e.g. commander/jund-toxic"
        REAL weight "-1.0 .. +1.0"
        INTEGER sample_size
        TIMESTAMP updated_at
    }

    feedback_event {
        INTEGER id PK
        TEXT kind "correction | confirmation | uncertainty"
        TEXT context
        TEXT claim
        TEXT correction
        TEXT cards_involved "JSON array"
        REAL weight_delta
        TIMESTAMP created_at
    }

    cr_section {
        TEXT number PK
        TEXT chapter
        TEXT title
    }

    cr_rule {
        TEXT rule_number PK
        TEXT section FK
        TEXT parent
        TEXT body
        TEXT examples "JSON array"
    }

    cr_glossary {
        TEXT term PK
        TEXT definition
    }

    cr_rule_fts {
        TEXT rule_number
        TEXT body "porter unicode61 tokenized"
    }

    cr_glossary_fts {
        TEXT term
        TEXT definition
    }
```

**Two things worth flagging.**

*Canonical pair ordering.* `synergy_weight` has a `CHECK (card_a < card_b)` constraint so each unordered pair has exactly one row. The `canonical_pair()` helper in `learning/weights.py` sorts before any write. This is what makes "Sol Ring + Ramos" and "Ramos + Sol Ring" the same fact.

*FTS5 is denormalized on purpose.* `cr_rule_fts` and `cr_glossary_fts` are standalone virtual tables (not contentless) so they survive schema migrations cleanly. The ingest script repopulates them from `cr_rule` / `cr_glossary` at parse time.

---

## Phase status snapshot

```mermaid
flowchart LR
    P1["Phase 1<br/>Cards<br/>✅ 6 tools"]
    P2["Phase 2<br/>Comp Rules<br/>✅ 4 tools"]
    P3["Phase 3<br/>Decks<br/>✅ 4 tools"]
    P4["Phase 4<br/>Corpus<br/>✅ 5 tools"]
    P5["Phase 5<br/>Feedback<br/>✅ 5 tools"]
    Mana["Mana<br/>✅ 1 tool"]

    P1 --> P3
    P2 -.->|"layer system,<br/>glossary"| P3
    P3 --> P5
    P4 -.->|"corpus stats<br/>inform suggestions"| P3
    P1 --> Mana

    classDef done fill:#1f3a2f,stroke:#10b981,color:#fff
    class P1,P2,P3,P4,P5,Mana done
```

**88 tests, 25 tools, 5 phases done.** Next is wiring the MCP into Commander Collector itself — either Streamable HTTP from the same Bluehost machine as the PHP API, or sidecar to the Next.js dev server.
