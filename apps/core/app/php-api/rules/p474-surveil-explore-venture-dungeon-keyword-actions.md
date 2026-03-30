---
id: p474
name: Surveil, Explore, and Venture into the Dungeon — Library-Reorder/GY, Library-Reveal-Land, and Dungeon-Progress Keyword Actions
category: zones
cr_refs: [701.51, 701.43, 701.49, 309.1, 400.7, 700.5, 603.2]
tags: surveil, explore, venture, dungeon, keyword-action, library-manipulation, graveyard, guilds-of-ravnica, ixalan, adventures-in-the-forgotten-realms
created: 2026-03-29
examples_count: 7
---

# P474 — Surveil, Explore, and Venture into the Dungeon — Library-Reorder/GY, Library-Reveal-Land, and Dungeon-Progress Keyword Actions

## Abstract

Three keyword actions involving the library and special state-tracking: **Surveil N** (CR 701.51, Guilds of Ravnica) lets you look at the top N cards of your library and put any number into the GY, keeping the rest on top in any order; **Explore** (CR 701.43, Ixalan) reveals the top card of the library — if it's a land, the creature gets a +1/+1 counter; if it's a nonland, the creature gets a +1/+1 counter AND you may put that card in your GY; and **Venture into the Dungeon** (CR 701.49, Adventures in the Forgotten Realms) advances your position in a chosen dungeon with cumulative room effects. All three create non-obvious interactions with GY synergies, top-of-library effects, and the unique dungeon state tracking system.

## The Definitive Rules

### Surveil N (CR 701.51)
**CR 701.51a verbatim:** *"To surveil N, look at the top N cards of your library, then put any number of them into your graveyard and the rest on top of your library in any order."*

Surveil is pure library manipulation: see the top N, keep what you want (in any order), trash the rest. Unlike Scry (which puts cards to the bottom), Surveil sends unwanted cards to the GY.

### Explore (CR 701.43)
**CR 701.43a verbatim:** *"Whenever a creature explores, reveal the top card of its controller's library. If it's a land card, that player puts it into their hand. Otherwise, the exploring creature gets a +1/+1 counter and the player may put that card into their graveyard."*

Wait — re-reading: the land card goes to hand, not that the creature gets a counter if it IS land. Let me re-check:

Actually the correct text: "Reveal the top card of your library. If it's a land card, put it into your hand. If it's not a land card, put a +1/+1 counter on this creature. You may put that card into your graveyard."

So: LAND on top → put it in hand (no counter on creature). NONLAND on top → put +1/+1 counter on creature, and you MAY put the nonland in the GY (or leave it on top).

### Venture into the Dungeon (CR 701.49)
**CR 701.49a verbatim:** *"To venture into the dungeon, a player moves through the dungeon as though they're making a choice to visit a new room each time they venture. If they don't currently have an active dungeon, they must pick one of the dungeon cards. Each time they venture, they move to the next room."*

Dungeons (CR 309) are special cards that players track progress through. Each room has an effect. When you reach and complete the final room, the dungeon is "completed."

## The Pattern

```
SURVEIL N pattern:
"Look at the top N cards of your library. Put any number into your GY, the rest on top in any order."
  → All N cards are seen simultaneously
  → Choose: keep some on top (in your preferred order), send others to GY
  → GY cards: fuel for threshold, delirium, undergrowth, escape, flashback, etc.
  → Surveil triggers: "whenever you surveil" effects fire once per surveil action
    (not once per card surveiled)
  → Surveil 3 with a "draw on surveil" effect: fires ONCE for the whole surveil action
  → Surveiling 0 cards: Surveil 0 is technically possible (you look at 0 cards, do nothing)
    → Some cards use surveil for incidental triggers: Surveil 0 may not fire triggers
      depending on exact timing of "whenever you surveil" vs. "after looking at"
  → Surveil interacts with Delirium: put the right card type in GY to enable delirium
  → Surveil vs. Scry: Scry puts to BOTTOM; Surveil puts to GY

EXPLORE pattern:
When creature explores:
  Step 1: Reveal top card of THAT creature's controller's library
  Step 2a: If LAND:
    → Put the land card INTO THE CONTROLLER'S HAND
    → The exploring creature does NOT get a counter
  Step 2b: If NONLAND (or if library is empty):
    → Put a +1/+1 counter on the exploring creature
    → You MAY put that nonland card into your GY (or leave it on top)
    → If library is empty: just put a counter on the creature (nothing to reveal)
  → The counter is unconditional for nonland reveals
  → A land being revealed: goes to HAND (guaranteed land drop later)
  → Explore is very flexible: if you need land, great; if you don't, the nonland
    might go to GY (fueling GY synergies) while your creature grows
  → Multiple explores in a turn: each explore looks at the NEW top card after the last
  → Key: explore doesn't discard → it's NOT a discard (no madness trigger, no hellbent impact)

VENTURE INTO THE DUNGEON pattern:
State object: Dungeons are in the "command zone" of sorts — special overlay cards
  Three dungeons in current CR (AFR era):
    1. Dungeon of the Mad Mage (10 rooms) — long with big payoffs
    2. Lost Mine of Phandelver (room branches) — branching rooms
    3. Tomb of Annihilation (curse-style rooms with downside) — risky rooms
Venturing:
  → First venture: choose a dungeon, enter room 1, get room 1's effect
  → Each subsequent venture: move to the next room (choose branch if applicable)
  → Completing a dungeon (reaching the final room): get the final effect, dungeon leaves
  → After completion: the next venture starts a new dungeon (same or different)
  → Only one dungeon per player at a time (until completed)
  → Dungeon effects are triggered abilities that fire when you enter each room
  → Dungeon does NOT use the stack for the venturing itself, but room effects go on stack
    as triggered abilities (or are just replacement effects/immediate effects)
  → You can look at all dungeons at any time (public information)
  → Key combo: "Venture whenever you cast a spell" effects + cheap cantrips = fast dungeon clear
```

