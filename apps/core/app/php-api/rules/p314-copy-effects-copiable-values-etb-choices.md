---
id: p314
name: Copy Effects — Copiable Values, ETB Triggers, and What Isn't Copied
category: continuous
cr_refs: [707.1, 707.2, 707.2b, 707.3, 707.5, 707.6, 707.9, 707.10, 707.10a]
tags: [copy, copiable-values, Clone, Phyrexian-Metamorph, Phantasmal-Image, ETB-copy, counters-not-copied, choices-not-copied, Fork, Storm-copy, Rite-of-Replication, token-copy, face-down-copy, Moritte-of-the-Frost]
created: 2026-03-29
examples_count: 2
---

# P314 — Copy Effects — Copiable Values, ETB Triggers, and What Isn't Copied

## Abstract
When an object is copied, it acquires the **copiable values** of the original — the characteristics derived from printed text (name, mana cost, color indicator, card type, subtype, supertype, rules text, power, toughness, loyalty), modified only by other copy effects, face-down status, and "as…enters" P/T-setting abilities. Critically: other effects (pump spells, control effects, type-changing effects), status (tapped, flipped), counters, damage marks, and stickers are **not** copied. A copy that enters the battlefield gets to make its own "as it enters" choices (CR 707.6) and triggers its own ETB abilities (CR 707.5). Changing the original after copying doesn't change the copy (CR 707.2b).

## The Definitive Rules

**CR 707.2** (verbatim): *"When copying an object, the copy acquires the copiable values of the original object's characteristics and, for an object on the stack, choices made when casting or activating it (mode, targets, the value of X, whether it was kicked, how it will affect multiple targets, and so on). The copiable values are the values derived from the text printed on the object (that text being name, mana cost, color indicator, card type, subtype, supertype, rules text, power, toughness, and/or loyalty), as modified by other copy effects, by its face-down status, and by 'as . . . enters' and 'as . . . is turned face up' abilities that set power and toughness (and may also set additional characteristics). Other effects (including type-changing and text-changing effects), status, counters, and stickers are not copied."*

**CR 707.2b** (verbatim): *"Once an object has been copied, changing the copiable values of the original object won't cause the copy to change."*

**CR 707.5** (verbatim): *"An object that enters the battlefield 'as a copy' or 'that's a copy' of another object becomes a copy as it enters the battlefield. It doesn't enter the battlefield, and then become a copy of that permanent. If the text that's being copied includes any abilities that replace the enters-the-battlefield event (such as 'enters with' or 'as [this] enters' abilities), those abilities will take effect. Also, any enters-the-battlefield triggered abilities of the copy will have a chance to trigger."*

**CR 707.6** (verbatim): *"When copying a permanent, any choices that have been made for that permanent aren't copied. Instead, if an object enters the battlefield as a copy of another permanent, the object's controller will get to make any 'as [this] enters the battlefield' choices for it."*

**CR 707.10** (partial verbatim): *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack; a copy of a spell isn't cast and a copy of an activated ability isn't activated. A copy of a spell or ability copies both the characteristics of the spell or ability and all decisions made for it, including modes, targets, the value of X, and additional or alternative costs."*

## The Pattern

