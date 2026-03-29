---
id: p247
name: Prowl — Alternative Cost After Dealing Damage With Matching Creature Type
category: costs
cr_refs: [702.76a]
tags: [prowl, alternative-cost, creature-type, rogue, goblin, combat-damage, Lorwyn, Morsel-Theft, Earwig-Squad, Bitterblossom]
created: 2026-03-28
examples_count: 2
---

# P247 — Prowl — Alternative Cost After Dealing Damage With Matching Creature Type

## Abstract
Prowl is a static ability that functions on the stack: you may pay the prowl cost (instead of the normal mana cost) if a player was dealt combat damage this turn by a source you controlled that had any of the spell's creature types at the time it dealt the damage. Prowl is a reward for dealing damage with small "tribal" creatures — especially Rogues and Goblins in Lorwyn. Use your cheap Rogue creatures to sneak in unblocked, then prowl your powerful Rogue spells for a discounted price. Prowl doesn't trigger on the damage — it's a passive condition you check when casting. No combat damage this turn by matching creatures = no prowl.

## The Definitive Rules

**CR 702.76a** (verbatim): *"Prowl is a static ability that functions on the stack. 'Prowl [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if a player was dealt combat damage this turn by a source that, at the time it dealt that damage, was under your control and had any of this spell's creature types.' Casting a spell for its prowl cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
PROWL CONDITION:
  Before casting: was a PLAYER dealt COMBAT DAMAGE this turn by a source:
    (a) under your control at the time of damage
    (b) with ANY of this spell's creature types at the time of damage
  If both conditions: prowl cost is available as an alternative cost

PROWL + CREATURE TYPES:
  The spell's creature types matter: check the spell's type line for creature types
  Morsel Theft (Tribal Instant — Rogue): Rogue is the type. Was a Rogue controlled by you dealing combat damage this turn?
  Any Rogue you control dealing combat damage enables prowl for all Rogue spells this turn.
  Multiple Rogues dealing combat damage: doesn't stack the prowl (just needs one instance)

PROWL + "AT THE TIME IT DEALT DAMAGE":
  The creature must have the type at the TIME of damage (not necessarily right now)
  If a creature changed type AFTER dealing damage: prowl still enabled (checked at time of damage)
  If a Changeling (has all types) deals damage: enables prowl for ALL creature types
  Changeling creatures: universal prowl enablers

PROWL + "PLAYER":
  Must deal damage to a PLAYER (not a planeswalker, not a creature)
  Attacking and hitting a planeswalker: no prowl (dealt damage to planeswalker, not player)
  Combat damage to a player: confirmed prowl unlock for matching types

PROWL + CAST TIMING:
  Prowl is an alternative cost on the stack
  The condition check happens when you choose to cast the spell
  If you have prowl enabled earlier in the turn and cast the prowl spell during second main phase: still valid
  Prowl unlocked lasts the ENTIRE TURN (until turn ends)

PROWL + TRIBAL SPELLS:
  Prowl appears on Tribal spells (instant/sorcery with a creature subtype)
  Tribal Instant — Rogue = instant that "is a Rogue" for prowl purposes
  This means: casting a Rogue Tribal Instant can itself be part of a Rogue strategy without needing creatures with Rogue type
  But the prowl ENABLEMENT requires combat damage from a Rogue creature

