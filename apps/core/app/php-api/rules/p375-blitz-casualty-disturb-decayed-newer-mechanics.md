---
id: p375
name: Blitz, Casualty, Disturb, and Decayed — Streets of New Capenna and Innistrad Mechanics
category: stack
cr_refs: [702.152a, 702.152b, 702.153a, 702.153b, 702.146a, 702.146b, 702.147a]
tags: [blitz, casualty, disturb, decayed, sacrifice-at-end-step, draw-on-death, copy-on-sacrifice, transformed-from-graveyard, cant-block-sacrifice-on-attack, alternative-cost, Ob-Nixilis-the-Adversary, Jetmir-agent, Faithful-Mending, Spectral-Adversary, zombie-decayed-tokens]
created: 2026-03-29
examples_count: 2
---

# P375 — Blitz, Casualty, Disturb, and Decayed — Streets of New Capenna and Innistrad Mechanics

## Abstract
**Blitz** (702.152a) is an alternative cost: pay the blitz cost instead of the normal mana cost — the creature enters with haste, draws a card when it dies (not when sacrificed otherwise), and is sacrificed at the beginning of the next end step. Like a better dash: draw when it dies, forced sacrifice instead of return to hand. **Casualty N** (702.153a) is an additional cost that copies the spell: sacrifice a creature with power N or greater as you cast the spell; when you cast it and the casualty cost was paid, copy it (and optionally choose new targets). **Disturb** (702.146a) lets you cast a DFC from your GY transformed (paying the disturb cost instead of the normal cost). The card enters with its back face up. **Decayed** (702.147a) is a two-ability mechanic on Zombie tokens: they can't block AND when they attack, they're sacrificed at end of combat. Decayed tokens are essentially one-shot attackers.

## The Definitive Rules

**CR 702.152a** (verbatim): *"Blitz represents three abilities... 'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

**CR 702.153a** (verbatim): *"Casualty is a keyword that represents two abilities. The first is a static ability that functions while the spell with casualty is on the stack. The second is a triggered ability that functions while the spell with casualty is on the stack. Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.'"*

**CR 702.146a** (verbatim): *"Disturb is an ability found on the front face of some double-faced cards. 'Disturb [cost]' means 'You may cast this card transformed from your graveyard by paying [cost] rather than its mana cost.'"*

**CR 702.147a** (verbatim): *"Decayed represents a static ability and a triggered ability. 'Decayed' means 'This creature can't block' and 'When this creature attacks, sacrifice it at end of combat.'"*

## The Pattern

