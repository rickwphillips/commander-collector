---
id: p263
name: Compleated and Toxic — Phyrexian Planeswalker Loyalty and Poison Counter Damage
category: replacement
cr_refs: [702.150a, 702.164a, 702.164b, 702.164c, 120.3g]
tags: [compleated, toxic, poison-counters, phyrexian-mana, planeswalker, loyalty, Phyrexia-All-Will-Be-One, Ajani-Sleeper-Agent, Nissa-Ascended-Animist, Phyrexian-Crusader, Skrelv]
created: 2026-03-29
examples_count: 2
---

# P263 — Compleated and Toxic — Phyrexian Planeswalker Loyalty and Poison Counter Damage

## Abstract
Two mechanics from Phyrexia: All Will Be One (2023). **Compleated**: a static ability on Phyrexian planeswalker cards. If any of the planeswalker's mana cost was paid with life (via Phyrexian mana symbols), it enters with 2 fewer loyalty counters per Phyrexian symbol used. This lets you cast the planeswalker with less mana — but it arrives weakened. **Toxic N**: a static ability on creatures. When a creature with toxic deals combat damage to a player, that player gets N poison counters in addition to the damage. Crucially, toxic gives ADDITIONAL poison counters on top of the normal damage — it does NOT replace the damage. A player who accumulates 10 or more poison counters loses the game (SBA 704.5c).

## The Definitive Rules

**CR 702.150a** (verbatim): *"Compleated is a static ability found on some planeswalker cards. Compleated means 'If this permanent would enter with one or more loyalty counters on it and the player who cast it chose to pay life for any part of its cost represented by Phyrexian mana symbols, it instead enters the battlefield with that many loyalty counters minus two for each of those mana symbols.'"*

**CR 702.164a** (verbatim): *"Toxic is a static ability. It is written 'toxic N,' where N is a number."*

**CR 702.164b** (verbatim): *"Some rules and effects refer to a creature's 'total toxic value.' A creature's total toxic value is the sum of all N values of toxic abilities that creature has."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results."*

**CR 120.3g** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results. See rule 702.164."*

## The Pattern

```
COMPLEATED:
  On Phyrexian planeswalker cards with Phyrexian mana symbols in casting cost
  Normal cast: pay full cost → planeswalker enters with its printed loyalty
  Compleated cast: pay life for Phyrexian symbols → planeswalker enters with:
    printed loyalty - 2 for each Phyrexian symbol paid with life

  EXAMPLE — Ajani, Sleeper Agent ({2}{G}{W/P}{W/P}):
    Normal cast: {2}{G}{W}{W} → enters with 4 loyalty
    Pay 1 life (one {W/P} as life): {2}{G}{W} + 2 life → enters with 2 loyalty (4 - 2 = 2)
    Pay 2 life (both {W/P} as life): {2}{G} + 4 life → enters with 0 loyalty... wait:
    Actually: enters with 4 - 2 - 2 = 0. A planeswalker with 0 loyalty dies immediately (SBA).
    In practice: pay life for at most one symbol to save {W} and enter with 2 loyalty.

  COMPLEATED MATH:
    Phyrexian planeswalkers have 2 Phyrexian mana symbols in their cost (usually)
    Using one: save 1 colored mana, pay 2 life, lose 2 loyalty on entry
    Using both: save 2 colored mana, pay 4 life, lose 4 loyalty on entry
    Tradeoff: faster deployment at cost of fewer starting activations

  COMPLEATED NOTABLE CARDS:
    Ajani, Sleeper Agent ({2}{G}{W/P}{W/P}): 4 loyalty, compleated
      Pay {W/P} as life: enter with 2 loyalty. Pay both: 0 loyalty (dies immediately).
      Ajani's abilities: +1 puts +1/+1 and vigilance/lifelink; -3 destroys biggest creature; -6 Emblem.
      Compleated Ajani costs {2}{G}+4 life for 0 loyalty = never do this.
      Pay one: {2}{G}{W}+2 life → 2 loyalty. Then +1 immediately → 3 loyalty. Risky but faster.

    Nissa, Ascended Animist ({3}{G}{G}{G/P}{G/P}): 4 loyalty, compleated
      Pay both {G/P} as life: {3}{G}{G}+4 life → 0 loyalty (never do this)
      Pay one {G/P}: {3}{G}{G}{G}+2 life → 2 loyalty. Rare 5-drop becomes potential 4-drop.
      Nissa's -7 is a game-ender. Getting there faster with 2 loyalty requires risky play.

TOXIC:
  Static ability on creatures
  When creature deals COMBAT damage to a player: give that player N poison counters
  IN ADDITION to normal damage (both happen)
  Not a replacement: the damage AND the poison counters both occur
  10+ poison counters = lose the game (SBA 704.5c)

  TOXIC + INFECT COMPARISON:
    Infect (P227): damage as -1/-1 counters to creatures OR poison to players — REPLACES normal damage
    Toxic: normal damage PLUS poison counters — both effects
    A 2/2 with Toxic 1 deals 2 combat damage to a player AND gives 1 poison counter
    A 2/2 with Infect deals 0 damage to a player and gives 2 poison counters
    Toxic: harder to stack to 10 poison (also does damage); Infect: pure poison delivery

  TOXIC STACKING:
    Multiple toxic instances ADD to total toxic value
    Creature with Toxic 2 that gains Toxic 1: total toxic value = 3
    Skrelv's Hive token (Mite with Toxic 1) + Skrelv {W} giving Toxic 1 to another: total 2?
    Actually: each "Toxic N" on a creature contributes to its total toxic value.

  TOXIC + LIFELINK:
    Damage dealt by toxic creature can trigger lifelink
    The lifelink is on the combat damage, not the poison counters
    Lifelink on a Toxic 1 creature: you gain life equal to the damage AND opponent gets poison
    Poison counters don't grant life — only the damage portion interacts with lifelink

  TOXIC + PROLIFERATE:
    Proliferate (P216): add one counter of each type to chosen players/permanents
    Opponent has 2 poison counters → Proliferate → 3 poison counters
    Poison counters + Proliferate: can finish opponents faster
    Key in Phyrexian poison decks: Skrelv's Hive generates Mites with Toxic 1 each turn
    Build to critical mass then Proliferate to 10.

  TOXIC NOTABLE CARDS (Phyrexia: All Will Be One):
    Skrelv, Defector Mite ({W}): 1/1, Toxic 1, {W}: give target creature you control protection from
      chosen color until end of turn and it loses toxic until end of turn.
      Uses: Skrelv as a 1/1 toxic 1 beater; his ability protects attackers from blockers.

    Phyrexian Crusader ({1}{B}{B}): 2/2 Protection from white and red, First Strike, Infect (wait —
      Phyrexian Crusader has infect from New Phyrexia, not toxic).

    Actual Toxic ONE cards: Jawbone Duelist ({1}{W}): 2/1 Toxic 1, First Strike.
      Gets +1/+0 for each opponent with poison counters (Corrupted synergy).

    Mite Overseer ({3}{W}): creates a 1/1 Mite with Toxic 1 on end of combat step after attacking.

    Skrelv's Hive ({1}{W}): each of your upkeeps creates a 1/1 Mite token with Toxic 1 if you paid
      life this turn. Stream of poison threats every turn.

  CORRUPTED (Ability Word):
    Not a keyword — an ability word on Phyrexia: ONE cards
    Format: "Corrupted — [bonus if an opponent has 3+ poison counters]"
    Works with toxic: deal poison damage first, then Corrupted abilities unlock
    Example: Phyrexian Obliterator-like effects that get better once poison is established
```

