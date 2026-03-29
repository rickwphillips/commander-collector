---
id: p074
name: Afterlife — Spirit Token on Death
category: triggered
cr_refs: [702.135a, 702.135b]
tags: [afterlife, spirit, token, flying, death, LTB, graveyard, multiple-instances, ETB]
created: 2026-03-28
examples_count: 2
---

# P074 — Afterlife — Spirit Token on Death

## Abstract
Afterlife is a triggered ability that fires when the permanent with afterlife is put into a graveyard from the battlefield. It creates N 1/1 white and black Spirit creature tokens with flying. Multiple instances of afterlife on the same permanent each trigger separately, potentially creating many tokens. Afterlife only triggers on death (to graveyard), not on exile, bounce, or other zone changes.

## The Definitive Rule

**CR 702.135a** (verbatim): *"Afterlife is a triggered ability. 'Afterlife N' means 'When this permanent is put into a graveyard from the battlefield, create N 1/1 white and black Spirit creature tokens with flying.'"*

**CR 702.135b** (verbatim): *"If a permanent has multiple instances of afterlife, each triggers separately."*

## The Pattern

```
AFTERLIFE TRIGGER:
  Condition: "put into a graveyard from the battlefield"
  → Creature dies (destroyed, sacrificed, lethal damage + SBA)
  → NOT: exiled (exile ≠ graveyard)
  → NOT: bounced (hand ≠ graveyard)
  → NOT: milled (library ≠ battlefield, so no LTB trigger)
  Wait: "put into a graveyard from the battlefield" means it was ON the battlefield first
    → If the creature is somehow destroyed and replaced (indestructible): doesn't die
    → If regenerated: doesn't die (no graveyard entry from battlefield)

TOKEN CREATED:
  N 1/1 white AND black Spirit creature tokens with flying
  Bicolor (white and black) tokens
  Subtype: Spirit
  Flying on each
  Enters the battlefield → ETB triggers for Spirit-relevant abilities fire

MULTIPLE AFTERLIFE INSTANCES:
  Afterlife 1 twice = 2 separate triggers, each creating 1 token = 2 tokens total
  Afterlife 2 + Afterlife 1 = one trigger for 2 tokens + one trigger for 1 token = 3 tokens
  (Each instance triggers independently)

INDESTRUCTIBLE AND AFTERLIFE:
  Indestructible: can't be destroyed → doesn't go to graveyard from battlefield → no afterlife
  But: sacrificed → goes to graveyard → afterlife triggers
    (Sacrifice overrides indestructible: indestructible only stops destroy, not sacrifice)

DOUBLING EFFECTS:
  Anointed Procession: "if an effect would create tokens, create twice that many"
  Afterlife 2 + Anointed Procession: create 4 Spirit tokens (2 doubled)
  Multiple Anointed Processions: each doubles the previous total
```

## Definitive Conclusions

- **Afterlife triggers on death (to graveyard), not exile or bounce.**
- **Each instance of afterlife triggers separately.** Two afterlife instances = two separate triggers = separate token creations.
- **Indestructible permanents with afterlife: afterlife triggers if sacrificed** but NOT if destroyed (indestructible prevents destruction).
- **Doubling effects (Anointed Procession) apply to each afterlife trigger independently.**
- **Spirit tokens are 1/1 white and black with flying.**

## Canonical Example
**Ministrant of Obligation (Afterlife 2):**
Ministrant is destroyed. Afterlife 2 triggers: create two 1/1 white and black Spirit tokens with flying. With Anointed Procession: create four Spirit tokens instead.

**Example 2 — Multiple afterlife instances:**
A creature has two separate instances of "Afterlife 1" (from two different effects). When it dies: both trigger, resolving separately. First trigger: create 1 Spirit token. Second trigger: create 1 Spirit token. Total: 2 Spirit tokens. With Anointed Procession: each trigger creates 2 tokens → 4 total.

## Commonly Confused With
- **P009 (Zone-Change Trigger Race)** — Afterlife fires when going to graveyard; if the creature had persist/undying, both afterlife and persist/undying fire simultaneously.
- **P005 (Simultaneous Event Ordering)** — If multiple afterlife creatures die at once (e.g., Wrath of God), all afterlife triggers fire and are placed on stack in APNAP order.
