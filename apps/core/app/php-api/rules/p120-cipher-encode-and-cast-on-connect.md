---
id: p120
name: Cipher — Encode on Creature, Cast on Connect
category: stack
cr_refs: [702.99a, 702.99b, 702.99c, 702.99d]
tags: [cipher, encode, connect, exile, creature, cast, copy, combat-damage, unblocked]
created: 2026-03-28
examples_count: 2
---

# P120 — Cipher — Encode on Creature, Cast on Connect

## Abstract
Cipher is a two-phase keyword. First, when the spell resolves, you may exile it encoded on a creature you control — the spell goes to exile attached to that creature. Second, whenever that creature deals combat damage to a player, you may cast a copy of the encoded spell for free. Cipher turns a one-shot spell into a repeatable effect that triggers on combat hits. The key: it only triggers when the encoded creature deals combat damage to a PLAYER (not a planeswalker or other creature). If the creature dies or is exiled, the cipher card stays in exile but no longer triggers.

## The Definitive Rule

**CR 702.99a** (verbatim): *"Cipher appears on some instants and sorceries. It represents two abilities. The first is a spell ability. The second is a triggered ability. 'Cipher' means 'Then you may exile this spell card encoded on a creature you control' and 'Whenever encoded creature deals combat damage to a player, its controller may cast a copy of the encoded card without paying its mana cost.'"*

## The Pattern

```
CIPHER PHASE 1 — ENCODING:
  When the cipher spell resolves:
  "You may exile this spell card encoded on a creature you control"
  Optional: "you may" → can choose not to encode (spell goes to graveyard)
  Choose a creature you control → the card goes to exile "encoded on" that creature

ENCODED STATE:
  The cipher card is in exile, attached to the creature
  The creature's controller can look at the encoded card
  Multiple cipher cards can be encoded on the same creature
  The card in exile retains its identity (for copy purposes)

CIPHER PHASE 2 — TRIGGERING:
  Whenever the encoded creature deals combat damage to a player:
    Its controller may cast a copy of the encoded card without paying its mana cost
  ONLY triggers on combat damage to players (not planeswalker, not creatures)
  EACH hit to a player can trigger the cast (not just once)

CREATURE DIES / LEAVES BATTLEFIELD:
  If the encoded creature leaves the battlefield:
    The cipher trigger no longer fires
    The encoded card remains in exile
    It doesn't move back to hand or graveyard
    It's just stuck in exile (unless another effect retrieves it)

COPYING THE CIPHER CAST:
  The copy from cipher can have new targets chosen
  The copy is cast → goes on the stack → can be countered
  Casting the copy doesn't re-cipher (the cipher card stays in exile)

CIPHER + MULTIPLE DAMAGE:
  If the creature deals combat damage to multiple players simultaneously (multiplayer):
    One trigger per player dealt damage to
    (Each is a separate trigger — one cipher cast per player damage event)

CIPHER + SPLIT SECOND:
  Casting the copy from cipher uses the stack → split second applies
  Can't trigger and cast if split second is on the stack

ENCODING ON AN UNBLOCKABLE CREATURE:
  Maximum value: encode on a creature that reliably connects
  Shadow, flying, menace reduction, unblockable all increase cipher utility
```

## Definitive Conclusions

- **Cipher encodes in exile on a creature you control at spell resolution (optional).**
- **Triggers on combat damage to a player** — not planeswalkers, not creatures.
- **Each hit can trigger a free cast of the encoded spell.**
- **Creature leaving battlefield doesn't return the encoded card** — it stays in exile.
- **Encoding is optional** — you can let the spell go to the graveyard instead.

## Canonical Example
**Hidden Strings (Cipher):**
Hidden Strings resolves: "untap two target permanents." Then encode on your 1/1 unblockable creature.
Next turn: creature deals combat damage → cast Hidden Strings copy for free → untap two more permanents.
Repeat every turn the creature connects.

**Example 2 — Cipher creature dies:**
Encoded a cipher card on 2/2. Opponent destroys the 2/2.
The cipher card stays in exile — permanently stuck. You don't get the trigger anymore.

## Commonly Confused With
- **P099 (Modal Spells)** — Cipher creates copies of the original spell; the copy follows the same targeting rules.
- **P046 (Flashback)** — Flashback is also cast from exile/graveyard. But flashback exiles on resolution; cipher's copy is cast repeatedly.
- **P003 (Zone Change Identity)** — The cipher card in exile is the original card, still exiled on the creature.
