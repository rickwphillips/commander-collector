---
id: p053
name: Populate — Copy a Creature Token
category: zones
cr_refs: [701.36a, 701.36b, 707.10]
tags: [populate, token, copy, creature-token, no-tokens, choice, token-type]
created: 2026-03-28
examples_count: 2
---

# P053 — Populate — Copy a Creature Token

## Abstract
Populate creates a token that is a copy of a creature token you control. You choose which creature token to copy (if you have multiple). The copy is a new independent token with the same characteristics as the original at the time of copying. Critically, if you control no creature tokens when instructed to populate, the action simply does nothing — it's not an illegal instruction, you just don't create a token. Populate is NOT limited to creature tokens you own; it copies whatever creature token you control (including ones an opponent created that you gained control of).

## The Definitive Rule

**CR 701.36a** (verbatim): *"To populate means to choose a creature token you control and create a token that's a copy of that creature token."*

**CR 701.36b** (verbatim): *"If you control no creature tokens when instructed to populate, you won't create a token."*

## The Pattern

```
POPULATE SEQUENCE:
  1. Check: do you control any creature tokens?
  2. If no: do nothing (CR 701.36b)
  3. If yes: choose one creature token you control
  4. Create a token that's a copy of that token (CR 707.10 copy rules apply)

COPY CHARACTERISTICS:
  The new token has same characteristics as the chosen token at time of copying
  If the original token has counters (+1/+1, etc.), the copy does NOT copy counters
    (Counters are not copiable values — CR 707.2)
  If the original token has been modified by effects, the copy gets the base copied values
    (Copies copy "copiable values" — what's printed/defined, not what effects add)
  The copy is a NEW independent object — changes to one don't affect the other

WHAT COUNTS AS A CREATURE TOKEN?
  Tokens created by effects (Saproling, 1/1 Soldier, etc.)
  Tokens that have become creatures (Treasure token that was also made a creature)
  NOT: token copies of non-creature permanents (unless they're also creatures)
  NOT: creature cards on the battlefield (cards ≠ tokens)

CHOOSE WHICH TOKEN:
  If you have multiple creature token types, you choose which one to copy
  You may choose any creature token you control (not just those you created)
  Can choose a token you control that an opponent originally created (via Threaten, etc.)

POPULATE WHEN ORIGINAL LEAVES:
  After choosing which token to copy, the copy is created simultaneously
  If the chosen token somehow left between choice and creation (rare edge case),
    the copy is still based on what was chosen — populate uses the token's characteristics
    at the time of the populate action (CR 701.36a says "a copy of that creature token")

POPULATE DOESN'T COPY NON-CREATURE TOKENS:
  Food, Treasure, Clue, Map — none are creature tokens
  Blood tokens — not creature tokens
  Even if an effect makes a Food token a creature, it counts while it's a creature token
```

## Definitive Conclusions

- **Populate does nothing if you control no creature tokens.** Not an illegal action — just resolves with no effect.
- **You choose which creature token to copy** when you have multiple options.
- **The copy doesn't inherit counters.** Counters are not copiable values.
- **You can populate a token you control but didn't create.** The requirement is control, not creation.
- **Non-creature tokens (Treasure, Food, Clue) cannot be populated** unless they're currently creature tokens.

## Canonical Example
**Trostani, Selesnya's Voice (whenever a creature enters, populate):**
A 3/3 Elephant token enters. Trostani triggers: populate. You control the 3/3 Elephant token and a 1/1 Saproling token. Choose which to copy. You choose the Elephant — create a 3/3 Elephant token. Now you have two Elephants and one Saproling.

**Example 2 — Populate with no tokens:**
You cast a spell that says "populate." You control only creature cards (no tokens). The populate instruction does nothing — no token is created. This is intentional: populate scales based on what you've already built.

## Commonly Confused With
- **P028 (Simultaneous ETB)** — When a populate creates a token that ETBs simultaneously with other tokens, all newcomers see each other per P028.
- **P029 (Spell Copy Targeting)** — Populate creates a token copy of an object, not a copy of a spell. The copy rules for objects (CR 707) apply, not spell-copy rules.
