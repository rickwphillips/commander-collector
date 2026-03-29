---
id: p034
name: Cascade — What Can Be Hit and Free Cast Restrictions
category: stack
cr_refs: [702.85a, 702.85b, 601.2, 707.10]
tags: [cascade, exile, mana-value, free-cast, CMC, land, zero-cost, suspend, copy, trigger]
created: 2026-03-28
examples_count: 3
---

# P034 — Cascade — What Can Be Hit and Free Cast Restrictions

## Abstract
Cascade exiles cards from the library until finding a nonland card with mana value strictly less than the cascade spell. The "cast without paying its mana cost" permission that follows has specific consequences: X spells cast this way have X=0, kicker and other optional costs can still be paid, and you cannot choose to "miss" a card you're required to cast. Crucially, cascade copies (from storm) don't trigger more cascade because copies aren't "cast." Casting the cascade spell at a reduced cost doesn't change its mana value for the cascade trigger.

## The Definitive Rule

**CR 702.85a** (verbatim): *"Cascade means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

**CR 702.85c**: Multiple instances of cascade each trigger separately.

## The Pattern

```
CASCADE TRIGGER FIRES WHEN:
  You cast a spell with cascade (at any time you could normally cast it)
  → Copies of spells are NOT cast → copies don't trigger cascade
  → Replayed from graveyard IS cast → triggers cascade again

WHAT CAN BE HIT:
  ✓ Any nonland card with mana value < cascade spell's mana value
  ✓ Split cards: mana value = combined mana cost of both halves
  ✓ Adventure spells: mana value = full creature mana value (not adventure)
  ✓ Suspend cards with mana cost 0 (e.g., Ancestral Vision CMC=0): ✓
  ✗ Land cards (can't be cast from cascade)
  ✗ Cards with mana value ≥ cascade spell's mana value
  ✗ Cards with no mana cost that have CMC = 0 if cascade spell is CMC 1:
    0 < 1 ✓ — these CAN be hit (CMC 0 < CMC 1)

MANA VALUE CHECK — CASCADE SPELL ITSELF:
  Uses the cascade spell's PRINTED mana cost (not what you paid)
  Example: Shardless Agent (CMC 3) cast via Cascade off a higher-CMC spell
  → Shardless Agent's cascade trigger uses its printed CMC of 3
  → Can hit any nonland with CMC < 3 (0, 1, or 2)

FREE CAST — WHAT CHANGES:
  You may cast it "without paying its mana cost"
  → X in mana costs becomes 0 (no choice for X)
  → Optional additional costs (kicker, entwine, buyback) CAN still be paid
  → Mandatory additional costs must still be paid
  → If you chose not to cast: card goes to bottom of library with others

FREE CAST — WHAT STAYS THE SAME:
  You still choose targets
  You still choose modes (for modal spells)
  You still choose whether to kick (and pay if you choose to)
  Timing: you cast it as part of the cascade trigger resolving — at this time,
  you can cast any type of card (sorcery, instant, permanent) regardless of
  the current turn phase

DOES CASCADING INTO ANOTHER CASCADE CHAIN?
  If the hit card itself has cascade: YES, that new cast triggers its own cascade
  This can chain if each cascade hits a cascade spell of lower CMC
  Cascade does not cascade into itself (the trigger already resolved)

COPIES OF CASCADE SPELLS:
  Storm copies a cascade spell → copies aren't cast → no cascade trigger
  Reverberate copies a cascade spell → copy isn't cast → no cascade
```

## Definitive Conclusions

- **Zero-CMC cards (Ancestral Vision, Crashing Footfalls) can be hit by any cascade spell.** CMC 0 < any positive cascade CMC.
- **Cascade uses the spell's printed mana value, not what was paid.** A cascade spell cast via another cascade's free-cast still has its original CMC for its own cascade trigger.
- **X costs become 0 when cast via cascade.** If a Fireball is cascaded into, it deals 0 damage (X=0). You can't pay X from a free cascade hit.
- **Optional additional costs can be paid.** Kicker can be paid on top of the free cast.
- **Copies don't cascade.** Only actual casts trigger cascade. Storm, Reverberate, Hive Mind copies don't trigger it.
- **You may choose not to cast the card.** It goes to the bottom of the library with all other exiled cards (in a random order).
- **Cascading into a cascade spell DOES chain.** If you hit a cascade card with lower CMC, casting it triggers its own cascade.

## Canonical Example
**Shardless Agent cascading into Ancestral Vision:**
Shardless Agent (CMC 3) has cascade. You cast it. Cascade trigger fires. You exile cards until you find a nonland with CMC < 3. You find Ancestral Vision (CMC 0). 0 < 3 ✓. You may cast it without paying its mana cost. Ancestral Vision normally requires suspend (it has no regular cast method), but cascade provides the cast permission. Ancestral Vision is cast, resolves, draws 3 cards.

**Example 2 — Cascade into Fireball:**
Ardent Plea (CMC 3) cascades. You find Fireball (CMC 1 base, X varies). X=0. Fireball deals 0 damage. Not useful. But you could choose NOT to cast it and leave it on the bottom.

**Example 3 — Living End cascade engine:**
Living End has CMC 0. Normally can only be played via cascade. Shardless Agent (CMC 3) → cascades → hits Living End (CMC 0 < 3) → Living End resolves → each player exiles their graveyard, returns all creatures from their graveyard to battlefield. This is the engine: cast medium cascade spells specifically to find Living End.

## Commonly Confused With
- **P029 (Spell Copy Targeting)** — Copies of cascade spells don't cascade. P029 covers copy independence; P034 covers the cast requirement.
- **P025 (Counter Placement — Cost vs. Effect)** — Cascade's free cast is a "without paying mana cost" effect. X becomes 0 because there's no mana payment to define X.