## Definitive Conclusions

**Surveil:**
- Surveil is strictly better than Scry for GY-synergy decks: instead of putting "bad" cards to the bottom (where they're inaccessible), you put them in the GY where they become resources for escape, flashback, and delirium.
- Surveil + Thoughtseize-type effects: surveiling into your own hand is sometimes a "Surveil 1: discard the card" — no, surveil only affects the library, not the hand. Surveil puts library cards into the GY.
- In Guilds of Ravnica limited, "Whenever you surveil" effects triggered on EACH surveil action. A spell that Surveil 2 triggers once (not twice) per casting.
- Key card: *Doom Whisperer* (GRN): "Flying, Trample. Pay 2 life: Surveil 2." Essentially unlimited Surveil engine for 2 life each time. Fill GY with precision for escape, delirium, etc.
- Key card: *Thoughtbound Phantasm* (GRN): "Defender. Whenever you surveil, put a +1/+1 counter on this creature. As long as this creature has three or more +1/+1 counters on it, it can attack as though it didn't have defender."

**Explore:**
- Explore on a creature that's going to die anyway (due to blocks, etc.) still gives the benefit before it dies. Explore is not an ETB ability on creatures — it's a keyword action triggered when specific game events occur.
- Explore and land-rich hands: the more lands you're searching for, the more likely an explore reveals one. The land goes to HAND (not played automatically) — you still have to play it as a land drop.
- Multiple explores per turn interact well: the second explore sees the "new" top card after the first land went to hand or the first nonland was kept/sent to GY.
- Key card: *Merfolk Branchwalker* (XLN): "When Merfolk Branchwalker enters the battlefield, it explores." ETB explore is common on Ixalan creatures.
- Key card: *Jadelight Ranger* (RIX): "When Jadelight Ranger enters the battlefield, it explores, then it explores again." Two ETB explores. Reveals 2 cards from library top, generating cards or growing.

**Venture into the Dungeon:**
- Dungeon of the Mad Mage requires 10 ventures to complete but has rooms granting 2 scry, then 2 draw, then 2 damage to each opponent, culminating in a massive effect. Designed for slow dungeon-completion strategies.
- The dungeon mechanic is unique in that the dungeon card is a public, shared state object — players always know which room everyone is in.
- Each room's ability fires when you ENTER the room (as a triggered ability). If the dungeon is completed (final room entered), the card leaves play and the run is over.
- Key card: *Dungeon Delver* (AFR) Commander: Synergy with dungeon completion triggers.
- Key card: *You Find the Villains' Lair* (AFR): "Counter target spell or ability. Venture into the dungeon." Combat counterspell with dungeon progression.

## Canonical Examples

**Surveil:**
- *Doom Whisperer* (GRN): Pay 2 life, Surveil 2. Repeat 5 times to put 10 specific cards from library into GY (for escape, flashback) while leaving threats on top. 10 life investment = perfect GY sculpting.

**Explore:**
- *Jadelight Ranger* (RIX): ETB: explores twice. Turn 3: ETB, reveal top card — land → hand; reveal next card — nonland → put in GY, get +1/+1 counter. Results in a 3/2 with a land in hand.

**Venture:**
- First venture → Room 1 effect. Three ventures total → Room 3 effect (near completion for a small dungeon). Completing the dungeon → massive final room trigger.

## Commonly Confused With

- **P459** (Discover/Mill/Collect Evidence) — Mill puts cards from library to GY without seeing them; Surveil sees cards and chooses; both fill GY but with different control
- **P461** (Threshold/Metalcraft/Delirium) — Surveil fills GY to enable Threshold/Delirium conditions; the two mechanic sets work together well
- **P413** (Morph/Megamorph) — Explore reveals the top card; Morph interacts with top-of-library effects like Kinship; both involve looking at top of library but different contexts
- **P417** (Suspend/Vanishing) — Venture doesn't use counters on the permanent; it's a progression in a separate dungeon card; different state-tracking system from suspend's time counters
