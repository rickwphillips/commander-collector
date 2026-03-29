---
id: p174
name: Level Up — Sorcery-Speed Counter-Based Upgrade
category: costs
cr_refs: [702.87a, 702.87b]
tags: [level-up, level-counter, leveler-card, sorcery-speed, Venerated-Teacher, Transcendent-Master, Rise-Eldrazi]
created: 2026-03-28
examples_count: 2
---

# P174 — Level Up — Sorcery-Speed Counter-Based Upgrade

## Abstract
Level up is an activated ability: pay the level up cost to add a level counter to the permanent. Activate only as a sorcery. Leveler cards have a special nonstandard layout with two "level symbols" — printed thresholds that change the card's characteristics when the right number of level counters is reached. At level 0-2 the card might be a 1/1 with no abilities; at level 3-6 it might be a 2/4 with first strike; at level 7+ it might be a 7/7 with lifelink and protection. The card "levels up" by paying repeatedly at sorcery speed, growing stronger over time.

## The Definitive Rules

**CR 702.87a** (verbatim): *"Level up is an activated ability. 'Level up [cost]' means '[Cost]: Put a level counter on this permanent. Activate only as a sorcery.'"*

**CR 702.87b** (verbatim): *"Each card printed with a level up ability is known as a leveler card. It has a nonstandard layout and includes two level symbols that are themselves keyword abilities. See rule 711, 'Leveler Cards.'"*

## The Pattern

```
LEVEL UP:
  Activated ability: [cost] → put one level counter on this permanent
  Activate only as a sorcery (main phase, stack empty)
  Each activation: one counter
  Leveler card thresholds: determine characteristics based on counter count

  LEVELER CARD LAYOUT:
    Three sections separated by level symbols:
    Section 1: base characteristics (0 counters or lowest threshold)
    Level symbol [X-Y]: characteristics if level counter count is X to Y
    Level symbol [Z+]: characteristics if level counter count is Z or more
    Example: Transcendent Master has 3 level thresholds

  LEVEL UP + MULTIPLE ACTIVATIONS:
    One activation per sorcery-speed opportunity (each main phase, stack empty)
    Pay cost repeatedly to add counters
    Faster level-up: if cost is cheap or you have mana acceleration
    Venerated Teacher: "When this enters, put two level counters on each creature with level up"
    Using Venerated Teacher: instant 2-level advance for all your levelers

  LEVEL UP + COUNTER REMOVAL:
    If level counters are removed (Hex Parasite, Vampire Hexmage): creature de-levels
    Removes from powerful leveler → drops back to lower thresholds
    Vampire Hexmage: "Remove all counters from target permanent" → leveler goes back to level 0

  LEVEL UP + COPYING:
    If you copy a leveler: the copy copies the card characteristics based on current level counters?
    Actually: a copy copies copiable values, which include level counter thresholds
    But counters themselves aren't copiable values → the copy starts with 0 counters (level 0)

  LEVEL UP + SUMMONING SICKNESS:
    Level up is a {cost}: [activate] ability — NOT a {T} ability
    Summoning sickness prevents using {T} abilities
    Level up ability doesn't tap: can be activated even with summoning sickness
    Wait: level up costs don't typically include {T} — just mana cost
    So: a freshly played leveler can level up on that same turn!
    (Summoning sickness only prevents attacking and {T}/{Q} abilities)

LEVELER CARDS:
  Transcendent Master ({W}, Level Up {1}):
    0-2 counters: 3/3
    3-5 counters: 6/6 Lifelink
    6+ counters: 9/9 Lifelink, Indestructible, protection from everything
    Cost: 1 mana per level counter; needs 6 activations to reach max power
  Student of Warfare ({W}, Level Up {W}):
    0-2: 1/1
    3-6: 3/3 First Strike
    7+: 5/5 Double Strike
    Pure white voltron threat
  Lighthouse Chronologist ({U}, Level Up {2}{U}):
    0-3: 1/3
    4-6: 1/3 + opponent takes extra turn? No
    7+: "At the beginning of each opponent's upkeep, you take an extra turn after this one"
```

## Definitive Conclusions

- **Level up is sorcery-speed** — one activation per main phase with empty stack.
- **Does NOT require {T}** — leveling up doesn't tap the creature, no summoning-sickness restriction.
- **Counter removal de-levels** the creature (Vampire Hexmage, Hex Parasite).
- **Venerated Teacher advances all levelers** by 2 counters instantly.
- **Copy of a leveler** starts at level 0 (counters aren't copiable values).

## Canonical Example
**Transcendent Master (Level Up {1}):**
Turn 1: cast for {W} (1 mana). A 3/3 for 1 mana with level up.
Turn 2: pay {1} → 1 counter (still 3/3). Pay {1} again (second main) → 2 counters.
Turn 3: pay {1} → 3 counters → NOW becomes 6/6 Lifelink!
Turn 4-5: continue leveling → at 6 counters: 9/9 Lifelink, Indestructible, protection from everything.
A 3-mana initial investment + 6 mana in level-up costs = 9 total for a nearly unkillable 9/9.

**Example 2 — Venerated Teacher:**
Control three levelers (each at 1 counter). Cast Venerated Teacher (2/2).
ETB: put 2 level counters on each creature with level up → each leveler jumps from 1 to 3 counters.
Any leveler with threshold at 3+ just unlocked their mid-tier abilities for free.

## Commonly Confused With
- **P174 vs Outlast (P142)** — Outlast adds +1/+1 counters, sorcery speed. Level up adds LEVEL counters that unlock card thresholds.
- **P131 (Impending)** — Impending has time counters counting DOWN. Level up has level counters counting UP.
- **P134 (Cumulative Upkeep)** — Cumulative upkeep adds age counters each upkeep. Level up adds level counters by paying voluntarily.
