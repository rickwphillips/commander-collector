---
id: p397
name: Prowess, Dash, and Dethrone — Spell-Triggered Growth, Temporary Haste, and Attacking Leaders
category: triggered
cr_refs: [702.108a, 702.108b, 702.109a, 702.105a, 702.105b]
tags: [prowess, dash, dethrone, noncreature-spell-trigger, temporary-plus1plus1, alternative-cost-haste-return, return-to-hand-end-step, attack-highest-life, counter-on-attack, Khans-of-Tarkir, Arcbound-Ravager, Monastery-Swiftspear, Abbot-of-Keral-Keep, Goblin-Rabblemaster, Zurgo-Bellstriker, Marchesa-the-Black-Rose, prowess-stacks, dash-permanent-haste, dash-vs-etb-triggers]
created: 2026-03-29
examples_count: 2
---

# P397 — Prowess, Dash, and Dethrone — Spell-Triggered Growth, Temporary Haste, and Attacking Leaders

## Abstract
**Prowess** (702.108) triggers whenever you cast a noncreature spell: the prowess creature gets +1/+1 until end of turn. Multiple instances of prowess trigger separately (each giving +1/+1). Multiple prowess creatures each trigger separately for the same spell. **Dash** (702.109) is an alternative casting cost: pay the dash cost instead of the normal cost, and the creature has haste and is returned to its owner's hand at the beginning of the next end step (a delayed triggered ability). Dash is useful for recurring ETB effects, surprise attackers, and avoiding sorcery-speed removal. **Dethrone** (702.105) triggers whenever the creature attacks the player with the most life (or tied for the most life): put a +1/+1 counter on the creature. Dethrone is a multiplayer-focused mechanic that rewards attacking whoever is winning the life race.

## The Definitive Rules

**CR 702.108a** (verbatim): *"Prowess is a triggered ability. 'Prowess' means 'Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.'"*

**CR 702.108b** (verbatim): *"If a creature has multiple instances of prowess, each triggers separately."*

**CR 702.109a** (verbatim): *"Dash represents three abilities: two static abilities that function while the card with dash is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with dash is on the battlefield. 'Dash [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's dash cost was paid, return the permanent this spell becomes to its owner's hand at the beginning of the next end step,' and 'As long as this permanent's dash cost was paid, it has haste.' Casting a spell for its dash cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.105a** (verbatim): *"Dethrone is a triggered ability. 'Dethrone' means 'Whenever this creature attacks the player with the most life or tied for most life, put a +1/+1 counter on this creature.'"*

**CR 702.105b** (verbatim): *"If a creature has multiple instances of dethrone, each triggers separately."*

## The Pattern

