---
id: p177
name: Casualty — Sacrifice a Creature to Copy a Spell
category: stack
cr_refs: [702.153a, 702.153b]
tags: [casualty, sacrifice, copy, power-threshold, additional-cost, Streets-New-Capenna, Maestros, new-targets]
created: 2026-03-28
examples_count: 2
---

# P177 — Casualty — Sacrifice a Creature to Copy a Spell

## Abstract
Casualty N is an optional additional cost: sacrifice a creature with power N or greater when casting the spell. If you do, when you cast it, create a copy of the spell (with the option to choose new targets for the copy). This gives you two copies of the spell for the price of a sacrifice. The power requirement filters which creatures can be sacrificed — Casualty 2 needs a 2+ power creature. Like conspire, casualty's trigger fires "when you cast this spell, if casualty was paid" — so it's a casting trigger, not a resolution trigger.

## The Definitive Rules

**CR 702.153a** (verbatim): *"Casualty is a keyword that represents two abilities. The first is a static ability that functions while the spell with casualty is on the stack. The second is a triggered ability that functions while the spell with casualty is on the stack. Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.' Paying a spell's casualty cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
CASUALTY:
  Additional cost (optional): sacrifice a creature with power ≥ N
  If paid: triggered ability on cast → copy the spell (may choose new targets for copy)
  Two copies of the spell total (original + copy)

  CASUALTY + POWER THRESHOLD:
    Casualty 1: sacrifice any creature with power ≥ 1 (1/1 or better)
    Casualty 2: sacrifice any creature with power ≥ 2
    Casualty 3: sacrifice a creature with power ≥ 3
    Power is checked at sacrifice time

  CASUALTY + COPY TARGETS:
    "If the spell has any targets, you may choose new targets for the copy"
    Original spell: targets creature A
    Copy: you may choose to target creature B (or same target)
    Double removal: kill two creatures with one spell

  CASUALTY + COUNTERSPELLS:
    A copy created by casualty is on the stack separately
    If the original is countered: the copy still resolves (copies don't get "uncountered" when original is countered)
    Actually: the copy is already on the stack from a triggered ability
    The original and the copy are separate spells — countering one doesn't affect the other

  CASUALTY + SACRIFICE OUTLET:
    You can sacrifice a creature you were going to sacrifice anyway (to a sac outlet, Phyrexian Altar, etc.)
    Using casualty as an incidental cost: if you'd sacrifice the creature anyway, casualty gives you a free spell copy

  CASUALTY + TOKENS:
    A 2/2 token satisfies Casualty 2
    Generate tokens, sacrifice them for casualty
    Maestros Initiate: creature that creates a 1/1 token on ETB → sacrifice the token for Casualty 1

  CASUALTY + SAGA COPIES:
    If the casualty spell is a Saga? Actually Sagas aren't instants/sorceries normally
    Casualty applies to the spell on the stack

  CASUALTY MULTIPLE:
    CR 702.153b: multiple instances of casualty are paid separately and trigger separately
    Two casualty triggers on the same spell: each creates a copy if paid
    Two copies + the original = 3 total (if both paid)
```

## Definitive Conclusions

- **Casualty sacrifices a creature with power ≥ N** as an optional additional cost.
- **If paid, creates a copy of the spell** when cast — the copy can have new targets.
- **Original and copy are independent** on the stack — countering one doesn't affect the other.
- **Tokens satisfy casualty** — sacrifice a 1/1 token for Casualty 1.
- **Two casualty instances** = up to three copies of the spell total.

## Canonical Example
**Make Disappear (Casualty 1, Counterspell variant):**
Counter target spell unless its controller pays {1}.
Pay Casualty 1: sacrifice a 1/1 creature → create a copy.
Original: target their main threat.
Copy (new targets): target their backup spell.
Both spells must be paid for or be countered — you're countering two spells for one card.

**Example 2 — Body Count (Casualty 2, Draw cards = number of creatures that died):**
Sacrifice a 2/2 → copy Body Count.
Both copies resolve: draw cards based on creatures that died (the 2/2 you sacrificed counts).
If 3 creatures died this turn: draw 3 + draw 3 = draw 6 total.
Casualty turns a situational draw spell into massive card advantage.

## Commonly Confused With
- **P178 (Conspire)** — Conspire taps two creatures of the same color to copy. Casualty sacrifices one creature of sufficient power.
- **P036 (Storm)** — Storm copies for each previous spell. Casualty copies for one sacrificed creature.
- **P086 (Devour)** — Devour sacrifices creatures as a permanent enters. Casualty sacrifices to copy a spell.
