---
id: p549
name: Manifest Dread Specialized — Library Mill, Face-Down Entry, and Ability Persistence
category: replacement
cr_refs: [708.3, 708.4, 701.26a, 603.6a]
tags: [manifest, duskmourn, face-down, mill, token, double-faced, ability-loss, eerie]
created: 2026-03-30
examples_count: 3
---

# P549 — Manifest Dread Specialized — Library Mill, Face-Down Entry, and Ability Persistence

## Abstract

**Manifest Dread is a replacement effect that creates a 2/2 colorless face-down creature token AND mills one card as part of the same effect.** When a Manifest Dread effect resolves, a player puts one card face-down as a 2/2 creature (a token) and puts another card from the top of their library into their graveyard (the mill component). If a library has fewer cards than required, the Manifest creates a token but may fail to mill (or mill fewer cards). When multiple Manifest effects trigger simultaneously (via Eerie or other triggers), each creates a separate face-down token and mills separately. Double-faced cards manifested become face-down (front face only; cannot transform while face-down). A face-down creature can still turn face-up even if its ability is removed mid-game. This pattern clarifies the mechanics of Manifest as a two-part replacement effect combining token creation and milling.

## The Definitive Rules

**CR 708.3 (Face-Down Permanents):** *"A face-down permanent is a colorless, nameless, typeless creature with no abilities and power and toughness 2/2. This is a game rule that applies to the permanent as it is on the battlefield."*

**CR 708.4 (Double-Faced Cards Face-Down):** *"If a double-faced card would be face-down on the battlefield, it enters face-down showing only its front face. While face-down, it can't transform."*

**CR 701.26a (Manifest):** *"'Manifest [X]' means 'Put the top [X] cards of your library onto the battlefield face down. Each of those cards becomes a creature card on the battlefield with base power and toughness 2/2.'"*

**Official Ruling (Manifest — DSK):** *"Manifest dread looks at the top two cards of your library. Put one onto the battlefield face down as a 2/2 creature and the other into your graveyard. If your library has fewer than two cards, you manifest the top card and mill the rest (or none)."*

**Official Ruling (Manifest + Double-Faced):** *"If a double-faced card is manifested, it enters the battlefield face-down showing its front face. It cannot transform while face-down. When you turn it face-up, if it's a creature card, it becomes a creature with its front-face P/T and abilities."*

**Official Ruling (Face-Down + Ability Loss):** *"A face-down creature that loses all abilities can still be turned face-up as a special action. When turned face-up, if it's a creature card, it has its normal P/T and abilities (which may have been lost mid-game, but reappear when turning face-up)."*

## The Pattern

