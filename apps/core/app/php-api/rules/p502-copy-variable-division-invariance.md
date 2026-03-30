---
id: p502
name: Copy Variable-Division Invariance — Retained Division and X Values
category: stack
cr_refs: [706.2, 601.2, 701.26]
tags: [copy, divided, variable, distribution, X-value, invariance, preservation]
created: 2026-03-30
examples_count: 2
---

# P502 — Copy Variable-Division Invariance — Retained Division and X Values

## Abstract

When a **copy of a spell with divided damage or effects** is created (e.g., a copy of "Divide 4 damage among target creatures as you choose"), the copy **retains the original division**. If the original spell divided 4 damage as 2 to creature X and 2 to creature Y, the copy also divides the same way (2 to X, 2 to Y). The copy cannot redistribute the divided value among different targets. Additionally, **X values are locked**: if the original spell had X=3, the copy also has X=3 (not a new choice of X).

## The Definitive Rules

**CR 706.2 (Copy Effects):** *"When a spell is copied, the copy is created with the same characteristics as the original. If the original spell divides damage or other variable effects, the copy retains the same division."*

**CR 701.26 (Divide):** *"'Divide X as...' means the controller of the spell divides the value X among targets as specified. A copy of the spell retains the original division."*

**Official Ruling (Divide and Copy — 2020):** *"When a spell divides damage and is copied, the copy divides the same damage the same way. The copy cannot be divided differently."*

## The Pattern

```
DIVIDED DAMAGE WITH COPY:

  Original spell: "Fireball does 4 damage. Divide that damage among target creatures
    and planeswalkers as you choose."

  Original controller divides: 2 to creature A, 2 to creature B

  Copy of Fireball:
    Divided damage: 2 to creature A, 2 to creature B (same as original)
    Can copy choose new targets? YES (different creatures, but same division: 2-2)
    Can copy choose different division? NO (locked to 2-2)

VARIABLE X VALUES:

  Original spell: "Divide X damage among target creatures" where X = 6

  Copy of spell:
    X value: 6 (same as original)
    Division: Retains the original division of 6
    Can copy choose X=5? NO (X is locked to 6)

MULTIPLE DIVIDED VALUES:

  Original spell: "Deal 3 damage to two different targets. Deal 2 damage to another target."
    (Implicitly divided: 3 to A, 3 to B, 2 to C)

  Copy of spell:
    Division: 3 to A, 3 to B, 2 to C (same as original)
    Can copy choose 2 to A, 3 to B, 3 to C? NO

DISTRIBUTED TOKENS:

  Original spell: "Create 6 token creatures. Distribute them among target opponents as you choose."
    Distribution: 3 to opponent A, 3 to opponent B

  Copy of spell:
    Distribution: 3 to opponent A, 3 to opponent B (same)
    Can copy choose 2 to A, 4 to B? NO (distribution is locked)

COPIES OF COPIES:

  Original: Divided 4 damage as 2-2
  Clone copies it: Also divides 2-2
  Fork copies the Clone: Also divides 2-2

  Division propagates through copy chains.

```

## Definitive Conclusions

- **Copies retain the original's division** — divided damage, distributed tokens, etc., are locked in the copy.
- **X values are locked** — copies of spells with X in their cost or effect maintain the original X value.
- **Targets can differ** — the copy can target different creatures (but the division remains the same).
- **Division chains through copies** — copies of copies also preserve the original division.

## Canonical Example

**Copying a Divided Damage Spell:**

You cast Fireball ({3}{R}: "Deal 4 damage total. Divide that damage among target creatures and planeswalkers as you choose."). You divide 4 damage as 3 to creature A and 1 to creature B.

Opponent casts Fork, copying your Fireball.

Fork's copy:
  Damage divided: 3 to creature A, 1 to creature B (same as original)
  Can opponent change targets? YES (e.g., 3 to creature C, 1 to creature D)
  Can opponent redivide? NO (locked to 3-1 division)

**Example 2 — Copied Spell with Variable X:**

You cast Earthquake where X=5 ({5}{R}: "Earthquake deals 5 damage to each creature and player").

Opponent casts Narset's Reversal, copying Earthquake.

Narset's copy:
  X value: 5 (same as original; cannot be X=3 or X=6)
  Effect: Earthquake deals 5 to each creature and player (locked)

## Commonly Confused With

- **P501 (Modal Lock)** — P501 covers mode preservation in copies; P502 covers division/variable preservation.
- **P706 (Copy Effects)** — P706 covers general copy mechanics; P502 applies to specific division/distribution cases.
