---
id: p497
name: Aura-Exile-Return Choice Mechanics — Non-Targeted Reattachment and Shroud Bypass
category: zones
cr_refs: [614.12c, 607.2, 109.1, 110.1]
tags: [aura, exile, reattachment, non-targeted, shroud, hexproof, banishing-light, oblivion-ring]
created: 2026-03-30
examples_count: 2
---

# P497 — Aura-Exile-Return Choice Mechanics — Non-Targeted Reattachment and Shroud Bypass

## Abstract

When an **Aura is exiled and returns** to the battlefield (via an effect like Banishing Light's "return it"), the Aura is **reattached via a choice mechanic** (the controller chooses what it attaches to), not a **targeting mechanic** (which would require announcement at cast time). This means Auras returning from exile can **attach to shrouded/hexproof permanents** that they could not have targeted. The distinction is critical: returning an Aura uses the **choice clause** of an ability (which doesn't count as targeting), not the **target clause** of the original Aura's enchantment.

## The Definitive Rules

**CR 614.12c (Enters with Effects):** *"As a permanent enters the battlefield, its controller may choose things related to how it enters. If an Aura is returning to the battlefield via a choice clause, the controller chooses what it attaches to (similar to 'as it enters')."*

**CR 607.2 (Linked Ability Pairs):** *"A linked ability pair consists of two abilities: one that removes an object from the battlefield, and another that returns it. The choice in the return ability is made when the return effect resolves."*

**CR 109.1 (Objects and Targeting):** *"Targeting and choosing are distinct. Targeting is an announcement-time mechanism; choosing is a resolution-time mechanism."*

**Official Ruling (Banishing Light vs. Oblivion Ring — 2014):** *"Banishing Light's return is a choice (owner chooses what the Aura attaches to). It can attach to shrouded creatures. Oblivion Ring's exile effect doesn't have a linked return; if the card is returned by another effect, it doesn't re-attach via the same ability."*

## The Pattern

```
AURA EXILE AND RETURN MECHANICS:

  Two types:

  TYPE 1: LINKED ABILITY PAIR (Banishing Light)
    First ability: "When this Aura enters or you control it, exile target artifact."
      → Targeting happens here (target chosen at cast/trigger)
    Second ability: "When [this Aura] leaves the battlefield, the exiled permanent
      returns to the battlefield under its owner's control."
      → Return is non-targeted; owner chooses attachment (not controller)

  TYPE 2: EXPLICIT RETURN CHOICE (Banishing Light specifically)
    First ability: "When this Aura enters, exile target [type]."
    Second ability: "...the exiled permanent returns."
    → Return is a choice by the controller (not targeting)

SHROUD/HEXPROOF BYPASS:

  Original exile target: creature without shroud (targeted)
  That creature gets shroud via continuous effect
  Aura is exiled
  Aura returns to battlefield

  Controller chooses what the Aura attaches to.
  Can it attach to the shrouded creature? YES
  Why? The return is a choice (not targeting); shroud doesn't prevent choices.

  Can it attach to a different creature with shroud? YES
  Why? The return mechanism allows any legal choice; shroud doesn't prevent attachment choices.

CHOICE MECHANICS VS. TARGETING:

  Targeting (has a target):
    - Requires a legal target to exist at announcement time
    - Shroud prevents targeting
    - The target is "locked in" when announced

  Choosing (is a choice):
    - Can happen at resolution time
    - Shroud doesn't prevent choices (only targets)
    - The choice can be any legal option at resolution time

BANISHING LIGHT SPECIFIC MECHANICS:

  Ability 1: "Whenever [this Aura] enters or you control it, exile target [type]."
    → This targets (must have a legal target at announcement)

  Ability 2: "When [this Aura] enters the battlefield or one or more other card types
    leaves the battlefield, the exiled permanent returns."
    → Return is non-targeted; controller of BL chooses what it attaches to

  Result: If the exiled creature gained shroud before returning, the Aura can still
    attach to it (choice, not target)

OBLIVION RING VS. BANISHING LIGHT:

  Oblivion Ring (older): "Exile target artifact, enchantment, or creature. When
    Oblivion Ring leaves the battlefield, the exiled card returns."
    → The return is from a separate ability (linked pair)
    → But the language doesn't explicitly say "you choose"
    → Older rulings interpret this as a choice anyway

  Banishing Light (newer): "When [this] enters or a nontoken permanent enters under
    your control, exile target [type]."
    → "The exiled permanent returns" is the return mechanic
    → Modern templating clarifies this as a choice

OWNER VS. CONTROLLER IN RETURNS:

  Some returns say "under its owner's control" (object returns to owner's control)
  Some say "under your control" (object returns to controller's control)

  Attachment choice:
    - If the Aura's return says "the exiled permanent returns," the Aura attaches based
      on who controls the Aura at return time
    - The choice is made by the Aura's controller
    - The exiled object returns to its owner's control (regardless of who made the choice)

```

## Definitive Conclusions

- **Aura return from exile is a choice, not a target** — shroud doesn't prevent the choice.
- **Linked pairs return via non-targeted mechanisms** — the first ability targets; the second ability chooses.
- **Banishing Light can attach to shrouded permanents on return** — because the return is a choice, not a targeting.
- **Choice clauses are evaluated at resolution time** — unlike targets, which are chosen at announcement time.

## Canonical Example

**Banishing Light Exiling and Returning to Shroud Creature:**

You control Banishing Light enchanting a creature. You activate Banishing Light: "exile target artifact."

There are two legal targets: Artifact A (no shroud) and Artifact B (with shroud). You target Artifact A (must be announced now; can't target Artifact B due to shroud).

Artifact A is exiled. Later, Banishing Light leaves the battlefield. "The exiled permanent returns."

At resolution, you choose what the exiled Artifact A attaches to. Artifact B has gained shroud by this point. Can you attach Artifact A (which is now returning) to Artifact B?

Answer: YES. The return is a choice, not a target. Artifact B's shroud doesn't prevent the choice; it only prevents targeting. Artifact A reattaches to Artifact B.

**Example 2 — Oblivion Ring Return:**

Oblivion Ring exiles a creature. That creature gains hexproof before Oblivion Ring leaves.

Oblivion Ring leaves. "The exiled creature returns."

The creature returns and reattaches. The hexproof it gained doesn't prevent reattachment (the return is a choice, not a target, even though older Oblivion Ring text doesn't explicitly say "you choose").

## Commonly Confused With

- **P002 (Replacement Effects)** — P002 covers replacement effects; P497 clarifies that Aura returns use choice clauses, not targeting.
- **P007 (Targeting Window)** — P007 covers targeting restrictions; P497 clarifies that choices (unlike targets) are not affected by shroud/hexproof.
- **P607 (Linked Abilities)** — P607 covers linked ability pairs; P497 applies that to Aura-specific return mechanics.
