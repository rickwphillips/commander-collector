---
id: p415
name: Dredge — Replacing Draw with Mill-and-Return, and the Non-Obvious Draw-Trigger Consequences
category: replacement
cr_refs: [702.52a, 702.52b, 614.1, 614.5]
tags: [dredge, replace-draw, mill-return, draw-trigger-skipped, Psychic-Corrosion, Notion-Thief, dredge-loop, Golgari-Grave-Troll, Life-from-the-Loam, Narcomoeba, dredge-grafdiggers-cage, dredge-leyline, replacement-for-draw, draw-never-happens, dredge-multiple-replacement]
created: 2026-03-29
examples_count: 2
---

# P415 — Dredge — Replacing Draw with Mill-and-Return, and the Non-Obvious Draw-Trigger Consequences

## Abstract
**Dredge** (702.52) is a replacement effect: when you **would draw a card**, you may instead mill N cards and return the dredge card from your graveyard to your hand. The key rules consequence flows from this replacement nature: **the draw never happens**. Any ability that triggers "when you draw a card" (like Psychic Corrosion, Teferi's Ageless Insight, or Notion Thief) does **not** trigger when you dredge, because the draw was replaced before it could occur. Dredge is also unaffected by Grafdigger's Cage (which stops casting from GY/library, not returning cards to hand) and partially interacts with Leyline of the Void (milled cards go to exile instead of GY, but the dredge card still returns to hand).

## The Definitive Rules

**CR 702.52a** (verbatim): *"Dredge is a static ability that functions only while the card with dredge is in a player's graveyard. 'Dredge N' means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

**CR 702.52b** (verbatim): *"A player with fewer cards in their library than the number required by a dredge ability can't mill any of them this way."*

**CR 614.1** (verbatim): *"Some continuous effects are replacement effects. Like prevention effects (see rule 615), they apply continuously as events happen—they aren't locked in ahead of time. Such effects watch for a particular event that would happen and completely or partially replace it with a different event."*

**CR 614.5** (verbatim): *"A replacement effect applies only once to any given event. Won't invoke itself repeatedly trying to apply to its own output."*

## The Pattern

```
DREDGE IS A REPLACEMENT EFFECT (614.1, 702.52a):
  "If you WOULD draw a card, you may INSTEAD mill N and return this card."
  The draw event is REPLACED. It never happens.
  The milling and the return happen INSTEAD of the draw.
  This is critical: "drawing a card" is the event. With dredge, it's replaced.

WHEN YOU DREDGE — WHAT HAPPENS:
  You have a dredge card (e.g., Golgari Grave-Troll, dredge 6) in GY.
  At any point where you would draw a card:
    Your draw step: you would draw. Dredge applies: mill 6, return Grave-Troll to hand.
    A loot effect ("draw a card"): you would draw. Dredge applies: mill 6, return to hand.
    An opponent's spell ("target player draws a card"): if that player has a dredge card,
      they may apply dredge for that draw too.
  You must have at least N cards in your library. If fewer: can't dredge.
  You MAY choose not to dredge even if eligible. It's optional.

DRAW-TRIGGERS DO NOT FIRE WHEN YOU DREDGE:
  "When you draw a card" triggers watch for the draw event.
  Since dredge REPLACES the draw (the draw never happens), these triggers don't fire.
  Examples:
    Psychic Corrosion ({2}{U}: "whenever you draw a card, each opponent mills 2"):
      You dredge. No card drawn. Psychic Corrosion does NOT trigger.
      Opponents do NOT mill 2 from your dredge.
    Teferi's Ageless Insight ({2}{U}{U}: "if you would draw a card, draw an extra card instead"):
      This is ALSO a replacement effect for drawing. When dredge applies: the draw is
      replaced by mill+return. The Insight's replacement never applies because there's
      no draw event for it to replace.
    Alhammarret's Archive ({5}: "if you would draw one or more cards, draw twice that many instead"):
      Same as above: the draw is replaced before Archive can double it.
      Dredging with Archive out: you mill N, return dredge card to hand. No extra milling.
  WHY THIS IS NON-OBVIOUS:
    Players often think "I drew via dredge, so Psychic Corrosion triggers."
    The opposite is true: dredge replaces drawing. No draw = no draw trigger.

DREDGE MULTIPLE TIMES IN ONE DRAW STEP:
  Your draw step: you would draw 1 card.
  You dredge (mill 6, return dredge card to hand).
  Now your hand has the dredge card. Can you use it again this draw step?
  The dredge replaced the ONE draw. The draw step gave you exactly 1 draw.
  After dredging: you have 0 draws remaining. You can't dredge again (no draw to replace).
  HOWEVER: if you have multiple dredge cards in GY and need to draw multiple cards:
    Each draw can be replaced by a separate dredge.
    Example: Breakthrough ({X}{U}: discard your hand, then draw 4 cards) — you draw 4.
      You can replace each of those 4 draws with a dredge.
      If you have 4 dredge cards: dredge each draw.
      More commonly: replace 3 draws with dredges, let the 4th be a normal draw.
  Dredge 6 (one instance) can only be used once per draw opportunity unless you have
    multiple dredge cards or multiple draws.

DREDGE AND GRAFDIGGER'S CAGE:
  Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
  Dredge: "return this card from your graveyard to your hand."
  Dredge does NOT cast anything. It returns the card to HAND.
  Grafdigger's Cage does NOT stop dredge. Dredge goes through normally.
  This is confirmed: Cage's restriction is on CASTING. Dredge is a draw replacement,
    not a cast action.

DREDGE AND LEYLINE OF THE VOID:
  Leyline: "if a card would be put into a graveyard from anywhere, exile it instead."
  When you dredge: you mill N cards. Those cards would go to the GY (milled = GY).
  With Leyline: the milled cards go to EXILE instead of GY.
  The dredge card itself: was already in GY. It returns to hand (it was in GY before the
    dredge resolved, and dredge explicitly returns it to hand — that's moving from GY to hand,
    not going to GY, so Leyline doesn't affect it).
  RESULT: Dredge works with Leyline, but the milled cards go to exile (not GY).
    In a Dredge deck that wants cards in GY (for future dredges): Leyline hurts.
    Cards you mill are lost to exile. But the dredge card still comes back.
    The deck's GY fuel is depleted faster with Leyline.

DREDGE AND REST IN PEACE:
  Rest in Peace: same as Leyline for this purpose (redirects GY to exile).
  PLUS: RIP's ETB exiles all existing GY cards.
  All dredge cards already in GY are exiled. Dredge cards can no longer be in GY.
  RIP prevents any future dredge cards from reaching GY (they go to exile when discarded/dying).
  RESULT: Rest in Peace completely shuts down Dredge (dredge cards can't be in GY if they go to exile).

DREDGE + NOTION THIEF (OPPONENT REDIRECT):
  Notion Thief ({2}{U}{B}: 3/1 flash; "if an opponent would draw a card except the first one
    they draw each turn, that player skips that draw and you draw a card instead"):
  An opponent has Notion Thief on the battlefield. You would draw on your draw step.
  Two replacement effects compete for your draw:
    A. Notion Thief: skip the draw (except first draw per turn).
    B. Dredge: replace with mill+return.
  The first draw per turn is exempt from Notion Thief. Your first draw (draw step draw):
    Notion Thief doesn't apply (first draw of the turn). You dredge or draw normally.
  Second+ draws: Notion Thief applies. Does dredge compete?
    You may apply dredge first (you choose the order per CR 616.1). Apply dredge: the draw
    is replaced by mill+return. No draw event left for Notion Thief.
    RESULT: Applying dredge before Notion Thief's redirect skips both — you mill and
    return instead of drawing, and Notion Thief never gets to redirect.
  Alternatively: let Notion Thief apply. You skip the draw (opponent draws instead).
    In this case: could you have dredged? Yes — but you chose to let Notion Thief apply first.
    Once Notion Thief applies (your draw is skipped), dredge can't retroactively apply.
  PRACTICAL PLAY: Against Notion Thief, always apply dredge first for your second+ draws.
    It's better to mill (enabling future dredges) than to let the opponent draw.

THE DREDGE DECK PATTERN:
  Classic Legacy/Vintage Dredge:
    Stinkweed Imp ({2}{B}: 1/2 deathtoucher; dredge 5).
    Golgari Grave-Troll ({4}{G}: +1/+1 for each creature in GY; dredge 6).
    Life from the Loam ({1}{G}: sorcery, return up to 3 target lands from GY to hand; dredge 3).
    Narcomoeba ({1}{U}: 1/1 flier; "when Narcomoeba is put into your GY from library,
      you may put it onto the battlefield").
    Ichorid ({3}{B}: 3/1; at beginning of opponent's upkeep, sacrifice unless exile a
      black creature from your GY; "when Ichorid is put into GY from anywhere, at beginning
      of next end step during your upkeep, return Ichorid to the battlefield").

  Turn 1: Discard Stinkweed Imp or Grave-Troll to a discard outlet (Faithless Looting).
  Draw step: replace draw with dredge. Mill 5-6 cards.
    → Narcomoeba: enters battlefield from being milled.
    → Ichorid: in GY; returns each upkeep.
    → More dredge cards: now in GY for future dredges.
  Each dredge mills more cards, enabling more creatures, enabling more value.
  Win condition: Dread Return from GY (requires sacrificing 3 creatures).
    Flash in a game-winning ETB creature (Thassa's Oracle for empty library win).
```

## Definitive Conclusions

- **Dredge replaces the draw — the draw never happens** — effects that trigger "when you draw a card" (Psychic Corrosion, Alhammarret's Archive) do NOT trigger; the draw event was replaced before it occurred.
- **Grafdigger's Cage does not stop dredge** — Cage prevents casting from GY/library; dredge doesn't cast anything; it's a draw-replacement that returns a card to hand.
- **Leyline of the Void intercepts milled cards (sends them to exile) but doesn't prevent the dredge card from returning to hand** — the dredge card was already in GY and goes to hand; only newly milled cards are affected by Leyline.
- **Rest in Peace completely shuts down Dredge** — RIP exiles all existing GY cards and prevents future cards from going to GY; dredge cards can't reach GY to be dredged from.
- **Against Notion Thief, apply dredge first** — choosing dredge before Notion Thief's redirect consumes the draw event entirely (mill+return); Notion Thief never redirects because no draw remains.

## Canonical Example
**Psychic Corrosion Misconception:**
You control Psychic Corrosion ({2}{U}: "whenever you draw a card, each opponent mills 2 cards").
You have Golgari Grave-Troll (dredge 6) in your graveyard.

Your draw step begins. You would draw a card.
You apply dredge: mill 6 cards, return Grave-Troll to your hand.

Question: Does Psychic Corrosion trigger? Each opponent mills 2?
Answer: NO. Dredge replaced the draw. The draw never happened. Psychic Corrosion's trigger condition ("whenever you DRAW a card") was never met. No milling happens.

Many players incorrectly think dredge is "drawing via the graveyard." It's not — it's replacing the draw entirely. This distinction has significant rules implications.

**Example 2 — Dredge vs. Grafdigger's Cage:**
Opponent controls Grafdigger's Cage ("players can't cast spells from graveyards or libraries").
You have Life from the Loam ({1}{G}: dredge 3) in your graveyard.

Your draw step: you would draw a card. Apply dredge 3.
Mill 3 cards. Life from the Loam returns to hand.

Grafdigger's Cage is irrelevant — you didn't CAST anything from GY. You returned a card to hand via a replacement effect. Cage only restricts casting.

Now you have Life from the Loam in hand. Cast it normally from hand ({1}{G}): return up to 3 lands from GY to hand.
Wait — Cage says "players can't cast spells from graveyards or libraries." Casting Life from the Loam from HAND is legal. Cast it.

Resolve: return lands from GY to hand.
Discard Life from the Loam at end of turn (if you loot it) or use it naturally.
It goes to GY. Next draw step: dredge it again.

The loop works through Grafdigger's Cage because dredge is a draw replacement, not a cast from GY.

## Commonly Confused With
- **P408 (Flashback/Madness)** — Flashback CASTS a card from GY. Dredge REPLACES A DRAW with mill+return. Both interact with GY contents, but the mechanism differs: flashback is a cast (stopped by Grafdigger's Cage); dredge is a replacement effect (not stopped by Cage).
- **P410 (Replacement Effect Ordering — GY Hate)** — P410 covers Leyline/RIP/Cage interactions with zone-dependent mechanics. Dredge falls under this but has the unique property that Cage doesn't affect it (while flashback/escape are stopped). P415 explores this distinction in detail.
- **P002 (Replacement Effects)** — Dredge is a replacement effect. The fundamental rule from P002 applies: it modifies an event (drawing) before that event occurs. Once dredge replaces the draw, the draw event is gone — no triggers for "when you draw" can fire.
- **P407 (Cycling/Kicker/Buyback)** — Cycling discards to draw a card; that draw CAN be replaced by dredge. If you cycle a card and then dredge the resulting draw, you get: the cycled card in GY + the dredge card in hand (instead of a drawn card).
