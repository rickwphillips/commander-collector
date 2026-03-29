---
id: p186
name: Disguise — Face-Down Creature with Ward 2
category: zones
cr_refs: [702.168a, 702.168b, 702.168c, 702.168d]
tags: [disguise, face-down, ward-2, 2/2, turn-face-up, special-action, Murders-Karlov-Manor, Outlaws-Thunder-Junction]
created: 2026-03-28
examples_count: 2
---

# P186 — Disguise — Face-Down Creature with Ward 2

## Abstract
Disguise is morph's updated version with a key upgrade: while face-down with disguise, the creature has Ward {2}. Like morph, you cast the card face-down for {3} as a 2/2 with no text, name, or subtypes — but this 2/2 has Ward {2} while face-down, making it harder to target cheaply. Turn face-up at any time you have priority by paying the disguise cost (special action, no stack). ETB triggers don't re-fire when turning face up (already on battlefield). The Ward {2} discourages opponents from spending removal on an unknown face-down creature.

## The Definitive Rules

**CR 702.168a** (verbatim): *"Disguise is a static ability that functions in any zone from which you could play the card it's on, and the disguise effect works any time the card is face down. 'Disguise [cost]' means 'You may cast this card as a 2/2 face-down creature with ward {2}, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.168d** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a disguise ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's disguise cost would be if it were face up, pay that cost, then turn the permanent face up."*

## The Pattern

```
DISGUISE:
  Same as morph, with key difference: face-down creature has Ward {2}
  Cast face-down for {3}: enters as 2/2 with Ward {2}, no name, no text, no subtypes

  DISGUISE VS MORPH:
    Morph: 2/2 face-down with no abilities
    Disguise: 2/2 face-down WITH Ward {2}
    Ward {2} applies WHILE face-down, not just on the original card
    This is the copiable value for the face-down state: 2/2 with Ward {2}

  DISGUISE + WARD {2}:
    Any time an opponent targets the face-down disguise creature with a spell or ability:
    Ward triggers: opponent must pay {2} or the targeting spell/ability is countered
    Removal targeting the face-down: must pay an extra {2}
    This makes casually killing face-down creatures more expensive

  DISGUISE + TURN FACE UP:
    Special action: show disguise cost, pay it, turn face up
    No stack, no response window (but triggered abilities from turning up DO trigger)
    ETB abilities: don't trigger (permanent already on battlefield)
    "When this is turned face up" abilities: DO trigger

  DISGUISE + COPIABLE VALUES:
    While face-down: copiable values are 2/2, Ward {2}, no name, no text, no subtypes
    A copy of a face-down disguise creature: 2/2 with Ward {2}

  DISGUISE + MULTIPLE FACE-DOWN:
    All opponents' disguise face-down creatures look identical: 2/2 with Ward {2}
    Bluffing: disguise a bad card to represent a threat (Ward {2} adds credibility)
    Opponents know it has Ward {2} but not what it is

  DISGUISE + MANIFEST:
    Manifest creates face-down creatures too (from library)
    Manifested cards are NOT disguise cards (unless the underlying card has disguise)
    Manifested cards don't have Ward {2} (only disguise cards do when face-down)

  DISGUISE CARDS (Murders at Karlov Manor, Outlaws of Thunder Junction):
    Many creatures with powerful "when turned face up" abilities
    Disguise {cost}: typically a significant mana cost to reveal
    The Ward {2} protection makes them worth investing into
```

## Definitive Conclusions

- **Disguise is morph with Ward {2}** while face-down — costs opponents extra to target.
- **Cast face-down for {3}** as a 2/2 with Ward {2} and no other characteristics.
- **Turning face-up is a special action** — no stack, no responses, but flip triggers still fire.
- **ETB abilities don't re-trigger** when turned face up.
- **Ward {2} discourages cheap removal** on unknown face-down threats.

## Canonical Example
**Eriette of the Charmed Apple (Disguise {3}{B}, turns up as a 4/4 or something powerful):**
Cast face-down for {3}. Opponent considers removing it.
Using Doom Blade: must pay {2} extra (Ward {2}) or Doom Blade is countered.
Opponent doesn't want to pay {2} to kill an unknown creature.
Pay disguise cost later: turn face up → powerful ability triggers.

**Example 2 — Disguise Bluff:**
You have an Eriette of the Charmed Apple face-down (worth turning up) and a weak card with disguise (not worth the reveal cost).
Cast both face-down. Opponent doesn't know which is which.
Both have Ward {2}: each removal targeting them costs {2} extra.
Opponent may not want to spend resources targeting either.
When ready: turn up the good one, keep the bad one face-down as a blocker.

## Commonly Confused With
- **P148 (Morph/Megamorph)** — Morph enters as 2/2 with NO abilities. Disguise enters as 2/2 WITH Ward {2}. Otherwise identical mechanics.
- **P103 (Hexproof)** — Hexproof prevents all targeting. Ward {2} just makes targeting cost {2} extra. Opponents CAN target, just have to pay.
- **P131 (Impending)** — Impending enters with time counters, not face-down. Different delay mechanism.
