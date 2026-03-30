---
id: p410
name: Replacement Effect Ordering — Graveyard Hate vs. Zone-Dependent Mechanics
category: replacement
cr_refs: [616.1, 616.1a, 616.1e, 616.1f, 614.15, 614.17, 702.35a, 702.34a, 702.40a]
tags: [replacement-effect-ordering, leyline-of-the-void, rest-in-peace, grafdiggers-cage, madness, flashback, escape, jump-start, self-replacement, gy-hate, zone-replacement, Leyline-of-the-Void, Rest-in-Peace, Grafdigger-Cage, Tormod-Crypt, madness-leyline, flashback-cage, player-choice-order, self-replacement-priority, exile-to-exile]
created: 2026-03-29
examples_count: 3
---

# P410 — Replacement Effect Ordering — Graveyard Hate vs. Zone-Dependent Mechanics

## Abstract
Several powerful mechanics depend on cards going through specific zones: **Madness** (card goes to exile before being cast), **Flashback** (cast from GY), **Escape** (cast from GY, exile cards as cost), **Jump-Start** (cast from GY with discard). Graveyard hate permanents — **Leyline of the Void** ("if a card would be put into a graveyard from anywhere, exile it instead"), **Rest in Peace** ("if a card would go to the GY, exile it instead"), and **Grafdigger's Cage** ("players can't cast spells from graveyards or libraries") — interact with these mechanics in non-obvious ways. The key question for Leyline/RIP: when multiple replacement effects compete, CR 616.1 lets the affected player choose the ORDER of application. Madness players can always apply madness first to preserve their trigger. For Grafdigger's Cage, it's a "can't" effect (614.17), not a replacement effect — it hard-stops casting from GY regardless of player choice.

## The Definitive Rules

**CR 616.1** (verbatim): *"If two or more replacement and/or prevention effects are attempting to modify the way an event affects an object or player, the affected object's controller (or its owner if it has no controller) or the affected player chooses one to apply, following the steps listed below."*

**CR 616.1a** (verbatim): *"If any of the replacement and/or prevention effects are self-replacement effects (see rule 614.15), one of them must be chosen. If not, proceed to rule 616.1b."*

**CR 616.1e** (verbatim): *"Any of the applicable replacement and/or prevention effects may be chosen."*

**CR 616.1f** (verbatim): *"Once the chosen effect has been applied, this process is repeated (taking into account only replacement or prevention effects that would now be applicable) until there are no more left to apply."*

**CR 614.15** (verbatim): *"Some replacement effects are not continuous effects. Rather, they are an effect of a resolving spell or ability that replace part or all of that spell or ability's own effect(s). Such effects are called self-replacement effects. The text creating a self-replacement effect is usually part of the ability whose effect is being replaced, but the text can be a separate ability, particularly when preceded by an ability word. When applying replacement effects to an event, self-replacement effects are applied before other replacement effects."*

**CR 614.17** (verbatim): *"Some effects state that something can't happen. These effects aren't replacement effects, but follow similar rules."*

**CR 614.17c** (verbatim): *"If an event can't happen, it can only be replaced by a self-replacement effect (see rule 614.15). Other replacement and/or prevention effects can't modify or replace it."*

## The Pattern

