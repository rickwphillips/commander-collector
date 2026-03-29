---
id: p221
name: Landfall — Triggered When a Land Enters Under Your Control
category: triggered
cr_refs: [603.6a]
tags: [landfall, land-enters, triggered, Zendikar, Hedron-Crab, Emeria-Angel, Akoum-Hellkite, fetch-lands]
created: 2026-03-28
examples_count: 2
---

# P221 — Landfall — Triggered When a Land Enters Under Your Control

## Abstract
Landfall is a triggered ability: "whenever a land enters the battlefield under your control, [effect]." Landfall fires once per land that enters. Fetch lands (Misty Rainforest, Scalding Tarn, etc.) trigger Landfall twice: once when the fetch land enters and once when the basic land enters after sacrificing the fetch. Landfall abilities range from simple (gain 1 life, put a +1/+1 counter) to powerful (create 3/3 tokens, deal 3 damage). Zendikar block built an entire set around Landfall, and it remains a significant mechanic in Commander and Legacy.

## The Definitive Rules

**CR 603.6a** (verbatim): *"Each time an event puts one or more permanents onto the battlefield, all permanents on the battlefield (including the permanents that entered) are checked for the landfall trigger condition (see rules 603.3 and 603.6)."*

Note: Landfall is the common name for abilities of the form "Whenever a land enters the battlefield under your control, [effect]." There's no specific CR rule number for "landfall" as a keyword — it's an informal name for this trigger pattern.

## The Pattern

```
LANDFALL TRIGGER:
  "Whenever a land enters the battlefield under your control": fires on ANY land entry
  Includes: playing your land for turn, fetchland search, Cultivate/Kodama's Reach putting lands into play, Crucible of Worlds replaying lands

  LANDFALL + FETCH LANDS:
    Misty Rainforest, Scalding Tarn, etc.: sacrifice for a basic land
    Turn 1: play Misty Rainforest → Landfall trigger #1 (Rainforest entered)
    Activate Rainforest: sacrifice, search for Island → Island enters → Landfall trigger #2
    Two Landfall triggers from one "land play" action
    This is why fetch lands are so powerful in Landfall decks

  LANDFALL + RAMP SPELLS:
    Cultivate ({2}{G}): "Search for a basic, put it into play, put another into hand."
    One land enters from Cultivate → Landfall trigger
    Kodama's Reach: same
    Harrow (instant): sacrifice a land, search for 2 basics, both enter tapped → TWO Landfall triggers

  LANDFALL + CRUCIBLE OF WORLDS:
    Crucible: "You may play lands from your graveyard."
    Fetch, play Crucible, then play the fetch land from graveyard each turn
    Each "play from graveyard" triggers Landfall
    With multiple fetches in graveyard: multiple Landfall triggers per turn

  LANDFALL + MULTIPLE LANDFALL CARDS:
    If you control three Landfall permanents: each land entry triggers all three
    One land entering → three Landfall triggers stack

  HEDRON CRAB (1/2):
    "Whenever a land enters, each opponent mills 3."
    In Legacy Dredge/Mill with 4 Hedron Crabs + fetch lands:
    One fetch = 2 triggers per Crab = 6 mills per Crab = 24 mills from one fetch!
    (4 Crabs × 6 mills each = 24 cards milled per fetch activation)

  AKOUM HELLKITE ({4}{R}{R}):
    "Whenever a land enters, Akoum Hellkite deals 2 damage to any target."
    "Whenever a basic Mountain enters, deals 2 damage instead of 2." (Actually varies)
    Turn 7 with multiple fetches: deal many 2-damage bursts from Landfall

  EMERIA ANGEL ({2}{W}{W}):
    "Landfall — Whenever a land enters, you may create a 1/1 white Bird token with flying."
    With fetch lands: 2 tokens per fetch use. Wide flying army from land plays.

  RETREAT TO EMERIA ({3}{W}):
    "Landfall — Whenever a land enters, choose one: create a 1/1 Kor token, or creatures you control get +1/+1 until end of turn."
    Modal: adapt based on game state. Defensive option (pump) or offensive (token).

  ZENDIKAR RISING (Double-Faced Lands):
    Zendikar Rising MDFCs: the land side also triggers Landfall when it enters
    Modal DFCs that are lands are still lands for Landfall

  LANDFALL IN COMMANDER:
    Omnath, Locus of Rage ({3}{R}{G}{G}): Landfall creates 5/5 Elemental tokens AND deals 3 damage when the Elemental dies
    Omnath, Locus of Creation ({R}{G}{W}{U}): 4 different Landfall abilities (gains 4 life, draws card, adds RRGG, creates a 4/4 Elemental)
    "Omnath" series of commanders are all Landfall-focused, each increasingly powerful

  LANDFALL + PRIORITY:
    Land enters → Landfall trigger goes on stack (when would-be priority player would receive)
    Can be responded to (land is already in play before trigger resolves)
    Unlike Miracle (draw step specific), Landfall fires in priority windows
```

## Definitive Conclusions

- **Landfall fires once per land entering under your control** — any land, any source.
- **Fetch lands give two Landfall triggers** — one for the fetch entering, one for the fetched land.
- **Multiple Landfall cards stack** — each fires independently when any land enters.
- **Hedron Crab + fetches** = massive milling in Legacy.
- **Omnath commanders** are the Commander payoffs — scaling from 4-life to 5/5 token armies.

## Canonical Example
**Zendikar Standard — Hedron Crab + Fetch Lands:**
Turn 1: Play Misty Rainforest → Hedron Crab Landfall #1: opponent mills 3.
Activate Rainforest: sacrifice, put Island into play → Hedron Crab Landfall #2: opponent mills 3.
6 cards milled turn 1 from one card.
Turn 2: Play Scalding Tarn → mill 3. Activate: mill 3 more.
12 cards milled from 2 turns.
With 4 Crabs and 8 fetch lands: can mill 30+ cards by turn 4.

**Example 2 — Omnath, Locus of Creation (Commander):**
First land each turn: gain 4 life. Second land: draw a card. Third land: add {R}{G}{W}{U}. Fourth land: create 4/4 Elemental.
With Azusa, Lost but Seeking (play 2 extra lands per turn): 3 lands per turn = gain life + draw + add mana.
Harrow (sacrifice land, search 2): sacrificing one land → two enter = second AND third Omnath trigger.
Two triggers: draw a card AND add {R}{G}{W}{U} from ONE Harrow cast.
Four-mana Harrow effectively draws a card and adds 4 mana of any colors.

## Commonly Confused With
- **P219 (Devotion)** — Devotion counts mana symbols in permanents. Landfall counts land entries. Both are "count" mechanics but for different resources.
- **P205 (Saga)** — Sagas fire chapter abilities on lore counter placement. Landfall fires on land entry. Both are triggered abilities but different events.
- **P221 vs Constellation** — Constellation fires when an enchantment enters. Landfall fires when a land enters. Both are "enters the battlefield" triggers for specific permanent types.
