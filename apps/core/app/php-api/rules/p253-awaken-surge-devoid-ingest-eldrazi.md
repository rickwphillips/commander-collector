---
id: p253
name: Awaken, Surge, Devoid, and Ingest — Battle for Zendikar Mechanics
category: costs
cr_refs: [702.113a, 702.114a, 702.115a, 702.117a]
tags: [awaken, surge, devoid, ingest, colorless, eldrazi, land-animation, spell-count, Battle-for-Zendikar, Oath-of-Gatewatch, Scatter-to-the-Winds, Reality-Smasher]
created: 2026-03-28
examples_count: 2
---

# P253 — Awaken, Surge, Devoid, and Ingest — Battle for Zendikar Mechanics

## Abstract
Four mechanics from Battle for Zendikar (2015) and Oath of the Gatewatch (2016). **Awaken**: an alternative cost (higher mana) that also animates one of your lands into a 0/0 Elemental creature with +N/+N counters. **Surge**: an alternative cost (lower mana) available if you or a teammate cast another spell this turn. **Devoid**: a characteristic-defining ability making the object colorless regardless of its mana symbols. **Ingest**: whenever this creature deals combat damage to a player, that player exiles the top card of their library — fueling the Eldrazi "Process" mechanics.

## The Definitive Rules

**CR 702.113a** (verbatim): *"Awaken appears on some instants and sorceries. It represents two abilities: a static ability that functions while the spell with awaken is on the stack and a spell ability. 'Awaken N—[cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell' and 'If this spell's awaken cost was paid, put N +1/+1 counters on target land you control. That land becomes a 0/0 Elemental creature with haste. It's still a land.'"*

**CR 702.114a** (verbatim): *"Devoid is a characteristic-defining ability. 'Devoid' means 'This object is colorless.' This ability functions everywhere, even outside the game. See rule 604.3."*

**CR 702.115a** (verbatim): *"Ingest is a triggered ability. 'Ingest' means 'Whenever this creature deals combat damage to a player, that player exiles the top card of their library.'"*

**CR 702.117a** (verbatim): *"Surge is a static ability that functions while the spell with surge is on the stack. 'Surge [cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell if you or one of your teammates has cast another spell this turn.' Casting a spell for its surge cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
AWAKEN:
  Alternative cost: pay awaken cost (higher than base mana cost) to also animate a land
  The land: becomes a 0/0 Elemental creature with haste + N +1/+1 counters = N/N Elemental
  "It's still a land": the animated land can still produce mana! It's both creature AND land.
  If the land dies: it goes to GY (and you lose the land source permanently)

  AWAKEN + TARGETING:
    Must target a land YOU CONTROL when paying the awaken cost
    The awaken target is chosen only if paying the awaken cost (CR 702.113b)
    If the land is removed in response: the awaken part of the spell fails (illegal target at resolution)
    But: the main spell still resolves (the land animation was a separate ability)
    Wait: "If this spell's awaken cost was paid, put N counters on target land you control."
    The targeting of the land is part of the awaken spell ability.
    If the land is removed: the awaken target is gone. Just the base spell resolves.

  AWAKEN + "STILL A LAND":
    The awakened land is BOTH a creature AND a land
    Tapping it: produces mana (land ability still works)
    Using it as a blocker/attacker: works too (creature abilities)
    Summoning sickness: does the awakened land have summoning sickness? Yes — it became a creature this turn.
    Wait: awakening gives haste: "that land becomes a 0/0 Elemental creature with haste."
    Haste! The land can attack AND tap for mana this same turn.

  AWAKEN CARDS (Battle for Zendikar):
    Scatter to the Winds ({1}{U}{U}): "Counter target spell." Awaken 3—{3}{U}{U}.
      Normal: {1}{U}{U} counter a spell. Awaken: {3}{U}{U} counter a spell AND animate a land as 3/3 creature.
    Sheer Drop ({2}{W}): "Destroy target tapped creature." Awaken 4—{5}{W}.
      Normal: {2}{W} destroy tapped creature. Awaken: {5}{W} destroy tapped creature + animate land as 4/4.

