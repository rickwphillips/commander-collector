---
id: p078
name: Extort — Cast Trigger Life Swap
category: triggered
cr_refs: [702.101a, 702.101b]
tags: [extort, triggered, cast, life, each-opponent, optional-cost, drain, multiplayer]
created: 2026-03-28
examples_count: 2
---

# P078 — Extort — Cast Trigger Life Swap

## Abstract
Extort triggers whenever you cast ANY spell. The trigger lets you optionally pay {W/B}. If you do, each opponent loses 1 life, and you gain life equal to the total life lost. This is a "drain" effect — life loss and life gain are linked (you gain exactly what was lost collectively). Multiple extort instances each trigger separately, allowing you to pay {W/B} multiple times for the same spell cast. In multiplayer, extort scales powerfully because each opponent loses 1 life — you gain N life per activation (N = number of opponents).

## The Definitive Rule

**CR 702.101a** (verbatim): *"Extort is a triggered ability. 'Extort' means 'Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain life equal to the total life lost this way.'"*

**CR 702.101b** (verbatim): *"If a permanent has multiple instances of extort, each triggers separately."*

## The Pattern

```
EXTORT TRIGGER:
  Fires when: you cast ANY spell (creature, instant, sorcery, etc.)
  You may pay {W/B} as the trigger resolves
  If you pay:
    Each opponent loses 1 life
    You gain life = total life lost

MULTIPLAYER SCALING:
  1 opponent (duel): pay {W/B} → opponent loses 1 life → you gain 1 life
  3 opponents (Commander): pay {W/B} → each loses 1 life (total 3 lost) → you gain 3 life
  This makes extort significantly stronger in multiplayer

MULTIPLE EXTORT INSTANCES:
  Two extort instances → two separate triggers for same spell cast
  Pay {W/B} for first trigger: each opponent loses 1 life, you gain X
  Pay {W/B} for second trigger: each opponent loses 1 life again, you gain X more
  → 2 extort + 3 opponents: up to 2× {W/B} payments → drain 2 life from each opponent (6 total), gain 6

{W/B} SYMBOL:
  Hybrid mana: can pay either {W} or {B}
  Either white or black satisfies the cost

THE TRIGGER IS OPTIONAL:
  "You MAY pay {W/B}" — you choose when the trigger resolves
  Even if you have extort, you don't have to pay
  Useful when you have mana available but didn't plan to drain

LIFE GAIN CALCULATION:
  "You gain life equal to the total life lost this way"
  Total life lost = 1 per opponent who loses life
  If an opponent has lifelink (not relevant — lifelink is combat damage)
  If an opponent has "can't lose life" effect: they don't lose life → you gain less

NOTE ON CARD APPEARANCE:
  Extort reminder text on cards says "you may pay {W/B}" in parentheses
  The reminder text has caused controversy — it appears to say it's the ability, but
  the actual triggering condition is on the permanent's ability, not in reminder text
  The {W/B} in reminder text IS the cost
```

## Definitive Conclusions

- **Extort triggers on ANY spell you cast.** Instants, sorceries, creatures, enchantments.
- **The payment is optional.** You choose whether to pay {W/B} when the trigger resolves.
- **Multiple extort instances each trigger separately.** Can pay {W/B} multiple times per spell cast.
- **Scales with opponent count.** In Commander with 3 opponents, one extort payment drains 3 total life (you gain 3).
- **"Total life lost" formula:** you gain exactly what was collectively lost.

## Canonical Example
**Crypt Ghast (Extort) in Commander (3 opponents):**
You cast any spell. Extort triggers. You pay {W/B}: each of 3 opponents loses 1 life (3 total), you gain 3 life. You have two Crypt Ghasts → two extort triggers → pay {W/B} twice → opponents each lose 2 life, you gain 6 life total.

**Example 2 — Extort in a duel:**
Extort in a duel: cast a spell, pay {W/B}: opponent loses 1 life, you gain 1 life. Net: you're 2 life ahead per extort payment. Over a long game, this creates significant life advantage.

## Commonly Confused With
- **P031 (Win/Lose Condition Mechanics)** — Life loss from extort is not "you lose life" but "each opponent loses life." The distinction matters for effects like Tainted Remedy.
- **P078 and P054 (Proliferate)** — Both can stack effects across opponents in multiplayer, but for different reasons (extort drains life; proliferate spreads counters).
