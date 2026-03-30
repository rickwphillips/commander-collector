---
id: p515
name: Eerie (DSK) — Dual Trigger Condition, Simultaneous ETB Stacking, and Fully-Unlock vs. Cast-Unlock Distinction
category: triggered
cr_refs: [603.2c, 603.3b, 712.4, 614.1c]
tags: [eerie, ability-word, enchantment-etb, fully-unlock, room, door, unlock, simultaneous-etb, trigger-count, duskmourn, DSK, panharmonicon, ghostly-dancers]
created: 2026-03-30
examples_count: 4
---

# P515 — Eerie (DSK) — Dual Trigger Condition, Simultaneous ETB Stacking, and Fully-Unlock vs. Cast-Unlock Distinction

## Abstract
**Eerie** (Duskmourn: House of Horror, 2024) is an ability word for a triggered ability with **two distinct trigger conditions**: (1) whenever an enchantment you control **enters the battlefield**, and (2) whenever you **fully unlock a Room**. These are separate event types — casting one door of a Room satisfies condition (1) but NOT condition (2); only when the second door becomes unlocked does condition (2) fire. When multiple enchantments enter simultaneously (tokens, mass reanimation, Anointed Procession), an Eerie permanent triggers once for **each** enchantment that enters, stacking multiple triggers. The Eerie ability triggers for its own source entering the battlefield: if the Eerie creature enters alongside other enchantments, it triggers for each of those as well. The single most important trap: **casting a Room spell** triggers Eerie once (enchantment entering) but does NOT trigger the "fully unlock" portion — that requires the second door to later become unlocked through the special action.

## The Definitive Rules

**Official Ruling (2024-09-20):** *"If a permanent with an eerie ability enters at the same time as one or more enchantments, its ability will trigger for each of those enchantments."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"An ability that triggers 'whenever you fully unlock a Room' triggers when a door becomes unlocked and the other door of that Room is already unlocked, or when both doors of that Room become unlocked simultaneously."*

**Official Ruling (2024-09-20, Dazzling Theater):** *"An ability that triggers 'when you unlock this door' triggers when that door becomes unlocked. [When cast as that door,] the door becoming unlocked is what causes the ability to trigger, effects that cause abilities that trigger when a permanent enters to trigger an additional time (such as that of Panharmonicon) won't apply."*

**CR 603.2c:** *"A triggered ability may trigger once per occurrence of its triggering event. In cases in which an event has multiple occurrences, each occurrence will independently trigger the ability."*

**Full Eerie Text (representative):** *"Eerie — Whenever an enchantment you control enters **and** whenever you fully unlock a Room, [effect]."*

Note: this is actually TWO conditions connected by "and" that each independently trigger the ability. Each occurrence of either event type triggers the ability separately.

## The Pattern