```
COPIABLE VALUES (what IS copied):
  Printed name
  Printed mana cost (→ determines color and MV)
  Color indicator (if any)
  Card types, subtypes, supertypes
  Printed rules text
  Printed power and toughness
  Printed loyalty
  Modifications from: (a) other copy effects, (b) face-down status,
    (c) "as...enters" and "as...is turned face up" P/T-setting abilities

NOT COPIABLE (what is NOT copied):
  Status: tapped, flipped, face-down, phased-out (707.2)
  Counters: +1/+1, -1/-1, loyalty, charge, any counters
  Damage marked on the permanent
  Stickers
  Non-copy continuous effects: Giant Growth (+3/+3 until EOT), Act of Treason,
    Volrath's Shapeshifter text-changing, type-changing effects (unless copy effect)
  Previous "as...enters" choices (controller makes new choices — see 707.6)

KEY EXAMPLES OF WHAT'S NOT COPIED:
  Chimeric Staff ({X}: becomes X/X Construct until EOT). Giant Growth pumps it to 8/8.
  Clone copies the Staff after Giant Growth resolved.
  The Clone is a Chimeric Staff (artifact, with the ability), NOT an 8/8 creature.
  The +3/+3 from Giant Growth was a non-copy effect — not copied. (CR 707.2 example)

  A creature has 3 +1/+1 counters from Hardened Scales synergy.
  Clone copies it. Clone enters with 0 counters. Counters are not copiable.

ENTERING AS A COPY — ETB TRIGGERS:
  When a permanent enters the battlefield as a copy:
  (A) It becomes a copy AS it enters — not before, not after.
  (B) "As...enters" replacement effects from the COPIED text apply:
      Clone copies Skyshroud Behemoth ("enters tapped with 2 fade counters").
      The Clone enters tapped with 2 fade counters. (CR 707.5 example)
  (C) ETB triggered abilities of the copy FIRE:
      Clone copies Wall of Omens ("when this creature enters, draw a card").
      Clone's controller draws a card. (CR 707.5 example)
  (D) Controller makes NEW "as...enters" choices (not inheriting old choices):
      Clone copies Adaptive Automaton ("as this enters, choose a creature type").
      The Clone's controller chooses a (possibly different) creature type. (CR 707.6 example)

CHANGING ORIGINAL AFTER COPYING:
  CR 707.2b: Changing the original's copiable values does NOT change the copy.
  Your creature is a Clone copying Grizzly Bears (2/2).
  Opponent Mutations a Gemrazer onto their original Grizzly Bears → it gains Mutate abilities.
  The Clone remains a plain 2/2 Grizzly Bears — it doesn't gain the new abilities.

COPYING SPELLS (stack):
  CR 707.10: Copy a spell on the stack = put a copy on the stack. Not cast. Not activated.
  The copy inherits: modes, targets, the value of X, kicker choices, additional costs paid.
  Copy does NOT re-trigger storm (copies are not "cast").
  Fork/Reverberate: copy the spell. May choose new targets.
  Twincast: same. The copy goes on top of the stack (LIFO).
  Example: opponent casts Fireball with X=7 targeting your face.
  You cast Reverberate: copies the Fireball with X=7. Copy targets your opponent for 7 instead.
  No additional mana needed — copy inherits the X=7 announced value.

  COPIES AND STORM:
  Grapeshot (Storm): creates copies (one per spell cast this turn).
  Those copies are NOT cast. They don't trigger other storm spells' triggers.
  But the copies ARE spells on the stack — they can be countered individually.

COPYING A FACE-DOWN CREATURE:
  CR 707.2 example: Clone enters as a copy of a face-down Grinning Demon.
  The Clone is a colorless 2/2 with no name, no types, no abilities, no mana cost.
  It's face UP (Clone is never face-down unless explicitly stated).
  The Clone cannot be turned face up for Grinning Demon's morph cost.
  (The morph cost was NOT a "printed copiable value" of the face-down object.)

COPY EFFECTS THAT MODIFY CHARACTERISTICS (CR 707.9):
  Some copy effects grant additional abilities or change characteristics.
  Vesuvan Doppelganger: enters as a copy but doesn't copy color and gains the upkeep ability.
  The non-copied color is replaced by the Doppelganger's own color (blue).
  The granted ability BECOMES part of the copiable values of the Doppelganger.
  If Clone then copies the Doppelganger: it gets Doppelganger's upkeep ability too.

  Quicksilver Gargantuan: "enters as a copy...except it's 7/7."
  If copying Tarmogoyf (has a CDA defining P/T):
  The Gargantuan's "except 7/7" overrides the CDA — CDA not copied. (CR 707.9d)
  The Gargantuan is 7/7.

COPYING A DOUBLE-FACED CARD:
  CR 707.8: copy a double-faced permanent → use copiable values of the face that's UP.
  Flip Werewolf with front face up → Clone copies front face only.
  The Clone is a copy with the front face's characteristics (doesn't transform unless it can).
  CR 707.8a: some effects create a double-faced token copy (has both faces, can transform).

COPY TOKENS:
  Rite of Replication (kicked): creates 5 token copies of a creature.
  Each token = a copy with the copiable values (printed characteristics).
  Counters on the original: not on the tokens. Status: clean (enter untapped, undamaged).
  If copying a legendary creature: all 5 tokens are also legendary → legend rule → keep one.
  (See P312 for the Rite of Replication + legendary cascade.)

PERMANENTS THAT COPY ANOTHER WHILE ON THE BATTLEFIELD:
  CR 707.4: "copy a different object while remaining on the battlefield" — no ETB trigger.
  Unstable Shapeshifter: "whenever another creature enters, this creature becomes a copy..."
  When it becomes a copy: no ETB triggers fire (it didn't enter, it changed while already on battlefield).
  But: any non-copy effects on it still apply (Giant Growth it received is not erased).
```

