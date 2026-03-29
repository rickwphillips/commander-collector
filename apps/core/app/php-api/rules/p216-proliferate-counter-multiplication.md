---
id: p216
name: Proliferate — Add One Counter of Each Type to Chosen Permanents and Players
category: continuous
cr_refs: [701.27a, 701.27b]
tags: [proliferate, counters, +1+1-counters, poison, energy, charge-counters, Contagion-Engine, Doubling-Season, Phyrexian]
created: 2026-03-28
examples_count: 2
---

# P216 — Proliferate — Add One Counter of Each Type to Chosen Permanents and Players

## Abstract
Proliferate is a game action: you choose any number of permanents and/or players that already have counters, then put one additional counter of each type they already have on each chosen object. Proliferate affects ALL counter types simultaneously — +1/+1, -1/-1, poison, energy, loyalty, charge, level, etc. It doesn't "target" in the rules sense (no targeting requirement for most proliferate effects), and it can interact with both beneficial and harmful counters. Toxic/infect decks use Proliferate to rapidly escalate opponent's poison counters to 10 without further combat.

## The Definitive Rules

**CR 701.27a** (verbatim): *"To proliferate means to choose any number of permanents and/or players that have a counter, then give each exactly one additional counter of each kind that permanent or player already has."*

**CR 701.27b** (verbatim): *"If an effect says to proliferate twice (or any other number of times), that means to choose any number of permanents and/or players that have a counter, give each one additional counter of each kind that permanent or player already has, then choose again (possibly choosing the same objects or different ones) and repeat."*

## The Pattern

```
PROLIFERATE ACTION:
  Choose ANY number of permanents/players that have at least one counter
  Each chosen permanent/player: gets +1 of EACH TYPE of counter already on it
  No targeting: "choose" doesn't require target (can't be "hexproofed" from proliferate)
  Can choose 0 permanents/players (legal but does nothing)

PROLIFERATE COUNTER TYPES:
  +1/+1 counters: creatures with counters get one more
  -1/-1 counters: creatures with negative counters get worse
  Poison counters: players with poison approach 10 faster
  Energy counters: players with energy get more {E}
  Loyalty counters: planeswalkers gain 1 loyalty
  Charge counters: artifacts with charge counters get more
  Lore counters: Sagas advance (chapter trigger fires!)
  Level counters: Level Up creatures gain a level
  Time counters: Suspended cards approach zero (approach... wait, time counters go DOWN)
  Actually: proliferate ADDS counters, doesn't remove them
  Time counters on suspended cards go DOWN each upkeep — proliferate would ADD, not remove
  Proliferating a Suspended card would make it take LONGER (more time counters)!
  This is the trap: proliferating time counters is usually bad for suspend cards

PROLIFERATE + SUSPEND:
  Suspended card: exiled with N time counters, removed one per upkeep
  Proliferate on it: adds a time counter → card takes one more upkeep before casting
  Usually harmful to your own suspended cards!
  Exception: use proliferate on OPPONENT'S suspended cards to delay their cast

PROLIFERATE + SAGAS:
  Saga with 1 lore counter: proliferate → 2 lore counters
  If final chapter = 2: Saga now has enough counters → SBA fires, Saga sacrificed
  Proliferate can advance Sagas to completion faster
  Or: skip intermediate chapters' triggers by jumping to final

PROLIFERATE + PLANESWALKERS:
  Planeswalker with 3 loyalty: proliferate → 4 loyalty
  Scales well: keep planeswalker alive longer, reach ultimate faster
  With Doubling Season (doubles counters placed): proliferate adds 2 loyalty
  Oath of Nissa + Proliferate strategy: keep multiple planeswalkers alive

PROLIFERATE + POISON:
  Player with 2 poison counters: proliferate → 3 poison counters
  3 toxic/infect attacks + 3 proliferates = 10+ poison = win
  With Contagion Engine (double proliferate): two proliferates from one activation

PROLIFERATE + NEGATIVE COUNTERS:
  Creatures with -1/-1 counters: proliferate makes them worse
  Can be used on YOUR creatures if they have beneficial counters (choose non-negative ones)
  Or on OPPONENT'S creatures with -1/-1 to kill them faster

PROLIFERATE CARDS:
  Contagion Engine ({6}): proliferate, then proliferate again (double proliferate)
  Inexorable Tide: "whenever you cast a spell, proliferate"
  Fuel for the Cause ({2}{U}{U}): counter a spell and proliferate
  Viral Drake: {1}{U} each activation to proliferate
  Doubling Season: doubles counters placed (not specifically proliferate, but synergizes)

PROLIFERATE + ENERGY:
  Players have energy counters (from P209)
  Proliferate on a player with energy: +{E}
  Scales energy economy in the late game

PROLIFERATE TWICE (CR 701.27b):
  "Proliferate twice" = two separate proliferate actions
  Choose targets first time, then choose again (can be same or different)
  Each choice can choose different permanents/players
  "Proliferate twice" is NOT one choice affecting double counters — it's two separate choices
```

## Definitive Conclusions

- **Proliferate adds one of each type of counter** to each chosen permanent/player.
- **Works on ALL counter types** — beneficial and harmful simultaneously.
- **Doesn't target** — no hexproof protection from proliferate.
- **Suspend + Proliferate**: adds time counters (usually bad for your own suspended cards).
- **Sagas + Proliferate**: advances chapter progress (can skip to final chapter and sacrifice).

## Canonical Example
**Phyrexian Crusade deck (Proliferate strategy):**
Turn 1: Blighted Agent (1/1 infect, unblockable) attacks → opponent has 1 poison counter.
Turn 2: Blighted Agent attacks → opponent has 2 poison counters. Cast Inexorable Tide.
Turn 3: Cast any spell → Inexorable Tide triggers: proliferate → opponent has 3 poison counters. Blighted Agent attacks → 4 poison.
Turn 4: Cast spell → Inexorable Tide: 5 poison. Attack: 6 poison.
Turn 5: Two spells → 2 Inexorable Tide proliferates: 7 poison, 8 poison. Attack: 9 poison.
Turn 6: Proliferate → 10 poison → opponent LOSES.
Proliferate + infect: combine combat damage and proliferate to race to 10 poison.

**Example 2 — Contagion Engine in Counter Deck:**
Battlefield: 3 creatures with 2x +1/+1 counters each; Nissa planeswalker at 4 loyalty.
Activate Contagion Engine ({2}{T}): tap → proliferate → proliferate again.
First proliferate: choose all creatures and Nissa.
Creatures: 3 +1/+1 counters each. Nissa: 5 loyalty.
Second proliferate: choose same things.
Creatures: 4 +1/+1 counters each. Nissa: 6 loyalty.
Double proliferate in one activation: explosive counter growth.

## Commonly Confused With
- **P216 vs Doubling Season** — Doubling Season doubles counters PLACED (replacement effect). Proliferate is a separate action. They interact: proliferate places counters, Doubling Season doubles them.
- **P174 (Level Up)** — Level Up adds level counters to ONE specific creature. Proliferate adds to all chosen permanents simultaneously.
- **P205 (Sagas)** — Sagas advance via lore counters. Proliferate can advance them by adding lore counters.
