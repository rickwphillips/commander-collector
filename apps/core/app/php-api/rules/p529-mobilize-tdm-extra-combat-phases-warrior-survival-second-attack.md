---
id: p529
name: Mobilize (TDM) + Extra Combat Phases — Warrior Token Survival, Second Attack, and Next End Step Clarification
category: cross-mechanic
cr_refs: [500.6, 508.1, 507.1, 704.5d, 702.9]
tags: [mobilize, extra-combat, warrior-token, token-survival, aggravated-assault, moraug, end-step-sacrifice, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 3
---

# P529 — Mobilize (TDM) + Extra Combat Phases — Warrior Token Survival, Second Attack, and Next End Step Clarification

## Abstract
**Mobilize** creates Warrior tokens that "are sacrificed at the beginning of the next end step." **Extra combat phases** (from Aggravated Assault, Moraug, etc.) create additional combat phases within the same turn. The critical question: can Mobilize Warrior tokens attack again in an extra combat on the same turn? **Yes.** The tokens exist until "the **next** end step" — which means the end step of the current turn. If an extra combat occurs before the end step, the tokens are still alive and can attack again. They survive all extra combats within the same turn, dying only at the turn's end step. Multiple Mobilize triggers in different combats create multiple sets of tokens, each with its own "next end step" (the same end step in this turn).

## The Definitive Rules

**Mobilize Oracle Text:** *"Whenever [this creature] attacks, create N tapped and attacking 1/1 red Warrior creature tokens. Sacrifice them at the beginning of the next end step."*

**CR 500.6:** *"Some effects can add phases to a turn. A turn can have any number of phases of the same type."* — Extra combats are additional combat phases within the same turn.

**CR 704.5d (Token SBA):** *"A token that would be put into a zone other than the battlefield ceases to exist."* — Token sacrifice at end step is an SBA check.

**CR 507.1 (End Step):** *"The end step is literally the last step of the turn and is followed by the cleanup step."* — Multiple combat phases precede the single end step.

## The Pattern

```
MOBILIZE WARRIOR TIMELINE IN NORMAL TURN:

  Turn: Precombat Main → Combat 1 → Postcombat Main → End Step → Cleanup.

  During Combat 1:
    Mobilize creature attacks → trigger fires.
    Warriors created (tapped and attacking).
    Warriors resolve as part of Combat 1.
    Combat damage, then end of combat.

  During Postcombat Main:
    Warriors are still on the battlefield (alive).

  During End Step:
    SBA check: "Warriors are sacrificed at beginning of next end step."
    "Next end step" = the end step that is now occurring (current turn's end step).
    Warriors are sacrificed. SBA.

MOBILIZE WARRIOR TIMELINE WITH EXTRA COMBATS:

  Turn: Precombat Main → Combat 1 → Postcombat Main → Combat 2 (extra) → Postcombat Main → End Step.

  During Combat 1:
    Mobilize creature attacks → Warriors created.
    Warriors are tapped and attacking (can't attack again this combat).

  During Combat 2 (extra combat):
    Warriors are untapped? NO — they remain tapped from Combat 1.
    But Aggravated Assault or similar untaps creatures.
    Warriors can now attack again in Combat 2.
    Warriors deal combat damage again.

  Result: Warrior tokens have attacked TWICE (once in Combat 1, once in Combat 2).

  During End Step:
    SBA: Warriors sacrificed.
    Timeline: "next end step" = current turn's end step (first end step since creation).
    Warriors die.

MULTIPLE MOBILIZE IN ONE TURN:

  Combat 1: Mobilize creature attacks → 3 Warriors created. Tag: "sacrifice at next end step."
  Combat 2 (extra): Same creature attacks again → 3 MORE Warriors created. Tag: "sacrifice at next end step."
  Postcombat Main: 6 Warriors total on battlefield.
  End Step: SBA check.
    First 3 Warriors: "next end step" = this end step → sacrifice.
    Second 3 Warriors: "next end step" = this end step (same end step) → sacrifice.
    All 6 Warriors sacrifice simultaneously.

AGGRAVATED ASSAULT + MOBILIZE COMBO:

  You control Aggravated Assault ({3}{R}{R}: "untap all creatures, after main phase extra combat").
  You control Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4; Mobilize 2; "attacking tokens have deathtouch").

  Combat 1: Bone-Cairn Butcher attacks → 2 Warrior tokens created (tapped, attacking).
    Tokens have deathtouch (Butcher's static).
  Postcombat Main: Activate Aggravated Assault {3}{R}{R}.
    Untap all creatures (Butcher, Warriors).
  Combat 2 (extra): Bone-Cairn Butcher attacks again → 2 MORE Warriors created.
    Original 2 Warriors can now attack again (untapped).
    New 2 Warriors are attacking (created attacking).
    4 Warriors total on field, 3 attacking in Combat 2 (first 2 + Butcher itself).
  End Step: All 4 Warriors sacrificed.

MORAUG PRECOMBAT LANDFALL + MOBILIZE:

  Moraug, Fury of Akoum ({4}{R}{R}: 6/6; "whenever a land enters during your main phase,
    additional combat phase after this phase").
  Mobilize creature on battlefield.

  Precombat Main: Play a fetchland. Moraug's landfall fires → extra combat after this phase.
  Extra Combat: Mobilize creature attacks → Warriors created.
  Regular Combat: Mobilize creature attacks again → MORE Warriors created.
    Previous Warriors can attack if they're untapped (Moraug doesn't untap).
    Actually: Moraug untaps creatures at the beginning of the extra combat it creates.
    So: Warriors from extra combat are untapped for regular combat... no, wait.
    Moraug untaps "at the beginning of that combat" — each combat has its own untap.
    Extra Combat: creatures untap at beginning.
    Regular Combat: NO UNTAP (standard combat rules).
    Warriors from extra combat are tapped at beginning of regular combat.
    New Warriors from regular combat are attacking (created attacking).
  End Step: All Warriors sacrifice.

"NEXT" END STEP CLARIFICATION:

  "Sacrifice at beginning of the next end step."
  "Next" = the upcoming end step from the token's perspective.
  If created during Combat 1 (same turn): "next end step" = the current turn's end step.
  If created during Combat 2 (extra, same turn): "next end step" = still the current turn's end step.
  NOT: "next turn's end step" or "a future end step."
  All tokens created during the same turn sacrifice at that turn's single end step.

WARRIOR HASTE + EXTRA COMBAT RESURRECTION:

  Can Warrior tokens attack in an extra combat without being untapped?
  Warrior tokens are created "tapped and attacking."
  In the same combat, they cannot attack again (already attacked once).
  In a different combat (extra combat), they're new combat phases.
    But "tapped" status persists (no untap in regular combat).
    Warriors from Combat 1 are tapped going into Combat 2.
    They cannot attack in Combat 2 unless:
      (A) Something untaps them (Aggravated Assault, Moraug).
      (B) They have haste (they don't — Warrior tokens have no text).
    Without untapping, Mobilize tokens are one-attack-per-turn creatures (limited by tapping).

  NOTE: Extra-combat effects that "untap" creatures (Aggravated Assault, Moraug) specifically
    untap, making Warrior tokens attackable again.
```

## Definitive Conclusions

- **Mobilize Warrior tokens survive extra combat phases within the same turn** — "next end step" refers to the current turn's end step, so tokens created in Combat 1 can attack again in an extra Combat 2 if untapped.
- **Multiple Mobilize triggers create separate token sets but same sacrifice timing** — all tokens created in a turn sacrifice at that turn's end step, regardless of which combat created them.
- **Untapping effects are required for token re-attack in extra combats** — Warrior tokens are tapped after attacking; without explicit untapping (Aggravated Assault, Moraug), they cannot attack again even in an extra combat.
- **Token sacrifice is simultaneous at end step** — all Warrior tokens created that turn are sacrificed together as SBAs.

## Canonical Example

**Aggravated Assault Loop with Bone-Cairn Butcher:**

You control Bone-Cairn Butcher (4/4; Mobilize 2). Turn 1 combat: Butcher attacks → two 1/1 Warrior tokens with deathtouch created (attacking).

Postcombat main: Activate Aggravated Assault {5}{R}{R} (pay using resources generated from the Warriors/previous turns). Untap all creatures.

Extra combat phase begins: two Warriors are untapped → attack again. Bone-Cairn Butcher attacks → two MORE Warriors created (attacking). Combat 2 has 4 Warriors attacking (2 original + 2 new) + Butcher.

End step: all 4 Warriors sacrifice (SBA).

**Example 2 — Moraug Landfall + Warriors:**

You control Moraug. During precombat main, play a land. Moraug's landfall: extra combat after this main phase. You have a Mobilize creature (Dragonback Lancer, 3/3).

Extra combat: Lancer attacks → one 1/1 Warrior (tapped, attacking).
Return to main phase. Regular combat: Lancer attacks → one MORE 1/1 Warrior (tapped, attacking).
  (First Warrior is tapped, cannot attack again in regular combat; Moraug only untaps for the extra combat it creates, not for regular combat.)
  Second Warrior is new (attacking). One Warrior participates.

End step: both Warriors sacrifice.

**Example 3 — No Untap = One Attack Per Combat:**

Mobilize creature with no extra-combat sources. Combat: creature attacks → Warriors created (tapped, attacking).

Can the Warriors attack in the next turn? Yes (new turn = fresh combat). But in THIS turn, they cannot attack again (no untap, no haste). Their one attack is spent.

## Commonly Confused With
- **P520 (Mobilize)** — P520 covers baseline Mobilize mechanics. P529 clarifies survival across multiple combat phases and untapping requirements for re-attack.
- **P510 (Extra Combat Phases)** — P510 covers untapping mechanics in extra combats. P529 applies that to Mobilize tokens specifically.
- **P704 (SBAs)** — Token sacrifice is an SBA; P529 clarifies when the SBA check applies to Mobilize tokens (at turn's end step, not after each combat).
