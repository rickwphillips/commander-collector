---
id: p569
name: Suspend — Exile with Time Counters, Free Cast on Last Counter, Haste, MV 0
category: costs
cr_refs: [702.62, 702.62a, 702.62b, 702.62c, 702.62d]
tags: [suspend, exile, time-counters, free-cast, haste, mana-value, no-mana-cost, special-action, upkeep-trigger, ancestral-vision, cascade-interaction]
created: 2026-03-31
examples_count: 3
---

# P569 — Suspend — Exile with Time Counters, Free Cast on Last Counter, Haste, MV 0

## Abstract

**Suspend exiles a card from your hand with time counters, removes one each upkeep, and lets you play it free when the last counter is removed.** Suspending is a special action (doesn't use the stack, can't be responded to). The card sits in exile face-up with time counters ticking down. When the last counter is removed, a triggered ability lets you cast it without paying its mana cost (X = 0, can't use alternative costs, timing restrictions are ignored). If you don't cast it, it remains in exile (no longer suspended). Creature spells cast via suspend gain haste. Cards with no mana cost (like Ancestral Vision) have MV 0 and can only be cast via suspend or other effects that bypass mana cost. The counter-removal trigger and the cast trigger are separate — either can be countered independently.

## The Definitive Rules

**CR 702.62a (Suspend — Three Abilities):** *"'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able. If you don't, it remains exiled. If you cast a creature spell this way, it gains haste until you lose control of the spell or the permanent it becomes.'"*

**CR 702.62b (Suspended Definition):** *"A card is 'suspended' if it's in the exile zone, has suspend, and has a time counter on it."*

**Official Ruling (2024-02-02):** *"Exiling a card with suspend isn't casting that card. This action doesn't use the stack and can't be responded to."*

**Official Ruling (2024-02-02):** *"Due to a recent rules change to suspend, you are no longer required to cast the suspended card as the second triggered ability resolves. Instead, you may cast the card. Timing permissions based on the card's type are ignored."*

**Official Ruling (2024-02-02):** *"When the last time counter is removed, the second triggered ability triggers. It doesn't matter why the last time counter was removed or what effect removed it."*

**Official Ruling (2024-02-02):** *"If the second triggered ability is countered, the card can't be cast. It remains exiled with no time counters on it, and it's no longer suspended."*

**Official Ruling (2024-02-02):** *"A card with no mana cost can't be cast normally; you'll need a way to cast it for an alternative cost or without paying its mana cost, such as by suspending it."*

## The Pattern

```
SUSPEND — THREE ABILITIES:

  Ability 1 (Static — Exile from Hand):
    "If you could begin to cast this card from your hand,
     you may pay [suspend cost] and exile it with N time counters."
    - Special action: doesn't use the stack
    - Can't be responded to
    - Card goes to exile face-up with N time counters
    - You must be able to START casting it (check card type, restrictions)
    - Sorceries: only when you could cast a sorcery
    - Instants: any time you have priority

  Ability 2 (Triggered — Counter Removal):
    "At the beginning of your upkeep, if this card is suspended,
     remove a time counter from it."
    - Intervening-if clause: card must be suspended (in exile + has time counters)
    - Triggers at upkeep start
    - CAN be countered (Stifle) → no counter removed that turn
    - If countered: card remains suspended, try again next upkeep

  Ability 3 (Triggered — Cast on Last Counter):
    "When the last time counter is removed, if it's exiled,
     you may play it without paying its mana cost."
    - Triggers regardless of WHY the last counter was removed
    - Proliferate ADDS counters (delays suspend, doesn't speed it up)
    - Other effects removing counters (e.g., Clockspinning) can trigger it
    - CAN be countered (Stifle) → card stays exiled, no longer suspended
    - If you choose not to cast: card stays exiled, not suspended

CAST WITHOUT PAYING MANA COST:

  When cast via suspend:
    - X = 0 (CR 107.3)
    - Can't use alternative costs (overload, mutate, flashback, etc.)
    - CAN pay additional costs (kicker, buyback, etc.)
    - MUST pay mandatory additional costs
    - Timing restrictions are IGNORED (recent rules change, 2024)
    - MV = original mana cost (not 0, even though free)

HASTE FOR CREATURES:

  If a creature spell is cast via suspend:
    → It gains haste until you lose control of the spell or permanent
    → This prevents summoning sickness issues (it can attack immediately)
    → If you gain control of it later (after losing it), haste is gone
    → Non-creature spells don't gain haste (irrelevant for instants/sorceries)

CARDS WITH NO MANA COST:

  Some suspend cards have no mana cost (e.g., Ancestral Vision):
    - MV = 0 (no mana cost → MV 0)
    - Can't be cast normally (no mana cost to pay)
    - Can ONLY be cast via suspend, cascade, or other "without paying" effects
    - Cascade can find them (MV 0 < almost any cascade spell's MV)

SUSPENDED STATE:

  A card is "suspended" if and only if:
    1. It's in the exile zone
    2. It has suspend
    3. It has one or more time counters on it

  If any condition fails, it's NOT suspended:
    - In exile with no time counters → not suspended (Ability 3 was already used)
    - In graveyard with time counters → not suspended (wrong zone)
    - Card without suspend in exile with time counters → not suspended

STIFLE INTERACTIONS:

  Counter Ability 2 (upkeep trigger):
    → No counter removed this turn
    → Card remains suspended
    → Trigger will fire again next upkeep

  Counter Ability 3 (cast trigger):
    → Card can't be cast
    → Remains in exile with 0 time counters
    → No longer "suspended" (has no time counters)
    → Can't be recovered via suspend mechanics

SPEEDING UP / SLOWING DOWN SUSPEND:

  Removing counters faster:
    - Effects that remove time counters directly
    - "Remove a time counter from each suspended card" effects
    - These can trigger Ability 3 early

  Adding counters:
    - Effects that add time counters delay the card
    - Proliferate adds a counter of each type already on it
      (adds a time counter → delays by one)

  Note: Proliferate ADDS counters (it can delay suspend).
  To speed up, you need effects that REMOVE counters.

INTERACT WITH EXILE ZONE:

  The suspended card is in exile:
    - "Exile target card from a graveyard" → different zone, doesn't affect it
    - "Process" (exile from exile) → removes the card from exile entirely
    - If the card leaves exile by any means, suspend is disrupted
    - It's face-up (can be interacted with by exile-zone effects)
```

## Definitive Conclusions

- **Suspending doesn't use the stack** — can't be responded to. It's a special action.
- **Two separate triggers** — counter removal and cast trigger can each be countered independently.
- **Cast is optional** — if you don't cast, card stays exiled (no longer suspended).
- **Timing restrictions ignored** — sorceries can be cast via suspend at any time (2024 rule change).
- **X = 0, no alternative costs** — same as all "without paying" effects.
- **Creatures gain haste** — cast via suspend gives haste until you lose control.
- **No mana cost = MV 0** — cards like Ancestral Vision can only be cast via special effects.

## Canonical Example

**Ancestral Vision Suspended:**

You suspend Ancestral Vision from your hand by paying {U}. It goes to exile face-up with 4 time counters. This doesn't use the stack.

Turn 1 upkeep: remove a counter (3 remaining).
Turn 2 upkeep: remove a counter (2 remaining).
Turn 3 upkeep: remove a counter (1 remaining).
Turn 4 upkeep: remove the last counter. Ability 3 triggers: "you may cast it without paying its mana cost." You cast Ancestral Vision. Target player draws three cards.

If opponent Stifles Ability 3: Ancestral Vision stays exiled with 0 counters. It's no longer suspended. You can't cast it via suspend anymore.

**Example 2 — Cascade into Suspended Card:**

Ancestral Vision has MV 0 (no mana cost). You cast a spell with cascade (MV 3). Cascade exiles cards until finding a nonland with MV < 3. You exile Ancestral Vision (MV 0 < 3 ✓). You may cast it without paying its mana cost. It resolves: draw 3. Cascade provides another way to cast a "no mana cost" card.

**Example 3 — Suspend Creature with Haste:**

You suspended a creature 3 turns ago. Last time counter is removed. You cast it without paying its mana cost. It enters the battlefield with haste (suspend grants haste to creature spells). You can attack with it immediately this turn. If an opponent later gains control of it and you regain control, haste is gone (it ended when you lost control).

## Commonly Confused With

- **P559 (Cascade Free Cast)** — P559 covers cascade's immediate free cast; P569 covers suspend's delayed free cast. Both use "without paying mana cost" (X=0).
- **P566 (Madness)** — P566 covers madness (discard to exile, immediate cast window); P569 covers suspend (hand to exile, delayed cast via time counters).
- **P568 (Flashback)** — P568 covers graveyard cast; P569 covers exile-zone cast. Both are alternative/free cast mechanics but from different zones.
