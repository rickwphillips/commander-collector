---
id: p241
name: Replicate — Pay Additional Cost N Times for N Copies
category: stack
cr_refs: [702.56a, 702.56b]
tags: [replicate, copy, additional-cost, Ravnica, Izzet, Vacuumelt, Train-of-Thought, Gigadrowse]
created: 2026-03-28
examples_count: 2
---

# P241 — Replicate — Pay Additional Cost N Times for N Copies

## Abstract
Replicate is a keyword representing two abilities: an additional cost you may pay any number of times when casting the spell, and a triggered ability that copies the spell once for each time the replicate cost was paid. Unlike Storm (which counts ALL spells cast this turn), Replicate is self-contained — you decide how many copies you want upfront by paying the replicate cost that many times. The copies can be given new targets. Replicate is from the Ravnica block (Izzet guild) and creates scalable spell effects: pay once for 1 extra copy, pay twice for 2 extra copies, etc.

## The Definitive Rules

**CR 702.56a** (verbatim): *"Replicate is a keyword that represents two abilities. The first is a static ability that functions while the spell with replicate is on the stack. The second is a triggered ability that functions while the spell with replicate is on the stack. 'Replicate [cost]' means 'As an additional cost to cast this spell, you may pay [cost] any number of times' and 'When you cast this spell, if a replicate cost was paid for it, copy it for each time its replicate cost was paid. If the spell has any targets, you may choose new targets for any of the copies.' Paying a spell's replicate cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.56b** (verbatim): *"If a spell has multiple instances of replicate, each is paid separately and triggers based on the payments made for it, not any other instance of replicate."*

## The Pattern

```
REPLICATE:
  When casting: declare how many times you pay the replicate cost (0 = no copies)
  Each payment = 1 additional copy
  Total cost: base mana cost + (replicate cost × number of times paid)
  Triggered: "when you cast this spell, if replicate was paid, copy it N times"
  Copies have new target choices

REPLICATE + COPY COUNT:
  Pay replicate cost once: 1 copy (2 total effects)
  Pay replicate cost twice: 2 copies (3 total effects)
  Pay replicate cost 5 times: 5 copies (6 total effects)
  Each copy is separate and on the stack independently

REPLICATE vs STORM:
  Storm: count all spells cast this turn (not just this spell), make copies
  Replicate: YOU decide how many copies by paying additional costs
  Storm: unpredictable count (depends on spell chain); Replicate: fully deterministic
  Storm copies are free; Replicate copies cost additional mana per copy

REPLICATE + TARGETS:
  Original spell has targets: choose targets when casting
  Copies: may choose NEW targets for each copy
  Or keep same targets
  A replicated "counter target spell" with 3 copies: counter 4 spells (if there are 4 valid targets)

REPLICATE CARDS (Ravnica Guildpact):
  Vacuumelt ({2}{U}, Instant — Replicate {2}{U}): "Return target creature to its owner's hand."
    Base cost: {2}{U}. Each copy: pay another {2}{U}.
    Pay 3× replicate: {2}{U} base + {2}{U}×3 = {8}{U}{U}{U} for 4 bounce effects.
    Bounce 4 creatures in one instant: devastating board clear.

  Train of Thought ({1}{U}, Sorcery — Replicate {1}{U}): "Draw a card."
    Base: {1}{U}. Each replicate: {1}{U} more. Pay 4× replicate: {1}{U}×5 = 5 mana, draw 5 cards.
    Draw 5 cards for {U}{U}{U}{U}{U}... wait, actually {1}{U}×5 = {5}{U}{U}{U}{U}.
    Expensive per draw, but scales linearly.

  Gigadrowse ({U}, Instant — Replicate {U}): "Tap target permanent."
    Base: {U}. Each copy: {U}. Pay 7× replicate: {U}×8 = tap 8 permanents for 8 blue mana.
    Legacy Gigadrowse combo: tap all opponent's permanents on their upkeep, then untap them
    Or: tap all their lands during their turn, ending their ability to cast spells

REPLICATE + COUNTERING:
  If the original spell is countered: the replicate TRIGGER still fires
    Wait: replicate is "when you CAST this spell" — the trigger fires on casting, before resolution
    Even if the original is countered: the copies from replicate were already created
    The copies are on the stack and must be separately countered
  This is similar to Storm: countering the original doesn't counter the copies

REPLICATE + MANA EFFICIENCY:
  Replicate is mana-intensive: each copy costs as much as the original
  Best when the effect is asymmetrically valuable: Gigadrowse tapping 8 permanents for 8 mana
  Vacuumelt bouncing 4 creatures for {8}{U}{U}{U} is more efficient than 4 individual bounces
```

## Definitive Conclusions

- **Replicate copies equal the number of times the replicate cost was paid**.
- **Copies may choose new targets** — replicate can hit different targets with each copy.
- **Countering the original spell doesn't counter copies** — the replicate trigger fires on casting.
- **More expensive than Storm** but fully deterministic — you know exactly how many copies you get.
- **Gigadrowse** is the most competitive Replicate card (blue combo enabler in Legacy).

## Canonical Example
**Gigadrowse in Legacy Blue Combo:**
Turn 3. Opponent controls 7 permanents (lands + creatures).
Cast Gigadrowse ({U}) with 7× Replicate: pay {U}×8 = 8 blue mana.
Replicate trigger: 7 copies. 8 total "tap target permanent" effects.
Tap all 7 of opponent's permanents (all lands and creatures).
Opponent has 0 mana, 0 available blockers for the rest of this turn.
Sequel: take extra turn (Time Walk effects) or alpha strike with all your creatures.
Gigadrowse is the "soft lock" piece in Turbo Fog and blue combo decks.

**Example 2 — Vacuumelt Combat Trick:**
Opponent declares 3 creatures as attackers.
Cast Vacuumelt ({2}{U}) with Replicate paid twice: total cost {2}{U} + {2}{U} + {2}{U} = {6}{U}{U}{U}.
3 total bounce effects: return all 3 attackers to hand.
Combat ends with no attackers. You take 0 damage.
This costs 9 mana — expensive — but removes 3 creatures and ruins opponent's attack.
Alternative: pay replicate once: bounce 2 attackers for {4}{U}{U}, letting only 1 attack through.

## Commonly Confused With
- **P215 (Storm)** — Storm counts all spells cast this turn; Replicate only counts how many times ITS OWN cost was paid. Storm is free copies; Replicate costs mana per copy.
- **P248 (Conspire)** — Conspire pays by tapping colored creatures for ONE free copy; Replicate pays mana for each copy (scalable).
- **P177 (Casualty)** — Casualty sacrifices a creature for one copy; Replicate pays a scalable mana cost for N copies.
