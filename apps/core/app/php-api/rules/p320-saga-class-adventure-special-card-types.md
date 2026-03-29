---
id: p320
name: Saga, Class, and Adventure Cards — Special Enchantment Types
category: continuous
cr_refs: [714.2, 714.2b, 714.3, 714.3a, 714.3b, 714.4, 716.2, 716.3, 715.3, 715.3d]
tags: [Saga, Class, Adventure, lore-counter, chapter-ability, read-ahead, class-level, leveler, Elspeth-Conquers-Death, Urza-Saga, Ranger-Class, Brazen-Borrower, Beanstalk-Giant]
created: 2026-03-29
examples_count: 2
---

# P320 — Saga, Class, and Adventure Cards — Special Enchantment Types

## Abstract
Three special card types with distinct frame layouts and rules. **Sagas** are enchantments with chapter abilities that trigger each turn via lore counters — they're eventually sacrificed when their final chapter triggers (SBA CR 714.4). **Classes** are enchantments with level-up bars that unlock abilities and effects at each level. **Adventure** cards are creature cards with an embedded instant/sorcery spell — cast the Adventure first (goes to exile), then cast the creature from exile. All three are complex layered card types with their own timing and state rules.

## The Definitive Rules

**CR 714.2b** (verbatim): *"'{rN}—[Effect]' means 'When one or more lore counters are put onto this Saga, if the number of lore counters on it was less than N and became at least N, [effect].'"*

**CR 714.3b** (verbatim): *"As a player's precombat main phase begins, that player puts a lore counter on each Saga they control with one or more chapter abilities. This turn-based action doesn't use the stack."*

**CR 714.4** (verbatim): *"If the number of lore counters on a Saga permanent with one or more chapter abilities is greater than or equal to its final chapter number, and it isn't the source of a chapter ability that has triggered but not yet left the stack, that Saga's controller sacrifices it. This state-based action doesn't use the stack."*

**CR 716.2a** (verbatim): *"'[Cost]: Level N — [Abilities]' means '[Cost]: This Class's level becomes N. Activate only if this Class is level N-1 and only as a sorcery' and 'As long as this Class is level N or greater, it has [abilities].'"*

**CR 715.3d** (verbatim): *"Instead of putting a spell that was cast as an Adventure into its owner's graveyard as it resolves, its controller exiles it. For as long as that card remains exiled, that player may play it. It can't be cast as an Adventure this way, although other effects that allow a player to cast it may allow a player to cast it as an Adventure."*

## The Pattern