```
PROWESS (702.108):
  WHAT IT IS:
    Triggered ability. Fires whenever YOU cast a noncreature spell.
    "Cast" = the spell goes onto the stack. Triggers at cast time.
    Effect: this creature gets +1/+1 until end of turn.
    Temporary pump — resets at end of turn. Not permanent counters.
  NONCREATURE SPELL:
    Prowess fires on: instants, sorceries, artifacts, enchantments, planeswalkers, battles.
    Does NOT fire on: creature spells (including creature-type spells).
    Does fire on: noncreature Auras (enchantments that target creatures — still noncreature spells).
    Does fire on: Adventure spells when you cast the adventure half (adventure = instant/sorcery type).
    Does NOT fire on: casting a creature with adventure (creature half).
    Does fire on: artifacts even if they're colorless.
    Does NOT fire on: playing lands (lands are not spells).
  MULTIPLE PROWESS INSTANCES (702.108b):
    Each instance triggers separately. More instances = bigger pump per noncreature spell.
    Example: a creature with prowess and another copy of prowess (granted somehow):
      Cast a Lightning Bolt. Two prowess triggers fire. The creature gets +2/+2 until EOT (two triggers).
    Example: you control Monastery Swiftspear ({R}: 1/2, prowess) and another 1/1 with prowess:
      Cast Shock. Each creature's prowess triggers separately.
      Monastery Swiftspear gets +1/+1 (now 2/3 until EOT).
      The other creature gets +1/+1 (now 2/2 until EOT).
      The pump is per-creature, not shared.
  PROWESS AND SPELL CHAINS:
    In a Burn deck, prowess is incredibly powerful:
      Monastery Swiftspear + chain of instants:
      Start: 1/2. Cast Lightning Bolt (+1/+1 → 2/3). Cast Searing Blaze (+1/+1 → 3/4).
        Cast Assault Strobe (+1/+1 → 4/5). Attack for 4 damage (with trample or unblocked) + burn.
    The pumps are temporary but all active during the current turn.
  PROWESS AND THE STACK:
    Prowess triggers go on the stack after the noncreature spell is cast.
    The prowess trigger goes on the stack AFTER the spell. But you already cast the spell.
    If opponent counters your noncreature spell: prowess trigger is still on the stack.
      The triggered ability triggered when you CAST the spell (it's on the stack when prowess triggers).
      Countering the spell later doesn't "un-trigger" prowess. Prowess still resolves.
    Result: you can cast a spell, prowess triggers, opponent counters the spell, but prowess still fires.
    The creature still gets +1/+1 even if the spell was countered.
  PROWESS AND YOUR TURN:
    Prowess fires on YOUR cast events ("whenever you cast"). Not opponents' spells.
    On your turn: cast noncreature spells to pump your prowess creatures, then attack.
    Flash in prowess creatures on opponent's turn, then cast noncreature spells on YOUR turn.
  PROWESS ON ABBOT OF KERAL KEEP:
    Abbot of Keral Keep ({1}{R}: 2/1, prowess, "when this enters, exile the top card of your library.
      Until EOT, you may cast that card if it's a noncreature spell"):
    ETB: exile top card. If it's a noncreature spell: you may cast it.
    Casting that noncreature spell triggers prowess (+1/+1 until EOT).
    Abbot becomes a 3/2 for the rest of the turn. Plus you got the spell effect.

DASH (702.109):
  THREE ABILITIES:
    1. Static on stack: "You may cast this by paying [dash cost] rather than its mana cost."
       Alternative cost. Pay dash cost → casting this permanently.
    2. Delayed triggered ability (if dash cost was paid): "return this permanent to its owner's hand
       at the beginning of the next end step."
    3. Static on battlefield (if dash cost was paid): "this permanent has haste."
  THE DASH RETURN:
    "At the beginning of the next end step" — the END STEP, not the cleanup step.
    If dashed on YOUR turn: it returns to your hand at the beginning of YOUR end step.
    If dashed on an opponent's turn (flash): returns to hand at beginning of THAT OPPONENT'S end step.
    The creature attacks on the turn it enters (haste), then returns to hand when the end step begins.
    The creature is not sacrificed — it goes back to hand. You can dash it again next turn.
    This creates a recursive loop: dash on your turn → attack → return to hand → dash next turn.
  DASH AND ETB TRIGGERS:
    The dashed creature enters the battlefield normally. ETB triggers fire.
    Key strategic use: creatures with powerful ETB triggers can be dashed every turn.
    Example: Goblin Rabblemaster ({2}{R}: 3/2, "other Goblins you control attack each turn if able.
      Whenever Goblin Rabblemaster attacks, create a 1/1 Goblin token"):
      Dash Goblin Rabblemaster (if it had dash): enters, ETB fires (if any). Attacks (has haste).
      Token created on attack. Then returns to hand.
    ACTUAL dash creature: Zurgo Bellstriker ({R}: 2/2 dash {1}{R}, "can't block creatures with
      power 2 or greater"):
      Dash {1}{R}: enters with haste. Attacks for 2 damage. Returns to hand.
      Next turn: dash again. Persistent 2 damage each turn for {1}{R}.
    Note: Thunderbreak Regent ({2}{R}{R}: 4/4 Flying) does NOT have dash — it's a Dragon with
      a punishment ETB for targeting Dragons. Don't confuse it with dash creatures.
  DASH AND REMOVAL:
    If a dashed creature is destroyed before the end step: it dies (goes to GY).
    The delayed trigger "return to hand at end step" still fires when the end step begins.
    But the creature is no longer on the battlefield. The trigger can't find it. Fizzles.
    The creature stays in the GY.
    Dash doesn't give protection from removal — you still have a creature for opponents to interact with.
  DASH AND HASTE:
    The haste is "as long as this permanent's dash cost was paid." Conditional.
    If the dash cost wasn't paid (normal cast): no haste from dash.
    The creature's haste is a static ability based on how it was cast.
    If you cast it for its normal cost: no haste from dash.
  DASH IN COMMANDER:
    Strong synergy with ETB-heavy commanders. Example:
    Any creature with a powerful ETB + dash: dash it every turn if the dash cost is payable.
    After a board wipe: dash a creature with ETB to get the ETB again immediately.

DETHRONE (702.105):
  WHAT IT IS:
    Triggered ability. "Whenever this creature attacks the player with the most life or tied for most life,
      put a +1/+1 counter on this creature."
  WHO IS "THE PLAYER WITH THE MOST LIFE"?
    At the time the attack is declared (declare attackers step, 508.1):
      Check which player (among all players, including you) has the most life.
      Or: multiple players tied for most life.
    If you're attacking the player with the most life: dethrone triggers.
    If you're attacking a player who does NOT have the most life: no trigger.
  DETHRONE IN MULTIPLAYER:
    Most powerful in Commander (4 players, starting 40 life).
    Early game: you typically don't have the most life. You attack whoever does.
    The idea: reward aggression against the player who is "winning" (has the most life).
    Marchesa, the Black Rose ({1}{U}{B}{R}: 3/3, Dethrone, "whenever you or another creature you control
      attacks and deals combat damage to a player, if that creature has a +1/+1 counter on it,
      return it from GY to battlefield under your control at the beginning of EOT"):
    Marchesa gets counters from dethrone. Any creature she helps die (that has a counter) returns.
    Marchesa + dethrone: as long as you're attacking the player with the most life, Marchesa grows.
    Marchesa + other creatures with counters: those creatures come back when they die.
  DETHRONE CONDITION CHECK:
    Dethrone checks "at the time of attack declaration." If life totals change between declaration and
      damage, the trigger already fired (or didn't). Life changes during combat don't retroactively affect.
    Actually: dethrone triggers "whenever this creature attacks the player with the most life."
      This is triggered at attack declaration. The condition is part of the trigger event.
      If the player had the most life when attacks were declared: trigger fires.
      If life totals changed (unlikely before the check): the trigger only fires based on declared-attack moment.
  DETHRONE AND PLANESWALKERS:
    "Attacks the player with the most life" — attacking a planeswalker means attacking the player
      who controls it. Does attacking a player's planeswalker count as "attacking that player"?
      Actually: when you attack, you designate each attacker as attacking a player or a planeswalker.
      If you attack a planeswalker: you're attacking the planeswalker, not the player.
      Dethrone checks "attacks the player" — if attacking a planeswalker, not directly attacking the player.
      Result: dethrone does NOT trigger when attacking a planeswalker. Must attack the player directly.
```

