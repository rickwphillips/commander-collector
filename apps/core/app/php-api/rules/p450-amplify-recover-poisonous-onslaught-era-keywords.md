---
id: p450
name: Amplify, Recover, and Poisonous — Onslaught-Era Hand-Reveal, Graveyard-Conditional Return, and Poison-on-Damage Keywords
category: zones
cr_refs: [702.38, 702.59, 702.70, 104.3d, 603.2, 614.1c]
tags: amplify, recover, poisonous, onslaught, legions, graveyard, hand-reveal, poison-counters, enters-with-counters, triggered
created: 2026-03-29
examples_count: 6
---

# P450 — Amplify, Recover, and Poisonous — Onslaught-Era Hand-Reveal, Graveyard-Conditional Return, and Poison-on-Damage Keywords

## Abstract

Three Onslaught/Legions-era keywords are commonly misunderstood due to sparse modern play: **Amplify** generates enters-the-battlefield counters based on creature type cards revealed from hand — but the reveal happens *as* the creature enters, not after; **Recover** is an unusual triggered ability that fires in the graveyard when *another* creature dies, offering a binary choice: pay cost and return to hand, or exile; and **Poisonous** is a triggered ability that deals N poison counters to a player when this creature deals them *combat* damage — distinct from Infect (which replaces all damage with counters) and Toxic (which adds poison counters in addition to normal damage). All three are formally defined keyword abilities in CR 702.

## The Definitive Rules

### Amplify (CR 702.38)
**CR 702.38a verbatim:** *"Amplify is a static ability. 'Amplify N' means 'As this object enters, reveal any number of cards from your hand that share a creature type with it. This permanent enters with N +1/+1 counters on it for each card revealed this way. You can't reveal this card or any other cards that are entering the battlefield at the same time as this card.'"*

**CR 702.38b verbatim:** *"If a creature has multiple instances of amplify, each one works separately."*

### Recover (CR 702.59)
**CR 702.59a verbatim:** *"Recover is a triggered ability that functions only while the card with recover is in a player's graveyard. 'Recover [cost]' means 'When a creature is put into your graveyard from the battlefield, you may pay [cost]. If you do, return this card from your graveyard to your hand. Otherwise, exile this card.'"*

### Poisonous (CR 702.70)
**CR 702.70a verbatim:** *"Poisonous is a triggered ability. 'Poisonous N' means 'Whenever this creature deals combat damage to a player, that player gets N poison counters.'"*

**CR 702.70b verbatim:** *"If a creature has multiple instances of poisonous, each triggers separately."*

**CR 104.3d** (Poison counter win/loss): A player with 10 or more poison counters loses the game as a state-based action.

## The Pattern

```
AMPLIFY pattern:
As [creature with Amplify N] enters the battlefield:
  → This is an ETB replacement / "as enters" effect (CR 614.1c)
  → Reveal any number of cards from hand sharing a creature type with it
  → Cannot reveal the card itself or any other card entering simultaneously
  → Enters with N +1/+1 counters for each revealed card
  → Counter-doubling replacements (Doubling Season, Hardened Scales) apply here
  → The choice and reveal happen before the creature is fully on the battlefield
  → Multiple amplify instances: each tracks separately
    (Amplify 1 and Amplify 2 with 3 reveals = 3 + 6 = 9 counters)

RECOVER pattern (triggers in graveyard):
When [any creature] is put into YOUR graveyard from the battlefield:
  → If [card with Recover] is in your graveyard:
    → Recover trigger goes on the stack
    → On resolution: pay the cost → return to hand
    → Don't pay → exile the recover card (mandatory)
  → The recover card must STILL be in your graveyard when the trigger resolves
  → If the recover card was already removed from GY, the trigger does nothing

POISONOUS pattern:
When [creature with Poisonous N] deals combat damage to a player:
  → Triggered ability goes on stack
  → On resolution: that player gets N poison counters
  → Multiple instances of poisonous each trigger separately
  → Poisonous ONLY triggers on combat damage (not activated abilities, not ETB effects)
  → Does NOT replace damage (the player also loses life)
  → Compare to Infect: Infect replaces damage to players with poison counters
  → Compare to Toxic: Toxic adds poison counters in addition to full damage
```

## Definitive Conclusions

