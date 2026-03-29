---
id: p245
name: Evoke — Alternative Cost With Mandatory Sacrifice on Entry
category: costs
cr_refs: [702.74a]
tags: [evoke, alternative-cost, sacrifice, ETB, Lorwyn, Mulldrifter, Shriekmaw, Cloudthresher, Ephemerate]
created: 2026-03-28
examples_count: 2
---

# P245 — Evoke — Alternative Cost With Mandatory Sacrifice on Entry

## Abstract
Evoke is an alternative cost keyword representing two abilities: a static ability allowing you to cast the creature for the evoke cost instead of its normal mana cost, and a triggered ability that forces you to sacrifice it if the evoke cost was paid. This creates a "cast for cheap but sacrifice immediately" mode — you get the ETB trigger for a discounted price but lose the creature. Evoke is primarily about ETBs: pay the evoke cost, get the effect, sacrifice the creature. The critical rules interaction is that the sacrifice trigger can be responded to — the creature briefly exists on the battlefield and can be blinked, bounced, or otherwise interfered with before the sacrifice resolves. Mulldrifter (evoke for 5 draw 2) and Shriekmaw (evoke for 2 destroy non-artifact non-black creature) are premier evoke cards.

## The Definitive Rules

**CR 702.74a** (verbatim): *"Evoke represents two abilities: a static ability that functions in any zone from which the card with evoke can be cast and a triggered ability that functions on the battlefield. 'Evoke [cost]' means 'You may cast this card by paying [cost] rather than paying its mana cost' and 'When this permanent enters, if its evoke cost was paid, its controller sacrifices it.' Casting a spell for its evoke cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
EVOKE:
  Alternative cost: you MAY cast for [evoke cost] instead of normal mana cost
  If evoked (evoke cost paid): a triggered ability fires when it enters the battlefield
  The trigger: "when this permanent enters, if its evoke cost was paid, its controller sacrifices it."

EVOKE + ETB SEQUENCE:
  1. Cast for evoke cost (alternative cost)
  2. Spell resolves: permanent enters the battlefield
  3. ETB triggers fire (like drawing from Mulldrifter)
  4. ALSO triggers: "sacrifice this creature" (the evoke trigger)
  5. Both ETB and evoke-sacrifice go on the stack
  6. ETB resolves first (LIFO): draw 2 cards (or destroy a creature, etc.)
  7. Evoke-sacrifice resolves: sacrifice the creature
  Net: ETB effect for the evoke cost, creature gone

