---
id: p242
name: Forecast — Activated Ability From Hand, Once Per Upkeep
category: stack
cr_refs: [702.57a, 702.57b]
tags: [forecast, hand, upkeep, reveal, Dissension, Ravnica, Pride-of-the-Clouds, Writ-of-Passage, Paladin-en-Vec]
created: 2026-03-28
examples_count: 2
---

# P242 — Forecast — Activated Ability From Hand, Once Per Upkeep

## Abstract
Forecast is a special activated ability that can only be activated from a player's hand, only during their own upkeep step, and only once per turn. When activated, the card with Forecast is revealed (shown to all players) and remains revealed until it either leaves the hand or until a non-upkeep step begins. This creates a unique strategic tension: you can use Forecast effects every turn without ever casting the card (keeping it in hand for repeated upkeep use), or cast it for its main effect. Forecast cards were printed exclusively in the Ravnica block's Dissension set. The key differentiator from normal activated abilities is the strict upkeep timing and the compulsory revelation.

## The Definitive Rules

**CR 702.57a** (verbatim): *"A forecast ability is a special kind of activated ability that can be activated only from a player's hand. It's written 'Forecast — [Activated ability].'"*

**CR 702.57b** (verbatim): *"A forecast ability may be activated only during the upkeep step of the card's owner and only once each turn. The controller of the forecast ability reveals the card with that ability from their hand as the ability is activated. That player plays with that card revealed in their hand until it leaves the player's hand or until a step or phase that isn't an upkeep step begins, whichever comes first."*

## The Pattern

```
FORECAST:
  Activated ability that functions ONLY in a player's HAND
  Activation timing: ONLY during the CARD OWNER'S upkeep step
  Frequency: ONCE per turn (not once per upkeep — same restriction)
  Revelation: card is revealed when activated, stays revealed until leaving hand or non-upkeep step

FORECAST + HAND REQUIREMENT:
  Card must be IN HAND to activate forecast
  If cast onto battlefield: forecast no longer functions (it's not in hand)
  Strategy: KEEP the card in hand for recurring upkeep use, OR cast it for the full effect
  This is the "forecast tension": ongoing small effect vs. immediate large effect

FORECAST + UPKEEP TIMING:
  Must be during YOUR OWN upkeep step
  Not opponent's upkeep, not draw step, not main phase
  The upkeep step allows priority: you announce forecast ability at start of upkeep
  Can you activate forecast multiple times per upkeep? NO — "only once each turn"

FORECAST + REVELATION:
  Revealing: opponent sees the card
  The revelation persists: opponents know what's in your hand (the forecasted card)
  Until the card leaves hand: it's visible to all
  This is a "cost" in information: opponent knows what you're holding

FORECAST CARDS (Dissension):
  Pride of the Clouds ({W}{U}): 1/1 Flying Bird, "when deals combat damage to player, draw a card", Forecast {W}{U} — "Reveal Pride of the Clouds from your hand: Create a 1/1 white and blue Bird creature token with flying."
    Forecast: create a 1/1 flier every upkeep for {W}{U} WITHOUT casting the card
    Cast Pride itself for {W}{U}: get a 2/2 (scales with flying creatures)
    Keep in hand: 1/1 token per turn (token army without tapping resources)

  Writ of Passage ({U}): Aura, "enchanted creature is unblockable", Forecast {U} — "Reveal Writ of Passage from your hand: Target creature with power 2 or less can't be blocked this turn."
    Forecast: make a creature unblockable once per upkeep for {U}
    Keep Writ of Passage in hand: each upkeep, choose a small creature → it's unblockable this turn
    Build around small unblockable threats without permanently committing the Aura

  Paladin en-Vec ({W}{W}): 2/2 First Strike, Protection from black and red (wait, this doesn't have Forecast)

  Cytoplast Manipulator ({2}{U}): 1/1, Forecast — {U}{U}: "Target creature with a +1/+1 counter is stolen until end of turn."
    Forecast: steal any countered creature every upkeep for {U}{U}
    Powerful: permanently keep a creature in your hand as a "steal engine" (no casting needed)

  Stoic Ephemera ({1}{W}{W}): "Forecast {W}: Target opponent can't cast more than one spell this turn."
    Each upkeep: tax an opponent's spell count for {W}.

FORECAST + SPELLS:
  Forecast can be found on sorceries and instants (which would otherwise be cast)
  The forecast ability lets you use the card's effect each turn without casting it
  Key: the card is USED as a hand resource, not a battlefield resource

FORECAST + MULTIPLE FORECAST CARDS:
  If you have two forecast cards: each can be used once per upkeep
  Each card's forecast is independent ("once per turn" applies per card)
  Two forecast birds: two activations of their respective forecast abilities per upkeep

FORECAST + DISCARD:
  If opponent uses Thoughtseize/Inquisition on your forecast card: loses the card entirely
  Forecast depends on having the card IN HAND — discard kills the forecast engine
  Reveal: opponent already knows what you're holding (forecasted card is visible)
  So: opponent can target the forecasted card specifically if they have hand disruption

FORECAST + COUNTERSPELLS:
  Can an opponent counter a forecast activation? No — forecast is an activated ability, not a spell
  Activated abilities can't be countered by normal counterspells (only Stifle, Disallow, etc.)
  But: the activated ability goes on the stack and can be responded to
```

