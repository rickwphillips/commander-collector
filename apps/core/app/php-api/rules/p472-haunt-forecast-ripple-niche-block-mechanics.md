---
id: p472
name: Haunt, Forecast, and Ripple — Exile-on-Death-Trigger, Reveal-from-Hand Upkeep, and Same-Name Cascade
category: triggered
cr_refs: [702.58, 702.56, 702.57, 603.2, 603.6c, 400.7, 701.10, 500.4]
tags: haunt, forecast, ripple, formal-keyword, exile-on-death, hand-ability, same-name-cascade, ravnica, dissension, coldsnap
created: 2026-03-29
examples_count: 7
---

# P472 — Haunt, Forecast, and Ripple — Exile-on-Death-Trigger, Reveal-from-Hand Upkeep, and Same-Name Cascade

## Abstract

Three formal keywords from Ravnica block and Coldsnap with unique mechanics that barely overlap with common play patterns: **Haunt** (CR 702.58, Ravnica) is a keyword ability that exiles the card when it leaves the battlefield (or the GY for instants/sorceries) onto a target creature, then triggers when that haunted creature dies; **Forecast** (CR 702.56, Dissension) is a hand-activated ability that lets you reveal the card from your hand during your upkeep to produce a weaker version of its effect; and **Ripple N** (CR 702.57, Coldsnap) reveals the top N cards of your library when a Ripple spell is cast and lets you cast any spells of the same name for free (which then also trigger Ripple, potentially chaining).

## The Definitive Rules

### Haunt (CR 702.58)
**CR 702.58a verbatim:** *"When [this card] is put into a graveyard from anywhere, exile it haunting target creature."*

Or for creatures: *"When [this creature] dies, exile it haunting target creature."*

**CR 702.58b verbatim:** *"The ability that refers to the haunted creature triggers when the haunted creature dies."*

Haunt on a spell (instant/sorcery): when the spell resolves, the card goes to the GY, then haunt triggers to exile it onto a creature. The haunted creature later dying triggers the haunt payoff.

Haunt on a creature: when the creature dies, it haunts a target creature. When the haunted creature dies, the payoff triggers.

### Forecast (CR 702.56)
**CR 702.56a verbatim:** *"Forecast [cost] means '[Cost], Reveal this card from your hand: [Effect]. Activate this ability only during your upkeep and only once each turn.'"*

Forecast is an activated ability of the card while it's in your hand. You pay the cost and reveal the card from your hand to get the effect. The card stays in your hand.

### Ripple N (CR 702.57)
**CR 702.57a verbatim:** *"Ripple N means 'When this spell is cast, reveal the top N cards of your library. You may cast any card with the same name as this spell revealed this way without paying its mana cost. Put the rest on the bottom of your library in any order.'"*

Ripple chains: the freely cast copies also have Ripple and trigger their own Ripple, potentially cascading if more copies exist in the library.

## The Pattern

```
HAUNT pattern (spells):
1. Cast the haunt spell (instant/sorcery)
2. Spell resolves → card goes to GY
3. Haunt trigger: exile the card from GY "haunting target creature"
   → Choose a creature to haunt (usually an opponent's creature you want to watch die)
   → The card is now in exile, linked to the haunted creature
4. When the haunted creature dies:
   → The haunt payoff ability triggers
   → The trigger usually replicates the original spell's effect

Key interactions:
  → The haunted creature is in "exile" and linked; if the card is exiled from elsewhere
    (exile effect that hits the haunt exile zone), the link breaks
  → Haunting a creature that's indestructible: the trigger never fires
    (indestructible creatures can't die from damage/destroy effects)
  → Using the haunt card's own death trigger to remove the indestructible blocker
    and then re-haunt a new creature: requires the indestructible creature to die somehow
  → The haunting card in exile is face-up but "attached" to the creature
  → Multiple haunts on the same creature: each fires separately when it dies

HAUNT pattern (creatures):
1. Haunt creature dies
2. Trigger: exile the dead creature "haunting target creature"
3. When haunted creature dies: haunt payoff triggers

FORECAST pattern:
Activation: "[Cost], Reveal this card from your hand:"
  → "Only during your upkeep" — tightest timing restriction in the game
  → "Only once each turn" — one forecast activation per upkeep max
  → Card STAYS in your hand after activation (not discarded, not played)
  → The effect is a weaker version of the spell's main effect
  → The card in hand functions as a passive resource generator each turn
  → Opponents know you have the card (you reveal it) — information leak
  → The forecast activation IS an activated ability → can be Stifled/countered
  → Countering forecast: the cost was already paid, the card stays in hand,
    but the effect doesn't happen

RIPPLE N pattern:
Triggered: "When this spell is cast, reveal the top N cards of your library"
  → Triggers when the spell is cast (on the stack, before resolution)
  → Reveal N cards: check for same-name cards
  → May cast same-name cards WITHOUT PAYING their mana cost:
    → These are FREE CASTS of additional copies
    → Each free cast goes on the stack
    → Each free cast ALSO triggers Ripple → reveal N more cards → potentially more free casts
  → Non-matching cards go to the BOTTOM of library (in any order)
  → Chain length: bounded by number of copies in the library
    → With 4 copies of a spell in a 20-card library: Ripple 4 can potentially cast all 4 in a chain
  → Important: Ripple triggers when the spell is CAST, not when it resolves
    → Ripple triggers go on the stack above the spell
    → Ripple reveals and free casts happen before the original spell resolves
    → The free casts also trigger Ripple and go on the stack
    → Eventually all Ripple triggers resolve, then all the spells resolve LIFO
```

