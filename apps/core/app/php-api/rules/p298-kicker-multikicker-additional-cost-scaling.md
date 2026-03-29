---
id: p298
name: Kicker and Multikicker — Optional Additional Cost for Enhanced Effect
category: costs
cr_refs: [702.33a, 702.33b, 702.33c, 702.33d, 702.33e, 702.33f, 702.33g]
tags: [kicker, multikicker, additional-cost, scaling, kicked, Zendikar, Kabira-Takedown, Vastwood-Surge, Comet-Storm, Everflowing-Chalice, Kor-Spiritdancer, Spellbust, Goblin-Bushwhacker]
created: 2026-03-29
examples_count: 2
---

# P298 — Kicker and Multikicker — Optional Additional Cost for Enhanced Effect

## Abstract
Kicker is a static ability representing an optional additional cost. When you cast a spell, you may pay its kicker cost on top of the mana cost for an enhanced effect. "Kicked" status is tracked on the stack and referenced by the spell's effect ("if this spell was kicked"). Multikicker is a variant where you pay the additional cost any number of times, scaling the effect proportionally. Some spells have two distinct kicker costs (each providing a different bonus). Kicker appears heavily in Zendikar sets and was reprinted in Jumpstart and Modern Horizons blocks.

## The Definitive Rules

**CR 702.33a** (verbatim): *"Kicker is a static ability that functions while the spell with kicker is on the stack. 'Kicker [cost]' means 'You may pay an additional [cost] as you cast this spell.' Paying a spell's kicker cost(s) follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.33c** (verbatim): *"Multikicker is a variant of the kicker ability. 'Multikicker [cost]' means 'You may pay an additional [cost] any number of times as you cast this spell.' A multikicker cost is a kicker cost."*

**CR 702.33d** (verbatim): *"If a spell's controller declares the intention to pay any of that spell's kicker costs, that spell has been 'kicked.' If a spell has two kicker costs or has multikicker, it may be kicked multiple times."*

**CR 702.33g** (verbatim): *"If part of a spell's ability has its effect only if that spell was kicked, and that part of the ability includes any targets, the spell's controller chooses those targets only if that spell was kicked. Otherwise, the spell is cast as if it did not have those targets."*

## The Pattern

```
KICKER:
  Casting a kicker spell: declare before or during cost payment whether you're kicking
  "You may pay an additional [cost]" — completely optional
  If kicker paid: spell is "kicked." If not: just a normal spell.

  KICKED vs UNKICKED EFFECTS:
    Spell has base effect + additional "if this spell was kicked" text
    Unkicked: base effect only.
    Kicked: base effect + the kicked bonus.

  SIMPLE KICKER EXAMPLES:
    Goblin Bushwhacker ({R}, 1/1 creature): Kicker {R}.
      Unkicked: 1/1 enters without haste.
      Kicked: 1/1 enters with haste. "If this spell was kicked, creatures you control get +1/+0 and haste."
      Rush strategy: kick on turn 2 for a surprise haste pump.

    Comet Storm ({X}{R}, Instant): Multikicker {1}.
      Effect: "Comet Storm deals X damage to any target."
      If multikicked: it deals X damage to each of N+1 different targets where N = times kicked.
      Wait, exact text: "For each time this spell was kicked, it deals X damage to each of one additional target."
      Actually: base = X to one target. Each kicker = one more target at X damage.
      Multikick 3 times + X=5: 5 damage to 4 different targets = 20 total damage for {5}{R}{1}{1}{1}{1} = {10}{R}.
      Scales powerfully with mana.

    Rite of Replication ({3}{U}{U}, Sorcery): Kicker {5}.
      Unkicked: create a token copy of target creature.
      Kicked: create FIVE token copies.
      Unkicked = 1 copy for {3}{U}{U}. Kicked = 5 copies for {8}{U}{U}.
      Famous combo: kick Rite of Replication targeting Avenger of Zendikar (7/7 Plant ETB).
      Each of 5 copies ETBs: 5 × plant tokens equal to lands you control = 35 plants if you have 7 lands.

    Kabira Takedown ({1}{W}, Instant): Kicker — Reveal a Plains from hand.
      Unkicked: Kabira Takedown deals 2 damage to target attacking or blocking creature.
      Kicked: deals 4 damage instead.
      Kicker is revealing a Plains (not paying mana) — alternative kicker cost type.

MULTIKICKER:
  Can be paid any number of times
  Each payment = one more "kick" count
  Cards reference "the number of times this spell was kicked"

  EVERFLOWING CHALICE ({0}, Artifact): Multikicker {2}.
    "Everflowing Chalice enters with a charge counter on it for each time it was kicked."
    "{T}: Add {1} for each charge counter on Everflowing Chalice."
    Unkicked: enters with 0 counters. Taps for nothing.
    Kicked once ({2}): 1 counter. Taps for {1}.
    Kicked twice ({4}): 2 counters. Taps for {2}.
    Kicked 3 times ({6}): taps for {3}.
    In slow formats: kick it twice on turn 4 for a Sol Ring equivalent going forward.

  VASTWOOD SURGE ({3}{G}, Sorcery): Multikicker {G}.
    "Put two +1/+1 counters on each of up to two target creatures."
    "Search your library for a basic land..."
    If kicked (N times): put N+2 counters instead of 2 on each target? (Check exact text.)
    Actual: each multikick = search for another basic land.
    Kicked 3 times = {6}{G}{G}{G}: find 4 basic lands. Major ramp.

TWO-KICKER CARDS:
  Some spells have two separate kicker costs (Kicker [A] and Kicker [B])
  CR 702.33f: "if kicked with its [A] kicker" and "if kicked with its [B] kicker" check separately
  Can pay both, one, or neither.
  Example: Zada, Hedron Grinder's Apex of Power: "If this spell was kicked, look for extra stuff."
  Actually the classic example: Feral Contest ({3}{G}):
    Kicker {4}{G}: [bonus effect A]
    These spells reference "if it was kicked with its Naya kicker" or similar flavor text names.

KICKER COPY INTERACTIONS:
  If you copy a kicked spell (via Fork, Reverberate, etc.):
    The copy is a copy of the kicked spell — it IS kicked (the copy inherits that property)
    "Was this spell kicked": the copy's spell was cast as kicked → copy has the kicked effect
  If you cast a copy WITHOUT kicking: unkicked (no bonus)

KICKER COST REDUCTION:
  Cost reducers (Goblin Electromancer) reduce the TOTAL cost: base + kicker
  Goblin Electromancer ({1}{R}, 2/2): "Instant and sorcery spells you cast cost {1} less."
  Cast Comet Storm with Electromancer: base {X}{R} → {X}{0} (1 less on total cost)
  The kicker costs are also reduced: each {1} kicker becomes {0}!
  With Electromancer: each Comet Storm multikick is essentially free.
  This is why cost reducers in combo decks with kicker can be explosive.

KICKED STATUS:
  Kicker is declared when casting: you announce "I'm kicking this spell" and pay
  The "kicked" status is on the spell while on the stack
  Resolves before the spell is off the stack — "was kicked" checks during resolution
  If spell is countered: kicked status is irrelevant (spell never resolved)
  Kicker doesn't affect mana value (MV): the MV is only the base mana cost
    Comet Storm with X=5 and kicked 3 times: MV is still 1 (base {X}{R} with X as chosen = 5+1=6? Actually X+1)
    The kicker costs don't change MV.
```

