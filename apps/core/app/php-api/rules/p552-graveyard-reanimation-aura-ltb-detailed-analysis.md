---
id: p552
name: Graveyard-Reanimation Aura LTB Mechanics (Detailed Analysis)
category: graveyard-permanents
cr_refs: [603.6c, 604.1, 704.5f, 109.1, 104.4b]
tags: [aura, reanimation, graveyard, ltb-trigger, replacement-effect, death-trigger, loop-analysis, sacrifice, last-known-information]
created: 2026-03-30
examples_count: 5
---

# P552 — Graveyard-Reanimation Aura LTB Mechanics (Detailed Analysis)

## Abstract

Graveyard-reanimation Auras (Animate Dead, Necromancy, Dance of the Dead) form a distinct pattern where:
1. The Aura enchants a creature **card** in the graveyard, then moves to the battlefield
2. Upon entering, the Aura gains a modified enchant clause targeting the creature **put onto the battlefield with this Aura** (not targetable later)
3. The Aura has a leaves-the-battlefield trigger forcing the creature to sacrifice
4. CR 603.6c governs LTB triggers: they use last-known information about the Aura, not the creature
5. When the enchanted creature dies, the LTB trigger fires independently — the creature's death trigger does NOT prevent it
6. Multiple Auras on one creature create multiple independent LTB triggers
7. Timing: replacement effects (e.g., Flicker effects) and the LTB trigger do NOT fire simultaneously; the creature moves zones first, then triggers resolve

## The Definitive Rules

**CR 603.6c** (Leaves-the-Battlefield abilities):
> Leaves-the-battlefield abilities trigger when a permanent moves from the battlefield to another zone. The ability uses the object's **last-known information** on the battlefield (immediately before the zone change) to determine what the ability does. If a leaves-the-battlefield ability references information about its source, that information is checked at the time the ability resolves. If the source is no longer where expected, last-known information is used.

**CR 109.1** (Object identity):
> An object that moves to a different zone becomes a new object with no memory of its previous characteristics — with specific exceptions. A card doesn't leave the zone it's in. However, if a permanent becomes a non-permanent as a result of an effect (e.g., Animate Dead enters, the creature card becomes a new object as it enters the battlefield).

**CR 704.5f** (State-based actions for creatures):
> If a creature is dealt damage greater than or equal to its toughness, that creature is destroyed as a state-based action. Destruction can be prevented by replacement effects (e.g., regeneration) or damage prevention.

**CR 104.4b** (Infinite loops):
> If a loop of **mandatory actions** has no way to stop (i.e., results in an infinite, repetitive sequence with no break condition), the game is a draw. Loops containing **any optional action** do not result in a draw; the player chooses to execute the loop a finite number of times or stop it. Once a mandatory loop begins, assume it repeats an arbitrarily large number of times, then analyze the final board state.

## The Pattern

### Aura Entry and Enchantment Clause Change

```
When reanimation Aura (e.g., Animate Dead) enters the battlefield:
  1. Triggered ability fires: "When this Aura enters, if it's on the battlefield, ..."
  2. Aura loses "enchant creature card in a graveyard"
  3. Aura gains "enchant creature put onto the battlefield with this Aura"
  4. Creature card is returned from graveyard to the battlefield (as a new object)
  5. Aura is attached to the new creature object
  6. Aura's LTB trigger is now active
```

### LTB Trigger Mechanics

```
When the enchanted creature dies (by any cause):
  - The creature is put into the graveyard zone
  - Creature's death-triggered abilities (e.g., "When ~ dies, ...") check last-known information
  - Aura's LTB trigger checks last-known information about the Aura (not the creature)
  - LTB trigger resolves: "that creature's controller sacrifices it"
    * Uses the Aura's last-known information to determine "that creature"
    * References the creature by identity (the object enchanted)
    * Even though the creature is now in the graveyard, the trigger references it there

Result: The creature is sacrificed while in the graveyard (if not already sacrificed).
        The sacrifice is NOT a duplicate of the death event; it's the Aura's trigger.
```

### Multiple Auras on One Creature

```
If multiple graveyard-reanimation Auras are on the same creature:
  - Each Aura has an independent "When this Aura leaves..." trigger
  - When the creature dies, each Aura's LTB trigger fires independently
  - Each trigger will attempt to sacrifice the creature
  - First trigger: creature is sacrificed from the graveyard
  - Subsequent triggers: creature is already sacrificed; "sacrifices it" has no further effect
```

### Flicker Effects and Aura LTB Timing

