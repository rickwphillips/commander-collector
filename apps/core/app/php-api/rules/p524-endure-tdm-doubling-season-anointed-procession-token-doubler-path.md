---
id: p524
name: Endure (TDM) + Token Doublers — Doubling Season vs. Anointed Procession and Spirit Token Path
category: cross-mechanic
cr_refs: [614.1a, 702.87, 702.23a]
tags: [endure, spirit-token, counter-doubler, doubling-season, anointed-procession, parallel-lives, token-duplication, tarkir-dragonstorm, TDM, path-selection]
created: 2026-03-30
examples_count: 3
---

# P524 — Endure (TDM) + Token Doublers — Doubling Season vs. Anointed Procession and Spirit Token Path

## Abstract
Endure offers a choice at resolution: put N +1/+1 counters OR create an N/N white Spirit token. Token-doubling effects (Doubling Season, Anointed Procession, Parallel Lives) interact with the Spirit token path but NOT the counter path. When choosing the Spirit token path with a doubler in play, the controller creates twice as many N/N Spirits. **Doubling Season** doubles tokens AND counters, so it affects both Endure paths. **Anointed Procession** doubles tokens only, affecting only the Spirit token path. This creates a decision point: with Doubling Season in play, both paths are enhanced (more counters, more Spirits); with Anointed Procession only, the Spirit token path is enhanced but the counter path is not.

## The Definitive Rules

**CR 702.87 (Doubling Season):** *"If an effect would put one or more tokens onto the battlefield under your control, put twice that many of those tokens onto the battlefield instead. If an effect would put one or more counters on a permanent you control, put twice that many of those counters on that permanent instead."*

**CR 702.23a (Anointed Procession):** *"If an effect would create one or more tokens under your control, it creates twice as many of those tokens instead."*

**CR 614.1a (Replacement effects):** Token doublers are continuous effects that replace the token-creation event. The doubler sees what would be created and replaces it with doubled tokens.

**Parallel Lives (Oracle text):** *"If an effect would create one or more tokens under your control, it creates twice as many of those tokens instead."* — Identical to Anointed Procession.

## The Pattern

```
ENDURE CHOICE + TOKEN DOUBLERS:

  Endure N choice at resolution:
    (A) Put N +1/+1 counters on this permanent.
    (B) Create an N/N white Spirit creature token.

  DOUBLING SEASON (affects both paths):
    Path A (counters): N counters → 2N counters (counter-doubling).
    Path B (tokens): create an N/N token → create a 2N/2N token (token-doubling).
    Both paths are enhanced.

  ANOINTED PROCESSION (affects tokens only):
    Path A (counters): N counters → N counters (no change — Procession only doubles tokens).
    Path B (tokens): create an N/N token → create two N/N tokens (token-doubling).
    Only the token path is enhanced; counter path is unaffected.

  PARALLEL LIVES (same as Anointed Procession):
    Token-doubling only. Counter path unaffected.

STRATEGIC CHOICE WITH ANOINTED PROCESSION:

  With Anointed Procession in play:
    Endure 1:
      Counters: +1/+1 (1 counter, unmodified)
      Tokens: two 1/1 Spirit tokens (doubled from 1 token)
    → Tokens are clearly better (two bodies vs. +1/+1).

  Endure 3:
      Counters: +3/+3 (3 counters, unmodified)
      Tokens: two 3/3 Spirit tokens (doubled from 1 token; 6/6 total power)
    → Tokens are still better (6/6 total vs. +3/+3 to one creature).

STRATEGIC CHOICE WITH DOUBLING SEASON:

  With Doubling Season in play:
    Endure 1:
      Counters: +2/+2 (2 counters, doubled)
      Tokens: create a 2/2 Spirit (doubled — one 2/2 token where normally 1/1)
    → Different trade-offs; Doubling Season enhances both equally.

  Endure 3:
      Counters: +6/+6 (6 counters, doubled from 3)
      Tokens: create a 6/6 Spirit (doubled from 3/3)
    → Counter path now looks better (straight +6/+6 to the permanent vs. one 6/6 body).

MULTIPLE SPIRIT TOKENS WITH ENDURE N:

  Endure N normally creates one N/N token.
  Anointed Procession: creates two N/N tokens.
  Parallel Lives: creates two N/N tokens.
  Both sources stack multiplicatively if both are in play:
    Endure 3 with both Procession and Parallel Lives: create FOUR 3/3 tokens.
    Why multiplicative? CR 614.5 states "A replacement effect applies only once to any given
    event" — this prevents a SINGLE replacement effect from applying twice. But Procession
    and Parallel Lives are TWO DIFFERENT independent replacement effects. Each sees the
    original "create 1 token" event and applies independently:
      Procession applies: 1 token → 2 tokens.
      Parallel Lives applies: 1 token → 2 tokens.
      Both effects resolve: 1 × 2 × 2 = 4 tokens total.

  CLARIFICATION: Multiple independent token doublers DO stack multiplicatively.
    Each is a separate replacement effect; they apply in timestamp order but each modifies
    the original event independently.
    Endure 3 with both Procession and Parallel Lives: create four 3/3 tokens (2 × 2).
    Endure 3 with all three (Procession, Parallel Lives, Doubling Season): create four 6/6
    tokens (Doubling Season doubles size; Procession and Parallel Lives double quantity;
    4 × 6/6 total = 24/24 power on board).

ENDURE X (WARDEN OF THE GROVE):

  Warden of the Grove ({2}{G}: 2/2):
    "Whenever another nontoken creature you control enters, it endures X, where X = the
     number of counters on Warden."

  X is determined when the trigger resolves (Warden's counter count at that moment).
  If Warden has 4 counters and a creature enters: that creature endures 4.
  With Doubling Season or Anointed Procession:
    If you choose tokens: create a 4/4 Spirit (Doubling Season) or two 4/4s (Procession).
    If you choose counters: +4/+4 (Doubling Season → +8/+8; Procession → +4/+4).

ENDURE ON NONCREATURE PERMANENTS:

  Endure can apply to noncreature permanents (artifacts, enchantments, lands).
  +1/+1 counters land on them (useful for animation synergies).
  Spirits are 1/1 creatures (separate permanents).
  Token doublers don't interact with the counter path (the noncreature permanent is
    unaffected by Procession or Parallel Lives — only token creation is doubled).
  Example: Urza's Saga (enchantment — creature type: Saga) endures 2.
    Counters: 2 +1/+1 counters on Urza's Saga (noncreature, so P/T benefits are N/A).
    Tokens: create one 2/2 Spirit, or two 2/2 Spirits with Procession.

ENDURE + DOUBLING SEASON + ANOINTED PROCESSION:

  All three in play. Endure 2. Choose token path.
  First: Doubling Season sees 1 token → creates 2/2 (doubled from 1/1).
  Second: Anointed Procession sees 2/2 → creates two 2/2s (doubled... wait, the event is
    "create a 2/2 token" after Doubling Season modifies it, or "create a 1/1 token"?).

  THE RULE: Replacement effects see the original event. Both doublers apply to the
    original "create an N/N token" event, not sequentially to each other.
  → Only one applies (LIFO). The last-entered doubler applies.
  Result: create two 2/2 tokens (if Procession is more recent), or one 2/2 (if Doubling
    Season is more recent).

ENDURE + DOUBLING SEASON + HARDENED SCALES:

  If choosing the counter path (Endure 2):
    Doubling Season applies: 2 → 4 +1/+1 counters.
    Hardened Scales applies: 4 → 5 +1/+1 counters.
    Result: +5/+5.
  If choosing the token path (Endure 2):
    Doubling Season applies: one 2/2 token → one 4/4 token.
    Hardened Scales does not apply (it only affects +1/+1 counters, not tokens).
    Result: one 4/4 Spirit.
```

