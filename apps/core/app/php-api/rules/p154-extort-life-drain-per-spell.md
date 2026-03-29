---
id: p154
name: Extort — Life Drain Triggered by Casting Spells
category: triggered
cr_refs: [702.101a, 702.101b]
tags: [extort, life-drain, life-gain, triggered, Orzhov, each-opponent, multiplayer, Thrull, Syndic]
created: 2026-03-28
examples_count: 2
---

# P154 — Extort — Life Drain Triggered by Casting Spells

## Abstract
Extort is a triggered ability: whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain life equal to the total life lost. In multiplayer (Commander), this drains 1 life per opponent — with 3 opponents, each spell extorted drains 3 life and gains you 3 life. Multiple extort permanents trigger separately, so each extort pays separately. The hybrid {W/B} cost means extort works in both white and black decks. This is a pure incremental engine: every spell cast is an opportunity to drain.

## The Definitive Rules

**CR 702.101a** (verbatim): *"Extort is a triggered ability. 'Extort' means 'Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain life equal to the total life lost this way.'"*

**CR 702.101b** (verbatim): *"If a permanent has multiple instances of extort, each triggers separately."*

## The Pattern

```
EXTORT:
  Triggered: whenever you cast any spell → triggered ability goes on stack
  Optional: "you may pay {W/B}" — choice made at resolution
  Effect: if paid, each opponent loses 1 life; you gain life = total life lost

  EXTORT + LIFE TOTAL:
    1v1: each spell extorted → each opponent loses 1, you gain 1 (net life swing: 2)
    3 opponents (Commander): each loses 1 → you gain 3 (net life swing: 6 per extorted spell)
    Extort is VASTLY more powerful in Commander than in 1v1

  EXTORT + COST:
    {W/B} is a hybrid mana symbol: can be paid with white OR black mana
    You choose to pay (or not) at resolution of the trigger
    The spell that triggered it is already cast; extort doesn't affect the spell

  EXTORT + MULTIPLE INSTANCES:
    Syndic of Tithes (extort) + another extort permanent → 2 separate triggers
    Each triggers separately → pay {W/B} for each → each opponent loses 1 per trigger
    Two extort triggers paid: opponent loses 2, you gain 2 (1v1) or gain 6 (3 opponents)

  EXTORT + ANY SPELL:
    Triggered by CASTING any spell (including lands? No, playing a land is not casting)
    Spells: sorceries, instants, creatures, enchantments, artifacts, planeswalkers
    Even casting a cantrip or a cheap spell → extort trigger
    High-frequency cheap spells (rituals, Signets): maximize extort triggers

  EXTORT + LIFE GAIN SYNERGIES:
    Life gained from extort: triggers "whenever you gain life" abilities
    Karlov of the Ghost Council: "Whenever you gain life, put two +1/+1 counters on Karlov"
    Multiple extorts + Karlov: gain life → Karlov gets counters rapidly
    Aetherflux Reservoir: gain life threshold effects → extort helps charge it

  EXTORT + INVIOLABILITY:
    Opponents at 0 life lose the game
    Extort slowly drains life → game closer strategy in Commander
    Without direct damage: extort is the kill condition

  EXTORT AS CLOCK:
    40-life Commander game: drain 1 per opponent per spell cast
    With 30 spell casts in a game: 30 drains × 3 opponents = 90 life drained total
    If you cast 2 spells per turn and have 2 extort triggers: 4 drains per turn
    4 × 3 opponents = 12 life per turn across the table
```

## Definitive Conclusions

- **Extort triggers on every spell you cast** — you choose to pay {W/B} at resolution.
- **Scales with opponents** — Commander games maximize extort's value.
- **Multiple extort triggers stack** — each is a separate trigger, paid separately.
- **Life gained triggers "whenever you gain life" abilities** — synergizes with Karlov, Reservoir, etc.
- **Long-game win condition** in enchantment/creature-heavy Orzhov strategies.

## Canonical Example
**Blind Obedience (Extort):**
Enchantment that also makes opponent's artifacts and creatures enter tapped.
Each spell you cast → extort trigger → pay {W/B} → opponent loses 1, you gain 1.
In Commander: cast 5 spells in a turn, pay {W/B} five times → each of 3 opponents loses 5 life, you gain 15 life.
Combine with Karlov of the Ghost Council (gain life → put 2 counters on Karlov) → Karlov grows 10 counters in that turn.

**Example 2 — Crypt Ghast (Extort + Mana Doubling):**
Crypt Ghast: "Whenever you tap a Swamp for mana, add an additional {B}"
Also has extort. In a mono-black Commander deck: double mana + extort every spell.
Recurring Nightmare + extort → each re-cast drains opponents; Crypt Ghast enables high mana to keep re-casting.

## Commonly Confused With
- **P076 (Mentor)** — Mentor triggers on attacks. Extort triggers on spell casts. Both are triggered payoffs.
- **P142 (Dethrone)** — Dethrone adds counters by attacking. Extort drains life by casting spells. Both scale in multiplayer.
- **P101 (Extort vs Replicate)** — Replicate copies a spell multiple times. Extort drains per cast, not per spell copy (though a copied extort spell would re-trigger all extort instances).