## Definitive Conclusions

- **Prowess triggers when you CAST the spell, not when it resolves** — if the spell is countered, prowess still fired (it triggered at cast time); the +1/+1 until EOT still applies.
- **Multiple prowess creatures each get the pump separately** — 3 prowess creatures, 1 noncreature spell cast: all 3 get +1/+1 until EOT; one creature with 2 instances of prowess gets +2/+2.
- **Dashed creatures have haste and return to hand at the beginning of the next end step** — not the cleanup step; the creature is available to attack the same turn; if killed before end step, the return trigger fizzles.
- **Dashing a creature every turn is a valid recurring strategy** — ETB triggers fire each time; the creature re-enters the battlefield each turn it's dashed.
- **Dethrone only triggers when attacking a player directly** — attacking a planeswalker does not count as "attacking the player"; dethrone is most powerful in multiplayer where someone usually has more life than others.

## Canonical Example
**Monastery Swiftspear Prowess Burn Chain:**
Monastery Swiftspear ({R}: 1/2, Prowess):

You have 7 mana, opponent at 12 life. Monastery Swiftspear is on the battlefield.
Declare Swiftspear as an attacker. Opponent chooses not to block.

Before combat damage, cast Mutagenic Growth (+2/+2 until EOT) from hand (paying 2 life):
Prowess triggers: +1/+1 until EOT. Stack resolves: Swiftspear is now 4/5.
Mutagenic Growth resolves: Swiftspear is 6/7.

