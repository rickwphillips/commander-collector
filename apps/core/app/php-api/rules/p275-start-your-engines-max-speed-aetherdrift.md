---
id: p275
name: Start Your Engines! and Max Speed — Racing Speed Mechanic
category: triggered
cr_refs: [702.178a, 702.178b, 702.179a, 702.179b, 702.179c, 702.179d, 702.179e, 702.179f]
tags: [start-your-engines, max-speed, speed, racing, speed-1, speed-4, triggered, static, Aetherdrift, Emberdrop-Wyvern, Piston-Palm-Pistoleer, Accelerate-Soul]
created: 2026-03-29
examples_count: 2
---

# P275 — Start Your Engines! and Max Speed — Racing Speed Mechanic

## Abstract
Two mechanics from Aetherdrift (2025). **Start Your Engines!**: a static ability that introduces the Speed mechanic — a numeric player attribute (0–4). If a player controls a permanent with Start Your Engines! and has no speed, they gain speed 1. Speed then increases via an inherent triggered ability: whenever one or more opponents lose life on your turn (once per turn), your speed increases by 1 (up to max 4). **Max Speed**: a keyword on abilities that only function when the controller has speed 4 (max speed). Together, these create a racing game-within-a-game: deal damage to opponents, increase your speed, and unlock your powerful Max Speed abilities.

## The Definitive Rules

**CR 702.179a** (verbatim): *"Start your engines! is a static ability. If a player controls a permanent with start your engines! and that player has no speed, their speed becomes 1. This is a state-based action. See rule 704."*

**CR 702.179b** (verbatim): *"Players do not have speed until a rule or effect sets their speed to a specific value."*

**CR 702.179c** (verbatim): *"If a player has no speed and they are instructed to increase their speed by a certain value, their speed becomes that value."*

**CR 702.179d** (verbatim): *"There is an inherent triggered ability associated with a player having 1 or more speed. This ability has no source and is controlled by that player. That ability is 'Whenever one or more opponents lose life during your turn, if your speed is less than 4, your speed increases by 1. This ability triggers only once each turn.'"*

**CR 702.179e** (verbatim): *"Rules and effects may refer to whether a player has 'max speed.' A player has max speed if their speed is 4."*

**CR 702.178a** (verbatim): *"A max speed ability is a special kind of static ability. 'Max speed — [Ability]' means 'As long as your speed is 4, this object has "[Ability]."'"*

## The Pattern

```
SPEED SYSTEM:
  Speed is a player attribute (like life total) ranging from 0 to 4
  0 (no speed): no speed attribute yet; default state
  1-3: partial speed; the inherent trigger can increase it
  4: max speed; Max Speed abilities are active

  GETTING SPEED:
    Step 1: Control a permanent with "Start Your Engines!" → SBA sets your speed to 1
    Step 2 onward: The inherent trigger fires once per turn when opponents lose life
    "Whenever one or more opponents lose life during your turn, if speed < 4, speed increases by 1"
    One trigger per turn (regardless of how many opponents lost life or how much)
    Each of your turns: potentially +1 speed

  SPEED PROGRESSION:
    Turn 1 (with Start Your Engines!): SBA → speed 1
    Turn 1 combat: attack, deal damage to opponent → trigger → speed 2
    Turn 2 combat: damage to opponent → trigger → speed 3
    Turn 3 combat: damage to opponent → trigger → speed 4 (MAX SPEED)
    Turn 3+ with max speed: Max Speed abilities are now active

  OPPONENTS LOSING LIFE — WHAT TRIGGERS:
    "Opponents lose life" — any life loss during YOUR turn:
    Combat damage to opponent, direct damage spells, ability-based life loss
    All count: as long as an OPPONENT loses life (not yourself)
    Once per turn regardless of source count or life loss amount

  MAX SPEED ABILITIES:
    "Max speed — [Ability]": this ability text applies ONLY when you have speed 4
    Like "as long as you have the city's blessing" but for speed
    Once at max speed: stays there (there's no "lose speed" mechanic noted in CR)

  SPEED + CARD SYNERGIES:
    Cards in Aetherdrift reference speed levels:
    "If your speed is 2 or greater, [bonus effect]"
    "If you have max speed, [powerful effect]"
    Gradual progression: cards get better as your speed increases

  START YOUR ENGINES! WITHOUT COMBAT:
    Life loss triggers: burn spells, life drain, self-inflicted damage to opponent
    Raid-like condition: attacking to deal combat damage is the primary way to increase speed
    But any opponent life loss works: Shock → opponent loses 2 life → trigger → speed +1

  SPEED RESET QUESTION:
    The CR doesn't describe a mechanism to reduce speed
    Speed appears to be monotonically increasing within a game
    A player at max speed stays at max speed (no going backwards)
    Unless a specific effect resets it (not described in CR)

MAX SPEED NOTABLE CARDS (Aetherdrift):
  Emberdrop Wyvern ({2}{R}, Flying Creature, "Max speed — this creature has double strike"):
    At speed 4: Emberdrop Wyvern has double strike.
    Before max speed: it's a normal flying creature.
    Racing toward double strike: a flying threat that becomes a serious double-striker at max speed.

  Piston-Palm Pistoleer ({1}{R}, "Max speed — {T}: deal 2 damage to target creature or player"):
    At max speed: has a repeatable {T}: deal 2 damage ability.
    Before max speed: no tap ability.
    Piston-Palm Pistoleer becomes a repeatable damage engine once the race is won.

  Accelerate Soul ({R}, Sorcery, "Your speed increases by 1. Draw a card"):
    Instant speed at cost of {R}: advance your speed by 1 AND draw a card.
    Used to accelerate the progression: reach max speed faster without needing to deal damage.

SPEED + MULTIPLAYER (COMMANDER):
  In Commander: each player tracks their own speed
  You can be at max speed while opponents are at speed 1-3
  Opponents can't decrease your speed
  Racing is competitive: first to max speed has an advantage

SPEED + "ONCE EACH TURN" TRIGGER CLARIFICATION:
  "This ability triggers only once each turn" means:
  Even if multiple opponents lose life simultaneously, it triggers ONCE
  Even if it fires multiple times in theory, it triggers at most once per turn
  Consistent pace: exactly +1 speed per turn maximum from the trigger
```

