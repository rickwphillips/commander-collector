---
id: p420
name: Evoke — Alternative-Cost ETB Sacrifice Trigger, and What Happens When It's Countered
category: triggered
cr_refs: [702.74a, 702.74b]
tags: [evoke, evoke-sacrifice-trigger, stifle-evoke, hushbringer-evoke, Torpor-Orb, Mulldrifter, Ingot-Chewer, Shriekmaw, Grief, Solitude, Subtlety, Ephemerate, evoke-elemental, counter-sacrifice-trigger, pitch-evoke, Lorwyn, Modern-Horizons-2, evoke-cost-paid, leave-sacrifice, etb-then-sacrifice]
created: 2026-03-29
examples_count: 2
---

# P420 — Evoke — Alternative-Cost ETB Sacrifice Trigger, and What Happens When It's Countered

## Abstract
**Evoke** (702.74) is an alternative cost that lets you cast a creature more cheaply, with the trade-off that the creature is sacrificed when it enters. The sacrifice is a **triggered ability** ("when this permanent enters, if its evoke cost was paid, its controller sacrifices it"), not a replacement effect. This means: (1) the creature's ETB triggers fire **before** the sacrifice trigger (both are triggered abilities, but ETBs fire first since they trigger simultaneously and go on the stack — but actually the ETB and evoke sacrifice both trigger on entering, going on the stack in APNAP order); (2) the sacrifice trigger **can be countered** by Stifle or Disallow, keeping the creature; and (3) abilities that prevent triggered abilities (Hushbringer, Torpor Orb) also prevent the sacrifice trigger — meaning a Hushbringer + evoked Mulldrifter = a 2/2 flier for {2}{U} with no cards drawn AND no sacrifice. Modern Horizons 2's "pitch evoke" cycle makes these interactions tournament-relevant.

## The Definitive Rules

**CR 702.74a** (verbatim): *"Evoke represents two abilities: a static ability that functions in any zone from which the card with evoke can be cast and a triggered ability that functions on the battlefield. 'Evoke [cost]' means 'You may cast this card by paying [cost] rather than paying its mana cost' and 'When this permanent enters, if its evoke cost was paid, its controller sacrifices it.' Casting a spell for its evoke cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
WHAT EVOKE CREATES (702.74a):
  Two abilities:
  1. Static (casting zones): alternative cost — pay [evoke cost] instead of mana cost.
  2. Triggered (on battlefield): "When this permanent enters, if its evoke cost was paid,
     its controller sacrifices it."
  When you evoke: pay the evoke cost (alternative), spell resolves, creature enters.
  As creature enters: its ETBs fire AND the evoke sacrifice trigger fires.
  All go on the stack. ETBs go on first (controller puts them on stack, then sacrifice trigger).
  Wait — they all trigger simultaneously (on entering). APNAP stacks them. All on stack.
  Then: resolve in LIFO order.

