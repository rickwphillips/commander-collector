---
id: p049
name: Kicker — Optional Additional Cost, Copy Inheritance, and X Kicker
category: costs
cr_refs: [702.33a, 702.33b, 702.33c, 702.33d, 702.33e, 702.33f, 707.10]
tags: [kicker, multikicker, additional-cost, kicked, copy, X-cost, storm, cascade-free-cast]
created: 2026-03-28
examples_count: 2
---

# P049 — Kicker — Optional Additional Cost, Copy Inheritance, and X Kicker

## Abstract
Kicker is an optional additional cost that can be paid when casting a spell. Paying kicker makes the spell "kicked" and may unlock bonus effects in the spell's text. Copies of kicked spells are also "kicked" — they inherit the kicked status. Kicker costs CAN be paid when casting via free-cast effects (cascade, flashback, etc.) because kicker is an additional cost, not part of the mana cost. However, X in a kicker cost behaves like X in any cost — when cast without paying mana (cascade), X can still be set for kicker if the kicker cost includes X.

## The Definitive Rule

**CR 702.33a** (verbatim): *"Kicker is a static ability that functions while the spell with kicker is on the stack. 'Kicker [cost]' means 'You may pay an additional [cost] as you cast this spell.' Paying a spell's kicker cost(s) follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.33d**: If a player declares the intention to pay any kicker cost, the spell is "kicked."

**CR 702.33e**: "Kicked" is maintained as a status while the spell is on the stack. A copy of a kicked spell is also kicked.

## The Pattern

```
KICKER DECLARATION:
  At announcement (601.2b), declare whether you're paying kicker
  If you declare intent to kick: spell becomes "kicked" on the stack
  The kicker cost is then part of the total cost to pay

"KICKED" STATUS:
  Tracked by the spell while on the stack
  A copy of a kicked spell is also kicked (707.10: copies inherit choices made)
  Storm copies of a kicked spell → also kicked
  The "kicked" status affects how the spell's effects work when it resolves

KICKER + FREE-CAST (CASCADE, FLASHBACK, ETC.):
  "Without paying its mana cost" = free cast (mana cost replaced)
  Kicker is an ADDITIONAL cost (not the mana cost)
  → You CAN choose to pay kicker on top of a free cast
  → You're paying the kicker cost separately from the mana cost
  Example: Cascade hits Orim's Chant (kicker {W})
    → Cast Orim's Chant without paying its mana cost ({W})
    → You MAY also choose to pay the kicker {W}
    → If you pay it: Orim's Chant is kicked → opponent can't cast spells this turn
    → If you don't: only "Target player can't attack this turn"

MULTIKICKER:
  "Multikicker [cost]" → pay any number of times
  Each payment makes the spell kicked and adds to the kicker count
  The spell checks "the number of times this spell was kicked"
  Example: Everflowing Chalice (multikicker {2}) → pay 3 times → enters with 3 charge counters

X IN KICKER:
  If a kicker cost includes X, you declare X's value when paying kicker
  This X is different from X in the mana cost
  Both X values can be set independently
  Example: Spell with kicker {X}: mana cost may or may not have X; the kicker X
    is a separate decision

MULTIPLE KICKER COSTS:
  "Kicker {cost A} and/or {cost B}" = two separate kicker abilities
  Can pay neither, one, or both
  Spell tracks which kicker costs were paid
```

## Definitive Conclusions

- **Kicker is an optional additional cost.** You choose to pay it at announcement.
- **A copy of a kicked spell is also kicked.** The "kicked" status is a choice inherited by copies.
- **Kicker can be paid during a free cast (cascade, etc.).** It's an additional cost, not the mana cost, so it's not bypassed by "without paying its mana cost."
- **Multikicker can be paid multiple times.** Each payment stacks the kicked effect.
- **X in a kicker cost is its own separate X.** Choose its value independently when paying kicker.

## Canonical Example
**Coiling Oracle on cascade:**
You cascade into Harrow (kicker {G}: sacrifice a land as an additional cost). Wait, Harrow has "as an additional cost to cast this spell, sacrifice a land" — that's a mandatory additional cost. Kicker example: you cascade into Burst Lightning (kicker {4}). You may cast Burst Lightning without paying its mana cost. You may also choose to pay the kicker {4}. If you pay {4}: Burst Lightning deals 4 damage instead of 2.

**Example 2 — Storm + kicked spell:**
You cast Rite of Flame (kicked, costing {R} + kicker). Wait, Rite of Flame doesn't have kicker. Better: you cast Lunge of Doom with kicker, it makes storm copies. Each storm copy is also kicked (copies inherit kicked status). All copies resolve with the kicked version of the effect.

## Commonly Confused With
- **P034 (Cascade)** — When cascade hits a kicker card, the free cast doesn't prevent paying kicker. P049 establishes why: kicker is additional, not the mana cost.
- **P025 (Counter Placement — Cost vs. Effect)** — Kicker is paid as a cost. Doubling Season doesn't double effects from paying kicker; the kicker payment itself isn't affected by replacement effects.