EVOKE + SACRIFICE TRIGGER RESPONSE:
  The evoke sacrifice is a TRIGGERED ABILITY (not a cost)
  Between the ETB and the sacrifice trigger: opponent has priority
  They can: counter the sacrifice trigger (Stifle, Disallow), or you can respond
  Before the evoke sacrifice resolves: the creature IS on the battlefield
  You can: blink it (exile and return — it re-enters as a non-evoked creature with full duration)
  Ephemerate + Mulldrifter on evoke: ETB fires (draw 2), Ephemerate blinks it (exile+return), evoke sacrifice trigger still resolves (targeting the OLD object in GY)
    Wait: when a permanent leaves and returns, it's a NEW object
    The evoke sacrifice trigger was targeting the OLD object
    Old object is now in GY (blinked away): the trigger has no legal target... does it fizzle?
    Actually: Ephemerate says "exile, then return" — the return puts it on battlefield as a NEW creature
    The evoke sacrifice trigger targets "this permanent" — it was on the stack when the creature blinked
    When trigger resolves: it looks for the permanent with that trigger... but the creature returned is a NEW object
    The trigger fizzles (no valid sacrifice target matching the triggered creature's original identity)
    Result: Mulldrifter draws 2, blinks (draws 2 AGAIN on rebound if Ephemerate has rebound), evoke sacrifice fizzles
    You keep the Mulldrifter! ETB twice + keep the creature.

EVOKE + COST COMPARISON:
  Mulldrifter ({4}{U}): 2/2 flying, "when enters, draw 2 cards." Evoke {2}{U}.
    Full cost: {4}{U} = 5 mana → persistent 2/2 flier + draw 2
    Evoke: {2}{U} = 3 mana → draw 2, sacrifice immediately (no persistent creature)
    Trade: pay 2 less mana, lose the creature
    In tempo: {2}{U} for draw 2 is efficient (Divination is {2}{U} = draw 2, instant vs sorcery)
    Evoke Mulldrifter = Divination that happens to be a creature spell on the stack

  Shriekmaw ({4}{B}): 3/2 Fear, "when enters, destroy target nonartifact nonblack creature." Evoke {1}{B}.
    Full cost: {4}{B} = 5 mana → persistent 3/2 + kill something
    Evoke: {1}{B} = 2 mana → kill a creature, sacrifice Shriekmaw
    {1}{B} for "destroy target nonartifact nonblack creature" is extremely efficient removal
    Compare: Terror ({1}{B}) = destroy nonartifact nonblack creature. Same price, same restriction.
    Evoked Shriekmaw IS basically Terror that also happens to be a creature spell (relevant for cascade, etc.)

  Cloudthresher ({2}{G}{G}{G}{G}): 7/7 Flash Reach, "when enters, deals 2 damage to each creature with flying and each opponent." Evoke {2}{G}.
    Evoke {2}{G} = 3 mana → deals 2 damage to each flier and each opponent. Free mass-damage.
    Anti-flying board wipe for 3 mana.

EVOKE + LEAVES-THE-BATTLEFIELD TRIGGER:
  If a creature had a leaves-the-battlefield ability and is evoked:
  The evoke sacrifice is a sacrifice: the creature leaves the battlefield
  LTB triggers fire when it sacrifices (due to evoke)
  These triggers resolve as normal

EVOKE + "ENTERS FOR FREE" EFFECTS:
  If you somehow get to cast an evoke creature for free (e.g., Cascade into an evoke creature):
  The cascade lets you cast it WITHOUT paying its mana cost
  Casting without paying mana cost is NOT the evoke cost
  So the evoke trigger does NOT fire (it was not evoked)
  You get the full creature without the sacrifice!
  BUT: ETB still fires. And you paid nothing. Efficient.
```

## Definitive Conclusions

- **Evoke is an alternative cost** — pay it instead of the normal mana cost.
- **The sacrifice is a triggered ability** — the creature briefly exists on the battlefield before sacrificing.
- **Blink the creature before the sacrifice resolves** — the sacrifice trigger targets the old (now-gone) object; it fizzles.
- **Evoke ≠ casting without paying mana cost** — cascade/other free casts don't trigger the evoke sacrifice.
- **Shriekmaw and Mulldrifter** are premier evoke cards: efficient removal and card draw at reduced cost.

## Canonical Example
**Mulldrifter + Ephemerate (ETB Loop):**
Turn 3. Cast Mulldrifter ({4}{U}) for its evoke cost {2}{U}.
Mulldrifter enters: two triggers go on stack:
  (A) ETB: "draw 2 cards"
  (B) Evoke: "sacrifice Mulldrifter"
Respond to trigger stack: cast Ephemerate ({W}) targeting Mulldrifter. Ephemerate is an instant: "exile target creature you control, return it to the battlefield under its owner's control. Rebound."
Stack (LIFO): Ephemerate resolves first → Mulldrifter exiled and returned immediately as a NEW permanent.
Now the stack has: (A) ETB draw 2, (B) Evoke sacrifice [old object], (C) NEW ETB draw 2 [from the rebounded blink].
Resolve (A): draw 2.
Resolve (B): sacrifice "the evoked creature" — but that object is gone (it was blinked). The trigger has no valid target: fizzles.
Mulldrifter is still on the battlefield!
Next turn: Rebound of Ephemerate fires: blink Mulldrifter AGAIN → ETB draw 2.
Net: 3× "draw 2" (turns 1 and 2) + persistent 2/2 flier for {2}{U}{W} + {W}.

**Example 2 — Shriekmaw as Removal:**
Opponent controls Thragtusk (5/3, lifelink).
Cast Shriekmaw for its evoke cost {1}{B}: Shriekmaw enters.
ETB: "destroy target nonartifact nonblack creature." Target: Thragtusk. Destroy it.
Evoke sacrifice trigger: sacrifice Shriekmaw.
Net: {1}{B} destroyed their 5/3. Efficient.
Without evoke: {4}{B} for a 3/2 Fear with the ETB — more mana but persistent threat.
Evoke is optimal when you need instant effect without tempo investment.

## Commonly Confused With
- **P161 (Dash)** — Dash returns to hand at end step; Evoke sacrifices on entry. Both are alternative costs for temporary creature effects.
- **P176 (Blitz)** — Blitz sacrifices at END STEP and draws a card; Evoke sacrifices immediately upon entry (no haste, no draw built-in).
- **P212 (Madness)** — Madness casts from discard exile at reduced cost; Evoke is an alternative casting cost on the spell itself.
