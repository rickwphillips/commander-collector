---
id: p290
name: Planeswalker Loyalty — Activating Abilities, Loyalty Counters, and Combat Damage
category: combat
cr_refs: [306.1, 306.2, 306.3, 306.4, 306.5, 306.6, 306.7, 306.8, 306.9, 306.10]
tags: [planeswalker, loyalty, loyalty-counter, ultimate, minus, plus, combat-damage, attacked, redirecting-damage, Jace-the-Mind-Sculptor, Teferi-Hero-of-Dominaria, Elspeth-Knight-Errant, Liliana-of-the-Veil]
created: 2026-03-29
examples_count: 2
---

# P290 — Planeswalker Loyalty — Activating Abilities, Loyalty Counters, and Combat Damage

## Abstract
Planeswalkers are a permanent type with loyalty counters. Their abilities are activated by adding or removing loyalty counters (not mana costs). Each planeswalker ability can be activated at most once per turn, only during your main phase while the stack is empty. Planeswalkers can be attacked by opponents and dealt damage (which removes loyalty counters). When a planeswalker reaches 0 loyalty counters, it's put into its owner's graveyard via SBA. The "ultimate" ability (large negative) often has a game-winning effect but depletes the loyalty significantly.

## The Definitive Rules

**CR 306.5** (verbatim): *"Loyalty abilities are activated abilities with a loyalty symbol in their cost. Loyalty abilities follow special rules: A player may activate a loyalty ability of a permanent they control any time they have priority and the stack is empty during a main phase of their turn, but only if none of that permanent's loyalty abilities have been activated this turn."*

**CR 306.6** (verbatim): *"A loyalty ability with a positive loyalty symbol ([+N]) adds that many loyalty counters to the permanent as part of the cost to activate it. A loyalty ability with a negative loyalty symbol ([-N]) removes that many loyalty counters from the permanent as part of the cost to activate it."*

**CR 306.8** (verbatim): *"Planeswalkers can be attacked. When a player is chosen as the defending player in step 508.1, all planeswalkers that player controls can also be attacked. When a planeswalker is attacked, the attacking creature attacks the planeswalker. Combat damage dealt to a planeswalker causes that many loyalty counters to be removed from it."*

## The Pattern

```
PLANESWALKER BASICS:
  A Planeswalker permanent has loyalty counters (printed on the card, entered with that many)
  Loyalty abilities: +N (gain loyalty) or -N (lose loyalty)
  Each turn: activate at most ONE loyalty ability (regardless of which type)
  Timing: only during your main phase while the stack is empty
  You must have the required loyalty to use a -N ability (can't go below 0)

LOYALTY COUNTER RULES:
  Adding counters: +N abilities add N loyalty counters as part of activation
  Removing counters: -N abilities remove N counters as part of activation
  Counters can also be added via other effects (Proliferate, specific spells)
  Damage removes loyalty counters: combat damage or damage effects
  0 loyalty counters: SBA puts the planeswalker in the GY

ONCE PER TURN RULE:
  "None of that permanent's loyalty abilities have been activated this turn"
  This means: if you've used the +1 ability, you can't use the -2 ability this turn
  ONE activation total per planeswalker per turn
  Even if you somehow get additional main phases (extra turn effects), it's still once per turn

PLANESWALKERS UNDER ATTACK:
  When you choose an attacking player/planeswalker target:
    Attacking creatures can be declared as attacking a planeswalker
    The DEFENDING PLAYER controls the planeswalker (it's their planeswalker)
    Blocking: the defending player can block with their creatures (defending player = the PW controller's side)
  Combat damage to a planeswalker: removes that many loyalty counters
  A 5/5 attacker connects with a planeswalker: remove 5 loyalty counters
  If loyalty drops to 0: SBA → planeswalker goes to GY

REDIRECTING SPELLS TO PLANESWALKERS:
  As of Magic 2021 rules update: you can no longer redirect spell damage to planeswalkers.
  Old rule: "If damage is being dealt to a player, that player may redirect it to a planeswalker."
  NEW rule: spells must specifically target the planeswalker to affect them.
  "Deal damage to any target": can target a planeswalker directly (it's a valid target).
  "Deal damage to target player": can only target a player (not a planeswalker).
  "Deal damage to target creature or player": can target creature or player, NOT planeswalkers.
  "Deal damage to any target": CAN target planeswalkers.
  The targeting rules matter: check if the spell says "any target" vs "player" or "creature."

PLANESWALKER LOYALTY DAMAGE AND EFFECTS:
  "Deal 3 damage to target planeswalker": removes 3 loyalty counters.
  Non-targeted damage effects that include planeswalkers: less common.
  Burn spells with "any target": Lightning Bolt, Shock, etc. — can target planeswalkers.
  Burn spells with "target creature or player": CANNOT target planeswalkers.

NOTABLE PLANESWALKERS:
  Jace, the Mind Sculptor ({2}{U}{U}): 3 loyalty, legendary.
    +2: Brainstorm (look at top 3, put 2 back).
    0: Unsummon (return target creature to hand).
    -1: Exile top card of target player's library, that player can only cast it until their next turn (Fateseal).
    -12: ULTIMATE. Exile opponent's hand, shuffle their library. They have only the 6 exiled cards to use.
    12 loyalty to ultimate: start at 3, use +2 several turns before -12.

  Teferi, Hero of Dominaria ({3}{W}{U}): 4 loyalty.
    +1: Draw a card; at beginning of your next main phase, add {W}{W}.
    -3: Put target non-land permanent into its owner's library third from the top.
    -8: ULTIMATE. You get an emblem "Whenever you draw a card, exile target permanent."
    Teferi +1 gives card draw AND mana production: exceptional efficiency.

  Liliana of the Veil ({1}{B}{B}): 3 loyalty.
    +1: Each player discards a card.
    -2: Target player sacrifices a creature.
    -6: ULTIMATE. Separate all permanents opponent controls, they choose one half to sacrifice.
    Powerful disruption at 3 mana. +1 hurts both players but is asymmetric if you're built around discard.

PLANESWALKER + MULTIPLAYER TARGETING:
  In Commander: you can attack opponent A's planeswalker while opponent B watches.
  Blocking: only the controller of the attacked planeswalker (and possibly teammates in 2HG) can block.
  Political: focus attacks on a powerful planeswalker to deplete its loyalty before it ultimates.

PLANESWALKER ULTIMATES:
  Usually a -X ability that creates a powerful emblem (permanent effects)
  Emblems can't be removed once created (they're not permanents, they're in the command zone)
  Rushing an ultimate: increase loyalty fast with +N abilities, then fire the ultimate when ready
  Defending strategy: attack the planeswalker every turn to prevent ultimate
```

