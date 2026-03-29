---
id: p229
name: Ripple, Transmute, and Bloodthirst — Graveyard Search and Counter Conditions
category: costs
cr_refs: [702.57a, 702.57b, 702.58a, 702.61a, 702.61b]
tags: [ripple, transmute, bloodthirst, Coldsnap, Ravnica, Gruul, Dimir, Coldsteel-Heart, Muddle-the-Mixture, Silhana-Ledgewalker]
created: 2026-03-28
examples_count: 2
---

# P229 — Ripple, Transmute, and Bloodthirst — Graveyard Search and Counter Conditions

## Abstract
Three smaller Ravnica/Coldsnap mechanics grouped together. **Ripple N**: when cast, may reveal top N cards of library and cast all free copies of the same card found. **Transmute [cost]**: discard this card and pay transmute cost to search library for a card with the same mana value. **Bloodthirst N**: if an opponent was dealt damage this turn before you cast this, it enters with N +1/+1 counters. These three mechanics collectively demonstrate: cascade-variant value (Ripple), tutoring via discard (Transmute), and conditional ETB counter growth (Bloodthirst).

## The Definitive Rules

**CR 702.57a** (verbatim): *"Ripple is a triggered ability. 'Ripple N' means 'When you cast this spell, you may reveal the top N cards of your library. If you do, you may cast any number of cards with the same name as this spell from among those revealed cards without paying their mana costs. Then put the rest of the revealed cards on the bottom of your library in any order.'"*

**CR 702.58a** (verbatim): *"Transmute is an activated ability that functions only while the card with transmute is in a player's hand. 'Transmute [cost]' means '[Cost], Discard this card: Search your library for a card with the same mana value as this card, reveal it, and put it into your hand. Then shuffle your library. Activate only as a sorcery.'"*

**CR 702.61a** (verbatim): *"Bloodthirst is a static ability. 'Bloodthirst N' means 'If an opponent was dealt damage this turn, this permanent enters the battlefield with N +1/+1 counters on it.'"*

## The Pattern

```
RIPPLE:
  Triggered: "when you cast this spell, you may reveal top N cards"
  If revealed: cast any cards with the SAME NAME as this spell for free
  The free casts can also trigger Ripple (chain!)
  Example: Cast Surging Flame → ripple 4 → reveal top 4, find another Surging Flame → cast it free → ripple 4 again → find another copy → chain!
  Ripple is like Storm but requires finding identical cards (same name) in the top N

  RIPPLE + DECK CONSTRUCTION:
    4 copies of a Ripple card: maximizes chances of cascading
    Library thinning: as copies are cast, fewer remain in library
    Best in dedicated Ripple decks (Coldsnap Limited format primarily)

  RIPPLE CARDS (Coldsnap):
    Surging Flame ({1}{R}): 1 damage to any target, Ripple 4
    Surging Sentinels ({1}{W}{W}): 2/1 first strike, Ripple 4
    Multiple Surging spells in the same mana cost: chain activations

TRANSMUTE:
  Activated ability in HAND: pay cost + discard → search for card with same MANA VALUE
  Sorcery speed only
  Discard the transmute card to find a card of the exact same CMC
  Example: Muddle the Mixture (Transmute {1}{U}{U}): discard Muddle → find any 2-CMC card
  The CMC of Muddle the Mixture is {1}{U}{U} = 3... wait, transmute searches for "same mana value as this card"
  Muddle the Mixture ({1}{U}{U}) = mana value 3: transmute finds any 3-cost card

  TRANSMUTE + TUTORING:
    Find any card at the target mana value: extremely flexible tutoring
    Dimir Infiltrator ({1}{U}{B}): Transmute {1}{U}{B} → search for any 3-cost card
    Perplex ({1}{U}{B}): Transmute {1}{U}{B} → any 3-cost card
    Chain of Plasma ({R}): Transmute {1}{U}{B}? No — need to check actual card costs.
    Example: Tolaria West ({0} land with transmute {1}{U}{U}): find ANY 0-cost card!
    Tolaria West searches for: Engineered Explosives, Mox Opal, Lotus Bloom, Dark Depths, etc.
    Tolaria West is heavily played in Modern/Legacy for this reason.

  TRANSMUTE + COLORS:
    Transmute costs are usually 3 mana (the most common transmute window)
    But the CMC of the transmute card determines what it finds
    Tolaria West (0-cost land): finds 0-CMC cards — uniquely powerful

BLOODTHIRST:
  Static: "If an opponent was dealt damage this turn, this permanent enters with N +1/+1 counters."
  Damage must be dealt BEFORE casting (any opponent taking damage enables it)
  Once enabled: any Bloodthirst creature you cast gets the counters
  If no opponent took damage: creature enters without counters

  BLOODTHIRST + ENABLERS:
    Shock, Lightning Bolt: deal damage to opponent → enable bloodthirst
    Fetch lands (opponent doesn't pay life) → no damage
    Fetch lands (you pay life) → also no help (OPPONENT must take damage)
    "If an opponent was dealt damage" — life loss from spells (not damage) doesn't count
    Only DAMAGE (direct damage events)

  BLOODTHIRST + LIFELINK:
    You deal damage to opponent with lifelink → opponent takes damage → bloodthirst enabled
    You also gain life. Bloodthirst doesn't care about life gain — just "was damage dealt"

  BLOODTHIRST CARDS:
    Gorehorn Minotaurs ({2}{R}{R}): 3/3 Bloodthirst 2 → enter as 5/5 if bloodthirsted
    Scab-Clan Mauler ({R}{G}): 1/1 Bloodthirst 2 → enters as 3/3
    Pyreheart Wolf ({2}{R}): 1/1 Bloodthirst 2 → 3/3 with "whenever attacks, all blockers it has were assigned"
    Gruul Bloodthirst package in aggressive red-green decks

  BLOODTHIRST + MULTIPLE:
    Multiple Bloodthirst permanents: each checks "was an opponent dealt damage this turn"
    If yes: all Bloodthirst creatures entering get their counters
    One damage event enables all Bloodthirst for the entire turn
```

