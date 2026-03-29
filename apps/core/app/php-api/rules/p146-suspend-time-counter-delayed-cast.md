---
id: p146
name: Suspend — Time Counter Delayed Cast
category: zones
cr_refs: [702.62a, 702.62b, 702.62c, 702.62d]
tags: [suspend, time-counter, exile, upkeep, haste, delayed-cast, cascade, proliferate, future-sight]
created: 2026-03-28
examples_count: 2
---

# P146 — Suspend — Time Counter Delayed Cast

## Abstract
Suspend lets you exile a card from your hand with N time counters on it, paying a reduced (or zero) cost. Each upkeep, one counter is removed. When the last counter is removed, you may cast it for free — and if it's a creature, it gains haste. The card sits in exile counting down, not in the graveyard, so it can't be reanimated. Proliferate can accelerate the countdown. Key timing: suspend is a special action (no stack), and casting at the end is optional.

## The Definitive Rules

**CR 702.62a** (verbatim): *"Suspend is a keyword that represents three abilities. The first is a static ability that functions while the card with suspend is in a player's hand. The second and third are triggered abilities that function in the exile zone. 'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able. If you don't, it remains exiled. If you cast a creature spell this way, it gains haste until you lose control of the spell or the permanent it becomes.'"*

**CR 702.62b** (verbatim): *"A card is 'suspended' if it's in the exile zone, has suspend, and has a time counter on it."*

## The Pattern

```
SUSPEND:
  Three-part keyword:
    1. Static ability (in hand): pay [cost], exile with N time counters (no stack, special action)
    2. Triggered (in exile): at beginning of your upkeep, remove one time counter
    3. Triggered (in exile): when last counter removed → may cast without paying mana cost

  SUSPEND TIMING:
    Suspending: special action (like playing a land) — no stack, no response window
    Must be in hand AND could normally cast it (timing restrictions, conditions)
    The suspend cost is paid once, at suspension time
    Each upkeep: one counter removed → this IS a triggered ability (can be responded to; Stifle works)
    Free cast trigger: optional "you may" → can leave it in exile if desired

  HASTE CLAUSE:
    If you cast a creature spell via suspend's last trigger: it gains haste
    Haste lasts until you lose control of the spell or the permanent
    If it's NOT a creature: no haste (instants, sorceries, enchantments don't need haste anyway)

  SUSPEND + PROLIFERATE:
    Proliferate adds counters of types already on permanents/players
    Suspended card in exile has time counters → you can proliferate those counters
    Adding a time counter extends the suspend, delays the free cast
    (You can also use proliferate on opponent's suspended cards to delay them!)

  SUSPEND + CASCADE:
    Cascade triggers when you CAST a spell
    A spell cast from suspend (free cast) IS cast → cascade triggers!
    Emrakul, the Aeons Torn suspended with cascade combo: works

  SUSPEND + ZERO COST:
    A 0-cost suspend: exile immediately for free → next upkeep trigger fires
    Example: Lotus Bloom (Suspend 3—{0}): pay {0}, exile with 3 time counters
    3 upkeeps later: Lotus Bloom enters, adds {W}{W}{W}, {U}{U}{U}, {B}{B}{B}, {R}{R}{R}, or {G}{G}{G}

  SUSPEND + COUNTERSPELL:
    The free cast (when last counter removed) is a spell on the stack → can be countered
    If countered: the card goes to the graveyard (not back to exile or hand)

  SUSPEND + MULTIPLE INSTANCES:
    Multiple instances of suspend work separately
    (Unusual, but each removes counters on triggers separately)

  SUSPEND CARD IN EXILE:
    The card is in exile, NOT your graveyard
    Graveyard recursion doesn't reach it
    Reanimate, Snapcaster Mage: can't target suspended cards
    The card remains "owned" by you in exile, but can't be interacted with except through time counter manipulation
```

## Definitive Conclusions

- **Suspend is a special action** (no stack). No one can respond to the initial exile.
- **Each upkeep trigger** (counter removal) CAN be Stifled or countered.
- **Creatures cast via suspend gain haste** — useful for combat immediately.
- **Proliferate extends suspend** (adds more time counters to delay the card).
- **The final cast IS a real cast** — cascade triggers, X = 0 for X costs cast this way.
- **If the free cast is countered, the card goes to the graveyard** — it doesn't return to exile.

## Canonical Example
**Lotus Bloom (Suspend 3—{0}):**
Pay {0}, exile Lotus Bloom with 3 time counters. It counts down over 3 upkeeps.
Turn 4 (assuming turn 1 suspend): free cast trigger fires. Lotus Bloom enters → sacrifice for {W}{W}{W} (or any color). Combo enabler for storm/ritual decks.

**Example 2 — Rift Bolt (Suspend 1—{R}):**
Pay {R} to suspend Rift Bolt with 1 time counter.
Next upkeep: counter removed → Rift Bolt cast for free → deals 3 damage to any target.
Functionally: pay {R} on your turn, deal 3 damage on your NEXT turn (or faster with proliferate).

## Commonly Confused With
- **P128 (Plot)** — Plot also exiles then casts for free later. Difference: plot can be cast any future main phase; suspend has a fixed countdown that you can't choose to accelerate (except proliferate).
- **P112 (Vanishing)** — Vanishing uses time counters on permanents counting down to sacrifice. Suspend uses time counters on cards in exile counting down to free cast.
- **P113 (Evoke)** — Evoke is an alternative cast cost with an ETB sacrifice trigger. Suspend is a special-action exile with a delayed cast.