```
EERIE — TWO INDEPENDENT TRIGGER CONDITIONS:

  Condition A: "Whenever an enchantment you control enters [the battlefield]"
    → Fires for each enchantment that enters under your control.
    → Fires when you cast and resolve an enchantment spell.
    → Fires when a Room enters (from casting one door OR from blink/reanimate).
    → Fires when enchantment tokens are created (Ghostly Dancers token, etc.).
    → Fires when an enchantment enters from another zone (return from exile, reanimate).
    → Does NOT fire when a creature aura becomes attached (aura attaches, not enters here —
        wait, auras DO enter when attached from hand; they ETB.)
    → If you control a Ghostly Dancers when a Room enters: ONE trigger (enchantment entered).

  Condition B: "Whenever you fully unlock a Room"
    → Fires when the second door of a Room becomes unlocked.
    → Does NOT fire when a Room enters with one door unlocked (from casting one door).
    → Does NOT fire when you cast a Room (that's just Condition A).
    → Fires when you pay the second door's mana cost as a special action (sorcery speed).
    → Fires when an ability unlocks a second door (e.g., Ghostly Dancers' ETB can unlock a door).
    → If both doors become unlocked simultaneously: still fires ONCE (not twice).

SIMULTANEOUS ETB COUNTING:

  If multiple enchantments enter simultaneously, Eerie triggers once PER enchantment.
  Example: Anointed Procession doubles a token creation that would create 1 enchantment token.
    → 2 enchantment tokens enter simultaneously.
    → Your Eerie creature triggers twice (once per enchantment).

  Example: Mass enchantment reanimation (All Enchantments Returned):
    → 4 enchantments enter simultaneously.
    → Eerie triggers 4 times.
    → All 4 triggers go on the stack in APNAP order (CR 603.3b).

  THE "NEWCOMER SEES OTHER NEWCOMERS" RULE (P028):
    If the Eerie permanent enters simultaneously with enchantments (e.g., mass reanimation):
    → The Eerie permanent's ability triggers for each of the OTHER enchantments.
    → Per ruling: "If a permanent with an eerie ability enters at the same time as one or
      more enchantments, its ability will trigger for each of those enchantments."
    → Does the Eerie permanent trigger for its OWN entry? The ruling says "for each of THOSE
      enchantments" — meaning the other enchantments. It doesn't trigger for itself.
    → But: the Eerie ability says "whenever an enchantment you control ENTERS." The Eerie
      permanent IS an enchantment creature. When it enters simultaneously with other
      enchantments, do the OTHER Eerie triggers (from other Eerie creatures) fire for it?
      Yes — each Eerie source fires for each enchantment entering, including the Eerie creature
      if it enters as an enchantment (e.g., Eerie creature type: Enchantment Creature counts).

CASTING A ROOM vs. FULLY UNLOCKING A ROOM:

  Action: Cast Dazzling Theater // Prop Room (choosing Dazzling Theater door):
    → Room enters with Dazzling Theater unlocked, Prop Room locked.
    → Eerie triggers: "an enchantment you control entered" (one trigger per Eerie source).
    → "Fully unlock" does NOT trigger (only one door is unlocked).

  Action: Pay Prop Room's cost (special sorcery-speed action):
    → Prop Room becomes unlocked. Now both doors unlocked.
    → Eerie triggers: "you fully unlocked a Room" (one trigger per Eerie source).
    → "Enchantment entered" does NOT trigger (the Room was already on the battlefield).

  Net result: casting one door of a Room and then unlocking the second door = TWO separate
    Eerie triggers over time (one at entry, one at full unlock).

  PANHARMONICON INTERACTION:
    Panharmonicon doubles triggers that fire "when [permanent] enters."
    Eerie's first condition IS an enters-the-battlefield trigger.
    → Does Panharmonicon double Eerie's enchantment-ETB trigger?
    ANSWER: Panharmonicon doubles triggers for "creature or artifact" ETBs specifically.
      Panharmonicon ({4}): "Whenever a creature or artifact enters under your control, if
      an ability of yours triggers because of that, it triggers an additional time."
    → Enchantment-only ETBs (from non-creature, non-artifact enchantments) are NOT doubled.
    → HOWEVER: if a Creature Enchantment enters (like an Enchantment Creature), Panharmonicon
      WOULD double the Eerie trigger because a CREATURE entered.
    → Most Eerie triggers on creatures = the Eerie creature is an Enchantment Creature.
      When ANOTHER Enchantment Creature enters, Panharmonicon doubles Eerie.
      When a non-creature enchantment enters (plain Aura, Room, Saga), Panharmonicon doesn't double.

GHOSTLY DANCERS ETB UNLOCK INTERACTION:

  Ghostly Dancers ({3}{W}{W}: 2/5 Flying):
    ETB: "return an enchantment card from your graveyard to your hand or unlock a locked
      door of a Room you control."
    Eerie: "create a 3/1 white Spirit creature token with flying."

  Sequence:
    1. Ghostly Dancers enters → Eerie triggers (enchantment ETB, if you have another Eerie source).
    2. Ghostly Dancers' own ETB triggers: choose to unlock a locked door of a Room.
    3. If that unlock completes the Room (second door): Eerie's "fully unlock" condition triggers.
    → With multiple Eerie sources: each one fires for the ETB, THEN each fires again for fully unlock.
    → One Ghostly Dancers ETB can produce up to 2 Eerie-per-source triggers (ETB + fully unlock).

MULTI-EERIE SOURCES COUNTING:

  With N Eerie creatures and M enchantments entering simultaneously:
    → N × M triggers fire total.
  With N Eerie creatures and a Room being fully unlocked:
    → N triggers fire.

  Example: 3 Eerie creatures on battlefield. You cast a Saga (enchantment ETB):
    → 3 Eerie triggers (one from each source).
  Then later, you fully unlock a Room:
    → 3 more Eerie triggers (one from each source).
```

