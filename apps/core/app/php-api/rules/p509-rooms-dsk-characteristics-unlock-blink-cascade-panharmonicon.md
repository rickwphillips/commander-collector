---
id: p509
name: Rooms — Characteristic Zones, Unlock Triggers, Blink-Reset, Cascade MV, and Panharmonicon Trap
category: zones
cr_refs: [712.1, 712.2, 712.3, 712.4, 702.186, 614.1]
tags: [room, door, unlock, locked, duskmourn, DSK, eerie, fully-unlock, panharmonicon, blink, cascade, mana-value, copy, characteristics, special-action, enchantment, two-faced]
created: 2026-03-30
examples_count: 4
---

# P509 — Rooms — Characteristic Zones, Unlock Triggers, Blink-Reset, Cascade MV, and Panharmonicon Trap

## Abstract
Rooms (Duskmourn, 2024) are enchantments with two halves ("doors") sharing a single physical card. Their characteristics change radically by zone: in non-battlefield zones (hand, library, graveyard), both halves combine into one card with a combined mana value; on the stack, only the cast door's characteristics exist; on the battlefield, only the **unlocked** doors' characteristics are active (a Room with both doors locked has no name and no abilities at all). Casting a Room unlocks the cast half on entry — but "when you unlock this door" ETB-adjacent triggers are **not** ETB triggers proper and are therefore not doubled by Panharmonicon. Rooms that enter from any zone other than the stack (blinking, reanimation, token-copy) enter with **both doors locked**, making them temporarily blank enchantments. The combined mana value matters for cascade and other MV checks: Bottomless Pool ({U}) + Locker Room ({4}{U}) has MV 6 in your library, not MV 1 or MV 5.

## The Definitive Rules

**Official Ruling (2024-09-20, Dazzling Theater):** *"If a Room enters from any zone other than the stack, it will enter with both halves locked."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"While on the battlefield, a Room's characteristics are a combination of the characteristics of its unlocked doors only. If neither door of a Room is unlocked, it's a Room enchantment with no name and no abilities."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"While in any zone other than the stack or the battlefield, a Room card's characteristics are a combination of its two doors. For example, Bottomless Pool // Locker Room has a mana value of 6 while it's in your library."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"An ability that triggers 'when you unlock this door' triggers when that door becomes unlocked. This can happen one of two ways: (1) the door becomes unlocked on the battlefield or (2) the door becomes unlocked as the Room enters the battlefield because you cast the corresponding half. In the latter case, since the door becoming unlocked is what causes the ability to trigger, effects that cause abilities that trigger when a permanent enters to trigger an additional time (such as that of Panharmonicon) won't apply."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"An ability that triggers 'whenever you fully unlock a Room' triggers when a door becomes unlocked and the other door of that Room is already unlocked, or when both doors of that Room become unlocked simultaneously."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"To cast a Room spell, choose a half (or 'door') to cast. There's no way to cast both halves of a Room card."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"Room cards have two card faces with a shared type line on a single card. Each Room card is a single card. For example, if you discard a Room card, you've discarded one card, not two."*

## The Pattern

