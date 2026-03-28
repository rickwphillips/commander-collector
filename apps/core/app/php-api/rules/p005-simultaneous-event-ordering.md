---
id: p005
name: Simultaneous Event Ordering
category: stack
cr_refs: [101.4, 603.3b, 704.3, 704.8, 117.5]
tags: [APNAP, SBA, triggers, simultaneous, death, enters, multiple-triggers, ordering]
created: 2026-03-28
examples_count: 3
---

# P005 — Simultaneous Event Ordering

## Abstract
When multiple game events occur simultaneously — multiple creatures dying, multiple permanents entering, multiple abilities triggering — there is a defined order for how they are processed. The rules are precise: SBAs first, then triggers go on the stack in APNAP order. No event is truly simultaneous from the perspective of stack resolution.

## The Definitive Rule

**CR 117.5** — Before any player receives priority:
1. All applicable SBAs are performed simultaneously as one event
2. Repeat until no SBAs remain
3. All triggered abilities waiting to go on stack are placed in APNAP order
4. Repeat 1–3 until stable
5. Player receives priority

**CR 603.3b** — Multiple simultaneous triggers: placed in APNAP order. Within each player's triggers, that player orders them. SBAs are checked again after.

**CR 101.4 (APNAP order)** — Active player acts first, then each other player in turn order. For simultaneous choices, active player decides first.

**CR 704.8** — If an SBA results in a permanent leaving the battlefield simultaneously with other SBAs, that permanent's LKI is derived from game state before ANY of those SBAs were performed.

## The Pattern

```
WHEN multiple events would happen simultaneously:

  STEP 1: Identify all applicable SBAs
  STEP 2: Perform ALL simultaneously (as one event)
  STEP 3: If any SBA occurred, check again from STEP 1
  STEP 4: Once no SBAs remain, place all waiting triggers on stack in APNAP order
    → Active player places their triggers in any order they choose
    → Then each other player in turn order places theirs
    → Last trigger placed = first to resolve (top of stack)
  STEP 5: Check SBAs again; repeat until stable
  STEP 6: Active player gets priority

WITHIN APNAP trigger ordering:
  → The LAST trigger put on the stack by a player resolves FIRST
  → Strategic: a player can choose to put their most important trigger on top
```

## Definitive Conclusions

- **Two creatures dying simultaneously**: Both die at the same time. "When a creature dies" triggers see both deaths. If a creature has "when another creature dies" — it sees its companion's death too, because both deaths are one simultaneous event (unless the creature itself also died, per 603.10a LKI).
- **Artifact with "whenever a creature dies" trigger + creature with deathtouch dies at same time as the artifact**: The artifact sees both creatures die (including itself, looking back in time via 603.10a). The artifact's trigger fires twice even though the artifact is also dead.
- **Who controls simultaneous triggers**: The controller of the source at the time it triggered controls the trigger (603.3a). If control was transferred after trigger but before it went on stack, the new controller puts it on the stack (603.3c).
- **Active player's advantage**: In APNAP ordering, the active player places their triggers last within their own group, meaning they resolve first. This gives the active player strategic advantage in ordering their own triggers.
- **Player who just died**: Their triggers that were already on the stack remain; triggers that hadn't yet been placed on the stack when they left the game are removed.

## Canonical Example
Wrath of God resolves. Five creatures die simultaneously. A player controls "Soul Warden" (when a creature enters, you gain 1 life) — wait, that's ETB not death. Better example: player controls "Blood Artist" (whenever a creature dies, target player loses 1 life and you gain 1 life). Blood Artist and four other creatures all die to Wrath. Blood Artist's trigger fires for each of the 5 deaths (including itself, looking back via 603.10a). The player controls all 5 triggers and stacks them in any order they choose.

## Additional Examples

**Example 2 — Simultaneous ETB and death:**
You cast a creature that has "when this enters, destroy target creature." Multiple creatures die due to the ETB effect plus other SBAs simultaneously. All deaths form one SBA check. All resulting triggers go on the stack in APNAP order after.

**Example 3 — APNAP ordering strategy:**
Active player has two triggers: Trigger A ("draw a card") and Trigger B ("deal 2 damage to opponent"). Active player WANTS damage to resolve first. They put Trigger A on the stack first, then Trigger B on top. Trigger B resolves first (damage), then Trigger A (draw). Strategic placement.

## Commonly Confused With
- **P007 (Priority Windows)** — After triggers are placed, both players have priority to respond before any trigger resolves.
- **P006 (Intervening If Clause)** — An intervening-if trigger checks condition at placement and resolution, not at simultaneous event time.
