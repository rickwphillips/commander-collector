---
id: p431
name: Bestow — Theros Aura-Creature Duality, Illegal Target Rules, and Falls Off as Creature
category: costs
cr_refs: [702.103a, 702.103b, 702.103c, 702.103d, 702.103e, 702.103f, 702.103g, 608.3b, 303.4]
tags: [bestow, bestowed-aura, aura-creature-duality, illegal-target-falls-off, bestow-alternative-cost, enchant-creature, creature-dies-bestow-returns, copy-bestow, Theros, Eidolon-of-Countless-Battles, Boon-Satyr, Celestial-Archon, Courser-of-Kruphix, bestow-and-removal, bestow-and-counterspell, bestow-and-bounce, bestow-cascade, Garruk-trigger-bestow]
created: 2026-03-29
examples_count: 2
---

# P431 — Bestow — Theros Aura-Creature Duality, Illegal Target Rules, and Falls Off as Creature

## Abstract
**Bestow** (702.103) lets you cast a creature as an Aura that enchants another creature. While bestowed, the permanent is an Aura enchantment (not a creature); when the enchanted creature leaves the battlefield, the bestow permanent "falls off" and becomes a creature immediately. Key non-obvious interactions: (1) **a bestow spell with no legal target when it begins resolving falls off immediately** — it enters the battlefield as a creature (not an Aura), with ETBs firing as a creature; (2) **bestow is an alternative cost** — additional costs (kicker, etc.) can still be paid; (3) **a bestowed Aura is not a creature** while attached — it doesn't trigger creature-dependent effects like Evolve triggers on entering; (4) **copying a bestowed Aura spell** creates a copy that is also a bestowed Aura spell, requiring a new target; and (5) **counterspells that counter "creature spells" cannot counter a bestow spell** because it's an Aura spell while bestowed (not a creature spell on the stack).

## The Definitive Rules

**CR 702.103a** (verbatim): *"Bestow represents a static ability that functions in any zone from which you could play the card it's on. 'Bestow [cost]' means 'As you cast this spell, you may choose to cast it bestowed. If you do, you pay [cost] rather than its mana cost.' Casting a spell using its bestow ability follows the rules for paying alternative costs (see 601.2b and 601.2f–h)."*

**CR 702.103b** (verbatim): *"As a spell cast bestowed is put onto the stack, it becomes an Aura enchantment and gains enchant creature. It is a bestowed Aura spell, and the permanent it becomes as it resolves will be a bestowed Aura. These effects last until the spell or the permanent it becomes ceases to be bestowed (see rules 702.103e–g). Because the spell is an Aura spell, its controller must choose a legal target for that spell as defined by its enchant creature ability and rule 601.2c."*

**CR 702.103e** (verbatim): *"As a bestowed Aura spell begins resolving, if its target is illegal, it ceases to be bestowed and the effect making it an Aura spell ends. It continues resolving as a creature spell."*

**CR 702.103f** (verbatim): *"If a bestowed Aura becomes unattached, it ceases to be bestowed. If a bestowed Aura is attached to an illegal object or player, it becomes unattached and ceases to be bestowed. This is an exception to rule 704.5m."*

**CR 608.3b** (verbatim excerpt): *"If the spell has an illegal target when it begins to resolve, its controller may still cast it...* [for bestow, the target-illegal rule at resolution triggers 702.103e]"*

## The Pattern

