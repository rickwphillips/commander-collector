---
id: p470
name: Cloak, Manifest Dread, and Time Travel — Face-Down-with-Ward, Manifest-from-Top-Two, and Time-Counter Increment
category: zones
cr_refs: [701.58, 701.56, 701.55, 707.2, 707.5, 702.26d, 603.2, 400.7]
tags: cloak, manifest-dread, time-travel, keyword-action, face-down, ward-2, top-two-manifest, time-counter, march-of-the-machine, murders-karlov-manor, doctor-who
created: 2026-03-29
examples_count: 6
---

# P470 — Cloak, Manifest Dread, and Time Travel — Face-Down-with-Ward, Manifest-from-Top-Two, and Time-Counter Increment

## Abstract

Three keyword actions from recent sets (2023–2024) with specific rules interactions: **Cloak** (CR 701.58, March of the Machine) puts a card onto the battlefield face-down with ward 2 as a 2/2 creature — a variant of Manifest that adds protection; **Manifest Dread** (CR 701.56, Murders at Karlov Manor) puts the top two cards of your library face-down as a 2/2 creature, and you may look at the bottom of the two face-down cards; and **Time Travel** (CR 701.55, Doctor Who) adds one time counter to each permanent with a time counter on it AND each suspended card in exile with a time counter. All three interact with face-down mechanics, manifest rules, and the time-counter / suspend system in non-obvious ways.

## The Definitive Rules

### Cloak (CR 701.58)
**CR 701.58a verbatim:** *"To cloak a card, put it onto the battlefield face down as a 2/2 colorless creature with ward 2 (whenever this creature becomes the target of a spell or ability an opponent controls, counter it unless that player pays {2}). It has no other characteristics."*

Cloak is like Manifest but the resulting face-down creature has Ward 2. The face-down card is still a 2/2 colorless creature, and like Manifest, if the face-down card is a creature card, the controller may pay its mana cost to turn it face up. The Ward 2 protection means opponents must pay {2} each time they target the cloaked creature with a spell or ability.

### Manifest Dread (CR 701.56)
**CR 701.56a verbatim:** *"To manifest dread, look at the top two cards of your library, put one of them onto the battlefield face down as a 2/2 colorless creature, and put the other into your graveyard. If a permanent enters the battlefield this way, it's manifested."*

Manifest Dread differs from regular Manifest: you look at TWO cards and choose one to face-down manifest and one to put in the GY. The other card is not put back to library — it goes to GY.

### Time Travel (CR 701.55)
**CR 701.55a verbatim:** *"To time travel, put a time counter on each permanent with a time counter on it and on each card in exile with a time counter on it."*

Time Travel adds one time counter to EVERY permanent and every suspended card in exile that already has a time counter. This simultaneously advances all suspended cards and all "clock" permanents (Vanishing, Age counters on Sagas, etc.).

## The Pattern

```
CLOAK pattern:
Result: Face-down 2/2 colorless creature with ward 2
  → Unlike manifest: has WARD 2 (opponents must pay {2} to target it)
  → Like manifest: can be turned face up by paying the mana cost if it's a creature card
  → Like manifest: turn-up is a special action (not a spell, doesn't use the stack)
  → Ward 2 applies to TARGETING by opponents — doesn't protect against untargeted effects
    (Wrath of God kills it; it doesn't require targeting)
  → Ward 2 is on the face-down permanent; once turned face up, the card's own abilities apply
    (if the turned-up card has ward, that ward takes over; if not, ward disappears on flip)
    Wait: CR 708 — face-up cards use their actual characteristics; ward was on the face-down state
    → Actually: ward 2 is a rule for "face-down permanents put there by cloak"
    → When flipped face-up, the card's printed characteristics replace the 2/2 template
    → Ward 2 is no longer on the permanent after flip (unless the card itself has ward)
  → Cloaking a non-creature card: it's a 2/2 face-down creature on battlefield
    → Can't be turned face up (only creature cards can be turned face up via manifest)
    → Stays as 2/2 forever (until removed)
  → Multiple cloak effects: each creates one separate 2/2 face-down creature

MANIFEST DREAD pattern:
"Look at top 2 cards of your library:
  1. Put one face down onto the battlefield as a 2/2 colorless creature (manifested)
  2. Put the other into your graveyard"
  → The face-down permanent is "manifested" (same rules as manifest)
  → The GY card is not put on the bottom of the library — it goes directly to GY
  → If your library has only 1 card: you can still manifest dread — put that card face-down,
    nothing goes to GY (only one card available)
  → If your library is empty: manifest dread does nothing (can't look at 0 cards)
  → The graveyard card: triggers "cards entering the graveyard" effects
    → Cards with flashback/escape/dredge in the GY are accessible
    → Morbid can activate from the manifest dread GY card if it's a creature card
    → Wait: the card going to GY is the "other" card, not a dying creature —
      Morbid needs a creature to "die" (go from battlefield to GY); this card goes
      from library to GY directly (not dying from battlefield) → does NOT satisfy Morbid
  → The face-down manifested creature: rules as normal manifest (CR 707.2)
  → The GY discard: can trigger threshold/delirium (adds permanent card to GY)

TIME TRAVEL pattern:
"Put a time counter on each permanent with a time counter AND each suspended card in exile."
  → Affects ALL permanents that already have time counters (not just yours):
    → Your Sagas get age counters advanced
    → Your suspended cards get advanced toward casting
    → Opponent's Vanishing permanents get TIME counters (speeding their demise)
    → Opponent's suspended cards also get advanced
  → This is symmetric AND all-encompassing: anything with a time counter gets +1
  → Key cards affected:
    → Suspended cards in exile: each time travel = one less turn before they cast
    → Sagas (which use "lore counters" — are lore counters the same as time counters?
      NO: Sagas use "lore counters," not "time counters" per CR 714.2. Time travel does
      NOT affect Sagas)
    → Vanishing permanents: time counters on vanishing = one more counter (keeping them alive longer
      — wait, vanishing REMOVES counters at upkeep; adding a counter EXTENDS the permanent's life)
    → Actually: Vanishing removes time counters. More time counters = longer life.
      Time Travel HELPS your Vanishing permanents by adding counters.
  → Time Travel DOES affect Vanishing permanents with time counters
  → Time Travel DOES affect suspended cards in exile
  → Time Travel does NOT affect Sagas (lore counters ≠ time counters)
  → Time Travel DOES affect charge counters? NO — "time counters" specifically;
    charge counters are a different counter type
```

