---
id: p503
name: Entry-Trigger Suppression Scope — Replacement vs. Triggered Distinction
category: triggered
cr_refs: [603.6, 603.6a, 614.1c, 702.133, 117.2b]
tags: [entry-trigger, suppression, torpor-orb, replacement-effect, triggered-ability, etb]
created: 2026-03-30
examples_count: 2
---

# P503 — Entry-Trigger Suppression Scope — Replacement vs. Triggered Distinction

## Abstract

**Torpor Orb** and similar effects suppress **triggered abilities** that trigger "when [permanent] enters." However, they do **not** suppress **replacement effects** that modify how a permanent enters (e.g., "enters with X counters" or "as it enters, choose..."). The distinction is critical: triggered abilities are suppressed (they don't trigger); replacement effects apply normally (they modify the entry event itself). A permanent entering with Torpor Orb in play will still get its "enters with" counters or other replacement effects, but its ETB triggered abilities won't fire.

## The Definitive Rules

**CR 603.6a (Enters-The-Battlefield Triggers):** *"Whenever a permanent enters the battlefield, all applicable triggered abilities that trigger when that permanent enters fire."*

**CR 603.6d (Enters With Text):** *"If a permanent has an ability that describes how it enters (such as 'enters with' or 'as it enters'), that's a static ability, not a triggered ability. It applies as part of the entry process."*

**CR 614.1c (Replacement Effects):** *"Some effects modify how a permanent enters the battlefield. These are replacement effects and apply as part of the entry event."*

**CR 702.133 (Torpor Orb):** *"If a creature enters under your control, 'if', '.. entering', or an ability that triggers 'when this creature enters' or 'whenever a creature enters', that ability doesn't trigger."*

**Official Ruling (Torpor Orb Scope — 2020):** *"Torpor Orb suppresses triggered abilities that fire when a creature enters. Replacement effects (like 'enters with counters') still apply."*

## The Pattern

```
TRIGGERED ABILITIES (SUPPRESSED BY TORPOR ORB):

  Triggered: "Whenever this creature enters, draw a card."
    With Torpor Orb in play: Ability does NOT trigger (suppressed)

  Triggered: "When this creature enters, target opponent discards a card."
    With Torpor Orb in play: Ability does NOT trigger (suppressed)

REPLACEMENT EFFECTS (NOT SUPPRESSED):

  Replacement: "This creature enters with 3 +1/+1 counters."
    With Torpor Orb in play: Creature still enters with 3 counters (replacement applies)

  Replacement: "As this creature enters, choose a color."
    With Torpor Orb in play: Creature still enters with a chosen color (replacement applies)

ENTERING WITH ABILITY TEXT:

  Static ability: "Enter with [X]"
    - This is a replacement effect (modifies entry)
    - Torpor Orb does not suppress it

  Triggered ability: "Whenever this creature enters, [effect]"
    - This is a triggered ability
    - Torpor Orb DOES suppress it

DISTINGUISHING TRIGGERED FROM REPLACEMENT:

  "Enter with" = Replacement (static ability, part of entry)
  "Whenever enters" = Triggered (ability that fires on entry)
  "As enters" = Replacement (modifies entry)
  "When enters" = Triggered (fires on entry event)

MULTIPLE ABILITIES ON ENTRY:

  Creature with both:
    1. "Enters with 2 +1/+1 counters" (replacement)
    2. "Whenever this creature enters, draw a card" (triggered)

  With Torpor Orb in play:
    - Counters: Applied (replacement)
    - Draw: Suppressed (triggered)

  Creature enters with 2 counters but doesn't draw.

ETRIGGER ABILITIES:

  Some permanents have ETB-like triggered abilities that don't use "enters":
    "Whenever this permanent becomes tapped..." (not "enters")
    "At the beginning of your end step, if this permanent entered..." (checks condition, doesn't trigger on entry)

  Torpor Orb only suppresses abilities that explicitly trigger ON ENTRY.
  Other triggered abilities (even if they reference the entry event) are not suppressed by Torpor Orb.

```

## Definitive Conclusions

- **Torpor Orb suppresses triggered ETB abilities** — "whenever enters" triggers don't fire.
- **Torpor Orb does not suppress replacement effects** — "enters with" and "as enters" effects still apply.
- **Static abilities that modify entry are replacements** — Torpor Orb doesn't affect them.
- **Triggered abilities that reference entry (but don't trigger on it) are not suppressed** — only "enters" triggers are suppressed.

## Canonical Example

**Creature Entering with Torpor Orb:**

You control Torpor Orb. Opponent plays Mulldrifter ({1}{U}{U}: 2/2 creature, flying; "when it enters, draw a card").

Mulldrifter enters the battlefield:
- Triggered ETB: "when it enters, draw a card" — SUPPRESSED by Torpor Orb (doesn't draw)
- Evoke ability: Mulldrifter can still be evoked (not suppressed; evoke is a cost, not an ETB trigger)

Mulldrifter is on the battlefield (2/2, flying) but Opponent did not draw a card.

**Example 2 — Enters With Counters:**

You control Torpor Orb. Opponent plays Scion of the Wild ({1}{G}{G}: 2/2, "Scion enters with a number of +1/+1 counters equal to the number of creatures you control").

Scion enters:
- Replacement effect: "enters with X counters" — APPLIES normally (Torpor Orb doesn't suppress replacements)
- If Opponent controls 3 creatures: Scion enters with 3 +1/+1 counters (becomes 5/5)

Scion is on the battlefield with the counters (replacement was not suppressed).

## Commonly Confused With

- **P006 (Triggered Ability Double-Trigger)** — P006 covers ability firing; P503 clarifies which ETB abilities are suppressed (triggered, not replacement).
- **P603 (Triggered Abilities)** — P603 covers triggered ability mechanics; P503 applies to ETB-specific suppression.
- **P614 (Replacement Effects)** — P614 covers replacement effects; P503 distinguishes them from triggered abilities for suppression purposes.
