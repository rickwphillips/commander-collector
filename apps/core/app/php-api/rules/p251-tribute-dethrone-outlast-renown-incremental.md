---
id: p251
name: Tribute, Dethrone, Outlast, and Renown — Incremental Counter Mechanics
category: triggered
cr_refs: [702.104a, 702.105a, 702.107a, 702.112a]
tags: [tribute, dethrone, outlast, renown, counter, ETB-choice, multiplayer, Theros-Born-of-Gods, Conspiracy, Khans-Tarkir, Magic-Origins, Rageblood-Shaman, Marchesa-the-Black-Rose]
created: 2026-03-28
examples_count: 2
---

# P251 — Tribute, Dethrone, Outlast, and Renown — Incremental Counter Mechanics

## Abstract
Four distinct counter-accumulation mechanics from Theros, Conspiracy, and Khans of Tarkir blocks. **Tribute N**: opponent chooses to let it enter with N counters (making it smaller but preventing your bonus effect) or refuse (it enters small but your bonus fires). **Dethrone**: put a +1/+1 counter on this creature whenever it attacks the player with the most life — encourages attacking the leader in multiplayer. **Outlast**: pay a cost and tap to add a +1/+1 counter at sorcery speed — slow but repeatable. **Renown N**: the first time this creature deals combat damage to a player, put N +1/+1 counters on it permanently — a "first blood" mechanic. All four reward combat engagement or opponent decision points.

## The Definitive Rules

**CR 702.104a** (verbatim): *"Tribute is a static ability that functions as the creature with tribute is entering the battlefield. 'Tribute N' means 'As this creature enters, choose an opponent. That player may put an additional N +1/+1 counters on it as it enters.'"*

**CR 702.105a** (verbatim): *"Dethrone is a triggered ability. 'Dethrone' means 'Whenever this creature attacks the player with the most life or tied for most life, put a +1/+1 counter on this creature.'"*

**CR 702.107a** (verbatim): *"Outlast is an activated ability. 'Outlast [cost]' means '[Cost], {T}: Put a +1/+1 counter on this creature. Activate only as a sorcery.'"*

**CR 702.112a** (verbatim): *"Renown is a triggered ability. 'Renown N' means 'When this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counters on it and it becomes renowned.'"*

## The Pattern

```
TRIBUTE:
  ETB replacement: as the creature enters, the CHOSEN OPPONENT may add N counters to it
  The opponent CHOOSES: add counters (creature enters larger) OR don't (creature enters small but your bonus fires)
  "If tribute wasn't paid" → your bonus effect happens if opponent didn't add counters
  This creates a dilemma for the opponent: pay tribute (bigger threat) or don't (bonus effect)
  Neither option is strictly wrong — opponent chooses which is worse for them

  TRIBUTE CARDS (Born of the Gods):
    Nessian Wilds Ravager ({4}{G}{G}): 6/6, Tribute 6 — "if tribute wasn't paid, when this creature enters, it fights target creature."
      Opponent's choice: let it enter as a 12/12 OR enter as 6/6 that fights their best creature.
      Both options are bad: a 12/12 is overwhelming; a 6/6 that kills their key creature is removal.
    Flame-Wreathed Phoenix ({2}{R}{R}): 3/3 Flying Haste, Tribute 2 — "if tribute wasn't paid, this creature has haste and returns from GY to hand at your upkeep."
      Opponent lets it enter as 5/5: huge haste flier. OR enters as 3/3 haste with RECURSIVE RECURSION.
      The 3/3 with infinite recursion might actually be the worse choice for opponent!

DETHRONE:
  Triggered: whenever this creature attacks the player with the MOST LIFE (or tied for most)
  Effect: put a +1/+1 counter on this creature
  "Most life": check at time of attack declaration
  Multiplayer: the "richest" player (most life) is the one you get rewarded for attacking
  Creates incentive to attack the life leader (democratic violence)

  DETHRONE CARDS (Conspiracy):
    Marchesa, the Black Rose ({1}{U}{B}{R}): 3/3, Dethrone. "Whenever another creature you control with a +1/+1 counter on it dies, return it to the battlefield under your control at beginning of next end step."
      Dethrone + attack leader → Marchesa gets counter → Marchesa becomes 4/4
      Any creature with a counter (from Dethrone or other) dies → returns under your control
      Marchesa synergy: put counters on creatures (via Dethrone), they come back when they die
      In multiplayer: attack whoever has the most life → build an army that refuses to stay dead

  DETHRONE + TIED LIFE:
    "Most life or tied for most life": if two players are tied at 40 life, attacking either triggers Dethrone
    Multiple players tied → attack any of the tied players → Dethrone triggers

OUTLAST:
  Activated ability: [cost] + {T}: put a +1/+1 counter on this creature. Sorcery speed only.
  The creature must be untapped to use Outlast (it taps as part of the cost)
  Sorcery speed: can't use during combat or opponent's turn
  Outlast creatures accumulate counters over time but have synergistic payoffs

  OUTLAST SYNERGIES:
    Many Outlast cards give abilities to creatures with +1/+1 counters, or pump based on +1/+1 counts
    Abzan is the Outlast clan in Khans of Tarkir
    Abzan Falconer ({2}{W}): Outlast {W}, "creatures you control with a +1/+1 counter have flying."
    Abzan Battle Priest: "creatures you control with +1/+1 counter have lifelink."
    Build: give one creature an Outlast counter → it gains flying/lifelink/trample → team benefit

  OUTLAST CARDS (Khans of Tarkir):
    Chief of the Edge ({W}{B}): 3/2, "other Warrior creatures you control get +1/+0."
    Longshot Squad ({3}{G}): Outlast {G}, "creatures you control with a +1/+1 counter on them have reach."

RENOWN:
  Triggered: "when this creature deals combat damage to a player, if it isn't renowned, [effect]"
  Once renowned: never triggers again (Renown is a one-time event)
  Renowned status resets if the creature leaves the battlefield (it's a new object when it returns)
  Renown is a permanent "designation" like Monstrous: tracks state, not a counter

  RENOWN + PROTECTING THE CREATURE:
    The creature must deal combat damage to a player — avoid giving renown to blocked creatures
    Give the creature trample/flying/evasion to ensure it connects
    Hexproof + Renown: protect the creature so it can deal damage safely

  RENOWN CARDS (Magic Origins):
    Consul's Lieutenant ({W}{W}): 2/1 First Strike, Renown 1 — "Whenever this creature attacks, if it's renowned, attacking creatures you control get +1/+1 until EOT."
      Once renowned: leads your attacks with a +1/+1 anthem for all attackers.
    Kytheon, Hero of Akros ({W}): Renown 1 (and transforms to Gideon when 3 creatures attack with it).
      Renown 1 + 3 other attackers: becomes a planeswalker.
```