## Definitive Conclusions

**Cloak:**
- Cloak's Ward 2 makes it harder for opponents to remove via targeted removal — Doom Blade targeting a cloaked creature costs the opponent {2} extra. Against aggressive decks with limited mana, ward 2 can effectively protect the manifest.
- After flipping a Cloaked creature face-up, Ward 2 is gone (unless the creature's own printed text has ward). The Ward 2 is a property of the face-down state only.
- A non-creature cloaked card is permanent 2/2 protection: it can NEVER be flipped face-up legitimately (only creature cards can flip via manifest rules), so it remains a 2/2 with Ward 2 indefinitely.
- Key cards: Many March of the Machine and Doctor Who cards use Cloak as an alternative to Manifest.

**Manifest Dread:**
- The key difference from Manifest: the "other" card goes to the GY, not back to the library. This is a significant GY-filling effect that supports Threshold, Delirium, Undergrowth, and escape/flashback strategies.
- In a GY synergy deck, manifest dread is better than manifest: you get a creature AND a GY card for free.
- Key card: *Undercity Sewers* (MKM) and other Karlov Manor cards use manifest dread. The face-down permanent is a solid 2/2 blocker plus the GY fill is free value.

**Time Travel:**
- Time Travel is powerful because it advances ALL time-counter mechanics simultaneously for ALL players. In Doctor Who Commander decks, this means your suspended Daleks or suspended spells come online faster, but so do opponents'.
- Time Travel with Vanishing permanents: adding a time counter to a Vanishing creature extends its life by one full turn (since Vanishing removes one counter at upkeep). Opponents using Vanishing creatures: Time Travel also extends THEIR creatures' lives.
- Time Travel does NOT advance Sagas (wrong counter type). A common mistake is assuming "time travel advances my Sagas."
- Key card: *The Thirteenth Doctor* (WHO): Has a Time Travel ability. Running the Doctor in a suspended cards deck means every time the ability triggers, all your suspended cards come 1 turn closer.

## Canonical Examples

**Cloak:**
- A cloaked card from *Blighted Burgeoning* (MOM) or similar: 2/2 creature token with Ward 2. Opponent needs {2} to target it with removal.

**Manifest Dread:**
- Cast a manifest dread spell, look at top 2: one is a land (goes to GY for descend/nothing), one is a Baneslayer Angel (face-down 2/2, flip for {3}{W}{W} later). Both cards are accounted for.

**Time Travel:**
- 3 suspended cards in exile, each with 3 time counters: Time Travel → each gets +1 time counter → now 4 each. This actually DELAYS them by one turn if they were about to cast (they need to go to 0... wait, suspend removes counters at upkeep, casts when they reach 0). Time Travel ADDS a counter → one MORE turn to wait.
- That's correct: if a suspended card has 1 time counter left, it would cast next upkeep. Time Travel adds 1 counter → now 2 → needs one more upkeep → delayed by 1 turn.
- This creates a non-obvious interaction: Time Travel can DELAY your own suspended cards. Use it when you want to hold back a spell.

## Commonly Confused With

- **P413** (Morph/Megamorph) — Morph is cast face-down as part of casting; Cloak and Manifest Dread put cards from other zones (library) face-down; different entry mechanisms but similar face-down permanent rules
- **P417** (Suspend/Vanishing) — Time Travel directly interacts with Suspend (advancing) and Vanishing (extending); these mechanics are deeply intertwined
- **P098** (DFC/Transform) — Face-down permanents from Cloak/Manifest are not the same as DFCs; face-down permanents flip via paying mana cost (special action), not via transform
- **P461** (Threshold/Metalcraft/Delirium) — Manifest Dread fills the GY, helping all three count conditions; the GY card from Manifest Dread counts toward Threshold/Delirium
