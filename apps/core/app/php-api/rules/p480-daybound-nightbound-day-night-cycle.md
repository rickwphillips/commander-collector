---
id: p480
name: Daybound and Nightbound — Shared Day/Night Game State, Casting-Count Tracking, and Permanent Auto-Transform
category: replacement
cr_refs: [702.145, 726.1, 726.2, 726.3, 726.4, 726.5, 726.6, 726.7, 603.2, 704.5]
tags: daybound, nightbound, day-night, shared-game-state, casting-count, auto-transform, innistrad-midnight-hunt, werewolf
created: 2026-03-29
examples_count: 7
---

# P480 — Daybound and Nightbound — Shared Day/Night Game State, Casting-Count Tracking, and Permanent Auto-Transform

## Abstract

**Daybound** and **Nightbound** (CR 702.145, Innistrad: Midnight Hunt) are keyword abilities on double-faced cards that create a shared "day/night" game state tracked by all players. The transition between day and night happens automatically at the beginning of each player's upkeep based on how many spells were cast the previous turn. Daybound permanents transform to their Nightbound face when night arrives; Nightbound permanents transform to their Daybound face when day arrives. This creates a unique, shared game-state mechanic where all day/night DFCs transform simultaneously, and the transitions are determined by collective player behavior.

## The Definitive Rules

### Daybound/Nightbound (CR 702.145)
**CR 702.145a verbatim:** *"Daybound means 'If a player cast no spells during their own last turn, transform this permanent at the beginning of that player's next upkeep' and 'As long as it's night, this permanent is transformed.'"*

**CR 702.145b verbatim:** *"Nightbound means 'If a player cast two or more spells during their own last turn, transform this permanent at the beginning of that player's next upkeep' and 'As long as it's day, this permanent is transformed.'"*

### Day/Night Game State (CR 726)
**CR 726.1**: Day and night is a game state that applies to ALL players. It begins as neither. The first time any daybound or nightbound permanent enters the battlefield, if it's not already day or night, it becomes day.

**CR 726.2**: At the beginning of each player's upkeep, check spells cast last turn:
- If it became day last turn OR it's currently day: if the active player cast ZERO spells on their last turn → it becomes night
- If it became night last turn OR it's currently night: if the active player cast TWO OR MORE spells on their last turn → it becomes day

**CR 726.3**: When day becomes night or night becomes day, all daybound permanents transform to their nightbound faces (or vice versa) simultaneously.

## The Pattern

```
DAY/NIGHT STATE MACHINE:
Initial state: neither day nor night
Trigger to start: first Daybound or Nightbound permanent enters the battlefield
  → If currently neither: it becomes DAY (CR 726.1)

Transition rules (checked at beginning of each player's upkeep):
  Currently DAY:
    → Active player cast 0 spells last turn → becomes NIGHT
    → Active player cast 1+ spells last turn → stays DAY (no transition)
  Currently NIGHT:
    → Active player cast 2+ spells last turn → becomes DAY
    → Active player cast 0-1 spells last turn → stays NIGHT (no transition)
  Currently NEITHER (after starting):
    → Can't be neither once day/night has started in this game

When DAY → NIGHT transition happens:
  → All daybound permanents transform to their nightbound faces SIMULTANEOUSLY
  → Triggers: "Whenever this permanent transforms into [Nightbound form]" fire
  → SBAs checked after all transformations

When NIGHT → DAY transition happens:
  → All nightbound permanents transform to their daybound faces SIMULTANEOUSLY
  → Triggers: "Whenever this permanent transforms into [Daybound form]" fire

Key rules:
  → "Cast 0 spells" check: counts spells cast BY THE ACTIVE PLAYER on their last turn
    → Opponents casting spells during YOUR turn (via split second recovery, etc.) don't count
    → Only YOUR spell casts on YOUR previous turn count
  → "Cast 2+ spells" check: similarly only the active player's spell casts count
  → A player in a 4-player Commander game: each player's upkeep triggers the transition
    check independently based on THAT PLAYER'S spell casts from THEIR last turn
    → Multiple players' upkeeps in a turn cycle: day/night can change each upkeep
  → Permanents with Daybound that enter the battlefield during NIGHT: enter already transformed
    (they enter as their nightbound face due to the continuous rule "as long as it's night")
  → Transform triggered abilities on Daybound/Nightbound: fire each time they transform

INTERACTION WITH PLAYER BEHAVIOR:
Day-to-Night transition strategy:
  → If opponents want Night (to have their nightbound creatures active): play conservatively
    (cast 0 spells some turns) — but this is hard; you need to not cast spells
  → If you want Day (your daybound creatures): cast at least 1 spell each turn
Night-to-Day transition strategy:
  → To force Day: cast 2+ spells on your turn
  → To keep it Night: cast only 0-1 spells on your turn

In multiplayer: Day can change at every player's upkeep if the previous player's turn
had 0 spells (if day) or 2+ spells (if night). A highly interactive 4-player game
may flip day/night every upkeep.
```

