---
id: p404
name: Encore, Blitz, Casualty, and Enlist — Attack-for-a-Turn, Haste-Sacrifice, Copy-via-Sacrifice, and Tap-for-Bonus
category: triggered
cr_refs: [702.141a, 702.152a, 702.152b, 702.153a, 702.153b, 702.154a, 702.154b, 702.154c]
tags: [encore, blitz, casualty, enlist, GY-activated-token-attack, haste-sacrifice-end-step, copy-spell-via-sacrifice, tap-creature-power-bonus, Commander-2021, Streets-of-New-Capenna, Dominaria-United, Toxrill-the-Corrosive, Ob-Nixilis-Adversary, Body-of-Research, Platoon-Dispenser, encore-one-per-opponent, blitz-draw-on-death, casualty-copy-not-cast, enlist-taps-non-attacker]
created: 2026-03-29
examples_count: 2
---

# P404 — Encore, Blitz, Casualty, and Enlist — Attack-for-a-Turn, Haste-Sacrifice, Copy-via-Sacrifice, and Tap-for-Bonus

## Abstract
**Encore** (702.141) is a GY-activated ability: pay the encore cost, exile the card from GY, and create one token copy per opponent — each token attacks that specific opponent this turn (if able) with haste, then is sacrificed at the beginning of the next end step. **Blitz** (702.152) is an alternative cast cost: pay the blitz cost instead of the normal cost, and the creature has haste plus "when this dies, draw a card" — but it's sacrificed at the beginning of the next end step. **Casualty N** (702.153) is an additional cost on spells: sacrifice a creature with power N or greater when you cast the spell, and when the spell is cast with casualty paid, you copy the spell (with new targets optional). **Enlist** (702.154) lets an attacking creature tap a non-attacking creature you control (that has haste or has been under your control all turn) to give the enlisting creature +X/+0 until end of turn (where X = tapped creature's power).

## The Definitive Rules

**CR 702.141a** (verbatim): *"Encore is an activated ability that functions while the card with encore is in a graveyard. 'Encore [cost]' means '[Cost], Exile this card from your graveyard: For each opponent, create a token that's a copy of this card that attacks that opponent this turn if able. The tokens gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.'"*

**CR 702.152a** (verbatim): *"Blitz represents three abilities: two static abilities that function while the card with blitz is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with blitz is on the battlefield. 'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

**CR 702.153a** (verbatim): *"Casualty is a keyword that represents two abilities. The first is a static ability that functions while the spell with casualty is on the stack. The second is a triggered ability that functions while the spell with casualty is on the stack. Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.' Paying a spell's casualty cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.154a** (verbatim): *"Enlist represents a static ability and a triggered ability. Enlist means 'As this creature attacks, you may tap up to one untapped creature you control that you didn't choose to attack with and that either has haste or has been under your control continuously since this turn began. When you do, this creature gets +X/+0 until end of turn, where X is the tapped creature's power.'"*

## The Pattern

