---
id: p270
name: Saddle and Spree — Mount Activation and Multi-Mode Additional Cost
category: costs
cr_refs: [702.171a, 702.171b, 702.171c, 702.172a, 702.172b]
tags: [saddle, spree, mount, saddled, modal, additional-cost, multi-mode, Bloomburrow, Duskmourn, Saddled-Rotopede, Canyon-Crab, Ride-to-Ruin, Overlord-of-the-Balemurk]
created: 2026-03-29
examples_count: 2
---

# P270 — Saddle and Spree — Mount Activation and Multi-Mode Additional Cost

## Abstract
Two mechanics from 2024. **Saddle N** (Bloomburrow): an activated ability on Mount creatures — tap any number of other untapped creatures you control with total power N or greater. When saddled, the Mount gains bonuses described by its other abilities (marked "Saddled — ..."). Saddle is analogous to Crew for Vehicles but on creatures, and the bonus is defined on the card (not "becomes a creature"). **Spree** (Duskmourn): a keyword on modal spells that replaces the traditional "choose one/two" structure with additional costs per mode. You may choose as many modes as you want, but each additional mode beyond the base spell requires paying its associated additional cost. Unlike Choose One (which limits mode selection), Spree lets you buy as many modes as you can afford.

## The Definitive Rules

**CR 702.171a** (verbatim): *"Saddle is an activated ability. 'Saddle N' means 'Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes saddled until end of turn. Activate only as a sorcery.'"*

**CR 702.171b** (verbatim): *"Saddled is a designation that has no rules meaning other than to act as a marker that spells and abilities can identify. Only permanents can be or become saddled. Once a permanent has become saddled, it stays saddled until the end of the turn or it leaves the battlefield. Being saddled is not a part of the permanent's copiable values."*

**CR 702.172a** (verbatim): *"Spree is a static ability found on some modal spells (see rule 700.2) that applies while the spell on the stack. Spree means 'Choose one or more modes. As an additional cost to cast this spell, pay the costs associated with those modes.'"*

**CR 702.172b** (verbatim): *"Cards with the spree ability have a plus sign icon in the upper right corner of the card, and use a plus sign (+) rather than traditional bullet points. These symbols are a visual reminder that this card requires an additional cost to be cast, and do not have additional rules meaning."*

## The Pattern

```
SADDLE:
  Activated ability on Mount creatures
  "Saddle N": tap creatures you control with TOTAL POWER N or greater
  Those creatures don't attack, don't tap for other abilities during this process
  The Mount becomes "saddled" until end of turn (or it leaves battlefield)
  "Saddled" is a designation — like "monstrous" — with no inherent rules meaning
  Cards on the Mount that say "Saddled —" are condition-gated on the saddled state

  SADDLE vs CREW:
    Crew (Vehicles): tap creatures with total power ≥ N → Vehicle becomes a creature
    Saddle (Mounts): tap creatures with total power ≥ N → Mount becomes saddled (gains bonuses)
    Crew makes the Vehicle a creature; Saddle makes the Mount... better, but it's already a creature
    Mounts are ALREADY creatures; saddling doesn't change their type, just grants marked bonuses

  SADDLE + SUMMONING SICKNESS:
    Creatures used to saddle must be untapped (but don't need to have been in play long)
    Wait: the saddle cost just says "tap" — not "you can only tap creatures without summoning sickness"
    Summoning sickness prevents attacking and using activated {T} abilities
    Saddling is the same case as Convoke/Enlist — it's an additional cost during casting/activation
    New creatures can likely saddle (similar to convoke allowing newly entered creatures)
    Rule: creatures with summoning sickness CAN be tapped to saddle (no {T} in saddle's cost).

  SADDLE MULTIPLE TURNS:
    "Saddled" lasts until end of turn — re-saddle each turn if you want the bonus
    Tap fresh creatures each main phase to saddle again for that turn's attack
    One saddle activation per turn (activate only as a sorcery)

  SADDLE + FLYING/EVASION BONUSES:
    Many Mount Saddled abilities grant evasion: "Saddled — this creature has flying/trample/hexproof"
    Without saddle: the Mount is a normal creature
    Saddled: upgraded with the marked ability (flight, trample, etc.)

  SADDLE NOTABLE CARDS (Bloomburrow):
    Saddled Rotopede ({3}{G}, Mount 5/5, Saddle 2):
      "Saddled — Saddled Rotopede has trample."
      Tap 2+ power of creatures → 5/5 gains trample.
      Tap two 1/1 tokens (total power 2) → 5/5 Trample.
      5/5 Trample for 4 mana, just need two creatures to tap.

    Helpful Hunter ({2}{W}, Mount 3/2, Saddle 1):
      "Saddled — Helpful Hunter has lifelink."
      Saddle 1: tap any creature with power 1+ → gain lifelink on attacks.

    Pearl-Ear, Imperial Advisor ({2}{W}{U}, Legendary Mount 2/4 Flying, Saddle 1):
      "Saddled — whenever Pearl-Ear deals combat damage to a player, look at that many cards from the
      top of their library. You may put any number on the bottom and the rest on top."
      Saddled Pearl-Ear: "deals damage" → powerful library manipulation.

SPREE:
  Keyword on modal spells with additional cost structure
  Format: base spell cost (in mana cost box) + modes each with their own plus (+) cost
  When casting: choose one or more modes, pay their associated additional costs
  Unlike traditional "Choose one/two" which picks from options for free: Spree charges per mode
  The base spell costs what's in the mana cost. Each mode costs extra on top.

  SPREE MATH:
    Example Spree spell: {2}{B} base cost
    Mode A (+{1}): discard a card, draw two cards
    Mode B (+{2}{B}): destroy target creature
    Mode C (+{1}): each opponent discards a card
    Cast with modes A+C: pay {2}{B} + {1} + {1} = {4}{B} total
    Cast with mode B only: pay {2}{B} + {2}{B} = {4}{B}{B} total
    Cast all modes: pay {2}{B} + {1} + {2}{B} + {1} = {6}{B}{B}

  SPREE + "CHOOSE" RESTRICTIONS:
    Unlike "choose one — [A or B]": Spree has no limit on mode count
    Pay enough additional costs: get ALL modes simultaneously
    More mana = more modes = bigger effect
    Spree scales with mana investment (X-like scaling via mode selection)

  SPREE NOTABLE CARDS (Duskmourn: House of Horror):
    Overlord of the Balemurk ({4}{B}{B}, Sorcery, Spree):
      Modes (+{1}: return target creature from GY to hand), (+{2}{B}: destroy target creature),
      (+{2}{B}: each opponent discards 2 cards)
      Base {4}{B}{B}. Choose which modes to pay for.
      All modes: massive board control + hand disruption + graveyard recursion for one spell.
      Pay for just one mode: narrower but cheaper overall.

    Ride to Ruin ({2}{R}, Instant, Spree):
      Modes (+{1}: this spell deals 2 damage to any target), (+{1}: destroy target artifact)
      Base {2}{R}. Mode A (+{1}): deal 2 damage. Mode B (+{1}): destroy artifact.
      Both modes: {2}{R} + {1} + {1} = {4}{R} → deal 2 damage AND destroy an artifact.
      One mode: {3}{R} for either effect alone.
      Flexibility: pay more for both, pay less for one.

    Lively Dirge ({1}{B}, Sorcery, Spree):
      Modes (+{1}: create a tapped 2/2 Zombie), (+{2}: look at top 4 cards, put one in hand, rest in GY)
      Multiple uses in a single spell for extra mana.

SADDLE vs CREW CLARIFICATION:
  Crew: tapping creatures makes an artifact Vehicle temporarily a creature
  Saddle: tapping creatures gives a creature (Mount) its "Saddled" bonus abilities
  Both: sorcery speed, tap other untapped creatures with total power ≥ N
  Key difference: Vehicles aren't creatures by default; Mounts are already creatures
```

