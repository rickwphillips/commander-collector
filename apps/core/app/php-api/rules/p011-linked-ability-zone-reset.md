---
id: p011
name: Linked Ability Zone Reset
category: zones
cr_refs: [607.1, 607.2a, 706.10, 603.6c]
tags: [linked-abilities, zone-change, exile, return, oblivion-ring, etb, ltb, new-object, nesting, memory]
created: 2026-03-28
examples_count: 1
---

# P011 — Linked Ability Zone Reset

## Abstract
When a permanent has two linked abilities — one that exiles something (ETB) and one that returns it (LTB) — the LTB only returns what *this instance* of the ETB put into exile. If the permanent changes zones and re-enters the battlefield, it is a new object (CR 706.10) with a fresh, empty pair of linked abilities. It has no memory of what any previous instance exiled. Additionally, a critical timing insight applies: the LTB fires the moment the permanent *leaves* the battlefield, not when some other effect that captured it is later destroyed. This makes "nested exile" (A exiles B, B exiles X) impossible — B's LTB fires immediately when B leaves, returning X before A can "hold" it.

## The Definitive Rule

**CR 607.1**: *"An object may have two abilities printed on it such that one of them causes actions to be taken... and the other one directly refers to those actions... If so, these two abilities are linked: the second refers only to actions that were taken... by the first, and not by any other ability."*

**CR 607.2a**: The second ability (LTB) refers only to cards in the exile zone that were put there by the first ability (ETB) on that same object.

**CR 706.10**: An object that moves zones becomes a new object with no memory of its previous existence.

**CR 603.6c**: Leaves-the-battlefield abilities use last known information — and they trigger immediately when the permanent leaves, regardless of what caused it to leave.

## The Pattern

```
FOR a permanent with linked ETB (exiles) + LTB (returns):

  RULE 1: LTB refers only to what THIS INSTANCE'S ETB put in exile.
           Zone change = new instance = empty exile tracking.

  RULE 2: LTB triggers the moment the permanent leaves the battlefield.
           It does NOT wait for the cause of departure to resolve or be destroyed.

  CONSEQUENCE: "Nested exile" is impossible.

  Example:
    A exiles B (B leaves battlefield → B's LTB fires → returns X immediately)
    Result: X is back. A now holds B. When A is destroyed, only B returns.
    B enters as new object → fires new ETB → must exile a new target.

  NOT how it works:
    × A holds B, B holds X simultaneously
    × Destroying A causes both B and X to return at once
    × B returning "remembers" it was exiling X
```

## Definitive Conclusions

- **Nested exile cannot exist.** When permanent A exiles permanent B (which was exiling Threat X), B's LTB fires immediately — Threat X returns the moment B leaves, not when A is later destroyed.
- **Destroying A only returns B.** A's LTB returns B to the battlefield. B is a new object, exiling nothing.
- **B's new ETB fires.** B must exile a new target. Its linked LTB will return whatever the new ETB exiles.
- **If B's new ETB has no legal targets**, it's countered at resolution. B stays on the battlefield. Its LTB will return nothing when it eventually leaves.
- **Multiple Oblivion Rings pointing at each other** creates a chain of ETB triggers, not a nested "cage." Each departure immediately releases whatever that ring was holding.
- **Zone-change identity (P003) is always in play.** Every time an Oblivion Ring-style permanent enters the battlefield — including via its own chain of effects — it is a new object starting fresh.

## Canonical Example
**Oblivion Ring vs. Oblivion Ring:**

O-Ring B enters → ETB exiles Threat X. O-Ring A enters → ETB targets and exiles O-Ring B.

O-Ring B leaves battlefield → O-Ring B's LTB fires → Threat X returns to battlefield.

Board: Threat X on battlefield. O-Ring A on battlefield, holding O-Ring B in exile.

O-Ring A is destroyed → O-Ring A's LTB fires → O-Ring B returns to battlefield as new object.

O-Ring B's ETB fires (new instance, must exile a new target). O-Ring B's LTB is linked to this new ETB — it has not exiled anything yet.

Commonly mistaken outcome: "Destroying A returns both B and X" — WRONG. X returned when B left (Step 1), not when A was destroyed (Step 4).

## Additional Examples

*(Add over time)*

## Commonly Confused With
- **P003 (Zone Change Identity)** — P011 extends P003. The zone-change-creates-new-object rule is what resets the linked ability pair. P003 is the foundation; P011 is the application to linked exile effects specifically.
- **P009 (Zone-Change Trigger Race)** — P009 covers multiple triggers competing over the same object. P011 covers a single linked pair whose tracking resets at each zone change. Different structure.
- **P002 (Replacement vs. Trigger)** — The LTB of Oblivion Ring is a triggered ability (not a replacement). It fires after the event (leaving the battlefield), not instead of it. Nothing "instead" is happening.
