---
id: p538
name: Alliance (TMNT 2026) — Periodic Triggered Creature Entry and Feedback Loops
category: triggered
cr_refs: [603.2, 603.6a, 613.1, 701.27]
tags: [alliance, tmnt, triggered-ability, creature-entry, feedback-loop, non-token, tapped]
created: 2026-03-30
examples_count: 2
---

# P538 — Alliance (TMNT 2026) — Periodic Triggered Creature Entry and Feedback Loops

## Abstract

**Alliance** is a triggered ability that fires "Whenever another creature enters the battlefield under your control." The keyword doesn't specify restrictions; therefore, it triggers for any creature entry (token or non-token, tapped or untapped). Alliance is commonly part of a **feedback loop**: Alliance creature creates a token, the token entering triggers Alliance, which creates another token. Multiple Alliance triggers can stack and fire in sequence, potentially creating multiple tokens per loop cycle.

## The Definitive Rules

**CR 603.2 (Triggered Abilities):** *"Triggered abilities trigger automatically when the game state matches their trigger condition."*

**CR 603.6a (Enters-The-Battlefield Triggers):** *"Whenever a permanent enters the battlefield, all applicable triggered abilities that trigger when that permanent enters fire."*

**Official Ruling (Alliance — TMNT 2026, 2026-03-06):** *"Alliance triggers whenever another creature enters the battlefield under your control. This includes tokens and nontoken creatures, tapped and untapped."*

## The Pattern

```
ALLIANCE TRIGGER:

  Ability: "[Creature] has 'Whenever another creature enters the battlefield under
    your control, [effect].'"

  Trigger conditions:
    - Another creature enters (not the creature itself)
    - Under your control (you controlled the entering creature)
    - Any creature type (tokens, nontoken, tapped, untapped, all creatures trigger)

FEEDBACK LOOP POTENTIAL:

  Scenario: Alliance creature creates a 1/1 token.
    1. Alliance creature is on field
    2. You activate ability: "Create a 1/1 token"
    3. Token enters
    4. Alliance trigger fires (another creature entered)
    5. Alliance effect: Create another 1/1 token
    6. New token enters
    7. Alliance trigger fires again
    8. Repeat until loop ends or you run out of tokens

MULTIPLE ALLIANCE TRIGGERS:

  If you control two Alliance creatures:
    - Creature A: "Whenever another creature enters, draw a card"
    - Creature B: "Whenever another creature enters, create a token"

  When any creature enters (not A or B):
    - Both triggers fire simultaneously (APNAP order)
    - Creature A: draw a card
    - Creature B: create a token
    - If the token enters immediately, both triggers fire again (if the token is "another" creature)

STACKING AND RESOLUTION:

  Multiple Alliance triggers on the same stack resolve in LIFO order (last-in, first-out).
  Each trigger can create a new creature, which triggers more Alliance abilities.

INFINITE LOOP CONSIDERATION:

  If Alliance creates tokens infinitely:
    - The game checks for infinite loops (Rule 104.4b)
    - If the loop is deterministic (always creates exactly N tokens), the player must declare it
    - If the loop is infinite without a declared stopping point, it's an illegal action

TAPPED CREATURES TRIGGERING ALLIANCE:

  Tapped creatures can enter tapped. Alliance still triggers.
  The tapped status doesn't prevent Alliance from triggering.

```

## Definitive Conclusions

- **Alliance triggers for any creature entering** — tokens, nontoken, tapped, untapped.
- **Feedback loops are possible** — Alliance creatures creating creatures that trigger Alliance again.
- **Multiple Alliance triggers fire together** — APNAP order for simultaneous triggers.
- **Infinite loops must be declared** — if a loop is deterministic, players must state how many iterations.

## Canonical Example

**Alliance Creature Creating Tokens:**

You control a creature with Alliance: "Whenever another creature enters the battlefield under your control, create a 1/1 red Token creature."

You control another creature: "Whenever you gain life, create a 1/1 Token." You gain 1 life, creating a 1/1 Token.

1/1 Token enters. Alliance trigger fires: Create another 1/1 Token. That Token enters. Alliance fires again: Create a third 1/1 Token, and so on.

If the loop is finite (you have a stopping condition), you declare the loop and create X tokens. If the loop is infinite (no stopping condition), you must state the exact number of iterations before declaring the loop (if it's deterministic).

**Example 2 — Multiple Alliance Creatures:**

You control two Alliance creatures:
- Creature A: "Whenever another creature enters, draw a card"
- Creature B: "Whenever another creature enters, create a token"

An opponent's spell causes a creature to enter under your control (not A or B). Both Alliance triggers fire (simultaneously, APNAP):
1. You draw a card (Creature A's Alliance)
2. You create a 1/1 Token (Creature B's Alliance)

The token enters. Both Alliance triggers fire again, causing you to draw another card and create another token.

## Commonly Confused With

- **P006 (Triggered Ability Double-Trigger)** — P006 covers triggers firing twice; P538 clarifies when Alliance fires for token creation.
- **P005 (Simultaneous Events)** — P005 covers simultaneous trigger ordering; P538 applies to Alliance specifically.
