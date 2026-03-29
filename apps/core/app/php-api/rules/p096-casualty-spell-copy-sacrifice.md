---
id: p096
name: Casualty — Sacrifice Creature to Copy Spell
category: stack
cr_refs: [702.153a, 702.153b]
tags: [casualty, sacrifice, copy, additional-cost, triggered, power-requirement, new-targets]
created: 2026-03-28
examples_count: 2
---

# P096 — Casualty — Sacrifice Creature to Copy Spell

## Abstract
Casualty N is an optional additional cost. When you pay it by sacrificing a creature with power N or greater, a triggered ability fires when the spell is cast, creating a copy of the spell (with optional new targets). Both the original spell and the copy go on the stack and resolve. The copy is created by a triggered ability — this means it can be responded to before the copy is created, and Stifle can counter the trigger (preventing the copy). The sacrifice is the additional cost; the copy creation is the triggered effect.

## The Definitive Rule

**CR 702.153a** (verbatim): *"Casualty is a keyword that represents two abilities. The first is a static ability that functions while the spell with casualty is on the stack. The second is a triggered ability that functions while the spell with casualty is on the stack. Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.' Paying a spell's casualty cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
CASUALTY STRUCTURE:
  1. Static ability (additional cost): optionally sacrifice a creature with power ≥ N
  2. Triggered ability: when you cast this spell, if casualty cost was paid, copy it

CASUALTY SEQUENCE:
  1. Announce spell
  2. Declare intention to pay casualty (optional)
  3. Choose creature to sacrifice (must have power ≥ N)
  4. Pay total cost: mana + sacrifice the creature
  5. Spell is cast (goes on the stack)
  6. Triggered ability fires: "when you cast this spell, if casualty paid..." → copy spell
  7. Copy goes on stack ABOVE the original
  8. Copy resolves first, then original

THE COPY:
  Created by a triggered ability (can be countered by Stifle)
  You may choose new targets for the copy (optional)
  The copy has the same characteristics as the original spell
  Both the original and copy resolve independently

POWER REQUIREMENT:
  Must sacrifice a creature with power ≥ N at time of sacrifice
  If the creature's power is modified between announcement and payment:
    Power check is at payment time (when you actually pay)
  Example: Casualty 2 → must sacrifice a creature with power ≥ 2

MULTIPLE CASUALTIES:
  CR 702.153b: multiple casualty instances are paid separately and trigger separately
  Can pay multiple casualty costs on the same spell → multiple copies (one per paid casualty)
```

## Definitive Conclusions

- **Casualty's sacrifice is an optional additional cost.** Not required.
- **The copy is created by a triggered ability.** Stifle can counter it; opponents can respond between spell cast and copy creation.
- **The copy goes on stack above the original.** Resolves first.
- **New targets for the copy are optional.** Can keep same targets.
- **Power check is at sacrifice payment time.**

## Canonical Example
**Body Count (Casualty 2, draw a card for each creature that died this turn):**
Sacrifice a 3/3 creature (power ≥ 2) as additional cost. Body Count is cast. Casualty trigger: copy Body Count. Choose new targets (Body Count has no targets — draw effect only). Original Body Count resolves: draw cards. Copy also resolves: draw more cards. Double the draws for one casualty sacrifice.

**Example 2 — Stifle on casualty:**
You cast a casualty spell, sacrifice the creature (cost paid). Casualty trigger fires. Opponent Stifles the trigger. Trigger is countered → no copy. Original spell still resolves normally (the cost was paid; only the triggered copy effect was countered).

## Commonly Confused With
- **P017 (Copy Spell Delayed Triggers)** — Casualty creates a copy via a triggered ability; the copy doesn't re-trigger casualty (the copy isn't "cast" from the casualty trigger's perspective).
- **P029 (Spell Copy Targeting)** — Casualty copies can have new targets chosen (optional), same as any copy. Independent fizzle applies.
