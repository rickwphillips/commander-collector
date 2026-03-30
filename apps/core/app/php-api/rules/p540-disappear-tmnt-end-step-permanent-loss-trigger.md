---
id: p540
name: Disappear (TMNT 2026) — End Step Permanent Loss Trigger and Replacement Interaction
category: triggered
cr_refs: [603.2, 603.6c, 614.1, 704.5d]
tags: [disappear, tmnt, triggered-ability, end-step, permanent-loss, replacement-effect, sacrifice, state-based]
created: 2026-03-30
examples_count: 2
---

# P540 — Disappear (TMNT 2026) — End Step Permanent Loss Trigger and Replacement Interaction

## Abstract

**Disappear** triggers "at the beginning of the end step if a permanent left the battlefield under your control this turn." The trigger checks whether a permanent left (via sacrifice, death, bounce, or other zone change). Disappear uses **last-known information** to determine what left. Replacement effects that prevent the permanent from leaving (e.g., "permanents you control can't be sacrificed") prevent the Disappear trigger from happening. If a replacement effect modifies the zone change (e.g., exiling instead of destroying), Disappear still triggers (a permanent left the battlefield).

## The Definitive Rules

**CR 603.2 (Triggered Abilities):** *"Triggered abilities trigger automatically when the game state matches their trigger condition."*

**CR 603.6c (Leaves-The-Battlefield Abilities):** *"Leaves-the-battlefield abilities use last-known information. The ability sees what the permanent was when it left."*

**CR 614.1 (Replacement Effects):** *"Replacement effects replace events. If a replacement prevents a permanent from leaving, the Disappear trigger doesn't happen (the event was prevented)."*

**Official Ruling (Disappear — TMNT 2026, 2026-03-06):** *"Disappear triggers if a permanent left the battlefield under your control during your turn. Replacement effects that prevent departure prevent the trigger."*

## The Pattern

```
DISAPPEAR TRIGGER:

  Ability: "[Creature] has 'At the beginning of the end step, if a permanent left
    the battlefield under your control this turn, [effect].'"

  Trigger checks at end-step beginning:
    - Did a permanent leave the battlefield? (via any zone change)
    - Under your control at the time? (you controlled it when it left)
    - This turn? (not previous turns)

  If all conditions true: Disappear trigger fires

TYPES OF PERMANENT LOSS:

  Sacrifice: Permanent is sacrificed (leaves battlefield → graveyard)
  Destroyed: Permanent is destroyed (leaves → graveyard, SBA)
  Bounced: Permanent is returned to hand (leaves → hand)
  Exiled: Permanent is exiled (leaves → exile)
  Death: Creature is put in graveyard (leaves due to lethal damage/toughness)

  All types trigger Disappear (any permanent leaving).

REPLACEMENT EFFECTS PREVENTING DEPARTURE:

  Replacement: "Permanents you control can't be sacrificed."
  If you try to sacrifice a permanent: Replacement prevents it
  Result: Permanent doesn't leave → Disappear doesn't trigger

  Replacement: "Permanents you control can't be destroyed."
  If a creature takes lethal damage: Replacement prevents destruction
  Result: Creature doesn't leave (remains on field) → Disappear doesn't trigger

REPLACEMENT EFFECTS MODIFYING DEPARTURE:

  Replacement: "If a permanent you control would be destroyed, exile it instead."
  If a creature would be destroyed: Replacement modifies (exile instead of graveyard)
  Result: Permanent still left the battlefield (exiled) → Disappear DOES trigger

MULTIPLE PERMANENT DEPARTURES:

  Two permanents leave during your turn (both under your control):
  At end step, Disappear checks: "Did a permanent leave?"
  Answer: Yes (two left)
  Disappear triggers once (not twice; the trigger fires if any permanent left)

  If Disappear has a mode (choose one), the trigger fires once per departure event.
  If two permanents left: one trigger, or multiple if the trigger stacks.

LAST-KNOWN INFORMATION:

  A permanent with abilities leaves the battlefield. Disappear uses LKI to determine
  what left, when it left, and its characteristics.

  Example: A 3/3 creature leaves. Disappear sees: "a 3/3 creature left."

```

## Definitive Conclusions

- **Disappear triggers if any permanent left under your control** — during your turn, at end step.
- **Replacement effects that prevent departure prevent the trigger** — if a permanent can't leave, Disappear doesn't fire.
- **Replacement effects that modify departure don't prevent the trigger** — if a permanent leaves (even if exiled instead of destroyed), Disappear fires.
- **Multiple departures trigger Disappear once** — the trigger fires when checking at end step (not once per permanent).

## Canonical Example

**Disappear Triggering on Sacrifice:**

You control a creature with Disappear: "At the beginning of the end step, if a permanent left the battlefield under your control this turn, [effect]."

During your turn, you sacrifice a creature to some effect. The creature leaves (goes to graveyard).

At end step, Disappear checks: "Did a permanent leave under your control this turn?" Yes. Disappear triggers and resolves.

**Example 2 — Replacement Prevents Disappear:**

You control the same Disappear creature. In play: "Permanents you control can't be sacrificed."

During your turn, you try to sacrifice a creature. The replacement prevents it: permanent doesn't leave the battlefield.

At end step, Disappear checks: "Did a permanent leave under your control this turn?" No (the sacrifice was prevented). Disappear does NOT trigger.

## Commonly Confused With

- **P603 (Triggered Abilities)** — P603 covers triggered ability mechanics; P539 applies to Disappear's specific end-step departure check.
- **P614 (Replacement Effects)** — P614 covers replacement effects; P540 clarifies how they interact with Disappear triggers.
