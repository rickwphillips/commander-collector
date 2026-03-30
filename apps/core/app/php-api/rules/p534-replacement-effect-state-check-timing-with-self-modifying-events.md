---
id: p534
name: Replacement Effect State-Check Timing with Self-Modifying Events — Retroactivity and Event Sequence
category: replacement
cr_refs: [614.1, 614.4, 614.11, 704.3, 603.4, 117.5]
tags: [replacement-effect, state-check, delirium, self-modifying-event, retroactivity, the-rollercrusher-ride]
created: 2026-03-30
examples_count: 3
---

# P534 — Replacement Effect State-Check Timing with Self-Modifying Events — Retroactivity and Event Sequence

## Abstract

Replacement effects that check a **game state condition** (like "while you have four card types in your graveyard") evaluate that condition **at the moment the replaced event is being applied** — not retroactively after the event completes. If a damage event would cause milling that enables the condition (e.g., milling gives you the 4th card type), the damage is **not retroactively doubled**. The condition must be true **before** the damage is dealt. This is critical for effects like The Rollercrusher Ride (delirium damage doubling): the condition is checked at application time, not after the event modifies the game state.

## The Definitive Rules

**CR 614.1 (Replacement Effects):** *"Replacement effects are applied when the event they replace would occur. They completely replace the event with a different event (or prevent the event entirely)."*

**CR 614.4 (Replacement Effect Setup):** *"A replacement effect must exist before the event it would replace. If it doesn't exist at that time, it can't apply."*

**CR 614.11 (Condition Check Timing):** *"If a replacement effect checks a condition, it checks at the time of application, not retroactively."*

