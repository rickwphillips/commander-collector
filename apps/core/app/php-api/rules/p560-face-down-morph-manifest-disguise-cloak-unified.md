---
id: p560
name: Face-Down Unified — Morph, Manifest, Disguise, Cloak Turn-Up Rules
category: zones
cr_refs: [708.1, 708.2, 708.2a, 708.3, 708.5, 708.6, 708.8, 708.9, 702.37, 702.37a, 702.37b, 702.37c, 702.37e, 702.168, 702.168a, 702.168d, 701.40, 701.40a, 701.40b, 701.58, 701.58a, 701.58b]
tags: [face-down, morph, megamorph, manifest, manifest-dread, disguise, cloak, turn-face-up, special-action, ward, 2/2, no-etb, reveal]
created: 2026-03-31
examples_count: 3
---

# P560 — Face-Down Unified — Morph, Manifest, Disguise, Cloak Turn-Up Rules

## Abstract

**Four mechanics create face-down 2/2 creatures: Morph, Manifest, Disguise, and Cloak.** All share the core rule that face-down permanents are 2/2 creatures with no name, no subtypes, and no mana cost (CR 708.2a). Morph and Manifest create face-downs with no text; Disguise and Cloak additionally grant Ward {2}. Turning face up is a special action that doesn't use the stack (no response window). ETB abilities do NOT trigger when turning face up (the permanent already entered). The key differences: Morph/Megamorph pay the morph cost to turn up; Manifest/Cloak pay the creature's mana cost to turn up (non-creatures can't turn up via this method); Disguise/Cloak grant Ward {2} while face-down. If a card has multiple face-down mechanics (e.g., morph + manifest), the controller may use EITHER turn-up method. Face-down cards must be revealed when they leave the battlefield. Instants and sorceries that are manifested or cloaked can never turn face up.

## The Definitive Rules

**CR 708.2a (Face-Down Characteristics):** *"If a face-up permanent is turned face down by a spell or ability that doesn't list any characteristics for that object, it becomes a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost."*

**CR 708.3 (No ETB):** *"Objects that are put onto the battlefield face down are turned face down before they enter the battlefield, so the permanent's enters-the-battlefield abilities won't trigger (if triggered) or have any effect (if static)."*

**CR 708.8 (Turn Face Up):** *"As a face-down permanent is turned face up, its copiable values revert to its normal copiable values. Any effects that have been applied to the face-down permanent still apply to the face-up permanent. Any abilities relating to the permanent entering the battlefield don't trigger when it's turned face up and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.9 (Reveal on Leave):** *"If a face-down permanent or a face-down component of a merged permanent moves from the battlefield to any other zone, its owner must reveal it to all players as they move it."*

**CR 702.37a (Morph):** *"'Morph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.37e (Morph Turn Up):** *"Any time you have priority, you may turn a face-down permanent you control with a morph ability face up. This is a special action; it doesn't use the stack. To do this, show all players what the permanent's morph cost would be if it were face up, pay that cost, then turn the permanent face up."*

**CR 702.168a (Disguise):** *"'Disguise [cost]' means 'You may cast this card as a 2/2 face-down creature with ward {2}, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 701.40a (Manifest):** *"To manifest a card, turn it face down. It becomes a 2/2 face-down creature card with no text, no name, no subtypes, and no mana cost. Put that card onto the battlefield face down."*

**CR 701.40b (Manifest Turn Up):** *"Any time you have priority, you may turn a manifested permanent you control face up. This is a special action that doesn't use the stack. To do this, show all players that the card representing that permanent is a creature card and what that card's mana cost is, pay that cost, then turn the permanent face up."*

**CR 701.58a (Cloak):** *"To cloak a card, turn it face down. It becomes a 2/2 face-down creature card with ward {2}, no name, no subtypes, and no mana cost. Put that card onto the battlefield face down."*

**CR 701.40g (Manifested Instant/Sorcery Can't Turn Up):** *"If a manifested permanent that's represented by an instant or sorcery card would turn face up, its controller reveals it and leaves it face down. Abilities that trigger whenever a permanent is turned face up won't trigger."*

**CR 701.58g (Cloaked Instant/Sorcery Can't Turn Up):** Same rule applies to cloaked instants and sorceries — they cannot turn face up via the cloak turn-up method.

## The Pattern

```
FACE-DOWN MECHANICS COMPARISON:

  ┌─────────────┬──────────┬──────────┬──────────┬──────────┐
  │             │  MORPH   │ MANIFEST │ DISGUISE │  CLOAK   │
  ├─────────────┼──────────┼──────────┼──────────┼──────────┤
  │ Cast cost   │ {3}      │ N/A      │ {3}      │ N/A      │
  │ How enters  │ Cast     │ Put OTB  │ Cast     │ Put OTB  │
  │ Face-down   │ 2/2      │ 2/2      │ 2/2      │ 2/2      │
  │ Ward {2}    │ No       │ No       │ YES      │ YES      │
  │ Turn-up via │ Morph $  │ Mana $   │ Disguise │ Mana $   │
  │ Non-creature│ N/A      │ Can't    │ N/A      │ Can't    │
  │   turn up   │          │ turn up  │          │ turn up  │
  │ Megamorph   │ +1/+1    │ N/A      │ N/A      │ N/A      │
  │   counter   │ on flip  │          │          │          │
  └─────────────┴──────────┴──────────┴──────────┴──────────┘

  CAST face-down (Morph/Disguise):
    - Pay {3} as alternative cost → 2/2 face-down creature on stack
    - Can be countered (it's a spell on the stack)
    - When it resolves: enters battlefield face-down
    - Only works with cards that HAVE morph/disguise ability

  PUT onto battlefield face-down (Manifest/Cloak):
    - Not cast → can't be countered
    - Goes directly to battlefield from library/hand/etc.
    - Works with ANY card (creature, instant, sorcery, land, etc.)

UNIVERSAL FACE-DOWN RULES:

  All face-down permanents share:
    - 2/2 creature with no name, no subtypes, no mana cost
    - Morph/Manifest: no text (no abilities)
    - Disguise/Cloak: ward {2} (this IS text/ability on the face-down)
    - MV = 0 (no mana cost → MV 0)
    - Controller may look at it at any time (708.5)
    - Other players may NOT look at it
    - Must be distinguishable from other face-down permanents (708.6)
    - Must be revealed when leaving the battlefield (708.9)
    - ETB abilities DO NOT trigger on face-down entry (708.3)
    - ETB abilities DO NOT trigger when turning face up (708.8)
    - Continuous effects on the face-down permanent persist after turning up

TURNING FACE UP — THE SPECIAL ACTION:

  All turn-up methods share:
    - Special action (doesn't use the stack)
    - Cannot be responded to
    - Requires priority
    - No ETB triggers fire

  MORPH turn-up (702.37e):
    1. Show all players the morph cost
    2. Pay the morph cost
    3. Turn face up
    - Only works if the card HAS morph

  MEGAMORPH turn-up (702.37b):
    1-3. Same as morph
    4. Put a +1/+1 counter on it (if megamorph cost was paid)

  DISGUISE turn-up (702.168d):
    1. Show all players the disguise cost
    2. Pay the disguise cost
    3. Turn face up
    - Only works if the card HAS disguise

  MANIFEST turn-up (701.40b):
    1. Reveal that the card IS a creature card and show its mana cost
    2. Pay that mana cost
    3. Turn face up
    - FAILS if card is not a creature card
    - FAILS if card has no mana cost (e.g., land card)

  CLOAK turn-up (701.58b):
    1. Reveal that the card IS a creature card and show its mana cost
    2. Pay that mana cost
    3. Turn face up
    - FAILS if card is not a creature card
    - FAILS if card has no mana cost

CROSS-MECHANIC TURN-UP:

  A manifested card with MORPH can turn up via either method:
    - Pay morph cost (702.37e) OR pay mana cost (701.40b)
    - Player chooses which method (701.40c)

  A manifested card with DISGUISE can turn up via either method:
    - Pay disguise cost (702.168d) OR pay mana cost (701.40b)
    - Player chooses which method (701.40d)

  A cloaked card with MORPH can turn up via either method:
    - Pay morph cost (702.37e) OR pay mana cost (701.58c)

  A cloaked card with DISGUISE can turn up via either method:
    - Pay disguise cost (702.168d) OR pay mana cost (701.58d)

  This is important: a manifested/cloaked non-creature card with morph/disguise
  CAN turn face up (using the morph/disguise cost), even though the manifest/cloak
  turn-up method would fail (not a creature card).

INSTANTS AND SORCERIES FACE-DOWN:

  Instants/sorceries can be manifested or cloaked (they're cards):
    - They enter as 2/2 face-down creatures (valid)
    - They CANNOT turn face up via manifest/cloak (not creature cards)
    - If they WOULD turn face up: reveal and leave face down (701.40g)
    - "Whenever a permanent is turned face up" does NOT trigger
    - They're stuck face-down unless they have morph/disguise

  Exception: If an instant/sorcery somehow has morph or disguise
  (extremely rare), it can turn up via that method.

LANDS FACE-DOWN:

  Lands can be manifested or cloaked:
    - Enter as 2/2 face-down creatures
    - Cannot turn face up via manifest/cloak (no mana cost)
    - Stuck face-down unless they have morph (no lands currently do)

EFFECTS THAT PERSIST:

  When a face-down permanent turns face up (708.8):
    - Copiable values revert to normal
    - All continuous effects that applied to the face-down permanent
      CONTINUE to apply to the face-up permanent
    - +1/+1 counters remain
    - Auras remain attached (check legality after face-up)
    - Equipment remains attached
    - "Until end of turn" effects continue

  Example: Opponent gives your face-down creature -2/-2 until end of turn.
    Face-down: 2/2 → 0/0 (would die to SBA)
    If you turn it up in response (special action, no stack):
      Face-up creature gets -2/-2 applied to its real P/T

COPYING FACE-DOWN PERMANENTS:

  Copying a face-down permanent copies its face-down characteristics:
    - 2/2, no name, no text, no subtypes, no mana cost
    - The copy does NOT copy the actual card underneath
    - The copy CANNOT turn face up (no morph/disguise/manifest/cloak ability)
    - See P542 for details

WARD {2} ON DISGUISE/CLOAK:

  Disguise and Cloak grant Ward {2} while face down:
    - Opponents must pay {2} when targeting the face-down creature
    - Ward triggers independently per targeting spell/ability
    - Ward is lost when the permanent turns face up (unless the face-up
      card also has ward)
    - See P553 for Ward mechanics
```

## Definitive Conclusions

- **All face-down permanents are 2/2 with MV 0** — regardless of the actual card.
- **Turning face up is a special action** — doesn't use the stack, can't be responded to.
- **No ETB triggers on face-down entry OR turn-up** — the permanent already entered the battlefield.
- **Disguise and Cloak grant Ward {2}** — Morph and Manifest do not.
- **Cross-mechanic turn-up works** — a manifested morph card can use either turn-up method.
- **Instants/sorceries can't turn up** — stuck face-down unless they have morph/disguise.
- **Effects persist through turn-up** — +1/+1 counters, continuous effects, Auras all carry over.
- **Must reveal when leaving** — face-down cards are revealed to all when they leave the battlefield.

## Canonical Example

**Morph Cast and Turn Up:**

You cast a card with morph for {3} face-down. It enters the battlefield as a 2/2. Later, during your main phase (you have priority), you pay its morph cost and turn it face up. This is a special action — opponent cannot respond. The permanent is now face-up with its real characteristics. No ETB triggers fire.

**Example 2 — Manifest a Non-Creature:**

An effect manifests the top card of your library. It's Lightning Bolt (instant). It enters the battlefield as a 2/2 face-down creature with no name, no text, MV 0. You control a 2/2 that can attack and block.

You cannot turn it face up via manifest's method (Lightning Bolt is not a creature card). If Lightning Bolt had morph (hypothetically), you could turn it up via morph instead. Otherwise, it stays face-down. If it dies, you reveal Lightning Bolt to all players.

**Example 3 — Cloaked Card with Disguise:**

An effect cloaks a card from your library. It happens to be a creature with disguise. The card enters as a 2/2 face-down creature with Ward {2} (from cloak).

You have two options to turn it face up:
1. Pay its mana cost (cloak turn-up method — show it's a creature card)
2. Pay its disguise cost (disguise turn-up method — show the disguise cost)

Either way, it's a special action. You choose whichever is cheaper or more convenient. After turning face up, Ward {2} from cloak is gone (unless the face-up card also has ward).

## Commonly Confused With

- **P542 (Face-Down Token Copy)** — P542 covers copying face-down tokens; P560 covers the unified face-down mechanic system.
- **P549 (Manifest Dread)** — P549 covers Manifest Dread's specific mill-and-manifest variant; P560 covers the general manifest/morph/disguise/cloak framework.
- **P553 (Ward)** — P553 covers Ward triggers and stacking; P560 notes that Disguise/Cloak grant Ward {2} while face-down.
