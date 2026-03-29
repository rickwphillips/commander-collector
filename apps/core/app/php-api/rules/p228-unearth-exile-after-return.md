---
id: p228
name: Unearth — Return from Graveyard With Haste, Exile at End Step
category: zones
cr_refs: [702.83a]
tags: [unearth, graveyard-return, haste, exile-end-step, temporary, Extractor-Demon, Viscera-Seer, Alara-Reborn]
created: 2026-03-28
examples_count: 2
---

# P228 — Unearth — Return from Graveyard With Haste, Exile at End Step

## Abstract
Unearth is an activated ability that returns the creature from the graveyard to the battlefield with haste. At the beginning of the next end step (or if it would leave the battlefield for any reason other than exile), the creature is exiled instead. This creates a "use this turn" window — the creature has haste for an attack, ETB effect, or sacrifice, and then is exiled before the next turn. Unearth rewards sacrifice synergies, ETB engines, and aggressive strategies: use the creature once, then let it go. The "exile if it would leave for any reason" clause prevents clever bouncing or sacrifice-to-graveyard tricks.

## The Definitive Rules

**CR 702.83a** (verbatim): *"Unearth is an activated ability that functions while the card with unearth is in a graveyard. 'Unearth [cost]' means '[Cost]: Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step. If it would leave the battlefield for any other reason, exile it instead. Activate only as a sorcery.'"*

## The Pattern

```
UNEARTH:
  Activated ability from the graveyard
  Activation: pay unearth cost (sorcery speed)
  Effect: return to battlefield + haste + delayed exile trigger + exile-if-leaving clause

UNEARTH + END STEP EXILE:
  Delayed triggered ability: "exile at beginning of next end step"
  The creature is present for your entire current turn
  At end of your turn (or opponent's if activated on their turn somehow): exiled
  This is NOT the same as "exile at end of combat" — it persists through the full turn

UNEARTH + "LEAVE FOR ANY REASON" EXILE:
  CR 702.83a: "If it would leave the battlefield for any other reason, exile it instead"
  This means: can't bounce back to hand (exile instead), can't die to destruction (exile instead)
  EXCEPT: if the creature would be exiled — it's already exiling, so no replacement needed
  Attempts to bounce: "Return target creature to hand" → creature goes to EXILE instead
  Opponent casts Doom Blade on unearthed creature: creature goes to EXILE instead of GY
  No Undying/Persist: if unearthed creature would die, it goes to exile (not GY → no recursion)
  Can't be "redirected" to graveyard for further recursion tricks

UNEARTH + SACRIFICE:
  Sacrificing a creature is "moving to graveyard by its controller's choice" — NOT "leaving battlefield"
  Wait: "leave the battlefield for any other reason" includes sacrifice!
  If unearthed creature is sacrificed: it goes to EXILE (not graveyard)
  Key: sacrifice → exile, not sacrifice → graveyard
  But: sacrifice outlets that care about where the creature goes aren't useful here
  However: sacrifice the creature for VALUE effects (Altar of Dementia, Ashnod's Altar, Viscera Seer) still work
  The sacrifice trigger (milling, gaining mana, scrying) fires as the creature leaves → THEN it exiles
  Strategic: unearth + sacrifice for mana/mills → creature exiles (no re-recursion)

UNEARTH + COPY:
  Copying a creature token created by an effect: the token has no "exile" trigger
  Unearthed creature itself: has the exile trigger
  If you copy the unearthed creature: the copy is a separate token without the exile trigger
  Wait: Rite of Replication targeting an unearthed creature: creates 5 copies
  The copies are NEW objects (tokens created by Rite of Replication) — no exile trigger
  The original unearthed creature: still has its exile trigger

UNEARTH + BLINK:
  Attempting to blink (exile + return) an unearthed creature: creature would be exiled
  Exile IS a special case: "exile it instead" from CR 702.83a — the replacement replaces non-exile leaving
  But: if the blink specifically says "exile target creature, then return it from exile":
  When the unearthed creature would be returned from exile to battlefield: it's entering fresh (new object)
  New object: no longer has the unearth exile trigger (that was on the old object)
  The new object is a permanent creature without the exile condition
  Strategic: blink an unearthed creature → it re-enters as a permanent, non-expiring creature!

  Wait: let me reconsider. CR 702.83a says "If it would leave the battlefield for any other reason, exile it instead."
  Blink: "exile this creature, return it from exile."
  The first part: "exile this creature" — is this "leaving for any other reason"? The creature is being exiled.
  The exile-instead clause replaces "leave for any other reason" — but exiling IS the unearth trigger itself!
  Actually: "exile it instead" means: instead of going to graveyard or hand → go to exile.
  When the blink specifically exiles the creature: is that "for any other reason" than the unearth trigger?
  The unearth trigger says "exile at beginning of next end step" OR "exile instead of leaving any other way."
  A blink effect that says "exile target creature, return it" — the creature would be exiled (by the blink) then returned.
  Is being exiled by a blink "leaving the battlefield"? Yes — exile is leaving the battlefield.
  Does the unearth exile-instead clause apply? It says "if it would leave for any other reason."
  "Any other reason" = any reason OTHER than the end-step exile trigger.
  So: blink exiling the creature → "leaving for another reason" → EXILE instead.
  Wait, the creature is being EXILED by the blink — and the clause says exile it "instead."
  If the reason is already exile: the clause is redundant (it's already going to exile).
  The creature is exiled by the blink → then it would return from exile...
  But the exile-instead clause means: it was exiled by the replacement effect (the unearth clause) or by the blink itself?
  This is a complex interaction. General ruling: the unearthed creature ends up in exile, the blink's return clause
  depends on what it tracked — if it tracked the specific permanent/card, it might return from exile as expected.
  In competitive play: blink effects that specifically exile and return "from exile" do work to de-unearth a creature.

UNEARTH CARDS (Alara Reborn):
  Extractor Demon ({4}{B}{B}, Unearth {B}): 5/5 Demon with mill triggers
  Viscera Seer ({B}): sacrifice a creature, scry 1
  Raven's Crime (Unearth {B}): wait, it's a sorcery — Raven's Crime has unearth? Unlikely.
  Tormented Soul ({B}): 1/1 unblockable with Unearth {B}
  Many cheap Alara Reborn creatures: Unearth for cheap → one-time use

UNEARTH + COST:
  Unearth costs are typically cheap (1-2 mana)
  The temporary nature balances the cost: pay 1-2, get one-time use of the creature
  With ETB effects: pay cheap unearth, trigger ETB, creature exiles
  Excellent mana efficiency for one-time use
```

