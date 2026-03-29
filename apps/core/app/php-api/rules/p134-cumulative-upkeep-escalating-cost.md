---
id: p134
name: Cumulative Upkeep — Escalating Cost Each Upkeep
category: triggered
cr_refs: [702.24a, 702.24b]
tags: [cumulative-upkeep, age-counter, escalating-cost, sacrifice, ice-age, upkeep, stacking]
created: 2026-03-28
examples_count: 2
---

# P134 — Cumulative Upkeep — Escalating Cost Each Upkeep

## Abstract
Cumulative upkeep imposes an increasingly expensive payment each upkeep. Each trigger adds an age counter to the permanent, then requires paying the cumulative upkeep cost for EACH age counter. First upkeep: pay once. Second: pay twice. Third: pay three times. If you can't (or won't) pay all of it, sacrifice the permanent. Partial payment is NOT allowed — it's all or nothing. Key design: the permanent becomes progressively more expensive to maintain until the player eventually lets it die or the game ends.

## The Definitive Rule

**CR 702.24a** (verbatim): *"'Cumulative upkeep [cost]' means 'At the beginning of your upkeep, if this permanent is on the battlefield, put an age counter on this permanent. Then you may pay [cost] for each age counter on it. If you don't, sacrifice it.' If [cost] has choices associated with it, each choice is made separately for each age counter, then either the entire set of costs is paid, or none of them is paid. Partial payments aren't allowed."*

## The Pattern

```
CUMULATIVE UPKEEP SEQUENCE:
  Each upkeep:
    1. Put an age counter on the permanent
    2. Pay [cost] × (number of age counters now on it) OR sacrifice

  Turn 1 (1 age counter): pay [cost] × 1
  Turn 2 (2 age counters): pay [cost] × 2
  Turn 3 (3 age counters): pay [cost] × 3
  Turn N (N age counters): pay [cost] × N

NO PARTIAL PAYMENT:
  If total cost is {4} and you can only pay {2}: can't pay partial → sacrifice
  All age counters are checked → entire sum paid or nothing
  "You may pay [cost] for each age counter" is each-or-none

CHOICES IN CUMULATIVE UPKEEP (702.24a example):
  "Cumulative upkeep {W} or {U}" with 2 counters:
    Choose for counter 1: pay {W} or {U}
    Choose for counter 2: pay {W} or {U}
    Then pay all or nothing
    Options: {W}{W}, {W}{U}, {U}{U}

MULTIPLE INSTANCES (702.24b):
  Two instances of cumulative upkeep trigger separately
  Each trigger adds age counters and requires payment
  Age counters are NOT tied to specific abilities — both abilities count all counters
  Example: 2 instances of "cumulative upkeep — pay 1 life":
    Trigger 1: adds counter (1 total), pay 1 life
    Trigger 2: adds counter (2 total), pay 2 life
    Total life paid: 3 (1+2) in one turn

CUMULATIVE UPKEEP + PROLIFERATE:
  Proliferate can add age counters to hasten the inevitable
  "I'll proliferate to add 3 age counters" → next upkeep needs 4× payment → sacrifice it

REMOVING AGE COUNTERS:
  Vampire Hexmage: remove all counters from target permanent → removes age counters → resets to 0
  With 0 age counters: next upkeep adds 1 → pay [cost] × 1 again (fresh start)

CLASSIC CARDS:
  Glacial Chasm: "You may not attack. Prevent all damage that would be dealt to you."
    Cumulative upkeep: pay 2 life. Becomes 2, 4, 6, 8... life per turn
  Mystic Remora: "Whenever an opponent casts a noncreature spell, draw a card unless they pay {4}."
    Cumulative upkeep: {1}. Turn 1: {1}. Turn 2: {2}. Turn 3: {3}...
```

## Definitive Conclusions

- **Cumulative upkeep adds an age counter AND requires paying [cost] × (total age counters).** Miss or refuse → sacrifice.
- **No partial payment.** All or nothing.
- **Multiple instances each trigger separately** and both count all age counters.
- **Removing age counters (Vampire Hexmage, Hex Parasite) resets the cost.**
- **Proliferate accelerates the sacrifice** by adding extra age counters.

## Canonical Example
**Glacial Chasm (Cumulative Upkeep — pay 2 life):**
Turn 1: 1 age counter, pay 2 life. "Prevent all damage that would be dealt to you."
Turn 3: 3 age counters, pay 6 life.
Turn 6: 6 age counters, pay 12 life.
Eventually unsustainable — used in combo decks to prevent death while setting up a win.

**Example 2 — Mystic Remora (Cumulative Upkeep {1}):**
Classic Commander draw engine.
Turn 1: pay {1} to keep it. Opponents pay {4} per noncreature spell or you draw.
Turn 4: pay {4} to keep it. Now it costs as much as its protection clause — typically let it go or reset with removal.

## Commonly Confused With
- **P112 (Echo/Fading/Vanishing)** — Echo is a one-time upkeep payment; fading removes counters without escalation. Cumulative upkeep uniquely escalates over time.
- **P097 (Saga)** — Sagas add lore counters each upkeep (similar mechanic), but the trigger is a fixed effect per chapter, not an escalating cost.
