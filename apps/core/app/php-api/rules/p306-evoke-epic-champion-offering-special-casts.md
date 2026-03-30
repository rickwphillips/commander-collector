---
id: p306
name: Evoke, Epic, Champion, and Offering — Sacrifice-Triggered and Lock Casting Mechanics
category: costs
cr_refs: [702.74a, 702.50a, 702.50b, 702.72a, 702.72b, 702.48a, 702.48b]
tags: [evoke, epic, champion, offering, alternative-cost, sacrifice-on-enter, no-more-spells, exile-champion, Lorwyn, Kamigawa-block, Mulldrifter, Ingot-Chewer, Enduring-Ideal, Mistform-Ultimus]
created: 2026-03-29
examples_count: 2
---

# P306 — Evoke, Epic, Champion, and Offering — Sacrifice-Triggered and Lock Casting Mechanics

## Abstract
Four related but distinct mechanics involving special casting conditions or sacrifice requirements. **Evoke** provides a cheaper alternative cost to cast a creature, then sacrifices it immediately when it enters — great for ETB effects without keeping the creature. **Epic** resolves once and then locks the caster out of casting spells forever, but copies the epic spell at every upkeep. **Champion** exiles another creature when the champion enters (returning it if the champion leaves). **Offering** is an alternative-cost mechanic from Kamigawa that lets you sacrifice a matching creature to reduce the spell's cost and flash it in.

## The Definitive Rules

**CR 702.74a** (verbatim): *"Evoke represents two abilities: a static ability that functions in any zone from which the card with evoke can be cast and a triggered ability that functions on the battlefield. 'Evoke [cost]' means 'You may cast this card by paying [cost] rather than paying its mana cost' and 'When this permanent enters, if its evoke cost was paid, its controller sacrifices it.'"*

**CR 702.50a** (verbatim): *"Epic represents two spell abilities, one of which creates a delayed triggered ability. 'Epic' means 'For the rest of the game, you can't cast spells,' and 'At the beginning of each of your upkeeps for the rest of the game, copy this spell except for its epic ability. If the spell has any targets, you may choose new targets for the copy.'"*

**CR 702.72a** (verbatim): *"Champion represents two triggered abilities. 'Champion an [object]' means 'When this permanent enters, sacrifice it unless you exile another [object] you control' and 'When this permanent leaves the battlefield, return the exiled card to the battlefield under its owner's control.'"*

**CR 702.48a** (verbatim): *"Offering is a static ability that functions while the spell with offering is on the stack. '[Quality] offering' means 'As an additional cost to cast this spell, you may sacrifice a [quality] permanent. If you chose to pay the additional cost, this spell's total cost is reduced by the sacrificed permanent's mana cost, and you may cast this spell any time you could cast an instant.'"*

## The Pattern

