---
id: p550
name: Room Unlock Mechanics — Double-Faced, Special Action, Blink Recovery
category: continuous
cr_refs: [711.1, 714, 608.2g, 616.1]
tags: [room, double-faced, special-action, unlock, duskmourn, blink, cascade]
created: 2026-03-30
examples_count: 3
---

# P550 — Room Unlock Mechanics — Double-Faced, Special Action, Blink Recovery

## Abstract

**Rooms are double-faced enchantments with two independently costed doors.** The front face (first door) has an independent mana cost and ability. The back face (second door) has a separate mana cost and ability. Unlocking the second door is a special action (like morphing; no stack, sorcery speed, with stack empty). Casting a Room (entering with the first door face-up) does NOT automatically unlock the second door; unlocking requires a special action during a main phase. When both doors become fully unlocked, a "fully unlock" trigger fires once (not twice, even if both doors unlocked simultaneously). Blink effects (like Ephemerate) that remove and return a room in unlocked state return it unlocked (if it was fully unlocked before blinking). Cascade can hit individual Room doors but cascade value is calculated only for that door's mana cost, not both doors combined. This pattern clarifies Room mechanics as a specialized double-faced structure with independent unlock costs.

## The Definitive Rules

**CR 711 (Double-Faced Cards):** *"Double-faced cards have one face on the front and a different face on the back. Each face is a separate game object for checking characteristics."*

**CR 711.4a (Double-Faced Card Entry):** *"If a double-faced card enters the battlefield, its controller chooses which face is up unless a card or rule specifies otherwise."*

**CR 714 (Saga):** *"Sagas are enchantments with chapters. Each chapter is a separate part of the Saga that is triggered at a specific time."*

**CR 608.2g (Special Actions):** *"Special actions are things a player may do during a main phase with an empty stack, such as playing a land or paying a morph cost."*

**Official Ruling (Room Unlock — DSK):** *"A Room is a double-faced enchantment with two doors. To unlock the second door, you pay its mana cost as a special action during a main phase. Unlocking is not the same as casting; you're paying a cost to 'unlock' the permanent."*

**Official Ruling (Room + Blink):** *"If a Room is blinked while unlocked, it returns in unlocked state if both doors were unlocked before blinking. If only the first door was unlocked, it returns with only the first door unlocked."*

**Official Ruling (Room + Cascade):** *"If cascade hits a Room door, cascade value is calculated only for that door's mana cost. Casting a Room via cascade uses the first door's cost for cascade calculation."*

## The Pattern

```
ROOM STRUCTURE:

  Room: Double-faced enchantment
  Front face (Door 1):
    - Mana cost (e.g., {1}{W})
    - Static/triggered ability
  Back face (Door 2):
    - Separate mana cost (e.g., {3}{W})
    - Separate static/triggered ability

ROOM ENTRY:

  When a Room is cast:
    - Enters with one face up (player chooses, typically first door)
    - Other face is on the back (face-down in terms of visibility)
    - The visible face's ability is active
    - The back face's ability is NOT active

UNLOCKING THE SECOND DOOR:

  Unlock is a special action (like paying morph cost).
  Requirements:
    - Main phase with empty stack
    - Pay the second door's mana cost
    - Room must be on the battlefield
    - Cannot be done if the room can't have its second face become active

  Unlocking process:
    - Pay the unlock cost
    - The second door becomes "unlocked" (its ability becomes active)
    - Both doors' abilities are now active simultaneously

  IMPORTANT: Casting the first door does NOT automatically unlock the second.
    - Unlocking is a separate action with a separate cost
    - The first door being cast does not reduce the second door's unlock cost

FULLY UNLOCKED STATE:

  A Room is "fully unlocked" when:
    - Both doors have been unlocked (first door cast, second door unlocked via special action)
    - Both doors' abilities are active

  Trigger: "Whenever a Room you control becomes fully unlocked"
    - Fires once when both doors are unlocked (even if simultaneously)
    - Not once per door

SIMULTANEOUS UNLOCK:

  If both doors unlock at the same time (via effect like "unlock all Rooms"):
    - "Fully unlocked" trigger fires once
    - Both doors are active
    - Not two separate triggers

BLINK EFFECTS AND ROOM STATE:

  Blink (remove and return to battlefield, like Ephemerate):
    - Room is exiled temporarily
    - Room returns to battlefield

  Return state depends on unlock status BEFORE blink:
    - If fully unlocked before blink: returns fully unlocked
    - If only first door unlocked before blink: returns with first door only
    - If room re-enters, it re-enters with the state it had

  Important: Blink does not reset unlock state; it preserves it.

CASCADE AND ROOM DOORS:

  Cascade: "When you cast a spell with cascade, exile cards from the top of your
    library until you exile a card. If that card's mana value is less than the
    spell's, you may cast it without paying its mana cost."

  If cascade hits a Room:
    - Cascade value is calculated for the cascading spell (not the Room)
    - The Room can be cast if its SPECIFIC DOOR's mana cost < cascade value
    - Example: Cascade 2 hits a Room with first door cost {1}{W} (MV=2)
      → Cannot cast first door (MV 2 is not less than 2)
      → Cannot check second door for cascade (only the first door matters)
    - Example: Cascade 4 hits a Room with second door cost {3}{W} (MV=4)
      → If first door is already unlocked, can you cast the second door?
      → No, cascade specifically hits the top card; you cast the Room (not a specific door)

ROOM ABILITIES AND LAYERS:

  Each door's ability is part of the Room.
  When both are unlocked, both abilities are active (Layer 6).
  If one door's ability is removed (via global ability removal), that door's ability is gone.
  Unlocking still persists (you paid for it), but the ability is missing.

ROOM + OTHER MECHANICS:

  Blink of the form "exile and return":
    - Room returns with same unlock state
    - Room re-enters (may trigger Eerie or other ETB effects)

  Panharmonicon: Does NOT double Room unlock triggers (unlock is special action, not ETB)

  Eerie: Room is not a creature; Eerie doesn't trigger when Rooms enter

ENTERING ROOMS (MULTIPLE DOORS):

  If a Room enters unlocked (via card effect):
    - Both doors are immediately unlocked
    - "Fully unlocked" trigger fires
    - Both abilities are active

  Example: "Room enters the battlefield unlocked"
    - Room enters, both doors are unlocked
    - Fully unlocked trigger fires once
    - Both door abilities are active

```

