---
id: p203
name: Split Cards — CMC, Fuse, and Combined Characteristics
category: stack
cr_refs: [709.1, 709.2, 709.3, 709.4, 709.4b, 702.102]
tags: [split-cards, mana-value, fuse, CMC, combined-cost, Fire-Ice, Assault-Battery, Living-Death]
created: 2026-03-28
examples_count: 2
---

# P203 — Split Cards — CMC, Fuse, and Combined Characteristics

## Abstract
Split cards have two castable halves on one physical card. Outside the stack (in hand, graveyard, library, exile), a split card has the COMBINED characteristics of both halves — including a combined mana cost and combined mana value. For example, Fire//Ice has mana cost {1}{R}+{2}{U} = {3}{R}{U} and mana value 5 in hand. On the stack, only the half being cast exists (mana value = that half only). Fuse allows casting both halves simultaneously for the combined cost. This matters critically for cascade triggers, which care about mana value.

## The Definitive Rules

**CR 709.4** (verbatim): *"In every zone except the stack, the characteristics of a split card are those of its two halves combined."*

**CR 709.4b** (verbatim): *"The mana cost of a split card is the combined mana costs of its two halves. A split card's colors and mana value are determined from its combined mana cost."*
Example verbatim: *"Assault//Battery's mana cost is {3}{R}{G}. It's a red and green card with a mana value of 5."*

**CR 709.3a** (verbatim): *"Only the chosen half is evaluated to see if it can be cast. Only that half is considered to be put onto the stack."*

**CR 709.3b** (verbatim): *"While on the stack, only the characteristics of the half being cast exist. The other half's characteristics are treated as though they didn't exist."*

## The Pattern

```
SPLIT CARD ZONES:
  In hand / graveyard / exile / library: COMBINED characteristics
  - Combined mana cost (both halves' costs added together)
  - Combined colors
  - Combined mana value (sum of both halves)
  - Combined card types, subtypes, abilities

  On the stack: ONLY the chosen half
  - Only the casting half's mana cost / mana value
  - Only the casting half's card type and abilities

FUSE (CR 702.102):
  Fuse allows casting BOTH halves simultaneously
  Fuse cost: sum of both halves' costs
  On the stack: the fused spell has BOTH halves' characteristics (combined)
  Effect: both effects happen sequentially
  Example: Breaking//Entering with Fuse: mill 8 cards AND put a creature from any graveyard into play

SPLIT CARDS + CASCADE:
  Cascade triggers: "exile cards until you exile a nonland card with mana value strictly less than [cascade spell's cost]"
  The exiled card in graveyard has its COMBINED mana value (both halves)
  Fire//Ice: mana value 5 in graveyard (not 1 or 2)
  If you cascade into Fire//Ice: it has mana value 5 (too big for many cascade spells)
  But when you CAST it from cascade: cast only one half (that half's mana value applies)
  The check for cascade is done with the card's mana value in exile (the combined value)
  So: split cards have inflated mana values for cascade checking purposes

SPLIT CARDS + STORM:
  Storm copies the spell exactly — if a fused split spell is cast, storm copies it fully
  Non-fused: copies just the half being cast

SPLIT CARDS + DELVE / COST REDUCTION:
  These abilities reduce the casting cost, not the mana value
  Delving when casting Fire (from Fire//Ice): reduce the {1}{R} casting cost
  But in the graveyard: Fire//Ice has mana value 5 (not 1)

ADVENTURE CARDS (CR 715):
  Adventure cards are NOT split cards (different rules: CR 715)
  Adventure: inset frame inside the card, cast as Adventure or normally
  After Adventure resolves: exiled, owner may cast the main card from exile
  Adventure cards in every zone have only the normal card characteristics
  (unless on the stack as an Adventure)

AFTERMATH CARDS:
  Aftermath: special split cards where one half can only be cast from the graveyard
  In hand: only the first half (not the Aftermath half)
  In graveyard: only the Aftermath half (the half with "Aftermath")
  Combined mana value? They're split cards in graveyard, so combined applies
  But Aftermath half can't be cast from anywhere except graveyard

ROOM CARDS (CR 709.5):
  Rooms are split permanents with a shared type line (Dungeon subset)
  Each half can be "unlocked" by paying its mana cost (special action)
  In any zone: combined characteristics
  On the battlefield: locked halves suppress their characteristics

FIRE//ICE EXAMPLE:
  Fire ({1}{R}): deal 2 damage to any target
  Ice ({2}{U}): tap target permanent, draw a card
  Combined mana cost: {3}{R}{U} (mana value 5)
  Fire alone: cast for {1}{R} (mana value 2 on stack)
  Ice alone: cast for {2}{U} (mana value 3 on stack)
  In graveyard: the combined card has mana value 5
```

## Definitive Conclusions

- **Split cards have combined mana value** in all zones except the stack.
- **On the stack**: only the chosen half's characteristics exist (mana value = that half only).
- **Fuse**: cast both halves simultaneously for combined cost; combined characteristics on stack.
- **Cascade checks combined mana value** in exile — split cards appear larger than either half alone.
- **Adventure cards are NOT split cards** — different rules apply.

## Canonical Example
**Violent Outburst (cascade CMC 3) into Fire//Ice:**
Violent Outburst triggers cascade. Exile cards until nonland with mana value < 3.
Fire//Ice is exiled — its mana value is 5 (combined {1}{R}+{2}{U}).
Fire//Ice has mana value 5, which is NOT less than 3 → cascade skips it, keep exiling.
To cascade into a split card, BOTH halves must have combined mana value < cascade spell's cost.
This is the trap: if you want cascade to grab Fire//Ice, you need a cascade spell with CMC > 5.

**Example 2 — Fuse and Storm Count:**
Cast Breaking//Entering with Fuse ({U}{B}+{4}{B}{R} = {5}{U}{B}{B}{R}) as one spell.
If you have 2 storm copies (storm count): each copy casts BOTH halves.
Storm on a fused split: rare but devastating — mill 8 AND reanimate 3 times.

## Commonly Confused With
- **P146 (Suspend)** — Suspend exiles a card and removes counters over time. Unrelated to split card mana values.
- **P156 (Cascade)** — Cascade is affected by split cards' combined CMC in exile. Core interaction with this pattern.
- **P168 (Escape)** — Escape casts from graveyard; split cards in graveyard have combined mana value for "mana value of card" checks.
