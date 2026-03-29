---
id: p061
name: Encore — One-Turn Attack Tokens Per Opponent
category: zones
cr_refs: [702.141a]
tags: [encore, token, graveyard, haste, attack, copy, one-turn, sacrifice, end-step, multiplayer]
created: 2026-03-28
examples_count: 2
---

# P061 — Encore — One-Turn Attack Tokens Per Opponent

## Abstract
Encore creates temporary token copies of the card from the graveyard, one per opponent, each assigned to attack that opponent this turn if able. The tokens gain haste and are sacrificed at the beginning of the next end step. Encore is activated only as a sorcery from the graveyard. In multiplayer, the power of encore scales — each opponent gets their own token copy that must attack them. The tokens are true copies (same abilities, P/T) with added haste and the forced-attack requirement.

## The Definitive Rule

**CR 702.141a** (verbatim): *"Encore is an activated ability that functions while the card with encore is in a graveyard. 'Encore [cost]' means '[Cost], Exile this card from your graveyard: For each opponent, create a token that's a copy of this card that attacks that opponent this turn if able. The tokens gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.'"*

## The Pattern

```
ENCORE ACTIVATION:
  1. From graveyard, pay encore cost (any cost), exile the card
  2. For each opponent: create one token copy of the card
  3. Each token: attacks its assigned opponent this turn if able
  4. Tokens gain haste
  5. At beginning of the next end step: sacrifice all created tokens

NUMBER OF TOKENS:
  1 opponent (duel): 1 token
  3 opponents (Commander): 3 tokens
  Each token attacks a different opponent (you choose which attacks which,
    or the assignment is one per opponent — each token attacks that specific opponent)

COPY CHARACTERISTICS:
  Tokens are copies of the card → same P/T, same abilities, same colors/types
  They are creature tokens (even if the original wasn't a creature)
  Wait — encore is on creature cards, so copies are creature tokens
  Haste added on top of copied characteristics
  If original had "enters with X counters" → tokens get those counters (ETB replacement)
  If original had ETB triggered abilities → those fire as each token enters

FORCED ATTACK:
  "Attacks that opponent this turn if able"
  Tokens must attack the specified opponent if able (can attack)
  If token can't attack (tapped, defender, etc.): doesn't attack
  Tokens can't attack other players — each is "assigned" to its specific opponent

SACRIFICE TIMING:
  Beginning of the NEXT end step (not this turn's end step)
  This allows the tokens to survive through the full turn (combat, main phase 2)
  If the tokens die in combat, sacrifice trigger still goes on the stack but finds nothing

ENCORE EXILES ORIGINAL:
  The card is exiled from graveyard as part of the encore cost
  Cannot encore the same card twice — it's gone after first activation
  Tokens are ephemeral; the original is permanently exiled

ETB TRIGGERS:
  Each token enters the battlefield → ETB abilities trigger for each
  In Commander with 3 tokens entering: potentially 3× ETB value
```

## Definitive Conclusions

- **Encore creates one token per opponent.** In Commander with 3 opponents: 3 tokens.
- **Each token must attack its assigned opponent if able.** Forced attack.
- **Tokens gain haste** and are sacrificed at the beginning of the NEXT end step.
- **The original card is exiled** when encore is activated — not returned to the graveyard.
- **ETB abilities on the original card fire for each token** that enters the battlefield.

## Canonical Example
**Anje, Maid of Dishonor (encore {7}{B}{B}):**
In a 4-player Commander game (3 opponents). Pay {7}{B}{B}, exile Anje from graveyard. Create 3 Anje tokens. Each attacks a different opponent this turn if able (haste lets them attack immediately). Each token entering triggers any ETB abilities Anje has. Sacrifice all three at the beginning of the next end step.

**Example 2 — Encore in a duel:**
In a 1v1 game, encore creates only 1 token (1 opponent). The token attacks that opponent this turn if able. This makes encore significantly less powerful in duels compared to multiplayer.

## Commonly Confused With
- **P044 (Epic)** — Epic also creates copies each upkeep but doesn't attack and doesn't sacrifice. Both are ongoing delayed effects but vastly different structures.
- **P017 (Copy Spell Delayed Triggers)** — Encore creates token copies of creatures (not spell copies). ETB abilities fire; delayed triggers from the original card don't transfer.