```
When a creature enchanted with a reanimation Aura is flicked (exiled and returned):
  Timing: [Creature leaves] -> [LTB triggers go on stack] -> [Creature returns] -> [Triggers resolve]

  Example: Creature + Animate Dead enters exile effect
    1. Creature leaves the battlefield (exile is the zone)
    2. Animate Dead's LTB trigger goes on the stack
    3. The creature returns to the battlefield (re-enters)
    4. Animate Dead was not reattached (it's in the graveyard from its LTB)
    5. LTB trigger resolves: attempts to sacrifice the creature (which is now unenchanted on the battlefield)

  This is NOT an infinite loop because the Aura leaves the battlefield and does not return.
```

### Sacrifice Outlet + Haste Loop Analysis

```
Setup: Animate Dead on creature with haste + sacrifice outlet (e.g., Viscera Seer)

Turn 1:
  a. Animate Dead enters, returns creature to battlefield, attaches
  b. Creature is untapped with haste
  c. Creature attacks (or taps with sacrifice outlet)
  d. Creature is sacrificed via outlet
  e. Creature moves to the graveyard (as a new sacrifice action)
  f. Animate Dead's LTB trigger fires
  g. LTB resolves: creature is already in the graveyard; "sacrifices it" does nothing

Analysis:
  - The sacrifice outlet's effect is mandatory BUT optional to activate
  - Animate Dead's LTB trigger is mandatory BUT the sacrifice action is on the creature (already sac'd)
  - This is NOT an infinite loop (the creature doesn't return to the battlefield)
  - This IS a valid turn sequence that generates a discard effect or life change
```

### Aura Cannot Attach: State-Based Action Resolution

```
If Animate Dead can't attach (e.g., creature has protection from black):
  1. Animate Dead enters the battlefield
  2. Triggered ability tries to execute:
     - Creature returns to battlefield (as a new object)
     - Aura tries to attach ("attach this Aura to it")
     - Legal? NO — creature has protection from black
  3. State-based action: Aura is put into the graveyard (can't be attached)
  4. Aura's LTB trigger fires (because Aura is now in graveyard)
  5. LTB resolves: "that creature's controller sacrifices it"
     - Creature is on the battlefield (still unenchanted)
     - Creature is sacrificed

Result: The creature dies anyway, even though Animate Dead couldn't attach.
        This is by design — the LTB trigger fires due to the attachment failure.
```

## Definitive Conclusions

1. **LTB Trigger ≠ Death Trigger**: The Aura's LTB trigger is **separate** from the creature's death trigger. Both fire when the creature is in the graveyard, but they use independent last-known information. The death trigger does NOT prevent the LTB trigger.

2. **Timing of Creature Death**: When the creature dies (by any cause), the LTB trigger fires **because the Aura left the battlefield**, not because the creature died. If the creature is sacrificed while the Aura is still on it, the creature goes to the graveyard, then the LTB trigger fires.

3. **Multiple Auras**: If 5 copies of Animate Dead are on the same creature, each has an independent LTB trigger. When the creature dies, all 5 triggers go on the stack. The first resolves and sacrifices the creature (it stays in graveyard); the remaining 4 resolve with no effect.

4. **Flicker Effects**: Exiling and returning the creature **detaches the Aura** (new object entering the battlefield is not the same Aura). The Aura goes to the graveyard. The LTB trigger then resolves, attempting to sacrifice the returned creature. This is not a loop because the Aura doesn't return.

5. **Sacrifice Outlet Loops**: Animate Dead + haste creature + sacrifice outlet does NOT create an infinite loop. The creature is sacrificed once, the LTB trigger fires with no further effect. The loop is finite. If there's a mechanism that returns the creature to the battlefield (e.g., another Aura or a triggered ability), then a loop *might* occur — but it must include an optional action to avoid a game draw.

6. **Mandatory vs. Optional**: The Aura's LTB trigger is **mandatory** — it always fires when the Aura leaves. The sacrifice action is also mandatory, but if the creature is no longer on the battlefield, it has no effect. Activating a sacrifice outlet is usually **optional**, so a creature + outlet + reanimation Aura does not create a mandatory infinite loop.

7. **Last-Known Information**: The LTB trigger uses the Aura's last-known information to determine which creature to sacrifice. If the Aura is destroyed/exiled after the creature dies, the LTB trigger still references the creature by the Aura's last-known information (the enchanted creature object).

## Canonical Examples

### Example 1 — Animate Dead on creature, creature is killed
**Setup**: Player casts Animate Dead on target creature in graveyard.
- Aura enters, returns creature to battlefield, attaches
- Opponent casts Lightning Bolt on creature
- Creature is destroyed, goes to graveyard
- Animate Dead's LTB trigger fires (because Aura loses the battlefield)
- LTB resolves: creature is sacrificed (already in graveyard, no further effect)
**Result**: Creature stays in graveyard. Animate Dead is in graveyard.

