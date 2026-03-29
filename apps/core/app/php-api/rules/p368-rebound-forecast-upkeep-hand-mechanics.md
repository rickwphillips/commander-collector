---
id: p368
name: Rebound and Forecast — Exile-Then-Cast and Upkeep-Activated Hand Abilities
category: stack
cr_refs: [702.88a, 702.88b, 702.88c, 702.57a, 702.57b]
tags: [rebound, forecast, upkeep-activation, exile-after-resolve, cast-from-exile, hand-only-ability, delayed-trigger, free-cast-next-upkeep, rebound-only-from-hand, forecast-once-per-turn, Distortion-Strike, Temporal-Spring, Proclamation-of-Rebirth, Cloudthresher-forecast, Ancestral-Vision-rebound]
created: 2026-03-29
examples_count: 2
---

# P368 — Rebound and Forecast — Exile-Then-Cast and Upkeep-Activated Hand Abilities

## Abstract
**Rebound** (702.88a) is a static ability on instants and sorceries: if the spell was cast from your hand, instead of going to the GY when it resolves, it's exiled. Then a delayed triggered ability fires at the beginning of your next upkeep: you may cast it from exile without paying its mana cost. Critical restriction: rebound only fires if the spell was cast FROM YOUR HAND. If cast via Flashback, cascade, or any other method besides "from hand," the card doesn't get exiled — it goes to the GY normally (or wherever its other effects send it). **Forecast** (702.57a–b) is a special kind of activated ability that can only be used from the hand: activated only during the owner's upkeep step, only once per turn, and the card is revealed for the rest of the upkeep. These are both "hand-based" mechanics where the card in hand is part of the engine rather than something you cast immediately.

## The Definitive Rules

**CR 702.88a** (verbatim): *"Rebound appears on some instants and sorceries. It represents a static ability that functions while the spell is on the stack and may create a delayed triggered ability. 'Rebound' means 'If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.'"*

**CR 702.57a** (verbatim): *"A forecast ability is a special kind of activated ability that can be activated only from a player's hand. It's written 'Forecast — [Activated ability].'"*

**CR 702.57b** (verbatim): *"A forecast ability may be activated only during the upkeep step of the card's owner and only once each turn. The controller of the forecast ability reveals the card with that ability from their hand as the ability is activated. That player plays with that card revealed in their hand until it leaves the player's hand or until a step or phase that isn't an upkeep step begins, whichever comes first."*

## The Pattern

