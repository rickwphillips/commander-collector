---
id: p439
name: Improvise, Undaunted, Assist, Riot, and Spectacle — Cost Reduction and Entry Modification
category: costs
cr_refs: [702.126a, 702.126b, 702.125a, 702.125b, 702.125c, 702.132a, 702.136a, 702.136b, 702.137a, 302.6, 601.2h]
tags: [improvise, undaunted, assist, riot, spectacle, cost-reduction, artifact-tap, multiplayer-cost, alternative-cost, counter-or-haste, spectacle-life-loss, summoning-sickness-improvise, double-riot, Inspiring-Statuary, Khorvath-Fury, Frenzied-Arynx, Spawn-of-Mayhem, commander-undaunted, Kaladesh, Battlebond, Ravnica-Allegiance]
created: 2026-03-29
examples_count: 2
---

# P439 — Improvise, Undaunted, Assist, Riot, and Spectacle — Cost Reduction and Entry Modification

## Abstract
Five mechanics that modify how spells cost or how permanents enter. **Improvise** (702.126) lets you tap artifacts to pay generic mana during casting — critically, it applies AFTER total cost is calculated and tapping for improvise is NOT using an activated ability (so summoning-sick artifact creatures CAN be tapped for improvise). **Undaunted** (702.125) reduces a spell's cost by {1} for each opponent, scaling in multiplayer. **Assist** (702.132) allows another player to help pay generic mana costs. **Riot** (702.136) lets a creature enter with a +1/+1 counter OR gain haste, with each instance of riot on the same creature choosing independently (double riot can give counter + haste). **Spectacle** (702.137) is an alternative cost available when ANY opponent has lost life this turn — not just combat damage, and not requiring it to be YOUR sources.

## The Definitive Rules

**CR 702.126a** (verbatim): *"Improvise is a static ability that functions while the spell with improvise is on the stack. 'Improvise' means 'For each generic mana in this spell's total cost, you may tap an untapped artifact you control rather than pay that mana.'"*

**CR 702.126b** (verbatim): *"The improvise ability isn't an additional or alternative cost and applies only after the total cost of the spell with improvise is determined."*

**CR 702.125a** (verbatim): *"Undaunted is a static ability that functions while the spell with undaunted is on the stack. Undaunted means 'This spell costs {1} less to cast for each opponent you have.'"*

**CR 702.132a** (verbatim): *"Assist is a static ability that modifies the rules of paying for the spell with assist. If the total cost to cast a spell with assist includes a generic mana component, before you activate mana abilities while casting it, you may choose another player. That player has a chance to activate mana abilities. Once that player chooses not to activate any more mana abilities, you have a chance to activate mana abilities. Before you begin to pay the total cost of the spell, the player you chose may pay for any amount of the generic mana in the spell's total cost."*

**CR 702.136a** (verbatim): *"Riot is a static ability. 'Riot' means 'You may have this permanent enter with an additional +1/+1 counter on it. If you don't, it gains haste.'"*

**CR 702.137a** (verbatim): *"Spectacle is a static ability that functions on the stack. 'Spectacle [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if an opponent lost life this turn.'"*

## The Pattern

