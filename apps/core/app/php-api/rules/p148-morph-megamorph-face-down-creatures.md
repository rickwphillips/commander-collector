---
id: p148
name: Morph and Megamorph — Face-Down Creatures
category: zones
cr_refs: [702.37a, 702.37b, 702.37c, 702.37e, 702.37f]
tags: [morph, megamorph, face-down, 2/2, turn-face-up, special-action, no-name, no-text, copiable-values, onslaught, khans]
created: 2026-03-28
examples_count: 2
---

# P148 — Morph and Megamorph — Face-Down Creatures

## Abstract
Morph lets you cast any card with morph face-down for {3} as a 2/2 creature with no text, no name, no subtypes, and no mana cost. At any time you have priority, you can turn it face up by paying its morph cost — a special action (no stack). Megamorph is the same but adds a +1/+1 counter when turned face up via its megamorph cost. This creates strategic bluffing: opponents don't know what face-down creature you're hiding. The face-down permanent is a *new object* with its own characteristics; copiable values are the 2/2 blank creature, not the actual card.

## The Definitive Rules

**CR 702.37a** (verbatim): *"Morph is a static ability that functions in any zone from which you could play the card it's on, and the morph effect works any time the card is face down. 'Morph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.37b** (verbatim): *"Megamorph is a variant of the morph ability. 'Megamorph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost' and 'As this permanent is turned face up, put a +1/+1 counter on it if its megamorph cost was paid to turn it face up.' A megamorph cost is a morph cost."*

**CR 702.37e** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a morph ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's morph cost would be if it were face up, pay that cost, then turn the permanent face up. (If the permanent wouldn't have a morph cost if it were face up, it can't be turned face up this way.) The morph effect on it ends, and it regains its normal characteristics. Any abilities relating to the permanent entering the battlefield don't trigger when it's turned face up and don't have any effect, because the permanent has already entered the battlefield."*

## The Pattern

```
MORPH:
  Alternative cast: pay {3} instead of mana cost → enters as face-down 2/2 creature
  Face-down characteristics:
    - No name
    - No text (no abilities)
    - No subtypes
    - No mana cost (CMC = 0 while face-down)
    - 2/2 (fixed)
  Copiable values: 2/2 with no text, name, etc. (NOT the actual card's characteristics)

  TURNING FACE-UP:
    Special action: no stack, at any time you have priority
    Pay the morph cost → turn face up instantly (can't be responded to at the moment of turning)
    BUT: triggered abilities that trigger OFF turning face up DO trigger (and go on stack)
    "When [cardname] is turned face up" abilities FIRE when turned face up
    ETB abilities DO NOT trigger again (already on battlefield)

  MORPH + CLONE:
    If you copy a face-down morph: copy of the 2/2 blank creature
    Copy doesn't have morph, can't be turned face up the normal way
    The copied object is a 2/2 permanent

  MORPH + FACE-DOWN TRICK:
    All opponents' face-down morphs look identical: all 2/2 with no text
    You don't know what any face-down creature is
    Strategic: use face-down as a blocker, turn face up for a surprise ETB or combat trick

  MORPH + EXILE (face-down):
    If a face-down permanent would be exiled, its owner must show it to all players
    End of game: all face-down permanents revealed
    Can't bluff to the grave — must reveal if it leaves the battlefield while face-down

  MEGAMORPH:
    Same as morph, but adds a +1/+1 counter when turned face up via megamorph cost
    The counter only applies if you paid the MEGAMORPH cost (not if turned face up some other way)
    Example: Deathmist Raptor (Megamorph {4}{G})
      - Cast face-down for {3}: enters as 2/2
      - Pay {4}{G}: turn face up → becomes Deathmist Raptor + gets +1/+1 counter
      - Deathmist Raptor: "when a permanent you control is turned face up, return Deathmist Raptor from graveyard to battlefield face-down"

  MORPH + CMC:
    Face-down morph has CMC = 0 (no mana cost)
    If it's face-up: CMC is the face-up CMC
    This matters for effects like "target creature with CMC 3 or less"

  MORPH + PROTECTION:
    While face-down: no color, no creature type → "protection from all colors" doesn't stop removal if the spell doesn't check color
    If face-up: normal protections apply

  MORPH + MANIFEST (related, see P###):
    Manifest also creates face-down creatures (from library)
    Manifest creatures can be turned face up by paying their mana cost
    But only if they're creatures! Non-creatures manifested can't be flipped up
    Morph cards manifested: can use their morph cost OR face-up mana cost to turn up
```

## Definitive Conclusions

- **Morph casts face-down for {3}** — a 2/2 with no text, name, subtypes, or abilities.
- **Turning face-up is a special action** — no stack, no responses, but triggered abilities from the flip DO fire.
- **ETB abilities don't re-trigger** when turning face up — the permanent is already on the battlefield.
- **Copiable values of a face-down morph are the 2/2 blank** — copies can't turn face up normally.
- **Megamorph adds a +1/+1 counter** when turned up via its megamorph cost.
- **All face-down permanents must be revealed when they leave the battlefield** — no bluffing through death.

## Canonical Example
**Brine Elemental (Morph {5}{U}{U}):**
Cast face-down for {3}. A 2/2 with no text. Opponent doesn't know what it is.
At any time you have priority: pay {5}{U}{U} → turn Brine Elemental face up (no stack).
"When Brine Elemental is turned face up, each opponent skips their next untap step."
Triggered ability goes on the stack and resolves → opponents skip their untap step. Brutal tempo.

**Example 2 — Deathmist Raptor (Megamorph {4}{G}):**
Cast face-down for {3}. A 2/2 face-down.
Pay {4}{G} to turn face up: Deathmist Raptor gets +1/+1 counter (from megamorph), becomes a 4/4 Dinosaur.
Another face-down permanent turns face up → "Whenever a permanent you control is turned face up, if Deathmist Raptor is in your graveyard, return it to the battlefield face-down."
Deathmist Raptor keeps coming back as long as face-down permanents are flipping.

## Commonly Confused With
- **P123 (Disturb)** — Disturb casts from the graveyard face up (transformed). Morph casts from hand face down.
- **P148 vs Manifest** — Manifest creates face-down creatures from the library (any card, not just morph cards). Different flip conditions.
- **P131 (Impending)** — Impending enters with time counters and is not a creature until they're removed. Morph is immediately a creature (a 2/2), just with no text.