```
MANIFEST DREAD MECHANICS:

  Manifest Dread: A replacement effect.
  "Manifest dread. (Look at the top two cards of your library. Put one onto
   the battlefield face down as a 2/2 creature and the other into your graveyard.)"

  Two-part effect:
    1. Create a 2/2 colorless face-down creature token from top of library
    2. Mill one card (put one card into graveyard)
    Both parts happen as part of the same Manifest Dread resolution.

LIBRARY SIZE EDGE CASES:

  If library has 2+ cards:
    - Normal: 1 token created, 1 card milled
  If library has exactly 1 card:
    - Token created from that card (card is on battlefield face-down)
    - Mill fails (no cards left to mill)
  If library has 0 cards:
    - Manifest dread can't create token or mill
    - Effect fizzles or does nothing (depends on context)

MANIFEST CREATES A TOKEN (NOT A COPY):

  The manifested face-down creature is a TOKEN, not a copy.
    - Governed by token rules (cease to exist if left battlefield)
    - 2/2 colorless, face-down status
    - No printed name, type, or abilities (face-down)

DOUBLE-FACED CARDS AND MANIFEST:

  If Manifest mills a double-faced card (transforms):
    - Card is created face-down on battlefield
    - Shows only FRONT FACE (not back face)
    - Cannot transform while face-down
    - Turning face-up: reveals the card's actual identity, allows transformation then

  Example: Milling a Werewolf (double-faced creature)
    - Enters face-down as a generic 2/2
    - When turned face-up: reveals it's a Werewolf, becomes creature with Werewolf P/T
    - Then night/day mechanics determine if it transforms

MULTIPLE MANIFEST EFFECTS (SIMULTANEOUS):

  If Eerie triggers twice (two enchantments enter), two Manifest Dread effects:
    1. First Manifest: create token #1, mill one card
    2. Second Manifest: create token #2, mill one card
    - Both tokens enter simultaneously
    - Total milled: 2 cards
    - Both tokens available for Panharmonicon (P545) doubling if applicable

FACE-DOWN STATUS AND ABILITIES:

  Face-down permanent has no abilities (CR 708.3).
    - Static abilities are suppressed
    - Triggered abilities don't trigger (ability doesn't exist while face-down)
    - The card still has those abilities (they're just not visible/active)

  If permanent gains face-down status via Manifest:
    - Abilities are suppressed while face-down
    - When turned face-up, abilities reactivate
    - Ability loss during face-down (via Humility) removes them permanently
    - If Humility is removed later, abilities DON'T return (they were lost)

TURNING FACE-UP MECHANICS:

  Face-down creature can be turned face-up:
    - As a special action (no stack, can't respond)
    - Only during main phases, with stack empty
    - Costs mana equal to the creature card's mana cost
    - If card is NOT a creature card (instants, sorceries, etc.), can't turn face-up
    - Even if turned face-up, it remains where it is (not re-entering battlefield)

  Example: Manifest a Sorcery
    - Sorcery enters face-down as 2/2 token
    - Cannot be turned face-up (not a creature card)
    - Remains face-down until it leaves the battlefield

ETB TRIGGERS AND MANIFEST:

  Manifest is a replacement effect, not an ETB.
    - Creating the token doesn't trigger ETB abilities
    - The token enters with no ETB event

  However, if Manifest Dread is part of another ability:
    - That ability might trigger ETB abilities on other permanents
    - Example: Eerie + Manifest (Eerie triggers first, creating effects)

MANIFEST + EERIE FEEDBACK:

  Scenario: Creature with Eerie + Manifest Dread activation
    1. Manifest Dread resolves: creates 2/2 token, mills 1 card
    2. Token enters; Eerie checks: "did an enchantment enter?" No
    3. Result: only Manifest effect, no Eerie trigger

  Scenario: Enchantment enters, triggering Eerie with Manifest effect
    1. Enchantment enters; Eerie triggers (enchantment-ETB)
    2. Eerie effect resolves: Manifest Dread
    3. Token created, card milled
    4. Result: Eerie triggers once; Manifest creates one token

```

## Definitive Conclusions

- **Manifest Dread creates a token and mills simultaneously** — both parts happen as part of the same effect.
- **Face-down tokens are 2/2 colorless with no abilities** — characteristics defined by rules, not the card.
- **Library edge cases are handled gracefully** — fewer than 2 cards still manifests and mills fewer.
- **Double-faced cards enter face-down (front face only)** — cannot transform while face-down.
- **Ability loss removes abilities permanently** — even if face-down, losing abilities while manifested prevents them when turning face-up.
- **Turning face-up is a special action** — not an ETB; doesn't trigger Panharmonicon or ETB effects.

## Canonical Example

**Manifest Dread via Eerie:**

You control Gremlin Tamer with Eerie: "Whenever an enchantment you control enters, manifest dread."

You cast an Aura (enchantment). Eerie triggers: manifest dread.

Manifest resolves: top card of library becomes a 2/2 face-down token, next card is milled.

Face-down token is a colorless creature with no name, type, or abilities. You can later pay mana equal to the milled card's cost to turn it face-up (if it's a creature card).

**Example 2 — Manifest a Double-Faced Werewolf:**

Your library has a Werewolf (double-faced creature) on top.

Manifest Dread resolves: Werewolf enters face-down as a 2/2 colorless creature.

Later, you pay mana to turn it face-up. The face-down permanent is revealed: it's a Werewolf creature card. It transforms according to night/day mechanics.

**Example 3 — Manifest a Sorcery:**

Your library has a Sorcery on top.

Manifest Dread resolves: Sorcery enters face-down as a 2/2 colorless creature.

You cannot turn this face-up (it's not a creature card). It remains face-down on the battlefield. If it leaves, it's a sorcery card (not a creature) in its destination zone.

## Commonly Confused With

- **P041 (Morph)** — P041 covers morph and face-down mechanics; P549 applies specifically to Manifest's token-creation and mill components.
- **P496 (Duskmourn Mechanics)** — P496 covers Eerie, Manifest, Impending; P549 specializes Manifest's library and double-faced card interactions.
- **P028 (Simultaneous ETB)** — P028 covers simultaneous entries; P549 clarifies Manifest creates tokens (not ETB entries).
