---
id: p254
name: Skulk, Escalate, Melee, and Emerge — Shadows Over Innistrad Era Mechanics
category: costs
cr_refs: [702.118a, 702.119a, 702.119c, 702.120a, 702.121a]
tags: [skulk, escalate, melee, emerge, evasion, modal, combat, sacrifice, Shadows-over-Innistrad, Eldritch-Moon, Distended-Mindbender, Collective-Brutality, Prized-Amalgam]
created: 2026-03-28
examples_count: 2
---

# P254 — Skulk, Escalate, Melee, and Emerge — Shadows Over Innistrad Era Mechanics

## Abstract
Four mechanics from the Shadows Over Innistrad block (2016). **Skulk**: evasion where the creature can't be blocked by creatures with greater power — small skulk creatures are often unblockable against large threats but blockable by other weenies. **Escalate**: a cost-per-additional-mode mechanic where you pay an escalate cost for each mode chosen beyond the first. **Melee**: whenever this creature attacks, it gets +1/+1 for each opponent you attacked this turn — rewards attacking multiple opponents in multiplayer. **Emerge**: sacrifice a creature to reduce the emerge spell's cost by that creature's mana value — a cheaper Eldrazi cast using your creature's mana value as a discount.

## The Definitive Rules

**CR 702.118a-b** (verbatim): *"Skulk is an evasion ability. A creature with skulk can't be blocked by creatures with greater power."*

**CR 702.119a** (verbatim): *"Emerge represents two static abilities that function while the spell with emerge is on the stack. 'Emerge [cost]' means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost' and 'If you chose to pay this spell's emerge cost, its total cost is reduced by an amount of generic mana equal to the sacrificed creature's mana value.'"*

**CR 702.119c** (verbatim): *"You choose which permanent to sacrifice as you choose to pay a spell's emerge cost (see rule 601.2b), and you sacrifice that permanent as you pay the total cost (see rule 601.2h)."*

**CR 702.120a** (verbatim): *"Escalate is a static ability of modal spells that functions while the spell with escalate is on the stack. 'Escalate [cost]' means 'For each mode you choose beyond the first as you cast this spell, you pay an additional [cost].' Paying a spell's escalate cost follows the rules for paying additional costs in rules 601.2f–h."*

**CR 702.121a** (verbatim): *"Melee is a triggered ability. 'Melee' means 'Whenever this creature attacks, put a +1/+1 counter on this creature for each opponent you attacked this turn.'"*

## The Pattern

```
SKULK:
  Evasion: can't be blocked by creatures with GREATER POWER (not equal or lesser)
  A skulk 1/1: can't be blocked by creatures with power 2+
  A skulk 2/3: can't be blocked by creatures with power 3+
  A skulk 0/1: can't be blocked by ANY creature with power 1+ (only blocked by power 0)
  Typical: small skulk creatures slip through large blockers, but 1/1 weenies can block them

  SKULK + PUMP:
    Pump a skulk creature to power 3: it's still blocked by power 4+ only
    But: if you pump to the same power as their blocker, the blocker can block it
    "Can't be blocked by creatures with GREATER power" — equal power CAN block
    Opponents can pump a blocker to match your skulk creature's power to block it

  SKULK CARDS (Shadows over Innistrad):
    Shambling Ghoul ({1}{B}): 2/3 skulk. Only blocked by power 3+.
    Topplegeist ({W}): 1/1 flying skulk. Can only be blocked by flying power 2+ creatures.
    Silumgar Assassin ({1}{B}): 2/1 skulk — good with exploit (covered in P252).

EMERGE:
  Alternative cost: pay emerge cost + sacrifice a creature
  Discount: the total cost is reduced by the sacrificed creature's MANA VALUE
  Emerge = "emerge cost base - sacrificed creature's CMC = actual mana paid"

  EMERGE CALCULATION:
    Elder Deep-Fiend ({8}, Emerge {5}{U}): emerge cost {5}{U}, sacrifice a creature.
    Sacrifice Prized Amalgam ({2}{U}{B}, MV 4): emerge cost {5}{U} reduced by 4 = {1}{U}.
    Pay {1}{U} to cast Elder Deep-Fiend (8/8 Flash)!
    Flash: can be cast at instant speed. {1}{U} for an 8/8 flash.
    The sacrificed creature fuels the discount.

  EMERGE + ETB:
    The sacrificed creature triggers "whenever a creature dies" abilities.
    Prized Amalgam: it's in GY now. Amalgam's ability: "whenever a creature enters from GY, return Amalgam to battlefield."
    So: sacrifice Amalgam to emerge → Amalgam is in GY → cast Elder Deep-Fiend → it enters from GY? No wait:
    Elder Deep-Fiend is cast and enters from the stack (not GY). Amalgam returns from GY when a creature enters from GY.
    Amalgam doesn't trigger itself here. But if another creature entered from GY this turn: Amalgam would return.
    The sacrifice of Amalgam to emerge means Amalgam is in GY → available for future return triggers.

  EMERGE CARDS (Eldritch Moon):
    Elder Deep-Fiend ({8}, Emerge {5}{U}): 5/6 Flash, Eldrazi. "When enters, tap up to four target permanents."
      Sacrifice a 4-CMC creature: pay {1}{U} for a 5/6 flash that taps 4 permanents.
      In Modern Aether Vial decks: sacrifice a worn-out creature at instant speed → flash in Deep-Fiend → tap opponent's lands during their upkeep = they miss their land drop.
    Distended Mindbender ({10}, Emerge {5}{B}{B}): "When enters, target opponent reveals hand, discard a nonland with MV ≤ 3 and a card with MV ≥ 4."
      Sacrifice a 5-CMC creature: pay {B}{B} for an 11/11 + Thoughtseize targeting two specific cards.

ESCALATE:
  Additional cost per extra mode chosen
  "Choose one or more" modal spell + escalate = pay escalate cost for modes 2, 3, etc.
  First mode: free (included in base cost). Each additional mode: +escalate cost.

  ESCALATE CALCULATION:
    Collective Brutality ({1}{B}), Escalate (discard a card): "Choose one or more."
    Modes: (1) Drain 2/gain 2 (2) Counter target noncreature spell (3) Destroy target creature with 2 or less power.
    Choose one mode: {1}{B}, no escalate paid.
    Choose two modes: {1}{B} + discard 1 card (escalate cost once).
    Choose all three modes: {1}{B} + discard 2 cards (escalate cost twice).
    Collective Brutality all 3 modes: drain 2/gain 2 + counter a spell + kill a small creature, pay {1}{B} + discard 2.
    In madness decks: discard madness cards to pay escalate → get modes + madness triggers.

  ESCALATE CARDS:
    Collective Brutality ({1}{B}): most famous. Escalate = discard. Multiple modes with madness synergy.
    Collective Defiance ({1}{R}{R}): Escalate {R}. Modes: (1) target player discards hand and draws 4 (2) deal 4 damage to target creature (3) Collective Defiance deals 3 damage to each opponent.

MELEE:
  Triggered: "whenever this creature attacks, put a +1/+1 counter for each opponent you attacked this turn"
  1v1: attack one opponent → 1 counter.
  3-player game: if you attacked all 3 → 3 counters (but you must have attacked ALL opponents this turn).
  Rewards attacking broadly in multiplayer; minimal in 1v1.

  MELEE CARDS:
    Hixus, Prison Warden ({3}{W}{W}): Melee, Flash. "Whenever a creature attacks you or a planeswalker you control, if Hixus is untapped, exile that creature until Hixus leaves the battlefield."
      Melee + Flash: attack with Hixus → +N/+N, flash in mid-combat if needed.
    Mirri, Weatherlight Duelist: Melee + "each opponent can only block with one creature" — powerful in multiplayer.
```

