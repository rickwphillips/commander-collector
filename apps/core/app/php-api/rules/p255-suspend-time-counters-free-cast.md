---
id: p255
name: Suspend — Time Counters in Exile, Free Cast When Last Removed
category: zones
cr_refs: [702.62a, 702.62b, 702.62c, 702.62d]
tags: [suspend, time-counter, exile, free-cast, haste, Coldsnap, Time-Spiral, Ancestral-Vision, Living-End, Lotus-Bloom, cascade]
created: 2026-03-28
examples_count: 2
---

# P255 — Suspend — Time Counters in Exile, Free Cast When Last Removed

## Abstract
Suspend is a keyword representing three abilities. First, a static ability while in hand: you may pay the suspend cost and exile the card with N time counters instead of casting it. Second, a triggered ability while suspended (in exile with time counters): at the beginning of your upkeep, remove a time counter. Third, a triggered ability: when the last time counter is removed, you may cast the spell for free; if it's a creature, it gains haste. Suspend creates a "cast now for free in N turns" tradeoff — you give up the card temporarily in exchange for casting it for free later. Classic suspended cards include Ancestral Vision (draw 3 for free in 4 turns), Living End (mass recursion for free in 3 turns), and Lotus Bloom (Black Lotus in 3 turns).

## The Definitive Rules

**CR 702.62a** (verbatim): *"Suspend is a keyword that represents three abilities. The first is a static ability that functions while the card with suspend is in a player's hand. The second and third are triggered abilities that function in the exile zone. 'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able. If you don't, it remains exiled. If you cast a creature spell this way, it gains haste until you lose control of the spell or the permanent it becomes.'"*

**CR 702.62b** (verbatim): *"A card is 'suspended' if it's in the exile zone, has suspend, and has a time counter on it."*

## The Pattern

```
SUSPEND:
  From hand: pay suspend cost + exile card with N time counters (this action doesn't use the stack)
  Each upkeep: remove 1 time counter
  When last time counter removed: you may cast for FREE (without paying mana cost)
  Creature spells cast this way: gain haste

SUSPEND + TIMING:
  Suspending the card is NOT casting (it's a special action)
  Can only suspend if you "could begin to cast" the card from hand
  This means: sorcery-speed cards can only be suspended during your main phase (when you have priority and stack is empty... wait)
  Actually: suspending uses "if you could begin to cast" = checking timing as if you were going to cast it
  A sorcery: can begin to cast during your main phase with stack empty → can suspend then
  An instant: can suspend any time you have priority

SUSPEND + PROLIFERATE:
  Proliferate adds time counters to suspended cards: DELAYS the free cast
  Usually bad: proliferating your own suspended cards makes them wait longer
  But: can be used to extend/stagger the timing
  Proliferating opponents' suspended cards: also delays their free cast

SUSPEND + COUNTER REMOVAL:
  Opponent can remove time counters from your suspended cards (via effects)
  Removing counters: accelerates the free cast!
  Jhoira of the Ghitu: "exile a nonland card with 4 time counters. Remove 1 at start of each upkeep."
    This functions like suspend but isn't actually the suspend keyword
    Suspend-like effects: same concept, different mechanics

SUSPEND CARDS (key competitive examples):
  Ancestral Vision ({Suspend 4—U}, Sorcery): "Target player draws 3 cards."
    No casting cost: can ONLY be cast via suspend or cheated.
    Suspend 4: spend {U} → in 4 upkeeps → draw 3 for FREE.
    In Modern/Legacy: Ancestral Vision is a 1-mana investment for 3 cards in 4 turns.
    With acceleration (removing counters, Jhoira effects): can come down faster.

  Living End ({Suspend 3—2}{B}, Sorcery): "Each player exiles all creature cards from their GY, then sacrifices all creatures. Each player returns all exiled cards to the battlefield."
    No casting cost: only via suspend or cascade (cascade finds the FIRST card with lower CMC — but Living End has no mana cost → MV = 0 → cascade can find it!)
    Cascade + Living End: cascade into Living End → cast for free immediately.
    Modern Living End deck: run cascade spells to cheat Living End into play.

  Lotus Bloom (Suspend 3—{0}, Artifact): "Sacrifice: add {W}{W}{W} or {U}{U}{U} or {B}{B}{B} or {R}{R}{R} or {G}{G}{G}."
    Free cast in 3 turns: equivalent to a Black Lotus.
    After 3 upkeeps: sacrifice for 3 mana of any one color.
    Accelerant: Modern Amulet Titan uses Lotus Bloom for early mana ramp.

  Rift Bolt ({Suspend 1—R}, Sorcery): "Rift Bolt deals 3 damage to any target."
    Suspend 1—{R}: pay {R} → in 1 upkeep → deal 3 damage for free.
    OR cast normally: {2}{R} = 3 damage immediately.
    Suspend means: spend {R} now, deal 3 damage on your NEXT TURN's upkeep (1 time counter).
    In burn decks: suspend Rift Bolt, opponent takes 3 next turn. Efficient tempo play.
    Popular: Modern burn runs Rift Bolt as "Lightning Bolt on a delay" for 1 mana.

SUSPEND + HASTE FOR CREATURES:
  Creatures cast via suspend resolve and gain haste immediately
  This is important: a 5/5 Eldrazi suspended for 3 turns enters with haste → attack same turn
  Even if the creature normally doesn't have haste: suspend grants it

SUSPEND + INABILITY TO CAST:
  When the last time counter is removed: "you MAY cast it... if able."
  If you can't cast it (e.g., effects prevent casting): it remains in exile
  But: you lose the suspension window (it's no longer "suspended" after the counter removed)
  Wait: "suspended" = in exile + has suspend + has time counter (CR 702.62b)
  When the last counter is removed: no more time counters → no longer "suspended"
  It stays in exile but can no longer be suspended (no counters) and wasn't cast
  The card is just in exile indefinitely (can't be retrieved via suspend mechanism again)

SUSPEND + CASCADE:
  Cascade exiles cards from library until finding one with lower MV than the cascade spell
  Cards with SUSPEND have no mana cost: their MV = 0
  A cascade spell with MV ≥ 1 can cascade into a suspended card (0 MV)
  Living End, Ancestral Vision, Lotus Bloom: all MV 0 → cascade targets
  Cascade into them: they're CAST for free immediately (not suspended — cast via cascade's effect)
  This is the Modern "Cascade" archetype: Living End, Glimpse of Tomorrow, etc.
```

