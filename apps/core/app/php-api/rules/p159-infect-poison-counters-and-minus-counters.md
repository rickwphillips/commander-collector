---
id: p159
name: Infect — Damage as Poison Counters and -1/-1 Counters
category: combat
cr_refs: [702.90a, 702.90b, 702.90c, 702.90d, 702.90e, 702.90f]
tags: [infect, poison-counter, -1/-1, damage, player, creature, Phyrexia, Blighted-Agent, proliferate, wither]
created: 2026-03-28
examples_count: 2
---

# P159 — Infect — Damage as Poison Counters and -1/-1 Counters

## Abstract
Infect changes how a source deals damage. Damage dealt by an infect source to a **player** doesn't cause that player to lose life — instead, that player gets poison counters (one per damage). Damage dealt by an infect source to a **creature** doesn't mark damage — instead, it places -1/-1 counters on the creature. A player with 10 or more poison counters loses the game (SBA 704.5c). Infect is all-or-nothing: infect sources never mark normal damage. Proliferate can add poison counters, enabling fast kills with minimal combat.

## The Definitive Rules

**CR 702.90a** (verbatim): *"Infect is a static ability."*

**CR 702.90b** (verbatim): *"Damage dealt to a player by a source with infect doesn't cause that player to lose life. Rather, it causes that source's controller to give the player that many poison counters. See rule 120.3."*

**CR 702.90c** (verbatim): *"Damage dealt to a creature by a source with infect isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature. See rule 120.3."*

**CR 702.90e** (verbatim): *"The infect rules function no matter what zone an object with infect deals damage from."*

## The Pattern

```
INFECT:
  Static ability: changes the TYPE of damage dealt
  To PLAYERS: damage → poison counters (1 damage = 1 poison counter)
  To CREATURES: damage → -1/-1 counters (1 damage = 1 -1/-1 counter)
  Neither causes life loss nor marks normal damage

  INFECT + WIN CONDITION:
    10 poison counters → that player loses the game (SBA 704.5c)
    Starting life total of players doesn't matter for poison kill
    Infect wins by dealing 10 "poison damage" total, not by reducing life to 0
    In Commander: 10 poison (not "commander damage" threshold) from any infect source

  INFECT + POWER:
    A 1/1 with infect deals 1 "infect damage" = 1 poison counter
    A 4/4 with infect deals 4 poison counters in one hit
    Pump spells make infect threats much more dangerous
    Blighted Agent (1/1 unblockable, infect): hits for 1 poison each attack → 10 turns with no pump
    With Giant Growth (+3/+3): 4 poison in one hit → 3 attacks to kill

  INFECT + DEATHTOUCH:
    Infect damage to creatures = -1/-1 counters (not damage marks)
    Deathtouch: any nonzero "damage" lethal → but infect deals COUNTERS, not damage
    Wait: does "damage" from an infect source still count as "damage" for deathtouch?
    Yes: infect DEALS damage, but the damage manifests as -1/-1 counters instead of marks
    Deathtouch + infect: 1 point of damage → 1 -1/-1 counter placed
    Deathtouch: is "any nonzero damage dealt by this source is lethal"
    Lethal = sufficient to destroy via SBA
    Infect damage → -1/-1 counters → creature's P/T reduced by 1 → if toughness ≤ 0 → SBA destroys
    So: deathtouch + infect → place 1 -1/-1 counter → toughness 0 → SBA destroys
    Yes: deathtouch + infect = kill anything with 1 damage

  INFECT + PROLIFERATE:
    Proliferate adds counters of types already present on players
    A player with even 1 poison counter: proliferate adds another poison counter
    Strategy: deal 1 poison, then proliferate repeatedly to 10
    Thrummingbird (1/1 flying, "whenever this deals combat damage to a player, proliferate") in infect decks

  INFECT + WITHER (comparison):
    Wither: damage to creatures = -1/-1 counters (same as infect for creatures)
    Infect: damage to PLAYERS = poison counters (this is what wither doesn't do)
    Both convert creature damage to -1/-1 counters
    Infect also changes player damage; wither only affects creature damage

  INFECT + REGENERATION:
    -1/-1 counters from infect: not "damage," so regeneration doesn't remove them
    Regeneration removes damage marks; infect places counters (different thing)
    A regenerated creature still has its -1/-1 counters

  INFECT + DOUBLE STRIKE:
    Double strike: deals damage in first and second combat damage steps
    Infect + double strike: places -1/-1 counters in BOTH steps
    A 2/2 with infect, double strike blocks a 4/4:
      First strike step: 2 -1/-1 counters on 4/4 → 4/4 becomes 2/2
      Second step: 2 more counters → 4/4 becomes 0/0 → SBA destroys it
    Infect double strike is devastating

  INFECT WIN CONDITIONS:
    Blighted Agent (unblockable infect): go wide or pump to 10
    Inkmoth Nexus (land that becomes a 1/1 flying infect creature): evasive infect threat
    Glistener Elf (1/1 infect with green pump support): glass cannon
```

## Definitive Conclusions

- **Infect converts player damage to poison counters** — doesn't reduce life.
- **Infect converts creature damage to -1/-1 counters** — not damage marks.
- **10 poison counters = that player loses** — regardless of life total.
- **Deathtouch + infect = 1 damage kills any creature** — 1 -1/-1 counter reduces toughness ≤ 0 → SBA destroys.
- **Proliferate extends poison counters** — fast wins with minimal infect damage.
- **Regeneration doesn't remove -1/-1 counters** — counters persist through regeneration.

## Canonical Example
**Blighted Agent (1/1 Island-walking, Infect):**
Unblockable in many formats. Each attack: deal 1 poison counter to opponent.
Add a Mutagenic Growth (pay 2 life, +2/+2 until end of turn): Blighted Agent becomes 3/3 → 3 poison counters.
Three attacks (assuming no pump): 1, 1, 1 = 3 poison. Add pumps: 3+3+4 = 10 in 3 swings.
The threat: opponent must remove it or lose, even if at full life.

**Example 2 — Infect + Proliferate Engine:**
Attack with Glistener Elf: deal 1 poison counter. Opponent has 1 poison.
Thrummingbird deals combat damage to opponent → proliferate trigger → add 1 poison → 2 poison.
Continue proliferating: 2→3→4...→10. Opponent loses without any more direct infect damage.
Inexorable Tide (proliferate whenever you cast a spell): cast one spell per turn → +1 poison per spell.

## Commonly Confused With
- **P139 (Wither)** — Wither deals -1/-1 counters to creatures only. Infect ALSO deals poison to players.
- **P035 (Poison Counters)** — Infect is the keyword that generates poison counters. Poisonous N is a separate mechanic (combat damage → N poison counters — see P160).
- **P105 (Deathtouch)** — Deathtouch + infect combination: any damage kills a creature via -1/-1 reducing toughness to 0.
