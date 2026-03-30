---
id: p526
name: Mobilize (TDM) + Flurry (TDM) — Warrior Tokens Don't Count as Spells, Runescale Trigger Interaction
category: cross-mechanic
cr_refs: [508.1c, 603.2c, 702.180]
tags: [mobilize, flurry, warrior-token, second-spell, cast-trigger, runescale-stormbrood, entering-attacking, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 3
---

# P526 — Mobilize (TDM) + Flurry (TDM) — Warrior Tokens Don't Count as Spells, Runescale Trigger Interaction

## Abstract
**Mobilize** creates attacking Warrior tokens when a creature with Mobilize attacks. **Flurry** triggers on "whenever you cast your second spell each turn." The critical interaction: **Mobilize tokens are not spells** — they are permanents created by a triggered ability, not cast. Therefore, Mobilize tokens do NOT affect the Flurry second-spell count. If you Mobilize attack on your turn as your second spell, the Flurry count is not advanced by the Warrior token creation (it was already at 2 from your Mobilize creature being cast). However, **Runescale Stormbrood** ({3}{R}: 2/4) has a different trigger: "Whenever you cast a noncreature spell or a Dragon spell, this creature gets +2/+0." Mobilize tokens do NOT trigger this (they're not cast). But the Mobilize creature itself being cast, or a Dragon spell cast in the same turn, WILL trigger Runescale independently.

## The Definitive Rules

**CR 508.1c (Permanent Entering Attacking):** *"A permanent that enters the battlefield attacking hasn't been declared as an attacker for purposes of triggered abilities."* — Extended: permanents that enter attacking were not cast.

**CR 603.2c (Triggers):** *"A triggered ability may trigger once per occurrence of its triggering event. In cases in which an event has multiple occurrences, each occurrence will independently trigger the ability."* — Flurry triggers once per spell cast.

**Official Ruling (Mobilize, 2025-04-04):** *"Although the Warrior tokens enter as attacking creatures, they were never declared as attacking creatures. Abilities that trigger whenever a creature attacks won't trigger when the tokens enter attacking."* — Extended: creatures that enter are not cast.

**Runescale Stormbrood (Oracle text):** *"Whenever you cast a noncreature spell or a Dragon spell, this creature gets +2/+0."* — Specific to casting (not entering).

## The Pattern

```
MOBILIZE TOKENS ARE NOT SPELLS:

  When a Mobilize creature attacks and its trigger resolves, Warrior tokens enter.
  Tokens enter the battlefield in the attacking state (not declared as attackers).
  Tokens are NOT cast — no spell was announced or paid for.
  → Mobilize tokens are permanents, not spells.
  → Flurry does NOT see them as spells.
  → Cast-trigger abilities (Runescale, Prowess) do NOT see them.

FLURRY + MOBILIZE INTERACTION:

  Flurry: "Whenever you cast your second spell each turn."
  Your turn: Cast Spell 1 (first spell).
  Your turn: Cast Mobilize Creature as Spell 2 (second spell). Flurry triggers.
  Mobilize Creature attacks (same turn, before Flurry resolves). Mobilize trigger fires:
    create Warrior tokens.
  Warrior tokens are created via triggered ability, not cast.
  → Tokens do NOT count toward Flurry's second-spell window.
  → Tokens do NOT re-trigger Flurry (the second-spell event already occurred with the
    Mobilize creature's cast).
  Flurry resolves from the Mobilize creature being your second spell.
  Next spell you cast (third spell of the turn) does NOT trigger Flurry again.

EXAMPLE SEQUENCE:

  Turn: You control Devoted Duelist ({1}{R}: 2/1 Haste; Flurry — deal 1 to each opponent).
  You cast Llanowar Elves ({G}) — first spell.
  You cast Dragonback Lancer ({3}{W}: 3/3 Flying; Mobilize 1) — second spell.
    Flurry trigger fires (Devoted Duelist): deal 1 to each opponent.
  Dragonback Lancer attacks (same turn). Mobilize trigger: create one 1/1 Warrior token.
    Token is not a spell. Devoted Duelist's Flurry does NOT trigger again (second-spell
    window already used).
  If you cast a third spell (Counterspell {U}{U}), Flurry does NOT trigger (it fires once
    per turn, only on the second spell).

RUNESCALE STORMBROOD + MOBILIZE:

  Runescale Stormbrood ({3}{R}: 2/4): "Whenever you cast a noncreature spell or a Dragon
    spell, this creature gets +2/+0."

  Mobilize creates Warrior tokens (not cast). Runescale does NOT trigger from token creation.
  But: if you cast the Mobilize creature as a Dragon spell (example: Twinmaw Stormbrood,
    5/5 Dragon that also has Mobilize in hypothetical TDM card):
    Runescale triggers from the Dragon being cast.
    Then Mobilize creates tokens (after the creature resolves).
    Runescale already fired from the cast, not from the token creation.

  EXAMPLE: You control Runescale and cast Twinmaw Stormbrood // [Omen] from your hand
    (5/5 Dragon, Mobilize 1). Runescale triggers: +2/+0 until end of turn. Twinmaw enters.
    Twinmaw attacks (later in turn). Mobilize creates a 1/1 Warrior token.
    Runescale does NOT trigger again (Mobilize tokens are not cast).

MOBILIZE + DRAGON SYNERGIES:

  Whirlwing Stormbrood ({4}{U}: 4/3 Flash/Flying): "You may cast Dragon spells as though
    they had flash."
  If a Mobilize creature is a Dragon, Whirlwing lets you cast it at instant speed.
  Mobilize tokens are red Warrior creatures (not Dragons). Whirlwing does NOT affect them.

THIRD SPELL AFTER MOBILIZE:

  If you cast Spell 1, Spell 2 (Mobilize creature), then Spell 3:
    Flurry triggered on Spell 2.
    Spell 3 does NOT trigger Flurry again.
    Mobilize tokens (created from Spell 2's attack trigger) do not count as Spell 3.
  Spell 3 is a separate spell cast and counted separately from Mobilize tokens.

MOBILIZE + PROWESS STACKING:

  Prowess: "Whenever you cast a noncreature spell, this creature gets +1/+1 until EOT."
  Mobilize tokens do NOT trigger Prowess (not cast).
  But if a Mobilize creature has Prowess and you cast it:
    Prowess triggers from the cast (if it's a noncreature spell, which creatures are not).
    Mobilize tokens enter; Prowess does NOT trigger again.
    Net: Mobilize creature itself doesn't benefit from Prowess (it's not a noncreature).
    But if you cast noncreature spells after casting Mobilize, Prowess creatures benefit.

EXTRA TURN RESET:

  Flurry resets each turn (each new turn has its own "second spell").
  Extra turns (Time Walk, etc.) are new turns for Flurry's counting.
  If you get an extra turn and cast two spells in it:
    First spell: not second.
    Second spell: triggers Flurry (for this turn's second spell).
    Mobilize tokens from attacks in this extra turn: still not spells, don't count.
```

## Definitive Conclusions

- **Mobilize tokens are not spells** — they're permanents created by a triggered ability; Flurry does not see them.
- **Mobilize tokens do not advance the second-spell count** — Flurry triggers on the Mobilize creature's cast (second spell), not on the subsequent token creation.
- **Runescale Stormbrood does not trigger from Mobilize tokens** — the tokens are not cast; Runescale triggers only from spells being cast.
- **Mobilize + Dragon payoffs work differently** — Whirlwing grants flash to Dragon spells (including Mobilize creatures if they're Dragons), but tokens are Warrior type, not Dragon.
- **Flurry resets per turn including extra turns** — each new turn starts a fresh "second spell" count.

## Canonical Example

**Flurry Trigger on Mobilize Creature Cast:**

You control Poised Practitioner ({1}{U}{R}: 2/2; Flurry — put a +1/+1 counter on this creature and scry 1).

Turn: Cast Counterspell {U}{U} (first spell). Cast Dragonback Lancer {3}{W} with Mobilize 1 (second spell).

Flurry trigger fires (Poised Practitioner): put +1/+1 counter on it and scry 1. Poised Practitioner becomes 3/3 and you scry.

Dragonback Lancer attacks. Mobilize creates one 1/1 Warrior token. Token is not a spell — Flurry does NOT trigger again.

**Example 2 — Runescale Non-Interaction:**

You control Runescale Stormbrood and cast your second spell: a Dragon creature. Runescale triggers: +2/+0.

The Dragon creature attacks and has Mobilize. Mobilize tokens enter. Runescale does NOT trigger from the tokens (not cast). Runescale already got its trigger from the Dragon spell being cast.

**Example 3 — Whirlwing Dragon Mobilize:**

You control Whirlwing Stormbrood (grants Dragon spells flash). You have a Dragon with Mobilize in hand. You can cast it at instant speed (Dragon spell gets flash from Whirlwing). It attacks and creates Warrior tokens. Tokens are not Dragons, so Whirlwing doesn't grant them flash (they're already entering attacking anyway).

## Commonly Confused With
- **P520 (Mobilize)** — P520 covers the baseline Mobilize mechanics and token properties. P526 applies Flurry and cast-trigger logic to Mobilize tokens.
- **P511 (Flurry)** — P511 covers Flurry's baseline second-spell mechanics. P526 applies Flurry to Mobilize's token creation (non-interaction).
- **P215 (Storm)** — Storm copies are not cast (similar to Mobilize tokens). P526 applies the "not cast" rule to Flurry and Runescale specifically.
- **P195 (Prowess, Dragon synergies)** — P195 covers Prowess basics; P526 applies it to Mobilize's non-spell token creation.