DEVOID:
  Characteristic-defining ability (CDA): functions everywhere, even outside the game
  "This object is colorless." — REGARDLESS of the mana symbols in its cost
  Transgress the Mind ({1}{B}): devoid. It has {B} in its mana cost, but it's COLORLESS.
  This affects: protection from black (doesn't stop Devoid spells), color identity (colorless in Commander — can appear in any Commander deck?),
    wait: color identity uses the COLOR of mana symbols, not the devoid ability
    Actually: color identity considers all mana symbols on the card, including in mana cost
    Transgress the Mind has {B} in its cost: its color identity is BLACK (for Commander purposes)
    Devoid makes the card itself colorless but doesn't change color identity for deck-building

  DEVOID + PROTECTION:
    Protection from blue: stops blue spells targeting you/your permanents
    A Devoid creature that costs {U}{U}: its color is colorless (devoid overrides)
    Protection from blue: does NOT stop a devoid card (the card is colorless, not blue)
    This matters for Eldrazi that cost blue mana but are colorless: they bypass color-based protections

INGEST:
  Triggered: "whenever this creature deals combat damage to a player, that player exiles the top card of their library"
  Used with Eldrazi "Processors": cards that move exiled cards from opponents' exile zone to their GY for effects
  Ingest fills the "exile zone" requirement for Processor Eldrazi

  INGEST + PROCESSORS:
    Processors care about cards in an opponent's exile zone (put into exile by you, or by Ingest, etc.)
    If you ingested cards from their library: those are in their exile zone → processors can use them
    Wasteland Strangler ({2}{B}): processor, "as an additional cost, put a card an opponent owns from exile into their GY → target creature gets -3/-3."
      After ingest fills opponent's exile: use Wasteland Strangler to process and shrink a creature.

  INGEST CARDS (BfZ):
    Benthic Infiltrator ({2}{U}): 1/4 Eldrazi Drone, Ingest, unblockable. Connects every turn.
    Salvage Drone ({B}): 1/1 Eldrazi Drone, Ingest. Cheap ingest enabler.

SURGE:
  Alternative cost: pay surge cost (lower) if you or a teammate ALREADY CAST another spell this turn
  "Cast another spell" means at least one spell was cast by you (or teammate) before this one this turn
  Surge is "second spell cheaper": reward for casting multiple spells per turn

  SURGE CARDS (Oath of the Gatewatch):
    Reckless Bushwhacker ({2}{R}, Surge {R}): 2/1 Haste, "when enters, if surge cost paid, other creatures get +1/+0 and haste."
      Normal: {2}{R} → 2/1 haste (unremarkable).
      Surge {R}: if already cast something → {R} for 2/1 haste + "Goblin Bushwhacker" army pump.
      In Goblin/aggro decks: cast a 1-mana spell → surge Reckless Bushwhacker for {R} → all creatures get haste and +1/+0.
      Combo: turn 3 flood the board then surge for {R} → army swings as a team with extra power.
```

## Definitive Conclusions

- **Awaken** animates a land as an Elemental creature (with haste) as part of a higher-cost alternative — the land remains a land that produces mana.
- **Devoid** makes a card colorless regardless of mana symbols — bypasses color-based protections.
- **Devoid does NOT change color identity** for Commander deck-building.
- **Ingest** fills an opponent's exile zone, enabling Eldrazi Processor mechanics.
- **Surge** is a discount for casting a second spell in a turn — rewards aggressive multi-spell turns.

## Canonical Example
**Reckless Bushwhacker Surge in Goblin Aggro:**
Turn 3. Board: 3 Goblin tokens (1/1 from prior turns).
Cast Fanatical Firebrand ({R}, 1/1 Goblin, sacrifice + deal 1 damage): now you've cast a spell this turn.
Surge cost is enabled. Cast Reckless Bushwhacker for surge cost {R} (instead of normal {2}{R}).
Reckless Bushwhacker enters: surge cost paid → all other creatures get +1/+0 and haste.
Attack: 3 Goblin tokens (2/1 each with surge boost + haste) + Firebrand (2/1) + Bushwhacker (2/1).
5 creatures × 2 power = 10 damage in one turn for {R}{R} (Firebrand + surge).
Surge payoff: 1 mana to cast a 2/1 haste that also grants +1/+0 haste to 4 other creatures.

**Example 2 — Awaken Counterspell:**
Turn 4. Opponent casts their key threat.
You have 6 mana available, a basic Island on battlefield.
Cast Scatter to the Winds with Awaken 3 (cost {3}{U}{U}).
Counter the opponent's threat. Awaken: animate the Island → it becomes a 3/3 Elemental creature with haste (still an Island).
Island/Elemental can tap for {U} AND it's a 3/3 creature with haste that can attack immediately.
Optimal timing: opponent's end step → counter something, get a free 3/3 attacker for your turn.
Combined: {3}{U}{U} for "counter a spell" + "free 3/3 haste land-creature."

## Commonly Confused With
- **P239 (Convoke)** — Convoke uses creature tapping to pay mana; Awaken adds land animation as a bonus of paying an alternative cost.
- **P233 (Echo/Fading)** — Awakened lands are permanent (not time-limited) once animated; if the land-creature dies, the land is gone.
- **P219 (Devotion)** — Devoid creatures don't count for any color's devotion (they're colorless).
