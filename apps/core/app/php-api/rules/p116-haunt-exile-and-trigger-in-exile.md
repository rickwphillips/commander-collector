---
id: p116
name: Haunt — Exile on Death, Then Trigger from Exile
category: triggered
cr_refs: [702.55a, 702.55b, 702.55c]
tags: [haunt, exile, death, graveyard, trigger, exile-zone, haunted-creature, zone-trigger]
created: 2026-03-28
examples_count: 2
---

# P116 — Haunt — Exile on Death, Then Trigger from Exile

## Abstract
Haunt is a two-phase mechanic. Phase 1: When a creature with haunt dies (or an instant/sorcery with haunt resolves), exile the card haunting a target creature. Phase 2: When the haunted creature dies, trigger the haunt's ability from exile (even though the card is in the exile zone). This is one of the few cases where a card can have triggered abilities that function from the exile zone. The haunted creature is the trigger — if it leaves the battlefield without dying (bounced, exiled, etc.), the haunt card remains in exile but never triggers.

## The Definitive Rule

**CR 702.55a** (verbatim): *"Haunt is a triggered ability. 'Haunt' on a permanent means 'When this permanent is put into a graveyard from the battlefield, exile it haunting target creature.' 'Haunt' on an instant or sorcery spell means 'When this spell is put into a graveyard during its resolution, exile it haunting target creature.'"*

**CR 702.55b** (verbatim): *"Cards that are in the exile zone as the result of a haunt ability 'haunt' the creature targeted by that ability."*

**CR 702.55c** (verbatim): *"Triggered abilities of cards with haunt that refer to the haunted creature can trigger in the exile zone."*

## The Pattern

```
PHASE 1 — HAUNTING:
  Permanent with haunt:
    Dies → exile it → haunt triggers targeting a creature
  Instant/sorcery with haunt:
    Resolves → goes to graveyard as part of resolution → exile it → haunt triggers targeting a creature
  The target creature is now "haunted" by the exiled card

PHASE 2 — TRIGGER FROM EXILE:
  When the haunted creature is put into a graveyard from the battlefield:
  The haunt card's ability triggers FROM THE EXILE ZONE (702.55c)
  The ability resolves with whatever effect the card says

WHAT TRIGGERS THE HAUNT EFFECT:
  The haunted creature must DIE (put into graveyard from battlefield)
  Not: exiled (the haunted creature is exiled → haunt card stays in exile but doesn't trigger)
  Not: bounced (returned to hand → haunt card stays in exile, no trigger)
  Only death (battlefield → graveyard) triggers the second ability

MULTIPLE HAUNT TARGETS:
  Only one haunt can target a given creature (the card haunts ONE creature)
  If the haunted creature gets haunted again: it has two haunt cards attached
  When it dies: both haunt triggers fire

HAUNTED CREATURE CHANGES ZONES:
  If haunted creature leaves battlefield WITHOUT going to graveyard:
    The haunt card stays in exile forever (unless another effect moves it)
    The haunt trigger never fires

NEW OBJECT IDENTITY (P003):
  The "haunted creature" refers to the specific object when it was targeted
  If that creature dies and returns (persist, undying): it's a new object
    The haunt effect triggered (it died) → new object on battlefield is NOT haunted
  If that creature bounces and replays: not the same object → haunt trigger won't fire again

INSTANT/SORCERY WITH HAUNT:
  The card's effect resolves first, THEN it goes to graveyard, THEN haunt triggers
  Haunt exile happens as part of "being put in graveyard during resolution"
```

## Definitive Conclusions

- **Haunt exiles the card haunting a target creature.** The card then triggers from exile when the haunted creature dies.
- **The trigger only fires when the haunted creature DIES.** Exile, bounce, or other zone changes don't trigger it.
- **Triggered abilities work from the exile zone** for haunt cards (CR 702.55c).
- **The haunted creature identity is fixed.** New objects (e.g., after persist return) are not haunted.

## Canonical Example
**Pillory of the Sleepless (enchantment with Haunt) on a creature:**
Actually Pillory enchants while on battlefield. When it leaves: exile it haunting a creature.
When that creature dies: its controller loses 1 life (Pillory's haunt effect fires from exile).

**Example 2 — Creature with Haunt:**
Ghost Council of Orzhova: "When this is put into a graveyard, exile it haunting target creature."
"When the haunted creature is put into a graveyard, you may return this card from exile to the battlefield."
Ghost Council dies → exile haunting opponent's 5/5. When that 5/5 dies: Ghost Council returns to battlefield.

## Commonly Confused With
- **P003 (Zone Change Identity)** — The haunted creature is a specific object; dying and returning makes it a new object (not haunted anymore).
- **P082 (Unearth)** — Also involves returning from exile, but triggers are completely different.
- **P011 (Linked Ability Zone Reset)** — Haunt is another linked-ability pair that spans zones.
