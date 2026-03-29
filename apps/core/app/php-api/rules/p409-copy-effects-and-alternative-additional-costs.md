---
id: p409
name: Copy Effects and Stack Spell Properties — Kicked, Flashed-Back, Buyback, and Madness Copies
category: stack
cr_refs: [707.2, 707.10, 707.10a, 702.33d, 702.34a, 702.27a, 702.35a, 704.5e]
tags: [copy-effects, kicked-copies, flashback-copies, buyback-copies, madness-copies, alternative-cost, additional-cost, stack-spell-properties, Fork, Reverberate, Twincast, copy-a-spell, copy-ceases-to-exist, copiable-values, kicked-status-copied, buyback-copy-hand, flashback-exile-copy, Narset-storm-copy]
created: 2026-03-29
examples_count: 3
---

# P409 — Copy Effects and Stack Spell Properties — Kicked, Flashed-Back, Buyback, and Madness Copies

## Abstract
When you copy a spell on the stack, CR 707.2 and 707.10 define exactly what the copy inherits: **the copy acquires the copiable values AND all decisions made when casting the spell** — including modes, targets, the value of X, whether it was kicked, and additional or alternative costs. This means a copy of a kicked spell is also "kicked"; a copy of a buyback spell has buyback paid; a copy of a flashed-back spell has the flashback alternative cost paid. However, because **copies of spells cease to exist when they leave the stack** (CR 707.10a, 704.5e), the practical consequences differ dramatically from those of the original. Buyback on a copy doesn't put a card in hand (the copy has no card). Flashback exile applies only to the original card. Understanding which properties ARE inherited vs. which consequences can't materialize is the core of this pattern.

## The Definitive Rules

**CR 707.2** (verbatim): *"When copying an object, the copy acquires the copiable values of the original object's characteristics and, for an object on the stack, choices made when casting or activating it (mode, targets, the value of X, whether it was kicked, how it will affect multiple targets, and so on)."*

**CR 707.10** (verbatim): *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack; a copy of a spell isn't cast and a copy of an activated ability isn't activated. A copy of a spell or ability copies both the characteristics of the spell or ability and all decisions made for it, including modes, targets, the value of X, and additional or alternative costs."*

**CR 707.10a** (verbatim): *"If a copy of a spell is in a zone other than the stack, it ceases to exist. If a copy of a card is in any zone other than the stack or the battlefield, it ceases to exist. These are state-based actions. See rule 704."*

**CR 704.5e** (verbatim): *"If a copy of a spell is in a zone other than the stack, it ceases to exist."*

**CR 702.33d** (verbatim): *"If a spell's controller declares the intention to pay any of that spell's kicker costs, that spell has been 'kicked.' If a spell has two kicker costs or has multikicker, it may be kicked multiple times."*

**CR 702.27a** (verbatim): *"If the buyback cost was paid, put this spell into its owner's hand instead of into that player's graveyard as it resolves."*

**CR 702.34a** (verbatim): *"If the flashback cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack."*

## The Pattern

