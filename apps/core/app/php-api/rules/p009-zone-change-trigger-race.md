---
id: p009
name: Zone-Change Trigger Race
category: zones
cr_refs: [603.6, 603.3b, 603.4, 706.10]
tags: [zone-change, graveyard, trigger, race, persist, undying, fizzle, simultaneous, death, resurrection]
created: 2026-03-28
examples_count: 2
---

# P009 — Zone-Change Trigger Race

## Abstract
When multiple zone-change triggered abilities fire on the same object simultaneously (e.g., two "when this dies" triggers on one creature), both go on the stack — but only the FIRST to resolve can successfully find the object in the expected zone and execute. The second trigger fizzles because the object has already been moved by the first. Controller of the object determines resolution order and therefore outcome.

## The Definitive Rule

**CR 603.6** — Zone-change triggers look for the object in the zone it moved to during resolution. If the object is no longer in that zone (because another effect moved it), the instruction fails to find the object and does nothing.

**CR 603.4 (Intervening-if clause)** — Conditions are checked at trigger time AND at resolution. Even if the condition passes both checks, the instruction still fails if the object can't be found in the expected zone.

**CR 603.3b** — Multiple simultaneous triggers: placed on stack in APNAP order. Within a player's triggers, that player chooses the order. **Last placed = first to resolve.**

**CR 706.10** — Object that moves to a new zone is a new object. Once the first trigger moves the creature from the graveyard back to the battlefield, it is a new object in a new zone. The second trigger's reference to the graveyard object finds nothing.

## The Pattern

```
WHEN multiple zone-change triggers fire on the same object:

  STEP 1: All triggers fire (if conditions met at trigger time)
  STEP 2: Controller places them on stack in chosen order
           Last placed = resolves first
  STEP 3: First trigger resolves:
           → Finds object in expected zone ✓
           → Executes instruction (e.g., moves object to battlefield)
           → Object is now a new object in a new zone
  STEP 4: Second trigger resolves:
           → Looks for object in expected zone (e.g., graveyard)
           → Object is no longer there → FIZZLES
           → Even if intervening-if condition is still technically true,
             the instruction cannot execute

CONTROLLER CHOICE IS DECISIVE:
  The player who controls the triggers picks the stack order,
  determining which effect resolves and which fizzles.
```

## Definitive Conclusions

- **Only one resurrection trigger "wins" per death event** — the first to resolve. All others fizzle.
- **Controller's stack-ordering choice determines the outcome** — this is a strategic decision.
- **Both triggers fire** at the time of death — neither is prevented from triggering. The fizzle happens at resolution, not at trigger time.
- **Subsequent deaths use normal rules** — on the next death, only whichever trigger's condition is still met will trigger. The other sees its condition as false (P006) and doesn't fire at all.
- **This is not a replacement-effect conflict** — nothing "instead" is happening. Two independent triggers both react to the same event, then one outpaces the other to the object.

## Canonical Example
**Persist + Undying on the same creature:**

Kitchen Finks (persist) + Mikaeus, the Unhallowed (gives all non-Humans undying) on the battlefield. Finks dies with no counters.

Both triggers fire. Controller stacks Undying on top (resolves first). Undying returns Finks with +1/+1 counter. Persist looks in graveyard — Finks is gone — fizzles.

Next death: Finks has +1/+1 counter → Undying won't fire (condition false). Persist fires → returns with -1/-1 counter. Creature alternates on subsequent deaths.

## Additional Examples

**Example 1b — Persist on a token (trigger fires, can't return):**
A token with persist dies with no -1/-1 counter. Persist triggers and goes on the stack. When the trigger resolves, it can't find the card to return — tokens in the graveyard cease to exist immediately (CR 704.5d). The trigger fires but fizzles. Persist can't return tokens from the graveyard because tokens don't exist there.
(Scryfall ruling 2013-06-07: "If a token with no -1/-1 counters on it has persist, the ability will trigger when the token is put into the graveyard. However, the token will cease to exist and can't return to the battlefield.")

**Example 1c — Persist vs. +1/+1 counters:**
A creature with persist has both +1/+1 counters and -1/-1 counters. SBAs first remove matched pairs (CR 704.5q). If any -1/-1 counters remain after matching, persist won't return the creature — persist checks last known information, which includes the surviving -1/-1 counter.

Example: Persist creature has 2 +1/+1 and 3 -1/-1 counters → SBA removes 2 pairs → creature has 0 +1/+1 and 1 -1/-1 counter → creature dies to 0 toughness → persist checks LKI: creature HAD a -1/-1 counter → persist does NOT trigger.
(Scryfall ruling 2013-06-07: "persist checks the creature's existence just before it leaves the battlefield, and it still has all those counters on it at that point")

**Example 2 — Two "when this dies, exile it" effects:**
A creature with two separate "when this dies, exile it" abilities (e.g., from two different sources). Both trigger. First resolves — exiles the creature. Second resolves — looks in graveyard — finds nothing — fizzles. Creature ends up exiled once, not twice.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — If these were replacement effects competing, a player would choose which applies (614.5). But they're triggers — they don't compete at event time; they race at resolution time. Fundamentally different.
- **P005 (Simultaneous Event Ordering)** — P005 covers multiple triggers on multiple objects. P009 is the specific sub-case where multiple triggers target the same single object, creating a first-mover fizzle dynamic.
- **P006 (Intervening If Clause)** — The intervening-if condition can still pass both checks yet the trigger fizzles anyway, because the condition check and the instruction execution are separate. A passing condition does not guarantee a trigger does anything.
