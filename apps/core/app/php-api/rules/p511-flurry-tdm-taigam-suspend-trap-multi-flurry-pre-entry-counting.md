---
id: p511
name: Flurry (TDM) — Taigam Suspend Trap, Pre-Entry Counting, and Multi-Flurry Stacking
category: triggered
cr_refs: [603.2, 603.3, 702.61, 601.2]
tags: [flurry, taigam, suspend, copy, exile, pre-entry-counting, multi-trigger, second-spell, ability-word, tarkir-dragonstorm, TDM, jeskai]
created: 2026-03-30
examples_count: 3
---

# P511 — Flurry (TDM) — Taigam Suspend Trap, Pre-Entry Counting, and Multi-Flurry Stacking

## Abstract
**Flurry** (Tarkir: Dragonstorm, 2025) is a Jeskai ability word: "Whenever you cast your second spell each turn, [effect]." The key non-obvious rule is that **spells cast before a Flurry permanent entered the battlefield count** — the second spell of the turn is the second spell of the turn regardless of when the Flurry source arrived. If multiple Flurry permanents are on the battlefield, they all trigger simultaneously from the same second-spell cast. **Taigam, Master Opportunist** ({1}{U}: 2/2) has the most dangerous Flurry ability: it exiles the original second spell, suspends it with four time counters, and creates a copy on the stack — the copy is **not a cast**, so it won't trigger prowess, storm, or Flurry again. The original is removed from the stack before it can resolve. This is not a "counter" — Taigam's trigger resolves before the original spell does, unconditionally exiling it.

## The Definitive Rules

**Official Ruling (Taigam, 2025-04-04):** *"Taigam's ability and the copy it creates resolve before the spell it's copying. They resolve even if the original spell is countered before the copy is created. Note that Taigam's ability exiles the original spell as the ability resolves, which will remove that spell from the stack before it can resolve."*

**Official Ruling (Taigam, 2025-04-04):** *"The copy is created on the stack, so it's not 'cast.' Abilities that trigger when a player casts a spell won't trigger."*

**Official Ruling (Taigam, 2025-04-04):** *"A resolving copy of a permanent spell becomes a token. That token isn't 'created' and won't interact with abilities that care about tokens being created."*

**Official Ruling (Flurry, 2025-04-04):** *"Spells that were cast before a permanent with flurry count. If that permanent was the first spell you cast that turn, the next spell you cast that turn is your second spell."*