```
REBOUND (702.88a):
  WHAT IT DOES:
    When you cast a rebound spell FROM YOUR HAND and it resolves:
      Instead of going to the GY: exile it with a "rebound" suspended state.
      Delayed triggered ability created: "At the beginning of your next upkeep, you may cast
        this card from exile without paying its mana cost."
    Second use: the card fires from exile at start of next upkeep.
      No mana cost. Just cast it free.
    After the second cast: the card goes to the GY (no rebound text on this casting?).
      Actually: rebound says "if this spell was cast from your hand."
      The second cast is from EXILE (not from hand). So rebound doesn't apply the second time.
      On the second resolution: the card goes to the GY normally.
      Total: two uses of the spell, then it's gone.
  "CAST FROM YOUR HAND" RESTRICTION:
    This is the KEY restriction. Rebound only exiles and creates the delayed trigger if
      the spell was cast from your hand.
    If cast via:
      Flashback: the flashback ability sends it to exile (flashback's own exile effect).
        But does rebound also apply? "Cast from your hand" — flashback casts from GY, not hand.
        Rebound DOESN'T apply (not cast from hand). Flashback's exile rule applies instead.
      Cascade: cast from exile via cascade trigger. NOT from hand. Rebound doesn't apply.
        The card would go to the GY or wherever cascade sends unclaimed cards.
        Wait: cascade says "you may cast that card without paying its mana cost."
        If the card has rebound and you cast it this way: it was cast from exile (the cascade exile).
        "If this spell was cast from your hand" — NO. Goes to GY normally.
      Copy: copies are never cast (707.10). Rebound doesn't apply to copies.
      Snapcaster Mage granting flashback: the instant/sorcery is cast from GY via flashback.
        "Cast from your hand" — NO. Rebound doesn't apply.
    PRACTICAL RESULT: Rebound's second casting only happens if you cast it the first time
      from your actual hand. This prevents double-exploitation via other casting methods.
  THE SECOND CAST (FROM UPKEEP):
    At the beginning of your next upkeep: delayed trigger fires.
    "You MAY cast this card from exile without paying its mana cost."
    You can choose NOT to cast it. It stays in exile indefinitely if you decline.
      (It doesn't go to GY if you don't cast it — it just remains exiled.)
    If you cast it: it's a genuine casting event.
      Prowess triggers (you cast a spell).
      Storm count increases.
      All "when you cast" effects fire.
    After the second cast resolves: no rebound (cast from exile), so it goes to the GY.
  REBOUND CARDS (EXAMPLES):
    Distortion Strike ({U}): "Target creature gets +1/+0 and is unblockable this turn. Rebound."
      Turn 1: Cast from hand (pay {U}). Creature gets +1/+0 and is unblockable. Exiled.
      Turn 2 (upkeep): Cast for free. Creature gets +1/+0 and is unblockable again.
      Two turns of evasion buff for {U} total.
    Temporal Spring ({G}{U}): "Put target artifact, creature, or enchantment on top of its owner's library. Rebound."
      Turn 1: Bounce an opponent's key permanent to the top of their library.
      Turn 2: Bounce another (or the same one if they re-deployed it).
      Two uses of a powerful bounce for {G}{U}.
    Distortion Strike in Infect: cast on infect creature. It's unblockable twice (two full turns).
      Second free cast during upkeep: second unblockable effect ready for second attack.
      Classic: Gitaxian Probe + Distortion Strike + Blighted Agent → Turn 2 kill potential.

FORECAST (702.57a–b):
  WHAT IT IS:
    A special activated ability on cards IN YOUR HAND.
    Format: "Forecast — [Activated ability]."
    The ability itself can be any kind of activated ability.
    Restriction: can ONLY be activated during your upkeep step.
    Once per turn maximum.
    You reveal the card from your hand when activating.
    The card stays revealed for the rest of the upkeep (until another phase begins).
  UPKEEP-ONLY, ONCE-PER-TURN:
    Strictly: your upkeep only. Not opponents' upkeeps. Not other steps.
    Once each turn — can't activate it multiple times in one turn even if effects let you
      take multiple actions in upkeep (like untapping and re-untapping with extra turns).
    Each separate turn: one activation.
  CARD STAYS IN HAND (REVEALED):
    You don't discard or cast the card. It stays in hand (revealed).
    You NEVER play it for this ability. You keep it as a resource.
    This is the forecast card's design: the card's value comes from:
      1. Its forecast ability (free, small effect each upkeep).
      2. Eventually being cast for its mana cost for a bigger effect.
    Or: it might never be cast if the forecast ability is good enough to keep it forever.
  CLASSIC FORECAST CARDS:
    Proclamation of Rebirth ({1}{W}{W}): "Return up to three target creature cards with
      mana value 1 or less from your graveyard to the battlefield."
      Forecast — {1}{W}: Return a creature card with mana value 1 or less from your graveyard
        to the battlefield.
      Reveal Proclamation from hand during upkeep. Pay {1}{W}. Return a 1-drop from GY.
      Do this every turn! Endlessly recur small creatures without casting the main card.
      Only cast the main Proclamation when you need three at once.
    Cloudthresher ({2}{G}{G}{G}{G}): "Flash. When this enters, it deals 2 damage to each
      creature with flying and each opponent."
      Forecast — {2}{G}{G}: Cloudthresher deals 2 damage to each creature with flying
        and each opponent.
      In hand: each upkeep pay {2}{G}{G} → deal 2 damage to all fliers. Anti-flying defense.
      Eventually cast Cloudthresher for a massive burst + ETB damage.
  FORECAST IS AN ACTIVATED ABILITY:
    Unlike rebound (which is a static + delayed triggered), forecast is explicitly "activated."
    Goes on the stack. Can be responded to. Can be countered with "counter target activated ability."
    Stifle: "Counter target activated or triggered ability." CAN counter a forecast activation.
    The activation reveals the card; if the ability is countered, was the card revealed for nothing?
      Yes: it's revealed but the ability doesn't resolve. The card stays in hand (revealed until
        upkeep ends, as per 702.57b).

REBOUND VS. FORECAST — COMPARISON:
  Rebound: casts the card (twice). First time: from hand, full cost. Second: from exile, free.
  Forecast: card never "casts" during forecast. It's an activation while the card is in hand.
  Both: upkeep-related. Rebound fires at upkeep (second casting). Forecast activates during upkeep.
  Rebound: 2 uses total, then gone.
  Forecast: unlimited uses (one per turn), card stays until cast or discarded.
```

## Definitive Conclusions

