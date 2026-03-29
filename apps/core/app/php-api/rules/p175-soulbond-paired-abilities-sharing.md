---
id: p175
name: Soulbond — Paired Creatures Sharing Abilities
category: triggered
cr_refs: [702.95a, 702.95b, 702.95c, 702.95d, 702.95e]
tags: [soulbond, paired, unpaired, ETB, shared-ability, Avacyn-Restored, Silverblade-Paladin, Wingcrafter]
created: 2026-03-28
examples_count: 2
---

# P175 — Soulbond — Paired Creatures Sharing Abilities

## Abstract
Soulbond creates a bond between two creatures. When a creature with soulbond enters, you may pair it with another unpaired creature you control. When another creature enters while a soulbond creature is unpaired, you may pair them. Once paired, the soulbond card grants an ability to BOTH creatures in the pair "as long as they are paired." This creates a mutually beneficial link — the two creatures share whatever ability the soulbond card confers. The pairing ends if either creature stops being a creature, leaves the battlefield, or changes controller.

## The Definitive Rules

**CR 702.95a** (verbatim): *"Soulbond is a keyword that represents two triggered abilities. 'Soulbond' means 'When this creature enters, if you control both this creature and another creature and both are unpaired, you may pair this creature with another unpaired creature you control for as long as both remain creatures on the battlefield under your control' and 'Whenever another creature you control enters, if you control both that creature and this one and both are unpaired, you may pair that creature with this creature for as long as both remain creatures on the battlefield under your control.'"*

**CR 702.95d** (verbatim): *"A creature can be paired with only one other creature."*

**CR 702.95e** (verbatim): *"A paired creature becomes unpaired if any of the following occur: another player gains control of it or the creature it's paired with; it or the creature it's paired with stops being a creature; or it or the creature it's paired with leaves the battlefield."*

## The Pattern

```
SOULBOND:
  Two triggered abilities:
    1. When soulbond creature enters: may pair with another unpaired creature you control
    2. When another creature enters: if soulbond creature is unpaired, may pair them

  SOULBOND ABILITY SHARING:
    The soulbond card typically says "as long as [this creature] is paired, [both this and paired creature] have [ability]"
    Examples: "As long as Silverblade Paladin is paired, both have double strike"
    Both creatures in the pair gain the ability
    If unpaired: neither creature has the ability (from soulbond)

  SOULBOND + PAIR RESTRICTIONS:
    Must be YOUR creatures (you control both)
    Must both be UNPAIRED (can't re-pair a paired creature)
    Once a creature leaves the battlefield or changes controller: the bond breaks

  SOULBOND + TARGETING:
    The pairing is not a target — you just choose which creature to pair with
    Hexproof/shroud: don't prevent pairing

  SOULBOND + FLICKERING:
    If a soulbond creature is flickered (exiled and returned): its bond breaks on leaving
    It returns as a new object, unpaired
    When it re-enters: soulbond triggers again — may re-pair with any unpaired creature

  SOULBOND + MULTIPLE:
    A creature can be paired with only one other creature at a time (CR 702.95d)
    Multiple soulbond creatures: each pairs separately with different creatures
    Silverblade Paladin + Wingcrafter: each pairs with a separate creature
    Two creatures each get double strike + flying (from two different soulbond pairs)

  SOULBOND + ETB FLOOD:
    When multiple creatures enter simultaneously: soulbond triggers fire for each
    You can pair soulbond creatures with new arrivals if both are unpaired
    Mass token creation: soulbond triggers for each entering creature, but you can only pair with one

  SOULBOND CARDS (Avacyn Restored):
    Silverblade Paladin: while paired → both have double strike
    Wingcrafter: while paired → both have flying
    Tandem Lookout: while paired → whenever paired creature deals combat damage, draw a card
    Wolfir Silverheart: while paired → both get +4/+4

SOULBOND + LOSS OF PAIRING:
  If the non-soulbond paired creature dies: soulbond creature becomes unpaired
  Soulbond triggers again when another creature enters → can re-pair immediately
  The soulbond creature continuously seeks a partner
```

## Definitive Conclusions

- **Soulbond pairs two creatures** — both gain the ability while paired.
- **Pairing is broken** when either leaves the battlefield, stops being a creature, or changes controller.
- **Flickering a soulbond creature** breaks the pair; when it returns it can pair again.
- **Multiple soulbond creatures** each pair independently with different creatures.
- **Wolfir Silverheart** gives both paired creatures +4/+4 — one of the most impactful soulbond abilities.

## Canonical Example
**Silverblade Paladin (Soulbond, 2/2, First Strike):**
Cast Silverblade Paladin → soulbond trigger → pair with your 4/4 creature.
Both Paladin and the 4/4 have double strike.
4/4 attacks with double strike → first strike 4 damage, second strike 4 more = 8 total combat damage.
The Paladin also has double strike (from its own ability) AND the shared ability from being paired.

**Example 2 — Tandem Lookout + Hydra:**
Tandem Lookout (Soulbond): while paired, whenever the paired creature deals combat damage to a player, draw a card.
Pair Tandem Lookout with Kalonian Hydra (8/8 trample, doubles +1/+1 counters on attack).
Hydra attacks → deals 8+ trample damage → Tandem Lookout's shared ability triggers → draw a card.
Also: Hydra's double-counter trigger fires → grows exponentially.
Flying, card draw, exponential growth — all from two creatures.

## Commonly Confused With
- **P095 (Soulshift)** — Soulshift returns a Spirit card from graveyard on death. Soulbond pairs two living creatures for shared abilities.
- **P175 vs Bestow (P119)** — Bestow is an Aura that falls off to become a creature. Soulbond pairs two separate creatures without merging them.
- **P170 (Mutate)** — Mutate merges creatures into one. Soulbond keeps them separate but linked by an ability.