```
ENCORE (702.141):
  WHAT IT IS:
    GY-activated ability. Sorcery speed. The card is exiled as part of the cost.
    Creates one token copy per opponent (not per creature, per OPPONENT).
    In 4-player Commander: 3 opponents → 3 token copies created.
    Each token: attacks that specific opponent this turn (if able). Has haste.
    At the beginning of the next end step: sacrifice all the tokens.
  KEY DETAILS:
    "Attacks that opponent this turn if able" — the tokens must attack (if possible).
      If the token is somehow prevented from attacking, it doesn't attack. Still sacrificed at EOT.
    Tokens are copies of the card: they have all the abilities.
    If the creature has ETB triggers: do they fire when the encore tokens are created?
      The tokens enter the battlefield "attacking" — they're placed as attacking tokens.
      Similar to myriad tokens (P392): they enter attacking (not declared as attackers).
      ETB triggers DO fire when tokens enter the battlefield (they enter the BF).
    The tokens can attack planeswalkers if you choose (attacking "that opponent" means attacking
      something controlled by that opponent: the player or a planeswalker they control).
  ENCORE IN 1V1:
    1 opponent: encore creates 1 token. Still useful.
  ENCORE COMPARED TO MYRIAD (P392):
    Myriad: creates tokens from an attacking creature while it's on the battlefield.
    Encore: creates tokens from the GY after the original creature is dead.
    Both create tokens that attack each opponent. Both sacrifice the tokens after combat.
    Key difference: encore is post-death recursion; myriad is a living creature ability.
  EXAMPLE — ANGEL OF INDEMNITY:
    Angel of Indemnity ({5}{W}: 5/5 Flying, Lifelink, "When it enters, return target permanent card
      with MV 4 or less from your GY to battlefield. Encore {6}{W}{W}"):
    Encore from GY: pay {6}{W}{W}, exile Angel of Indemnity.
    3 opponents: create 3 Angel tokens. Each attacks a different opponent.
    Each Angel token ETB: trigger fires → return a permanent card from GY to battlefield!
    3 ETB triggers from 3 tokens = return 3 permanents from GY.
    Each token: 5/5 Flying Lifelink, attacks an opponent for 5 damage + lifelink.
    At end of turn: sacrifice all 3 tokens.
    Note: Toxrill the Corrosive ({5}{B}{B}, 7/7) does NOT have encore — it's a common misconception.

BLITZ (702.152):
  THREE ABILITIES (similar to Dash, P397):
    1. Alternative cost: pay blitz cost instead of normal cost.
    2. If blitz cost paid: sacrifice this permanent at the beginning of the next end step
       (delayed triggered ability).
    3. While blitz cost was paid: it has haste + "when this permanent is put into a GY from the
       battlefield, draw a card."
  BLITZ VS. DASH (comparison to P397):
    Dash: sacrifice → returned to hand. Blitz: sacrifice → go to GY + draw a card.
    Dash is reusable (returns to hand). Blitz is one-time (goes to GY, but you draw).
    Dash has haste. Blitz has haste + "when dies draw a card."
    Both sacrifice at the beginning of the NEXT end step (not cleanup).
  THE DRAW TRIGGER:
    "When this permanent is put into a graveyard from the battlefield, draw a card."
    This fires when the creature is sacrificed at the beginning of the next end step.
    It fires on ANY death, not just sacrifice. If the blitzed creature is killed by removal:
      It still draws a card when it goes to the GY (the draw ability is always present while blitz was paid).
    This means: blitz creatures are resilient — even if killed, you draw.
  BLITZ SACRIFICE IS MANDATORY:
    "Sacrifice the permanent this spell becomes at the beginning of the next end step."
    This is a delayed triggered ability: mandatory. Not optional.
    You MUST sacrifice it at the beginning of the next end step (if it's still on the battlefield).
    If it's already dead (killed by opponent or by combat): the delayed trigger fires but can't sacrifice
      (creature is already in GY). The draw trigger already fired when it died.
  EXAMPLE — NIGHT CLUBBER:
    Night Clubber ({1}{B}{B}: 2/2, blitz {2}{B}, "when this enters, creatures your opponents control
      get -1/-1 until end of turn"):
      Normal cast ({1}{B}{B}): 2/2. ETB fires (-1/-1 to opponents' creatures). No haste. Stays.
      Blitz cast ({2}{B}): 2/2 with haste. ETB fires. Sacrifice at next end step. Draw when dies.
      Note: Ob Nixilis, the Adversary is a PLANESWALKER (not a creature) with Casualty X — it does
        NOT have Blitz. Cemetery Gatekeeper ({1}{R}: 2/1 first strike) also has no Blitz.

CASUALTY (702.153):
  TWO ABILITIES:
    1. Static (on stack): "As an additional cost to cast, you may sacrifice a creature with power N+."
    2. Triggered (on stack): "When you cast this spell, if a casualty cost was paid, copy it."
  KEY: CASUALTY IS OPTIONAL:
    "You MAY sacrifice." You don't have to. If you don't: no copy.
    Only if you pay the sacrifice: the copy is created.
  THE COPY:
    "Copy it. If the spell has any targets, you may choose new targets for the copy."
    This creates a copy of the spell on the stack (not a cast event — no casualty triggers again).
    The copy is not a new spell being cast. No second casualty. No prowess.
      Wait: Prowess fires on casting (702.108a: "whenever you cast a noncreature spell").
      The copy is not cast — it's created by the trigger. Prowess doesn't trigger for the copy.
    The copy can have new targets. Or the same targets.
    If the spell has no targets: the copy has no target choices.
  CASUALTY N — THE SACRIFICE REQUIREMENT:
    "Sacrifice a creature with power N or greater."
    If no creature qualifies: can't pay the casualty cost. The spell is cast normally without the copy.
    You can sacrifice a creature with higher power (just needs to be ≥ N).
    You can sacrifice the creature to get something valuable in GY (Persist, Undying, Afterlife, etc.).
    Sacrificing something with Afterlife: you get spirits AND the spell copy. Combo!
  EXAMPLE — OB NIXILIS, THE ADVERSARY:
    Ob Nixilis, the Adversary ({1}{B}{R}: Planeswalker, Casualty X):
    IMPORTANT: Ob Nixilis is a Planeswalker (not a creature). Casualty X means you sacrifice a
      creature with power X, and the copy becomes a non-legendary token planeswalker with starting
      loyalty X. So if you sacrifice a 3-power creature: the copy has 3 starting loyalty.
    Original + copy both enter. Two Ob Nixilis planeswalkers on the battlefield.
    The copy is non-legendary (explicitly in its casualty text): "the copy isn't legendary."
    So the legend rule does NOT apply to the casualty copy! Both stay.
    Both Ob Nixilises generate loyalty abilities separately each turn.

ENLIST (702.154):
  WHAT IT IS:
    Static + triggered ability. "As this creature attacks..."
    You may tap one untapped creature you control that:
      - Didn't choose to attack (non-attacker)
      - Either has haste OR has been under your control continuously since this turn began
    When you tap it: the enlisting creature gets +X/+0 until EOT (X = tapped creature's power).
  THE HASTE/CONTINUOUS CONDITION:
    "Has haste" = can tap regardless of when it entered.
    "Has been under your control continuously since this turn began" = not summoning sick.
    Summary: you can tap untapped non-attackers that can legally tap.
    Summoning-sick creatures (entered this turn) without haste: can't be enlisted.
  THE TAPPING:
    Tapping the enlisted creature is a cost of the enlist ability (as an attack cost).
    This uses up the creature for the turn. It can't tap again for other effects.
    But: the creature stays on the battlefield. It can block next turn (after untapping).
  EXAMPLE:
    Platoon Dispenser ({5}{W}: 5/5, enlist, "at end of step, if three or more creatures
      you control attacked this turn, create a 1/1 Soldier token"):
    Actually, let me use a simpler example.
    Any 3/3 with enlist attacks. You have a 4/4 non-attacker.
    Enlist: tap the 4/4. The 3/3 gets +4/+0 until EOT → 7/3.
    Attack with the 7/3. Opponent's 6/6 blocks. 7 > 6 → first strike kills the blocker before damage?
      Not with first strike (enlist doesn't grant first strike). Just 7 power vs. 6 toughness.
    7 damage kills the 6/6 (toughness 6). The 3/3 takes 6 damage (toughness 3), dies in regular combat.
    Enlist sacrificed both attackers but eliminated a blocker.
```

