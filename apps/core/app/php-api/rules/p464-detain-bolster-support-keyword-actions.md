---
id: p464
name: Detain, Bolster, and Support — Targeted Permanent Locking, Lowest-Toughness Counter, and N-Creature Counter Spread
category: triggered
cr_refs: [701.35, 701.39, 701.41, 603.2, 704.5, 301.5, 508.1, 600.1]
tags: detain, bolster, support, keyword-action, return-to-ravnica, fate-reforged, oath-of-gatewatch, counter-placement, locked-down, lowest-toughness
created: 2026-03-29
examples_count: 7
---

# P464 — Detain, Bolster, and Support — Targeted Permanent Locking, Lowest-Toughness Counter, and N-Creature Counter Spread

## Abstract

Three keyword actions from Return to Ravnica / Khans block create non-obvious counter-placement and permanent-locking rules: **Detain** (Return to Ravnica, CR 701.35) locks a nonland permanent so it can't attack, block, or have activated abilities used; **Bolster N** (Fate Reforged, CR 701.39) places N +1/+1 counters on the creature you control with the lowest toughness; and **Support N** (Oath of the Gatewatch, CR 701.41) places one +1/+1 counter on each of up to N target creatures. All three create questions around what "locks" mean for triggered abilities, tiebreaking for lowest toughness, and whether the supporting creature itself can be a target.

## The Definitive Rules

### Detain (CR 701.35)
**CR 701.35a verbatim:** *"Until your next turn, the chosen permanent can't attack or block and its activated abilities can't be activated."*

Detain doesn't affect triggered abilities or static abilities of the permanent. It only prevents: (a) attacking, (b) blocking, and (c) activating activated abilities. The permanent can still trigger abilities, apply static effects, and exist normally — it's just locked from active use.

### Bolster N (CR 701.39)
**CR 701.39a verbatim:** *"To bolster N, choose a creature you control with the least toughness or tied for least toughness among creatures you control. Put N +1/+1 counters on that creature."*

Key: you choose among creatures tied for the lowest toughness. If you have a 1/1, a 2/2, and a 3/3, the 1/1 has the least toughness and must receive the counters — no choice there. But if you have two 1/1s and a 2/2, you choose which 1/1 gets the counters.

### Support N (CR 701.41)
**CR 701.41a verbatim:** *"Support N means 'Put a +1/+1 counter on each of up to N target creatures you control.'"*

Support N targets up to N creatures you control. Each targeted creature gets exactly one counter (not N counters — one per targeted creature, up to N creatures total). The support creature itself can be one of the targets.

## The Pattern

```
DETAIN pattern:
Effect: "Until your next turn, [permanent] can't attack or block and its
        activated abilities can't be activated."
  → Affects: attacking, blocking, activating abilities
  → Does NOT affect:
    → Triggered abilities (they still trigger)
    → Static abilities (they still apply)
    → Mana abilities (they... wait: Detain says "activated abilities can't be activated"
      — mana abilities ARE activated abilities per CR 605.1; however, CR 605.3b says
      mana abilities can be activated "at any time a player has priority OR any time
      a mana payment is required." Detain blocks the activation, so even mana abilities
      of a detained permanent can't be activated.)
    → Equip abilities: an Equipment's equip ability is activated → detained Equipment
      can't be equipped
    → Planeswalker loyalty abilities: these are activated abilities → detained planeswalker
      can't use loyalty abilities
  → Detained creatures: can still be enchanted, can still die, just can't attack/block
  → Duration: "until your next turn" — the beginning of your next turn (CR 701.35)
  → Multiple detain effects on the same permanent: they're all in effect; each expires
    at the controller's next turn (so opponent detained your creature → until opponent's next turn)

BOLSTER N pattern:
"Choose a creature you control with the LEAST toughness (or tied for least)"
  → Must choose from the tied-lowest-toughness creatures
  → If only one creature has the lowest toughness: that creature gets the counters (no choice)
  → If multiple tied: you choose one of them
  → Toughness checked CURRENTLY (after all effects, counters, etc.)
  → The N counters all go on one creature (not spread to multiple)
  → If you control no creatures: bolster does nothing (can't choose a creature)
  → The bolster creature itself can be the lowest-toughness creature (bolsters itself)
  → After bolster: toughness of target increased by N, which may shift it out of lowest
    (irrelevant for this bolster, but affects future bolster decisions)

SUPPORT N pattern:
"Put a +1/+1 counter on each of up to N target creatures you control"
  → Chooses UP TO N targets at cast/activation time (can choose fewer)
  → Each chosen creature gets exactly one +1/+1 counter
  → Supports the CASTING creature itself as a valid target (unlike many effects that
    say "another target")
  → If N=2: choose up to 2 of your creatures, each gets 1 counter
  → Support spell vs. bolster: support SPREADS counters (1 per creature); bolster
    CONCENTRATES counters (all N on one creature)
  → Targeting: if a target becomes illegal before resolution (bounced, hexproof, etc.),
    the remaining legal targets still get their counter
```