## Definitive Conclusions

- **Eerie has two independent trigger conditions** — enchantment ETB and fully unlock a Room; each fires separately and independently.
- **Casting one door of a Room fires the ETB condition only** — the "fully unlock" condition fires only when the second door is unlocked later.
- **Simultaneous enchantment ETBs each trigger Eerie separately** — 4 enchantments entering at once = 4 Eerie triggers per Eerie source.
- **If the Eerie permanent enters simultaneously with other enchantments** — its ability triggers for each of the other enchantments that entered with it.
- **Panharmonicon doubles Eerie for Enchantment Creature ETBs** — but not for plain enchantment (non-creature) ETBs; Panharmonicon only cares about creatures and artifacts.
- **Ghostly Dancers can chain-trigger Eerie twice in one turn** — its ETB triggers Eerie (enchantment entered), then its ability can unlock a door triggering Eerie again (fully unlock).

## Canonical Example

**Entity Tracker + 3 Enchantment Tokens:**

You control Entity Tracker ({2}{U}: 2/3; "Eerie — whenever an enchantment you control enters and whenever you fully unlock a Room, draw a card").

You cast Ghostly Dancers ({3}{W}{W}): it enters. Eerie triggers: draw a card. Ghostly Dancers' ETB fires: unlock a locked door of a Room you control (second door). Eerie triggers: "fully unlock" — draw another card.

You drew 2 cards from one Ghostly Dancers ETB (one for enchantment entry, one for fully unlocking the Room).

**Example 2 — Simultaneous Enchantment Token Flood:**

You control Entity Tracker and Gremlin Tamer ({W}{U}: 2/2; "Eerie — create a 1/1 red Gremlin token"). A spell creates 4 Aura tokens simultaneously.

4 enchantments enter simultaneously. Entity Tracker's Eerie triggers 4 times. Gremlin Tamer's Eerie triggers 4 times. Total: 8 Eerie triggers. You draw 4 cards and create 4 Gremlin tokens.

**Example 3 — Room Cast vs. Fully Unlock:**

You control Cult Healer ({2}{W}: 3/3; "Eerie — gain lifelink until end of turn"). You cast Bottomless Pool // Locker Room (choosing Bottomless Pool door). The Room enters.

Eerie fires (enchantment entered): Cult Healer gains lifelink until end of turn.

Later, you pay {4}{U} to unlock Locker Room (second door, sorcery speed).

Eerie fires again (fully unlock a Room): Cult Healer gains lifelink until end of turn again.

**Example 4 — Panharmonicon + Eerie Creature ETB:**

You control Panharmonicon ({4}: artifact) and Dashing Bloodsucker ({3}{B}: 2/5; Enchantment Creature; "Eerie — gets +2/+0 and lifelink until end of turn").

You cast another Enchantment Creature (say, a creature with bestow that enters as a creature). Eerie triggers. Panharmonicon: "whenever a creature or artifact enters, if an ability triggers because of that, it triggers an additional time." The Eerie trigger from Dashing Bloodsucker fires TWICE (once doubled by Panharmonicon). Dashing Bloodsucker gets +2/+0 twice and gains lifelink twice (net: +4/+0 but only one instance of lifelink needed).

If a non-creature enchantment entered instead (like a Saga): Panharmonicon would NOT double the Eerie trigger — Panharmonicon only applies to creature or artifact ETBs.

## Commonly Confused With
- **P509 (Rooms — Zone Characteristics)** — P509 covers Room mechanics in depth (zone MV, blink-reset, etc.). P515 covers how Eerie interacts with Rooms specifically (two Eerie triggers from casting then unlocking vs. one trigger if both happen simultaneously).
- **P028 (Simultaneous ETB — Newcomers See Each Other)** — P028 is the foundational pattern for simultaneous ETB counting. P515 applies that counting to Eerie's enchantment-ETB condition.
- **P023 (Trigger Suppression vs. Replacement)** — Panharmonicon's interaction with Eerie's enchantment-ETB is similar to P023's discussion of which events Panharmonicon watches for. Panharmonicon: creature or artifact ETBs only.
- **P496 (Duskmourn — Eerie, Impending, Manifest Dread)** — P496 provides the initial overview of Eerie. P515 is the deep-dive into stacking, simultaneous ETBs, and dual-condition nuances.