```
EVOKE:
  Alternative cost: pay evoke cost instead of mana cost (cheaper)
  Triggered ability on ETB: "if evoke cost was paid, sacrifice this permanent"
  The sacrifice trigger goes on the stack after the permanent enters
  Opponent can respond to the permanent being on the battlefield before the sacrifice trigger resolves
  But: the permanent's ETB trigger also fires at the same time as the sacrifice trigger
  ETB and sacrifice triggers: both go on the stack together (APNAP order if needed)

  EVOKE FLOW:
    You cast the creature for the evoke cost.
    Creature enters the battlefield.
    Simultaneously: ETB trigger fires AND sacrifice trigger fires (both from the enters event).
    Stack: sacrifice trigger first? Or ETB first?
    Both are triggered abilities from the same event → go on stack in APNAP order.
    The creature's controller chooses the order for their own triggers.
    Choose: ETB first, then sacrifice.
    ETB resolves → effect happens.
    Sacrifice trigger resolves → you sacrifice the creature.
    Result: ETB effect happened, creature is gone.

  EVOKE NOTABLE CARDS (Lorwyn):
    Mulldrifter ({4}{U}): 2/2 Flying. Evoke {2}{U}. "When ETBs, draw 2 cards."
      Normal cast for {4}{U}: get a 2/2 flier that drew 2 cards. Total cost: 5 mana.
      Evoke for {2}{U}: draw 2 cards, then sacrifice Mulldrifter. Net: 3 mana for draw 2.
      Mulldrifter evoked = Divination ({2}{U}) + a 2/2 body for one turn.
      But: you choose to evoke when you want the draw without the body.
      Common: evoke in mid-game for pure card advantage; cast normally in late game for board presence.

    Ingot Chewer ({3}{R}): 3/3. Evoke {R}. "When ETBs, destroy target artifact."
      Normal cost: {3}{R} = 4 mana for a 3/3 + destroy artifact.
      Evoke for {R}: destroy artifact, sacrifice Ingot Chewer. Net: {R} for Shatter effect.
      One of the cheapest artifact removal spells in the game (Shatter costs {1}{R}).
      Ingot Chewer evoked is BETTER than Shatter (cheaper), in a creature deck with 4 Ingot Chewers.

    Spitebellows ({5}{R}): 6/1 Trample. Evoke {1}{R}{R}. "When this creature leaves the battlefield,
      it deals 6 damage to target creature."
      On evoke, the sacrifice trigger causes it to leave the battlefield.
      Evoke {1}{R}{R}: Spitebellows enters, sacrifice trigger fires, it's sacrificed.
      "When Spitebellows leaves the battlefield" → deals 6 damage to target creature.
      Net: {1}{R}{R} for 6 damage to a creature. A 3-mana creature-kill effect.
      Note: only targets creatures — can't redirect to a player or planeswalker.

  EVOKE + RESPONSE:
    After evoke creature enters: before sacrifice trigger resolves, opponent can interact.
    Opponent can't stop ETB (it's a trigger from entering, no response before it resolves).
    But: after ETB resolves, before sacrifice, opponent can target the creature.
    If opponent plays removal after ETB resolves: creature dies from removal, not sacrifice.
    Sacrifice trigger is still on the stack but the permanent is gone → sacrifice does nothing extra.
    The creature is already dead.

EPIC:
  When a spell with Epic resolves:
    (A) "For the rest of the game, you can't cast spells."
    (B) Delayed trigger created: at the beginning of each of your upkeeps for the rest of the game,
        copy this spell (without the epic ability). Choose new targets if desired.
  After casting an Epic spell: that player can NEVER cast another spell for the rest of that game.
  They can still: activate abilities, trigger abilities, use special actions, use mana abilities.
  The upkeep copies are effects (not cast): they go on the stack as copies.

  EPIC NOTABLE CARDS (Saviors of Kamigawa):
    Enduring Ideal ({5}{W}{W}): Epic. "Search your library for an Aura enchantment card and put it
      onto the battlefield, attached to a creature you control."
    After casting: every upkeep, you put another Aura onto the battlefield for free.
    You can never cast again, but you build up a fortress of enchantments on your creatures each turn.
    In a dedicated enchantment deck: reach a game-winning state by turn 10-12 with multiple powerful Auras.

    Eternal Dominion ({7}{U}{U}): Epic. "Search target opponent's library for an artifact, creature,
      or land and put it into play."
    Every upkeep: steal a permanent from an opponent's library (not even their hand — their library!).
    Price: you can't cast spells ever again. One card per upkeep from their deck.

  EPIC + REALITY:
    Casting an Epic spell is usually a "win or lose" gambit.
    If the position is already winning: Epic cements the win without needing more spells.
    If the position is losing: Epic might not save you (can't respond to threats with spells).
    Epic decks: combo decks that set up the Epic condition and then win by sticking it.

CHAMPION:
  On enter: "Sacrifice this unless you exile another [object] you control."
  The "other object" is exiled to "champion" the champion.
  If champion leaves battlefield: return the exiled card to play.
  Linked abilities: the exile and the return are linked (the champion's card knows what it exiled).

  CHAMPION USAGE:
    Championed creature is "phased out" in exile — it returns when the champion leaves.
    Champion is typically used to put a powerful creature into play while "storing" another temporarily.
    Some combinations: champion a token (lose nothing valuable) to get a powerful creature.

  CHAMPION NOTABLE CARDS (Lorwyn):
    Cloudthresher ({2}{G}{G}{G}{G}): 7/7 Reach. Flash. "When ETBs, deals 2 damage to each flier and player."
      Not Champion. Let me use actual champion cards.

    Changeling Berserker ({3}{R}): 5/3 Haste. Champion a creature.
      On enter: sacrifice unless you exile another creature you control.
      That creature is exiled while Changeling Berserker is in play.
      If Changeling Berserker dies: the championed creature returns.
      Use case: champion a 1/1 token to get a free 5/3 Haste. Token returns when Berserker dies.

    Changeling Berserker ({3}{R}) can champion any creature type because it has Changeling (every
      creature type). Use Mistform Ultimus ({3}{U}: 3/3, "Mistform Ultimus is every creature type")
      as the championed creature — but Mistform Ultimus itself does NOT have Champion.
      Example: champion Mistform Ultimus with Changeling Berserker → the Illusion is exiled.
      When Berserker dies: Mistform Ultimus returns.

  CHAMPION EDGE CASE — NO LEGAL CHAMPION TARGET:
    If no valid target exists when champion triggers: the champion is sacrificed.
    "Sacrifice it unless you exile another [object]" — if you can't exile one, sacrifice occurs.
    No creatures to champion? The champion permanently sacrifices itself.

OFFERING:
  Quality offering (e.g., "Goblin offering"): when casting, you may sacrifice a [quality] creature.
  If you do:
    (A) Cost is reduced by the sacrificed creature's mana cost.
    (B) You may cast it ANY TIME you could cast an instant (flash-like timing).
  The offering is an additional cost if you choose to use it.

  OFFERING EXAMPLES (Kamigawa block):
    Myojin of Seeing Winds ({7}{U}{U}{U}): Spirit. Spirit offering.
      Pay {7}{U}{U}{U} normally (expensive) OR sacrifice a Spirit + cost reduced by that Spirit's mana cost.
      Sacrifice Ninja of the Deep Hours ({2}{U}): offering reduces {7}{U}{U}{U} by {2}{U} = {5}{U}{U}.
      Now castable at instant speed for {5}{U}{U}. Flash timing is the main bonus.
      Useful in control: keep mana open, cast Spirit at opponent's end step.
```