## Definitive Conclusions

- **Encore creates one token per opponent** (not per creature) — in Commander with 3 opponents, encore creates 3 tokens; in 1v1, just 1; tokens must attack (if able) and are sacrificed at end of step.
- **Blitz creatures draw a card on death** (not just on sacrifice) — if killed by removal before end step, the "when put into GY" trigger still fires; the sacrifice at end step is mandatory.
- **Casualty's copy is NOT a cast event** — it's created by a triggered ability, not a new spell being cast; prowess doesn't trigger; the copy can have new targets chosen or reuse the original targets.
- **Enlist taps a non-attacking creature** — the tapped creature must have haste or been under your control since the turn began; the power boost is until end of turn; the tapped creature is unavailable for the rest of the turn.
- **Blitz and encore both sacrifice at the next end step** — mandatory delayed triggers; if already dead before end step, the delayed trigger fizzles.

## Canonical Example
**Angel of Indemnity Encore in Commander:**
Angel of Indemnity ({5}{W}: 5/5 Flying Lifelink, "When this creature enters, return target permanent card with mana value 4 or less from your graveyard to the battlefield. Encore {6}{W}{W}"):
Note: Toxrill, the Corrosive does NOT have Encore — it's a 7/7 {5}{B}{B} with slime counters.

Angel of Indemnity has died and is in your GY. You have {6}{W}{W} available. 3 opponents in Commander.
Activate encore: pay {6}{W}{W}, exile Angel of Indemnity.
Create 3 tokens, each a copy of Angel of Indemnity (5/5 Flying Lifelink):
  Token 1 attacks Player B.
  Token 2 attacks Player C.
  Token 3 attacks Player D.