```
LEYLINE OF THE VOID / REST IN PEACE vs. MADNESS:
  Leyline of the Void: "If a card would be put into a graveyard from anywhere, exile it instead."
  Rest in Peace: "If a card would be put into a graveyard from anywhere, exile it instead."
  Madness (702.35a): "If a player would discard this card, that player discards it, but exiles
    it instead of putting it into their graveyard."
    → Second part: "When this card is exiled this way, its owner may cast it..."
    → "this way" means: exiled due to madness's OWN replacement effect.

  Two replacement effects competing:
    Event: player discards a madness card.
    Effect A (Leyline/RIP): exile it instead of GY.
    Effect B (Madness): exile it (and trigger the madness cast trigger).

  Both effects exile the card. The DIFFERENCE is whether "this way" is satisfied.
    If Madness applies first: card exiled BY MADNESS → "exiled this way" → trigger fires.
    If Leyline applies first: card exiled BY LEYLINE → card is in exile, but NOT "this way"
      (not by madness's replacement) → trigger does NOT fire.

  WHO CHOOSES THE ORDER?
    CR 616.1: "the affected object's controller (or its owner if it has no controller)."
    A card in hand is owned by the player whose hand it's in. That player is the "owner."
    The player whose madness card is being discarded → they CHOOSE which applies first.
    → They always choose Madness first. The madness trigger fires.
    → Even with Leyline on the battlefield, madness still works when the player chooses.

  EXCEPTION: What if the opponent owns the madness card but it's in the player's hand?
    (Theft effects, like Act of Treason on a card in hand? Unusual, but:)
    The "owner" is always the player who started the game with the card.
    The owner chooses. If the owner wants madness to trigger, they choose madness first.

  CONFIRMED RESULT: Leyline of the Void + Madness card:
    Player discards madness card → applies madness first (choice) → card exiled by madness
    → madness trigger fires → player may cast for madness cost.
    Leyline has no remaining effect (card already in exile, no longer "going to GY").

LEYLINE / REST IN PEACE vs. FLASHBACK:
  Flashback requires a card to be IN THE GRAVEYARD to cast it.
  Leyline / RIP prevent cards from reaching the GY at all.

  When a flashback card would NORMALLY go to GY (from hand, after being cast):
    Leyline/RIP applies: exile it instead.
    The card is now in EXILE, not GY.
    Flashback requires the card be in GY (702.34a: "cast this card from your graveyard").
    Card is not in GY. Flashback is unavailable.
  Result: Leyline/RIP prevent flashback by preventing the card from reaching GY.

  Cards already in GY when Leyline enters:
    Cards already in GY are NOT removed by Leyline entering.
    Leyline only affects cards that "would be put into a graveyard" in the future.
    Cards already in GY when Leyline enters can still be flashed back.
    Note: Rest in Peace has a different ETB: "Exile all cards from all GYs" when it enters.
    RIP entering exiles existing GY contents. Flashback lost for all cards in GY.

GRAFDIGGER'S CAGE vs. FLASHBACK / ESCAPE / JUMP-START:
  Grafdigger's Cage: "Players can't cast spells from graveyards or libraries."
  This is a "can't" effect (CR 614.17), NOT a replacement effect.

  "Can't" effects:
    614.17: "Some effects state that something can't happen. These effects aren't replacement
      effects, but follow similar rules."
    614.17c: "If an event can't happen, it can only be replaced by a self-replacement effect.
      Other replacement and/or prevention effects can't modify or replace it."

  Result: Grafdigger's Cage completely stops flashback, escape, and jump-start.
    Flashback: casting from GY → CAN'T.
    Escape: casting from GY → CAN'T.
    Jump-Start: casting from GY → CAN'T.
    No player choice of order applies here — "can't" is absolute.
    You cannot use flashback while Grafdigger's Cage is on the battlefield.

  GRAFDIGGER'S CAGE vs. MADNESS:
    Madness is NOT casting from GY. Madness is casting from EXILE.
    The madness trigger fires when the card is exiled (from the discard event).
    You cast the madness card from exile, not from GY.
    Grafdigger's Cage says "can't cast from graveyards or libraries" — NOT from exile.
    Grafdigger's Cage does NOT stop madness casting.
    Madness still works normally with Grafdigger's Cage on the battlefield.

  GRAFDIGGER'S CAGE vs. CYCLING MADNESS COMBO:
    Cycle a madness card → madness fires from exile → may cast for madness cost.
    Cage doesn't stop this (madness cast is from exile, not GY).

LEYLINE / RIP vs. ESCAPE:
  Escape requires cards in YOUR GY as additional cost (exile them when casting).
  If Leyline/RIP prevents cards from reaching GY: no cards in GY to exile for escape cost.
  Escape card itself: if it dies, Leyline/RIP puts it in exile (not GY).
    Can't cast via escape because the card is in exile, not GY.
  Result: Leyline/RIP effectively shuts down escape strategies entirely.

LEYLINE / RIP vs. SOULSHIFT (P406):
  Soulshift triggers "when this permanent is put into a graveyard from the battlefield."
  With Leyline/RIP: the permanent goes to EXILE instead of GY.
  The event "put into graveyard" never happens. Soulshift trigger never fires.
  The soulshift trigger checks the destination zone. Exile ≠ GY.
  Result: Leyline/RIP prevents soulshift from triggering.

LEYLINE / RIP vs. UNDERGROWTH / DELIRIUM / THRESHOLD (ability words):
  These check how many cards are in GY or what types are in GY.
  With Leyline/RIP: cards go to exile, not GY. GY stays empty.
  Undergrowth count = 0. Delirium = 0 types. Threshold = never reached.
  Result: Leyline/RIP hard counters GY-count mechanics.

COMPARING THE THREE GY HATE CARDS:
  Leyline of the Void:
    → Replaces "would go to GY" with "exile instead."
    → DOES NOT affect cards already in GY when it enters (no ETB clause for existing GYs).
    → Can be responded to: cast in opening hand (free), or {2}{B}{B} during game.
    → Player choice: madness players choose madness first → madness still works.
    → Flashback: only works on cards already in GY when Leyline entered.

  Rest in Peace:
    → ETB: exile all GYs immediately (removes all existing cards).
    → Static: like Leyline, replaces future GY destinations with exile.
    → Most comprehensive: destroys existing GY AND prevents future.
    → Madness still works (player choice, same as Leyline).
    → Flashback fully stopped (RIP wipes GY on entry AND prevents new cards from going there).

  Grafdigger's Cage:
    → "Can't" effect — not a replacement effect.
    → Doesn't exile GY or redirect cards. GY still fills normally.
    → Stops CASTING from GY (flashback, escape, jump-start).
    → Does NOT stop madness (which casts from exile).
    → Does NOT prevent GY from filling.
    → Does NOT stop GY-count mechanics (undergrowth, delirium still count cards in GY).
```