```
BLITZ (702.152a):
  THREE BUILT-IN EFFECTS WHEN BLITZ COST IS PAID:
    1. Haste: attacks immediately.
    2. Draw a card when it goes to GY from battlefield: "when this permanent is put into a graveyard."
    3. Sacrifice at the beginning of the next end step (forced sacrifice).
  KEY DETAIL — "WHEN PUT INTO GRAVEYARD":
    The draw trigger fires "when this permanent is put into a graveyard from the battlefield."
    This is more specific than "when this creature dies" — it must go FROM BATTLEFIELD TO GY.
    If the creature is exiled instead of going to GY: the draw trigger DOESN'T fire.
    If the creature is sacrificed (by the end-step blitz trigger): it's put into GY → draw fires.
    If the creature is destroyed: GY → draw fires.
    If the creature is bounced before the end step: the end-step sacrifice trigger fires, but
      the creature is in hand (not battlefield) → sacrifice fails (it's not a permanent).
      Wait: the trigger says "sacrifice the permanent this spell becomes" — it looks for a specific
        permanent. If that permanent is gone from the battlefield: trigger fails to find it, does nothing.
      Also: the draw trigger doesn't fire (creature was bounced, not put into GY).
      You keep the bounced creature in hand.
  BLITZ vs. DASH:
    Both: alternative cost, haste.
    Blitz: sacrifice at end step, draw on death.
    Dash: return to hand at end step, no death-draw.
    Key difference: blitz has death-replacement draw but eventually dies (or returns as card draw
      from GY via graveyard mechanics). Dash is infinitely replayable (returns to hand).
  BLITZ EXAMPLES (STREETS OF NEW CAPENNA):
    Ob Nixilis, the Adversary ({1}{B}{R}): "Casualty 1. When this enters, each opponent loses 1 life
      and you draw a card." Blitz {2}{B}{R}. 3/3 menace.
      Wait: Ob Nixilis has Casualty not Blitz. Let me reconsider.
    Professional Face-Breaker ({2}{R}): 2/3 Menace. Does NOT have blitz.
      "Whenever one or more creatures you control deal combat damage to a player, create a Treasure token.
       Sacrifice a Treasure: Exile the top card of your library. You may play that card this turn."
      (This is a Treasure engine card, not a blitz card — it was incorrectly listed here as a blitz example.)
    Ziatora's Envoy ({1}{B}{R}{G}): Blitz {2}{B}{R}{G}. 5/4 trample.
      "Whenever this creature deals combat damage to a player, look at the top card of your library.
       You may play a land or cast a spell with MV ≤ damage dealt from the top of your library without paying its mana cost."
      Blitz ({2}{B}{R}{G}): hasty 5/4 trample → attack → cascade-like top-of-library play → sacrifice at end step → draw.
      One attack + free spell/land + draw a card on death.

CASUALTY N (702.153a):
  HOW IT WORKS:
    Additional cost (optional): sacrifice a creature with power N or greater.
    If you pay this additional cost: triggered ability fires when you cast the spell.
    Trigger: copy the spell. May choose new targets for the copy.
  THE COPY:
    The copy is put on the stack. It's a copy, NOT cast.
    Prowess doesn't trigger for the copy. "When you cast" effects don't see the copy.
    (702.153a: "when you cast this spell, if casualty cost was paid, copy it" — the copy is
      created by a triggered ability, like conspire.)
  CASUALTY N VALUE:
    You sacrifice a creature (a cost), but you get TWO copies of the spell.
    This is powerful if the spell's effect is worth more than the sacrificed creature.
    Sacrificing a token (especially a Treasure or Food): free upgrade (you don't lose a real creature).
    OR: the creature was going to die anyway (chump blocker), so "sacrifice to casualty" is free.
  CASUALTY EXAMPLES:
    Ob Nixilis, the Adversary ({1}{B}{R}): "Casualty 1." 3/3. "When this enters, each opponent
      loses 1 life and you draw a card."
      Casualty 1: sacrifice a creature with power 1+.
      Copy the spell → two Ob Nixilis enter. Each triggers "each opponent loses 1 life, draw a card."
      Total: 2 opponents lose 2 life each (in multiplayer: each opponent loses 2 total), you draw 2 cards.
      But: legend rule. You control two copies of Ob Nixilis. SBA fires: sacrifice one.
      Wait: Ob Nixilis is legendary. Two copies → legend rule triggers → sacrifice one.
      BUT: the ETB triggers already fired. You drew 2 cards and opponents lost life twice.
      Then sacrifice one due to legend rule. Keep the other.
    Maestros Charm ({U}{B}{R}): "Casualty 1. Choose one — [three effects]."
      With casualty: two charms. Each separately chooses a mode. Two effects for price of one + sacrifice.
  CASUALTY POWER REQUIREMENT:
    Casualty N means the sacrificed creature must have power N OR GREATER.
    A 0-power creature can't pay casualty 1 (power = 0, not ≥ 1).
    A 1/1 token satisfies casualty 1. A 2/2 satisfies casualty 2. Etc.

DISTURB (702.146a–b):
  WHAT IT IS:
    Ability on the FRONT face of DFCs. Lets you cast the card TRANSFORMED from the GY.
    "Disturb [cost]": pay the disturb cost → cast the card face down (transformed form) from GY.
    702.146b: "A resolving double-faced spell cast using disturb enters with its back face up."
    The back face is the "transformed" side. You're casting the back face by using disturb.
  HOW IT ENTERS:
    Enters with back face up. ETBs on the back face fire.
    The front face's ETBs don't fire.
  ZONE IT ENTERS FROM:
    GY (the card was in the GY and you used disturb to cast it from there).
    After resolving: goes to GY (exile? — does disturb exile on leaving the stack?)
    702.146a says nothing about exiling. It's just an alternative cost.
    When the disturb spell leaves the stack and goes to GY (as permanents do when destroyed):
      actually no — the spell enters the battlefield. It's on the battlefield now.
    If the battlefield permanent then goes to GY: does it go to GY or exile?
    702.146a doesn't say exile. So: if a disturbed creature dies → GY. Can be disturbed again? YES.
      Unlike flashback/jump-start (which exile on leave stack), disturb doesn't exile the card after use.
      Each time it dies: goes to GY (if not exiled by other effects). Can be disturbed repeatedly.
  DISTURB EXAMPLES (INNISTRAD MIDNIGHT HUNT):
    Faithful Mending ({1}{W}): "Draw 2, discard 2." Normal spell.
    Wait: Faithful Mending is an instant, not a DFC.
    Katilda and Lina ({1}{G}{W}): "Disturb {3}{W}."
      Back face: different creature with back face abilities.
      Cast Katilda from GY for {3}{W}: enters as back face.
    Spectral Adversary ({1}{U}): "Flash, Flying. Disturb {5}{U}." Front face Haunt-like creature.
      Enters from GY as back face Spectral Adversary.
      Repeated resurrection: dies → GY → disturb again. But at {5}{U} cost each time.
  DISTURB vs. FLASHBACK:
    Flashback: same face, different zone (GY), exiles on use.
    Disturb: different face (transformed), from GY, does NOT exile on use.
    Disturb permanents can be reused after they die (go back to GY). Flashback spells are one-shot.

DECAYED (702.147a):
  WHAT IT IS:
    Two abilities on a single keyword:
    1. "This creature can't block."
    2. "When this creature attacks, sacrifice it at end of combat."
  KEY DESIGN:
    Decayed creatures are disposable attackers. They're generated by effects (especially Zombie effects).
    You get one use: one attack. Then they're gone (sacrificed at end of combat).
    They CAN still block? No: they CAN'T block (first ability). So they can't defend.
    The only use is attacking (and their combat effects, if any).
  WHEN DOES THE SACRIFICE TRIGGER?
    "When this creature attacks": triggers when the creature is declared as an attacker.
    "Sacrifice it at end of combat."
    This is a triggered ability with a delayed sacrifice. The sacrifice happens AT END OF COMBAT.
    Not immediately when it attacks. It fights in combat, then is sacrificed.
    So: deathtouch kills a blocker, damage is dealt, THEN at end of combat: sacrifice.
    The creature survives first-strike, regular combat, then is sacrificed at end of combat.
    Important: combat damage is dealt BEFORE the end of combat step sacrifice.
  DECAYED AND BLOCKING:
    Can't block (first static ability of decayed).
    Even if effects give the creature vigilance (attacks and stays untapped): it's still sacrificed.
    Vigilance doesn't prevent the sacrifice.
  DECAYED AND "SACRIFICE" MATTERS:
    Aristocrats decks: sacrifice triggers. A decayed creature triggering "whenever you sacrifice
      a creature" is free fodder (it was going to be sacrificed anyway).
    Zulaport Cutthroat, Blood Artist: drain from each decayed death.
  DECAYED TOKEN GENERATION:
    Cards like Teferi, Who Slows the Sunset: "Create two 2/2 black Zombie creature tokens with decayed."
    Each token: 2/2, can't block, attacks once and dies.
    Each attack: triggers any "when this creature attacks" abilities, then dies at end of combat.
```