## Definitive Conclusions

**Day/Night as Shared State:**
- Day/Night is unusual in that it's a SHARED state for the entire game table. All daybound and nightbound permanents controlled by ALL players transform simultaneously when day changes to night or vice versa. This means opponents' werewolves also transform.
- In Commander, this creates political situations: a player with many daybound creatures wants to maintain day; a player with nightbound creatures wants to maintain night. The other players' spell-casting behavior determines the outcome.

**The 0-spell / 2-spell Asymmetry:**
- The transition is asymmetric by design: day → night requires 0 spells cast; night → day requires 2+ spells. This means:
  - Maintaining night (staying night) requires EACH player to cast 0-1 spells per turn. Any player casting 2 flips it to day.
  - Maintaining day (staying day) requires each player to cast 1+ spell per turn. Any player casting 0 flips it to night.
  - Werewolf decks benefit from keeping night and try to disrupt opponents from casting enough spells.

**Entering During Night:**
- A daybound creature entering the battlefield while it's night immediately enters transformed (nightbound face). This is a replacement effect — it never enters as the daybound face and then flips; it enters already flipped.
- Similarly, a nightbound creature entering while it's day enters already as its daybound face.

**Transformation Triggers:**
- Each time a daybound permanent transforms to nightbound or back, it fires "whenever this transforms" triggers. In a deck with many werewolves, a day/night cycle triggers all of them simultaneously.

**Key cards:**
- *Tovolar, Dire Overlord / Tovolar, the Midnight Scourge* (MID): "Daybound. Whenever a Wolf or Werewolf you control deals combat damage to a player, draw a card." On his nightbound face (Tovolar, the Midnight Scourge): "{X}{R}{G}: Target Wolf or Werewolf you control gets +X/+0 and gains trample until end of turn." Commander for werewolf tribal — the nightbound face pumps werewolves to close out the game.
- *Arlinn Kord / Arlinn Embraced by the Moon* (SOI original): The original werewolf DFC planeswalker. Predates the daybound/nightbound keyword system but uses similar mechanics.
- *Moonmist* (INN): "Transform each Human you control. Prevent all combat damage that would be dealt by non-Werewolf sources this turn." Forces your own humans to transform to werewolves (forces night regardless of day/night state on your creatures).

## Canonical Examples

**Day/Night Cycle:**
- Game starts. Turn 1: player A casts *Reckless Stormseeker* (Daybound 3/3). It's now day (first daybound permanent).
- Beginning of player A's upkeep, turn 2: Did player A cast 0 spells last turn? No, they cast 1. Day → Day (no change).
- Player B cast 0 spells on their turn. Beginning of player B's upkeep: Did player B cast 0 spells? YES → it becomes NIGHT. All daybound permanents transform.
- *Reckless Stormseeker* flips to *Crash-Landing Ravager* (nightbound face) simultaneously with all other daybound permanents.

**Spell Count Trap:**
- To maintain night: you'd need ALL players in a 4-player game to cast ≤1 spell each turn. Impossible in a normal Commander game. Night is generally short-lived unless Werewolf decks specifically disrupt spell-casting.

## Commonly Confused With

- **P095** (DFC/Transform) — Regular transform triggers by specific card text; Daybound/Nightbound transform automatically based on the shared day/night game state; both result in transforming but different triggers
- **P417** (Suspend/Vanishing) — Both use automatic game-state tracking for transitions; Daybound/Nightbound tracks spells-cast-per-turn instead of time counters
- **P002** (Replacement Effects) — Daybound permanents entering during night is a replacement effect (they enter pre-transformed); same rule category as other "enters with" effects
- **P006** (Intervening-If) — Daybound/Nightbound transitions are checked at specific times (upkeep); similar to intervening-if structure but more complex due to the shared state