- **Rebound only exiles when cast from hand** — if cast via flashback, cascade, or any other method, rebound doesn't apply; the card goes to GY (or wherever the casting method dictates).
- **The second rebound cast is from exile (not hand)** — rebound doesn't apply again; after the second use, the card goes to the GY.
- **If you decline the rebound upkeep cast, the card stays in exile** — it doesn't go to the GY; it just remains exiled indefinitely (or until something retrieves it).
- **The second rebound cast IS a genuine cast** — triggers prowess, adds to storm count, triggers "when you cast" effects; it's a real casting event.
- **Forecast is an activated ability only during your upkeep** — once per turn; the card remains in hand revealed; can be responded to with Stifle or other ability counters.
- **Forecast cards are never cast to use the forecast ability** — the card stays in hand as a resource, providing one small effect per turn; the full cast is a separate option.

## Canonical Example
**Distortion Strike — Two Turns of Evasion:**
You're playing Infect. You control Blighted Agent ({1}{U}): "Infect. Blighted Agent is unblockable." Wait — Blighted Agent is already unblockable. Better example:

Control a Glistener Elf ({G}): "Infect." (1 infect damage = 1 poison counter.)
Opponent has blockers. You need evasion.

Turn 1: Cast Distortion Strike ({U}): "Target creature gets +1/+0 and is unblockable this turn. Rebound."
  Target Glistener Elf. It gets +1/+0 (now 2/1) and is unblockable this turn.
  Rebound: spell was cast from hand. At resolution: instead of GY, exile Distortion Strike.
  Delayed trigger created: "At beginning of your next upkeep, you may cast Distortion Strike from exile without paying its mana cost."
  Attack with Glistener Elf: unblockable, deals 2 infect damage (1 from elf + 1 from Strike buff = 2 poison).
  Opponent at 2 poison.

Turn 2 (your upkeep): Delayed trigger fires. "You may cast Distortion Strike from exile."
  You choose to cast it. It's a cast event (prowess triggers, etc.).
  Free cast: no mana paid.
  Target Glistener Elf again: +1/+0 and unblockable.
  This time: Distortion Strike was cast from EXILE (not hand). Rebound doesn't apply.
  Strike goes to GY after resolution.
  Attack: Glistener Elf is unblockable again. Deals 2 infect damage.
  Opponent now at 4 poison.

Two turns of unblockable for {U} total. With a Giant Growth or Mutagenic Growth: can poison out faster.

**Example 2 — Proclamation of Rebirth Forecast Engine:**
You're playing a One-Drop White deck in eternal formats.
Hand contains: Proclamation of Rebirth ({1}{W}{W}).
GY has: Weathered Wayfarer, Mother of Runes (both 1 MV creatures).

Your upkeep:
  Activate forecast: reveal Proclamation of Rebirth. Pay {1}{W}.
  "Return a creature card with mana value 1 or less from your graveyard to the battlefield."
  Return Weathered Wayfarer from GY to battlefield.

Next turn's upkeep:
  Activate forecast again (it's a new turn). Reveal Proclamation again. Pay {1}{W}.
  Return Mother of Runes from GY to battlefield.

Repeat every turn: {1}{W} per turn returns a 1-drop.
Proclamation stays in hand indefinitely.
Eventually: if you can't pay {1}{W}, or you need to bring back three at once, cast Proclamation normally.

Key insight: the card is generating value repeatedly without ever being cast.
Opponents can Stifle the forecast activation or discard Proclamation from your hand (targeted discard).
But as long as Proclamation is in hand: one 1-drop per upkeep for {1}{W}.

## Commonly Confused With
- **P356 (Flashback/Escape)** — Flashback casts from GY; rebound casts from exile. Critical: if a card has both flashback and rebound, using flashback doesn't trigger rebound (not cast from hand). Using normal cast (from hand) triggers rebound; the flashback becomes irrelevant for the rebound cast (it's from exile, which isn't the flashback's zone).
- **P366 (Suspend)** — Suspend also exiles cards and casts them from exile at upkeep. Rebound is simpler: one delayed trigger, one free cast. Suspend waits multiple turns (N time counters). Rebound is always "one turn later." Both create a delayed upkeep cast from exile.
- **P364 (Mana Abilities)** — Forecast is an activated ability (goes on the stack, can be countered). It is NOT a mana ability (doesn't produce mana, has specific timing restriction). Contrast: mana abilities resolve instantly, forecast abilities don't.
- **P362 (Storm)** — The second rebound cast IS a cast event, so it increments the storm count. If you have a storm spell and cast it via rebound: the storm trigger fires and counts all spells cast this turn before it. But the second rebound cast happens at upkeep — if nothing else was cast that turn: storm count from the rebound cast alone = 0 (storm counts OTHER spells cast before it this turn).
