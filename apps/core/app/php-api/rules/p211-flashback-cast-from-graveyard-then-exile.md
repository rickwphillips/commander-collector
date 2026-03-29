---
id: p211
name: Flashback — Cast Instant/Sorcery from Graveyard, Then Exile
category: costs
cr_refs: [702.34a]
tags: [flashback, graveyard-cast, alternative-cost, exile-after-use, instant-sorcery, Snapcaster-Mage, Increasing-Vengeance, Innistrad]
created: 2026-03-28
examples_count: 2
---

# P211 — Flashback — Cast Instant/Sorcery from Graveyard, Then Exile

## Abstract
Flashback allows casting an instant or sorcery from the graveyard by paying its flashback cost (an alternative cost) instead of its normal mana cost. Once the flashback spell leaves the stack (whether it resolves or is countered), it's exiled instead of going anywhere else. This gives every flashback spell a second use — but one-time-only from the graveyard. Snapcaster Mage's famous ability gives flashback to a spell in the graveyard for one turn, enabling powerful instant-speed plays.

## The Definitive Rules

**CR 702.34a** (verbatim): *"Flashback appears on some instants and sorceries. It represents two static abilities: one that functions while the card is in a player's graveyard and another that functions while the card is on the stack. 'Flashback [cost]' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by paying [cost] rather than paying its mana cost' and 'If the flashback cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack.' Casting a spell using its flashback ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
FLASHBACK:
  Functions from the graveyard (static ability)
  May cast from graveyard: pay FLASHBACK cost instead of mana cost
  After leaving the stack: exiled (whether resolved or countered)

FLASHBACK + SNAPCASTER MAGE:
  Snapcaster Mage ETB: "When Snapcaster Mage enters, target instant or sorcery in your graveyard
  gains flashback until end of turn. The flashback cost is equal to its mana cost."
  Snapcaster: gives flashback with the ORIGINAL mana cost as the flashback cost
  So: cast the flashback'd spell for its normal cost (but from graveyard = second use)
  After the Snapcaster-targeted spell resolves: exiled
  Net: Snapcaster Mage enables a second cast of any instant/sorcery at full cost

FLASHBACK + COST:
  Flashback cost can be different from the mana cost:
  - Cheaper: Cabal Therapy has flashback "sacrifice a creature" (no mana!)
  - More expensive: some flashback costs cost more than original
  - Different color: allows off-color use if you produce that mana
  - Life payment: some flashback costs include paying life

FLASHBACK + COUNTERING:
  If the flashback spell is countered: it's still exiled (not put into graveyard)
  You can't "replay" the flashback spell after it's been countered — exiled means gone

FLASHBACK + GRAVEYARD INTERACTION:
  Snapcaster + Cabal Therapy flashback:
  Snapcaster enters: target Cabal Therapy in graveyard → gains flashback {mana cost} (it was {B})
  But Cabal Therapy ALREADY has flashback "sacrifice a creature"
  Which flashback applies? Both flashback abilities exist on it simultaneously
  Choose which flashback cost to pay when casting from graveyard: {B} (Snapcaster's) or sacrifice a creature
  Both are valid; choose the cheaper/more convenient one

FLASHBACK + CARDS IN EXILE:
  Once exiled by flashback: gone from game (no zone to return from normally)
  Unless effects like Eternal Witness can't get it (it's in exile, not graveyard)
  "Return from exile" effects could retrieve it, but that's unusual

FLASHBACK + DREDGE:
  Dredge (P149) returns cards by replacing draws
  If a flashback card is in the graveyard: can be flashback'd OR can be dredge returned (if it had dredge)
  But standard flashback cards don't have dredge

FLASHBACK + STORM:
  Cast a flashback spell → storm trigger copies it N times
  Storm count includes all spells cast this turn (including the flashback spell itself)
  Grapeshot with flashback: cast from hand (storm copies 1+N), then flashback cast (storm copies again!)

FLASHBACK + TYPES CHECK:
  "If the resulting spell is an instant or sorcery spell" — flashback requires the spell to be instant or sorcery
  Enchantments/creatures/lands don't have flashback normally
  If a non-I/S card somehow gained flashback: can't use it (resulting spell wouldn't be instant or sorcery)

NOTABLE FLASHBACK CARDS:
  Snapcaster Mage: enables flashback on any I/S in graveyard
  Cabal Therapy: {B} / Flashback: sacrifice a creature → discard from any opponent's hand
  Lingering Souls: {1}{W} / Flashback {1}{B} → creates multiple flying tokens
  Faithless Looting: {R} draw 2, discard 2 / Flashback {2}{R} → reuse in graveyard
  Increasing Vengeance: Flashback: when cast via flashback, copies are doubled
```

## Definitive Conclusions

- **Flashback = cast from graveyard for flashback cost** (alternative to mana cost).
- **Exiled when leaving the stack** — whether resolved or countered; one-time-only use.
- **Snapcaster Mage** grants flashback at full mana cost — second use for any instant/sorcery.
- **Flashback + Storm**: casting from graveyard builds storm count and triggers storm copies.
- **Countering a flashback spell** still exiles it — no refund to graveyard.

## Canonical Example
**Faithless Looting ({R}) with Flashback {2}{R}:**
Turn 1: Cast Faithless Looting from hand ({R}): draw 2, discard 2. It goes to graveyard.
Turn 5: Cast Faithless Looting from graveyard via flashback ({2}{R}): draw 2, discard 2. It's exiled.
Total: 4 cards drawn, 4 cards discarded, for {R}+{2}{R}={2}{R}{R}.
Dredge and Hollow One decks: discard Bloodghast and Vengevine, refuel hand with looting.

**Example 2 — Snapcaster Mage + Cryptic Command:**
Opponent casts a dangerous spell. You have Cryptic Command ({1}{U}{U}{U}) in graveyard.
Cast Snapcaster Mage ({1}{U}): ETB → target Cryptic Command → gains flashback {1}{U}{U}{U}.
Immediately (Snapcaster ETB trigger resolving): hold priority, respond to Snapcaster ETB going on stack?
No — ETB is on the stack. Snapcaster resolves: Cryptic Command has flashback.
Now cast Cryptic Command via flashback ({1}{U}{U}{U}): counter threat, draw a card, etc.
Snapcaster Mage in Modern: ubiquitous for this pattern — 2/1 flash + spell replay for {1}{U}.

## Commonly Confused With
- **P197 (Mayhem)** — Mayhem requires discarding the card THIS TURN. Flashback has no such condition.
- **P168 (Escape)** — Escape exiles N other cards to cast. Flashback just pays alternative cost (no exiling other cards).
- **P190 (Harmonize)** — Harmonize taps a creature for the cost; Flashback pays a mana cost. Both exile after use.