## Definitive Conclusions

- **Planeswalker loyalty abilities are activated once per turn** — only during your main phase with empty stack.
- **+N adds loyalty as the cost; -N removes loyalty as the cost** — must have enough loyalty to use -N.
- **Combat damage removes loyalty counters** — a creature dealing 5 damage removes 5 counters.
- **Spell damage must specifically target the planeswalker** — no more redirect from player damage.
- **0 loyalty counters: SBA puts the planeswalker in the graveyard** — no dying trigger as a "creature."

## Canonical Example
**Teferi, Hero of Dominaria Protecting Its Ultimate:**
Turn 5: cast Teferi ({3}{W}{U}). Enters with 4 loyalty.
Turn 5: +1 ability → 5 loyalty. Draw a card, get {W}{W} next main phase.
Turn 6: opponent attacks with 3/3 → reduce Teferi to 2 loyalty. (5-3=2). Opponent blocks with their 2/2.
Turn 6: +1 ability → 3 loyalty. Draw a card again.
Turn 7: no attack on Teferi this turn. +1 → 4 loyalty.
Turn 8: no attack. +1 → 5 loyalty.
Turn 9: opponent attacks → remove 3 loyalty → 2 loyalty.
Turn 9: +1 → 3 loyalty.
Continue accumulating to 8 loyalty needed for -8 ultimate.
Protecting Teferi with blockers or removal is key to reaching the ultimate.

**Example 2 — Lightning Bolt Targeting a Planeswalker:**
Opponent's Liliana of the Veil at 3 loyalty. You have a Lightning Bolt in hand.
Lightning Bolt: "Deal 3 damage to any target."
"Any target" = can target a creature, player, OR planeswalker.
Cast Lightning Bolt targeting Liliana of the Veil.
Lightning Bolt resolves: 3 damage to Liliana → 3 loyalty counters removed → 0 counters.
SBA: Liliana has 0 loyalty → put in owner's GY.
Lightning Bolt killed the planeswalker for just {R}.
Contrast: "Target creature or player" spells CAN'T target planeswalkers.
Shock ({R}): "Deal 2 damage to any target." → 2 damage to Liliana → 1 loyalty remaining. Didn't die.

## Commonly Confused With
- **P261 (Compleated Planeswalkers)** — Compleated uses Phyrexian mana to let a planeswalker enter with fewer loyalty counters; standard planeswalkers enter with their printed loyalty.
- **P276 (Battles/Defense Counters)** — Battles also have "life totals" in the form of defense counters, removed by damage; Battles are not planeswalkers and have different interaction rules.
- **P220 (Ward)** — Ward makes a permanent harder to target but doesn't stop direct loyalty damage from attacking creatures or "any target" spells.