```
IMPROVISE (702.126):
  "For each generic mana in this spell's total cost, you may tap an untapped artifact
   you control rather than pay that mana."

  NOT AN ADDITIONAL OR ALTERNATIVE COST (702.126b):
    Improvise applies AFTER the total cost of the spell is determined.
    The total cost is determined first (including kickers, cost reductions, etc.), then
    improvise allows you to substitute tapped artifacts for generic mana in that total cost.
    This means improvise can't be reduced further by "cost reduction" effects (those apply
    to the cost before improvise; improvise then substitutes for what's left).

  WHICH GENERIC MANA:
    "For each generic mana in this spell's total cost" — only generic mana ({1}, {2}, etc.).
    Cannot tap artifacts to pay colored mana requirements ({U}, {W}, etc.).
    Cannot tap artifacts to pay {X} if X has a set value (X is generic, but it's been set
    to a specific amount as part of the cost). Actually: X in the total cost is generic.
    Wait: when you cast a spell with X, you choose X first (during step 601.2b), then
    the total cost is determined including that value of X. If X=3, total generic includes
    those 3 generic symbols. Improvise can cover them.

  SUMMONING SICKNESS + IMPROVISE:
    CR 302.6: summoning sickness prevents (1) attacking and (2) using activated abilities
    with {T} or {Q} in their activation cost.
    Tapping an artifact for improvise is NOT using an activated ability — it's paying
    a cost as part of casting a different spell (CR 601.2h: pay the total cost).
    RESULT: you CAN tap summoning-sick artifact creatures for improvise.
    A Construct token that just entered this turn: can tap it to improvise.
    This is non-obvious: players assume summoning sickness prevents all tapping.
    Summoning sickness prevents tapping for {T} ACTIVATED ABILITIES only.

  INSPIRING STATUARY + ALL SPELLS:
    Inspiring Statuary ({3}: "nonartifact spells you cast have improvise"):
    Extends improvise to ALL nonartifact spells — including non-artifact creatures. Any nonartifact
    spell you cast (creature or not) can use your artifacts to reduce its generic mana.
    This effect stacks with existing improvise.

  NON-ARTIFACT CREATURES FOR IMPROVISE:
    Improvise specifically requires tapping "an untapped ARTIFACT you control."
    Non-artifact creatures: cannot tap for improvise. Artifacts only.
    With Inspiring Statuary: still artifacts only (the Statuary gives improvise to spells;
    the improvise rule still reads "tap an untapped artifact").

UNDAUNTED (702.125a):
  SCALES WITH OPPONENTS:
    1 opponent (2-player game): costs {1} less.
    3 opponents (4-player Commander): costs {3} less.
    9 opponents (10-player game): costs {9} less.

  PLAYERS WHO LEFT THE GAME (702.125b):
    Don't count toward opponent total. Only active opponents matter.
    Mid-game: a player eliminated → undaunted spells cost more to cast (one fewer opponent).

  CAN'T REDUCE BELOW 0:
    Total cost can't go negative. If undaunted reduction would put the cost below {0}:
    the cost becomes {0}. You still pay any colored mana requirements.
    Khorvath's Fury ({4}{R}: undaunted): in 4-player Commander (3 opponents), costs {1}{R}.
    In 10-player game (9 opponents): 4+1 = 5 generic mana, undaunted reduces by 9.
    Cost = {R} + max(5-9, 0) generic = {R}. Can't go lower than {R}.

  MULTIPLE UNDAUNTED INSTANCES (702.125c):
    Each instance applies separately. Two instances: double the per-opponent discount.
    In 4-player game with 2 undaunted instances: costs {6} less (3 opponents × 2).

ASSIST (702.132a):
  OPTIONAL PLAYER HELP:
    Before activating mana abilities: choose another player to help.
    That player activates mana abilities (adding mana to the pool for that spell).
    Then you activate mana abilities.
    That player may pay any amount of the GENERIC mana component.
    ONLY generic mana: the assisting player can't pay colored mana requirements.

  CASTER RETAINS CONTROL:
    You still control the spell. The assisting player just provided mana.
    Target choices, timing decisions, everything is the caster's call.

  WHEN THE ASSISTING PLAYER DECLINES:
    Optional: "you may choose another player." You don't have to use assist.
    The chosen player may decline to activate any mana abilities: they just pass the turn
    back to you to pay the full generic cost yourself.

RIOT (702.136a):
  "You may have this permanent enter with an additional +1/+1 counter on it.
   If you don't, it gains haste."

  BINARY CHOICE (not both, not neither):
    Choose: enter with +1/+1 counter OR gain haste.
    Can't choose both from one riot instance.
    Can't choose neither — if you don't put the counter, it AUTOMATICALLY gains haste.
    ("If you don't" — mandatory default when choosing the counter option is declined.)

  DOUBLE RIOT (702.136b):
    "If a permanent has multiple instances of riot, each works separately."
    Two riot instances: make two independent choices.
    First riot: choose counter (+1/+1 counter on entry)
    Second riot: choose haste (gains haste)
    Result: permanent enters with +1/+1 counter AND has haste.
    Or: both counters (enters with 2 +1/+1 counters, no haste).
    Or: both haste (haste is redundant — still just has haste; enters with no counters).
    Or: counter + haste = most flexible option (get both benefits).

  RIOT IS AN ETB MODIFICATION:
    "You may have this permanent enter WITH a counter" — modifies how it enters.
    This is a static ability creating an effect during the ETB event (614.1c applies).
    The counter is placed as the permanent enters, not in response to its ETB.
    Replacement-effect-like but expressed as a static ability.

SPECTACLE (702.137a):
  "Pay [cost] rather than mana cost if an opponent lost life this turn."

  ALTERNATIVE COST:
    Spectacle cost replaces the mana cost. Pay spectacle cost OR regular mana cost.
    Spawn of Mayhem ({2}{B}{B}: spectacle {1}{B}{B}): spectacle saves {1} and is more flexible.

  "AN OPPONENT LOST LIFE THIS TURN":
    ANY opponent losing ANY life enables spectacle for you.
    Sources of opponent life loss:
      - You dealing damage (combat, direct spells, triggered abilities)
      - Opponent's own effects (Mana Crypt dealing 3 damage to opponent = life loss)
      - Other players' effects (3-player game: another opponent damages the target player)
      - Extort, afflict, shock, etc.
    Life loss ≠ only combat damage. Shock ({R}: deal 2 damage) to an opponent = life lost.
    Spectacle is enabled by any life loss from any source, by any player.

  DOES NOT REQUIRE YOUR CREATURES TO ATTACK:
    Common misconception: spectacle requires dealing combat damage first.
    You can enable spectacle via instants, triggered abilities (upkeep effects), other damage.
    Spawn of Mayhem in your hand: upkeep trigger from opponent's Spawn dealing 1 damage to
    each player. If an opponent lost 1 life from this: spectacle is enabled.

  "THIS TURN" — RESETS EACH TURN:
    Spectacle checks life loss this turn only. Last turn's life loss doesn't count.
    Spectacle is checked at the moment of casting.
```

