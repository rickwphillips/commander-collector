---
id: p122
name: Ascend — City's Blessing at 10 Permanents
category: continuous
cr_refs: [702.131a, 702.131b, 702.131c, 702.131d]
tags: [ascend, city-blessing, ten-permanents, static-ability, permanent-marker, ixalan, irreversible]
created: 2026-03-28
examples_count: 2
---

# P122 — Ascend — City's Blessing at 10 Permanents

## Abstract
Ascend grants you the City's Blessing once you control 10 or more permanents — and it's irreversible for that game. The City's Blessing is a game designation, not a permanent or counter. On instants/sorceries, ascend is a spell ability that checks at resolution. On permanents, ascend is a static ability that continuously checks if you meet the threshold. Once you have the City's Blessing, you keep it even if your permanent count drops below 10. Many cards have bonus effects "if you have the City's Blessing."

## The Definitive Rule

**CR 702.131a** (verbatim): *"Ascend on an instant or sorcery spell represents a spell ability. It means 'If you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131b** (verbatim): *"Ascend on a permanent represents a static ability. It means 'Any time you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131c** (verbatim): *"The city's blessing is a designation that has no rules meaning other than to act as a marker that other rules and effects can identify. Any number of players may have the city's blessing at the same time."*

## The Pattern

```
GETTING THE CITY'S BLESSING:
  Instant/sorcery with ascend: check at resolution
    If you control 10+ permanents AND don't have the blessing: you get it
  Permanent with ascend: continuously checked (static ability)
    Any time you control 10+ permanents AND don't have the blessing: you get it
    (This happens automatically, no activation needed)

CITY'S BLESSING — PERMANENT DESIGNATION:
  Once obtained: lasts for the rest of the game
  Can't be lost (even if permanents drop below 10)
  Any number of players can have it simultaneously
  The blessing itself is not a permanent, token, or counter

HOW CARDS USE THE CITY'S BLESSING:
  "if you have the city's blessing, [bonus effect]"
  Examples: larger tokens, additional abilities, can't be targeted
  All such effects check if the controller has the designation

COUNTING PERMANENTS FOR ASCEND:
  Count ALL permanents you control: lands, creatures, artifacts, enchantments, planeswalkers, battles
  Including the permanent with ascend itself (if on a permanent)
  Tokens count as permanents while on the battlefield

CONTINUOUS EFFECT (on permanents):
  If you have a permanent with ascend and go above 10 permanents:
    The game automatically notices and gives you the blessing
  No trigger goes on the stack — it just happens as part of continuous evaluation
  CR 702.131d: After getting the blessing, continuous effects are reapplied
    (In case some effects depend on having the city's blessing)

INSTANT/SORCERY TIMING:
  Ascend on an instant: checks at resolution time
  If you have 10+ permanents at that moment and don't have the blessing: get it
  If you have fewer than 10: no blessing (spell resolves without granting it)

MULTIPLAYER:
  Each player independently can have the city's blessing
  The 10-permanent threshold is per-player
```

## Definitive Conclusions

- **City's Blessing is permanent once obtained** — lasts for the rest of the game.
- **On permanents, ascend continuously checks for 10+ permanents.** No activation needed.
- **On instants/sorceries, it's a spell ability checked at resolution.**
- **All permanents count** — lands, tokens, everything.
- **Multiple players can all have the City's Blessing simultaneously.**

## Canonical Example
**Paladin of Atonement (Ascend on a permanent, sort of):** Actually uses the static ascend.
You control 10 permanents (including 5 lands, 3 creatures, 2 artifacts). The static ascend ability on a permanent triggers → you get the City's Blessing.
Later: board wiped down to 2 permanents. You still have the City's Blessing. All "if you have the city's blessing" effects still apply.

**Example 2 — Ascend on a sorcery:**
Cast Secrets of the Golden City (Ascend). At resolution: you control 10+ permanents → you get the City's Blessing AND draw 3 cards (the ascend bonus). If fewer than 10: draw 2 cards and no blessing.

## Commonly Confused With
- **P006 (Intervening If Clause)** — Ascend on permanents is checked continuously, not as an intervening-if. It happens automatically as a static ability.
- **P031 (Win/Lose Conditions)** — The City's Blessing can enable win conditions on some cards ("if you have the city's blessing, you win") — those follow normal win-condition rules.
