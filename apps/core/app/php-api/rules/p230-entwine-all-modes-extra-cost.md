---
id: p230
name: Entwine — Pay Extra Cost to Choose All Modes of a Modal Spell
category: costs
cr_refs: [702.42a, 702.42b]
tags: [entwine, modal-spell, all-modes, additional-cost, Tooth-and-Nail, Grab-the-Reins, Mirrodin]
created: 2026-03-28
examples_count: 2
---

# P230 — Entwine — Pay Extra Cost to Choose All Modes of a Modal Spell

## Abstract
Entwine is a static ability on modal spells: "You may choose ALL modes instead of just [the normal number] by paying an additional [entwine cost]." Normally, a modal spell lets you choose one (or sometimes two) modes. With Entwine, paying the additional cost grants access to ALL modes of the spell. Tooth and Nail is the most famous entwine spell in competitive MTG — normally you choose between searching for creatures OR putting them into play; with Entwine you search AND immediately put them into play. That combo (searching for Emrakul + Ulamog and immediately having them on the battlefield) is one of the most powerful effects in EDH and Modern Tron decks.

## The Definitive Rules

**CR 702.42a** (verbatim): *"Entwine is a static ability of modal spells (see rule 700.2) that functions while the spell is on the stack. 'Entwine [cost]' means 'You may choose all modes of this spell instead of just the number specified. If you do, you pay an additional [cost].' Using the entwine ability follows the rules for choosing modes and paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.42b** (verbatim): *"If the entwine cost was paid, follow the text of each of the modes in the order written on the card when the spell resolves."*

## The Pattern

```
ENTWINE:
  Static ability: "pay additional [entwine cost] to choose ALL modes"
  Without entwine: choose only the normally specified number of modes
  With entwine: choose all modes and pay the entwine cost as additional cost

ENTWINE + CASTING:
  Choose to use entwine when declaring spell choices (601.2b — choose modes)
  Pay: spell's mana cost + entwine additional cost
  Both modes execute when the spell resolves (in order as written on card)

ENTWINE + MODE ORDER (CR 702.42b):
  Modes execute in the order printed on the card
  If Mode 1 creates targets: choose targets for Mode 1 first
  Mode 2 targets: choose after Mode 1 is declared
  Resolution: Mode 1 happens, then Mode 2 happens

TOOTH AND NAIL ({5}{G}{G}):
  Mode 1: "Search your library for up to two creature cards, reveal them, put them into your hand."
  Mode 2: "Put up to two creature cards from your hand onto the battlefield."
  Entwine: {2}
  Without entwine: search OR put into play (hand-loop).
  With entwine ({5}{G}{G}+{2} = {7}{G}{G}): search for ANY two creatures AND immediately put them into play!
  The two creatures go from library → hand → battlefield in one spell.
  Standard Entwined Tooth and Nail packages:
  - Emrakul, the Aeons Torn + Woodfall Primus: destroy two permanents + a 15/15 annihilator
  - Dragonlord Dromoka + Acidic Slime: can't be instant-speed responded to + destroy artifact/land
  In Modern Tron: Tron generates enough mana on turn 3-4 for entwined Tooth and Nail → win

GRAB THE REINS ({3}{R}):
  Mode 1: "Until end of turn, target creature you control gains haste and gain control of target creature until end of turn."
  Wait: Let me use an accurate Grab the Reins description.
  Grab the Reins: "Choose one — Gain control of target creature until end of turn. Untap it. It gains haste until end of turn. OR Sacrifice a creature. Grab the Reins deals damage equal to that creature's power to any target."
  Entwine {2}{R}: do BOTH — gain control of creature AND sacrifice it to deal damage.
  With entwine: steal opponent's creature AND sacrifice it to deal damage equal to its power.
  A 10-power creature stolen and sacrificed: deal 10 damage.

ENTWINE + COPIES:
  Copy of an entwined spell: the copy is also entwined (same choices)
  Storm copies the EXACT spell (including mode choices and entwine)
  Reverberate targeting Tooth and Nail with entwine: copy is also fully entwined!

ENTWINE + COUNTERING:
  Countering an entwined spell: both modes are countered (the spell doesn't resolve)
  No partial resolution

ENTWINE COMPARISON TO FUSE (P203):
  Fuse: for SPLIT CARDS — cast both halves simultaneously
  Entwine: for MODAL SPELLS — choose all modes simultaneously
  Both pay extra to get everything, but for different card types
  Fuse: two independent halves both happen
  Entwine: all modes of the same spell happen

ENTWINE vs CHOOSE TWO:
  "Choose two" modal spells: normally pick 2 of several options
  If an effect says "choose two OR more": already allows more modes
  Entwine specifically: "pay this extra cost to choose ALL" (not just one or two)
```

## Definitive Conclusions

- **Entwine pays additional cost to choose all modes** of a modal spell.
- **Without Entwine**: only choose the normally specified number of modes.
- **Modes execute in order** as written on the card.
- **Tooth and Nail with Entwine** is the most powerful application: search + immediately deploy two creatures.
- **Copies of Entwined spells** are also Entwined (they have the same choices).

## Canonical Example
**Tooth and Nail in Modern Tron:**
Turn 3: Urza's Mine + Urza's Power Plant + Urza's Tower = {7} mana available.
Cast Tooth and Nail with Entwine: total cost {7}{G}{G} + {2} = {9}{G}{G} = 11 mana.
On turn 4 with a Chromatic Sphere or other filtering: 11 mana accessible.
Choose both modes:
Mode 1: Search library for Emrakul, the Aeons Torn (15/15 annihilator 6, protection from colored spells) AND Xenagos, the Reveler/Dragonlord Dromoka/Woodfall Primus.
Mode 2: Put both onto the battlefield immediately.
Emrakul resolves entering play: triggers annihilator (defending player sacrifices 6 permanents).
Both creatures on battlefield on turn 4. Win follows.

**Example 2 — Grab the Reins Entwine:**
Opponent controls Blightsteel Colossus (11/11 trample, infect, indestructible).
You control any creature.
Cast Grab the Reins with Entwine ({3}{R}+{2}{R} = {5}{R}):
Mode 1: Gain control of Blightsteel Colossus.
Mode 2: Sacrifice the Blightsteel Colossus (you now control it!) to deal 11 damage to any target.
Steal it + sacrifice it = deal 11 damage to opponent.
The Colossus is gone (sacrificed → exile or GY based on Blightsteel's own rules).
Expensive ({5}{R}) but deals with the "indestructible, can't be targeted" threat.

## Commonly Confused With
- **P193 (Tiered)** — Tiered REQUIRES paying a cost to choose each mode. Entwine optionally pays EXTRA to choose ALL modes (you can still cast with just one mode for free).
- **P152 (Overload)** — Overload changes "target" to "each" for a higher cost. Different mechanism from Entwine's "choose all modes."
- **P203 (Split/Fuse)** — Fuse combines two halves of split cards. Entwine enables all modes of a single modal spell.
