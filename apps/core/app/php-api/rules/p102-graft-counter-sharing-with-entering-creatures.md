---
id: p102
name: Graft — Counter Sharing with Entering Creatures
category: triggered
cr_refs: [702.58a, 702.58b]
tags: [graft, counter, move, ETB, +1/+1, triggered, optional, multiple-graft]
created: 2026-03-28
examples_count: 2
---

# P102 — Graft — Counter Sharing with Entering Creatures

## Abstract
Graft enters with N +1/+1 counters and whenever another creature enters, if the graft permanent has a +1/+1 counter, you may optionally move one counter from the graft permanent to the entering creature. This is a triggered optional ability — you choose whether to move the counter. Moving counters is not increasing (you lose one to give one). Graft enables counter synergy by spreading counters to key creatures.

## The Definitive Rule

**CR 702.58a** (verbatim): *"Graft represents both a static ability and a triggered ability. 'Graft N' means 'This permanent enters with N +1/+1 counters on it' and 'Whenever another creature enters, if this permanent has a +1/+1 counter on it, you may move a +1/+1 counter from this permanent onto that creature.'"*

## The Pattern

```
GRAFT COMPONENTS:
  1. Static ability: enters with N +1/+1 counters
  2. Triggered ability: whenever another creature enters, may move a counter

MOVE A COUNTER:
  Moving = remove from graft permanent, add to entering creature
  Net: graft loses 1 counter, entering creature gains 1 counter
  NOT: both gaining (it's a move, not a copy)
  Optional: "you may" → don't have to

TRIGGER CONDITION:
  "If this permanent has a +1/+1 counter" — checked at trigger time AND at resolution
  If graft has used all its counters (from previous moves or proliferate removal):
    No more counters → trigger may still fire but moving isn't possible → can't do it
  Actually: CR says "you may move a counter from this permanent onto that creature"
    If no counter available at resolution: you can't move → nothing happens

WHICH CREATURES TRIGGER GRAFT?
  "Whenever another creature enters" — any creature entering, including opponent's
  You may move a counter to opponent's creature
    (Usually bad, but possible — e.g., opponent's creature has infect, you don't want it bigger)
  Actually: "you may" means optional, so just don't move if you don't want to

MULTIPLE GRAFT PERMANENTS:
  If you have two graft permanents: both trigger when a creature enters
  Each trigger: independently decide whether to move a counter from each
  A creature entering could receive up to 2 counters (one from each graft)

COUNTER MODIFICATION:
  Hardened Scales on graft's entry: "enters with N counters" → Hardened Scales adds one more
  So Graft 2 with Hardened Scales enters with 3 counters
```

## Definitive Conclusions

- **Graft MOVES one counter** — doesn't create new ones.
- **The trigger is optional.** You may choose not to move.
- **If graft permanent has no counters, the ability can't be paid** (nothing to move).
- **Triggers for any creature entering,** including opponents'.
- **Multiple graft permanents trigger independently.**

## Canonical Example
**Novijen Sages (Graft 4):**
Enters with 4 +1/+1 counters. A new creature enters. Graft triggers: move one counter from Sages to the new creature. Sages now has 3 counters; new creature has 1. Later: another creature enters. Move again. Sages: 2 counters. And so on.

**Example 2 — Graft with persist creature:**
Graft permanent (3 counters). A creature with persist enters. Graft trigger: move a counter onto the persist creature. If persist creature dies (no -1/-1 counter), it returns. When it returns, graft triggers again: may move another counter.

## Commonly Confused With
- **P054 (Proliferate)** — Proliferate adds counters; graft moves counters. Different operations on counter pools.
- **P070 (Backup)** — Backup places new +1/+1 counters. Graft moves existing ones. Both interact with ETBs.