**Amplify:**
- Amplify is an "as this enters" effect (a replacement/modification), not a triggered ability. It cannot be Stifled (CR 702.38a says "as this object enters"). Torpor Orb also does NOT stop amplify — Torpor Orb suppresses triggered abilities, not "as this enters" replacement effects.
- Counters from amplify are placed "as the creature enters," so Doubling Season and Hardened Scales apply (they replace "enter with N counters" events per P100/P025).
- You can reveal 0 cards and still have the amplify creature enter normally with 0 counters — the reveal is optional ("reveal any number").
- You cannot reveal the amplify creature itself from your hand (it's being cast), nor another creature entering simultaneously (mass token creation, etc.).
- Amplify checks creature type against the amplify creature's printed type line (or its current type if it has a CDA like Changeling). A Changeling in hand can be revealed for any amplify creature.

**Recover:**
- Recover is uniquely binary and mandatory on the "don't pay" branch: if you choose NOT to pay the recover cost, the recover card is exiled immediately. You cannot let it stay in the graveyard.
- The trigger fires when ANY creature goes to YOUR graveyard — including the creature with recover itself if it's somehow already in your graveyard and another creature dies. Wait — recover triggers when another creature dies; if the recover card itself goes to the graveyard at the same time, there may be no trigger (the recover card wasn't in the GY when the event happened). CR 603.6a: triggered abilities check whether the condition existed when the event occurred.
- If multiple creatures die at the same time, recover triggers once per creature (CR 603.2c). Each trigger is handled separately.
- Recover does NOT let you return the creature for free; you must pay the stated cost.
- Grafdigger's Cage prevents returning cards from GY to hand via abilities, so Cage blocks recover.

**Poisonous:**
- Poisonous N is completely different from Infect: a creature with Poisonous 2 that deals 3 combat damage to a player causes the player to take 3 damage AND get 2 poison counters. Infect would give 3 poison counters and no life loss.
- Poisonous only triggers on combat damage. A creature with Poisonous tapped by Opposition does not give poison counters.
- Proliferate can increase a player's poison counters after a poisonous creature deals damage.
- Poisonous creatures from Lorwyn/Shadowmoor are different from New Phyrexia's Toxic (702.164): Toxic N means "if this creature deals combat damage to a player, they get N poison counters in addition to the normal damage." The effect is identical — poison counters in addition to normal damage — but Toxic is the modern name for the same interaction.

## Canonical Examples

**Amplify:**
- *Canopy Crawler* (Onslaught) — "Amplify 1: As Canopy Crawler enters, you may reveal any number of Beast and/or Elf cards from your hand. It enters with a +1/+1 counter on it for each card revealed this way." Revealing 4 Beast cards while casting Canopy Crawler → enters as a 7/6 (3/2 base + 4 counters).

**Recover:**
- *Withered Wretch* is in your graveyard (it has Recover {2}{B}). A creature dies to lethal combat damage. Recover triggers. You pay {2}{B}: Withered Wretch returns to hand. If you decline, Withered Wretch is exiled.
- *Grim Harvest* — "Recover {1}{B}" — the classic Recover card. Careful: if Grim Harvest is in your GY and you have two creatures die simultaneously, two recover triggers both fire; you'll need to pay {1}{B} for the first trigger or exile Grim Harvest, preventing the second trigger from doing anything.

**Poisonous:**
- *Pit Scorpion* (Ice Age, errata'd to have Poisonous 1): whenever it deals combat damage to a player, that player gets 1 poison counter (in addition to the life loss). The player dies when they reach 10 poison counters.
- *Crypt Cobra* (Mirage, Poisonous 4): Dealing combat damage to a player gives them 4 poison counters. A single hit puts a player halfway to losing.

## Commonly Confused With

- **P037** (Infect/Wither) — infect replaces all damage to players with poison counters (no life loss); poisonous/toxic adds counters on top of normal damage
- **P068 / P179** (Toxic) — Toxic is the modern functional equivalent of Poisonous: both add N poison counters when dealing combat damage in addition to normal damage
- **P100** (Enters-With-Counters Replacement) — Amplify's counters are subject to counter-doubling replacements like Doubling Season
- **P023** (Torpedo Orb / Trigger Suppression) — Torpor Orb does NOT stop Amplify (it's an "as enters" effect, not a triggered ability); Torpor Orb DOES stop Poisonous (it's triggered)