## Definitive Conclusions

- **Suspend N** exiles the card with N time counters; each upkeep removes one; when last removed, cast for free.
- **Creature spells cast via suspend get haste** — can attack immediately.
- **Proliferate delays suspend** — usually detrimental to proliferate your own suspended cards.
- **Cards with no mana cost have MV 0** — cascade can find them as the cheapest target.
- **Living End + cascade** is a premier Modern combo: cascade into Living End → mass recursion for free.

## Canonical Example
**Living End in Modern:**
Turn 3. Suspend Living End earlier? No — the actual Living End deck plan uses cascade.
Turn 1: Cycle Monstrous Carabid (discard to draw). Monstrous Carabid is in GY.
Turn 2: Cycle Architects of Will (discard to draw). More creatures in GY.
Turn 3: Cast Violent Outburst ({1}{R}{G}, Cascade, MV 3, "creatures you control get +1/+0 until EOT"). Cascade triggers: exile cards from top of library until finding one with MV < 3. Finding Living End (MV 0)... cast Living End for free.
Living End resolves: both players exile creatures from GY, sacrifice all creatures in play, return all exiled creatures to battlefield.
Your 5-6 large creatures from GY return. Opponent's minimal creatures return. Massive board advantage.
Cascade is why Living End was banned then unbanned in Modern with targeting restrictions.

**Example 2 — Ancestral Vision Slow Roll:**
Turn 1: Suspend Ancestral Vision by paying {U}. Vision goes to exile with 4 time counters.
Turns 2-5 upkeep: remove a time counter each turn.
Turn 5 upkeep (after 4 removals): last time counter removed → cast Ancestral Vision for free.
Draw 3 cards. Investment: {U} on turn 1. Return: 3 cards on turn 5.
In control decks: 1-mana investment, 3 cards later. Powerful slow-play card advantage.

## Commonly Confused With
- **P233 (Vanishing)** — Vanishing also uses time counters but sacrifices when the last one is removed; Suspend casts for free when the last is removed.
- **P172 (Foretell)** — Foretell exiles face-down for an alternative cost next turn (1 turn delay); Suspend exiles face-up with a multi-turn countdown.
- **P240 (Dredge)** — Dredge returns from GY by replacing draw; Suspend comes from exile via time counters.
