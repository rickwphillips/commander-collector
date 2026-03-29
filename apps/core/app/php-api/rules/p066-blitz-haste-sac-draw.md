---
id: p066
name: Blitz — Alternative Cost with Haste, Sac, Draw
category: costs
cr_refs: [702.152a, 702.152b]
tags: [blitz, alternative-cost, haste, sacrifice, draw, end-step, delayed-trigger, death-trigger]
created: 2026-03-28
examples_count: 2
---

# P066 — Blitz — Alternative Cost with Haste, Sac, Draw

## Abstract
Blitz is an alternative cost that makes the permanent enter with haste and creates a delayed triggered ability to sacrifice it at the next end step. Additionally, while the blitz cost was paid, the permanent has "when this permanent is put into a graveyard from the battlefield, draw a card." This makes Blitz a powerful value mechanic: attack immediately, get a draw on death. Paying blitz gives haste and the draw trigger; not paying doesn't. The sacrifice happens at the beginning of the NEXT end step, not the current one.

## The Definitive Rule

**CR 702.152a** (verbatim): *"Blitz represents three abilities: two static abilities that function while the card with blitz is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with blitz is on the battlefield. 'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

## The Pattern

```
BLITZ ABILITIES (when blitz cost is paid):
  1. Haste (static ability while on battlefield with paid blitz)
  2. Delayed sacrifice trigger: beginning of next end step, sacrifice this permanent
  3. Death draw: "when this is put into a graveyard from the battlefield, draw a card"
     (this is a triggered ability while the blitz cost was paid)

SEQUENCE WHEN CAST WITH BLITZ:
  1. Cast using blitz cost (alternative cost — pays instead of mana cost)
  2. Permanent enters: has haste + death draw ability
  3. Can attack immediately (haste)
  4. At beginning of NEXT end step: sacrifice trigger fires
     → Even if sacrificed in your end step, it's still "next end step" from when it entered
  5. When sacrificed (put into graveyard from battlefield): death draw triggers → draw a card

NEXT END STEP:
  "Beginning of next end step" = beginning of the end step of the current turn (if it hasn't happened)
    or the next turn's end step
  If cast during main phase 1: can attack, then sacrifice at this turn's end step
  The sacrifice trigger is a delayed trigger (fires exactly once)

DEATH DRAW TRIGGER:
  "When this permanent is put into a graveyard from the battlefield, draw a card"
  This is conditional on blitz cost being paid (static ability that adds it)
  The trigger fires on ANY death while blitz was paid:
    → Opponent destroys it before end step → trigger still fires → draw a card
    → You sacrifice it via another effect before end step → trigger fires → draw
    → It dies in combat → trigger fires → draw
  You get the draw whenever it leaves the battlefield to the graveyard (regardless of cause)

IF BLITZ PERMANENT DOESN'T DIE:
  Sundial of the Infinite: exile the end step trigger → permanent isn't sacrificed
    → Retains haste and death draw indefinitely (until it actually dies)
  Indestructible: if destroyed, still triggers draw (indestructible stops DESTROY not sacrifice)
    Sacrifice trigger at end step: you sacrifice → graveyard → draw
  Exiled instead of graveyard: death draw does NOT trigger
    (The trigger says "put into a graveyard" — exile is not the graveyard)

MULTIPLE INSTANCES:
  CR 702.152b: if multiple instances of blitz, only one can be used to cast the spell
  Multiple instances on battlefield refer only to payments made for that specific instance
```

## Definitive Conclusions

- **Blitz grants haste + delayed sacrifice trigger + death draw.** All three only if blitz cost paid.
- **Sacrifice happens at beginning of the NEXT end step,** not immediately.
- **Death draw triggers on ANY death while blitz was paid** — not just sacrifice from the delayed trigger.
- **If the permanent is exiled instead of going to the graveyard**, the death draw does NOT trigger.
- **Sundial of the Infinite can exile the sacrifice trigger** to keep the permanent permanently.

## Canonical Example
**Blitz creature (Blitz {1}{R}):**
Cast with blitz cost. Enters with haste and "when this dies, draw a card." Attack for 3 damage. End of turn: sacrifice trigger fires, sacrifice it, it goes to graveyard, draw a card. Net: 3 damage dealt, one card drawn, cost was {1}{R} vs. the normal mana cost.

**Example 2 — Opponent destroys the blitz creature before end step:**
Cast with blitz. During combat, opponent kills it with an instant. Creature goes to graveyard. "When this is put into a graveyard from the battlefield, draw a card" triggers — you draw a card. End step: the sacrifice trigger fires, tries to sacrifice, but creature is already dead — trigger finds nothing to sacrifice, does nothing (or the delayed trigger was already removed when the permanent left). Net: still drew a card from the death.

## Commonly Confused With
- **P035 (Ninjutsu)** — Another mechanic that enters attacking. Blitz gives haste to attack normally; ninjutsu swaps in.
- **P022 (End-Turn Stack Exile)** — Blitz's sacrifice trigger fires at beginning of end step; Sundial can exile it during that step.