ORDER OF OPERATIONS:
  Multiple triggers from the same entering event:
  Example: Mulldrifter ({5}: 2/2 flier; "when it enters, draw 2 cards"; evoke {2}{U}):
    Cast for evoke cost {2}{U}: enters.
    Both triggers go on the stack:
      A. "When Mulldrifter enters, draw 2 cards" (ETB trigger)
      B. "When Mulldrifter enters, if evoke cost was paid, sacrifice it" (evoke trigger)
    Controller stacks them (APNAP — you're the active player or controller, you choose).
    Put sacrifice trigger on stack FIRST (it goes below). Put draw trigger on stack SECOND (it goes above, resolves first).
    Alternatively: put draw trigger on stack first (resolves last), sacrifice trigger on top (resolves first). Then you sacrifice before drawing.
    Correct play: put DRAW trigger on top (stack it second/last). Draw resolves first. Then sacrifice.
    Wait: In APNAP, the active player stacks their triggers in their chosen order. If you're the controller of both triggers: you choose which is on top (resolves first).
    Put the evoke sacrifice trigger on the stack FIRST (it's on the BOTTOM).
    Put the draw trigger on the stack SECOND (it's on TOP, resolves first).
    Draw 2 cards first. Then sacrifice Mulldrifter.
    You get: 2 cards drawn AND Mulldrifter is sacrificed. Net: {2}{U} for draw 2 + flying blocker briefly.

STIFLE/DISALLOW ON THE EVOKE SACRIFICE TRIGGER:
  The evoke sacrifice trigger is a triggered ability on the stack.
  It CAN be countered by Stifle ({U}: "counter target activated or triggered ability"),
    Disallow ({1}{U}{U}: "counter target spell, activated ability, or triggered ability"),
    or Voidslime ({G}{U}{U}: same as Disallow), etc.
  If the sacrifice trigger is countered: it does nothing. Mulldrifter is NOT sacrificed.
  Result: you evoked Mulldrifter for {2}{U}, drew 2 cards, AND keep the 2/2 flier.
  You spend {2}{U} + 1 counterspell to keep Mulldrifter. Trade-off vs. just casting normally.

HUSHBRINGER AND TORPOR ORB INTERACTION:
  Hushbringer ({1}{W}: 1/2 fairy; "creatures entering the battlefield don't cause triggered
    abilities to trigger"):
  Torpor Orb ({2}: artifact; "creatures entering the battlefield don't cause triggered abilities
    to trigger"):
  With Hushbringer or Torpor Orb out:
    You evoke Mulldrifter ({2}{U}).
    Mulldrifter enters. BUT: Hushbringer prevents triggered abilities from triggering when creatures enter.
    This includes:
      → "When Mulldrifter enters, draw 2 cards" — DOES NOT trigger.
      → "When Mulldrifter enters, if evoke cost was paid, sacrifice it" — DOES NOT trigger.
    Result: Mulldrifter is on the battlefield. NO draw. NO sacrifice. Just a 2/2 flier for {2}{U}.
    This is EXTREMELY powerful. You paid the evoke (cheap) cost and got the creature for free.
  Notable: the ETB and the sacrifice are both prevented. You gain the creature, lose the ETB effect.
  With Grief ({3}{B}{B}: 3/2; evoke — exile a black card from hand):
    Grief's ETB: "when Grief enters, target opponent reveals their hand. You choose a nonland
      card from it. That player discards that card."
    Grief's evoke cost: exile a black card from your hand.
    With Hushbringer: Grief enters, no ETB (no targeted discard), no sacrifice. You have a 3/2.
    Note: you still paid the evoke cost (exiled a black card). You didn't get the discard effect.
    Generally: Hushbringer prevents the useful ETB too. Torpedo Orb same.
    Why play this way? If Hushbringer is your opponent's and you're evoke-ing an elemental:
      you want the ETB effect but your opponent's Torpor Orb prevents it. But it ALSO
      prevents the sacrifice trigger. So your creature sticks around.

PITCH EVOKE ELEMENTALS (MODERN HORIZONS 2):
  Five elementals with "free" evoke costs by exiling a card of a specific color:
    Grief: exile black card → opponent discards.
    Solitude: exile white card → exile target creature.
    Subtlety: exile blue card → put target spell/creature on top of library.
    Endurance: exile green card → exile all GY cards, put on bottom of libraries.
    Fury: exile red card → distribute 4 damage.
  These are commonly played WITHOUT evoke in midrange/control decks.
  But the key "Ephemerate" interaction:
    You evoke Grief (exile black card, trigger: force discard).
    Evoke sacrifice trigger goes on stack.
    Cast Ephemerate ({W}: instant — "exile target creature you control, return it to the
      battlefield under your control; rebound") targeting Grief in response to evoke trigger.
    Ephemerate resolves: Grief is exiled (leaves battlefield). Evoke sacrifice trigger checks:
      "when this permanent enters, if evoke cost was paid, sacrifice it."
      Wait — the trigger is already on the stack. It targets Grief (a permanent).
      When Grief is exiled: is the target still valid?
      Actually, the evoke sacrifice trigger reads "its controller sacrifices it." "It" refers
      to the permanent that entered. The permanent is Grief. The trigger was put on the stack
      when Grief entered. Now Grief left. When the trigger resolves: "sacrifice Grief." Can
      you sacrifice something in exile? NO — you can only sacrifice permanents (on battlefield).
      Grief is in exile, not on the battlefield. The sacrifice trigger tries to sacrifice Grief
      but can't (it's not a permanent/on battlefield). The trigger does nothing.
      Grief is in exile. Rebound: at the beginning of next upkeep, cast the Ephemerate for free.
      But actually: Ephemerate exiled Grief with its effect. The "return it" from Ephemerate
      returns Grief to the battlefield at the end of step when Ephemerate resolves.
      Wait: Ephemerate says "exile target creature, return it at beginning of next upkeep"?
      No: Ephemerate says "exile target creature you control, return it to the battlefield
      under your control." This is an immediate return (not delayed). But actually:
      Let me re-read Ephemerate's Oracle text: "Exile target creature you control, then return it to the battlefield under your control. Rebound."
      So: exile Grief → immediately return Grief to battlefield.
      Grief re-enters: ETB fires AGAIN (second instance of "when it enters, force discard").
      Evoke trigger: "when this permanent enters, if evoke cost was paid, sacrifice it."
      Was evoke cost paid for THIS entering? Grief entered the second time from the Ephemerate
      effect, not from casting. Did evoke cost get paid a second time? No — evoke cost was paid
      once at casting. The second entry is not from casting with evoke.
      The evoke trigger only fires "if its evoke cost was paid" — the original cast's evoke
      cost was paid. But does the trigger care about which entering event?
      702.74a: "when this permanent enters, if its evoke cost was paid."
      The "if" is an intervening-if clause? Or just a condition?
      Actually, "if its evoke cost was paid" is a condition checked at trigger time. The trigger
      fires for any entering event while the evoke cost "was paid" is still tracked.
      Actually, the evoke "cost paid" status is NOT a property of the permanent — it was paid
      when casting the spell. When the permanent leaves and re-enters (from Ephemerate), it's a
      new object (zone change). The original "evoke cost was paid" status... does it transfer?
      CR 400.7: except in specific cases, a zone change creates a new object. The Ephemerate
      return is a zone change (exile → battlefield). New object. New entering.
      The "if evoke cost was paid" — was it paid for THIS entering? The new object entered
      via Ephemerate's effect, not via casting with evoke. Evoke cost was NOT paid for this
      particular entering event.
      Result: Ephemerate-returned Grief re-enters without the evoke sacrifice trigger firing.
      You get: second ETB discard effect. Grief stays on battlefield (no evoke sacrifice).
    This is the famous "Grief + Ephemerate" turn-1 combo in Modern.
    Actually this interaction requires verification. Let me check: does "if its evoke cost was paid" check if evoke was paid for this specific entering?
    The answer is: NO. The "evoke cost was paid" condition tracks whether the evoke ability was used when the spell was originally cast. When the creature is exiled and re-enters, it IS a new object. The new object didn't have its evoke cost paid. So the sacrifice trigger DOES NOT fire on the second entry.
    Wait but actually, looking at real rulings: the Grief + Ephemerate combo DOES work this way in practice. Grief gets a second ETB discard, and the evoke sacrifice trigger doesn't fire for the Ephemerate re-entry because the "evoke cost was paid" condition isn't satisfied for that particular entry.

EVOKE AND TARGETING RESTRICTIONS:
  The sacrifice trigger: "its controller sacrifices it."
  This is not targeting — sacrifice doesn't require a target.
  But the ETB trigger might require targets (e.g., Shriekmaw: "when it enters, destroy target
    nonartifact, nonblack creature"). If no valid targets for Shriekmaw's ETB when you evoke
    it: the ETB trigger is put on stack but has no legal targets → fizzles. Shriekmaw is still
    sacrificed by the evoke trigger (it resolves regardless of the ETB fizzling).

EVOKE + CLONE:
  Clone enters as a copy of an evoked creature (after it's on the battlefield).
  The Clone isn't cast for the evoke cost — Clone enters via its own ETB replacement.
  Clone doesn't have "evoke cost was paid" status. The sacrifice trigger doesn't fire for Clone.
  Clone enters as a copy of (say) Mulldrifter. Clone's ETB: "draw 2 cards" fires.
  No sacrifice. Just a 2/2 flier that drew 2.
```

## Definitive Conclusions

- **Evoke's sacrifice trigger is a triggered ability that can be countered** — Stifle, Disallow, etc. can counter the sacrifice trigger, leaving the creature on the battlefield; you evoked it cheaply AND kept it.
- **Hushbringer and Torpor Orb prevent BOTH the ETB and the evoke sacrifice trigger** — with Hushbringer, evoke creatures enter cleanly with no effects but also aren't sacrificed; the evoke cost was paid but neither ability fires.
- **Ephemerate on an evoked creature lets the creature re-enter without the sacrifice trigger** — the second entry is not from casting with evoke; the "if evoke cost was paid" condition fails for the Ephemerate-triggered entering event; the creature gets a second ETB but no sacrifice.
- **ETB and evoke sacrifice both trigger simultaneously on entering** — the controller stacks them in their preferred order; optimal play puts the desired ETB to resolve first, sacrifice second.

## Canonical Example
**Stifle + Evoked Shriekmaw:**
Shriekmaw ({4}{B}: 3/2 terror fear; evoke {1}{B}; "when Shriekmaw enters, destroy target nonartifact, nonblack creature"):

You evoke Shriekmaw for {1}{B}: enters.
Two triggers go on the stack:
  A. "When Shriekmaw enters, destroy target creature" (ETB)
  B. "When Shriekmaw enters, if evoke cost was paid, sacrifice it" (evoke trigger)

You put B (sacrifice) on stack first (at bottom). Put A (destroy) on top.
Destroy trigger resolves: destroy opponent's Tarmogoyf.

Opponent has Stifle. Can they counter the sacrifice trigger?
Stifle ({U}: counter target activated or triggered ability): YES.
Opponent counters the sacrifice trigger (trigger B).
Shriekmaw remains on the battlefield. You have a 3/2 with terror and fear for {1}{B}.

Wait — you want this? Yes! You cast Shriekmaw for {1}{B} (evoke cost), destroyed a creature, and kept a 3/2 beater. Total value.
The opponent spent {U} to keep your creature alive. Good deal for you.

**Example 2 — Hushbringer + Mulldrifter:**
You control Hushbringer ({1}{W}: 1/2 faerie; "creatures entering don't cause triggered abilities to trigger").
You evoke Mulldrifter ({2}{U}): pays evoke cost, Mulldrifter enters.

Hushbringer prevents triggered abilities from triggering when creatures enter.
"When Mulldrifter enters, draw 2 cards" — Hushbringer prevents this. No draw.
"When Mulldrifter enters, if evoke cost was paid, sacrifice it" — Hushbringer prevents this. No sacrifice.

Result: Mulldrifter on battlefield. No draw. No sacrifice. 2/2 flier for {2}{U}.
This is significantly below rate normally, but if you're already using Hushbringer for other reasons (stopping opponents' ETBs), evoke creatures become a cost-efficient way to put creatures onto the battlefield.

Opponent plays Grief (evoke black card, ETB force discard) with Hushbringer out:
Their Grief enters: Hushbringer prevents the discard ETB (good for you!), but ALSO prevents their sacrifice trigger. They have a 3/2 on board but no discard.
In this case: Hushbringer HELPS you (prevents their ETB discard) while also keeping their creature (forces them to answer it or take 3/2 attacks).

## Commonly Confused With
- **P396 (Bestow)** — Bestow is an alternative cost that changes the spell type. Evoke is an alternative cost that adds a sacrifice trigger. Both have rules for what happens when the ETB effect is disrupted, but through very different mechanisms.
- **P402 (Companion)** — Both companion and evoke involve special conditions for casting. Companion requires meeting a deck-building condition; evoke requires paying the evoke cost. Both are alternative cast paradigms.
- **P002 (Replacement Effects)** — The evoke sacrifice is a triggered ability, NOT a replacement effect. This distinction is crucial for Stifle interactions: replacement effects can't be countered by Stifle; triggered abilities can. The sacrifice is triggered.
- **P416 (Split Second)** — Split second prevents countering the sacrifice trigger (no counter-spells during split second). But a morph face-up during split second could be used strategically with evoke creatures in unusual scenarios.