## Definitive Conclusions

- **Evoke's ETB trigger and sacrifice trigger both go on the stack** — controller stacks them, ETB resolves first.
- **Epic permanently locks you out of casting spells** — but the upkeep copy fires every turn, giving ongoing value.
- **Champion sacrifices itself if no valid target exists** — the "champion" and the "return" triggers are linked.
- **Offering reduces cost by the sacrificed permanent's mana cost AND grants instant-speed casting** — both benefits apply.
- **Evoked creatures can respond to: opponent has a window between ETB and sacrifice trigger resolving**.

## Canonical Example
**Mulldrifter Evoke for Pure Card Draw:**
Turn 3 in Standard. Opponent is threatening with aggro. You need cards.
Mana: {2}{U}. Hand: Mulldrifter.
Cast Mulldrifter for its evoke cost {2}{U}. Mulldrifter enters.
Two triggered abilities fire simultaneously:
  - "When Mulldrifter enters, draw 2 cards" (ETB)
  - "When Mulldrifter enters, if evoke was paid, sacrifice it" (evoke)
Stack (you choose order): ETB trigger on top, sacrifice trigger below.
ETB resolves: draw 2 cards.
Sacrifice trigger resolves: sacrifice Mulldrifter.
Net: {2}{U} = draw 2 cards. Mulldrifter is gone.
Compare: if opponent responded to the ETB with removal targeting Mulldrifter (e.g., Path to Exile):
  - Stack: Opponent's Path to Exile on top.
  - Path resolves: Mulldrifter exiled (leaving battlefield).
  - ETB trigger resolves: draw 2 cards (trigger was already on the stack).
  - Sacrifice trigger: Mulldrifter is already gone → trigger does nothing.
  - Mulldrifter is exiled anyway, and you drew 2 cards.

**Example 2 — Enduring Ideal Epic Lock:**
Turn 8. Board: several Auras already on creatures. Deck: pure Enchantress/Epic.
Cast Enduring Ideal ({5}{W}{W}). Epic resolves:
  (A) "You can't cast spells for the rest of the game." — Never again.
  (B) Immediate effect: search library for an Aura, put it on a creature.
  Get: Eldrazi Conscription ({8}) — if searched first: gives +10/+10, Annihilator 2, Trample to creature.
  Your creature: becomes an 11/11+ with Annihilator 2, Trample.
Your next upkeep: copy Enduring Ideal (without epic). Search again → get another Aura.
Turn 9: get Form of the Dragon → you become a dragon, deal 5 damage per end step to creatures.
Turn 10: get Heliod's Intervention (combat-focused Aura) → protection buff.
Each upkeep: one free Aura. Cannot be removed by common spells (you respond with... nothing, you can't cast).
The Epic player can't do anything except the automatic upkeep Aura drops.
Game plan: resolve Enduring Ideal when you're winning the board state. Cement with free Auras each turn.

## Commonly Confused With
- **P265 (Blitz)** — Blitz also sacrifices the creature at end step (not ETB); Evoke sacrifices immediately on enter. Both are cheaper than normal casting.
- **P302 (Emerge)** — Both Emerge and Offering reduce cost by sacrificing a creature; Emerge's reduction is by the sacrificed creature's MV (generic), while Offering reduces by the sacrificed creature's full mana cost (colored and generic).
- **P287 (Phasing)** — Champion's exiled creature is similar to phasing out (preserved while champion is in play); but champion uses exile zone, not the phasing mechanic.
- **P296 (Storm)** — Epic copies the spell each upkeep (like a self-generating storm); but Storm creates all copies at once based on spells cast, while Epic creates one copy per upkeep indefinitely.
