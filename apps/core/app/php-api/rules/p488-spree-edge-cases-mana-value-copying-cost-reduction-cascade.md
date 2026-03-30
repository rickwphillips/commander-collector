---
id: p488
name: Spree Edge Cases — Mana Value, Copying Locks Modes, "Without Paying Mana Cost" Still Needs Modes, and Final Showdown Indestructible Timing
category: costs
cr_refs: [702.190a, 202.3a, 706.10, 601.2b, 107.3, 117.3]
tags: [spree, mana-value, copy-modes-locked, free-cast-still-needs-modes, cascade, cost-reduction, final-showdown, indestructible-timing, three-steps-ahead, return-the-favor, OTJ]
created: 2026-03-29
examples_count: 5
---

# P486 — Spree Edge Cases — Mana Value, Copying Locks Modes, "Without Paying Mana Cost" Still Needs Modes, and Final Showdown Indestructible Timing

## Abstract

Spree generates several non-obvious edge cases beyond the basic "pay at least one mode" rule documented in P129 and P477:
(1) A Spree spell's mana value is always its printed mana cost — regardless of how many modes are chosen or how much was paid in additional costs. This is critical for Cascade (which checks mana value, not total cost paid). (2) Copying a Spree spell locks in the chosen modes — the copy cannot have different modes chosen, only different targets within the same modes. (3) If an effect lets you cast a Spree spell "without paying its mana cost," you must still choose at least one mode and pay that mode's additional cost — the base mana cost is waived but mode costs are not. (4) Final Showdown's indestructible mode does not target the protected creature — the choice happens at resolution, bypassing hexproof and shroud. (5) Return the Favor can copy a Spree spell but the copy inherits chosen modes; the second mode of Return the Favor (retargeting) cannot change a Spree spell's modes.

## The Definitive Rules

**CR 202.3a**: The mana value of a spell or permanent is determined by its mana cost (not by any additional costs paid or alternative costs). Additional costs do not affect mana value.

**Scryfall ruling 2024-04-12 (Three Steps Ahead / all Spree cards)**: *"The mana value of a spell with spree is determined only by its mana cost (in the upper right corner of the card). It doesn't matter which modes you choose or which additional costs you pay, including any additional costs imposed by other effects."*

**Scryfall ruling 2024-04-12 (Three Steps Ahead)**: *"If a spell with spree is copied, the effect that creates the copy may allow you to choose new targets. You cannot choose new modes."*

**Scryfall ruling 2024-04-12 (Final Showdown / all Spree cards)**: *"If an effect allows you to cast a spell with spree 'without paying its mana cost,' you must still choose at least one mode and pay the associated additional costs."*

**Scryfall ruling 2024-04-12 (Final Showdown)**: *"The second mode of Final Showdown doesn't target the creature. You don't choose which creature will gain indestructible until the spell is resolving. At that point, it's too late for anyone to respond to the spell."*

**Scryfall ruling 2024-04-12 (all Spree cards)**: *"No player can cast spells or activate abilities in between the modes of a resolving spell. Any abilities that trigger won't be put onto the stack until the spell is done resolving."*

## The Pattern

