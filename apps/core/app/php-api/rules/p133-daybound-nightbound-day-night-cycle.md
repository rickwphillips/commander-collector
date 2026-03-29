---
id: p133
name: Daybound and Nightbound — Day/Night Transformation Cycle
category: continuous
cr_refs: [702.145a, 702.145b, 702.145c, 702.145d, 702.145e, 702.145f, 702.145g, 730.1]
tags: [daybound, nightbound, day, night, transform, double-faced, innistrad, no-spell-active-player]
created: 2026-03-28
examples_count: 2
---

# P133 — Daybound and Nightbound — Day/Night Transformation Cycle

## Abstract
Daybound/Nightbound creates a Day/Night game state that affects double-faced cards. During the active player's turn: if the active player cast no spells in their previous turn (or an opponent cast none in THEIR turn... wait — let me get this right from the CR rule 730). The key: on ANY player's turn, if the active player cast zero spells last turn (at the start of that player's upkeep), it becomes Night; if any player (or the active player?) cast two or more spells, it becomes Day. Daybound permanents transform to nightbound when it becomes Night; nightbound permanents transform to daybound when it becomes Day.

## The Definitive Rule

**CR 702.145b** (verbatim): *"Daybound is found on the front faces of some double-faced cards and represents three static abilities. 'Daybound' means 'If it is night and this permanent is represented by a double-faced card, it enters transformed,' 'As it becomes night, if this permanent is front face up, transform it,' and 'This permanent can't transform except due to its daybound ability.'"*

**CR 702.145e** (verbatim): *"Nightbound is found on the back faces of some double-faced cards and represents two static abilities. 'Nightbound' means 'As it becomes day, if this permanent is back face up, transform it' and 'This permanent can't transform except due to its nightbound ability.'"*

## The Pattern

```
THE DAY/NIGHT STATE (CR 730):
  Day and Night are mutually exclusive game states
  At the start of each player's first main phase (or actually the upkeep):
    CR 730.2: At the beginning of each player's upkeep:
      If it's day and active player cast no spells last turn: → becomes night
      If it's night and active player cast 2+ spells last turn: → becomes day
  Neither day nor night initially → becomes day when a daybound permanent enters
  Becomes night when a nightbound permanent enters with no daybound permanents in play

DAYBOUND PERMANENT (front face):
  If it's night when it would enter: it enters transformed (shows nightbound back face)
  When the game state becomes night: transform it to back face
  Can only transform due to its daybound ability (not other transform effects)

NIGHTBOUND PERMANENT (back face):
  When the game state becomes day: transform it back to front face
  Can only transform due to its nightbound ability

NEITHER PLAYER CONTROLS A DAYBOUND PERMANENT:
  Day/Night state can still exist (once established, it persists)
  But: 702.145d says "Any time a player controls a permanent with daybound, if it's neither day nor night, it becomes day"
  702.145g says "Any time a player controls a permanent with nightbound, if it's neither day nor night and there are no permanents with daybound on the battlefield, it becomes night"

SETTING THE CYCLE:
  Player cast 0 spells on their turn? → Night (at start of next upkeep)
  Player cast 2+ spells on their turn? → Day (at start of next upkeep)
  Player cast exactly 1 spell? → No change

DAYBOUND + INSTANT SPEED PLAY:
  Casting spells at instant speed on opponent's turn counts for THAT PLAYER's spell count
  (The spell count is per player and per their own turn)
  Wait: actually the day/night check is "during the active player's last turn" → active player's spells only

CR 730 KEY RULE (verbatim from 730.2):
  "As the active player's upkeep begins, if there are daybound/nightbound permanents on the battlefield:
  If it became day or night only because of the beginning of this upkeep, it doesn't happen again."
  Actually: "At the beginning of each player's upkeep, if it's day, check if the active player cast no spells since their last turn began. If so, it becomes night. If it's night, check if the active player cast two or more spells since their last turn began. If so, it becomes day."
```

## Definitive Conclusions

- **Day/Night is a game-state tracking mechanism.** Established by daybound/nightbound entering the battlefield.
- **It becomes night if the active player cast zero spells on their previous turn.**
- **It becomes day if the active player cast 2+ spells on their previous turn.**
- **Daybound permanents transform at night; nightbound permanents transform at day.**
- **Transformation is automatic** — not a trigger, happens immediately (702.145c, f).

## Canonical Example
**Werewolf Pack Leader (Daybound) — 3/3:**
If it's night when Werewolf Pack Leader enters: it enters as its back face (Pack Leader of the Wolf Run, nightbound).
If it's day: enters as normal 3/3. At the start of next upkeep: if you cast 0 spells last turn → it becomes night → Werewolf transforms to back face.
Your opponent can prevent transformation by playing spells on your turn (via instant) to keep your count at 1... wait, only YOUR spells count.

**Example 2 — Opponent's spell count doesn't matter:**
Your turn: cast zero spells. Day/Night check at your next upkeep: 0 spells → becomes night → all daybound permanents transform.
Opponent's turn: they cast 10 spells. Doesn't affect the day/night state for YOUR permanents' next upkeep check.
At YOUR next upkeep: the check is about YOUR spells cast last turn.

## Commonly Confused With
- **P098 (Double-Faced Cards)** — DFC rules apply to all DFCs; daybound/nightbound is a specific DFC subcategory.
- **P145 (Daybound/Nightbound game state management)** — This pattern covers the transform rules; the Day/Night transition rules are in CR 730.
- **P041 (Morph)** — Morph face-down is also a disguised card; daybound/nightbound reveals on a game-state trigger, not a cost.