```
ROOMS — WHERE AND HOW CHARACTERISTICS EXIST:

  ZONE: Hand, Library, Graveyard, Command Zone:
    → Both doors COMBINE into one card.
    → MV = sum of both doors' mana costs.
    → Example: Bottomless Pool ({U} = 1) + Locker Room ({4}{U} = 5) = MV 6 in library.
    → This affects:
        - Cascade: an Ulamog that cascades won't find this with MV ≤ 5 threshold.
        - Transmute/Search: if searching for MV ≤ 3, cannot find Bottomless Pool // Locker Room.
        - Even if one door has MV 1, the card still has MV 6 in the library.

  ZONE: Stack (while casting):
    → Only the CAST DOOR's characteristics exist.
    → The other door is ignored entirely.
    → Example: Casting only Bottomless Pool ({U}): spell is MV 1, blue, targets a creature.
    → If countered: the card goes to the graveyard as a 2-door Room card (MV 6 again).

  ZONE: Battlefield (unlocked doors only):
    → Only UNLOCKED doors contribute characteristics.
    → If door A is unlocked and door B is locked: only door A's name, abilities, MV contribute.
    → If BOTH doors locked: NO NAME, NO ABILITIES (just "Room Enchantment").
      This matters for aura targeting, "enchantment with an ability" checks, etc.

  ZONE: Battlefield (both doors unlocked):
    → Both doors combine: both names active, both MV, all abilities from both doors.

ENTERING THE BATTLEFIELD:

  (a) Cast normally → cast door is unlocked on entry; other door is locked.
  (b) Enter from ANY OTHER SOURCE (blink, reanimate, flash in, copy, create as token):
    → BOTH DOORS START LOCKED.
    → The Room is immediately a blank "Room Enchantment" with no name and no abilities.
    → Eerie would trigger for the enchantment ETB (if you control an Eerie source).
    → The "fully unlock" Eerie trigger does NOT fire on entry (neither door is unlocked).
    → You must pay the mana costs of both doors (as sorcery-speed special actions) to unlock them.

UNLOCKING:

  NORMAL UNLOCK (special action):
    → During your main phase, with priority, stack empty.
    → Pay the locked door's mana cost.
    → That door becomes unlocked.
    → Doesn't use the stack; can't be responded to.
    → "When you unlock this door" trigger fires (if any).
    → If it's the second door: "whenever you fully unlock a Room" triggers (if Eerie source).

  ABILITY-BASED UNLOCK:
    → Some effects say "unlock target door of a Room you control."
    → You cannot choose an already-unlocked door (no effect).
    → If you target a fully-unlocked Room anyway (required target): trigger fires, does nothing.
    → If the door you unlock has a "when you unlock this door" ability needing targets,
        and no legal targets exist: you CAN still unlock the door; the trigger just doesn't go
        on the stack (no targets available → ability doesn't trigger).

"WHEN YOU UNLOCK THIS DOOR" — TWO TRIGGER PATHWAYS:

  Pathway 1: The door is unlocked AS THE ROOM ENTERS (from casting that half).
    → The trigger fires (door became unlocked → ability triggers).
    → But: Panharmonicon does NOT double this trigger.
      "Since the door becoming unlocked is what causes the ability to trigger, effects that
      cause abilities that trigger when a permanent enters to trigger an additional time
      (such as that of Panharmonicon) won't apply."
    → This is because the trigger condition is "when you unlock this door" — not "when this
        permanent enters." Panharmonicon looks for the ETB event, not the unlock event.
    → Result: Even with Panharmonicon, each "when you unlock this door" fires only ONCE
        when cast normally.

  Pathway 2: The locked door is paid as a sorcery-speed special action.
    → The trigger fires.
    → Panharmonicon clearly doesn't apply (this isn't an ETB at all).

"WHENEVER YOU FULLY UNLOCK A ROOM" — EERIE TIMING:

  Eerie fires on TWO conditions (both relevant for Rooms):
    (1) Whenever an enchantment you control enters the battlefield.
        → Fires when you cast and resolve a Room (one trigger per Room cast).
        → Fires when a Room enters from blink/reanimate (one trigger).
    (2) Whenever you fully unlock a Room.
        → Fires when the SECOND door becomes unlocked (making both unlocked).
        → Does NOT fire when both doors are already unlocked (second condition is past).
        → IMPORTANT: Does not fire when a Room enters with one door unlocked from casting.
          Only fires when you PAY THE SORCERY-COST to unlock the second door later.

  FULLY UNLOCK TRIGGER CONDITION:
    "Triggers when a door becomes unlocked AND the other door is already unlocked,
     OR when both doors become unlocked simultaneously."
    → Paying the second door cost (sorcery): standard case.
    → Abilities that unlock both simultaneously: also fires once (not twice).
    → Casting a Room does NOT trigger "fully unlock" even though it enters unlocked —
      you're locking the card after blink/reanimate would need TWO sorcery-pays to trigger it.

BLINKING A ROOM (entering from non-stack zone):

  Ephemerate, Conjurer's Closet, Yorion, etc. exile then return the Room.
  On return: BOTH DOORS START LOCKED.

  Net result:
    → You lose all currently-unlocked abilities (including ongoing continuous effects).
    → You get ONE Eerie trigger (enchantment enters).
    → You do NOT get "fully unlock" Eerie (neither door is unlocked on entry).
    → You must spend mana again to re-unlock doors (sorcery speed, one at a time).
    → If you re-unlock the second door: you get "fully unlock" Eerie again (if applicable).

  DAZZLING THEATER // PROP ROOM BLINK TRAP:
    Dazzling Theater gives creature spells you cast convoke.
    Prop Room lets your creatures untap during each other player's untap step.
    If the Room is blinking, BOTH effects are gone until you re-unlock.
    Prop Room (the locked door) provides NO untap — you get nothing.

COPY EFFECTS ON ROOM SPELLS:

  "If a spell or ability would create a copy of a Room spell on the stack, the copy retains
   the choice of which door was cast but also retains the full characteristics of the spell.
   The characteristics of the door that wasn't cast are still ignored while the copy is on
   the stack, and when the copy resolves, the token it becomes will enter with the
   appropriate door unlocked."

  → A Twincast copying "Bottomless Pool" (one door): copy enters with Bottomless Pool unlocked.
  → The copy does NOT have Locker Room unlocked.
  → If you control Panharmonicon: still no double trigger (same rule as normal cast).

CHARRED FOYER // WARPED SPACE — FULLY UNLOCKED PAYOFF:

  Charred Foyer ({3}{R}): "At the beginning of your upkeep, exile the top card of your library.
    You may play it this turn."
  Warped Space ({4}{R}{R}): "Once each turn, you may pay {0} rather than pay the mana cost
    for a spell you cast from exile."

  When BOTH are unlocked:
    Each upkeep: exile top card of library.
    Cast it this turn for {0} (if a spell; lands can be played normally as a land drop).
    This is a potent card advantage engine costing {0} per turn once assembled.

  Note: You must still follow timing rules (Charred Foyer ruling: play it as you normally would —
    if it's a land, you need it as your land drop; if it's a sorcery, cast at main phase).
  Note: If you cast a spell for {0} via Warped Space, you can't also pay other alternative costs.
    Mandatory additional costs (kicker, bargain) must still be paid.
```

