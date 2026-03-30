---
id: p496
name: Duskmourn — Eerie, Impending Deep Interactions, and Manifest Dread
category: triggered
cr_refs: [702.186, 702.168, 701.33, 702.31]
tags: [eerie, impending, manifest-dread, enchantment-creature, time-counters, end-step, face-down, zone-change, countdown, proliferate, copy, leyline-of-the-void, paranormal-analyst, duskmourn, DSK]
created: 2026-03-29
examples_count: 3
---

# P496 — Duskmourn — Eerie, Impending Deep Interactions, and Manifest Dread

## Abstract
**Duskmourn: House of Horror** (2024) introduced three major mechanics. **Eerie** is an ability word triggering whenever an enchantment you control enters or whenever you fully unlock a Room — it fires for every simultaneous enchantment ETB, and some Eerie abilities (like Fear of Infinity's) function in zones other than the battlefield. **Impending** is a keyword creating an alternative-cost enchantment-then-creature: the permanent enters as an Enchantment Creature but its creature type is suppressed while time counters remain; counters are removed at the beginning of your **end step** (not upkeep); ETB triggers fire immediately regardless of impending status; copying an impending permanent always produces an immediate creature (no counters). **Manifest Dread** looks at two library cards, chooses one to put face-down as a 2/2, sends the other to the graveyard; replacement effects like Leyline of the Void redirect that GY card to exile instead; Valgavoth's Onslaught places counters without giving opponents a priority window to kill the 2/2s first.

## The Definitive Rules

**CR 702.186** (paraphrased from official rulings 2024-09-20): *"Impending N — [cost] means 'You may cast this card by paying [cost] rather than paying its mana cost. If you do, it enters with N time counters on it and it's not a creature until the last time counter is removed from it. At the beginning of your end step, remove a time counter from it.'"*

**Eerie (ability word):** Eerie is an ability word — it has no specific CR rule but labels triggered abilities that fire "whenever an enchantment you control enters the battlefield and whenever you fully unlock a Room."

**Manifest Dread (CR 701.33 adapted for DSK):** Look at the top two cards of your library. Put one face down as a 2/2 colorless creature token (may turn face up by paying its mana cost if it's a creature card). Put the other into your graveyard.

## The Pattern

```
EERIE — ENCHANTMENT ETB AND ROOM UNLOCK TRIGGER:

  Eerie fires on TWO distinct events:
    (1) Whenever an enchantment you control enters the battlefield.
    (2) Whenever you fully unlock a Room (second door unlocked while first already is).

  SIMULTANEOUS ENCHANTMENTS:
    If 3 enchantments enter simultaneously, Eerie fires 3 times.
    Victor, Valgavoth's Seneschal: "...if this is the first time this ability has resolved
      this turn... second time... third time..." — each of the 3 triggers is one tier.

  ROOMS AND EERIE:
    Casting a Room: the enchantment ETBs (Eerie trigger 1: enchantment enters).
      Then the "unlock this door" trigger fires (that's a Room-specific ability, not Eerie).
      Separately, paying to unlock the second door (a special action): Eerie trigger 2.
    A Room blinking (exile + return): re-enters with BOTH DOORS LOCKED.
      → Only one Eerie trigger fires (the enchantment ETB), NOT the "fully unlock" trigger.
      → Rooms blinking back don't grant the unlock Eerie trigger — just the ETB Eerie.

  IMPENDING PERMANENTS TRIGGER EERIE:
    All five DSK Impending Overlords are Enchantment Creature — Avatar Horror.
    When cast for the impending cost, they enter as enchantments (creature type suppressed
      but still printed on the card).
    These ARE enchantments entering — they trigger Eerie.
    Example: Entity Tracker ({2}{U}: "Eerie — ...draw a card") draws a card when
      any Impending Overlord resolves, even though the Overlord isn't a creature yet.

  FEAR OF INFINITY — GY-ACTIVE EERIE:
    Fear of Infinity ({1}{U}{B}: 2/2; Flying, lifelink; can't block):
      "Eerie — Whenever an enchantment you control enters and whenever you fully
      unlock a Room, you may return this card from your graveyard to your hand."
    This is the rare case of Eerie functioning from the graveyard.
    The card text explicitly says "from your graveyard to your hand" — the ability was
      designed to trigger from the GY (the source zone is implicit in the card text).
    Most Eerie abilities require the source to be on the battlefield.

  VICTOR, VALGAVOTH'S SENESCHAL — SCALING EERIE:
    Victor ({1}{W}{B}: 3/3): "Eerie — ...surveil 2 if first time this turn;
      if second time, each opponent discards; if third time, reanimate from any GY."
    The counting is per-turn, not per-trigger.
    Official ruling: "Victor's ability has no effect beyond the third time it resolves
      in a turn." — The scale tops out at 3.
    Need 3 Eerie triggers in one turn for the reanimate tier:
      → Cast 3 enchantments, OR
      → Enter 1 enchantment + cast 1 more enchantment + unlock a Room, OR
      → Various combinations.

IMPENDING — ENCHANTMENT CREATURE COUNTDOWN:

  WHAT IS SUPPRESSED:
    When cast for the impending cost, the permanent is an Enchantment Creature —
      Avatar Horror but "isn't a creature until the last is removed."
    The CREATURE TYPE is suppressed.
    The Enchantment type is NEVER suppressed.
    The printed creature abilities (power/toughness, combat keywords) are suppressed.
    Enchantment-based continuous effects (if any) are NOT suppressed.

  COUNTER REMOVAL TIMING: END STEP (not upkeep):
    "At the beginning of your END STEP, remove a time counter from it."
    This means:
      → You get your main phase AFTER playing the Impending card.
      → No counter removed until your end step.
      → The first counter removal happens at end of the SAME TURN it was cast.
      → On an N-counter Impending, it becomes a creature at the beginning of your
        end step N turns later (or later, if Proliferate added counters).

  ETB TRIGGERS FIRE IMMEDIATELY:
    All five Overlords have "Whenever this permanent enters or attacks, [effect]."
    Using "permanent" (not "creature") because the Overlord triggers even while
      it's not yet a creature.
    When cast for impending cost: the Overlord enters → ETB trigger fires.
    When it becomes a creature (last counter removed): the "attacks" trigger becomes
      relevant for the first time.
    → You get the ETB effect the turn you play it, even under impending.

  COPY EFFECTS:
    Creating a token copy of an impending permanent (already on the battlefield) produces
      a creature without time counters — it enters as a full Enchantment Creature immediately.
    Official ruling: "If an object enters as a copy of a permanent that was cast with its
      impending cost, it won't enter with time counters, and it will be a creature."

  COUNTER MANIPULATION:
    Proliferate: adds one time counter per proliferate event → delays creature arrival.
    Vampire Hexmage / Clockspinning: removes counters → accelerates creature arrival.
    When the LAST counter is removed (any method, not just end step trigger):
      → The creature type is no longer suppressed.
      → If via Vampire Hexmage: the creature emerges mid-turn (can even attack same turn?
        No — it just became a creature, has summoning sickness).
      → Actually: removing the last counter is an SBA check — no, it's a static ability:
        the permanent "isn't a creature until the last is removed." Once removed, it IS
        a creature. SBAs check next time priority would be received.

  THE FIVE DSK IMPENDING OVERLORDS (Enchantment Creature — Avatar Horror):
    Overlord of the Boilerbilges ({4}{R}{R}; Impending 4—{2}{R}{R}; 5/5):
      "Whenever this permanent enters or attacks, it deals 4 damage to any target."
    Overlord of the Balemurk ({3}{B}{B}; Impending 5—{1}{B}; 5/5):
      "Whenever this permanent enters or attacks, mill 4, then return creature/PW from GY."
    Overlord of the Hauntwoods ({3}{G}{G}; Impending 4—{1}{G}{G}; 6/5):
      "Whenever this permanent enters or attacks, create a tapped colorless Everywhere land."
    Overlord of the Floodpits ({3}{U}{U}; Impending 4—{1}{U}{U}; 5/3 Flying):
      "Whenever this permanent enters or attacks, draw two cards, then discard a card."
    Overlord of the Mistmoors ({5}{W}{W}; Impending 4—{2}{W}{W}; 6/6):
      "Whenever this permanent enters or attacks, create two 2/1 white Insect creature tokens with flying."

  IMPENDING + EERIE:
    Each Overlord cast for the impending cost triggers any Eerie abilities their
      controller has at the moment they resolve.
    Example: Victor + Overlord of the Boilerbilges = one Eerie trigger (surveils 2).

MANIFEST DREAD — FACE-DOWN FROM TOP TWO:

  PROCESS:
    1. Look at top two cards of your library.
    2. Choose one: put it face down on the battlefield as a 2/2 colorless creature token
       with no abilities. (This IS a manifest — can be turned face up if creature card.)
    3. Put the other card into your graveyard.
    4. A "whenever you manifest dread" trigger may fire (Paranormal Analyst).

  TURNING FACE-UP:
    You may turn the manifested card face up at any time by paying its mana cost
      (as a special action — no stack, can't be responded to), IF it's a creature card.
    To determine if it's a creature card: check the PRINTED card, not modified values.
      → If March of the Machines is active (all artifacts are creatures), a manifested
        noncreature artifact STILL cannot be turned face-up via manifest rules.
        The card itself must be a creature card.
    If it's an instant or sorcery card: can never be turned face up legally.

  LEYLINE OF THE VOID INTERACTION:
    Leyline of the Void: "If a card would be put into an opponent's graveyard from
      anywhere, exile it instead."
    During Manifest Dread (your OWN manifest), you put a card into YOUR OWN graveyard.
    If opponent has Leyline of the Void targeting your GY: that GY card goes to exile.
    Paranormal Analyst's ability: "When you manifest dread, put a card you put into
      your graveyard this way into your hand." — If the card was exiled instead (no card
      went to GY), the ability triggers but you can't put any card into your hand.
      Official ruling confirms: "the ability will still trigger, but you won't be able
      to put any cards into your hand when it resolves."

  ABHORRENT OCULUS — MULTI-OPPONENT TRIGGER:
    Abhorrent Oculus ({2}{U}: Eye creature; as additional cost, exile 6 from GY):
      "At the beginning of each opponent's upkeep, manifest dread."
    In Commander with 3 opponents: triggers 3 times per turn cycle (once per opponent).
    The {2}{U} cast cost requires exiling 6 from YOUR graveyard even if cast via free-cast
      effects (e.g., cascade, reanimation targets don't pay cast costs, but anything
      that truly "casts" it — Sneak Attack, etc. — still pays the exile cost).

  VALGAVOTH'S ONSLAUGHT — NO PRIORITY WINDOW:
    Valgavoth's Onslaught ({X}{X}{G}: Sorcery): "Manifest dread X times, then put
      X +1/+1 counters on each of those creatures."
    Official ruling: "Players can't take actions in between the time you manifest dread X
      times and the time you put +1/+1 counters on them. Notably, they can't try to remove
      the face-down creatures before counters are placed on them."
    This is an atomic operation: all X manifests happen, then all X × X counters go on.
    No window to kill the 2/2s before they become 2+X/2+X creatures.
    Also atomic: "If an effect instructs a player to manifest multiple cards from their
      library, those cards are manifested one at a time. Players can't take actions in between."

  INSTANTS/SORCERIES MANIFESTED FACE-DOWN:
    If the manifested card is an instant or sorcery:
      → The 2/2 face-down creature can NEVER be turned face up via manifest rules.
      → If an opponent tries to force-reveal it (some effects do this): it stays face down.
      → If it dies: a sorcery card went to the graveyard as normal.
    Double-faced cards (DFCs): can be manifested. If front face is a creature card:
      you can turn it face up (pay the front face's mana cost). Once face-up, it can then
      transform to the back face if it has that ability.
```

## Definitive Conclusions

- **Eerie fires once per enchantment ETB** — three enchantments entering simultaneously means three Eerie triggers; Victor's scaling tiers (1st/2nd/3rd) count these individually; Rooms grant one Eerie trigger for entering and another for fully unlocking.
- **Impending counter removal happens at your end step, not upkeep** — the Overlord enters, ETB fires, then your main phase happens, then your end step removes the first counter.
- **Impending ETB triggers fire even while not a creature** — all five Overlords use "whenever this permanent enters," not "whenever this creature enters," so the ETB fires the turn they're played for the impending cost.
- **Copying an impending permanent always creates a full creature** — no countdown; the copy enters with no time counters and its creature type active.
- **Manifest Dread's GY card gets exiled if Leyline of the Void is active** — Paranormal Analyst's trigger still fires but can't put a card in hand since no card went to the GY.
- **Valgavoth's Onslaught counters are placed atomically** — opponents cannot kill the manifested 2/2s before the +1/+1 counters are applied; no priority window between manifests and counter placement.

## Canonical Example

**Victor, Valgavoth's Seneschal + Impending Overlords:**

Turn setup: Victor ({1}{W}{B}: 3/3 Eerie) is on the battlefield. You cast Overlord of the Balemurk for impending {1}{B}. It enters with 5 time counters.

→ Eerie trigger fires (enchantment entered): first time this ability resolves this turn → Victor surveils 2.
→ Overlord's ETB fires: mill 4, then return a non-Avatar creature or planeswalker card from your graveyard to your hand.

You now have a 5/5 Enchantment — Avatar Horror on the battlefield with 5 time counters. No creature type yet.

End of your turn: remove one counter → 4 remain. Four more end steps until it becomes a creature.

**Example 2 — Manifest Dread + Leyline of the Void:**

You control Abhorrent Oculus. At the beginning of an opponent's upkeep, trigger fires: you manifest dread.

You look at the top two cards: a 4/4 Dragon and a Lightning Bolt. You put the Dragon face down as a 2/2. You would put the Lightning Bolt into your graveyard — BUT the opponent controls Leyline of the Void targeting your graveyard.

→ Lightning Bolt is exiled instead of going to your graveyard.
→ You have a face-down 2/2 on the battlefield. The Dragon card can be turned face up by paying its mana cost (it's a creature card — you reveal it to check).
→ Paranormal Analyst (if you had one): the trigger fires ("when you manifest dread"), but "put a card you put into your graveyard into your hand" — no card went to your GY (Leyline exiled it). Nothing goes to hand.

**Example 3 — Valgavoth's Onslaught X=3:**

You cast Valgavoth's Onslaught with X=3. You manifest dread three times (one at a time, no priority between them). Three face-down 2/2s enter.

Immediately (no priority window): put 3 +1/+1 counters on each of those three creatures.
All three are now 5/5 face-down creatures.

Opponent had a Shock in hand but couldn't cast it — no priority window existed between the manifests and the counter application. The 5/5s are now safe from Shock's 2 damage (they have 5 toughness).

## Commonly Confused With
- **P483 (Impending/Gift/Living Weapon)** — P483 covers the basics of Impending. This file (P496) covers the deep edge cases: ETB timing, copy effects, counter removal at end step (not upkeep), and the interplay with Eerie.
- **P470 (Cloak/Manifest Dread basic)** — P470 covers basic manifest face-down rules. P496 covers DSK-specific Manifest Dread interactions with replacement effects (Leyline), triggered payoffs (Paranormal Analyst), and the Valgavoth's Onslaught atomic resolution.
- **P381 (Face-Down Permanents)** — The general rules about face-down permanents (copiable values, revealing by controller, etc.) apply to manifested permanents. Manifest Dread follows those rules with the added "choose which of two cards to put down" layer.
- **P417 (Suspend/Vanishing)** — Impending is structurally similar to Vanishing (time counters removed each turn, creature disappears at 0) but reversed: starts as an enchantment and becomes a creature at 0 counters rather than disappearing.
