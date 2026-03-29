---
id: p209
name: Energy Counters — Generate {E} and Spend as a Cost
category: costs
cr_refs: [107.8, 501.1]
tags: [energy, energy-counters, Kaladesh, pay-E, Aetherworks-Marvel, Harnessed-Lightning, Glimmer-of-Genius]
created: 2026-03-28
examples_count: 2
---

# P209 — Energy Counters — Generate {E} and Spend as a Cost

## Abstract
Energy ({E}) is a player-owned resource introduced in Kaladesh. Players accumulate energy counters from spells and abilities, then spend them by paying {E} costs. Energy counters belong to the player (not to any permanent), persist between turns, and have no maximum. They are not mana (can't pay mana costs) and can't be used reactively except when an ability specifically asks for them. The most powerful energy payoffs in competitive play: Aetherworks Marvel (spin for free permanents) and Whirler Virtuoso (trade energy for 1/1 Thopter tokens).

## The Definitive Rules

**CR 107.8** (verbatim): *"The energy symbol {E} represents one energy counter. To pay {E}, a player removes one energy counter from themselves. To pay {E}{E}, a player removes two energy counters, and so on."*

**CR 501.1** (verbatim): *"Paying energy costs: To pay an energy cost of {E}, the player removes one energy counter from themselves. If a player doesn't have enough energy counters, they can't pay the cost."*

## The Pattern

```
ENERGY MECHANICS:
  Energy counters: belong to the PLAYER (not permanents)
  Gain {E}: most effects say "you get N {E}" (placing counters on the player)
  Spend {E}: abilities/spells with {E} in their cost (remove from player)
  No maximum limit (accumulate as many as you have)
  Energy persists until spent (doesn't reset each turn)

ENERGY SOURCES (Kaladesh block):
  ETB triggers: "When X enters, you get {E}{E}"
  Triggered abilities: "Whenever Y attacks, you get {E}"
  Activated abilities: "Pay mana: you get {E}"
  Spell resolution: "You get {E}{E} as part of this spell's effect"
  Common: Glimmer of Genius gets {E}{E}, Aether Hub provides {E}

ENERGY SPENDING:
  Activated abilities with {E} cost: "Pay {E}{E}{E}: do X"
  Spells with energy in cost: unusual, but some exist
  Can't pay energy if you don't have enough (unlike mana, no "tapping for mana" on the fly)
  Must HAVE the energy already

AETHERWORKS MARVEL COMBO:
  Aetherworks Marvel: "Whenever a permanent you control is put into a graveyard, you get {E}."
  "Pay {T}{E}{E}{E}{E}{E}{E}: look at top 6 cards, cast one for free."
  Build energy quickly by sacrificing permanents → spin to cast Emrakul or Ulamog for free
  Aetherworks Marvel is historically banned in Standard for this reason
  Energy ramp: each sacrifice gives {E}, enables free 10-15 mana Eldrazi each turn

AETHER HUB:
  Land: "When Aether Hub enters, you get {E}."
  "{T}: Add {C}." or "{T}, Pay {E}: Add one mana of any color."
  Color fixing: 1 free colored mana on entry, then {C} only
  Common in energy decks: provides fixing on turn 1

HARNESSED LIGHTNING:
  Instant {1}{R}: "You get {E}{E}{E}. You may pay any amount of {E}. Harnessed Lightning deals that much damage to target creature."
  Generate 3 energy, spend some/all for damage
  Save energy for larger threats; spend later
  With lots of energy banked: deal huge damage to any creature

GLIMMER OF GENIUS:
  Instant {3}{U}: "Scry 2, draw 2, you get {E}{E}."
  Card selection + energy generation in one card
  Kaladesh Standard staple: draw + energy both valuable

ENERGY + CURRENT META:
  Modern Horizons 3 brought energy back with new cards
  Ajani, Nacatl Pariah // Ajani, Cutthroat's Companion — energy version
  Energy in Modern: Aether Hub + Glimmer of Genius + payoffs

ENERGY + PROLIFERATE:
  Proliferate: "Choose any number of players/permanents with counters, add one more counter of each type."
  Players CAN have counters (energy, poison) — proliferate can add energy counters!
  Proliferate on a player with {E}{E}{E}{E} adds another {E}
  Proliferate + energy engine: grows energy bank quickly

ENERGY + COMMANDER:
  Energy is per-player (not per-commander)
  In Commander: energy decks benefit from multiplayer targets
  Aetherworks Marvel: in commander, spin can get any card in your deck (any 10+ CMC threat)
```

## Definitive Conclusions

- **Energy counters belong to the player** — not to any specific permanent.
- **Persists between turns** — bank energy over multiple turns.
- **Pay {E} = remove from yourself** — can't pay energy you don't have.
- **Proliferate can add energy** — treat players as valid targets with energy counters.
- **Aetherworks Marvel** is the historically dominant energy payoff — banned in Standard.

## Canonical Example
**Kaladesh Energy Deck Turn Sequence:**
Turn 1: Aether Hub enters → get {E}. Tap with {E}: get {G} → cast Attune with Aether ({G}): search for Forest, get {E}{E}. Now have {E}{E}.
Turn 2: Servant of the Conduit ({1}{G}) ETB → get {E}. Now {E}{E}{E}. Can activate Servant (tap + {E}) for any colored mana.
Turn 3: Glimmer of Genius ({3}{U}): scry 2, draw 2, get {E}{E}. Now {E}{E}{E}{E}{E}.
Turn 4: Aetherworks Marvel. Tap + pay {E}{E}{E}{E}{E}{E}: look at top 6, cast Ulamog, the Ceaseless Hunger for free.
Turn 4 Ulamog on the battlefield. Energy engine enabled the win.

**Example 2 — Harnessed Lightning Scaling:**
Turn 3: Harnessed Lightning targeting a 3/3 attacker.
Get {E}{E}{E}, spend {E}{E}{E} → deal 3 damage. Kills the 3/3.
Turn 6: Enemy plays a 5/5. Harnessed Lightning again.
Get {E}{E}{E} = total {E}{E}{E}{E}{E} (if you had {E}{E} banked).
Spend all 5 {E} → deal 5 damage. Kills the 5/5.
Energy banking makes Harnessed Lightning scale to kill any creature.

## Commonly Confused With
- **P209 vs Mana** — Energy is NOT mana. Can't pay mana costs with energy; can't pay energy costs with mana.
- **P209 vs Charge Counters** — Charge counters are on PERMANENTS (like P194 Station). Energy counters are on the PLAYER.
- **P175 (Soulbond)** — Soulbond is about pairing permanents. Unrelated to energy.