## Definitive Conclusions

- **Saddle N taps creatures with total power N or greater to make the Mount "saddled"** — a designation that unlocks marked abilities.
- **Saddled lasts until end of turn** — must re-saddle each turn for the bonus.
- **Creatures with summoning sickness CAN saddle** — the tapping for saddle is not a {T} activated ability.
- **Spree charges an additional cost per mode chosen** — more mana = more simultaneous modes.
- **Spree has no limit on mode selection** unlike traditional "choose one/two" — you can choose all modes if you pay all costs.

## Canonical Example
**Saddled Rotopede in Creature-Heavy Green:**
Board: Saddled Rotopede (5/5 Mount), two 1/1 Squirrel tokens.
Main phase: activate Saddle 2. Tap both 1/1 Squirrels (total power 2).
Rotopede is saddled. "Saddled — has trample."
Attack with 5/5 Trample. Opponent blocks with 3/3. Assign 3 damage to blocker, 2 trample damage to opponent.
Opponent takes 2 damage; 3/3 dies. 5/5 survives.
Next turn: untap Squirrels. Saddle again. 5/5 Trample attacks again.
Two 1/1 tokens permanently "powering" a 5/5 Trample threat each turn.

**Example 2 — Ride to Ruin Multi-Mode:**
Opponent has a Wurmcoil Engine (6/6, Artifact Creature) with 10 life. You have {4}{R}.
Cast Ride to Ruin ({2}{R}). Pay mode A (+{1}): deal 2 damage to opponent's face.
Pay mode B (+{1}): destroy target artifact (target Wurmcoil Engine).
Total cost: {2}{R} + {1} + {1} = {4}{R}.
Both modes resolve: Wurmcoil destroyed (creates 3/3 tokens, but the 6/6 is gone), opponent takes 2 damage.
For {4}{R} you removed the most powerful threat AND dealt 2 damage.
Without Spree: you'd need two separate cards to accomplish both effects.

## Commonly Confused With
- **P155 (Crew/Vehicles)** — Crew makes Vehicles into creatures; Saddle makes Mounts "saddled" (they're already creatures). Both tap other creatures with power ≥ N.
- **P230 (Entwine)** — Entwine pays one additional cost to access ALL modes of a modal spell; Spree charges per mode but lets you choose any subset.
- **P254 (Escalate)** — Escalate is the closest to Spree: choose one or more modes, pay escalate cost per mode beyond the first. Spree charges per chosen mode including the first (no free first mode).