## Definitive Conclusions

- **Kicker is optional** — pay the additional cost to get the enhanced effect; not paying leaves only the base effect.
- **Multikicker can be paid any number of times** — each payment scales the effect once more.
- **Kicker costs are additional costs, not alternative costs** — paid on top of the mana cost.
- **Copying a kicked spell produces a kicked copy** — the copy inherits "was kicked" status.
- **Kicker costs don't affect mana value** — MV is calculated from the printed mana cost only.

## Canonical Example
**Rite of Replication + Avenger of Zendikar in Commander:**
Board: 8 lands. Command zone: some 5-color commander. Hand: Rite of Replication.
Cast Rite of Replication kicked ({8}{U}{U}): target Avenger of Zendikar on the battlefield.
Kicked: create 5 token copies of Avenger of Zendikar.
Each Avenger copies enters: "When Avenger of Zendikar enters, create a 0/1 green Plant creature token for each land you control."
5 copies entering simultaneously: each sees 8 lands → 5 × 8 = 40 Plant tokens created simultaneously.
Then: each Avenger's landfall trigger fires when lands enter: all Plants get +1/+1 for each Avenger ETB.
5 Plants × 5 landfall triggers if you play a land: +5/+5 per plant = massive army.
Already have: 40 0/1 plants (no pump yet). Plus 5 Avengers (7/5 each).
Turn: 40 plants + 5 Avengers. Swing for well over 100 damage.
Rite of Replication kicked: the ultimate Commander "destroy everything" spell.

**Example 2 — Goblin Bushwhacker Rush:**
Deck: Red Aggro. Turn 2.
Turn 1: play Goblin Guide (2/2 haste). Attack: 2 damage.
Turn 2: have {R}{R}. Hand: Goblin Bushwhacker.
Cast Goblin Bushwhacker kicked: {R} (normal) + {R} (kicker) = {R}{R}.
Goblin Bushwhacker enters as 1/1.
Kicker effect: "Creatures you control get +1/+0 and haste until end of turn."
Both Goblin Guide AND Bushwhacker get +1/+0 and have haste (Guide already has haste; Bushwhacker gains it).
Attack with Goblin Guide (3/2) + Goblin Bushwhacker (2/1) = 5 damage.
Turn 2 total: 5 damage. Running total: 7 damage.
Unkicked: Bushwhacker enters as 1/1, no bonus, just a 1/1 body.
The kicker doubles the aggressive impact of the turn.

## Commonly Confused With
- **P265 (Blitz)** — Blitz is an alternative cost (replaces mana cost); kicker is an additional cost (paid on top).
- **P270 (Spree/Saddle)** — Spree has modes each requiring a cost; kicker has a single extra cost (or multikicker for multiple payments).
- **P271 (Gift)** — Gift is also an additional cost, but requires giving an opponent a benefit; kicker benefits only the caster.
- **P266 (Enlist)** — Enlist taps a creature during attack for a bonus; kicker is a casting-time additional mana cost.