Cast Lightning Bolt targeting Swiftspear? No, targeting opponent:
Prowess triggers again: +1/+1. Swiftspear goes to 7/8.
Lightning Bolt deals 3 to opponent (12 → 9 life).

Cast Assault Strobe (Swiftspear gets double strike until EOT):
Prowess triggers: +1/+1. Swiftspear goes to 8/9 with double strike.
Assault Strobe resolves.

Combat damage: Swiftspear 8/9 double strike vs. unblocked.
First strike damage: 8. Total: 16 damage to opponent.
Opponent had 9 life → 9 - 16 = dead.

**Example 2 — Zurgo Bellstriker Dash Loop:**
Zurgo Bellstriker ({R}: 2/2, haste, dash {1}{R}, "Zurgo Bellstriker can't block creatures with power 2 or greater"):

Turn 2: Cast Zurgo Bellstriker for dash cost ({1}{R}). Enters with haste.
Attack for 2. Opponent takes 2 damage.
Beginning of end step: delayed trigger returns Zurgo to your hand.

Turn 3: Cast Zurgo for dash again ({1}{R}). Enters with haste.
Attack for 2. Opponent takes 2 damage (total: 4).
End step: returns to hand.

Turn 4–10: Repeat. Each turn costs {1}{R} for 2 damage.
By turn 10: 16 damage from dash alone (turns 2–9 = 8 dashes = 16 damage).

Opponent tries to block with a 1/1: Zurgo is 2/2, kills the 1/1. Still attacks through.
Opponent blocks with 2/2: Zurgo trades. But now opponent has no 2/2 blocker.
Opponent blocks with 3/3: Zurgo dies. Returns to GY (not hand — died, not dashreturned).
  After blocking: Zurgo is gone. No return trigger (it died before end step).
  You've lost your recurring threat. Must hard-cast Zurgo for {R} to get it back.

Optimal play: dash Zurgo every turn, avoid combat where it dies, deal relentless 2-damage hits.

## Commonly Confused With
- **P391 (Persist/Undying/Evolve)** — Dethrone puts counters on a creature when attacking; evolve puts counters when a bigger creature enters. Both are counter-growth mechanics but on completely different triggers.
- **P388 (Convoke/Delve/Dredge)** — Dash uses an alternative cost to cast the spell (like delve reduces cost). Both are casting cost modifications but dash modifies what happens after the spell resolves (haste + return to hand), while delve just reduces the cost.
- **P392 (Myriad)** — Myriad also triggers "whenever this creature attacks." Both myriad and dethrone are attack-triggered abilities; myriad creates tokens while dethrone places counters.
- **P011 (ETB Triggers)** — Dashed creatures enter the battlefield normally, triggering all ETBs. The strategic value of recurring dash is precisely the ability to re-trigger ETBs each turn.