## Definitive Conclusions

- **Ripple**: trigger on cast, may chain-cast identical cards from top N of library for free.
- **Transmute**: discard + pay cost to find any card with the same mana value (sorcery-speed tutor).
- **Bloodthirst N**: ETB +1/+1 counters if an opponent was dealt damage this turn (any damage source).
- **Tolaria West** (Transmute for 0-cost cards) is the most powerful transmute card in competitive play.
- **Bloodthirst** is "one damage event enables all" — efficient to enable with cheap burn spells.

## Canonical Example
**Tolaria West (Transmute) in Modern Depths combo:**
Tolaria West is an Island that enters tapped, produces {U}.
But: Transmute {1}{U}{U}: discard Tolaria West, pay {1}{U}{U}, search for any 0-cost card.
Find: Dark Depths ({0} land: "Put 9 ice counters on Dark Depths as it enters. Remove an ice counter from Dark Depths at the beginning of your upkeep. When no ice counters remain, sacrifice Dark Depths: create a 20/20 black legendary Avatar creature token with flying and indestructible.").
Or find Lotus Bloom ({0}: suspend 3, add {W}{W}{W} or {U}{U}{U} or {B}{B}{B} when resolved).
Or Engineered Explosives ({0}: sunburst, enters with charge counters).
Transmute turns a land into a flexible 0-cost tutor. Extremely powerful toolbox.

**Example 2 — Bloodthirst in Gruul Aggro:**
Turn 1: Goblin Guide attacks → opponent takes 2 combat damage.
"Bloodthirst" is now enabled for the rest of this turn.
Turn 2: Cast Gorehorn Minotaurs ({2}{R}{R}) — Bloodthirst 2: enters with two +1/+1 counters.
Normally 3/3; with bloodthirst: enters as 5/5.
5/5 on turn 2 for 4 mana (after enabling with Goblin Guide) — aggressive board presence.
Turn 3: Did opponent take damage this turn? If you attacked with Goblin Guide again → 5/5 Bloodthirst creature entering.

## Commonly Confused With
- **P156 (Cascade)** — Cascade exiles until it finds a cheaper card, then casts free. Ripple reveals top N and casts SAME NAME cards free.
- **P151 (Delve)** — Delve exiles from graveyard to reduce cost. Transmute discards to hand to tutor. Both involve "paying with a zone."
- **P153 (Evolve)** — Evolve triggers on entering creatures with bigger stats. Bloodthirst is a static ETB counter condition based on damage dealt this turn.