## Definitive Conclusions

- **Forecast activates from hand only**, once per turn, during the controller's upkeep.
- **The card stays in hand** — you use the forecast effect repeatedly without casting.
- **The card is revealed** — opponents know what you're holding while it's being forecasted.
- **Cast vs. Forecast tension**: cast for the full permanent effect OR keep for recurring upkeep triggers.
- **Discard disrupts forecast completely** — losing the card ends the engine.

## Canonical Example
**Pride of the Clouds Forecast Engine:**
Pride of the Clouds ({W}{U}): 1/1 Flying Bird. Forecast {W}{U}: create a 1/1 white/blue Bird token with flying.
Turn 2: keep Pride of the Clouds in hand. Upkeep: forecast {W}{U} → create a 1/1 Bird token.
Turn 3: upkeep again → forecast → another 1/1 Bird token.
Turns 4-7: four more Bird tokens (6 total).
Now cast Pride of the Clouds: it's a 1+6 = 7/7 (plus flier count). Flying army in play!
OR: Never cast Pride. Just keep making tokens each upkeep. The tokens attack for free damage.
Forecast replaced the need to cast Pride until the moment is perfect.

**Example 2 — Cytoplast Manipulator Steal Loop:**
Cytoplast Manipulator ({2}{U}): 1/1. Forecast {U}{U}: gain control of target creature with a +1/+1 counter on it until end of turn.
Opponent controls Mikaeus, the Lunarch (with a +1/+1 counter) — their best creature.
Each upkeep: Forecast {U}{U} — steal Mikaeus for the turn.
Attack with Mikaeus: deal damage to opponent (or another opponent in multiplayer).
End of turn: Mikaeus returns to opponent.
Repeat each upkeep: recurring theft without ever casting the Manipulator.
If opponent removes the +1/+1 counter from Mikaeus: forecast can't target it → need a new target.
Synergy: use +1/+1 counter proliferate effects to keep opponent's creatures "stealable."

## Commonly Confused With
- **P233 (Echo)** — Echo triggers at upkeep requiring payment or sacrifice. Forecast is an activated ability you CHOOSE to use at upkeep for an effect.
- **P209 (Energy)** — Energy is a pool you spend at will (any time); Forecast is once-per-upkeep only.
- **P174 (Level Up)** — Level Up is a sorcery-speed activated ability to upgrade a creature; Forecast is an upkeep-only ability from HAND (doesn't require the card to be on the battlefield).