## Definitive Conclusions

- **Start Your Engines! triggers the SBA that sets speed to 1** — no speed until you control a "Start Your Engines!" permanent.
- **Speed increases by 1 per turn when opponents lose life** — once per turn max, caps at 4.
- **Max Speed abilities are active only at speed 4** — take 3 turns of dealing opponent life loss to reach.
- **Speed doesn't decrease** — once at max speed, Max Speed abilities stay active.
- **Any opponent life loss triggers speed increase** — not just combat damage.

## Canonical Example
**Emberdrop Wyvern Racing to Double Strike:**
Turn 1: cast a creature with Start Your Engines!. SBA fires: your speed becomes 1.
Turn 2: attack with the Speed creature. Deals 2 damage to opponent (life loss). Trigger fires: speed 2.
Turn 2 (end): cast Emberdrop Wyvern ({2}{R}, flying). No double strike yet (speed 2, need 4).
Turn 3: attack with Wyvern (flying, 2 power). Hits opponent for 2. Trigger: speed 3. Wyvern is still just a flier.
Turn 4: attack with Wyvern. Hits for 2. Trigger: speed 4 → MAX SPEED.
During this same attack: Wyvern now has Max Speed → it gains double strike.
First strike damage: 2. Regular damage: 2. Total this attack: 4.
Every subsequent attack: Wyvern double strikes. Reached max speed on turn 4.

**Example 2 — Non-Combat Speed Increase:**
You don't want to attack (fear retaliation). But you want max speed for abilities.
Turn 1: Start Your Engines! SBA → speed 1.
Turn 1: cast Shock targeting an opponent → opponent loses 2 life → trigger → speed 2.
Turn 2: cast Lightning Bolt targeting opponent → opponent loses 3 life → trigger → speed 3.
Turn 3: cast Lightning Bolt again → opponent loses 3 life → trigger → speed 4 (MAX SPEED).
Reached max speed on turn 3 with only burn spells, no combat.
All Max Speed abilities active. Opponents are burning down AND you have your engine running.

## Commonly Confused With
- **P219 (Devotion)** — Devotion counts mana symbols among permanents for bonuses; Max Speed is a player attribute that unlocks abilities (completely different tracking systems).
- **P060 (Ascend/City's Blessing)** — City's Blessing is a permanent designation once 10 permanents are reached; Speed is a numeric attribute (1-4) earned by dealing damage each turn.
- **P209 (Energy Counters)** — Energy counters are a resource that's spent on abilities; Speed is a racing attribute that only increases and isn't spent.