```
SPREE MANA VALUE — ALWAYS JUST THE PRINTED COST:
  Three Steps Ahead: Mana cost {U} → MV = 1
  Even if you choose all three modes (paying {1}{U} + {3} + {2} extra):
  → Total paid: {1}{U} + {6} = {7}{U} (hypothetically)
  → The spell's MV is still 1 (the {U} in the corner)
  → This matters for:
    Cascade: Cascade reveals until MV < the cascading spell's MV
      → Cascade CAN hit Three Steps Ahead (MV 1 is cheap enough for most cascaders)
      → Cascade will NEVER hit any additional-cost-inflated version — MV is fixed
    Storm count: the spell is still "cast" → storm counts it regardless of modes
    Copy effects: the copy has MV equal to the original (MV 1 for Three Steps Ahead)
  → You CANNOT use additional costs to "inflate" the MV to prevent cascade from finding it

SPREE + COPY — MODES LOCKED:
  You cast Three Steps Ahead with modes:
    Mode 1 (counter a spell): chosen, targeting opponent's Lightning Bolt
    Mode 3 (draw 2/discard 1): chosen
  Opponent uses Fork to copy your Three Steps Ahead.
  → The copy has the SAME chosen modes (1 and 3)
  → The Fork's controller may choose new targets for mode 1 (can't retarget your own spell)
  → The Fork's controller CANNOT choose different modes for the copy
  → Scryfall ruling: "If a spell with spree is copied, the effect that creates the copy
     may allow you to choose new targets. You cannot choose new modes."
  Why this matters: copying a Spree spell is strictly "copy chosen modes + optionally retarget"
  → You can't use a copy effect to get modes you didn't pay for

RETURN THE FAVOR + SPREE:
  Return the Favor mode 1: "Copy target instant spell, sorcery spell, activated ability,
  or triggered ability."
  If you copy a Spree spell with this:
  → The copy has the same chosen modes (modes are locked in the copy)
  → Official ruling: "If you copy an activated ability with the first mode, and the
     activation cost includes a choice... the copy uses that same information."
  → Same principle applies to Spree: the chosen modes ARE the "choice made at cast time"
  Return the Favor mode 2: "Change the target of target spell or ability with a single target."
  → A Spree spell with multiple chosen modes that each have targets = MULTIPLE targets total
  → Return the Favor mode 2 requires "a spell...with a single target"
  → If the Spree spell has two or more targets across its modes, Return the Favor mode 2
     CANNOT be used on it
  → Official ruling: "If a spell or ability targets multiple things, you can't target it
     with Return the Favor's second mode, even if all but one of those targets have become illegal."

SPREE + "WITHOUT PAYING ITS MANA COST" (e.g., Cascade, Omniscience):
  Scenario: Cascade hits a Spree spell in the library
  → Cascade says: "You may cast that spell without paying its mana cost"
  → For a Spree spell, this means: the BASE mana cost is waived
  → BUT: You must STILL choose at least one mode AND pay that mode's additional cost
  → Official ruling: "If an effect allows you to cast a spell with spree 'without paying
     its mana cost,' you must still choose at least one mode and pay the associated
     additional costs."
  → Example: Cascade reveals Rush of Dread ({1}{B}{B}, MV 3)
    → You can cast it for free (waive {1}{B}{B})
    → You still MUST choose at least one of:
      +{1}: sacrifice half opponent's creatures
      +{2}: discard half opponent's hand
      +{2}: opponent loses half their life
    → You pay {1} or {2} (the cheapest mode costs)
    → The cascade free cast is NOT completely free for Spree spells

SPREE + COST REDUCTION:
  Scenario: Goblin Electromancer (reduce instant/sorcery costs by {1}) + Three Steps Ahead
  → The cost reduction applies to the TOTAL cost (base + chosen mode costs)
  → Total cost before reduction: {U} + chosen modes
  → After reduction: total minus {1} (affects generic mana)
  → The mana value is still {U} = 1 (the card face value) — cost reduction doesn't change MV

FINAL SHOWDOWN — MODE 2 TIMING (NON-TARGETING INDESTRUCTIBLE):
  Final Showdown: {W} base
    Mode 1 (+{1}): All creatures lose all abilities until end of turn
    Mode 2 (+{1}): Choose a creature you control. It gains indestructible until end of turn
    Mode 3 (+{3}{W}{W}): Destroy all creatures

  Key ruling: MODE 2 DOES NOT TARGET
  → "You don't choose which creature will gain indestructible until the spell is resolving."
  → At resolution time: all modes happen in written order
    → Mode 1 resolves: all creatures lose all abilities
    → Mode 2 resolves: choose a creature you control to gain indestructible
    → Mode 3 resolves: destroy all creatures
  → Result: all creatures lose abilities, then one gains indestructible (despite not having it
    a moment ago from printed text), then all others are destroyed
  → The indestructible grant in mode 2 CANNOT be responded to (the choice is at resolution)
  → "It's too late for anyone to respond to the spell"

  This creates a board wipe that protects one of your creatures, chosen at resolution:
  → Even if your creatures had shroud or hexproof, mode 2 doesn't target — it bypasses those
  → "Grant at resolution" means opponent can't remove the protected creature in response
    to mode 2 (there is no "in response to mode 2" — the whole spell resolves atomically)

  ADDITIONALLY: "No player can cast spells or activate abilities in between the modes
  of a resolving spell." (Official ruling)
  → There is NO window between mode 1 (all lose abilities) and mode 2 (indestructible grant)
  → Opponent cannot respond between modes to exploit the window

SPREE — FIZZLE RULES (TARGETS BECOME ILLEGAL):
  Spree spell with two targeted modes:
  → If ALL targets become illegal before resolution: spell doesn't resolve, no effects happen
  → If AT LEAST ONE target is still legal: spell resolves, illegal targets have no effect
  → This is the same partial-resolution rule as for any modal spell (P099)
  Example: Three Steps Ahead, mode 1 (counter Lightning Bolt), mode 3 (draw 2/discard 1)
  → Lightning Bolt resolves before Three Steps Ahead (can't happen)
  → OR: opponent's spell was countered already → mode 1 has illegal target
  → Mode 3 has no target (draw/discard doesn't target)
  → Result: the spell resolves on the legal mode 3; the illegal mode 1 has no effect
```

