---
id: p545
name: Panharmonicon + Eerie — Double Trigger on Simultaneous Enchantment Enterers
category: triggered
cr_refs: [603.2, 603.6a, 613.1, 602.2]
tags: [panharmonicon, eerie, ETB, triggered-ability, enchantment, doubling, duskmourn, simultaneous]
created: 2026-03-30
examples_count: 2
---

# P545 — Panharmonicon + Eerie — Double Trigger on Simultaneous Enchantment Enterers

## Abstract

**Panharmonicon causes creature ETB abilities to trigger an additional time.** Eerie is a triggered ability that fires when an enchantment enters the battlefield AND when a Room is unlocked. If Eerie is on a creature, Panharmonicon applies to the enchantment-ETB trigger. When multiple enchantments enter simultaneously, Eerie triggers once per enchantment entering; Panharmonicon causes each instance to trigger an additional time. The Room unlock trigger is NOT affected by Panharmonicon (it is not an ETB trigger). This pattern clarifies the interaction between doubling effects and multi-condition triggered abilities.

## The Definitive Rules

**CR 602.2 (Panharmonicon):** *"Whenever a creature enters the battlefield under your control, if Panharmonicon is on the battlefield, that creature's enter-the-battlefield triggered abilities trigger an additional time."*

**CR 603.6a (Enters-The-Battlefield Triggers):** *"Enters-the-battlefield triggered abilities trigger when a permanent enters the battlefield. All applicable triggered abilities that trigger when a permanent enters fire simultaneously."*

**CR 603.2 (Triggered Abilities):** *"Triggered abilities trigger automatically when the game state or event matches their trigger condition."*

**Official Ruling (Eerie — DSK):** *"Eerie triggers whenever an enchantment enters the battlefield under your control. It also triggers separately when a Room you control becomes fully unlocked."*

## The Pattern

```
PANHARMONICON EFFECT:

  Panharmonicon: Artifact, {4}
    "Whenever a creature enters the battlefield under your control,
     if Panharmonicon is on the battlefield, that creature's enter-the-battlefield
     triggered abilities trigger an additional time."

  Key scope: "creature's enter-the-battlefield triggered abilities"
    - Applies to ETB abilities on the creature
    - Applies to abilities that trigger when the creature enters
    - Does NOT apply to abilities that trigger from other sources

EERIE MECHANIC:

  Eerie (DSK): Ability word used on creatures.
    "Eerie — Whenever an enchantment you control enters the battlefield
     and whenever you fully unlock a Room, [effect]."

  Two independent trigger conditions:
    1. Enchantment enters the battlefield (ETB trigger)
    2. Room unlock event (replacement/state trigger)

PANHARMONICON + EERIE (ENCHANTMENT ENTRY):

  Scenario: You control Panharmonicon and a creature with Eerie.

  When an enchantment enters:
    - Eerie triggers (enchantment-ETB trigger condition met)
    - Panharmonicon applies (creature's ETB ability):
      → Eerie triggers an additional time
    - Total triggers: 2 (one from Eerie, one from Panharmonicon)

  If 2 enchantments enter simultaneously:
    - Eerie triggers twice (once per enchantment entering)
    - Panharmonicon applies to each instance:
      → Eerie triggers an additional time per instance
    - Total triggers: 4 (2 from Eerie direct, 2 from Panharmonicon doubling)

PANHARMONICON + EERIE (ROOM UNLOCK):

  When a Room unlocks (becomes fully unlocked):
    - Eerie triggers (Room-unlock trigger condition met)
    - Panharmonicon does NOT apply (Room unlock is not an ETB trigger)
    - Total triggers: 1 (Eerie only)

  Panharmonicon only affects creature ETB, not state-based room unlock events.

STACKING AND RESOLUTION:

  Multiple Eerie triggers from simultaneous enchantments + Panharmonicon doubling
    go on the stack in APNAP order (active player's Eerie first).

  Each trigger resolves in order. If Eerie effect is "create a token" or similar:
    - Each trigger creates a separate token
    - Multiple triggers = multiple tokens

MULTIPLE PANHARMONICONS:

  If you control TWO Panharmonicons and a creature with Eerie:
    - First Panharmonicon applies doubling
    - Second Panharmonicon applies doubling
    - Total Eerie triggers: 3 per enchantment (1 original + 2 doubling effects)

  Example: One enchantment enters
    - Eerie triggers: 1 (original)
    - Panharmonicon 1 doubles: +1 trigger
    - Panharmonicon 2 doubles: +1 trigger
    - Total: 3 triggers

```

## Definitive Conclusions

- **Panharmonicon doubles ETB triggers** — Eerie's enchantment-entry trigger is doubled by Panharmonicon.
- **Room unlock is not doubled** — Eerie's Room-unlock trigger is NOT affected by Panharmonicon.
- **Multiple simultaneous entries create multiple triggers** — when multiple enchantments enter simultaneously, Eerie triggers once per enchantment; Panharmonicon doubles each instance.
- **Multiple Panharmonicons stack** — if you control multiple Panharmonicons, Eerie triggers an additional time per Panharmonicon.

## Canonical Example

**Panharmonicon + Gremlin Tamer (Eerie):**

You control Panharmonicon and Gremlin Tamer with Eerie: "Whenever an enchantment you control enters the battlefield and whenever you fully unlock a Room, create a 1/1 red Gremlin creature token."

You cast two enchantments (e.g., Aura spells): Both enter simultaneously.

Eerie triggers twice (once per enchantment entering). Panharmonicon causes Eerie to trigger an additional time per instance.

Total triggers: 4
- Enchantment 1 enters → Eerie triggers (1) → Panharmonicon doubles (2)
- Enchantment 2 enters → Eerie triggers (1) → Panharmonicon doubles (2)

Total: 4 Gremlin tokens created.

**Example 2 — Room Unlock (Not Doubled):**

Same setup: Panharmonicon + Gremlin Tamer with Eerie.

You fully unlock a Room (via Room mechanic, all 3 upgrade levels completed).

Eerie's Room-unlock trigger fires (creates a 1/1 Gremlin token). Panharmonicon does NOT apply (Room unlock is not an ETB trigger).

Total triggers: 1 Gremlin token created.

## Commonly Confused With

- **P289 (Panharmonicon)** — P289 covers Panharmonicon mechanics; P545 applies to Eerie's dual-trigger structure.
- **P515 (Eerie)** — P515 covers Eerie mechanics; P545 clarifies Panharmonicon interaction with Eerie's enchantment-entry trigger.
- **P028 (Simultaneous ETB)** — P028 covers simultaneous entry ordering; P545 applies to Panharmonicon doubling in that context.