### Example 2 — Multiple Auras, same creature
**Setup**: Creature on battlefield with 3 Animate Deads attached (hypothetically).
- Creature is dealt 1 damage
- Creature is destroyed, goes to graveyard
- All 3 Auras' LTB triggers go on the stack (triggered by Aura leaving)
- Trigger 1 resolves: creature sacrificed (already in graveyard)
- Trigger 2 resolves: creature sacrificed (no effect, already sac'd)
- Trigger 3 resolves: creature sacrificed (no effect)
**Result**: Creature in graveyard, all 3 Auras in graveyard, no duplicate sacrifice events.

### Example 3 — Flicker interaction
**Setup**: Creature + Animate Dead on battlefield. Felidar Guardian enters.
- Felidar Guardian triggers: exile target creature (the animated creature)
- Creature leaves the battlefield
- Animate Dead's LTB trigger goes on stack
- Felidar Guardian's ability exiles the creature, then returns it (re-enters battlefield)
- Animate Dead's LTB resolves: sacrifices the creature (now on battlefield, unenchanted)
- Creature is sacrificed
**Result**: Creature was returned, then sacrificed. Aura is in graveyard. Infinite loop avoided.

### Example 4 — Animate Dead with protection from black
**Setup**: Creature in graveyard has protection from black. Animate Dead targets it.
- Animate Dead enters the battlefield
- Triggered ability: return creature, try to attach
- Creature returns to battlefield (as new object)
- Aura tries to attach: BLOCKED by protection from black
- State-based action: Aura put into graveyard
- Aura's LTB trigger fires (Aura left the battlefield)
- LTB resolves: creature is sacrificed (on battlefield)
- Creature is sacrificed
**Result**: Creature was returned and sacrificed. Animate Dead is in graveyard.

### Example 5 — Sacrifice outlet + haste creature
**Setup**: Creature with haste + Animate Dead on battlefield. Viscera Seer on the field.
- Creature enters battlefield with haste (via Animate Dead's entry trigger)
- Creature is not tapped; attacks with haste
- Creature is unblocked, deals damage
- Player sacrifices creature to Viscera Seer (scry 1)
- Creature goes to graveyard
- Animate Dead's LTB trigger fires
- LTB resolves: creature is sacrificed (already in graveyard, no effect)
**Result**: Creature dealt damage, was sacrificed via outlet, Animate Dead trigger had no further effect.
Note: This is NOT an infinite loop because the creature does not return to the battlefield.

## Additional Notes

### Replacement Effects vs. LTB Triggers
Replacement effects (e.g., "If ~ would be destroyed, exile it instead") can prevent the creature from dying, which may prevent the zone change that causes the LTB trigger. However, the LTB trigger is based on the Aura leaving, not the creature. If the creature never leaves the battlefield, the Aura can still leave (e.g., Aura is destroyed), causing the LTB trigger to fire. The creature is then sacrificed by the LTB trigger.

### "Enchant Creature Put Onto the Battlefield With This Aura"
This enchant clause is special: it does **not** target the creature. Instead, it's a one-time attachment at the moment the creature enters the battlefield. This prevents the Aura from being moved to other creatures or re-attached after entering. The Aura stays attached until the Aura leaves the battlefield (destroyed, exiled, etc.), at which point the LTB trigger fires.

### Scryfall Rulings
From official Scryfall rulings on Animate Dead (EMA 78):
- "If Animate Dead isn't on the battlefield as its triggered ability resolves, none of its effects happen."
- "If the creature put onto the battlefield has protection from black—or if the creature can't legally be enchanted by Animate Dead for another reason—Animate Dead won't be able to attach to it. It will be put into the graveyard as a state-based action, causing its delayed triggered ability to trigger. When the trigger resolves, if the creature's still on the battlefield, its controller will sacrifice it."

## Commonly Confused With
- **P002 (Replacement vs. Trigger)**: LTB triggers fire after the zone change completes; replacement effects run before it. Aura's LTB is a triggered ability, not a replacement.
- **P003 (Zone Change & Object Identity)**: The creature is a new object when it enters the battlefield. The Aura references the creature by enchantment, not by name.
- **P005 (Simultaneous Event Ordering)**: If the creature dies and multiple Auras leave simultaneously, their LTB triggers go on the stack in LIFO order (last-attached Aura's trigger is on top).
- **P007 (Priority Windows)**: Cannot respond to the creature entering or the Aura attaching; these are part of the resolution of a triggered ability. Can respond once the ability finishes resolving and LTB triggers go on the stack.
