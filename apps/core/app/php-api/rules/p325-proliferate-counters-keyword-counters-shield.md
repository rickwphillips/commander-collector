---
id: p325
name: Proliferate and the Counter Ecosystem — Keyword Counters, Shield, Stun, Finality
category: continuous
cr_refs: [701.34a, 122.1, 122.1a, 122.1b, 122.1c, 122.1d, 122.1h, 122.2, 122.3, 704.5q]
tags: [proliferate, counter, keyword-counter, shield-counter, stun-counter, finality-counter, +1+1-counter, -1-1-counter, SBA-counter-annihilation, loyalty-counter, Throne-of-Geth, Wandering-Archon, Lolth-Spider-Queen, Energy-counters, experience-counters]
created: 2026-03-29
examples_count: 2
---

# P325 — Proliferate and the Counter Ecosystem — Keyword Counters, Shield, Stun, Finality

## Abstract
**Counters** are markers that modify characteristics or interact with rules. The counter ecosystem has grown vastly beyond +1/+1 and loyalty counters. **Keyword counters** grant keyword abilities (flying, lifelink, etc.). **Shield counters** create a damage-prevention replacement effect. **Stun counters** prevent untapping. **Finality counters** exile the permanent on death instead of sending it to the GY. **Proliferate** adds one counter of each kind already on chosen permanents and players — it's one of the most powerful effects in the game for scaling existing resources. Notably, **+1/+1 and -1/-1 counters annihilate each other** as an SBA (CR 122.3).

## The Definitive Rules

**CR 701.34a** (verbatim): *"To proliferate means to choose any number of permanents and/or players that have a counter, then give each one additional counter of each kind that permanent or player already has."*

**CR 122.1a** (verbatim): *"A +X/+Y counter on a creature or on a creature card in a zone other than the battlefield, where X and Y are numbers, adds X to that object's power and Y to that object's toughness. Similarly, -X/-Y counters subtract from power and toughness."*

**CR 122.1b** (verbatim): *"A keyword counter on a permanent or on a card in a zone other than the battlefield causes that object to gain that keyword."*

**CR 122.1c** (verbatim): *"One or more shield counters on a permanent create a single replacement effect and a single prevention effect that protect the permanent. These effects are 'If this permanent would be destroyed as the result of an effect, instead remove a shield counter from it' and 'If damage would be dealt to this permanent, prevent that damage and remove a shield counter from it.'"*

**CR 122.1d** (verbatim): *"One or more stun counters on a permanent create a single replacement effect that stops the permanent from untapping. That effect is 'If a permanent with a stun counter on it would become untapped, instead remove a stun counter from it.'"*

**CR 122.1h** (verbatim): *"One or more finality counters on a permanent create a single replacement effect that stops the permanent from going to the graveyard. That effect is 'If this permanent would be put into a graveyard from the battlefield, exile it instead.'"*

**CR 122.2** (verbatim): *"Counters on an object are not retained if that object moves from one zone to another. The counters are not 'removed'; they simply cease to exist."*

**CR 122.3** (verbatim): *"If a permanent has both a +1/+1 counter and a -1/-1 counter on it, N +1/+1 and N -1/-1 counters are removed from it as a state-based action, where N is the smaller of the number of +1/+1 and -1/-1 counters on it."*

## The Pattern