## Definitive Conclusions

- **Skulk** lets creatures slip past larger threats — blocked only by equal-or-smaller power.
- **Emerge** reduces the cost by the sacrificed creature's mana value — can produce huge Eldrazi cheaply.
- **Escalate** charges per mode beyond the first — Collective Brutality uses discards as the escalate cost (madness synergy).
- **Melee** scales in multiplayer — rewards attacking all opponents in one turn.
- **Elder Deep-Fiend** with Emerge + Flash is the Eldritch Moon competitive showcase: sacrifice a 4-CMC creature, flash in a 5/6 that taps 4 permanents for {1}{U}.

## Canonical Example
**Elder Deep-Fiend Emerge Combo (Modern Aether Vial):**
Turn 4. Battlefield: Prized Amalgam ({2}{U}{B}, 3/3, MV 4).
Opponent's upkeep: cast Elder Deep-Fiend ({8}) for emerge cost ({5}{U}) minus Amalgam's MV (4) = pay {1}{U}.
Sacrifice Amalgam to emerge. Pay {1}{U}. Flash: cast at instant speed (opponent's upkeep).
Elder Deep-Fiend (5/6) enters: "tap up to 4 target permanents." Tap all 4 of opponent's lands.
Opponent misses their 4th land drop (tapped at start of their turn).
Their mana is locked. Your 5/6 is on the battlefield.
Meanwhile: Prized Amalgam in GY → will return to battlefield at end of YOUR next turn when a creature enters from GY.
Cost breakdown: {1}{U} for a 5/6 Flash that denied opponent's entire mana for a turn.

**Example 2 — Collective Brutality All Modes:**
Hand: Collective Brutality, Fiery Temper (madness {R}).
Opponent cast a noncreature spell. They control a 1/1 creature. They're at 20 life.
Cast Collective Brutality ({1}{B}), choose all 3 modes: Escalate twice (discard 2 cards).
Discard 1: Fiery Temper → madness trigger: cast Fiery Temper for {R} → deal 3 damage to any target.
Discard 2: another card.
All 3 modes: counter the noncreature spell, destroy the 1/1, drain opponent 2 + gain 2.
Plus: Fiery Temper madness: deal 3 damage.
Total: counter a spell + kill a creature + drain 2 + deal 3 damage for {1}{B}{R} and discarding 2 cards.
Collective Brutality × escalate + madness = incredible value.

## Commonly Confused With
- **P230 (Entwine)** — Entwine chooses ALL modes by paying an extra cost; Escalate charges per ADDITIONAL mode (scalable to any number of modes).
- **P193 (Tiered)** — Tiered requires paying a cost to choose each mode; Escalate's first mode is free.
- **P234 (Shadow)** — Skulk is blocked by equal or lesser power; Shadow is blocked only by other Shadow creatures. Different evasion paradigms.
