---
id: p095
name: Unleash — Counter or Block Restriction Choice
category: replacement
cr_refs: [702.98a]
tags: [unleash, counter, block, restriction, optional, as-enters, aggressive, rakdos]
created: 2026-03-28
examples_count: 2
---

# P095 — Unleash — Counter or Block Restriction Choice

## Abstract
Unleash is an "as this enters" ability presenting a tradeoff: you may choose to have the permanent enter with an additional +1/+1 counter, but if it has any +1/+1 counters, it can't block. This creates a choice between having a bigger attacker or a blocker. The blocking restriction is a static ability — any +1/+1 counter (from unleash or added later) prevents blocking. If all +1/+1 counters are removed, the creature can block again.

## The Definitive Rule

**CR 702.98a** (verbatim): *"Unleash is a keyword that represents two static abilities. 'Unleash' means 'You may have this permanent enter with an additional +1/+1 counter on it' and 'This permanent can't block as long as it has a +1/+1 counter on it.'"*

## The Pattern

```
UNLEASH CHOICE:
  "As this permanent enters" → choose to enter with or without a +1/+1 counter
  This is a static ability (not triggered) — part of how the permanent enters
  Torpor Orb doesn't suppress it (it's not a triggered ETB)

BLOCKING RESTRICTION:
  As long as the permanent has a +1/+1 counter: can't block
  If unleashed (counter chosen): permanently can't block (until counter removed)
  If not unleashed: no counter → can block normally
  If ANOTHER effect adds a +1/+1 counter to a non-unleashed creature:
    Now it has a +1/+1 counter → can't block

REMOVING THE COUNTER:
  Effects that remove +1/+1 counters:
    -1/-1 counter + +1/+1 counter: both removed via SBA 704.5q
    "Remove a +1/+1 counter from [this]"
  If all +1/+1 counters removed: no longer has any → can block again
  The unleash static ability is still there but doesn't prevent blocking if no counter exists

DOUBLING SEASON:
  If you choose to unleash (add the counter): Doubling Season doubles it → 2 counters
  Still can't block (has +1/+1 counters)
  But the creature is bigger (+2/+2 from Doubling Season vs. +1/+1 normally)

UNLEASH CREATURE IN MIDGAME:
  Other effects can add +1/+1 counters after entry (proliferate, counters from spells)
  Each addition prevents blocking if any counter is present
  This is generally not a concern since unleash decks are aggressive
```

## Definitive Conclusions

- **Unleash offers a choice on entry:** get a +1/+1 counter OR keep the ability to block.
- **Any +1/+1 counter prevents blocking** — not just the unleash counter.
- **Removing all +1/+1 counters restores blocking ability.**
- **Unleash is an "as enters" static ability.** Torpor Orb doesn't suppress it.

## Canonical Example
**Gore-House Chainwalker (Unleash, 2/1):**
Choose unleash: enters with +1/+1 counter (3/2) but can't block. Or don't unleash: enters as 2/1, can block. In an aggressive deck, unleash is preferred for the extra power.

**Example 2 — Proliferate on unleashed creature:**
Gore-House Chainwalker was unleashed (1 counter). You proliferate: add another +1/+1 counter. Now 4/3. Still can't block (has +1/+1 counters). Someone uses Wither source to deal 2 damage → two -1/-1 counters. SBA: 704.5q removes 2 pairs of opposing counters. After SBA: 0 counters of either type. Chainwalker is 2/1 again and can now block.

## Commonly Confused With
- **P075 (Riot)** — Both offer a counter-or-other-effect choice on entry. Riot gives counter vs. haste; Unleash gives counter vs. blocking ability. Both are static "as enters" choices.
- **P095 and P030 (Blocked Status)** — Unleash prevents blocking outright (evasion restriction). P030 covers blocked-status persistence during combat.
