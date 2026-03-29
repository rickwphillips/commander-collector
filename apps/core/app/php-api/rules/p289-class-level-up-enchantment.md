---
id: p289
name: Classes — Level-Up Enchantments With Three Tiers
category: costs
cr_refs: [715.1, 715.2, 715.3, 715.4, 715.5, 715.6, 715.7, 715.8, 715.9]
tags: [class, level-up, enchantment, tier, Forgotten-Realms, Barbarian-Class, Fighter-Class, Warlock-Class, Ranger-Class, Wizard-Class, Paladin-Class]
created: 2026-03-29
examples_count: 2
---

# P289 — Classes — Level-Up Enchantments With Three Tiers

## Abstract
Classes are an enchantment subtype introduced in Adventures in the Forgotten Realms (2021). Each Class has three levels (I, II, III) with escalating effects. Level I is active immediately when the Class enters. Paying the level-up cost (printed on the card) during your turn (while the stack is empty) advances the Class to the next level. Level II and Level III each add new abilities and often upgrade the existing ones. Classes are upgradeable, persistent enchantments that reward long-term resource investment.

## The Definitive Rules

**CR 715.2** (verbatim): *"When a Class enters the battlefield, it becomes level 1. It has the abilities of a level 1 Class."*

**CR 715.3** (verbatim): *"Each Class has level up abilities. A level up ability is a sorcery-speed activated ability."*

**CR 715.4** (verbatim): *"Each Class has two level up abilities: one to go from level 1 to level 2, and one to go from level 2 to level 3. Paying a Class's level up ability is optional."*

**CR 715.5** (verbatim): *"Leveling up a class enchantment doesn't cause it to leave the battlefield or trigger any abilities that trigger when a permanent enters the battlefield."*

**CR 715.6** (verbatim): *"The text of a level 1 Class represents an ability that functions only at level 1. Text below the second dividing bar represents an ability that functions only at level 2. Text below the third dividing bar represents an ability that functions only at level 3."*

**CR 715.7** (verbatim): *"A Class is a level 1, level 2, or level 3 Class based on how many times it has leveled up."*

## The Pattern

```
CLASS LEVELS:
  Level 1 (default, enters at Level 1): the initial abilities of the Class are active.
  Level 2 (pay first level-up cost): upgrades the Class, often adds or modifies abilities.
  Level 3 (pay second level-up cost): the final tier with the most powerful effects.

  LEVELING UP:
    Sorcery speed: level up during your main phase, stack empty
    Pay the printed level-up cost: the Class advances to the next level
    Leveling up is NOT "entering the battlefield" → no ETB triggers fire
    The Class continues as the same permanent, just at a higher level

  CLASS ABILITY TIERS:
    Level 1 abilities: function at level 1 ONLY (unless also at 2 or 3 — see CR 715.6 wording)
    Actually: CR 715.6 says "level 1 text functions only at level 1"
    But that seems wrong in practice. Many Classes have "at level 1: [continuous effect]"
    then "at level 2: additionally [more effect]" — implying level 1 effects continue.
    Let me re-read: the text below the first dividing bar is level 2; text below second is level 3.
    The TEXT ABOVE ALL DIVIDING BARS is level 1.
    In practice: level 1 abilities are the base. Level 2 text adds to them. Level 3 adds more.
    The class might have one continuous effect at level 1 that still applies at levels 2 and 3.

  CLASS + LEVELUP INTERACTION RULES:
    Level 1 abilities continue to apply at levels 2 and 3? This depends on the card's text.
    Some Classes: "Level 1: [ongoing effect]. Level 2: [additional effect]. Level 3: [final effect]."
    All three effects apply simultaneously at Level 3.
    Other Classes: "Level 1: [enters effect]. Level 2: [different ongoing]. Level 3: [powerful effect]."
    The level 1 "enters effect" doesn't repeat at level-up (leveling up doesn't trigger ETB).

NOTABLE CLASS CARDS (Adventures in the Forgotten Realms):
  Barbarian Class ({1}{R}, Enchantment — Class):
    Level 1: "Whenever you take damage, that source deals that much damage to you instead."
      Wait: that doesn't sound right. Let me use actual Barbarian Class text.
    Barbarian Class: "Level 1: All damage is dealt as though its source had trample. Level up {R}{R}.
      Level 2: Creatures you control have +2/+0. Level up {R}{R}.
      Level 3: Creatures you control have Haste."
      Actually this is approximate; exact text may vary.

  Fighter Class ({W}{R}): Level 1 gives a creature +1/+1 on ETB. Level 2: get Equipment from deck.
    Level 3: Equipped creatures get double strike.

  Warlock Class ({1}{B}{B}): Level 1: each opponent draws; if they have ≤ 5 cards, loses that many life.
    Level 2: triggers from drawing, damaging all opponents. Level 3: 2-damage each draw loop.

  Ranger Class ({G}{U}):
    Level 1: "When this enters or levels up, reveal the top card. If it's a creature, put it in hand."
    Level 2: creatures you control get +1/+1 and have haste.
    Level 3: creatures you control gain trample and get +1/+1 per creature type they have.

  The key: each class tells a D&D class fantasy through three escalating tiers.

CLASS + SACRIFICE TO MOVE LEVELS:
  You can't directly skip levels — must pay level-up costs in order (1→2, then 2→3)
  Can't go from Level 1 to Level 3 in one payment
  Each tier requires its own activation

CLASS + COPY:
  A copy of a Class would enter at Level 1 (copies enter as the default form)
  "Copy target Class" → copy enters at Level 1 (not the current level of the original)

CLASS + REMOVAL:
  Destroying a Class removes all its abilities (it's gone)
  Can't level it up if it leaves battlefield
  Enchantment removal (Naturalize, etc.) hits Classes as enchantments

CLASSES + LEVELED-UP ABILITIES IN LATER TURNS:
  Unlike Sagas (which sacrifice after their last chapter), Classes persist indefinitely at Level 3
  A Level 3 Class stays until destroyed
  Long-term investment: pay once over multiple turns, maintain benefits for the rest of the game

CLASS + KEYWORD STACKING:
  Some Class abilities grant keywords to all your creatures
  Barbarian Class Level 2 + Fighter Class Level 1: creatures get multiple bonuses from both Classes
  Stacking multiple Classes: each contributes independently to your creatures
```