## Definitive Conclusions

**Haunt:**
- Haunt on a creature works powerfully with sacrifice effects: sacrifice your haunting creature to a Viscera Seer, then haunt an opponent's creature. When that creature dies later, your haunt payoff triggers. You chose when to die and chose the "follow target."
- The haunting creates an asymmetric death-watch: you want the haunted creature to die; the opponent wants to keep it alive. This creates interesting play patterns where the opponent protects a weak creature just to prevent the haunt trigger.
- Removing the haunted creature from the battlefield via exile doesn't trigger haunt — haunt specifically fires when the haunted creature "dies" (goes from battlefield to GY). Swords to Plowshares exiling the haunted creature does NOT trigger the haunt payoff.
- Key card: *Cry of Contrition* (RAV): Instant with haunt. "Target player discards a card. Haunt (When this spell is put into a graveyard, exile it haunting target creature. When the haunted creature dies, its controller discards a card.)" Two discard effects — one when cast, one when the haunted creature dies. (Note: Plagued Rusalka does NOT have haunt — she has a sacrifice-for-debuff activated ability.)
- Key card: *Cry of Contrition* (RAV): "Target player discards a card. Haunt." Haunts a creature; when that creature dies, the player discards again.

**Forecast:**
- Forecast is a unique "engine card" design: the spell sits in your hand providing a small ongoing effect every upkeep, or you can eventually cast it for the full effect. Choosing when to cast vs. when to keep forecasting is the skill.
- Forecast + Reliquary Tower or maximum hand size effects: keeping the forecast card in hand is never a liability since it's generating value while there.
- Key card: *Aethermage's Touch* (DIS): "Reveal the top four cards of your library. You may put a creature card from among them onto the battlefield. Return that creature to your hand at the beginning of the next end step. Put the rest on the bottom of your library in any order. Forecast — {2}{W}{U}, Reveal Aethermage's Touch from your hand: Return target creature to its owner's hand." The forecast (upkeep, once per turn) bounces a creature for {2}{W}{U}; the full spell puts a creature from the top 4 directly into play.
- Key card: *Sinew Sliver* (PLC): Has forecast to give all slivers +1/+1 until EOT.

**Ripple:**
- Ripple is most powerful in dedicated Ripple decks built around one specific spell. In a deck with 20 copies of the same cheap spell (using multiple card names with the same spell text isn't possible, but close with proxies in casual), Ripple creates an avalanche of free casts.
- Ripple 4 with 4 copies in a 40-card deck: first cast reveals 4 cards. If 2 copies are in the top 4: both cast for free, each triggering Ripple again. Four more cards revealed... theoretically chain until all copies are cast.
- In competitive play, Ripple is only used on *Surging Flame*, *Surging Dementia* etc. (the "Surging" cycle from Coldsnap), but even then requires concentrated copies.
- Key card: *Surging Flame* (CSP): "Surging Flame deals 2 damage to any target. Ripple 4." Four-of in a deck with other Surging spells. Cast Surging Flame, Ripple reveals 4 cards, find another Surging Flame, cast for free, Ripple again...

## Canonical Examples

**Haunt:**
- *Cry of Contrition*: Target player discards 1 on cast. Haunts a creature. On that creature's death, player discards again. Two discard triggers from one cheap black spell.

**Forecast:**
- *Aethermage's Touch*: Keep it in hand for bounce-per-upkeep. Cast it when you need the creature-from-top effect. Engine card that improves from multiple upkeeps.

**Ripple:**
- *Surging Flame* (CSP): Four copies in 60-card deck. First cast: Ripple 4 reveals 4 cards. If one more copy found: free cast, Ripple 4 again. Chain: up to 4 × 2 damage per chain for a cost of 2 mana initially.

## Commonly Confused With

- **P039** (Aura Attachment/Enchanting) — Haunt exiles a card "onto" a creature as a form of attachment, but the card is in exile, not attached as an Aura; the haunted creature dying triggers the haunt payoff
- **P010** (Activated Abilities — Timing) — Forecast is an activated ability with the most restrictive timing (once per upkeep); understanding activated ability timing (CR 117.1b) is prerequisite
- **P034** (Cascade) — Ripple is like Cascade but for same-name cards only; Cascade finds a cheaper card of different name; both create a "chain" of free casts
- **P411** (Splice onto Arcane) — Splice is also a "cast the spell with text from hand" mechanic; Forecast is "activate from hand without casting"; both keep the card in hand but different mechanisms
