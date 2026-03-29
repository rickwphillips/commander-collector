---
id: p084
name: Myriad — Multi-Opponent Token Attack
category: combat
cr_refs: [702.116a, 702.116b]
tags: [myriad, token, copy, attack, each-opponent, end-of-combat, multiplayer, ETB, combat-damage]
created: myriad
examples_count: 2
---

# P084 — Myriad — Multi-Opponent Token Attack

## Abstract
Myriad triggers when the creature attacks. For each opponent OTHER than the defending player, you may create a tapped and attacking token copy targeting that opponent. At end of combat, all created tokens are exiled. Tokens are true copies (with abilities and ETBs firing), attack separate opponents simultaneously, and create combat damage events for each opponent. In a 4-player Commander game with one attacker, you can create tokens hitting each of the other three opponents.

## The Definitive Rule

**CR 702.116a** (verbatim): *"Myriad is a triggered ability that may also create a delayed triggered ability. 'Myriad' means 'Whenever this creature attacks, for each opponent other than defending player, you may create a token that's a copy of this creature that's tapped and attacking that player or a planeswalker they control. If one or more tokens are created this way, exile the tokens at end of combat.'"*

**CR 702.116b** (verbatim): *"If a creature has multiple instances of myriad, each triggers separately."*

## The Pattern

```
MYRIAD TRIGGER:
  When the myriad creature attacks:
  For each OPPONENT OTHER THAN the defending player:
    → You MAY create a token copy of this creature (tapped and attacking that opponent)
  If any tokens were created: exile all of them at end of combat

MULTIPLAYER SCALING:
  4-player Commander (you attack player A):
    Other opponents: B, C (not A — they're the defending player)
    Create tokens attacking B and C (if you choose)
    Result: 3 attackers total (original + 2 tokens) hitting 3 different opponents

  1v1 Duel:
    Defending player is the only opponent
    No other opponents → no myriad tokens ever created
    Myriad is useless in duels

TOKEN PROPERTIES:
  Token is a COPY of the creature (same P/T, abilities, name, types)
  The token is "tapped and attacking" that player (or their planeswalker)
  ETB abilities fire (the token entered the battlefield)
  LTB abilities fire at end of combat when exiled

END OF COMBAT:
  Delayed trigger: exile all myriad tokens at end of combat
  This happens even if the tokens are already dead (trigger fizzles for those)
  Tokens that survived combat are exiled here

ATTACKING STATUS AND TRIGGERS:
  The token is attacking immediately (it's tapped and attacking when it enters)
  "When this creature attacks" triggers already fired for the original
  The token entering tapped-and-attacking: does NOT re-trigger "when attacks"
    (similar to ninjutsu/P035 — it's "put into battlefield attacking" not "declared as attacker")
  Attack triggers on OTHER permanents: "whenever a creature attacks" may trigger
    → Depends on the wording: "whenever a creature you control attacks" might trigger
    → "enters attacking" vs "declared as attacker" → check specific card wording

COPYING ETBs:
  If the original has "when this enters, do X": token entering → X fires
  This can be substantial value: tokens landing on multiple opponents each triggering ETBs
```

## Definitive Conclusions

- **Myriad is effectively useless in 1v1 games.** No other opponents means no tokens.
- **Myriad tokens are tapped and attacking.** They don't trigger "when this creature attacks" (not declared as attackers).
- **ETB abilities on the token DO fire.** The token enters the battlefield.
- **Tokens are exiled at end of combat.** LTB abilities fire when they're exiled.
- **Multiple myriad instances each trigger separately.**

## Canonical Example
**Blade of Selves (when a creature with Blade equipped attacks, create myriad tokens):**
In Commander with 3 opponents. You attack opponent A. Myriad triggers: create tokens attacking B and C. Three attackers hit three different opponents. All tokens are exiled at end of combat. If the equipped creature has ETB abilities, those fired for each token too.

**Example 2 — Myriad + ETB creature:**
Eternal Witness (Myriad). Attack opponent A. Myriad: create Eternal Witness tokens attacking B and C. Each token enters → ETB: return a card from graveyard to hand. Three Eternal Witness ETBs (original + 2 tokens) = 3 cards recovered. Tokens exiled at end of combat (LTB of each fires if anything cares).

## Commonly Confused With
- **P061 (Encore)** — Encore also creates per-opponent tokens that attack. Encore is an activated graveyard ability; Myriad is an attack trigger. Both exile the tokens eventually.
- **P035 (Ninjutsu)** — Both "put attacking" rather than "declared as attackers." Neither retriggers "when this creature attacks."