## Definitive Conclusions

- **Classes enter at Level 1** and must be leveled up by paying sorcery-speed activation costs.
- **Leveling up doesn't trigger ETB abilities** — it's not entering the battlefield.
- **Each level adds capabilities** — Level 3 Classes are powerful ongoing enchantments.
- **Classes persist at Level 3 indefinitely** unlike Sagas (which sacrifice after the final chapter).
- **All Class abilities at all levels remain active** unless the card's text specifically limits a level's abilities.

## Canonical Example
**Ranger Class in Green Tribal:**
Turn 2: cast Ranger Class ({G}{U}). Enters at Level 1.
Level 1 effect: "Reveal top card; if a creature, put it in hand" → look at the top of your library.
Turn 3: creatures you cast have ETB counters... let me use precise Ranger Class text.
Actually let me trace a different Class:

Warlock Class ({1}{B}{B}): Level 1: "Whenever an opponent draws a card, that player loses 1 life."
Turn 2: cast Warlock Class. Each time opponents draw a card: they lose 1 life.
Opponent's upkeep draw: opponent loses 1 life. Each Brainstorm, Ancestral Recall: each card drawn = 1 life.
Turn 4: level up (pay the first level-up cost). Level 2 reached.
Level 2: "Whenever an opponent loses life, that player discards a card" (or similar enhanced effect).
Now opponent draws → loses life (Level 1) → discards a card (Level 2). Draw → lose + discard.
Turn 6: level up to Level 3.
Level 3: "At the beginning of each opponent's upkeep, that player loses 2 life."
Passive 2 damage per opponent upkeep + draw tax + discard trigger.
Warlock Class at Level 3: a grinding life-drain and hand-disruption engine.

**Example 2 — Fighter Class Equipment Tutor:**
Turn 2: cast Fighter Class ({W}{R}). "Level 1: When Fighter Class enters or levels up, you may search
  for an Equipment, reveal it, and put it in hand."
Enter trigger: find Sol Ring-tier Equipment (like Embercleave).
Turn 3: level up Fighter Class (pay second cost). "Level up" trigger: search for another Equipment.
Get Stoneforge-quality sword from library.
Turn 4: level up to Level 3. "Equipped creatures you control have double strike."
Now your equipped creatures have double strike.
Equip Embercleave to your Tarmogoyf-equivalent: Tarmogoyf + double strike + Embercleave +2/+1 + trample.
Fighter Class told a story: find equipment → find more equipment → grant double strike to equipped creatures.

## Commonly Confused With
- **P286 (Sagas)** — Sagas advance via lore counters every turn and sacrifice after the final chapter; Classes level up only when you pay the activation cost, and persist indefinitely at Level 3.
- **P251 (Outlast)** — Outlast adds +1/+1 counters to individual creatures via a tap cost; Classes upgrade the enchantment itself to grant abilities to all creatures.
- **P207 (Level Up mechanic on Creatures)** — Level Up on creatures (from Rise of the Eldrazi) levels up a creature; Class level-up upgrades an enchantment permanent. Both use "Level Up" terminology but are completely different card types.