```
PROLIFERATE RULES:
  "Choose any number of permanents and/or players that have a counter.
    Give each chosen permanent/player one additional counter of EACH KIND it already has."
  Key: you must choose only objects that ALREADY have at least one counter.
  You can't proliferate a counter onto a counter-less object.
  Every kind of counter on chosen objects gets multiplied: if a permanent has
    a +1/+1 counter AND a loyalty counter: proliferating onto it adds one of EACH.
  Choose nothing: valid. Proliferate resolves doing nothing.
  Multiple counters of same kind: only one more added per proliferate. (Not one per existing counter.)

  WHAT PROLIFERATE AFFECTS:
    Players: poison counters, energy counters, experience counters.
    Permanents: +1/+1 counters, -1/-1 counters (careful!), loyalty counters,
      charge counters, time/fade counters, keyword counters, lore counters (Sagas),
      shield counters, stun counters, etc.
    Everything with any counter: eligible.

  PROLIFERATE STRATEGIES:
    Poison acceleration: one hit from infect (1 poison) → proliferate repeatedly → reach 10.
    Planeswalker loyalty: proliferate your planeswalker → gets closer to ultimate.
    Saga speed-up: one proliferate on a Saga → it reaches its final chapter faster.
    Charge counters: charge counters on artifacts like Astral Cornucopia or Everflowing Chalice.
    -1/-1 hate: proliferate opponent's -1/-1 counters (from wither/infect) → weaken their creatures more.
    Experience counters: Commander cards like Mizzix of the Izmagnus use experience counters.
      Proliferate each turn: experience counters grow faster.

  CLASSIC PROLIFERATE CARD:
    Throne of Geth ({2}): artifact, {T}, Sacrifice an artifact: Proliferate.
      Sacrifice a Clue token or Treasure token: proliferate. Resource-efficient.
    Volt Charge ({2}{R}): sorcery, deal 3 damage to a creature or player. Proliferate.
      Removal + proliferate in one card.
    Inexorable Tide ({3}{U}{U}): "Whenever you cast a spell, proliferate."
      Every spell cast proliferates. Scales poison, loyalty, charge counters, etc.
    Atraxa, Praetors' Voice ({G}{W}{U}{B}): 4/4 Flying Deathtouch Lifelink Vigilance.
      "At the beginning of your end step, proliferate."
      Every turn: one free proliferate. Popular Commander for counter strategies.

+1/+1 AND -1/-1 COUNTER ANNIHILATION (SBA CR 122.3):
  State-based action: if a permanent has both kinds:
    Remove N of each, where N = min of the two counts.
    A creature with 3 +1/+1 and 2 -1/-1: SBA removes 2 of each. Left with 1 +1/+1.
    Net effect: the two counter types cancel out.
  This fires before any player gets priority. Players see the creature with the appropriate net.
  STRATEGIC NOTE: putting -1/-1 counters on a creature with +1/+1 counters destroys those counters.
    Opponents can "cancel" your growth counters with -1/-1 effects.
    Melira prevents -1/-1 counters on your creatures entirely.

KEYWORD COUNTERS (CR 122.1b):
  A permanent with a keyword counter has that keyword.
  Keywords available as counters: flying, first strike, double strike, deathtouch,
    decayed, exalted, haste, hexproof, indestructible, lifelink, menace, reach, shadow, trample, vigilance.
  Sources of keyword counters:
    Ozolith, the Shattered Spire: "Whenever another creature enters under your control, you may
      put one +1/+1 counter on it. {2}{G}: Put a flying counter on target creature."
    Wandering Archon: creates flying counters.
    Crystalline Giant: puts a keyword counter on itself each turn (random from a list).
  Keyword counters and zone changes: CR 122.2. If the permanent leaves the battlefield,
    counters cease to exist. If it returns, it has no keyword counters (new object).

SHIELD COUNTERS (CR 122.1c):
  One or more shield counters = a damage prevention effect AND a destruction replacement.
  Replacement 1: "If this permanent would be destroyed by an effect, remove a shield counter instead."
    Doesn't protect from SBA death (toughness ≤ 0, zero loyalty).
    Protects from: "destroy target creature," "destroy all creatures" (Wrath).
    Wait: Wrath says "destroy." The shield triggers → remove one shield counter → not destroyed.
    So shield counters prevent Wrath! Very powerful.
  Replacement 2: "If damage would be dealt to this permanent, prevent that damage and remove a shield counter."
    Prevents ALL damage from a single damage event.
    A 5/5 attacks a shielded 2/2: 5 damage → shield counter removed → damage prevented → 2/2 survives.
    The next time damage hits it: no more shield (if only had 1).
  MULTIPLE SHIELD COUNTERS: CR 122.1c says "one or more... create a SINGLE replacement."
    Whether 1 or 5 shield counters: it's one replacement effect. It fires once per damage event.
    One damage event on a 5-shield creature: remove 1 shield counter, prevent the damage.
    Next damage event: remove 1 more shield counter. Etc.
    BUT: the effect says "one or more create a SINGLE replacement." This means:
    Multiple shield counters = still only one prevention per damage event.
    The creature survives as long as it has shield counters.

STUN COUNTERS (CR 122.1d):
  "If this permanent would become untapped, instead remove a stun counter from it."
  Each stun counter keeps the permanent tapped for one more untap step.
  3 stun counters: the permanent stays tapped for 3 of your opponent's untap steps.
  Tap a permanent and put stun counters on it: it won't untap for several turns.
  Multiple stun counters: each replaces one "would untap" → one removed per untap step.

FINALITY COUNTERS (CR 122.1h):
  "If this permanent would be put into a GY from the battlefield, exile it instead."
  Prevents GY interaction. Creatures with finality counters can't be reanimated.
  Used in some Phyrexia-era cards to prevent Phyrexians from being recurred.
  Also: if your own creature has finality, it won't go to GY when destroyed.
    Can't return it with Reanimate or Unearth.
    But: tokens with finality go to exile anyway (tokens cease in GY), so no change.

ENERGY COUNTERS:
  {E} counters are a player resource, not a permanent resource.
  Kaladesh block mechanic.
  Some effects: "when this creature attacks, you get {E}{E}."
  Spending {E}: "{E}{E}{E}: Do X."
  Energy counters on players: proliferate adds more {E}.
  Aetherworks Marvel ({4}): "{T}, Pay {E}{E}{E}{E}{E}{E}: Look at top 6 cards, cast one for free."
    Spending {E} as an activation cost. Build up {E} with energy producers.

EXPERIENCE COUNTERS:
  Commander format specialty: some legendary creatures gain experience counters.
  Mizzix of the Izmagnus ({2}{U}{R}): "Whenever you cast an instant or sorcery spell with MV
    greater than the number of experience counters you have, gain an experience counter."
  {Experience counter}: Mizzix reduces cost of instant/sorcery by 1 for each experience counter.
  Proliferate: add experience counters → spells become cheaper faster.
  Experience counters are on the PLAYER. They persist until the player leaves the game.
```

