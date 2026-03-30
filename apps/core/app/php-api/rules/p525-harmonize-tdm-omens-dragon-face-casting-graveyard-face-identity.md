---
id: p525
name: Harmonize (TDM) + Omens (TDM) — Dragon Face Casting from Graveyard, Face Identity, and Mana Value
category: cross-mechanic
cr_refs: [702.180a, 708.4, 601.2b]
tags: [harmonize, omen, graveyard-cast, alternative-cost, dragon-face, face-identity, mana-value, tarkir-dragonstorm, TDM, double-faced-cards]
created: 2026-03-30
examples_count: 3
---

# P525 — Harmonize (TDM) + Omens (TDM) — Dragon Face Casting from Graveyard, Face Identity, and Mana Value

## Abstract
**Harmonize** allows casting a card from the graveyard as an alternative cost. **Omens** are double-faced cards with a Dragon creature face and an instant/sorcery Omen face. The critical rules question: can you cast an Omen card's Dragon face using Harmonize from the graveyard? **Yes.** The Omen card is always a creature card in the graveyard (Dragon identity), so it's a legal target for Harmonize. When cast via Harmonize as the Dragon face, the cost is the Dragon's mana cost, and the spell is a creature spell with the Dragon's characteristics. The Omen face is completely ignored (you're not casting it as an Omen). The card's mana value on the stack is the Dragon face's cost, not the Omen's cost. The spell is exiled after use (as all Harmonize casts are). This creates a powerful graveyard synergy: discard an Omen Dragon, cast it later via Harmonize for a discounted creature spell.

## The Definitive Rules

**CR 702.180a (Harmonize):** *"Harmonize represents three static abilities... 'You may cast this card from your graveyard by paying [cost] and tapping a creature.'" — Harmonize allows casting any card that can legally be cast from the graveyard.

**CR 708.4 (Double-Faced Cards — Zone Identity):** *"An omen card is a creature card in every zone except the stack."* When an Omen card is in the graveyard, it is a creature card. Harmonize sees it as a creature card and allows casting it.

**Omen Casting Rule (per P512 and official rulings):** *"When casting a spell as an Omen, use the alternative characteristics and ignore all of the card's normal characteristics."* The corollary: when NOT casting as an Omen (casting as the Dragon face), use the Dragon face characteristics only.

**CR 601.2b:** When casting, announce the spell and any choices (including which face of a multi-faced card). For Omens, you choose: Dragon face or Omen face.

## The Pattern

```
OMEN IN THE GRAVEYARD:

  An Omen card in the graveyard is a creature card (Dragon face characteristics).
  Example: Twinmaw Stormbrood // Charring Bite in your GY:
    It is a white creature card with mana cost {5}{W}, power 5, toughness 5.
    It is NOT an instant or sorcery (the Omen face doesn't exist outside the stack).

HARMONIZE SEES THE OMEN AS A CREATURE:

  Harmonize allows casting "this card" from the graveyard.
  "This card" = the physical card object. The Omen card is castable.
  When you choose to harmonize cast it, you announce:
    "I cast Twinmaw Stormbrood using Harmonize" (specifying the Dragon face).
    NOT: "I cast Charring Bite using Harmonize" (the Omen face).

DRAGON FACE ON THE STACK:

  You cast the card as its Dragon face (the only legal option via Harmonize).
  On the stack: Twinmaw Stormbrood is a {5}{W} creature spell.
    Characteristics: white, 5/5, Flying, creature type Dragon.
    MV: 6 (from Dragon face {5}{W}).
  The Omen face (Charring Bite) is completely ignored while on the stack.

HARMONIZE COST REDUCTION:

  Harmonize cost: {5}{W}, tap a creature to reduce generic cost by that creature's power.
  If you tap a 3-power creature: {5}{W} - {3} generic = {2}{W}.
  The reduction applies to the Dragon face's cost (the cost you're paying).

ON RESOLUTION:

  The Dragon spell resolves: Twinmaw Stormbrood enters as a 5/5 Dragon creature on the
    battlefield.
  Harmonize exile rule: "exile this card instead of putting it anywhere else any time it
    would leave the stack."
  → The card is exiled, not put into the graveyard.
  → You cannot Harmonize cast it again from the graveyard (it's in exile).

HARMONIZE CAST vs. NORMAL CAST:

  If you normally cast Twinmaw Stormbrood from your hand: pay {5}{W}, creature enters.
  If you Harmonize cast it from your graveyard: pay {5}{W} (reduced by creature power),
    same creature enters, then the card is exiled after use.
  → Harmonize is a cost-reduction and reuse prevention: you don't pay full mana, but you
    can only use it once per death cycle (until it's returned from exile somehow).

CAN YOU CAST THE OMEN FACE VIA HARMONIZE?

  No. Harmonize casts the card from the graveyard. In the graveyard, the card is a creature
    (Dragon characteristics only). The Omen face characteristics don't exist there.
  If somehow an Omen card were in exile (via a different casting method like suspend), you
    could potentially cast it as an Omen face (using the Omen's cost and characteristics).
  But Harmonize specifically casts from the graveyard, where the card is a creature card only.

OMNISCIENCE + HARMONIZE + OMEN:

  Omniscience lets you cast spells without paying mana costs (including Harmonize).
  You choose to Harmonize cast an Omen from your graveyard via Omniscience.
  Harmonize base cost: {5}{W} (Dragon face) → Omniscience waives this → spell costs {0}.
  But Harmonize also includes a creature tap (mana reduction).
  The creature tap is part of the cost. Can Omniscience waive it? No — Omniscience only
    waives mana costs, not additional costs like creature taps.
  → You must still tap a creature to reduce the generic component (floor 0).
  → Net cost: {0} generic + creature tap. If tapping a 5-power creature: reduction of 5,
    net {0}. So: free cast with just a creature tap.

OWN-SPELL INTERACTION (RUNESCALE STORMBROOD):

  Runescale Stormbrood ({3}{R}: 2/4): "Whenever you cast a noncreature spell or a Dragon
    spell, this gets +2/+0."
  If you Harmonize cast Twinmaw Stormbrood (Dragon spell from GY), Runescale's trigger fires.
  The trigger sees the Dragon spell being cast via Harmonize (Harmonize is an alternative
    cost, not a cast prohibition).

FLURRY + HARMONIZE + OMEN:

  Flurry: "Whenever you cast your second spell each turn."
  If you Harmonize cast an Omen Dragon from your GY as your second spell, Flurry triggers.
  Flurry sees a spell being cast (the Dragon spell from Harmonize).
  The spell being cast is a creature spell, so Flurry applies.
```

## Definitive Conclusions

- **Omen cards in the graveyard are creature cards** — Harmonize can cast them as creature spells.
- **Harmonize-casting an Omen uses only the Dragon face's characteristics** — the Omen face is ignored; you cast the Dragon face with its cost and creature type.
- **The spell's mana value is the Dragon face's cost** — not the Omen face's cost; Harmonize sees the creature card's MV only.
- **Harmonize cast Omen Dragons are exiled after use** — they cannot be reused from the graveyard until returned from exile.
- **Cannot Harmonize-cast the Omen face** — the card's graveyard identity is creature-only; the Omen face doesn't exist outside the stack.
- **Runescale Stormbrood and Flurry triggers fire from Harmonize-cast Omens** — the Dragon spell being cast triggers "cast Dragon" and "cast spell" abilities normally.

## Canonical Example

**Harmonize + Twinmaw Stormbrood Graveyard Recursion:**

Twinmaw Stormbrood // Charring Bite is in your graveyard (milled or discarded). You cast it via Harmonize from your graveyard.

You announce: "Cast Twinmaw Stormbrood" (the Dragon face). Harmonize cost: {5}{W} (Dragon's mana cost). You tap your Savannah Lion (1 power) to reduce generic cost by 1. Total cost: {4}{W}. Pay it. Cast the Dragon spell.

Twinmaw Stormbrood enters as a 5/5 with Flying. ETB: you gain 5 life.

After it resolves, Harmonize exiles it (card goes to exile, not graveyard).

**Example 2 — Runescale Stormbrood Trigger:**

You control Runescale Stormbrood ({3}{R}: 2/4): "Whenever you cast a noncreature spell or a Dragon spell, this gets +2/+0."

You Harmonize cast Twinmaw Stormbrood from your graveyard (Dragon spell). Runescale's trigger fires: +2/+0 until end of turn. Runescale becomes 4/4 while the Dragon spell is on the stack / resolving.

**Example 3 — Flurry Second Spell via Harmonize:**

Your turn. You cast Brainstorm ({U}) as your first spell. Later, you Harmonize cast Twinmaw Stormbrood from your graveyard as your second spell (tapping a creature to reduce cost).

Flurry trigger fires (you cast your second spell). Flurry resolves: [depending on which creature has Flurry, its effect fires — example: Devoted Duelist deals 1 to each opponent].

Twinmaw Stormbrood spell resolves and enters. Harmonize exile rule: card goes to exile. Runescale and Flurry both triggered, all effects resolved.

## Commonly Confused With
- **P512 (Omens — Zone Identity)** — P512 covers the baseline Omen zone rules (always creature outside stack). P525 applies that to Harmonize casting specifically.
- **P521 (Harmonize Edge Cases)** — P521 covers X-cost, Songcrafter grant, Remand, summoning sickness. P525 covers Harmonize's interaction with double-faced cards (Omens).
- **P508 (Sagas)** — Sagas are double-faced cards but different from Omens. Omens choose which face to cast at announcement; Sagas are saga/enchantment on battlefield.
- **P204 (Double-Faced Cards)** — P204 covers DFC zone rules generally. P525 applies DFC casting rules specifically to Omens + Harmonize.