## Definitive Conclusions

- **Compleated reduces entry loyalty by 2 per Phyrexian mana paid with life** — you save mana but the planeswalker enters weaker.
- **Never pay life for both Phyrexian symbols on a Compleated planeswalker** — entering at 0 loyalty means immediate death via SBA.
- **Toxic gives poison counters IN ADDITION to normal damage** — unlike Infect, which replaces damage.
- **Toxic total value stacks** from multiple instances — a creature can have multiple "Toxic N" instances.
- **Corrupted is an ability word, not a keyword** — it doesn't appear in CR 702, just on specific ONE cards as a bonus condition.

## Canonical Example
**Ajani, Sleeper Agent in Phyrexian Midrange:**
Mana available: {2}{G}{W}. Ajani's normal cost is {2}{G}{W}{W} — need one more {W}.
Pay compleated: cast for {2}{G}{W} + 2 life. Ajani enters with 4 - 2 = **2 loyalty**.
Turn 1 with Ajani: use his +1 ability → put a +1/+1 counter + vigilance + lifelink on a creature → 3 loyalty.
Next turn: +1 again → 4 loyalty. Have gotten two uses from him plus reached safety.
The 2-life cost + 2-loyalty loss was worth the faster deployment by one mana.
If you were at 2 life: paying 2 life is dangerous. Compleated is riskier at low life totals.

**Example 2 — Toxic Mite Army:**
Board: 4 Mite tokens (1/1 with Toxic 1) from Skrelv's Hive over 4 turns.
Attack with all 4 (they're unblockable due to Skrelv or evasion).
Opponent takes 4 damage AND receives 4 poison counters (1 per Mite).
Turn 5: 5th Mite attacks → 5th poison counter. Proliferate with Viral Drake → 6 poison counters.
Turn 6: Proliferate again → 7 poison. One more attack + proliferate: 10 poison. Win.
Compare Infect: you'd need 10 poison from infect creatures too, but they deal no normal damage.
Toxic mites pressure life total AND poison simultaneously — two simultaneous win conditions.

## Commonly Confused With
- **P222 (Phyrexian Mana)** — Phyrexian mana costs let you pay 2 life for a colored mana symbol generally. Compleated specifically applies to planeswalkers: paying life for their Phyrexian mana ALSO reduces starting loyalty by 2 per symbol paid.
- **P153 (Infect)** — Infect replaces damage with -1/-1 counters (to creatures) or poison counters (to players); Toxic adds poison ON TOP of normal damage.
- **P216 (Proliferate)** — Proliferate is a separate mechanic that adds counters (including poison). It works synergistically with Toxic/Infect decks but has different rules.