```
WHAT COPIES INHERIT (707.2, 707.10):
  "Choices made when casting" includes:
    - Modes (which mode was chosen for modal spells)
    - Targets (which target was chosen; may be changed per 707.10c)
    - X value (the same X from the original cast)
    - Whether it was kicked (kicked status IS inherited)
    - Additional or alternative costs (e.g., buyback paid, flashback paid)
  Copies DO NOT inherit:
    - Status effects (tapped/untapped, counters on the original spell)
    - The card object itself (copies have no card associated with them)

KICKED COPIES (702.33d + 707.2):
  A copy of a kicked spell IS kicked.
  Example: You cast Burst Lightning ({R}: deal 2 damage; kicker {4}: deal 4 instead).
    You kick Burst Lightning: pay {4}{R}, deal 4 damage.
    Reverberate copies Burst Lightning. The copy inherits the "kicked" status.
    The copy also deals 4 damage (not 2).
  This is confirmed by 707.2: "whether it was kicked" is explicitly listed.
  For multikicker: the copy inherits the multikicker count.
    Example: Stormbreath Dragon cast with multikicker paid 3 times → 3 +1/+1 counters on ETB.
      A copy of that spell would also have been "kicked 3 times" for the multikicker count.

FLASHBACK COPIES (702.34a + 707.10a):
  A copy of a flashed-back spell inherits "flashback cost was paid" (alternative cost).
  HOWEVER: 702.34a applies to "this card" — meaning the actual CARD, not the copy.
    "Exile this card instead of putting it anywhere else any time it would leave the stack."
    "This card" = the card object being flashed back.
    A copy has NO card. It's not "this card."

  Result when copy resolves:
    Copy resolves → effect happens → copy would leave stack.
    702.34a exile replacement tries to apply: "exile this card."
    The copy IS NOT "this card" — it's a copy. No actual card exists.
    707.10a: copy ceases to exist (SBA) when it would go anywhere other than the stack.
    Net effect: the copy simply ceases to exist. It does NOT go to GY or exile.

  Result when original resolves (later, in LIFO order):
    Original (the card) resolves → effect happens → would leave stack.
    702.34a applies: exile THE CARD.
    The original is exiled normally.

  IMPORTANT DISTINCTION:
    Stack order (after copying Reverberate on flashed-back Deep Analysis):
      [Copy of Deep Analysis] [Original Deep Analysis] on stack.
    Copy resolves first: draws 2 cards. Copy ceases to exist.
    Original resolves: draws 2 cards. Original is EXILED (flashback rule applies).
    Net: drew 4 cards total (2 + 2). Original used up (exiled). Copy had no exile.
    The copy does NOT consume the flashback exile — only the original does.

BUYBACK COPIES (702.27a + 707.10a):
  A copy of a buyback-paid spell inherits "buyback cost was paid."
  702.27a: "If the buyback cost was paid, put this spell into its owner's hand instead of
    into that player's graveyard as it resolves."

  When the copy resolves:
    The copy would go to hand (buyback replacement).
    BUT: the copy would now be in hand (a zone other than the stack).
    707.10a: copy ceases to exist in any zone other than the stack.
    704.5e SBA fires: copy ceases to exist.
    Net effect: the copy CANNOT go to hand. The buyback replacement fires, then the copy
      immediately ceases to exist (via SBA). You don't get a copy in hand.

  For the original:
    The original has a card. When it resolves, buyback returns it to hand normally.
    Owner has the original buyback spell in hand (can cast again next turn).

  PRACTICAL RESULT:
    Copying a buyback spell gives you the effect twice (both copies resolve their effect),
    but only the ORIGINAL returns to hand. The copy's "return to hand" doesn't work.

    Example: Capsize with buyback ({4}{U}{U} total). You copy it with Reverberate.
    Stack: [Copy of Capsize] [Original Capsize]
    Copy resolves: bounce a permanent. Copy ceases to exist (can't go to hand).
    Original resolves: bounce a permanent. Original returns to hand (buyback).
    Net: 2 permanents bounced. 1 Capsize in hand.

MADNESS COPIES:
  Madness cast is an ALTERNATIVE COST (702.35a).
  A copy of a madness-cast spell inherits the "madness cost was paid" as alternative cost.

  However: madness has a specific step — the card is in exile when cast for its madness cost.
  When the copy resolves, the copy ceases to exist (707.10a). This is fine — madness
    doesn't have a special "where do I go when leaving the stack" rule like flashback or buyback.
  The original madness cast spell: after resolving, it would normally go to GY (madness
    doesn't prevent the spell from going to GY on resolution — only the discard goes to exile;
    the cast spell is a normal spell on the stack and goes to GY when done).

  Note: the madness cast already moved the CARD from exile to the stack.
  After resolution: the card goes to GY (normal spell resolution route).
  So: copy of madness spell resolves (ceases to exist), original resolves → goes to GY.
  The card is now in GY, available for flashback or other GY recursion.

MODAL SPELL COPIES:
  A copy of a modal spell inherits the modes chosen (707.2: "mode").
  707.10c: "some effects copy a spell and state that its controller may choose new targets."
    New TARGETS can be chosen for copies (if the copy effect allows).
    New MODES cannot be chosen (modes are "choices made when casting," not targets).
  If the copy effect says "you may choose new targets," you can change targets only.
  You cannot switch modes on a copy.

EXCEPTIONS: COPY EFFECTS THAT ALLOW NEW TARGET CHOICE (707.10c):
  Fork ({R}{R}: "copy target instant or sorcery; you may choose new targets for the copy"):
    Can choose new targets for all targeted effects in the copy.
    Cannot change modes.
    Cannot change X values.
    Cannot choose to "un-kick" the spell.
  Reverberate ({1}{R}: "copy target instant or sorcery; you may choose new targets"):
    Same as Fork for target purposes.
```

## Definitive Conclusions