**Official Ruling (Taigam, 2025-04-04 — Suspend's triggered component):** *"If a card is exiled and then 'gains suspend,' only the two triggered abilities are relevant [time counter removal each upkeep, then cast when last removed]."*

## The Pattern

```
FLURRY — COUNTING MECHANICS:

  Trigger condition: "Whenever you cast your second spell each turn."
  The turn's spell count includes ALL spells cast by you this turn,
    regardless of when the Flurry permanent entered.

  EXAMPLE COUNTING:
    Turn start: No Flurry sources.
    Spell 1: Cast Brainstorm → count = 1.
    Now you cast Taigam, Master Opportunist (Flurry source) → count = 2.
    → Taigam's CAST was your second spell this turn.
    → Taigam's Flurry triggers (it was the second spell; it counts itself).
    → Wait: Can Taigam trigger from its own cast?

  CAN TAIGAM TRIGGER FROM ITS OWN CAST?
    Taigam needs to be ON THE BATTLEFIELD to trigger its ability.
    When Taigam is on the stack (being cast), it's not yet on the battlefield.
    Triggered abilities require the source to be on the battlefield at the time
      the trigger condition is met (for ETB-type triggers) OR for normal triggered
      abilities, the source must be on the battlefield when the event occurs.
    Taigam is a creature — its Flurry trigger requires it to be on the battlefield.
    When you cast Taigam (spell 2), Taigam is on the stack, not the battlefield.
    → Taigam CANNOT trigger its own Flurry ability from its own casting.

  CAN OTHER FLURRY PERMANENTS TRIGGER FROM TAIGAM'S CAST?
    Yes. If Devoted Duelist is already on the battlefield, and you cast Taigam as
      your second spell, Devoted Duelist's Flurry trigger fires (deals 1 to each opponent).

  PRE-ENTRY COUNTING — THE KEY RULE:
    If Devoted Duelist ({1}{R}: 2/1 Haste; "Flurry — your second spell, deal 1 to each")
      enters as your first spell this turn, and then you cast a second spell:
    → The second spell DOES trigger Devoted Duelist's Flurry.
    Official ruling: "Spells that were cast before [the Flurry permanent] count."
    → The second spell of the turn is YOUR SECOND SPELL regardless.
    → A Flurry permanent that WAS the first spell itself: its Flurry triggers on the
      next spell you cast (which will be your second spell).

TAIGAM — THE SUSPEND TRAP:

  Taigam, Master Opportunist ({1}{U}: 2/2 Legendary Human Monk):
    "Flurry — Whenever you cast your second spell each turn, copy it, then exile the
     spell you cast with four time counters on it. If it doesn't have suspend, it gains
     suspend."

  TRIGGER ORDERING:
    You cast spell 2.
    Taigam's Flurry trigger fires.
    The trigger goes on the stack ABOVE spell 2.
    Stack (top to bottom): [Taigam's trigger] [Spell 2]

    Taigam's trigger resolves FIRST:
      → Creates a copy of Spell 2 on the stack.
      → Exiles Spell 2 (from the stack) with 4 time counters.
      → Spell 2 "gains suspend" (if it didn't have it).
      Stack (top to bottom): [Copy of Spell 2] [nothing — Spell 2 was exiled]

    Copy of Spell 2 resolves:
      → The original Spell 2 never resolves from this cast.
      → It's now in exile, suspended, waiting 4 upkeeps.

  CRITICAL: THIS IS NOT A COUNTER:
    Spell 2 was not countered — it was exiled.
    The copy resolved normally.
    The original will return in 4 turns (one time counter removed per upkeep).
    When the last counter is removed: owner may cast it without paying its mana cost.

  WHAT DOES THE COPY DO?
    Copy has the same targets and mode choices as the original.
    If the spell divides damage or distributes counters, the same choices apply.
    X was determined at cast; copy has same X.
    The copy cannot have new targets chosen unless an ability specifically says so.
    The copy is NOT "cast" — prowess, storm, magecraft do NOT trigger from the copy.
    If the copy is a permanent spell: it becomes a token when it resolves (not "created").

  PERMANENT SPELLS AND TAIGAM:
    If Spell 2 is a creature spell → copy becomes a creature token.
    → The token "isn't created" per the ruling, so Doubling Season doesn't double it.
    → The original creature is exiled and suspended — returns as a real permanent.
    If Spell 2 is an instant/sorcery → copy resolves normally as a one-time effect.
    → Original is suspended and returns later.

  TAIGAM + OWN FLURRY CAST:
    If Taigam enters (as your first spell) and you then cast a second spell:
    Taigam's trigger fires. The second spell gets copied and exiled to suspend.
    BUT: If Taigam IS your second spell — it enters and immediately triggers...
    Wait: Taigam triggers when CAST (the trigger fires when you cast the spell).
    Taigam is on the stack as spell 2. Its Flurry triggers.
    But Taigam isn't on the battlefield yet — its ability needs it on the battlefield.
    Result: Taigam's Flurry DOES NOT trigger from its own casting.
    Taigam enters → now it IS on the battlefield → future second spells trigger it.

MULTIPLE FLURRY PERMANENTS:

  With N Flurry permanents on the battlefield, all N trigger from your second spell.
  Example: Devoted Duelist, Poised Practitioner, and Cori-Steel Cutter (equipped):
    → You cast your second spell.
    → Three Flurry triggers fire simultaneously.
    → Devoted Duelist: deal 1 to each opponent.
    → Poised Practitioner: +1/+1 counter + scry 1.
    → Cori-Steel Cutter: create 1/1 white Monk with prowess, may attach.
    → All three resolve (you choose order since they're yours).

  THIRD SPELL DOESN'T RE-TRIGGER:
    Each Flurry permanent's trigger fires once per turn when you cast your second spell.
    They do NOT fire again when you cast a third spell.
    Exception: if a new Flurry permanent enters after your second spell has been cast
      (meaning it missed the "second spell" window), it will need to wait until the
      next turn when you cast your second spell again.

  FLURRY AND EXTRA TURNS:
    "Second spell each turn" resets on each new turn (including extra turns).
    In each extra turn, the second spell of THAT turn triggers Flurry again.
    (Taigam synergy: use extra turns to deploy the suspended spells.)

TAIGAM + TAIGAM'S OWN FLURRY COPY:

  If you have two Taigams (via copying), both trigger when you cast your second spell.
  Both try to exile + suspend the original and create copies.
  The second Taigam's trigger also resolves and tries to exile Spell 2 — but it was
    already exiled by the first Taigam's trigger.
  The second trigger: "exile the spell you cast" — if it's no longer on the stack,
    the exile fails (it's already gone). The copy is still created.
  Result: two copies of Spell 2, original exiled once (not twice).
  Both copies resolve independently.

CORI-STEEL CUTTER — MONK TOKEN + EQUIP:

  "Flurry — ... create a 1/1 white Monk token with prowess. You may attach this
    Equipment to it."
  The token enters as a 1/1. THEN the equipment may attach (optional).
  ETB abilities that care about equipped/unequipped state see an unequipped creature
    entering; the equip happens after the token is on the battlefield.
  If Doubling Season is active: creates 2 tokens. May attach the Equipment to ONE of
    the two tokens (controller's choice).
  The Monk token has prowess — if you cast a noncreature spell later that turn, it gets
    +1/+1. This works ONLY while the Flurry trigger has already resolved.
```

## Definitive Conclusions

- **Flurry counts spells from before the Flurry permanent entered** — if a creature was your first spell, its Flurry triggers on the very next spell you cast.
- **Taigam exiles the original spell — it is not countered** — the original is suspended with 4 time counters; the copy resolves instead; the original returns in 4 upkeeps as a free cast.
- **Taigam CANNOT trigger its own Flurry from its own casting** — the source must be on the battlefield when the trigger fires; Taigam on the stack hasn't entered yet.
- **Copies from Taigam are not "cast"** — prowess, storm, magecraft, and other cast-triggers do not fire from Taigam's copy.
- **All Flurry permanents trigger simultaneously** from the same second spell — with N Flurry sources, all N triggers go on the stack for the same event.
- **Permanent spell copies resolve as tokens, not created tokens** — Doubling Season does not double them.

## Canonical Example

**Taigam + Generous Gift:**

Turn: You control Taigam, Master Opportunist.

Cast Brainstorm ({U}) — first spell. Cast Generous Gift ({2}{W}) — second spell.

Stack: [Taigam's Flurry trigger] [Generous Gift] (Taigam's trigger on top).

Taigam's trigger resolves:
- Creates a copy of Generous Gift (same target: Opponent's 8/8 creature).
- Exiles Generous Gift from the stack with 4 time counters. It gains suspend.

Stack: [Copy of Generous Gift] — the original is gone.

Copy resolves: Opponent's 8/8 becomes a 3/3 vanilla Elephant.

Original Generous Gift: suspended in exile. Over the next 4 upkeeps, it counts down. When the last counter is removed, you may cast it for free. Timing restrictions are ignored for suspend casts (it's an instant anyway here).

**Example 2 — Taigam Second Spell Is Itself:**

You cast Taigam ({1}{U}) as your SECOND spell this turn (first spell was a mana dork).

Taigam is on the stack as Spell 2. Taigam has a Flurry ability, but it's on the stack — not on the battlefield. Flurry does NOT trigger from Taigam's own casting.

Taigam resolves → enters the battlefield.

You later cast a third spell (Counterspell {U}{U}) — this is your third spell, not your second. Taigam's Flurry does not trigger.

Next turn: cast one spell (your first spell of the turn). Then cast a second spell — Taigam's Flurry triggers.

**Example 3 — Multi-Flurry with Cori-Steel Cutter:**

You control Devoted Duelist and Cori-Steel Cutter equipped to a creature. You cast your second spell (Lightning Bolt targeting an opponent).

Two Flurry triggers fire simultaneously:
- Devoted Duelist: deal 1 damage to each opponent.
- Cori-Steel Cutter: create a 1/1 white Monk with prowess, may attach Cutter to it.

You choose to resolve them in order. Devoted Duelist fires: 1 damage to each opponent. Cori-Steel Cutter fires: 1/1 Monk enters, you attach Cutter to the Monk (moving it from the previous creature).

The Monk now has trample, haste (from Cutter), and prowess. It can attack this turn.

## Commonly Confused With
- **P215 (Storm)** — Storm copies are created by a triggered ability (like Taigam) and also are "not cast." Neither storm copies nor Taigam copies trigger prowess or storm.
- **P255 (Suspend)** — Taigam's exile grants suspend to the original spell; suspend's third triggered ability (cast when last counter removed) fires normally. The original spell can be cast without paying its mana cost when the last counter is removed.
- **P022 (End-Turn Stack Exile)** — Taigam's suspend exile is permanent — the exiled spell is NOT removed at end of turn; it counts down upkeep by upkeep.
- **P487 (Plot edge cases)** — Plot is another "cast from exile later" mechanic. Unlike Plot (sorcery-speed special action), suspended cards from Taigam cast at your upkeep (whenever the last counter is removed) with timing rules ignored.