## Definitive Conclusions

- **Copy acquires only copiable values** — printed text, mana cost, types, rules text, P/T, loyalty, and modifications from other copy effects or "as enters" P/T-setters. Nothing else.
- **Counters, status, damage, and non-copy effects are NOT copied** — a pumped 8/8 copies as the base creature, not the pumped version.
- **The copy makes its own "as...enters" choices** — inheriting the original's choices would violate CR 707.6.
- **ETB triggered abilities of the copy fire** — Clone copying Wall of Omens draws a card.
- **Changing the original after copying doesn't change the copy** — CR 707.2b is absolute.
- **Copying a spell copies modes, targets, and X value** — but the copy is not "cast" (no storm, no casting triggers).
- **Copying a face-down creature gives a colorless 2/2 with nothing** — face-down status determines copiable values.

## Canonical Example
**Clone Copying Mulldrifter — ETB Fires:**
Opponent controls Mulldrifter ({4}{U}: 2/2 Flying, "when it enters, draw 2 cards").
You cast Clone ({3}{U}): "You may have this creature enter as a copy of any creature on the battlefield."
Clone enters as a copy of Mulldrifter.
As it enters as a copy: ETB trigger fires → draw 2 cards.
Clone becomes a 2/2 Flying creature with the Evoke ability (from Mulldrifter's printed text).
Critical: you get the ETB draw even though Clone itself doesn't have a printed "draw 2 cards" ability.
The Clone IS Mulldrifter, so Mulldrifter's ETB is Clone's ETB.
Result: {3}{U} spent for a 2/2 Flying that drew 2 cards. Slightly worse than original Mulldrifter but same effect.

If Mulldrifter had 3 +1/+1 counters on it from Proliferate effects:
Clone enters as a 2/2, not a 5/5. Counters are not copiable.

**Example 2 — Copying Adaptive Automaton With Different Choice:**
Board: Player A controls Adaptive Automaton ({3}: 2/2, "as this enters, choose a creature type; it's that type and gets +1/+1 for each other creature you control of that type") — chosen: Zombie. It's a 2/2 Zombie Lord.
Opponent plays Phantasmal Image ({1}{U}: enters as copy of any creature on the battlefield).
Enters as a copy of Adaptive Automaton.
CR 707.6: choices made for the original are NOT copied.
Opponent chooses a creature type for their Image-Automaton: chooses Merfolk.
Now both players have an "Adaptive Automaton" but with different creature type choices.
Player A's Automaton is a Zombie lord. Opponent's Image is a Merfolk lord.
Both are legendary? Adaptive Automaton is not legendary, so no legend rule.
Two Automatons on the field, but each boosting different creature types for different players.

Key: CR 707.6 allows fresh choices, making Copy spells flexible — choose the best creature type for YOUR board state.

## Commonly Confused With
- **P311 (New Object Rule)** — Zone changes create new objects that forget the old object's state; copying is similar but occurs on the battlefield or stack. A key difference: a copy entering the battlefield is a new object with copiable values, while a zone-changed object is a new object with printed values only.
- **P312 (Legendary Rule)** — Tokens created by copy effects that copy a legendary permanent are also legendary, triggering the legend rule.
- **P296 (Storm)** — Storm copies are not "cast"; they're put on the stack by the storm mechanic. A copy of a storm spell doesn't itself trigger other storm spells.
- **P303 (Split Second)** — Copying a split-second spell (e.g., via Fork) before it resolves: you can't cast Fork in response to Krosan Grip because split second forbids new spells. But Twincast cast before Krosan Grip resolves: split second is in effect so Twincast can't be cast.