## Definitive Conclusions

- **Tribute** creates a dilemma for the opponent: they choose counters (bigger body) or no counters (your bonus fires).
- **Dethrone** triggers on attacking the highest-life player — rewards aggression against the leader.
- **Outlast** adds counters at sorcery speed; synergies make countered creatures more powerful.
- **Renown** is a one-time trigger — first combat damage to a player makes the creature "renowned" with counters.
- **Renowned status resets** on zone changes (new object = not renowned).

## Canonical Example
**Marchesa, the Black Rose (Dethrone) in Commander:**
Multiplayer Commander game. Players at 40 life each (or the leader has 45+).
Attack the life leader with Marchesa: Dethrone triggers → Marchesa gets a +1/+1 counter → 4/4.
Other creatures attack with +1/+1 counters (from previous Dethrone attacks on Marchesa).
One of your Dethrone-pumped creatures dies in combat: it had a +1/+1 counter → Marchesa's ability fires: return it to battlefield at next end step.
Creatures refuse to die (they always come back because they have counters from Dethrone).
The "attack the leader" incentive rewards you with both counters AND recursion.

**Example 2 — Tribute Dilemma (Nessian Wilds Ravager):**
You cast Nessian Wilds Ravager ({4}{G}{G}). Opponent's board: Emrakul, the Aeons Torn (15/15).
Tribute 6: "As this creature enters, chosen opponent may put 6 +1/+1 counters on it."
Opponent's choice:
  Pay tribute: Ravager enters as 12/12 (but NO fight trigger). A 12/12 is terrifying but Emrakul survives.
  Don't pay tribute: Ravager enters as 6/6 with fight trigger → Ravager fights Emrakul.
  6/6 vs 15/15: Ravager dies, Emrakul takes 6 damage (not lethal on indestructible Emrakul... it's annihilator 6).
  Actually: neither option destroys Emrakul. Opponent probably lets it enter as 12/12 and blocks with Emrakul.
Tribute is "choose your poison" — opponent picks the lesser evil.

## Commonly Confused With
- **P226 (Monstrous)** — Monstrous is a one-time activated counter + state change. Renown is a one-time triggered counter + state change on combat damage.
- **P225 (Heroic)** — Heroic triggers on targeting; Renown triggers on combat damage connection.
- **P173 (Exalted)** — Exalted pumps when attacking alone; Dethrone pumps when attacking the life leader.