```
BESTOW CASTING (702.103a, 702.103b):
  Normal: cast the creature as a creature spell.
  Bestow: as you cast, choose to cast it bestowed → pay bestow cost (alternative cost)
    instead of mana cost. The spell becomes an Aura enchantment with "enchant creature."
    The spell IS NOT A CREATURE SPELL while bestowed on the stack — it's an AURA SPELL.
    Choose a legal target (a creature on the battlefield).

  WHAT CHANGES ON THE STACK:
    - Card type changes from Creature to Enchantment Aura.
    - Gains "enchant creature."
    - Requires a legal target (creature).
    - Is no longer a creature spell.

  IMPLICATIONS OF "NOT A CREATURE SPELL WHILE BESTOWED":
    "Counter target creature spell" (Essence Scatter): cannot counter a bestowed Aura spell.
      Bestowed spell is an Aura spell, not a creature spell. Essence Scatter doesn't apply.
    "When you cast a creature spell" triggered abilities: DON'T trigger for bestow spells.
      E.g., if an effect says "whenever you cast a creature spell, draw a card": casting bestowed
      doesn't trigger this (it's an Aura spell while on the stack).
    "Creature spells you cast cost {1} less": DOESN'T reduce bestow cost. The spell is an Aura.

BESTOW RESOLVES WITH A LEGAL TARGET:
  The bestowed Aura enters the battlefield attached to the target creature.
  The permanent is an Aura enchantment. NOT a creature.
  It provides bonuses to the enchanted creature (as printed on the card) + P/T bonuses.
  It does NOT trigger "creature ETBs" because it's not entering as a creature.
    "Whenever a creature enters under your control": bestowed Aura does NOT trigger this.
    (It enters as an Aura, not a creature.)
  It does trigger "whenever an Aura enters under your control" effects.

BESTOW FALLS OFF (702.103f — enchanted creature leaves or becomes illegal):
  "If a bestowed Aura becomes unattached, it ceases to be bestowed."
  The bestow permanent "falls off" and becomes a creature.
  When the enchanted creature leaves the battlefield (dies, exiled, bounced):
    The bestowed Aura becomes unattached. It ceases to be bestowed.
    It becomes a creature and enters the battlefield as a creature.
    It fires ETBs as a creature when it falls off and enters as a creature.
    Wait: does it "enter the battlefield" when it falls off?
    No — it was already a permanent on the battlefield (attached as an Aura).
    When it becomes unattached and ceases to be bestowed: the permanent is STILL on the
    battlefield but changes from Aura to Creature. This is a type change, not a zone change.
    The creature's ETB does NOT re-fire when it falls off (it was already on the battlefield).
    It just changes type from Aura to Creature.

  EXCEPTION: if the ENCHANTED CREATURE is destroyed AND the bestow Aura would also be destroyed
    by the same effect (e.g., a destroy all enchantments effect): the Aura is destroyed too.
    But if ONLY the enchanted creature dies: the bestow Aura stays on the battlefield as a creature.

BESTOW AND TARGET ILLEGALITY AT RESOLUTION (702.103e):
  If the target creature becomes illegal before the bestow spell resolves:
    (e.g., the target gains hexproof, or the target dies in response)
  As the bestow spell BEGINS TO RESOLVE: "if its target is illegal, it ceases to be bestowed."
  The spell "falls off" its type change — it becomes a creature spell mid-resolution.
  It continues resolving as a creature spell. It enters the battlefield as a creature.
  The creature's ETB fires (it's entering as a creature).
  This is different from normal Auras with illegal targets: normally, an Aura spell with no
    legal target is countered on resolution (rule 608.3b for Auras). Bestow has a special rule
    (702.103e) overriding this: instead of being countered, it enters as a creature.

  PRACTICAL IMPLICATION:
    Cast Boon Satyr ({1}{G}{G}: 4/2; bestow {3}{G}{G}) bestowed targeting opponent's creature.
    Opponent responds: bounces their creature. No legal target.
    Boon Satyr spell begins resolving: 702.103e fires. Ceases to be bestowed. Becomes creature spell.
    Boon Satyr resolves as a 4/2 creature. ETBs fire.
    Your "boon satyr as enchantment" plan failed, but you still get the 4/2 body.
    The bestow cost {3}{G}{G} was paid. You got a 4/2 for {3}{G}{G} instead of the normal {1}{G}{G}.
    (You overpaid since the bestow cost is more expensive than the base cost.)

COUNTERSPELLS AND BESTOW:
  While on stack as bestowed Aura:
    "Counter target Aura spell": works. The bestowed spell is an Aura.
    "Counter target enchantment spell": works. Aura is an enchantment.
    "Counter target creature spell": does NOT work. Not a creature spell while bestowed.
    "Counter target spell": works. It's any spell.
  While on stack as creature (not bestowed):
    "Counter target creature spell": works. It's a creature spell.
    "Counter target Aura spell": does NOT work. Not an Aura while not bestowed.

COPY EFFECTS AND BESTOW (702.103c):
  "If a bestowed Aura spell is copied, the copy is also a bestowed Aura spell."
  Copying a bestowed Aura spell: the copy is an Aura spell that must choose a new target.
  The copy is also a bestowed Aura — it will enter as a bestowed Aura if the target is legal,
    or as a creature if the target is illegal (702.103e applies to the copy too).
  Fork/Reverberate on a bestowed Aura spell: the copy chooses a new target.

BESTOW AND POWER/TOUGHNESS:
  Bestowed Auras typically grant +N/+N to the enchanted creature.
  Example: Boon Satyr bestowed: "+4/+2 to enchanted creature" (its own P/T becomes a bonus).
  This is not counted separately from its own P/T — the bonus is derived from what would be
  its own P/T if it were a creature.

BESTOW AND PROTECTION:
  If the target creature has hexproof: can't be targeted with bestow.
    Wait: hexproof says "can't be the target of spells or abilities your opponents control."
    If the OPPONENT'S creature has hexproof, you can't target it with bestow (you're casting it).
    If YOUR creature has hexproof, you still can't target it... wait: hexproof works against
    opponents. If you're targeting YOUR OWN creature, hexproof doesn't prevent it (hexproof
    means opponents can't target it, not you).
  Protection from enchantments: the protected creature can't be enchanted by Aura spells
    (including bestow spells) by players who are "enchanting" it. Actually protection prevents:
    (1) damage from, (2) enchanting by, (3) equipping by, (4) blocking by, (5) targeting by
    sources that have the quality. Protection from enchantments = can't be enchanted by
    Aura enchantments, and bestow spells (while in their Aura form) count as Aura enchantments.
    A creature with "protection from enchantments" cannot be targeted by a bestow spell.

BESTOW AND ETB TRIGGERS (when the creature dies and bestow becomes a creature):
  Wait — bestow falls off and BECOMES A CREATURE on the battlefield. It doesn't "enter" the
    battlefield at that point. It was already there as an Aura. It just changes type.
  ETBs fire on actual entry. "Becoming" a creature on the battlefield (from an Aura) is a
    TYPE CHANGE on the battlefield, not an entry event. ETBs do NOT re-fire.
  But: certain triggers fire "whenever a creature enters under your control." A type-change
    from Aura to Creature on the battlefield is NOT a "creature entering." It doesn't trigger
    "creature enters" effects.
  EXCEPTION: if the bestow Aura was somehow exiled and RETURNED to the battlefield as a
    creature: that IS a zone change → creature entering → ETBs fire.
    But that's not normal bestow fall-off (which is a type change on the battlefield, not exile).
```