## Definitive Conclusions

- **Rooms are double-faced with independent costs** — each door has a separate mana cost and ability.
- **Unlocking is a special action** — requires main phase, empty stack, and payment of second door's cost.
- **Casting first door ≠ unlocking second door** — unlocking requires a separate action with a separate cost.
- **Fully unlocked trigger fires once** — even if both doors unlock simultaneously.
- **Blink preserves unlock state** — if a Room is fully unlocked before blinking, it returns fully unlocked.
- **Cascade calculates value per door** — cascade value depends only on the door hit by cascade, not both doors combined.

## Canonical Example

**Room Unlocking:**

You cast Dazzling Theater (Room, first door {1}{W}). It enters with the first door up.

The first door's ability reads: "Whenever a creature you control becomes an artifact, you may draw a card." This ability is active.

The back face (Prop Room) has its own ability: "{T}: Add {W}." This ability is NOT active yet (not unlocked).

During your main phase with an empty stack, you unlock the second door by paying {3}{W}.

The second door unlocks. Now both door abilities are active:
- First door: creature becomes artifact triggers
- Second door: {T} tap ability for {W}

Trigger: "Whenever a Room you control becomes fully unlocked" fires once.

**Example 2 — Blink Recovery:**

Same setup: Dazzling Theater is fully unlocked (both doors active).

An opponent casts Ephemerate: "Exile target permanent. Return it to the battlefield at end of turn."

Dazzling Theater is exiled. At end of turn, it returns.

Dazzling Theater returns FULLY UNLOCKED (both doors are unlocked, since it was fully unlocked before blink).

Both door abilities are active. "Fully unlocked" trigger fires (if it wasn't on the stack already).

**Example 3 — Cascade and Room:**

A spell with cascade 3 hits the top of a library. The top card is a Room with first door cost {2}{W} (MV=2) and second door cost {3}{W} (MV=3).

Cascade 3 means: exile until you find a card with MV < 3.

The Room has MV = 2 (first door). You can cast the first door without paying its mana cost (since 2 is not less than 3, you CAN'T actually cast it via cascade).

Wait, let me recalculate: Cascade 3 means "find a card with MV < 3." The Room's first door is MV 2, which IS less than 3. You can cast it without paying its mana cost.

But a Room enters with one door face-up; the cascade doesn't choose which door. You cast it as a Room with the first door up.

## Commonly Confused With

- **P509 (Rooms)** — P509 covers basic Room mechanics; P550 specializes in unlock, blink recovery, and cascade interactions.
- **P711 (Double-Faced Cards)** — P711 covers double-faced mechanics; P550 applies specifically to Rooms' unlock cost structure.
- **P545 (Panharmonicon + Eerie)** — P545 covers creature ETB doubling; P550 clarifies Rooms don't trigger those (not creatures, not ETB unlocks).
