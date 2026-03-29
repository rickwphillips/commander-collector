---
id: p235
name: Epic — Can't Cast Spells for Rest of Game, Copy Each Upkeep
category: stack
cr_refs: [702.50a, 702.50b]
tags: [epic, spell-lock, copy-upkeep, Saviors-of-Kamigawa, Eternal-Dominion, Sway-of-the-Stars, Neverending-Torment]
created: 2026-03-28
examples_count: 2
---

# P235 — Epic — Can't Cast Spells for Rest of Game, Copy Each Upkeep

## Abstract
Epic is a mechanic from Saviors of Kamigawa (2005) representing two simultaneous abilities: (1) a permanent static effect preventing you from casting any more spells for the rest of the game, and (2) a delayed triggered ability that copies the Epic spell at the beginning of each of your upkeeps for the rest of the game. The tradeoff is stark: your entire game plan pivots on the Epic spell's effect repeating every turn. Casting an Epic spell is an "all-in" commitment — you sacrifice future spell-casting entirely in exchange for a repeating powerful effect. You cannot "undo" the lock. Effects that create copies (like the Epic itself) are not "casting spells" and bypass the restriction.

## The Definitive Rules

**CR 702.50a** (verbatim): *"Epic represents two spell abilities, one of which creates a delayed triggered ability. 'Epic' means 'For the rest of the game, you can't cast spells,' and 'At the beginning of each of your upkeeps for the rest of the game, copy this spell except for its epic ability. If the spell has any targets, you may choose new targets for the copy.'"*

**CR 702.50b** (verbatim): *"A player can't cast spells once a spell with epic they control resolves, but effects (such as the epic ability itself) can still put copies of spells onto the stack."*

## The Pattern

```
EPIC:
  When an Epic spell resolves, two things happen simultaneously:
  1. "For the rest of the game, you can't cast spells."
  2. Create a delayed triggered ability: "at the beginning of EACH of your upkeeps for the rest of the game, copy this spell (without the epic ability). If any targets, you may choose new targets for the copy."

EPIC + SPELL-CASTING LOCK:
  The lock is PERMANENT and IRREVOCABLE
  You cannot cast spells for the rest of the game
  This means: no instants, no sorceries, no creatures, no enchantments, no planeswalkers, no artifacts
  You may still: activate abilities (including mana abilities), trigger abilities, use special actions
  You cannot cast spells: even "cascade" exiling or "adventure" adventures are casting
  The only spells being put on the stack are the Epic copies (which are "effects" not "casting")

EPIC + COPIES:
  Each upkeep: copy of the Epic spell resolves (without the epic ability)
  The copy does NOT have Epic text: it just has the spell's other effects
  Choose new targets for the copy if desired
  These copies are created by an effect (not cast) — they bypass the spell-casting lock

  CR 702.50b: "effects (such as the epic ability itself) can still put copies of spells onto the stack."
  This means: Reverberate, Fork, Twincast targeting the Epic copy — CAN you copy it?
    The copies from Reverberate are also created by effects (not casting)
    But wait — Reverberate is CAST. Once Epic locks you, you can't cast Reverberate.
    Before the Epic resolves: you COULD cast Reverberate to copy the Epic.
    After: no new spells allowed.

EPIC SPELLS (Saviors of Kamigawa):
  Eternal Dominion ({7}{U}{U}{U}, Sorcery — Epic): "Search target opponent's library for an artifact, creature, enchantment, or land card. Put that card onto the battlefield under your control. Then that player shuffles their library."
    Each upkeep: copy targeting a different opponent → steal a card from each
    Running out of opponents to target? Can target the same player each turn

  Sway of the Stars ({8}{U}{U}, Sorcery — Epic): "Each player shuffles their hand, graveyard, and all permanents they own into their library, then draws seven cards. Each player's life total becomes 7."
    Devastating: resets the entire game to 7 cards/7 life for all players
    Each upkeep: repeat the reset
    After first cast: you draw 7 cards but can't cast any of them (epic lock)
    The copies still reset: opponent is stuck too

  Neverending Torment ({6}{B}{B}, Sorcery — Epic): "Search target player's library for X cards, where X is the number of cards in your hand. Exile those cards. Then that player shuffles their library."
    X = cards in hand when COPY resolves (not when cast): after casting Epic, you draw 7 (Sway of the Stars)
    Actually: Neverending Torment + Sway of Stars is theoretically powerful
    But: Neverending Torment copies can't generate new hand cards after lock

  Enduring Ideal ({5}{W}{W}, Sorcery — Epic): "Search your library for an enchantment card and put it onto the battlefield. Then shuffle your library."
    Each upkeep: tutor an enchantment for free
    This is the most competitive Epic: assemble an enchantment lock piece by piece
    After 5-6 upkeeps: have Form of the Dragon, Solitary Confinement, Dovescape, etc.
    Competitive: Enduring Ideal is a viable Modern deck archetype!

EPIC + TIMING:
  You must cast Epic during your main phase (it's a sorcery)
  After it resolves: you're locked forever
  The copies at upkeep ARE mandatory (triggered ability): they WILL happen each upkeep
  But choosing targets for the copy is optional: you may choose new targets or not

EPIC + STACK COPYING (before resolution):
  If you Reverberate or Fork the Epic spell before it resolves:
  Both the copy and the original resolve
  The FIRST to resolve (copy) locks you: you can't cast spells
  Then the second resolves: another locked copy + another set of upkeep triggers
  Net effect: two Epic triggers per upkeep (one from each copy)
  However: after the first Epic resolves, you're locked → can't interact further
```

