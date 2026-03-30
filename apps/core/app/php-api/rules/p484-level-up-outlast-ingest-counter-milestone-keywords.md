---
id: p484
name: Level Up, Outlast, and Ingest — Counter-Milestone Characteristics, Tap-if-Passive Counter, and Exile-Top-on-Damage
category: continuous
cr_refs: [702.81, 702.101, 702.109, 107.3, 700.7, 613.4a, 603.2, 508.1]
tags: level-up, outlast, ingest, formal-keyword, milestone-characteristics, passive-counter, exile-top-card, worldwake, khans-tarkir, battle-for-zendikar
created: 2026-03-29
examples_count: 6
---

# P484 — Level Up, Outlast, and Ingest — Counter-Milestone Characteristics, Tap-if-Passive Counter, and Exile-Top-on-Damage

## Abstract

Three formal keywords from different eras: **Level Up** (CR 702.81, Worldwake/Rise of the Eldrazi) is an activated ability that adds level counters to a leveler creature, which has characteristic-defining text blocks based on how many level counters it has; **Outlast** (CR 702.101, Khans of Tarkir) is an activated ability to put a +1/+1 counter on the creature, usable only if the creature didn't attack or block this turn (taps as a cost); and **Ingest** (CR 702.109, Battle for Zendikar) causes the creature to exile the top card of a damaged player's library when it deals combat damage. All three interact with counter rules, CDA characteristics, and the BFZ Processor subtheme in non-obvious ways.

## The Definitive Rules

### Level Up (CR 702.81)
**CR 702.81a verbatim:** *"Level up [cost] means '{cost}: Put a level counter on this permanent. Activate only as a sorcery.'"*

Leveler cards have "LEVEL X-Y [abilities] [P/T]" blocks. When the permanent has between X and Y level counters, it has those abilities and that P/T instead of its printed P/T.

**CR 107.3 (Level symbols)**: The "LEVEL X-Y" line modifies the characteristics of the permanent when that range of counters is present. This is a characteristic-defining ability (CDA) in layer 7a — it sets P/T based on level counter count.

### Outlast (CR 702.101)
**CR 702.101a verbatim:** *"Outlast [cost] means '{cost}, {T}: Put a +1/+1 counter on this creature. Activate only as a sorcery and only if this creature didn't attack or block this turn.'"*

Outlast has a specific condition: the creature must not have attacked or blocked this turn. If it attacked or blocked (even just declared as an attacker, then removed from combat), the Outlast condition is already violated.

### Ingest (CR 702.109)
**CR 702.109a verbatim:** *"Whenever this creature deals combat damage to a player, that player exiles the top card of their library."*

Ingest causes the damaged player to exile the top card from their own library. The exiled card is relevant for BFZ Processor creatures that use opponent's exiled cards.

## The Pattern

```
LEVEL UP pattern:
Leveler card characteristics (example structure):
  Card: "Level up {1}. LEVEL 1-2 [Ability A] 2/3. LEVEL 3+ [Ability B] 4/5."

When level counters are present:
  0 level counters: base printed P/T (e.g., 1/1)
  1-2 level counters: override to 2/3 with Ability A
  3+ level counters: override to 4/5 with Ability B

Layer application:
  → P/T overrides happen in Layer 7a (characteristic-defining abilities)
  → This is a CDA that sets P/T based on a condition (level counter count)
  → Layer 7c effects (+N/+N pump, counters) apply AFTER the level's base P/T is set
  → A leveler at LEVEL 3+ has base P/T 4/5 from the level text, then:
    → +1/+1 counters (not level counters) add to that in layer 7c
    → Pump spells add in layer 7c
    → "Becomes a 2/2" (layer 7b) would set it to 2/2 overriding the level's 4/5
  → Level counters vs. +1/+1 counters: these are DIFFERENT counter types
    → Proliferate: can add either; level counters advance levels; +1/+1 counters add P/T in 7c
    → Adding a level counter via Proliferate can level up a creature without paying the cost
  → Copying a leveler: the copy has the printed level-up text AND any level counters currently
    on the original? NO — copies of permanents don't copy counters (counters aren't copiable)
    → A copy of a leveler on the battlefield is a fresh copy with 0 level counters
    → The copy starts at base P/T (level 0)
  → Clone targeting a leveler at level 3+: the Clone enters as the leveler's base form (0 counters)

OUTLAST pattern:
Restriction: "Only if this creature didn't attack or block this turn"
  → At the START of your turn, the creature hasn't attacked or blocked → eligible
  → Declare attackers: if you declare this creature as an attacker → can't Outlast this turn
  → Opponent attacks: if this creature blocks → can't Outlast this turn (was in declare blockers)
  → "Didn't attack or block" = wasn't declared as attacker OR declared as blocker at any point this turn
  → Even if removed from combat after declaration, the condition is violated
  → Sorcery speed: must be during main phase with empty stack
  → The creature taps as part of the cost → can't Outlast after attacking (already tapped anyway)
    → But vigilance attacks: creature attacks (vigilance = doesn't tap), then tries to Outlast
    → Wait: Outlast says "only if didn't attack THIS TURN" — vigilance creature attacked → can't Outlast
      even though it's untapped. The condition is about whether it attacked, not whether it's tapped.
    → So: vigilance + Outlast doesn't let you attack AND outlast. Attack disqualifies Outlast.
  → Outlast gives a +1/+1 counter (permanent improvement) in exchange for not attacking this turn

INGEST pattern:
Trigger: "Whenever this creature deals combat damage to a player, that player exiles the top card of their library"
  → Triggers on COMBAT damage to PLAYERS (not creatures, not planeswalkers)
  → The damaged player exiles THEIR OWN top card
  → The exiled card is face-up (public information)
  → BFZ Processor mechanic: creatures with "Devoid" and special abilities that use exiled cards
    → Processor cards say "exile target card an opponent owns that's exiled" → use ingested cards
    → Ingested cards fuel Processor creature activated abilities
  → Ingest in a non-Processor deck: the exiled card has no direct benefit — it's just mild library hate
  → Ingest + multiple hits: each combat damage event triggers once
  → Multiple Ingest creatures attacking: each that deals damage triggers separately
    → Multiple Ingest hits on the same player → multiple exiled cards from their library
  → The ingested cards stay in exile until removed (or used by Processors)
```