PROWL CARDS (Lorwyn/Morningtide):
  Morsel Theft (Tribal Instant — Rogue, {3}{U}{B}): "Target player loses 3 life and you draw 3 cards." Prowl {1}{U}{B}.
    Full: {3}{U}{B} = 5 mana for drain 3/draw 3.
    Prowl: {1}{U}{B} = 3 mana for same effect. -2 mana discount if a Rogue dealt combat damage.
    In Rogue tribal: Bitterblossom creates 1/1 Rogue tokens (flying). Attack with faerie → prowl enabled.

  Earwig Squad ({3}{B}{B}): 5/3 Goblin Rogue, Prowl {2}{B}. "When enters, if its prowl cost was paid, search opponent's library for up to 3 cards, exile them."
    Full cost: {3}{B}{B} = 5 mana. Prowl: {2}{B} = 3 mana.
    Cheaper PLUS it has a prowl ETB bonus: exile 3 cards from opponent's library.
    This is a "prowl reward" creature: the prowl cost also triggers a bonus.

  Stinkdrinker Bandit ({3}{B}): 2/1 Goblin Rogue, "whenever a Rogue you control deals combat damage to a player, if that damage was unblocked, each Rogue you control gets +2/+0 until EOT."
    Rogue pump on unblocked damage: combine with Prowl for a tribal strategy.

PROWL ENABLERS (Lorwyn):
  Bitterblossom ({1}{B}): Tribal Enchantment — Faerie, "at upkeep, pay 1 life → create 1/1 blue Faerie Rogue token with flying."
    Creates Rogue tokens every turn → enables prowl for Rogue spells every turn (if tokens deal combat damage).
    Flying: rarely blocked in many metas.

  Thieves' Fortune (Tribal Instant — Rogue): Prowl — "Look at top 4, put one in hand, rest on bottom in any order."
    Drawing with prowl vs. full cost.

PROWL + CHANGELING:
  Changeling Outcast ({B}): 1/1 Changeling (all creature types), can't block, can't be blocked if attacking.
    Attacks unblocked every turn → deals damage → enables prowl for ALL creature types.
    Universal prowl enabler in one card.
    Yuriko uses Changeling Outcast for guaranteed ninjutsu AND it enables prowl for any tribe.
```

## Definitive Conclusions

- **Prowl requires combat damage to a player** this turn from a creature sharing the spell's creature type.
- **Alternative cost**, not a triggered bonus — you actively choose to pay prowl or normal mana cost.
- **Condition checked at cast time** — once enabled, prowl stays available all turn.
- **Changeling creatures** enable prowl for any creature type.
- **Bitterblossom → Rogue tokens → prowl unlocked** every turn in Rogue tribal.

## Canonical Example
**Earwig Squad Prowl in Rogue Tribal:**
Turn 2: cast Bitterblossom ({1}{B}). Lose 1 life, create a 1/1 Faerie Rogue token with flying.
Turn 3: Faerie Rogue token attacks, opponent has no flying blockers. Deals 1 combat damage to opponent.
A Rogue dealt combat damage to a player this turn → prowl is enabled.
Cast Earwig Squad ({3}{B}{B}) for its prowl cost {2}{B}.
Earwig Squad enters: prowl cost was paid → search opponent's library for up to 3 cards, exile them.
Exile their combo pieces (Grapeshot, Ad Nauseam, etc.).
Cost: {2}{B} (3 mana) for a 5/3 body + exile 3 key cards from opponent's library.
Compare full cost: {3}{B}{B} = 5 mana, same effect. Prowl saved 2 mana.
Turn 4: Faerie attacks again → prowl enabled → another prowl spell.

**Example 2 — Morsel Theft Drain:**
Turn 4. Bitterblossom Faerie tokens have dealt damage: prowl enabled.
Cast Morsel Theft (prowl cost {1}{U}{B}): target opponent loses 3 life, you draw 3 cards.
3 life swing + 3 card draw for 3 mana: extremely efficient.
Now have more Rogue spells in hand for future turns.
Rogue Tribal plan: Bitterblossom → tokens attack → prowl → Morsel Theft each turn.

## Commonly Confused With
- **P187 (Freerunning)** — Freerunning is also an alternative cost after dealing damage, but requires Assassins or a Commander; Prowl requires specific creature types (usually Rogues/Goblins).
- **P167 (Spectacle)** — Spectacle is an alternative cost after an opponent loses life (any source); Prowl requires combat damage specifically from a creature of the matching type.
- **P236 (Ninjutsu)** — Ninjutsu triggers on unblocked attackers; Prowl is about having dealt damage already this turn.
