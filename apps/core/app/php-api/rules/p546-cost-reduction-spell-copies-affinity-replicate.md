---
id: p546
name: Cost-Reduction Mechanics and Spell Copies — Affinity, Replicate, Fork
category: copy
cr_refs: [706.10, 601.2f, 707.1, 117.2]
tags: [cost-reduction, affinity, replicate, fork, copy-spell, mana-value, spell-cost, free-cast]
created: 2026-03-30
examples_count: 2
---

# P546 — Cost-Reduction Mechanics and Spell Copies — Affinity, Replicate, Fork

## Abstract

**Copies of spells do not inherit cost-reduction effects applied to the original spell.** When a spell with Affinity is copied (via Replicate, Fork, Twincast), the copy is created with the **base mana cost**, not the reduced cost paid for the original spell. The cost-reduction effect (Affinity, Goblin Electromancer, etc.) applies only at the time of casting the original spell; it does not carry forward to copies. Replicate copies have their own independent cost (Replicate {R} costs {R} to generate the copy, separate from the original spell's cost). This pattern clarifies that cost reduction is casting-time modification, not a property of the spell itself.

## The Definitive Rules

**CR 706.10 (Copy Effects):** *"A copy of a spell copies the entire text of that spell, including any variable values defined by that spell or a choice made by any player. If a spell names a card, the copy uses the same name. The copy is created on the stack, not cast, and has no source."*

**CR 601.2f (Cost Reduction):** *"A cost reduction applies when the cost is being paid. The reduction is applied to the total cost after any additions, but before any alternate costs are chosen."*

**CR 601.2b (Announcing):** *"The player announces their intended legal choices and actions for that spell or ability, including mode, divided damage, and the targets of the spell or ability."*

**CR 707.1 (Replicate):** *"Replicate [cost] means 'Whenever this permanent becomes attached to a creature and whenever you cast a spell it's attached to, you may pay [cost]. If you do, put a token that's a copy of this card onto the stack.'"*

**CR 117.2 (Spell on Stack):** *"A spell is on the stack once it has been cast until it is countered, resolves, or otherwise leaves the stack. A copy of a spell is created on the stack; it is not cast."*

## The Pattern

```
AFFINITY MECHANIC:

  Affinity: Cost-reduction ability.
  "Affinity for [card type] — This spell costs {1} less to cast for each
   [card type] you control."

  Example: Frogmite, Affinity for artifacts
  - Base cost: {4}
  - You control 5 artifacts: cost reduced by {5}
  - Actual cost paid: {0} (cost can't be reduced below {0})

SPELL COPY MECHANICS:

  Replicate: "Replicate [cost]" — optional cost to create a copy.
    - Original spell is cast normally (with cost reduction if applicable)
    - When original resolves, you may pay Replicate cost to create a copy
    - Copy is created on the stack (not cast), with base cost properties

  Fork: "Create a copy of target instant or sorcery. You may choose new targets
          for the copy."
    - Original spell resolves or is on the stack
    - Fork creates a copy (not cast) on the stack
    - Copy has base cost properties, not reduced properties

COST REDUCTION AND COPIES:

  When Frogmite is cast with Affinity (cost reduced to {0}):
    - Original spell is cast for {0} (cost reduction applied)
    - If Frogmite has Replicate {1}:
      → Frogmite resolves; you pay {1} Replicate cost
      → Copy of Frogmite is created on the stack
      → Copy has base cost {4} (Affinity does NOT apply to the copy)
      → Copy resolves or is countered with base cost properties

REPLICATE COPY COST:

  Replicate [cost] creates a copy. The cost refers to the Replicate ability's cost,
    not the original spell's cost.

  Example: Snapcaster Mage with Replicate {U}
    - Original Snapcaster cost: {1}{U}
    - Original is cast for {1}{U} (with any cost reduction)
    - Replicate costs {U} to create a copy
    - Copy is created on the stack (not cast) with base cost {1}{U}

COPIES AND MANA VALUE:

  Mana value of a copy = mana value of the original spell (by name).
  Cost reduction does NOT affect mana value of either the original or copy.

  Example: Frogmite cast with Affinity (cost reduced to {0})
    - Mana value: 4 (original base cost)
    - Copy (via Replicate or Fork): mana value 4
    - Copy was created with base cost, not reduced cost

FORK AND COST REDUCTION:

  Fork: "Create a copy of target instant or sorcery."

  You cast Counterspell (cost {U}{U}) with cost reduction (cost {U}):
    - Original is cast for {U}
    - Counterspell resolves, counters a spell
    - If Fork copies Counterspell:
      → Copy is created (not cast) with base cost {U}{U}
      → Copy's mana value: 2
      → Cost reduction never applied to fork's copy

MULTIPLE COPIES:

  If multiple copy effects apply to the same spell (e.g., two Forks):
    - Original spell: cost-reduced if applicable
    - First copy: base cost properties
    - Second copy: base cost properties (copy of the original, not copy of the copy)

```

## Definitive Conclusions

- **Copies use base cost** — spell copies do not inherit cost-reduction effects from the original.
- **Cost reduction is casting-time only** — modifications to the cost apply only when the original spell is cast, not when copies are created.
- **Mana value unchanged** — the mana value of a copy equals the mana value of the original spell (by printed cost), not the reduced cost.
- **Replicate copies are independent** — Replicate's copy cost is separate from the original spell's cost.

## Canonical Example

**Affinity + Replicate:**

You cast Frogmite ({4}, Affinity for artifacts, Replicate {1}) with 5 artifacts in play.

Original spell: cast for {0} (cost reduced by {5} via Affinity).

Frogmite enters and you activate Replicate: pay {1} to create a copy.

Copy is created on the stack. Affinity does NOT apply to the copy (it's not being cast). The copy has base cost {4} for purposes of any effects checking cost or mana value.

Copy resolves as a 4/4 artifact creature with Affinity (inherited from the copy's oracle text). Affinity is now {5} with your 5 artifacts, but the cost has already been paid (copy was created, not cast).

**Example 2 — Fork on Cost-Reduced Spell:**

You cast Counterspell ({U}{U}) normally, paying {U}{U}.

You have Goblin Electromancer in play (whenever you cast a noncreature spell, Goblin Electromancer deals 1 damage to any target and this spell costs {1} less). Cost is reduced to {U}.

Counterspell resolves, countering a spell. Your opponent plays Fork: "Create a copy of target instant or sorcery."

Fork targets Counterspell (already resolved, so this is a replacement/timing issue, but assuming Fork can retroactively copy). Fork creates a copy.

Copy of Counterspell is created on the stack with base cost {U}{U}. The cost reduction from Goblin Electromancer does NOT apply to the copy (cost reduction applied at casting time of original, not to copies).

Copy of Counterspell resolves, countering another spell. The base cost of {U}{U} is now irrelevant (copy was created, not cast).

## Commonly Confused With

- **P049 (Kicker)** — P049 covers optional additional costs on copies; P546 clarifies that cost reductions don't apply to copies.
- **P029 (Spell Copy Targeting)** — P029 covers copy targeting; P546 applies to cost properties of copies.
- **P117 (Affinity)** — P117 covers Affinity mechanics; P546 clarifies Affinity doesn't apply to spell copies.
