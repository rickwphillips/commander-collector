---
id: p539
name: Converge (SOS 2026) — Color Count and X Calculation, Cost-Reduction Interaction
category: costs
cr_refs: [601.2, 601.2f, 202.3, 107.4]
tags: [converge, sos, x-value, color-count, cost-reduction, mana-spent, phyrexian-mana]
created: 2026-03-30
examples_count: 2
---

# P539 — Converge (SOS 2026) — Color Count and X Calculation, Cost-Reduction Interaction

## Abstract

**Converge** uses the **number of distinct colors of mana spent to cast the spell** as the value of X. Mana paid by cost-reduction effects (like Atraxa) counts toward Converge; generic mana does NOT count (only colored mana counts). Phyrexian mana counts as the color it can be paid as. The count is determined when the spell is cast (at casting time), not at resolution. Cost-reduction effects reduce the mana payment but do not affect the Converge count — if you pay for three colors despite a cost reduction, Converge is 3.

## The Definitive Rules

**CR 601.2f (Cost Reduction):** *"A cost reduction applies when paying costs. Mana reductions reduce the mana component of a cost."*

**CR 202.3 (Mana and Colors):** *"Mana has a color (white, blue, black, red, green) or is colorless. Phyrexian mana represents a choice between paying life or mana of a specific color."*

**Official Ruling (Converge — SOS 2026, 2026-04-24):** *"Converge counts the number of distinct colors of mana paid. Generic mana doesn't count. Cost-reduction effects don't change the Converge count; only the actual mana spent matters."*

**Official Ruling (Phyrexian Mana and Converge — 2026-04-24):** *"If Phyrexian mana is paid with colored mana, it counts toward Converge for that color. If paid with life, it doesn't count."*

## The Pattern

```
CONVERGE CALCULATION:

  Converge spell: "Converge. This spell does X damage where X = the number of
    distinct colors of mana paid."

  Mana paid: {W}{U}{B} (white, blue, black)
  Distinct colors: 3 (W, U, B)
  Converge X: 3

GENERIC MANA:

  Mana paid: {W}{1}{U} (white, 1 generic, blue)
  Distinct colors: 2 (W, U)
  Generic mana doesn't count toward Converge
  Converge X: 2

MULTIPLE MANA OF SAME COLOR:

  Mana paid: {W}{W}{U}{B} (white, white, blue, black)
  Distinct colors: 3 (W, U, B)
  Only count unique colors (not quantity)
  Converge X: 3

COST REDUCTION AND CONVERGE:

  Spell costs {2}{W}{U}{B} (Converge spell)
  You have a cost-reduction effect: "-{1}" to all spell costs
  Actual payment: {1}{W}{U}{B}
  Distinct colors paid: 3 (W, U, B)
  Converge X: 3 (cost reduction doesn't change Converge)

PHYREXIAN MANA:

  Spell cost: {W/P}{U/P}{B} (Phyrexian white, Phyrexian blue, black)
  You pay: {W} (using colored mana) + 2 life (using life instead of {U})+ {B}
  Distinct colors paid: 2 (W, B) [the Phyrexian U was paid with life, not blue mana]
  Converge X: 2

  Alternative: You pay {W} + {U} + {B} (all colored mana)
  Distinct colors paid: 3 (W, U, B)
  Converge X: 3

CONVERGE WITH COST REDUCTION (REVISED):

  Cost-reduction effects reduce mana, but the actual colors paid still count.
  If you can reduce the cost but choose not to, Converge counts the full payment.
  If you reduce the cost, Converge counts only the reduced payment.

  Example: Converge spell costs {W}{U}{B} (Converge 3)
    - Full payment: {W}{U}{B} → Converge 3
    - With cost reduction -{1}: {1}{U}{B} → Converge 2 (white mana was reduced away)

```

## Definitive Conclusions

- **Converge counts distinct colors of mana paid** — generic mana doesn't count; only colored mana contributes.
- **Cost reduction affects the actual payment** — reducing the cost changes the mana paid and thus the Converge count.
- **Phyrexian mana counts if paid with colored mana** — if paid with life, it doesn't contribute to Converge.
- **Count is at casting time** — Converge X is determined when the spell is cast, not at resolution.

## Canonical Example

**Converge Spell with Three Colors:**

You cast a Converge spell (cost {2}{W}{U}{B}). You pay {W}{U}{B} for the colored mana and {2} generic.

Distinct colors of mana paid: 3 (white, blue, black). Converge X = 3.

**Example 2 — Cost Reduction and Converge:**

You control Atraxa (cost-reduction effect: spell costs {1} less). You cast the same Converge spell (cost {2}{W}{U}{B}, reduced to {1}{W}{U}{B}).

You pay {W}{U}{B} and {1} generic (colored mana: W, U, B).

Distinct colors paid: 3. Converge X = 3 (cost reduction didn't change the color count, only the total cost).

## Commonly Confused With

- **P016 (Cost Reduction)** — P016 covers generic cost reduction; P539 applies that to Converge's color-count mechanic.
- **P202 (Mana and Colors)** — P202 covers mana colors; P539 applies color distinction to Converge calculations.
