---
id: p098
name: Double-Faced Cards — Transform, Convert, and Characteristics
category: zones
cr_refs: [712.1, 712.2, 712.4, 712.8, 613.7g]
tags: [double-faced, transform, convert, front-face, back-face, daybound, nightbound, timestamp, characteristics]
created: 2026-03-28
examples_count: 2
---

# P098 — Double-Faced Cards — Transform, Convert, and Characteristics

## Abstract
Double-faced cards (DFCs) have two faces. They can transform (flip to the other side) via abilities that say "transform" or "convert." A DFC on the battlefield shows one face up at a time. The permanent's characteristics are entirely from the currently-showing face — not a combination of both. Transforming gives the permanent a new timestamp. In zones other than the battlefield and stack, DFCs use the front face's characteristics. Copies of DFCs by default copy the front face.

## The Definitive Rule

**CR 712.2**: Double-faced cards have two faces: front (which can be cast) and back.

**CR 712.4**: A double-faced permanent's characteristics are based on its currently-showing face.

**CR 712.8**: Various ways DFCs transform: "transform," "convert," conditions (daybound/nightbound), and specific card abilities.

**CR 613.7g**: A double-faced permanent gets a new timestamp when it transforms or converts.

## The Pattern

```
DOUBLE-FACED CARD BASICS:
  Front face: can be cast normally (has a mana cost)
  Back face: no mana cost (usually); becomes the face-up side after transforming
  On the battlefield: shows one face at a time
  Characteristics: ONLY from the currently-visible face
    → If back face has no creature type, permanent is not a creature while back is up
    → If front face is green and back face is blue: is different color depending on face

TRANSFORMING:
  "Transform" = flip the card to show the other face
  Gains new timestamp (CR 613.7g): continuous effects applied in new timestamp order
  ETB/LTB don't trigger (the permanent didn't enter or leave — it just transformed)
  "Whenever [this] transforms" triggers DO fire
  The permanent is still the same object (no zone change, no new object)

ZONES OTHER THAN BATTLEFIELD:
  In hand/graveyard/library: use front face's characteristics
  (Back face has no mana cost; front face is the "playable" face)
  CMC in graveyard = front face CMC

COPIES OF DFCS:
  Default: copy = front face (since copying captures current characteristics)
  If copying a back-face-up DFC: copy is the back face, but can it transform?
    A token copy of a DFC that's showing its back face:
    Token is representing the back face; but tokens can't transform (no "other face")
    Actually: CR 712.xx says tokens created as copies can transform if conditions are met
    Complex interaction — for simple cases, assume copies of front-face are front-face

DAYBOUND/NIGHTBOUND (CR 702.145):
  Daybound: creature transforms when it becomes night (automatically)
  Nightbound: creature transforms when it becomes day
  These are automatic transforms (not via triggered abilities with timing windows)

TRANSFORMING IN RESPONSE:
  If a transform is a triggered ability: there's a priority window
    → Opponents can respond before the transform happens
  If a transform is a state-based action (daybound): no stack, no response
  If a transform is a special action: no stack, can't be countered

CAN'T TRANSFORM:
  "This permanent can't transform" overrides all transform attempts
  The daybound and nightbound abilities have built-in exceptions for their own ability
```

## Definitive Conclusions

- **A DFC's characteristics are entirely from its currently-showing face.** Not a combination.
- **Transforming gives a new timestamp.** Relevant for layer interactions.
- **ETB/LTB don't trigger on transform.** The permanent didn't enter or leave.
- **In zones other than battlefield, DFCs use front face characteristics.**
- **Copies of front-face-up DFCs copy the front face.** Whether they can transform depends on the copy rules.

## Canonical Example
**Huntmaster of the Fells (transforms between front/back on each player's turn):**
Front face: 2/2, ETB gains 2 life, creates Wolf token. Back face: 4/4, transforms at beginning of human opponent's upkeep, deals 2 damage to opponent when it transforms. When it transforms: no ETB (no zone change). New timestamp. Trigger "when [this] transforms" fires.

**Example 2 — Characteristics:**
Jace, Vryn's Prodigy (2/1 Human Wizard) transforms into Jace, Telepath Unbound (planeswalker). While showing Jace, Vryn's Prodigy: it's a creature. After transforming: it's a planeswalker (not a creature). If you cast an Aura targeting a creature on the stack then it transforms: Aura targets an illegal permanent (now a planeswalker, not a creature) → Aura fizzles → goes to graveyard.

## Commonly Confused With
- **P003 (Zone Change Identity)** — Transforming is NOT a zone change. The permanent is the same object. Zone change creates a new object; transform doesn't.
- **P016 (Phasing)** — Phasing is also not a zone change. But phasing out preserves the state of attached permanents; transforming changes characteristics.