## Definitive Conclusions

- **Madness works through Leyline of the Void** — the player whose madness card is being discarded chooses the replacement order (CR 616.1); they choose madness first, the card is exiled "by madness," and the trigger fires.
- **Flashback is stopped by Grafdigger's Cage** — Cage is a "can't" effect (614.17), not a replacement effect; it absolutely prevents casting from graveyards regardless of player choice.
- **Grafdigger's Cage does NOT stop Madness** — madness cards are cast from exile, not from the GY; Cage only prohibits casting from graveyards and libraries.
- **Rest in Peace eliminates flashback entirely** — RIP's ETB exiles all existing GY cards, and its static effect prevents future GY entry; no flashback cards can reach the GY.
- **Leyline of the Void only affects future GY entries** — cards already in GY when Leyline enters are safe; flashback is still available for those; only new cards going to GY are redirected.

## Canonical Example
**Madness Deck vs. Opponent with Leyline of the Void:**
Opponent opens with Leyline of the Void in play (free if in opening hand).
You have: Faithless Looting ({R}: draw 2, then discard 2) + Fiery Temper ({1}{R}{R}: deal 3 damage; madness {R}) in hand.

Cast Faithless Looting. Draw 2 cards. Now discard 2.
Discard Fiery Temper.

Event: Fiery Temper would be discarded.
Two replacement effects apply:
  A. Madness: exile Fiery Temper instead of GY (and trigger fire).
  B. Leyline: exile Fiery Temper instead of GY (no trigger).

Both exile to the same place. But "exiled this way" in madness's trigger requires madness was the applied replacement. YOU are the owner of Fiery Temper. You choose order.

Apply Madness first: Fiery Temper goes to exile via madness.
Madness trigger fires: "when Fiery Temper is exiled this way, you may cast it for {R}."
Pay {R}: cast Fiery Temper → deal 3 damage.

Leyline is irrelevant — the card was already exiled by madness. Nothing left for Leyline to do.

**Example 2 — Grafdigger's Cage vs. Snapcaster Mage:**
Opponent controls Grafdigger's Cage ("players can't cast spells from graveyards or libraries").
You have Snapcaster Mage in hand. Deep Analysis in GY.

Cast Snapcaster Mage ({1}{U}): enters, ETB triggers.
ETB: "target instant or sorcery in your GY gains flashback until end of turn."
Target Deep Analysis. Deep Analysis now has flashback.

Can you cast Deep Analysis via flashback? NO.
Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
Flashback = casting from GY. Cage says can't. Absolute prevention.

The flashback ability exists on Deep Analysis, but you can't EXERCISE it while Cage is out.
Snapcaster Mage's ability did grant flashback — the ability exists. But the "can't" overrides using it.

Note: Snapcaster Mage's ETB trigger still resolved. Deep Analysis has flashback granted.
It just can't be used while Cage is present.
If Cage is later destroyed, the granted flashback (if "until end of turn") might still be active.
If still active: you CAN then cast Deep Analysis from GY via flashback.

**Example 3 — Rest in Peace vs. Escape:**
Opponent plays Rest in Peace (enchantment: "Exile all cards from all graveyards. Cards can't go to graveyards; exile them instead.").
RIP enters: ALL cards from ALL graveyards are exiled (including your Uro, Titan of Nature's Wrath).

You want to cast Uro from GY via escape. But Uro is no longer in GY — it's in exile.
Escape requires: "Cast Uro from your GY. As an additional cost, exile 5 other cards from your GY."
Neither condition can be met: Uro isn't in GY, and there are no other cards in GY to exile.
Escape is completely shut down.

Even if Uro somehow found its way back to GY (e.g., Surgical Extraction whiffed, Uro dies again):
RIP's static effect would redirect Uro to exile instead of GY. Can't escape from exile.

## Commonly Confused With
- **P002 (Replacement Effects)** — P002 establishes the fundamental rule that replacement effects modify events before they happen. This pattern (P410) shows what happens when two replacement effects compete for the same event, and how player choice in CR 616.1 interacts with zone-dependent mechanics.
- **P406 (Ninjutsu/Soulshift)** — Soulshift triggers on "put into GY." Leyline/RIP redirect permanents to exile instead. This is a direct application of P410: soulshift doesn't trigger because the "put into GY" event never happens.
- **P401 (Escape/Jump-Start)** — Both escape and jump-start are cast-from-GY mechanics like flashback. All three are stopped by Grafdigger's Cage for the same reason.
- **P408 (Flashback/Madness)** — P408 explains how flashback and madness work normally. P410 shows how GY hate modifies those interactions.
