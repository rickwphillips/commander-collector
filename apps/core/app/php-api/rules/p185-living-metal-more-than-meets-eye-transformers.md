---
id: p185
name: Living Metal and More Than Meets the Eye — Transformers Vehicle Mechanics
category: continuous
cr_refs: [702.161a, 702.162a]
tags: [living-metal, more-than-meets-the-eye, vehicle, transformer, convert, artifact-creature, Brother-Wars]
created: 2026-03-28
examples_count: 2
---

# P185 — Living Metal and More Than Meets the Eye — Transformers Vehicle Mechanics

## Abstract
Two mechanics from the Transformers Secret Lair series. **Living Metal** makes a Vehicle an artifact creature during your turn (always, without needing crew). **More Than Meets the Eye** is an alternative cast that casts the card "converted" (in its alternate form — the transformed side). These mechanics represent Transformers' ability to change form: living metal = always a creature during your turn; more than meets the eye = cast in robot mode directly.

## The Definitive Rules

**CR 702.161a** (verbatim): *"Living metal is a keyword ability found on some Vehicles. 'Living metal' means 'During your turn, this permanent is an artifact creature in addition to its other types.'"*

**CR 702.162a** (verbatim): *"More Than Meets the Eye represents a static ability that functions in any zone from which the spell may be cast. 'More Than Meets the Eye [cost]' means 'You may cast this card converted by paying [cost] rather than its mana cost.' Casting a spell using its More Than Meets the Eye ability follows the rules for paying alternative costs (see 601.2b and 601.2f–h). See rule 701.28, 'Convert.'"*

## The Pattern

```
LIVING METAL:
  Static ability: "During your turn, this permanent is an artifact creature in addition to its other types"
  Effect: during your turn, it's a creature (no crewing needed)
  During opponent's turn: it's just a Vehicle (not a creature) unless crewed

  LIVING METAL + TIMING:
    Becomes a creature at the beginning of YOUR turn (ongoing static effect)
    Stops being a creature at the beginning of OPPONENT's turn
    During combat on your turn: it's a creature → can attack!
    During combat on opponent's turn: not a creature → can't be attacked by creatures that "can only block creatures" etc.
    Actually: on opponent's turn it's not a creature → it can't be blocked (it's not attacking); it can be targeted by artifact removal

  LIVING METAL + CREW:
    Living metal Vehicles don't need to be crewed during your turn (they're already creatures)
    But: crew cost is printed on the card for other uses (opponent's turns, etc.)
    On opponent's turn: if they need it to be a creature for some reason → crew it

  LIVING METAL + COMBAT:
    On your turn: it's a creature with power/toughness → attacks
    On opponent's turn: not a creature → opponent's creatures can attack you (it can't block as a creature)
    Wait: can a non-creature artifact block? No — only creatures block
    Living Metal vehicles are vulnerable on opponent's turns (can't block)

MORE THAN MEETS THE EYE:
  Alternative cast: cast the card "converted" (from the alternate face)
  This means the spell enters as the Transformer's robot mode (transformed side)
  Regular cost: enters as vehicle/alt mode
  More Than Meets the Eye cost: enters as robot/creature mode

  CONVERT (Rule 701.28):
    "Convert" means transform into the alternate face
    A DFC card casting its other face via More Than Meets the Eye: enters in that alternate form

  MORE THAN MEETS THE EYE + DOUBLE-FACED TRANSFORMERS:
    Front face: vehicle mode (truck, jet, etc.)
    Back face: robot mode (creature)
    Normal cast: enters front face (vehicle mode)
    More Than Meets the Eye cast: enters back face (robot mode) already transformed

  PRACTICAL MECHANICS:
    Some Transformer cards have MTME costs cheaper than their regular cost
    Or: the robot form is better and you want to enter as a robot immediately
    Optimus Prime, Heroic Protector and Megatron, Tyrant of Cybertron: MTME cards

TRANSFORMER-SPECIFIC CARD NOTES:
  These are Universes Beyond (Secret Lair) cards
  Rules-legal in Commander (if Universes Beyond cards are allowed)
  Living Metal: like a perpetual Crew that works during your turn only
  MTME: cast the alternate face directly — unique interaction with convert rules
```

## Definitive Conclusions

- **Living Metal** makes a Vehicle an artifact creature during the controller's turn (no crew needed).
- **Living Metal Vehicles can't block** during opponents' turns (they're not creatures then).
- **More Than Meets the Eye** casts the card already converted (alternate face) at an alternative cost.
- **Both mechanics are Transformers-specific** — only on Universes Beyond Transformer cards.
- Living Metal + attacks = powerful Vehicle threats without crew cost.

## Canonical Example
**Optimus Prime, Hero of Cybertron (Living Metal, MTME {3}{W}{W}):**
Normal cost: enters as vehicle (front face).
More Than Meets the Eye {3}{W}{W}: enters already transformed (robot mode — back face).
Back face: artifact creature with powerful abilities, enters with haste or ETB.
Living Metal: during your turn, even the front face is a creature → can attack.

**Example 2 — Living Metal + Vigilance:**
A Living Metal Vehicle that has vigilance:
During your turn: it's a creature with vigilance → attacks without tapping.
After combat: still untapped, still a creature (during your turn).
End of your turn → opponent's turn: no longer a creature (just an artifact).
The vigilance lets it "attack" and "block" in the same turn, but only during your own turn.
Wait: can it block during opponent's turn? Not as a creature. But the creature status from living metal only applies "during your turn."

## Commonly Confused With
- **P185 vs Crew (P058)** — Crew taps creatures to make a Vehicle a creature temporarily. Living Metal makes a Vehicle a creature automatically during your turn.
- **P133 (Daybound/Nightbound)** — D/N transforms based on spell cast counts. MTME transforms at casting via alternative cost.
- **P148 (Morph)** — Morph creates face-down creatures. MTME casts the converted face directly.