## Definitive Conclusions

- **Proliferate adds one counter of each kind** — if a permanent has three types of counters, each type gets one more.
- **+1/+1 and -1/-1 counters annihilate as an SBA** — N of each type cancel each other automatically.
- **Shield counters prevent destruction AND damage** — each counter blocks one destruction or damage event.
- **Multiple shield counters don't stack into one bigger shield** — each counter blocks one event sequentially.
- **Stun counters delay untapping one step per counter** — 3 stun counters = stays tapped for 3 untap steps.
- **Finality counters exile instead of going to GY** — prevents all GY recursion on the permanent.
- **Counters are lost when the permanent changes zones** — no carrying over to new objects.

## Canonical Example
**Atraxa Proliferate Engine:**
Commander: Atraxa, Praetors' Voice (G/W/U/B, 4/4 Flying Deathtouch Lifelink Vigilance).
End step ability: proliferate.
Board: you control Jace, the Mind Sculptor (5 loyalty), Crystalline Giant (keyword counters), and opponent has 3 poison counters.
At end of your turn: Atraxa triggers. Proliferate:
  Choose Jace (has loyalty counters → +1 loyalty → now 6 loyalty).
  Choose Crystalline Giant (has a flying counter → +1 flying counter? No: it already has flying. Adding another flying counter does nothing extra — it still has flying. But the counter itself is added.).
  Choose the opponent with 3 poison counters → 4 poison counters.
Repeat each turn.
After 6 turns of uninterrupted proliferate on the opponent: 10 poison → they lose.
After 2 more turns of Jace proliferate: Jace reaches 12 loyalty → ultimate "mind twist" effect.
The engine: Atraxa does nothing but tap for combats and proliferate. Everything accelerates.
In Commander (4-player): each opponent targeted at 3 poison = all reach 10 in roughly 7 turns of proliferate.

**Example 2 — Shield Counters vs. Wrath:**
Board: your 3/3 creature has 2 shield counters (from Kindred Shaman or similar).
Opponent casts Wrath of God ("destroy all creatures").
Your 3/3 has 2 shield counters: "If this permanent would be destroyed by an effect, instead remove a shield counter from it."
Wrath fires: "destroy" trigger applies to your 3/3 → replacement effect: remove one shield counter → not destroyed.
Your 3/3 survives with 1 shield counter.
Opponent is surprised. Their Wrath only killed your unshielded creatures.
Next turn: opponent casts Path to Exile targeting your 3/3.
Path: "exile target creature." NOT "destroy." Shield counter only stops "destroy" not "exile."
The "prevent damage" replacement: also irrelevant (Path doesn't deal damage).
Result: Path exiles your 3/3 even through shield counters.
Note: Lightning Bolt deals 3 damage → first replacement activates (prevent damage, remove shield counter).
Bolt's 3 damage: prevented. Shield counter removed. 3/3 still at 3/3 with 0 shield counters.
Next damage event: no more shields.
Shield counters are powerful protection but exile effects bypass them.

## Commonly Confused With
- **P324 (Infect/Wither)** — Proliferating -1/-1 counters placed by infect/wither accelerates the counter-based kill. Also: +1/+1 and -1/-1 counters annihilate (SBA 122.3) — if a creature has both, they cancel. This is relevant for Undying/Persist creatures that have mixed counters from effects.
- **P300 (Undying/Persist)** — Undying creatures have a +1/+1 counter placed on return; Persist creatures have a -1/-1 counter. If both are on the same creature simultaneously, the SBA annihilates them (net: 0 counters), enabling the infinite loop with Melira.
- **P319 (Enchantment/Aura)** — Saga lore counters are subject to proliferate. Proliferating a Saga's lore counters speeds it toward its final chapter.
- **P311 (New Object Rule)** — CR 122.2: counters don't persist across zone changes. A creature with 5 +1/+1 counters that dies and gets reanimated enters as the base creature (no counters). This is identical to the new object rule's counter loss.