## Definitive Conclusions

- **Doubling Season enhances both Endure paths** — counters are doubled, and Spirits are doubled in size.
- **Anointed Procession and Parallel Lives affect only the Spirit token path** — the counter path is unaffected; if choosing Spirits, you get doubled quantity.
- **With Anointed Procession, the Spirit token path is typically better** — Endure 1 creates two 1/1s instead of +1/+1 on an existing creature.
- **With Doubling Season, both paths are enhanced equally** — you must weigh +doubled counters on the permanent vs. one doubled-size Spirit.
- **Multiple token doublers don't stack multiplicatively** — only the most recently entered doubler applies per event; Endure 2 with Procession and Parallel Lives creates two 2/2s, not four.
- **Token doublers don't affect Endure on noncreature permanents** — the noncreature permanent gets +N/+N counters regardless; Spirits are separate permanents, unaffected by Procession on the counter choice.

## Canonical Example

**Endure with Anointed Procession:**

You control Anointed Procession. Fortress Kin-Guard ({1}{W}: 1/2) enters and triggers "it endures 1." You choose the token path.

Anointed Procession applies: create one 1/1 token → create two 1/1 Spirits.

You get two 1/1 white Spirit creature tokens instead of the normal one, and it didn't cost you any resources beyond the Fortress Kin-Guard entering.

**Example 2 — Endure with Doubling Season:**

You control Doubling Season. Warden of the Grove ({2}{G}: 2/2) with 3 +1/+1 counters on it enters a creature (another nontoken creature). Warden's trigger fires: "that creature endures 3."

Option A (counters): +3/+3 → Doubling Season doubles → +6/+6 on the creature.
Option B (Spirits): create a 3/3 Spirit → Doubling Season doubles → create a 6/6 Spirit.

Both paths are significantly enhanced.

**Example 3 — Endure + Multiple Doublers (LIFO):**

You control both Anointed Procession ({3}{W}) and Parallel Lives ({3}{G}). Procession entered first, then Parallel Lives. Endure 1 with token choice.

Both doublers see the original event: "create a 1/1 token." Parallel Lives (more recent) applies first (LIFO): one 1/1 → two 1/1s.

Result: two 1/1 Spirits (not four). Only the topmost doubler replaces the event.

## Commonly Confused With
- **P025 (Counter Placement)** — P025 covers Doubling Season's behavior with counters. P524 applies that to Endure's counter path and adds token-doubler interactions.
- **P518 (Endure)** — P518 covers the baseline Endure mechanics and zone-failure fallback. P524 covers how token/counter doublers affect the strategic choice between paths.
- **P523 (Renew + Counter Doublers)** — P523 covers Doubling Season and Hardened Scales with Renew's counter grants. P524 covers token doublers with Endure's token choice.