## Definitive Conclusions

- **Rooms have MV = combined total in hand/library/graveyard** — a {U} + {4}{U} Room has MV 6 in your library; cascade and search spells that check MV find or skip the whole card, not one door.
- **Only the cast door's characteristics exist on the stack** — the other door is invisible to effects checking spell characteristics.
- **Blinking/reanimating a Room enters it with BOTH doors locked** — it has no name and no abilities until you re-unlock; you only get one Eerie trigger (ETB), not the "fully unlock" Eerie.
- **Panharmonicon does NOT double "when you unlock this door" triggers** — the trigger is on door-unlock, not on permanent-entering; Panharmonicon only doubles ETB triggers.
- **A Room with both doors locked has no name and no abilities** — it's just "Room Enchantment," which matters for aura legality, ability checks, and triggered conditions.
- **"Fully unlock" Eerie fires only when the second door is unlocked, not on initial entry** — casting a Room unlocks one door, but the "fully unlock" trigger requires the other door to be unlocked separately.

## Canonical Example

**Bottomless Pool // Locker Room — Blink and Cascade MV:**

You control Bottomless Pool // Locker Room with both doors unlocked (6/6-like configuration: has bounce trigger and draw-on-combat-damage ability). You use Ephemerate on it.

It exits the battlefield (LTB triggers, if any). It re-enters: BOTH doors are locked. No "when you unlock this door" trigger fires. No "fully unlock" Eerie fires. One Eerie trigger fires (enchantment entered).

Your Room is now a nameless Room enchantment with no abilities. You must pay {U} (sorcery speed) to unlock Bottomless Pool and {4}{U} (sorcery speed) to unlock Locker Room.

Meanwhile, an opponent's cascade card (something with cascade for cards MV < 6) cannot cascade into Bottomless Pool // Locker Room from your deck since its library MV is 6.

**Example 2 — Panharmonicon + Room Cast:**

You control Panharmonicon ({4}: artifact; "whenever a creature or artifact enters, if an ability triggers because of that, it triggers an additional time"). You cast Dazzling Theater ({3}{W}), unlocking it.

Dazzling Theater's "when you unlock this door" ability triggers (it's the door becoming unlocked, not the permanent entering). Panharmonicon DOES NOT double this — the trigger is on "unlock" not "enter."

You gain convoke for creature spells once.

Later you pay {2}{W} (sorcery speed) to unlock Prop Room. "When you unlock Prop Room" triggers (if it has one — it doesn't, but the unlock action happens). "Whenever you fully unlock a Room" (Eerie) triggers if you have an Eerie source.

**Example 3 — Charred Foyer // Warped Space Assembled:**

Both doors are unlocked. During your upkeep: Charred Foyer exiles the top card of your library. You see a Divination ({2}{U}).

You cast Divination from exile this turn for {0} (Warped Space grants it). You draw two cards.

This repeats every turn: exile a card, cast it free. Creatures, instants, sorceries, artifacts — all cast for {0} from exile using Warped Space. Lands are played normally (not cast, so free-cast doesn't apply, but you can still play them as your land drop).

**Example 4 — Both Doors Locked After Reanimate:**

You reanimate (e.g., Animate Dead) a Bottomless Pool // Locker Room from your graveyard. It enters the battlefield with BOTH doors locked — it has no name, no abilities.

Animate Dead's "enchanted creature" clause tries to attach — but Animate Dead targets a "creature" and the Room is an enchantment (not a creature). Actually, Animate Dead could still reanimate it as a permanent... but the Room is not a creature card in the GY so it's not a valid Animate Dead target. It is a valid target for "return target permanent card from your graveyard" effects.

If returned by a "permanent" reanimation spell: enters with both doors locked. You must spend {U} and {4}{U} sorcery speed to unlock both. Until then: blank enchantment.

## Commonly Confused With
- **P496 (Duskmourn — Eerie, Impending, Manifest Dread)** — P496 covers the basic interaction between Rooms and Eerie (one ETB Eerie + one fully-unlock Eerie). P509 covers the deep characteristics of Rooms: MV in zones, Panharmonicon trap, blink behavior, and copy effects.
- **P204 (Double-Faced Cards)** — DFCs transform between faces and only have the current face's characteristics on the battlefield. Rooms are similar but distinct: both doors can be active simultaneously when both are unlocked; locking/unlocking is not a transformation.
- **P023 (Trigger Suppression vs. Replacement)** — Panharmonicon's non-application to "when you unlock this door" is a similar question about what event the trigger condition requires. The unlock trigger watches for "unlock," not "enters," so Panharmonicon cannot fire it twice.