## Definitive Conclusions

**Detain:**
- Detained planeswalkers can't use loyalty abilities (activating loyalty abilities is how planeswalkers use their abilities — they are activated abilities). A detained planeswalker still triggers abilities if something affects it, and its static effects still apply (if any), but the +/−/ultimate abilities are locked.
- Detained creatures' mana tap abilities are locked: if a Forest is detained, its "{T}: Add {G}" ability is an activated mana ability — detained, so can't be activated. Detained mana dorks (Llanowar Elves) can't produce mana.
- Detain does NOT untap the permanent. If a creature was already tapped before being detained, it stays tapped. The detain prevents further activation but doesn't change the tapped/untapped state.
- Key cards: *Lyev Skyknight* (RTR): "When Lyev Skyknight enters the battlefield, detain target nonland permanent an opponent controls." Flying 3/1 that removes a blocker, a planeswalker ability, or an activated ability source.
- *Deputy of Detention* (RNA): Modernized detain. "When Deputy of Detention enters the battlefield, exile target nonland permanent an opponent controls and all other permanents with the same name." Not pure detain, but similar design space.

**Bolster:**
- Bolster is great for protecting vulnerable small creatures: if you have a 1/1 token at risk of dying, bolster makes it a 1+N/(1+N) and may save it.
- Bolster targets your creature with the lowest toughness — often a token or a small utility creature you want to protect. In a tokens deck, all your tokens may be tied (all 1/1s) and you pick which one gets bigger.
- Bolster doesn't target — it's an instruction to choose a creature with the lowest toughness. "Choose" here is not targeting (no targeting rules apply). This means hexproof doesn't protect the chosen creature (hexproof only prevents being targeted; see CR 702.11). However, shroud would protect it (since shroud says "can't be the target of spells or abilities" — but bolster says "choose," not "target"). Wait: CR 701.39a says "choose a creature" — not "target a creature." Bolster bypasses hexproof and shroud! It is an untargeted effect. The creature with the lowest toughness is chosen at resolution (not at cast time).
- Key cards: *Abzan Skycaptain* (FRF): "Flying. When this creature dies, bolster 2." A 2/2 flyer that bolsters 2 on death (not ETB) — gives counters to your lowest-toughness creature when it dies.
- *Enduring Scalelord* (DTK): "Flying. Whenever one or more +1/+1 counters are placed on another creature you control, put a +1/+1 counter on Enduring Scalelord." Bolster triggers Scalelord if Scalelord isn't the target of the bolster.

**Support:**
- Support is the opposite of bolster in terms of distribution: support spreads one counter per creature across up to N creatures; bolster puts all N counters on one creature.
- The supporting card's creature itself can be one of the up-to-N targets. A spell that says "Support 2" can target itself and one other creature, giving both a +1/+1 counter.
- Support can be used with fewer than N targets: "Support 3" with only 1 creature you control lets you target just that 1 creature for 1 counter.
- Key cards: *Shoulder to Shoulder* (OGW): "Support 2. Draw a card." Choose up to 2 creatures you control, each gets a +1/+1 counter, draw a card. Efficient spell for Allies and Eldrazi creatures.
- *Make a Stand* (ORI): Not support, but illustrates the "mass enhancement" space. *Joraga Auxiliary* (OGW): "Support 2."

## Canonical Examples

**Detain:**
- *Lyev Skyknight*: Classic Azorius police card. 3/1 flyer that detains a nonland permanent — removes a blocker, disables a planeswalker, stops an activated source.

**Bolster:**
- *Abzan Falconer* (KTK): "Outlast {W}. Each creature you control with a +1/+1 counter on it has flying." Note: Abzan Falconer has Outlast, not Bolster. It provides a static flying grant to counter-bearing creatures. (See P484 for Outlast details.)

**Support:**
- *Kor Entanglers* + *Shoulder to Shoulder*: In an Allies deck, support and cohort work together to buff and use the team.

## Commonly Confused With

- **P029** (Targeting Rules) — Bolster uses "choose," not "target" — bypasses hexproof/shroud; Support uses "target" — hexproof creatures can't be targeted for support
- **P418** (Graft/Modular/Sunburst) — These are ETB/triggered counter mechanics; bolster and support are keyword actions on spell/ability resolution
- **P447** (Training) — Training puts a counter on the creature when it attacks alongside a higher-power creature; bolster puts counters on the lowest-toughness creature; both are counter-placement mechanics but in completely different contexts
- **P452** (Enrage) — Enrage triggers on receiving damage; bolster triggers on ETB or as a spell effect; both place counters but through different triggers