## Definitive Conclusions

- **Blitz draws a card when the creature goes to the graveyard** — not if it's exiled, bounced, or sacrificed to a different effect; the draw fires specifically when put into GY from battlefield.
- **Blitz creatures are forcibly sacrificed at next end step** — if the creature leaves the battlefield before then, the sacrifice trigger finds nothing and fails.
- **Casualty's copy is not a cast event** — like conspire, the copy is created by a triggered ability; prowess and "when you cast" effects don't see it.
- **Disturb doesn't exile the card** — unlike flashback, a disturbed permanent that dies returns to the GY and can be disturbed again; this makes disturb a repeatable GY mechanism (at cost).
- **Decayed creatures can't block and are sacrificed at end of combat when they attack** — they survive combat (deal damage), then are sacrificed in the end of combat step; combat damage resolves before the sacrifice.

## Canonical Example
**Ob Nixilis, the Adversary Casualty Combo:**
You control a 1/1 Citizen token (power 1 ≥ casualty 1).
Hand: Ob Nixilis, the Adversary ({1}{B}{R}): "Casualty 1. When this enters, each opponent loses 1 life and you draw a card. Menace." 3/3.
Commander game (3 opponents).

Cast Ob Nixilis with casualty:
  Announce casting + casualty additional cost. Sacrifice the 1/1 Citizen token.
  Casualty trigger: "when you cast this spell, if casualty cost was paid: copy it."
  Ob Nixilis is on the stack. Copy trigger creates a copy on the stack above it.
  Choose new targets for the copy? (Ob Nixilis has no targets — it's an ETB effect. No targets to choose.)
  Stack: Ob Nixilis copy (top), Ob Nixilis original (below).

Copy resolves: enters battlefield as copy of Ob Nixilis. ETB: each opponent loses 1 life, you draw 1 card.
  3 opponents lose 1 life each = 3 life total drained. You draw 1 card.
  BUT: Ob Nixilis is legendary. You now control one Ob Nixilis.

Original resolves: another Ob Nixilis enters. ETB again: each opponent loses 1 life, you draw 1 card.
  3 more opponents' life drained. You draw 1 more card.
  Now you have TWO copies of Ob Nixilis. Legend rule: must sacrifice one.
  You sacrifice the copy (keep the original since you chose it).

Result:
  6 life drained from each opponent (2 per opponent if 3 opponents = 6 total damage in multiplayer).
  Wait: each opponent lost 1 life twice = 2 life each. You drew 2 cards.
  Total from {1}{B}{R} + casualty (sacrificed a 1/1 token): 2 damage to each opponent + draw 2 cards.
  For reference: Ob Nixilis without casualty deals 1 damage per opponent and draws 1 card.
  Casualty doubled the ETB. The cost: one 1/1 token (easily replaced).

**Example 2 — Decayed Zombie Horde Attack:**
Opponent controls 5 Zombie tokens with decayed (2/2 black Zombies, decayed).
Each zombie: can't block, and when it attacks, is sacrificed at end of combat.

Opponent attacks with all 5 decayed Zombies (total power: 10).
You have no blockers (they can't block anyway, but you also have nothing to block with).
Combat damage step: all 5 deal 2 damage each = 10 damage to you.
End of combat step: 5 "when this creature attacks, sacrifice it at end of combat" triggers fire.
  All 5 Zombies are sacrificed.
  If opponent has Blood Artist: 5 triggers. 5 life gained by opponent. 5 life lost by you.
  Total: 10 damage + 5 drain = 15 life swing.
  Opponent's board is now empty (all decayed Zombies sacrificed).

The decayed horde trades itself for massive damage. One use, then gone.
This represents the "overwhelming horde" gameplay: flood the board with decayed, attack for lethal,
  accept that they all die. If opponent survives: they have nothing left to attack back.

Key: decayed tokens can't block, so they're pure offense. They can't protect you if you get attacked.
Decayed horde = all-in offense. Combine with sacrifice payoffs for extra value.

## Commonly Confused With
- **P371 (Dash)** — Both blitz and dash create creatures with haste that are later removed from the battlefield. Dash returns to hand (indefinitely reusable). Blitz is sacrificed at end step AND draws a card on death. Blitz is "one-shot" with draw compensation; dash is "infinite loop" without the draw.
- **P367 (Conspire)** — Casualty's copy works exactly like conspire: pay an additional cost during casting, get a triggered ability that copies the spell. The copy is not cast (same as conspire). Key difference: conspire taps creatures (shares color requirement); casualty sacrifices a creature (no color requirement, just power ≥ N).
- **P345 (Double-Faced Cards)** — Disturb casts a DFC from the GY transformed. The rules for DFCs (rule 712) apply. The back face enters and stays on the battlefield unless something transforms it. Unlike other DFC mechanics, disturb doesn't force back-to-front transformation; once disturbed, it stays as the back face unless an effect transforms it.
- **P363 (Tokens)** — Decayed tokens are tokens (created by effects). When they're sacrificed at end of combat: they're "put into the GY" from sacrifice, which triggers "when you sacrifice a creature" and "when a creature dies" effects (dies means goes to GY from battlefield). Then the token ceases to exist (SBA: token in GY ceases to exist). But the triggers already fired.
