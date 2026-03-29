---
id: p248
name: Scavenge, Unleash, and Extort — Ravnica Return to Ravnica Mechanics
category: costs
cr_refs: [702.97a, 702.98a, 702.101a, 702.101b]
tags: [scavenge, unleash, extort, Ravnica, Golgari, Rakdos, Orzhov, Deadbridge-Goliath, Crimson-Muckwader, Blind-Obedience]
created: 2026-03-28
examples_count: 2
---

# P248 — Scavenge, Unleash, and Extort — Ravnica Return to Ravnica Mechanics

## Abstract
Three mechanics from Return to Ravnica (2012). **Scavenge**: pay a cost and exile the card from your graveyard to put +1/+1 counters equal to its power on target creature — graveyard-to-counters conversion. **Unleash**: an enters-the-battlefield choice to add a +1/+1 counter (but the creature can't block if it has one) — an aggression-or-defense tradeoff. **Extort**: whenever you cast a spell, you may pay {W/B} to make each opponent lose 1 life and you gain that much life — a scaling drain tied to casting spells rather than combat damage.

## The Definitive Rules

**CR 702.97a** (verbatim): *"Scavenge is an activated ability that functions only while the card with scavenge is in a graveyard. 'Scavenge [cost]' means '[Cost], Exile this card from your graveyard: Put a number of +1/+1 counters equal to the power of the card you exiled on target creature. Activate only as a sorcery.'"*

**CR 702.98a** (verbatim): *"Unleash is a keyword that represents two static abilities. 'Unleash' means 'You may have this permanent enter with an additional +1/+1 counter on it' and 'This permanent can't block as long as it has a +1/+1 counter on it.'"*

**CR 702.101a** (verbatim): *"Extort is a triggered ability. 'Extort' means 'Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain life equal to the total life lost this way.'"*

**CR 702.101b** (verbatim): *"If a permanent has multiple instances of extort, each triggers separately."*

## The Pattern

```
SCAVENGE:
  Activated ability: functions only while the card is in your GRAVEYARD
  Cost: pay scavenge cost + EXILE THIS CARD from your GY
  Effect: put +1/+1 counters equal to the card's POWER on target creature
  Sorcery speed only
  The exiled card is gone (no recursion possible after scavenging)

  SCAVENGE VALUE:
    High-power cards in GY = more counters from scavenge
    Deadbridge Goliath ({2}{G}{G}): 5/5, Scavenge {4}{G}{G} → exile it from GY → put 5 +1/+1 counters on a creature
    5 counters is significant; but the cost ({4}{G}{G}) is steep

  SCAVENGE + SELF:
    Can you scavenge a creature onto itself? No — the card is exiled FROM GY
    The card doing the scavenging is gone. Target creature must be on the battlefield already.
    Scavenge uses the POWER of the exiled card, not the target creature's power.

  SCAVENGE CARDS (Golgari — Return to Ravnica):
    Deadbridge Goliath ({2}{G}{G}): 5/5, Scavenge {4}{G}{G}. 5 counters for 6 mana.
    Slitherhead ({B/G}): 1/1, Scavenge {0}. FREE scavenge for 1 +1/+1 counter. Extremely efficient.
    Corpsejack Menace ({2}{B}{G}): 4/4, "whenever one or more +1/+1 counters would be placed on a creature you control, twice that many are placed instead."
    With Corpsejack + Scavenge Slitherhead: 1 scavenge → 2 counters (doubled). Free 2 counters!

UNLEASH:
  Two static abilities:
  1. Optional ETB: may have this permanent enter with an additional +1/+1 counter
  2. Restriction: can't block while it has a +1/+1 counter

  UNLEASH TRADEOFF:
    Take the counter: bigger creature, can't block → pure aggression
    Don't take counter: smaller creature, can block → defensive option
    Unleashed creature: focused on attacking, never blocking (pure beatdown)

  UNLEASH COUNTER REMOVAL:
    If the +1/+1 counter is removed (proliferate in reverse, opponent effects): can it block?
    Yes: "can't block as long as it has a +1/+1 counter" — remove the counter, it can block
    But: then it's smaller (no counter)

  UNLEASH + PROLIFERATE:
    Proliferate adds +1/+1 counters: an unleashed creature stays unleashed (can't block) with more counters
    A non-unleashed creature: if proliferate adds a +1/+1 counter via other effects, does unleash apply?
    The restriction: "as long as it has a +1/+1 counter" — if it has ANY +1/+1 counter (even from elsewhere), it can't block
    Careful: putting +1/+1 counters on unleash creatures from other sources also prevents blocking!

  UNLEASH CARDS (Rakdos — Return to Ravnica):
    Crimson Muckwader ({1}{R}): 2/2, Unleash.
      Without counter: 2/2 blocker.
      With counter: 3/3 that can't block. Attack every turn.
    Rakdos Cackler ({B/R}): 1/1 Unleash. 1/1 or 2/2 that can't block.
    Rix Maadi Guildmage: abilities reference unleash creatures

EXTORT:
  Triggered: "whenever you cast a spell, you may pay {W/B}"
  {W/B} = Orzhov hybrid mana (pay either {W} or {B})
  If paid: each OPPONENT loses 1 life; you gain that much life
  Multiplayer: 3 opponents losing 1 = you gain 3 life for {W/B}
  One trigger per spell cast: each spell = one extort trigger
  Multiple extort permanents: each triggers separately
  Two extort creatures: cast one spell → trigger fires twice → pay {W/B} + {W/B} → drain 2 from each opponent

  EXTORT VALUE:
    1-on-1: pay {W/B} → opponent loses 1, you gain 1 → 2 life swing per cast.
    Multiplayer Commander: 3 opponents × 1 = 3 life lost, you gain 3 life per extort activation.
    With 4 extort permanents: each spell → 4 triggers → potentially drain 4 from each opponent.
    Over 20 turns of casting spells: significant life drain, especially in Commander.

  EXTORT + BASIC LAND RESTRICTION:
    Extort is optional: you CHOOSE whether to pay {W/B} for each trigger
    You can let the trigger resolve without paying
    Useful when short on mana for other things

  EXTORT CARDS (Orzhov — Gatecrash):
    Blind Obedience ({1}{W}): Enchantment, "artifacts and creatures entering under opponents' control enter tapped," Extort.
      Both a stax piece AND an extort engine.
    Pontiff of Blight ({4}{B}{B}): 2/7, "other creatures you control have extort."
      Gives ALL your creatures extort: every creature's spell cast drains opponents.
    Crypt Ghast ({3}{B}): 2/2 Extort, "whenever you tap a Swamp, add {B} again."
      Doubles black mana + extort drain: very powerful in mono-black Commander.
```

## Definitive Conclusions

- **Scavenge** exiles from GY to put +1/+1 counters (equal to its power) on a creature — sorcery speed, one-time use.
- **Unleash** offers ETB counter for +1/+1 at the cost of being unable to block (while counter remains).
- **Extort** triggers on every spell you cast — pay {W/B} to drain each opponent and gain life.
- **Multiple extort permanents** each trigger separately — stack extort for massive drain effects.
- **Crypt Ghast + Pontiff of Blight** = every creature you cast drains opponents for each creature's extort.

## Canonical Example
**Extort in Orzhov Commander:**
Battlefield: Pontiff of Blight (gives all creatures extort), Blind Obedience (has extort), Crypt Ghast (has extort).
That's 3 extort sources. Cast any spell → 3 extort triggers.
Pay {W/B} three times → each opponent loses 3 life (in a 4-player game, total 9 life drained).
You gain 9 life from 3 opponents each losing 3.
Do this for 5 turns of casting: 45 life drained from opponents, 45 life gained.
This is the Orzhov soul drain game plan: every spell is a drain bomb in the long game.

**Example 2 — Scavenge Slitherhead Combo:**
Graveyard: Slitherhead ({B/G}, 1/1, Scavenge {0}).
Battlefield: Corpsejack Menace ("double counters placed on your creatures"), and a target creature.
Scavenge Slitherhead for {0}: exile Slitherhead from GY → put 1 +1/+1 counter on target creature.
Corpsejack doubles it: 2 counters placed instead of 1.
Cost: zero mana for 2 +1/+1 counters.
Repeat: if you have multiple Slitherheads in GY (e.g., milled), scavenge multiple → +2 counters per Slitherhead.
Free counter generation with Scavenge {0} + Corpsejack doubling.

## Commonly Confused With
- **P216 (Proliferate)** — Proliferate adds counters to existing permanents; Scavenge adds counters from GY by exiling the card.
- **P244 (Devour)** — Devour sacrifices creatures as they enter; Scavenge exiles from GY to add counters to a creature already on the battlefield.
- **P219 (Devotion)** — Extort is often in decks with devotion to white/black, but the mechanics are unrelated.
