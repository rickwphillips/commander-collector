---
id: p119
name: Bestow — Cast as Aura or Creature
category: stack
cr_refs: [702.103a, 702.103b, 702.103c, 702.103d, 702.103e, 303.4]
tags: [bestow, aura, creature, alternative-cost, enchant, ETB, fall-off, hexproof, target]
created: 2026-03-28
examples_count: 2
---

# P119 — Bestow — Cast as Aura or Creature

## Abstract
Bestow lets you cast a creature card as an Aura enchantment instead by paying a different (higher) cost. When cast bestowed, the spell becomes an Aura targeting a creature — it must have a legal target. If the host creature dies while the bestowed card is an Aura (either while on the stack or on the battlefield), the bestowed Aura falls off and becomes a creature itself. This "fall-off" behavior is what makes bestow unique among Auras: it doesn't go to the graveyard when its host dies.

## The Definitive Rule

**CR 702.103a** (verbatim): *"Bestow represents a static ability that functions in any zone from which you could play the card it's on. 'Bestow [cost]' means 'As you cast this spell, you may choose to cast it bestowed. If you do, you pay [cost] rather than its mana cost.' Casting a spell using its bestow ability follows the rules for paying alternative costs."*

**CR 702.103b** (verbatim): *"As a spell cast bestowed is put onto the stack, it becomes an Aura enchantment and gains enchant creature. It is a bestowed Aura spell, and the permanent it becomes as it resolves will be a bestowed Aura."*

## The Pattern

```
CASTING BESTOWED:
  Choose at cast time: cast normally (as creature) OR cast bestowed (as Aura)
  If bestowed: pay the bestow cost (alternative cost), becomes Aura on stack
  Must target a legal creature (enchant creature)

ON THE STACK (as Aura spell):
  If the target creature becomes illegal before resolution:
    Bestowed spell is countered (no target) → goes to graveyard (not battlefield)
    Doesn't "fall off" into a creature if countered (it was an Aura spell, goes to graveyard)
  If it resolves: attaches to target creature as an enchantment-creature

ON THE BATTLEFIELD (as Aura):
  The bestowed card is an Enchantment — Creature subtype still applies
  It has the creature's abilities AND the Aura's properties
  It gives the attached creature bonuses (as printed)

FALL-OFF (creature dies while bestowed):
  If the enchanted creature leaves the battlefield:
    SBA 704.5n: Aura with no legal object to enchant → goes to graveyard (normally)
    BUT: bestow overrides this — the bestowed Aura becomes a creature instead
    It remains on the battlefield as a standalone creature
  This fall-off happens as an SBA-like effect, not via a trigger

HEXPROOF AND TARGETING:
  Casting bestowed = casting an Aura spell with "enchant creature"
  The target creature must be targetable at cast time
  Hexproof: opponent can't TARGET your hexproof creature with a bestow spell
  Shroud: you CAN'T cast bestow onto your own shroud creature

CAST NORMALLY (no bestow):
  Cast as a creature spell (no target required)
  Enters battlefield as a creature (not an Aura)
  ETB triggers fire normally

BESTOW + TRIGGERS:
  When a bestowed Aura falls off and becomes a creature:
    It was already on the battlefield → it doesn't "enter" the battlefield again
    No ETB trigger when it converts from Aura to standalone creature

COPYING A BESTOW SPELL:
  If you copy a bestowed Aura spell on the stack:
    Copy is also a bestowed Aura (if that was the choice) → needs a new target
```

## Definitive Conclusions

- **Bestow lets you cast as Aura or creature — choice made at cast time.**
- **When cast bestowed, it's an Aura spell and must target a creature.**
- **If the host dies, the bestowed Aura DOESN'T go to graveyard — it becomes a creature (falls off).**
- **No ETB trigger fires when falling off** — the permanent was already on the battlefield.
- **Hexproof/shroud applies normally** to bestow targeting.

## Canonical Example
**Ethereal Armor (wait, that's not bestow). Boon Satyr (Bestow {3}{G}{G}):**
Cast normally for {2}{G}: enters as 4/2 creature.
Cast bestowed for {3}{G}{G}: targets a creature. Boon Satyr becomes Aura giving +4/+2.
Host dies → Boon Satyr falls off → remains as 4/2 creature on battlefield. No ETB trigger.

**Example 2 — Target becomes illegal:**
Cast Leafcrown Dryad (Bestow {3}{G}) targeting opponent's Grizzly Bears.
Opponent Destroys the Bears in response. Target is gone → Leafcrown Dryad's bestow spell is countered → goes to graveyard.
(Does NOT enter as a creature — the spell was countered.)

## Commonly Confused With
- **P040 (Aura Attachment)** — Normal Auras go to graveyard when host dies. Bestow Auras become creatures instead. This is the key difference.
- **P060 (Foretell)** — Also an alternative-cost cast from an exile zone. Both change what you pay and how the spell functions.
- **P103 (Hexproof/Shroud)** — Casting bestow counts as targeting the creature for hexproof/shroud purposes.