- **Copies of kicked spells ARE kicked** — the kicked status is explicitly listed in CR 707.2 as a copied decision; a copy of a kicked Thornscape Battlemage will have both ETB effects trigger.
- **Copies of flashback spells do NOT use up the exile clause** — the "exile this CARD" in CR 702.34a refers to the actual card object, not the copy; the copy simply ceases to exist; only the original is exiled.
- **Copies of buyback spells cannot return to hand** — the buyback replacement applies to the copy, but 707.10a SBA immediately removes the copy from hand; you don't get a "free" copy in hand.
- **X values are copied** — a copy of a Fireball cast with X=10 also deals 10 damage (the X value was a decision made when casting).
- **Modes are NOT changeable on copies** — even if the copy effect says "may choose new targets," modes are cast decisions, not targets; the copy has the same modes.

## Canonical Example
**Reverberate on Kicked Thornscape Battlemage:**
You cast Thornscape Battlemage ({2}{G}: 2/2; Kicker {W} and/or {R}; "When Thornscape Battlemage enters, if it was kicked with its {W} kicker, destroy target enchantment"; "...if kicked with {R} kicker, Thornscape Battlemage deals 2 damage to target creature or player").

You kick with both {W} and {R}: total cost {2}{G}{W}{R} = 5 mana.

Opponent plays Reverberate targeting your spell. A copy of Thornscape Battlemage (kicked with both) goes on stack.

Stack: [Copy of Battlemage (kicked W+R)] [Original Battlemage (kicked W+R)]

Copy resolves first:
- Enters as a token. Wait — no. 707.10f: copy of permanent spell "ceases being a copy of a spell and becomes a token permanent."
- The copy is also kicked with both W and R (707.2).
- "When this creature enters, if kicked with W, destroy target enchantment" — both triggers fire from the copy entering.
- "If kicked with R, deal 2 damage to target creature" — triggers.
- You get: an additional 2/2 creature entering, destroying an enchantment, and 2 damage.

Original resolves:
- The real Thornscape Battlemage enters. Both ETBs fire again.
- Destroy another enchantment. Deal 2 more damage.

Net: 2 creature tokens on battlefield, 2 enchantments destroyed, 4 damage dealt.

**Example 2 — Fork Copying Flashed-Back Brain Freeze:**
You cast Brain Freeze ({1}{U}: "target player mills 3 cards for each spell cast this turn including this one; Storm"):
Storm count = 5 → Brain Freeze creates 5 copies via storm.
You cast Brain Freeze via flashback (if it has flashback — for this example, use a flashed-back Deep Analysis instead).

Actually, concrete example: Flashed-back Deep Analysis ({3}{U}: draw 2; flashback {1}{U} + 3 life).
You cast Deep Analysis via flashback (pay {1}{U} + 3 life). On stack.
Opponent casts Reverberate targeting Deep Analysis. Copy on stack.

Stack: [Copy of Deep Analysis (flashback paid)] [Original Deep Analysis (flashback paid)]

Copy resolves: you draw 2 cards. Copy ceases to exist (no exile because the exile applies only to "this card").
Original resolves: you draw 2 more cards. Deep Analysis is exiled (flashback clause applies to the card).

Net: drew 4 cards, paid 3 life for flashback once + Reverberate's cost. Deep Analysis is in exile (used up). Zero copies of Deep Analysis in GY.

**Example 3 — Copy + Buyback:**
You cast Whispers of the Muse ({U}: draw a card; buyback {5}) with buyback (paying {5}{U} total).
Opponent plays Twincast ({1}{U}: copy target instant or sorcery; you may choose new targets).
Copy of Whispers (with buyback paid) goes on stack.

Stack: [Copy of Whispers (buyback paid)] [Original Whispers (buyback paid)]

Copy resolves: draw a card. Copy "would" go to hand (buyback says so). 707.10a SBA: copy ceases to exist. You don't get a copy in hand.
Original resolves: draw a card. Original goes to hand (buyback).

Net: drew 2 cards; original Whispers is back in your hand; opponent spent {1}{U} on Twincast to help you draw an extra card.

## Commonly Confused With
- **P407 (Cycling/Kicker/Buyback)** — Explains how kicker and buyback work on the original spell. This pattern (P409) focuses specifically on what happens when those spells are copied — the distinction between inheriting the cast decision vs. the physical card's properties.
- **P405 (Storm/Affinity/Ward)** — Storm copies are similar to copy effects. Storm copies inherit the original spell's text but are not cast. Storm copies of a buyback spell also have buyback "paid" copied, but also cease to exist (same as Fork copies).
- **P003 (Zone Changes and Object Identity)** — P003 covers whether an object is "the same" after moving zones. This pattern extends that: copies are not the same object as the original, which is why "this card" clauses (buyback, flashback exile) only apply to the original card.