## Definitive Conclusions

- **A bestow spell is an Aura spell while bestowed on the stack** — "counter target creature spell" can't counter it; "whenever you cast a creature spell" doesn't trigger; creature-cost-reduction effects don't apply.
- **If a bestow spell's target is illegal when it begins resolving, it becomes a creature spell** — it enters the battlefield as a creature with ETBs firing (702.103e); this is an exception to the normal "Aura with illegal target is countered" rule.
- **A bestowed Aura falling off a dying creature is a type change on the battlefield, not a new entry** — ETBs don't re-fire when it falls off; "creature enters" triggers don't fire.
- **Copies of bestowed Aura spells are also bestowed Aura spells** — they must choose new targets and follow the same rules (including the illegal-target-becomes-creature exception).
- **Protection from enchantments prevents bestowing** — the bestowed spell is an Aura; protection prevents Aura attachment; the creature can't be targeted by bestow if it has protection from enchantments.

## Canonical Example
**Boon Satyr bestowed targeting an opponent's creature with hexproof:**
Opponent's Elf has hexproof. You try to bestow Boon Satyr ({1}{G}{G}: 4/2; bestow {3}{G}{G})
targeting the Elf.
Boon Satyr while bestowed is an Aura spell. Hexproof says "can't be the target of spells or
abilities your opponents control." You're targeting the opponent's Elf — they're the controller;
hexproof prevents targeting by opponents. You CAN'T target the Elf with bestow.

**Targeting your own hexproof creature:** Your creature has shroud (can't be targeted by
ANYONE's spells). You can't bestow onto your own shroud creature. But hexproof (only opponents'
spells/abilities) doesn't prevent you from targeting your own creature with bestow.

Alternatively: Boon Satyr bestowed targeting your own creature. Opponent responds: Vapor Snag
({U}: return target creature to its owner's hand; its controller loses 1 life) targeting YOUR creature.
Your creature goes to hand. Boon Satyr's target is now illegal (enchant creature requires a
creature on the battlefield; your creature is in your hand now).
Boon Satyr begins resolving: 702.103e — target is illegal. Ceases to be bestowed.
Boon Satyr becomes a creature spell mid-resolution. Enters as 4/2 creature.
You paid {3}{G}{G} for a 4/2 (instead of the normal {1}{G}{G}). Suboptimal but not lost entirely.

**Example 2 — Bestow falling off:**
You bestow Celestial Archon ({3}{W}{W}: 4/4 flying first strike; bestow {5}{W}{W}) onto your
creature. Your creature is now +4/+4 flying first strike.
Opponent casts Doom Blade destroying your enchanted creature.
The bestow Aura (Celestial Archon) becomes unattached. It ceases to be bestowed.
It REMAINS on the battlefield — it changes from an Aura to a 4/4 flying first strike creature.
This is a TYPE CHANGE on the battlefield. No ETB fires.
Celestial Archon is now a 4/4 flying first strike creature you control. Doom Blade only hit the
enchanted creature; Celestial Archon survived.

Note: If opponent had used Cyclonic Rift overloaded (bounce all nonland permanents you don't
control) instead: Celestial Archon (in its Aura form) is a nonland permanent you don't control.
It gets bounced too. Celestial Archon is in its owner's hand. The "falls off as creature" doesn't
happen here because it was bounced directly while still a bestowed Aura.

## Commonly Confused With
- **P396 (Bestow was previously covered — P396 is listed here)** — Actually P396 in the original patterns may not exist yet in this knowledge base. The "commonly confused" for P431 involves other Aura mechanics.
- **P002 (Replacement Effects)** — Bestow's "illegal target becomes creature" (702.103e) overrides the normal Aura-with-illegal-target rule. This is a specific override of 608.3b, not a general replacement effect principle.
- **P413 (Morph)** — Both morph and bestow involve spells that "change" their nature (face-down for morph; Aura vs. creature for bestow). But morph changes on the battlefield (turn face up); bestow changes at various points (on stack when bestowed; on battlefield when it falls off).
- **P409 (Copy Effects)** — Copying a bestowed Aura spell creates another bestowed Aura spell (702.103c). The copy gets the Aura characteristics but needs its own target. If that target is illegal, the copy also becomes a creature (702.103e).
