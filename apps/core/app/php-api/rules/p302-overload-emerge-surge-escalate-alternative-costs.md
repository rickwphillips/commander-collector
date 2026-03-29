---
id: p302
name: Overload, Emerge, Surge, and Escalate — Alternative-Cost Mechanics That Change Scope or Reduce Cost
category: costs
cr_refs: [702.96a, 702.96b, 702.119a, 702.117a, 702.120a]
tags: [overload, emerge, surge, escalate, alternative-cost, text-change, target-to-each, sacrifice-creature, mana-value-reduction, Ravnica, Shadows-Over-Innistrad, Eldritch-Moon, Cyclonic-Rift, Elder-Deep-Fiend, Collective-Brutality]
created: 2026-03-29
examples_count: 2
---

# P302 — Overload, Emerge, Surge, and Escalate — Alternative-Cost Mechanics That Change Scope or Reduce Cost

## Abstract
Four alternative-cost mechanics from different sets that each provide a discount or scope change when special conditions are met. **Overload** (Ravnica) replaces "target" with "each" — hitting all valid objects instead of one, for a higher cost. **Emerge** (Eldritch Moon) lets you sacrifice a creature and reduce the spell's cost by that creature's mana value. **Surge** (Shadows over Innistrad) reduces cost if you've already cast another spell this turn. **Escalate** (Eldritch Moon) is a modal spell where choosing additional modes requires paying extra costs.

## The Definitive Rules

**CR 702.96a** (verbatim): *"Overload is a keyword that represents two static abilities that function while the spell with overload is on the stack. Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."'"*

**CR 702.96b** (verbatim): *"If a player chooses to pay the overload cost of a spell, that spell won't require any targets. It may affect objects that couldn't be chosen as legal targets if the spell were cast without its overload cost being paid."*

**CR 702.119a** (verbatim): *"Emerge represents two static abilities that function while the spell with emerge is on the stack. 'Emerge [cost]' means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost' and 'If you chose to pay this spell's emerge cost, its total cost is reduced by an amount of generic mana equal to the sacrificed creature's mana value.'"*

**CR 702.117a** (verbatim): *"Surge is a static ability that functions on the stack. 'Surge [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if you or a teammate has cast another spell this turn.' Casting a spell for its surge cost follows the rules for paying alternative costs."*

**CR 702.120a** (verbatim): *"Escalate is a static ability of modal spells that functions while the spell with escalate is on the stack. 'Escalate [cost]' means 'For each mode you choose beyond the first as you cast this spell, you pay an additional [cost].'"*

## The Pattern