All three tokens have haste.

Each token enters the battlefield → ETB fires: return a permanent card (MV ≤ 4) from your GY.
3 tokens → 3 ETB triggers → return 3 different permanents from your GY to the battlefield.

Combat: each 5/5 lifelink token attacks a different opponent for 5 damage.
If all 3 attacks hit: 15 total damage dealt, 15 life gained from lifelink.

Beginning of your next end step: sacrifice all 3 tokens.
Delayed trigger: "sacrifice the tokens at the beginning of the next end step."

**Example 2 — Ob Nixilis, the Adversary Casualty:**
Ob Nixilis, the Adversary ({1}{B}{R}: Planeswalker, Casualty X, "+1: each opponent loses 2 life unless they discard a card..."):
Ob Nixilis is a PLANESWALKER, not a creature. Casualty X: sacrifice a creature with power X.
The copy becomes a non-legendary token planeswalker with starting loyalty X (so it's NOT removed by the legend rule).

You have: Ob Nixilis in hand, {1}{B}{R} available, and a 3/3 creature in play.

Casualty X=3: pay {1}{B}{R} as normal cost + sacrifice the 3/3.
Casualty trigger fires: copy Ob Nixilis. The copy is a non-legendary token planeswalker with 3 starting loyalty.
Stack: Ob Nixilis original (top), Ob Nixilis copy (below).

Both resolve: original enters with its printed starting loyalty. Copy enters with 3 loyalty (as set by casualty).
Neither is removed by legend rule (the copy is non-legendary by the casualty wording).
Both can use loyalty abilities each turn.

Net: for {1}{B}{R} + one 3-power creature, you get TWO planeswalkers — the original and a 3-loyalty token copy.

## Commonly Confused With
- **P392 (Myriad)** — Encore and myriad both create tokens that attack each opponent. Encore uses a GY activation (after the creature is dead); myriad uses a living creature's combat trigger. Both exile/sacrifice the tokens after combat.
- **P397 (Prowess/Dash/Dethrone)** — Blitz is similar to dash: both use alternative costs that give haste and a "sacrifice at end step" effect. Dash returns to hand; blitz goes to GY and draws. Both have mandatory end-step sacrifice.
- **P393 (Extort/Exploit/Scavenge)** — Casualty sacrifices a creature for a bonus (copy of the spell). Exploit sacrifices a creature for a triggered ETB benefit. Both involve creature sacrifice for value, but on very different card types (casualty: spells; exploit: creature ETB).
- **P399 (Crew/Fabricate)** — Enlist taps a non-attacker for a power bonus. Crew taps creatures to animate a Vehicle. Both involve tapping creatures for combat purposes, but crew animates a Vehicle; enlist boosts an already-attacking creature's power.