```
SAGAS:

HOW THEY WORK:
  Saga enters battlefield: 1 lore counter placed (CR 714.3a).
    (Or more, if it has "read ahead" — see below.)
  Chapter I ability fires (trigger: counter placed, I not yet reached, now reached).
  Each turn, at beginning of precombat main phase (before drawing if first turn):
    Turn-based action: put 1 lore counter on each Saga you control.
  Chapter abilities fire when their lore counter threshold is crossed.
  After FINAL CHAPTER fires (or before, if counters ≥ final chapter and no pending ability):
    SBA: sacrifice the Saga. It goes to GY.

SAGA TIMING DETAILS:
  Lore counter placed (turn-based action) → chapter ability triggers → goes on stack.
  Turn-based action happens before priority; players get priority after triggers placed.
  Chapter ability on stack: can be responded to normally (like any triggered ability).
  Counter reaches final chapter number: next SBA check after the ability resolves → Saga sacrificed.
  WAIT: CR 714.4 says sacrifice if counters ≥ final chapter AND the final chapter ability isn't still on stack.
  So: put 3rd counter on a III-chapter Saga → III ability triggers, goes on stack.
  While that ability is on the stack: the Saga is NOT yet sacrificed.
  After ability resolves: SBA check → sacrifice now.
  This means: if you remove a counter before III fires, the Saga can survive.

READ AHEAD (variant):
  Some Sagas have "Read Ahead": when entering, choose how many counters to place (1 to final chapter).
  Place that many counters immediately → all chapter abilities UP TO that number trigger simultaneously.
  You can skip directly to the final chapter, getting all effects at once and immediately sacrificing.
  Or: place just 1 counter, go through normally.
  Trade-off: some chapters are more valuable than others. Skip chapters you don't need.

URZA'S SAGA (special Saga + creature):
  Urza's Saga is a Saga Land (not an enchantment!). Special rules.
  Actually: Urza's Saga is an Enchantment Land — it has BOTH types.
  Chapter I: you may tap it for {C} (it gains a mana ability).
  Chapter II: it can tap for {C} again (cumulative with I).
  Chapter III: search for an artifact with MV ≤ 0 or with "({T}: add {C})."
  After III: sacrifice the Saga (SBA). It's a land, so you don't lose it "early" by drawing cards.
  This is among the most powerful cards in Modern. The mana + artifact tutor combo.
  Note: being both an Enchantment and a Land = triggers constellation but uses a land play.

COUNTER MANIPULATION ON SAGAS:
  Adding counters ahead of schedule: add a lore counter via Proliferate → chapter triggers.
  Example: Saga has 1 counter, you Proliferate → 2 counters → chapter II triggers.
  If the Saga's final chapter is II: now 2 counters ≥ final chapter (after II fires) → sacrifice.
  Removing counters: delay the Saga, prevent the final chapter.
  Vampire Hexmage: sacrifice to remove ALL counters from target permanent.
    Use on opponent's Saga: remove all counters. Saga's chapter abilities no longer trigger.
    Saga has 0 counters now. Is it sacrificed? CR 714.4: sacrifice if counters ≥ final chapter.
    0 counters ≥ final chapter number? Only if final chapter is 0.
    If final chapter is 2 or 3: no. Saga stays but makes no progress.
    Next turn: one counter added → chapter I trigger (threshold crossed from 0 to 1+).
    Effectively: reset the Saga to chapter I progress.

CLASS CARDS:

HOW THEY WORK:
  Class starts at Level 1 with abilities listed in the top text box.
  Each class level bar: "{Cost}: Level N — [Abilities]."
  Activating level 2: pay cost, Class becomes level 2. Gains level-2-and-higher abilities.
  Activating level 3: pay cost, Class becomes level 3. Gains level-3 abilities too.
  Classes DON'T sacrifice themselves automatically. They stay until removed.
  Classes don't use lore counters or chapter abilities.

  RANGER CLASS ({1}{G}{G}):
    Level 1 (free on entry): "Creatures you control can't be countered."
    Level 2 ({3}{G}{G}): "Whenever a land enters under your control, put a +1/+1 counter on each creature you control."
    Level 3 ({5}{G}{G}{G}): "Whenever a creature enters under your control, put a +1/+1 counter on it and it gets +1/+1 until end of turn."
  Abilities are cumulative: at level 3, you have all three effects.

  CLASS LEVEL ACTIVATION:
    CR 716.2a: "Activate only if this Class is level N-1 and only as a sorcery."
    Must level up sequentially (1→2→3; can't skip).
    Sorcery speed: during your main phase, stack empty.

ADVENTURE CARDS:

HOW THEY WORK:
  Adventure card = creature card + embedded spell.
  The creature card has two frames: main frame (creature) and adventure inset (spell).
  Cast as Adventure: use the spell's mana cost, put on stack as a spell.
  When Adventure resolves: instead of GY, it goes to EXILE. (CR 715.3d)
  From exile: you "may play it" (cast the creature side at any time you could play it normally).
  This isn't "free" — you still pay the creature's mana cost.
  Not flashback, not rebound: it's a specific exile-for-later mechanic.

  ADVENTURE TIMING:
    Cast the Adventure (instant/sorcery): can be done at instant speed if it's an instant.
    The card exiles (doesn't go to GY).
    Now you can cast the creature side: your main phase only (creature = sorcery speed).
    The card remains exiled until cast as creature or until something removes it.

  BRAZEN BORROWER ({1}{U}{U}, creature: 3/1 Flying, "can't block")):
    Adventure: Petty Theft ({1}{U}): "Return target nonland permanent an opponent controls to its owner's hand."
    Turn 2: cast Petty Theft for {1}{U}. Bounce opponent's 3/3. Card exiles.
    Turn 3: cast Brazen Borrower from exile for {1}{U}{U}. 3/1 Flying enters.
    Two-for-one: bounce + creature across two turns from one card.

  THE EXILE MATTERS:
    Kaito Shizuki, Galvanic Relay, etc.: some effects exile cards and let you play them.
    Those effects are different from Adventure's self-exile. Adventures can only be played
    from exile "as long as that card remains exiled by the Adventure's resolution."
    If something else exiles the creature portion: it's in exile, but not the Adventure exile.
    The permission to cast from exile was granted by the Adventure's resolution.
    If the card goes to a different zone and then back to exile: the permission may be lost.

SAGA VS. CONSTELLATION INTERACTION:
  Sagas are enchantments. When a Saga enters: Constellation triggers.
  When a Saga gets lore counters: chapter abilities trigger (not Constellation).
  When Saga is sacrificed: no Constellation (sacrifice ≠ entering).
  Some Sagas create enchantments as their chapter effects: those entering trigger Constellation.
  Example: The Birth of Meletis (Saga) Chapter I: create a white Plains token.
    That Plains token entering: not an enchantment entering — it's a land.
    No Constellation from the Plains.
  Example: Omen of the Sea (Saga with Cycling, creates a Saga token? No — Omen is instant-speed).
    Omen of the Sea isn't a Saga. It's an instant that scries and draws.
```