```
OVERLOAD:
  Normal cast: pays mana cost, targets one specific object/player
  Overload cast: pays overload cost (usually higher), replaces all "target" with "each"
  The overloaded spell has NO targets (no legal target required)
    CR 702.96b: "won't require any targets"
  This means overloaded spells:
    - Can't be countered by countermagic that requires a target (Spell Pierce: still works as it counters spells)
    - Can hit hexproof/shroud objects (they can't be TARGETED, but overloaded spells don't target)
    - Can't be redirected or prevented per target (one big effect applies to all)

  OVERLOAD NOTABLE CARDS:
    Cyclonic Rift ({1}{U}): Instant. "Return target non-land permanent you don't control to owner's hand."
      Overload {6}{U}: "Return each non-land permanent you don't control to its owner's hand."
      The one-sided board wipe: sends opponent's ENTIRE board back to hand.
      You don't control those permanents so they're all valid "each" targets.
      Overloaded at instant speed: end-step Cyclonic Rift is game-winning in Commander.
      The most powerful Commander instant ever printed.

    Mizzium Mortars ({1}{R}): Sorcery. "Mizzium Mortars deals 4 damage to target creature you don't control."
      Overload {3}{R}{R}{R}: deals 4 damage to each creature you don't control.
      Pseudo-wrath at 4 damage: kills anything with 4 or less toughness.
      Hits indestructible? No — damage doesn't destroy indestructible creatures directly.
      But: deals 4 damage regardless of hexproof (overloaded → no targeting).

    Teleportal ({U}{R}): Instant. "Target creature gets +2/+0 and is unblockable until EOT."
      Overload {4}{U}{R}: each creature you control gets +2/+0 and is unblockable.
      One-sided combat: none of your creatures can be blocked.

  OVERLOAD + HEXPROOF INTERACTION:
    The classic trap: "Cyclonic Rift can't hit my hexproof creature!"
    Hexproof prevents TARGETING. Overloaded CRift says "each" — no targeting.
    Hexproof does NOT protect from "each" effects.
    Your opponent's hexproof Slippery Bogle: overloaded Cyclonic Rift bounces it.

EMERGE:
  Alternative cost: pay emerge cost AND sacrifice a creature
  Cost reduction: subtract the sacrificed creature's MV from the emerge cost (generic only)
  "You may cast this spell by paying [emerge cost] and sacrificing a creature rather than paying mana cost."

  EMERGE MATH:
    Elder Deep-Fiend ({8}): Emerge {5}{U}. 5/6. "When cast, tap up to 4 target permanents."
    Normal cost: {8} generic. Expensive.
    Emerge {5}{U} + sacrifice a creature worth N mana:
      Total emerge cost = {5}{U} + sacrifice, then subtract N from {5}.
      Sacrifice a 3-MV creature: cost = {2}{U} + sacrifice.
      Sacrifice a 5-MV creature: cost = {0}{U} + sacrifice = {U}.
      You pay {U} and sacrifice a 5-mana creature to cast an 8-mana Eldrazi!
    In a ramp or token deck: sacrifice a creature you were going to lose anyway.

  EMERGE IMPORTANT RULES:
    The creature sacrifice is an ADDITIONAL cost (part of the emerge cost declaration).
    "Sacrifice" timing: same as other sacrifice-as-cost payments (at step 601.2h of casting).
    CR 702.119c: "You choose which permanent to sacrifice as you choose to pay its emerge cost."
    The sacrifice is paid as part of casting — you can't respond to it.

  EMERGE NOTABLE CARDS:
    Elder Deep-Fiend ({8}, emerge {5}{U}): flash. Tap 4 permanents on cast.
      In Standard, emerge during opponent's untap step with a token sacrifice:
      Tap their lands during their upkeep (before they untap if you get it at end of their turn? No...
      Actually Flash means cast instant-speed during opponent's turn).
      Tap their 4 untapped lands during their turn: major tempo swing.

    Distended Mindbender ({8}, emerge {5}{B}{B}): 5/5. Cast: target opponent reveals hand,
      discards one nonland card with MV ≤ 4 and one nonland card with MV ≥ 5.
      Emerge with sacrifice of a 4-drop: pay {1}{B}{B}. See and discard opponent's hand.

SURGE:
  Condition: "you or a teammate has cast another spell this turn"
  If condition met: may pay surge cost instead of mana cost (surge is cheaper)
  The "spell" preceding surge: can be ANY spell (not restricted to specific types).

  SURGE EXAMPLES:
    Reckless Bushwhacker ({2}{R}): Creature 2/1. Surge {R}.
      If you cast another spell this turn: pay {R} instead of {2}{R}.
      Turn 2: cast a {R} cantrip (e.g., Expedite granting haste), then surge Reckless Bushwhacker for {R}.
      Total cost: {R} + {R} = {R}{R} for a 2/1 haste with +1/+1 bonus to your team.
      Rush combo: two cheap spells for major aggro pressure.

    Crush of Tentacles ({4}{U}{U}): Sorcery. "Return all non-land permanents to owners' hands."
      Surge {3}{U}: if someone cast a spell this turn, pay {3}{U} instead of {4}{U}{U}.
      Then: create an 8/8 Octopus token. Surge bonus!
      Surge version: {3}{U} one-sided board wipe + 8/8 creature.

ESCALATE:
  Modal spell: choose one or more of several modes.
  First mode: pay the spell's mana cost.
  Each additional mode chosen: pay the escalate cost.
  CHOOSING MODES at cast time:

  ESCALATE EXAMPLES:
    Collective Brutality ({1}{B}): Sorcery. Escalate — Discard a card. Choose one or more:
      Mode 1: "Target player reveals hand; target opponent discards one instant or sorcery."
      Mode 2: "Target creature gets -2/-2 until EOT."
      Mode 3: "Target opponent loses 2 life and you gain 2 life."
      Choosing all three: pay {1}{B} + discard a card twice (escalate cost x2 for 2 extra modes).
      But: discard is a cost! And if you're discarding for synergy (madness, flashback): triple value.
      Cast all three modes + discard two synergy cards for escalate: maximize card advantage.

    Collective Effort ({1}{W}{W}): Escalate — Tap an untapped creature.
      Mode 1: creature gets +2/+2 and first strike.
      Mode 2: destroy target enchantment.
      Mode 3: put a +1/+1 on each creature your team controls.
      All three: tap three creatures (each escalate tap), but get three effects.
      In creature-heavy deck: untapped creatures are a resource for escalate costs.
```

