---
id: p217
name: Goad — Forced Attack and Can't Attack the Goading Controller
category: combat
cr_refs: [701.38a, 701.38b]
tags: [goad, forced-attack, multiplayer, commander, combat, Disrupt-Decorum, Marisi-Breaker, EDH]
created: 2026-03-28
examples_count: 2
---

# P217 — Goad — Forced Attack and Can't Attack the Goading Controller

## Abstract
Goad is a game action: a goaded creature is forced to attack each combat if able AND cannot attack the player who goaded it (if that player is still in the game). This creates a powerful multiplayer/Commander tool — goad an opponent's best creature to make it attack someone else, forcing resource attrition among your opponents. The goad lasts until the creature's end of the controller's next turn. Marisi, Breaker of the Coil and Disrupt Decorum are famous goad cards in Commander.

## The Definitive Rules

**CR 701.38a** (verbatim): *"Certain spells and abilities can goad a creature. Until the next time that creature attacks, then until the end of that turn, or until you leave the game, whichever comes first, that creature is goaded. A goaded creature attacks each combat if able and can't attack the player or planeswalker controlled by the player who goaded it if any other player or planeswalker can be attacked."*

**CR 701.38b** (verbatim): *"If a goaded creature attacks the player or planeswalker that goaded it, this happens as a result of the goaded creature having no other legal attack options."*

## The Pattern

```
GOAD:
  Effect on a creature:
  1. That creature MUST attack each combat if able
  2. That creature CANNOT attack the player who goaded it (if other players/planeswalkers can be attacked)
  Duration: until it attacks (once), then until end of that turn
  OR: until the goading player leaves the game

GOAD + FORCED ATTACK:
  "Must attack if able" — if the creature could attack, it must
  Unable to attack: tapped, summoning sickness, effects saying "can't attack"
  If ONLY the goading player is attackable: goaded creature CAN attack the goader (no choice)
  If multiple opponents: must attack someone OTHER than the goader

GOAD + MULTIPLAYER:
  In a 4-player game: goad opponent A's best creature → it must attack B or C (not you)
  B or C must block or take damage from the goaded creature
  You protected yourself AND dealt damage/forced trades among opponents
  Very politically powerful: "I'll goad your threat if you help me this turn"

GOAD + DURATION:
  Goad lasts until the creature's NEXT attack (then until end of that turn)
  Multiple goads stack on one creature: each must be satisfied
  If goaded by two players: creature must attack, can't attack EITHER goading player (if others exist)

GOAD + VIGILANCE:
  Vigilance: attacks without tapping
  Goaded vigilance creature: MUST attack each combat (both the goad and the creature's own choice)
  Doesn't tap when attacking: still available to block afterward
  Vigilance + Goad: the creature is forced to swing and doesn't even tire

GOAD + TAPPING:
  If you tap a goaded creature before combat: it's "unable" to attack (tapped = can't attack)
  The goad doesn't force untapping
  Opponent can prevent goaded attack by tapping the creature before combat

GOAD + ELIMINATION:
  If the goading player leaves the game: goad effect ends immediately
  The creature is no longer forced to avoid that player (who's gone)
  Creature reverts to normal attack choices

DISRUPT DECORUM ({2}{R}{R}):
  "Goad all creatures your opponents control."
  All of opponent's creatures are goaded: must attack next turn, can't attack you.
  In a 4-player game: ALL opponent creatures must attack someone else.
  Use Disrupt Decorum, then sit back while opponents attack each other with their own boards.
  Commander: extreme political tool that creates massive chaos.

MARISI, BREAKER OF THE COIL (Commander):
  "Your opponents can't cast spells during combat."
  "Whenever a creature you control deals combat damage to a player, goad each creature that player controls."
  Deal combat damage to player A → goad ALL of player A's creatures.
  A's creatures must attack B or C, not you.
  Marisi enables a "you can't fight back" lock in Commander.

GOAD + ETB:
  Some spells give creatures goad as part of ETB effects
  Example: Bloodthirsty Blade (equipment): "equipped creature can't attack you or planeswalkers you control, and attacks each combat if able"
  This is like "persistent goad" via equipment

GOAD + COMBAT TRICKS:
  Forcing attacks creates windows for opponents to block each other's creatures
  Political play: goad a big creature → opponent B might be forced to chump-block it
  Creates asymmetric resource loss among opponents while you remain safe
```

## Definitive Conclusions

- **Goad forces the creature to attack** each combat if able, and **blocks attacks against the goader** (if other attack targets exist).
- **Multiple goads stack** — creature can't attack ANY of its goaders (if alternatives exist).
- **Vigilance + goad**: forced attack without tapping (still available after combat).
- **Disrupt Decorum** goads all opponent creatures simultaneously — powerful Commander politics.
- **Goader leaving the game** ends that player's goad effect.

## Canonical Example
**Disrupt Decorum in a 4-player Commander game:**
You cast Disrupt Decorum ({2}{R}{R}).
All creatures controlled by Player B, C, and D are goaded by you.
Next turn: B's 5/5 must attack. Can't attack you. Must attack C or D.
C's 3/3 army must attack. Can't attack you. Must attack B or D.
D's creatures: same.
You sit safely while everyone attacks everyone else.
This often creates multiple creature deaths in one combat among your three opponents.
You spent 4 mana to potentially generate massive board attrition without losing a single creature.

**Example 2 — Marisi Goading Chain:**
Marisi controls you. Your 4/4 attacks Player B for combat damage.
Trigger: goad each creature B controls. B has a 6/6.
B's 6/6 must attack next turn. Can't attack Marisi's controller. B's 6/6 attacks Player C or D.
If B's 6/6 attacks C: C might have to block with their best creature → trade.
C's blockers are now weakened. Marisi's controller remains protected and watches.

## Commonly Confused With
- **P160 (Annihilator)** — Annihilator forces SACRIFICE on attack. Goad forces ATTACK toward other players.
- **P208 (Commander Zone)** — Commander zone rules govern zone changes. Goad is a combat politics mechanic.
- **P199 (Firebending)** — Firebending generates mana when attacking. Goad forces an attack. Both are combat-related but completely different.
