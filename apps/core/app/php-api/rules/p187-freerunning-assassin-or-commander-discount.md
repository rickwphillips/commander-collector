---
id: p187
name: Freerunning — Alternative Cost After Assassin or Commander Deals Damage
category: costs
cr_refs: [702.173a]
tags: [freerunning, alternative-cost, assassin, commander, combat-damage, Outlaws-Thunder-Junction, Ezio, creed]
created: 2026-03-28
examples_count: 2
---

# P187 — Freerunning — Alternative Cost After Assassin or Commander Deals Damage

## Abstract
Freerunning is an alternative cost: you may pay the freerunning cost instead of the normal mana cost IF a player was dealt combat damage this turn by a creature that (at the time of dealing damage) was an Assassin creature OR was a commander under your control. This enables a "attack and then cast for cheap" gameplan — your Assassin (or commander) deals combat damage, then you unleash cheap spells via freerunning. The assassin in the Assassin's Creed IP set context: parkour past guards, deal damage, then gain advantages.

## The Definitive Rules

**CR 702.173a** (verbatim): *"Freerunning is a static ability that functions on the stack. 'Freerunning [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if a player was dealt combat damage this turn by a creature that, at the time it dealt that damage, was an Assassin creature or a commander under your control.' Casting a spell for its freerunning cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
FREERUNNING:
  Alternative cost: may pay freerunning cost if condition met
  Condition: "a player was dealt combat damage this turn by a creature that was [an Assassin creature or a commander under your control] at the time"

  FREERUNNING + ASSASSIN CONDITION:
    Any Assassin creature deals combat damage to any player → freerunning enabled
    The creature must HAVE BEEN an Assassin AT THE TIME it dealt the damage
    If it was type-shifted after dealing damage: still counts (was an Assassin at deal time)
    Changeling (all creature types including Assassin): always satisfies freerunning

  FREERUNNING + COMMANDER CONDITION:
    Your commander (any commander you control) deals combat damage to any player → freerunning enabled
    Even non-Assassin commanders satisfy the condition
    In Commander format: your commander attacking and connecting = freerunning enabled

  FREERUNNING + "ANY PLAYER":
    Any player taking combat damage from an Assassin/commander enables freerunning for you
    Your Assassin deals damage to yourself? (Goad effects): probably still counts ("a player was dealt combat damage")
    More commonly: opponent is hit

  FREERUNNING + TURN SCOPE:
    "This turn" — condition must be met in the CURRENT turn
    If your Assassin dealt damage to an opponent on their turn: that was last turn, not this turn
    Combat damage must happen this turn for freerunning to be available

  FREERUNNING CARDS:
    Assassin's Creed Universes Beyond set
    Ezio Auditore da Firenze (commander with freerunning-synergistic cards)
    Many instant/sorcery effects with freerunning: reduced cost after your Assassin connects
    Combat → free action (freerunning)

  FREERUNNING + UNBLOCKABLE ASSASSINS:
    Rogues, assassins with unblockable abilities: guarantee the condition
    Make your Assassin unblockable → it connects → freerunning enabled every turn
```

## Definitive Conclusions

- **Freerunning is enabled when an Assassin or your commander deals combat damage** this turn.
- **Alternative cost** — still a normal cast, just cheaper.
- **"At the time it dealt damage" check** — Assassin type must have been present at damage time.
- **Commanders count** regardless of creature type — enables freerunning in Commander.
- **Changeling satisfies** the Assassin condition automatically.

## Canonical Example
**Ezio Auditore da Firenze (Legendary Assassin Commander):**
Attack with Ezio → he deals combat damage to opponent.
Now you may cast spells with Freerunning this turn at reduced cost.
Multiple freerunning spells in your hand: cast them all cheaply after Ezio's hit.
If Ezio is blocked: no freerunning. The mechanic rewards making your commander connect.

**Example 2 — Rogue/Assassin Tribal:**
1/1 Unblockable Rogue (also an Assassin creature) attacks and deals 1 combat damage.
You have a Freerunning card normally costing {4}{U}: freerunning cost {1}{U}.
Cast for {1}{U} → saved 3 mana.
Each turn the Assassin connects: freerunning enables cheap spells.

## Commonly Confused With
- **P167 (Spectacle)** — Spectacle activates when opponent lost life (any source). Freerunning activates specifically from Assassin or commander dealing combat damage.
- **P173 (Exalted)** — Exalted gives bonus when attacking alone. Freerunning gives a cost reduction for casting after the attack.
- **P147 (Ninjutsu)** — Ninjutsu swaps in during combat on an unblocked attacker. Freerunning discounts spells after combat damage was dealt.
