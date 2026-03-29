---
id: p157
name: Undying and Persist — Death Return with Counter Condition
category: triggered
cr_refs: [702.93a, 702.79a]
tags: [undying, persist, +1/+1, -1/-1, death, return, graveyard, condition, Kitchen-Finks, Mikaeus, Melira]
created: 2026-03-28
examples_count: 2
---

# P157 — Undying and Persist — Death Return with Counter Condition

## Abstract
Two mirror-image death-return mechanics. **Undying**: when this permanent dies, if it had NO +1/+1 counters on it, return it to the battlefield with a +1/+1 counter. **Persist**: when this permanent dies, if it had NO -1/-1 counters on it, return it to the battlefield with a -1/-1 counter. Both return the creature exactly once (the counter from the trigger prevents a second return). Key interaction: undying and persist can be looped by removing or canceling the counter — with Mikaeus the Unhallowed (grants undying) + Melira (prevents -1/-1 counters), persist creatures become immortal (see P139).

## The Definitive Rules

**CR 702.93a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

## The Pattern

```
UNDYING:
  Triggered: when this permanent dies (put into graveyard from battlefield)
  Condition: it had NO +1/+1 counters on it at time of death
  Effect: return to battlefield under owner's control with ONE +1/+1 counter

  UNDYING ONCE:
    The +1/+1 counter from undying prevents undying from triggering again on next death
    Creature dies, returns with +1/+1 → dies again → had a +1/+1 counter → undying doesn't trigger
    Use: exactly one free death per creature

PERSIST:
  Triggered: when this permanent dies
  Condition: it had NO -1/-1 counters on it at time of death
  Effect: return to battlefield under owner's control with ONE -1/-1 counter

  PERSIST ONCE:
    The -1/-1 counter prevents persist from triggering again
    After persist triggers, creature returns smaller → dies → had -1/-1 counter → no second return

COUNTER CANCELLATION (UNDYING + PERSIST):
  If a creature has both +1/+1 and -1/-1 counters: SBA removes both simultaneously
  A 2/2 with undying: dies → returns with +1/+1 (3/3 now) → someone puts a -1/-1 counter on it
  Now has +1/+1 and -1/-1: SBA removes both → 2/2 with no counters
  Undying condition: "no +1/+1 counters" → TRUE (the +1/+1 was removed by SBA)
  Dies again → undying triggers again → returns again!
  This creates a LOOP if a free -1/-1 counter source is available

UNDYING LOOP (Mikaeus):
  Mikaeus, the Unhallowed: "Other nonhuman creatures you control have undying"
  Combine with a sacrifice outlet + a creature with undying:
    Creature dies → undying → returns with +1/+1
    Sacrifice it again → it had +1/+1 → undying doesn't re-trigger → creature gone
    Need counter removal to loop

PERSIST LOOP (Melira — see P139):
  Melira, Sylvok Outcast: "Creatures you control can't have -1/-1 counters placed on them"
  Persist creature dies → would return with -1/-1 → Melira prevents the counter placement
  Creature returns with NO -1/-1 counter → condition for next persist: "no -1/-1 counter" → TRUE
  Dies again → persist again → returns again → INFINITE LOOP
  With a free sacrifice outlet (Viscera Seer) and life gain (Kitchen Finks): infinite life

UNDYING + WITHER:
  A wither creature deals damage → -1/-1 counters placed on undying creature
  If undying creature has a -1/-1 counter removed its +1/+1 will show
  The interaction between +1/+1 and -1/-1 counters is key (SBA cancellation)

UNDYING + HARDENED SCALES:
  Hardened Scales: "+1 counter placed on a creature gets +1 more"
  Undying trigger places ONE +1/+1 counter → Hardened Scales → TWO +1/+1 counters
  Creature returns larger than expected

PERSIST VS UNDYING CONDITION TIMING:
  "If it had no [counter]" — checked at time of death (last known information)
  If counter was removed just as the creature died (e.g., proliferate opponent removed them):
  The check is at the moment of dying — the state then
  If it HAD a +1/+1 counter and died: undying doesn't trigger regardless of subsequent events
```

## Definitive Conclusions

- **Undying returns once** — the +1/+1 counter it enters with prevents a second return.
- **Persist returns once** — the -1/-1 counter it enters with prevents a second return.
- **Counter cancellation loops undying/persist** — SBA removes paired +1/+1 and -1/-1 counters, resetting the condition.
- **Melira + persist = infinite loop** with a free sacrifice outlet (Kitchen Finks combo).
- **The condition is checked at the moment of death** using last known information.

## Canonical Example
**Voice of Resurgence (no undying/persist) → illustrating loop with Strangleroot Geist (Undying):**
Strangleroot Geist (2/1 haste, undying): attack → dies in combat.
Undying trigger: was it clean (no +1/+1 counter)? Yes → return with +1/+1 → enters as 3/2 haste.
Opponent kills it again → it had +1/+1 → undying doesn't trigger → it's gone.
Net: two attacks (2/1 first, 3/2 second) from one card.

**Example 2 — Persist Infinite Combo:**
Kitchen Finks (3/2, Persist, Lifelink when it enters)
Viscera Seer (sacrifice outlet: scry 1)
Melira, Sylvok Outcast (creatures can't have -1/-1 counters)

Sacrifice Kitchen Finks to Viscera Seer → persist triggers → would return with -1/-1 → Melira prevents it → returns clean → Kitchen Finks ETB: gain 2 life, scry 1.
Sacrifice again → infinite life, infinite scry, infinite ETB triggers.

## Commonly Confused With
- **P139 (Wither + Persist)** — P139 covers the Melira infinite loop in full detail. This pattern focuses on the standalone rules of undying and persist.
- **P112 (Vanishing)** — Vanishing sacrifices on counter depletion. Persist/undying return on death with counters.
- **P082 (Unearth)** — Unearth returns a creature temporarily with haste, then exiles at end step. Persist/undying return permanently (but with a counter).