## Definitive Conclusions

- **Overloaded spells replace "target" with "each" and require no targets** — hexproof and shroud don't protect against overloaded spells.
- **Emerge's cost reduction is based on the sacrificed creature's mana value** — a 5-MV sacrifice can eliminate most or all of the generic cost.
- **Surge requires another spell cast this turn** — cast any spell first to unlock surge cost.
- **Escalate pays extra per mode chosen beyond the first** — the first mode is free; each additional mode costs the escalate price.
- **Overloaded Cyclonic Rift is the most powerful Commander instant** — bounces everything opponents control at instant speed.

## Canonical Example
**Cyclonic Rift Overloaded — End-Step Wipe:**
Commander game. 4 players. Turn 10.
Opponent A has: Doubling Season + Avacyn + 5 creatures.
Opponent B has: Rhystic Study + 3 creatures.
Opponent C just played Jin-Gitaxias.
Your hand: Cyclonic Rift. Mana available at end of Opponent C's turn: {8}{U}.
End of Opponent C's turn: cast Cyclonic Rift with Overload ({6}{U}).
No targets needed (overloaded). Each non-land permanent opponents control returns to their hand.
Opponent A: Doubling Season gone, Avacyn gone, all 5 creatures gone.
Opponent B: Rhystic Study gone, creatures gone.
Opponent C: Jin-Gitaxias (that they just cast) — wait: it's still their turn, this resolves at end of their turn.
Jin-Gitaxias would return to their hand too.
The spell resolves instantly. Entire board wipes EXCEPT your permanents.
Your turn begins with an empty board (except yours).
Deploy threats into the vacuum. Win.
Cyclonic Rift overloaded: the most-feared Commander play at {7}U instant.

**Example 2 — Elder Deep-Fiend Emerge Flash in Eldritch Moon Draft:**
Turn 4: board has a 2/2 Vessel of Nascency (MV 1) and {U}{U} available.
Opponent's turn begins. They're tapping mana to cast something.
Flash trigger: you can cast Elder Deep-Fiend at instant speed (it has Flash).
Before opponent untaps (end step): cast Elder Deep-Fiend with Emerge.
Sacrifice Vessel of Nascency (MV 1): Emerge cost {5}{U}, subtract 1 = {4}{U}.
Pay {4}{U}. Sacrifice Vessel.
Cast trigger fires: "Tap up to 4 target permanents."
Tap opponent's 4 lands. Their spell that needed 4 mana: can't be cast.
Elder Deep-Fiend (5/6) enters. No summoning sickness (it was cast — wait, yes it has summoning sickness for attacking, but it's there as a blocker).
Opponent has no mana for their turn.
One sacrifice of a 1-drop + {4}{U} = 5/6 Eldrazi + lock opponent's mana for a turn.

## Commonly Confused With
- **P298 (Kicker)** — Kicker is an additional cost on top of mana cost; Overload, Emerge, Surge, Escalate are all alternative costs (replacing or modifying the mana cost).
- **P270 (Spree)** — Spree also adds costs per mode; Escalate is similar but Spree's base spell has no modes by default and each mode requires additional payment.
- **P282 (Escape/Delve)** — Both Escape and Emerge reduce costs; Escape exiles GY cards, Emerge sacrifices creatures and subtracts their MV.
- **P265 (Blitz)** — Blitz is also an alternative cost with a fixed bonus; Emerge's bonus is variable (depends on the sacrificed creature's MV).