## Definitive Conclusions

**Level Up:**
- Proliferating level counters: in a Proliferate deck, level up creatures advance faster. Adding a level counter via Proliferate is identical to paying the Level Up cost (both put a level counter on the creature).
- The level-based P/T is a CDA (Characteristic-Defining Ability) — it applies in layer 7a, before regular pump effects in 7c. This means: a leveler at level 3+ has base 4/5 (from level), then +1/+1 counters (7c) add on top of that. A 4/5 with two +1/+1 counters is 6/7.
- A Clone copying a leveler enters with the level-up text but NO level counters → it's at base P/T (level 0). To get it to level up, you must pay the Level Up cost for the Clone.
- Key card: *Student of Warfare* (ROE): "Level up {W}. LEVEL 2-6: First Strike 3/3. LEVEL 7+: Double Strike, 4/4." For {W} each time, grows from a 1/1 into a 3/3 first striker at level 2, and eventually a 4/4 double striker at level 7+.
- Key card: *Echo Mage* (ROE): "Level up {1}{U}. LEVEL 2-3: 2/4. {U}{U}, {T}: Copy target instant or sorcery spell. LEVEL 4+: 2/5. {U}{U}, {T}: Copy target instant or sorcery spell twice." The level 2+ ability is a copy engine; level 4+ copies twice per activation.

**Outlast:**
- Outlast is a "grow over time" mechanic for creatures that often also have "as long as it has a +1/+1 counter" conditional bonuses. In a Sultai/Abzan deck built around Outlast, the counters from Outlast spread as bonuses via other cards' conditional abilities.
- Outlast and vigilance: vigilance does NOT help Outlast. The restriction is "didn't attack," not "isn't tapped." Attacking with a vigilance creature forfeits that turn's Outlast activation.
- Key card: *Abzan Falconer* (KTK): "Outlast {W}. Each creature you control with a +1/+1 counter on it has flying." A static ability — all your creatures bearing +1/+1 counters permanently have flying, not just until end of turn. Pair with counter-generating effects to give your whole team evasion.
- Key card: *Anafenza, Kin-Tree Spirit* (DTK): Not Outlast, but synergy — bolsters the smallest creature each time a nontoken creature ETBs.

**Ingest:**
- Ingest is a minor library-exile mechanic. In isolation, exiling an opponent's card is barely relevant. The payoff comes with Processor creatures that USE opponent's exiled cards.
- Ingest creates a "card pool" of exiled opponent cards that Processor abilities can tap into for effects.
- Key card: *Salvage Drone* (BFZ): "Devoid. Ingest." A 1/1 that ingests on each combat damage hit. Fuels Processor effects.
- Key card: *Ulamog's Reclaimer* (BFZ): "Devoid. When Ulamog's Reclaimer enters the battlefield, put target card that's exiled into its owner's graveyard." A Processor effect — send an ingested card from exile to the opponent's GY (fueling their GY could be bad, but moving it FROM exile unlocks your Processor's benefit).
- Key card: *Wasteland Strangler* (BFZ): "Devoid. When Wasteland Strangler enters the battlefield, you may put a card an opponent owns from exile into their graveyard. If you do, target creature gets -3/-3 until end of turn." Processes an ingested card for -3/-3.

## Canonical Examples

**Level Up:**
- *Student of Warfare*: Pay {W} × 7 to level up to 7+. Becomes a 4/4 with double strike for {7}{W} total investment over multiple turns. Efficient if you reach level 7+.

**Outlast:**
- Abzan Outlast deck: each turn, Outlast a different creature → each gets a +1/+1 counter → triggers "as long as it has a counter" bonuses across the team.

**Ingest:**
- Turn 3: *Salvage Drone* deals combat damage → opponent exiles top card. Turn 4: cast *Wasteland Strangler* (ETB: process the exiled card → target creature -3/-3). Ingest → Process chain.

## Commonly Confused With

- **P418** (Graft/Modular) — Modular uses +1/+1 counters for power/toughness; Level Up uses level counters as CDA triggers; different counter types, different layer applications
- **P447** (Training/Compleated) — Training places +1/+1 counters when attacking alongside higher-power creatures; Outlast places counters when NOT attacking; opposite combat conditions
- **P465** (Proliferate) — Proliferate affects "a counter of each kind already there"; Proliferating level counters advances levels; key interaction documented here
- **P459** (Discover/Mill/Collect Evidence) — Ingest exiles ONE card from opponent's library; Mill puts N cards into GY; both are library-to-other-zone effects but completely different zones and amounts