## Definitive Conclusions

- **Sagas gain 1 lore counter at the start of each main phase** — this is a turn-based action (not a triggered ability) that fires before priority is given.
- **After the final chapter ability resolves, the Saga is sacrificed** — SBA fires once the ability has left the stack and counters ≥ final chapter.
- **Class cards don't sacrifice themselves** — they're permanent enchantments you pay to level up, sequentially.
- **Adventures exile themselves on resolution** — the creature side can then be cast from exile (still costs its mana cost).
- **Read Ahead Sagas let you skip directly to a chapter** — useful when only the final chapter effect is relevant.

## Canonical Example
**Elspeth Conquers Death (Saga) — Chapter III Recursion:**
Turn 5: cast Elspeth Conquers Death ({3}{W}{W}): Saga Enchantment.
Turn-based action: enters with 1 lore counter.
Chapter I trigger: "Exile target nonland permanent an opponent controls with MV 3 or greater."
Opponent's 5/5 creature: exile it.
Turn 6 main phase start: add 1 lore counter. Now 2.
Chapter II trigger: "Until your next turn, spells and abilities your opponents control can't cause their controller to search their library."
Shut off opponent's Demonic Tutor, Fetch Land activations, etc.
Turn 7 main phase start: add 1 lore counter. Now 3.
Chapter III trigger: "Return target creature or planeswalker card from your GY to the battlefield with a +1/+1 counter on it."
The opponent's 5/5 is EXILED (not GY). But YOUR creatures in GY are valid targets.
Return your most powerful creature from GY to battlefield with +1/+1.
After Chapter III fires and resolves: SBA → sacrifice Elspeth Conquers Death.
It goes to GY. If you have Replenish or enchantment recursion: you could bring it back.
Total value: exile their threat, lock off searching, reanimate your creature. 3 chapters, 3 different effects.

**Example 2 — Ranger Class Leveling:**
Turn 3: cast Ranger Class ({1}{G}). Enters as Level 1.
Level 1 ability (static): "Creatures you control can't be countered."
From now on: your creature spells don't need to worry about Counterspell.
Turn 4: pay {3}{G}{G} (Level 2 activation, sorcery speed).
Ranger Class becomes Level 2. Gains: "Whenever a land enters under your control, put a +1/+1 counter on each creature you control."
Every land drop now pumps your team. Play a fetch land: first land entering → counters on all. Crack fetch: second land → counters again. Two land-triggered pumps from one fetch.
Turn 6: pay {5}{G}{G}{G} (Level 3 activation, sorcery speed).
Ranger Class becomes Level 3. Also has: "Whenever a creature enters under your control, put a +1/+1 counter on it AND it gets +1/+1 until EOT."
New creatures enter larger and bolstered.
Level 3 Ranger Class: all three effects active simultaneously. A substantial advantage in a creature-based green deck.

## Commonly Confused With
- **P319 (Enchantment/Aura/Constellation)** — Sagas and Classes are enchantments that trigger Constellation when they enter. Adventure spells are NOT enchantments — they're instant/sorcery spells with a creature card back.
- **P295 (Flashback/Rebound)** — Adventure's exile-and-recast mechanic is similar to Rebound (exile, cast later) but different: Adventure exiles from when the Adventure spell resolves, not when the creature would be cast; you still pay mana to cast the creature from exile.
- **P316 (Morph/Manifest)** — No direct interaction; Saga/Class/Adventure are very different frame types from face-down mechanics.
- **P311 (New Object Rule)** — If an Adventure card in exile is countered or otherwise moved out of the "adventure exile" state, the permission to cast from exile may end. The card in exile from a different source is a new zone-change, creating a new object that has no connection to the Adventure's specific exile permission.