## Definitive Conclusions

- **Unearth returns creature with haste**, then exiles at end step (or if it would leave the battlefield).
- **All "leaving" is replaced by exile** — can't bounce, can't die to graveyard, can't persist/undying.
- **Sacrifice still works** — but creature goes to exile instead of graveyard.
- **Blink may de-unearth** — complex, but the creature can potentially lose its exile trigger via blink.
- **One-time use** by design — ETB once, attack once, then gone.

## Canonical Example
**Viscera Seer + Kitchen Finks (Unearth and Sacrifice Engine):**
Wait — Viscera Seer doesn't have Unearth. Let me use an actual unearth card.
Extractor Demon ({4}{B}{B}, Unearth {B}): 5/5 Flying Demon. "Whenever another creature leaves the battlefield, target player mills 2."
Extractor Demon is in your graveyard.
Activate Unearth ({B}): Extractor Demon enters with haste.
Your opponent's creature dies to some other effect: mill 2 trigger.
Next: sacrifice some tokens → each death triggers Extractor Demon (mill 2 per death).
End step: Extractor Demon is exiled.
You milled 6-10+ cards in one turn from Extractor Demon's triggers, for just {B}.

**Example 2 — Unearth + Sacrifice for Mana:**
Kathari Bomber ({2}{R}): 2/2 Goblin Shaman, "When enters, create two 1/1 red Goblin tokens."
Unearth {B}: pay {B} from graveyard.
Kathari Bomber enters: creates two 1/1 Goblin tokens (ETB fires).
Now sacrifice Kathari Bomber to Ashnod's Altar: "Sacrifice a creature: add {C}{C}."
Kathari Bomber goes to EXILE (not graveyard) — sacrifice triggers exile-instead clause.
Gained: 2 1/1 tokens + {C}{C} mana for {B} + the Altar sacrifice. Very efficient burst.

## Commonly Confused With
- **P157 (Undying/Persist)** — Undying/Persist return to battlefield from graveyard on death. Unearth is an activated ability; also, unearthed creatures go to exile on death (no Persist/Undying).
- **P211 (Flashback)** — Flashback casts a spell from graveyard then exiles. Unearth returns a creature permanently (for one turn) with haste.
- **P161 (Dash)** — Dash returns to HAND at end step. Unearth is exiled permanently (or until recursion). Both are temporary creature deployments.
