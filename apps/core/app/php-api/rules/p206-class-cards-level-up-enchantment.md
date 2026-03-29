---
id: p206
name: Class Cards — Level-Up Enchantments with Conditional Static Abilities
category: continuous
cr_refs: [716.1, 716.2, 716.2a, 716.2b, 716.3]
tags: [class-card, class-level, level-up, enchantment, static-ability, Dungeon-Master, Wizard-Class, Adventures-in-the-Forgotten-Realms]
created: 2026-03-28
examples_count: 2
---

# P206 — Class Cards — Level-Up Enchantments with Conditional Static Abilities

## Abstract
Class cards (Dungeons & Dragons Universes Beyond) are enchantments with class level bars. Each class level bar represents BOTH an activated ability (to advance to that level) and a static ability (which is active as long as the Class is at or above that level number). The first class level bar costs are sequential: you must be at level N-1 to advance to level N, and you can only activate it at sorcery speed. The top section of the card (above all level bars) is always active. Each higher level unlocks additional abilities.

## The Definitive Rules

**CR 716.2a** (verbatim): *"'[Cost]: Level N — [Abilities]' means '[Cost]: This Class's level becomes N. Activate only if this Class is level N-1 and only as a sorcery' and 'As long as this Class is level N or greater, it has [abilities].'"*

**CR 716.2b** (verbatim): *"A level is a designation that any permanent can have. A Class retains its level even if it stops being a Class. Levels are not a copiable characteristic."*

**CR 716.3** (verbatim): *"Any ability printed on a Class card that isn't preceded by a class level bar is treated normally. In particular, the Class has the ability printed in its top text box section at all times."*

## The Pattern

```
CLASS CARD STRUCTURE:
  Top section: always-active ability (enters battlefield with this immediately)
  Level 2 bar: [Cost]: advance to level 2. Active when level >= 2.
  Level 3 bar: [Cost]: advance to level 3. Active when level >= 3.

  CLASS LEVEL PROGRESSION:
    Start: level 1 (or technically "no level" but treated as level 1 per CR 716.2d)
    To advance to level 2: pay level 2 cost (must be at level 1, sorcery speed)
    To advance to level 3: pay level 3 cost (must be at level 2, sorcery speed)
    Each level activation uses the stack (it's an activated ability)
    But EACH can only be paid once (can't go from 1 → 1 again)

  CLASS ABILITIES:
    "As long as this Class is level N or greater, it has [ability]"
    So at level 3: the Class has BOTH the level 2 AND level 3 abilities active
    Plus the always-active top section ability
    Three tiers of power stack as levels increase

  CLASS + COPY:
    Copying a Class: levels are NOT copiable characteristics (CR 716.2b)
    A copy of a level-3 Class enters as level 1 (or unleveled)
    You'd have to re-pay to level it up
    But the top section ability is immediately available (it's always-active)

  CLASS + ENCHANTRESS:
    Classes are enchantments: "whenever you cast an enchantment" triggers on Class cast
    "Whenever an enchantment enters" triggers on Class ETB
    Each level advance is an ACTIVATED ABILITY activation — doesn't trigger "cast" effects

  CLASS + REMOVAL:
    If a Class is destroyed (Naturalize targeting it): all levels lost (it's gone)
    If re-cast: starts from level 1 again (new object)
    Enchantment removal and Classes: Classes are vulnerable to anti-enchantment effects

  WIZARD CLASS (Adventures in the Forgotten Realms):
    Level 1: "When you cast your first instant or sorcery each turn, copy it. You may choose new targets."
    → Immediately on entry: copying instants/sorceries (very powerful level 1)
    Level 2: "Pay {2}{U}: next instant/sorcery you cast this turn has rebound."
    Level 3: "Whenever you copy a spell, create a 1/1 blue Wizard token."
    Three levels of spell copying synergy — each more powerful.

  DUNGEON MASTER CLASS:
    Level 1: "Whenever you enter a dungeon, draw a card."
    Level 2: "Whenever you venture into the dungeon, you may use the next room's reward as well."
    Level 3: "You win the game if you've completed each dungeon."
    Win condition at level 3 — but requires dungeon completion.

  CLASS + BOUNCE:
    Bounce a Class to hand: level designation is lost (it's removed from the battlefield)
    When replayed: starts at level 1 again
    The level designation is NOT in any zone characteristic — it's a battlefield designation only
```

## Definitive Conclusions

- **Class top section is always active**; each level bar's abilities activate at that level or above.
- **Level advancement**: must be at N-1 to advance to N, sorcery-speed only.
- **Levels are NOT copiable** — copies of Classes start at level 1.
- **At level 3**: all three sections' abilities are active simultaneously.
- **Classes are enchantments** — subject to enchantment removal, enchantress triggers.

## Canonical Example
**Wizard Class ({1}{U}{U}):**
Cast it: immediately active top section = "When you cast your first instant or sorcery each turn, copy it."
Turn 1 using Wizard Class: cast Lightning Bolt → it's the first instant this turn → COPIED. Deal 6 damage total.
Pay {3}{U} as sorcery: advance to level 2.
Now at level 2: spells also get rebound.
Pay {5}{U}{U}: advance to level 3.
Now at level 3: whenever you copy a spell, create a 1/1 Wizard token.
Next Lightning Bolt: copied (level 1 effect), creates a Wizard token (level 3 effect). Devastating.

**Example 2 — Fighter Class (Haste and Attack Triggers):**
Fighter Class {R}:
Level 1: "Creatures you control get +1/+0."
Level 2: "Creatures you control have first strike."
Level 3: "Creatures you control have double strike."
Turn 1: cast Fighter Class → all creatures +1/+0.
Turn 2: advance to level 2 → all creatures have first strike.
Turn 3: advance to level 3 → all creatures have double strike.
Note: double strike REPLACES first strike per the layer system (both abilities, double strike supersedes).
Fighter Class at level 3: every creature you control has +1/+0 and double strike.

## Commonly Confused With
- **P174 (Level Up)** — Level Up creatures use level COUNTERS and explicit level ranges. Class cards use a "level designation" (not counters) and class level bars.
- **P205 (Sagas)** — Sagas advance automatically each turn via lore counters. Classes advance only when you pay to level up.
- **P001 (Bloodbraid)** — Bloodbraid is about cascade triggering. Classes are their own card type unrelated to cascade.