## Definitive Conclusions

- **Epic permanently locks you** from casting spells for the rest of the game — irreversible.
- **Each upkeep**: free copy of the Epic spell (without the epic ability) fires — choose new targets if desired.
- **Copies aren't cast**: the lock doesn't stop the automatic upkeep copies.
- **Enduring Ideal** is the competitive epic — tutoring enchantments every upkeep builds an unstoppable lock.
- **Sway of the Stars** is the most chaotic epic — resets the game each turn, but you can't rebuild from the reset.

## Canonical Example
**Enduring Ideal in Modern Enchantress:**
Cast Enduring Ideal ({5}{W}{W}) on Turn 6-7.
Resolve: search for Solitary Confinement (enchantment: skip your draw step, discard a card, can't be targeted by opponents' spells or abilities).
Epic locks: can no longer cast spells.
Next upkeep: copy triggers → search for Form of the Dragon (enchantment: at end of each turn, set life total to 5; flying dragons; can only be attacked by flying).
Or: Copy → Heliod's Intervention, Banishing Light, Overwhelming Splendor.
Or: Mesa Enchantress was played earlier → each enchantment that entered drew a card... but Epic locked drawing?
No: draw effects from enchantments are triggered abilities, not casting.
Build-out: Turn 1 Heliod → Turn 2 Solitary Confinement → Turn 3 Form of the Dragon = impossible-to-beat board state.

**Example 2 — Sway of the Stars Lock:**
Late game, trailing badly. Cast Sway of the Stars ({8}{U}{U}).
All players: shuffle everything into library, draw 7, life total becomes 7.
Epic fires — repeat each upkeep.
You draw 7 cards — but CANNOT cast any of them (Epic lock).
Each upkeep: opponent also gets shuffled back to 7 life and new hand.
The game resets forever: nobody can progress (you can't cast, opponents keep resetting).
Technically, if opponent can win on their draw (instant win with top deck): they can.
Otherwise: game stalemate. Epic lock + Sway = "everyone loses slowly together."

## Commonly Confused With
- **P215 (Storm)** — Storm copies a spell based on count; you continue playing normally after Storm. Epic locks you and copies automatically each upkeep.
- **P205 (Saga)** — Sagas trigger chapter abilities at upkeep; they expire. Epic triggers FOREVER and you can't interact.
- **P230 (Entwine)** — Entwine pays extra to choose all modes; no restrictions on future play. Epic is an all-in commitment to one repeating effect.