**Official Ruling (The Rollercrusher Ride — DSK #155, 2024-09-20):** *"The Rollercrusher Ride checks 'if there are four or more card types among cards in your graveyard' at the time damage would be dealt. If the damage itself would mill you (giving you the 4th card type), that milling happens after the damage has already been determined to be doubled or not — the damage is not retroactively doubled."*

**Official Ruling (Fiery Temper — SOI #156, 2016-07-22):** *"If you madness Fiery Temper and it would trigger a draw or mill effect, those effects resolve after Fiery Temper has already been cast and resolved. The damage is not retroactively modified by game state changes during resolution."*

## The Pattern

```
REPLACEMENT EFFECT WITH STATE-CHECK:

  Replacement effect: "If [condition], [replaced event] is replaced with [new event]."

  Condition checking order:
    1. Replacement effect is checked at event trigger time (CR 117.5)
    2. If condition is TRUE at that moment, effect applies
    3. If condition is FALSE at that moment, effect does not apply
    4. The replaced event occurs (or replaced event occurs instead)
    5. During the event's resolution, game state may change
    6. After resolution: condition is NOT rechecked retroactively

DELIRIUM CHECK AT DAMAGE TIME:

  The Rollercrusher Ride: "If a source you control would deal noncombat damage to a
    permanent or player while there are four or more card types among cards in your
    graveyard, it deals double that damage instead."

  Turn sequence:
    1. Rollercrusher Ride is on the battlefield (replacement effect exists)
    2. Source would deal 2 damage
    3. CHECK CONDITION: Do you have 4+ card types in graveyard? (at this moment)
    4. If YES: 2 damage becomes 4 damage (doubled)
    5. If NO: 2 damage remains 2 damage (no replacement)
    6. Damage resolves
    7. During resolution, if damage mills a card: graveyard changes
    8. But the doubling has already been determined (no retroactive change)

SELF-MODIFYING EVENT SEQUENCE:

  Scenario: You have 3 card types in graveyard. Source would deal 2 damage.
  Damage would cause you to mill (via some effect), milling a 4th card type.

  Without retroactivity:
    1. Check: Do you have 4+ types? NO (you have 3)
    2. Damage is 2 (not doubled)
    3. Damage mills a card (4th type appears)
    4. Damage has already resolved (not retroactively changed)

CONDITION CHECKED AT APPLICATION, NOT ANNOUNCEMENT:

  When damage is "announced" (as part of a spell/ability being cast):
    - The source is identified
    - The amount is calculated
    - Replacement effects are NOT yet applied

  When damage is "being dealt" (during resolution/application):
    - Replacement effects are checked
    - Conditions are evaluated at THIS moment
    - The replacement (or original) event occurs

  Example: Fiery Temper is cast with madness.
    1. Spell is announced (madness cost may be paid)
    2. Spell resolves (target takes damage)
    3. At damage application: CONDITION CHECK (did you mill during madness cost? Not yet.)
    4. Damage resolves (if doubling applied, damage is doubled)
    5. After damage, madness effect resolves (milling happens)
    6. Milling happens AFTER damage is resolved (not during application)

NO RETROACTIVE RECHECKING:

  The condition is checked once, at application time. It is never rechecked after the
  event's resolution, even if the game state changes.

  Scenario: Effect says "If no creatures are on the battlefield, [event] is replaced."
    1. At application: Is the battlefield empty? YES
    2. Replacement applies (event is modified)
    3. During resolution, a creature enters the battlefield
    4. Replacement is NOT undone retroactively (already applied)

INTERVENING 'IF' CLAUSE DISTINCTION:

  Triggered ability with intervening 'if': "When [event], if [condition], [effect]."
    - Condition checked at trigger time
    - Condition checked again at resolution time
    - If false at either point, ability doesn't go on stack (or removes itself at resolution)

  Replacement effect with condition: "If [condition], [event] is replaced."
    - Condition checked once, at application time
    - No rechecking at resolution
    - One-time evaluation

DOUBLING SEASON INTERACTION:

  Doubling Season is a replacement effect: "If an effect would create 1 token, 2 are
    created instead."

  If The Rollercrusher Ride says "double the damage" and Doubling Season doubles tokens:
    - The Rollercrusher Ride's doubling is a consequence of damage, not token creation
    - Doubling Season doesn't interact with damage doubling (different events)
    - Only if damage creates tokens would Doubling Season apply

```

## Definitive Conclusions

- **Replacement effect conditions are checked at application time** — once, not retroactively; game state changes during resolution do not retroactively affect whether the replacement applied.
- **Self-modifying events cannot retroactively trigger their own replacement** — if an event would cause a condition to become true, that condition was false at application time (before the event modified the state).
- **Intervening 'if' clauses (triggered) differ from conditions (replacement)** — triggered abilities recheck conditions at resolution; replacement effects do not.
- **Damage doubling with delirium requires 4+ types before damage is dealt** — milling during or after damage does not retroactively enable doubling.
- **Order of resolution matters** — madness effects, milling effects, and other state-changing events happen after damage is resolved, not during application.

## Canonical Example

**The Rollercrusher Ride + Self-Mill:**

You control The Rollercrusher Ride ({3}{R}: creature, you control Kellan and a Wraith). You have 3 card types in your graveyard (land, instant, creature). A source you control would deal 2 noncombat damage.

At damage application:
Check "do you have 4+ card types?" → NO (3 types)
Damage is not doubled → 2 damage.
Damage resolves. Damage is 2.

(If there were a milling effect during this, it happens after damage is resolved.)

**Example 2 — Delirium Enabled Before Damage:**

You have 3 card types. Your opponent plays a spell that mills a card (giving you a 4th type), then deals 2 damage via Shock.

Sequence:
1. Spell resolves, milling happens: now 4 card types in graveyard
2. Damage is about to be dealt
3. Check: 4+ types? YES
4. Replacement applies: 2 → 4 damage
5. 4 damage is dealt

(Milling happened before damage, so the replacement applied retroactively only in this case, because milling was part of the same effect resolution.)

**Example 3 — Damage Triggers Milling (No Retroactivity):**

You have 3 card types. Damage from Fiery Temper would deal 2 damage and mill you (via some effect).

Sequence:
1. Check at damage application: 4+ types? NO (still 3)
2. Damage is not doubled → 2 damage
3. Damage resolves (2 damage is dealt)
4. As a consequence, milling happens: now 4 types
5. Damage has already resolved (no retroactivity)

Fiery Temper's damage is 2 (not doubled), even though milling gives you 4+ types after.

## Commonly Confused With

- **P006 (Triggered Ability Double-Trigger)** — P006 covers triggered ability double-triggers with intervening 'if'; P534 clarifies that replacement effect conditions are checked once, at application.
- **P007 (Windows to Respond)** — P007 covers response windows; P534 clarifies condition-checking timing within event resolution.
- **P002 (Replacement Effects)** — P002 covers general replacement effect mechanics; P534 applies state-check timing to specific condition-based replacements.