## Definitive Conclusions

- **Spree mana value = printed mana cost only.** Additional costs (including chosen modes) do not inflate the mana value for Cascade, storm, or any MV check.
- **Copying a Spree spell locks in the chosen modes.** The copy can retarget within those modes but cannot choose different or additional modes.
- **Free-cast effects (Cascade, Omniscience) waive the base cost only.** You must still choose at least one mode and pay its additional cost.
- **Final Showdown mode 2 does not target.** The creature gaining indestructible is chosen at resolution, not when the spell is cast. This bypasses hexproof, shroud, and prevents any "in response" interactions since there is no priority window between modes.
- **Return the Favor mode 2 (retarget) cannot hit a Spree spell with multiple targets.** It requires a spell with a single target.
- **No priority window between Spree modes.** All chosen effects resolve atomically — no one can respond between them.

## Canonical Examples

**Cascade hits Three Steps Ahead:**
Bloodbraid Elf cascades → reveals Three Steps Ahead (MV 1, less than 3). You may cast it for free. "Free" waives the {U} base cost. But you must still choose at least one mode and pay: e.g., choose mode 3 (draw 2/discard 1) → pay {2}. You pay {2} total. Not truly free, but the blue mana is waived.

**Fork + Three Steps Ahead:**
You cast Three Steps Ahead choosing mode 1 (counter opponent's Divination) and mode 3 (draw 2). Opponent's ally Forks your Three Steps Ahead. The Fork copy has modes 1 and 3 locked in. The Fork controller may choose new targets for mode 1 (perhaps targeting their own spell to "counter" it usefully, or targeting something else), but they cannot change to use mode 2 (create a token copy) instead.

**Final Showdown (modes 1+2+3) — Protecting a creature:**
You control five creatures; one is your best attacker. Cast Final Showdown paying all three modes ({W} + {1} + {1} + {3}{W}{W} = {W}{W}{W}{3}{W} total... or {6}{W}{W}{W} — it's expensive). At resolution:
1. All creatures lose all abilities (including your key creature's indestructible, if it had it from its printed text).
2. You choose your key creature — it gains indestructible now (this is a new grant via mode 2, not the printed ability that was stripped).
3. All creatures are destroyed. Your key creature survives due to indestructible.
Opponent cannot respond between steps — no priority window exists within a resolving spell.

**Rush of Dread via "cast without paying mana cost":**
Some effect lets you cast Rush of Dread ({1}{B}{B}) for free. You still need to choose modes:
- Only mode 1 (+{1}): opponent sacrifices half creatures → costs just {1}
- All three modes: costs {1} + {2} + {2} = {5} total (even though {1}{B}{B} is waived)
The cheapest "legal" cast of Rush of Dread without paying mana cost is {1} (one mode, sacrifice half).

**Spree + Goblin Electromancer:**
Three Steps Ahead, choosing mode 1 and mode 3:
Normally: {U} + {1}{U} + {2} = {3}{U}{U}
With Goblin Electromancer (-{1}): {2}{U}{U}
The spell's mana value is still 1. Cascade from a 4-MV cascader can still hit it.

## Commonly Confused With

- **P129 (Spree — Modal Spell with Per-Mode Additional Costs)** — P129 covers the basics of choosing modes. P486 covers the edge cases: MV, cascade, free-cast limitations, copy locking, and Final Showdown timing.
- **P477 (Plot, Spree, and Offspring)** — P477 is the general survey. P486 is edge-case-focused with official ruling backing.
- **P099 (Modal Spells — Choosing Modes and Escalate)** — For normal modal spells, copies can change modes (unlike Spree where modes are locked). Escalate adds a flat cost per extra mode; Spree has per-mode costs.
- **P034 (Cascade — What Can Be Hit and Free Cast Restrictions)** — Cascade checks printed MV only. Spree spells are cascade-hit based on their printed mana cost, regardless of mode costs.
- **P007 (Priority Windows)** — Modes of a resolving Spree spell resolve atomically; there is no priority window between them. This is the same rule as for all modal spells (CR 608.2c).