## Definitive Conclusions

- **Summoning-sick artifact creatures CAN be tapped for improvise** — tapping for improvise is paying a cost during spell casting (CR 601.2h), not activating a {T} ability; summoning sickness only blocks {T} activated abilities.
- **Improvise applies after total cost is determined** — cost reducers apply first; improvise then lets you substitute tapped artifacts for the remaining generic mana.
- **Double riot enables both counter and haste** — two riot instances choose independently; first riot can take counter, second riot takes haste, resulting in an ETB with +1/+1 counter and haste.
- **Undaunted scales dramatically in Commander** — 4-player game gives {3} discount; 10-player game gives {9} discount; but eliminated players no longer count.
- **Spectacle enables on ANY opponent life loss this turn** — including Mana Crypt damage to an opponent, shock effects, opponent's own Phyrexian mana payments, or other players' attacks; no requirement that you dealt combat damage.
- **Assist only helps with generic mana** — the assisting player can't pay colored mana requirements; all colored mana must come from the caster's mana pool.

## Canonical Example
**Improvise + Summoning Sickness:**
You control three 1/1 Servo tokens created by Fabricate this turn. All three have summoning sickness — they entered this turn, can't attack, can't use {T} abilities.

You cast a spell with improvise costing {4}{U}{U}.
Total cost: {4}{U}{U}. Colored {U}{U} must be paid normally.
For the {4} generic component: tap 3 Servo tokens (tapping for improvise is cost payment, not a {T} ability).
Pay {1}{U}{U} from lands.
Total: 3 Servos (= {3}) + {1} from land + {U}{U} from lands.
Summoning sickness is irrelevant — Servos are tapped as part of casting, not via their own activated ability.

After casting: all 3 Servos are tapped. They can't block this turn (they're tapped). This is the real cost of improvise — your defenders are tied up.

**Example 2 — Spectacle without attacking:**
Turn 2. You have Spawn of Mayhem ({2}{B}{B}: 4/4 trample, flying; spectacle {1}{B}{B}; "at beginning of your upkeep, deals 1 damage to each player; then if you have ≤10 life, put a +1/+1 counter on it") in hand.

Your opponent played Mana Crypt ({0}: artifact; "tap: add {C}{C}; at the beginning of your upkeep, flip a coin. If you lose the flip, Mana Crypt deals 3 damage to you.") last turn. They lost their coin flip: Mana Crypt deals 3 damage to them this turn.

That opponent lost 3 life this turn. Spectacle is enabled for you.
You cast Spawn of Mayhem for {1}{B}{B} (spectacle cost) instead of {2}{B}{B}.
You never attacked. You never dealt damage. Your opponent's own artifact did the work.

## Commonly Confused With
- **P436 (Crew/Fabricate)** — Improvise and crew both involve tapping artifacts/creatures as costs. Crew taps creatures to animate a Vehicle (power-based). Improvise taps artifacts to pay generic mana (not power-based). Both allow summoning-sick tapping (for the same reason: cost payment, not {T} ability activation).
- **P427 (Cascade + Additional Costs)** — Undaunted reduces the mana cost before casting (like other cost reducers); cascade casts "without paying mana cost" which then has no generic mana left to reduce by undaunted. If you cascade into a card with undaunted, you don't pay its cost at all (cascade grants free cast) — undaunted's reduction is irrelevant.
- **P429 (Exalted/Devour)** — Spectacle and exalted both care about attacking, but spectacle doesn't require attacking at all (any life loss counts). Exalted specifically requires a creature attacking alone. If spectacle and exalted are in the same deck: the exalted-boosted attack deals combat damage, opponent loses life, spectacle is enabled for follow-up spells.
- **P432 (Extort)** — Extort causes opponents to lose life whenever you cast a spell; spectacle enables if an opponent lost life this turn. Playing extort spells first enables spectacle for later spells in the same turn — the life drain from extort triggers spectacle.
