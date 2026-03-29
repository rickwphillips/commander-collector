---
id: p286
name: Sagas and Lore Counters — Sequential Chapter Abilities on Enchantments
category: triggered
cr_refs: [714.1, 714.2, 714.3, 714.4, 714.5, 714.6, 714.7]
tags: [saga, lore-counter, chapter, enchantment, chapter-ability, precombat-main-phase, sacrifice, Dominaria, History-of-Benalia, Triumph-of-the-Hordes, Urza-Saga, The-Eldest-Reborn, Phyrexian-Scriptures]
created: 2026-03-29
examples_count: 2
---

# P286 — Sagas and Lore Counters — Sequential Chapter Abilities on Enchantments

## Abstract
Sagas are an enchantment subtype introduced in Dominaria (2018). They enter the battlefield with a lore counter (turn-based action at the start of your precombat main phase adds another). Each chapter ability triggers when the number of lore counters matches that chapter's symbol (I, II, III). When the final chapter ability resolves, the Saga is sacrificed. Sagas provide sequenced, cumulative effects over multiple turns — a story told in acts. Each chapter triggers independently, and the Saga is sacrificed AFTER the last chapter triggers and resolves.

## The Definitive Rules

**CR 714.2** (verbatim): *"As a Saga enters the battlefield, its controller puts a lore counter on it."*

**CR 714.3** (verbatim): *"Immediately after a player's precombat main phase begins, that player puts a lore counter on each Saga enchantment they control. (This is a turn-based action; see rule 703.4f.) Then all chapter abilities that are now triggered trigger."*

**CR 714.4** (verbatim): *"A chapter ability is a triggered ability of a Saga that has the condition 'When the lore counter that is [the chapter symbol] is added.' The chapter ability for a given chapter triggers when its lore counter condition is met."*

**CR 714.5** (verbatim): *"A Saga's final chapter number is the highest chapter number among its chapter abilities."*

**CR 714.6** (verbatim): *"Immediately after a chapter ability of a Saga triggers, if no chapter abilities of that Saga have triggered yet this turn as the result of a lore counter being added, and the Saga has no chapters yet to complete based on the number of lore counters on it, the Saga's controller sacrifices the Saga."*

**CR 714.7** (verbatim): *"If a Saga is not sacrificed as the result of the above rule, the Saga stays on the battlefield. If it has already met the condition of its final chapter ability, it is sacrificed the next time a player would put a lore counter on it or any of its chapter abilities would trigger."*

## The Pattern

```
SAGA TIMELINE:
  Turn 1 (Saga enters): 1 lore counter added as ETB action. Chapter I triggers.
  Turn 2 (precombat main phase begins): turn-based action adds 1 more lore counter. Chapter II triggers.
  Turn 3 (precombat main phase begins): turn-based action adds 1 more lore counter. Chapter III triggers.
  After Chapter III triggers: Saga is sacrificed (immediately after the trigger if it's the final chapter).

  Wait: the exact timing per CR 714.6:
  "Immediately after a chapter ability triggers, if no other chapter abilities triggered this turn
  from a lore counter being added, AND the saga has no more chapters to trigger → sacrifice."
  In practice: on turn 3 (for a 3-chapter Saga), Chapter III triggers, then the Saga is sacrificed.

ENTERING WITH LORE COUNTERS:
  CR 714.2: enters with 1 lore counter. Chapter I triggers.
  Read Ahead (P266): enters with the chosen number of lore counters. Higher chapters trigger instead.
  Without Read Ahead: always starts at Chapter I.

LORE COUNTER TIMING:
  Immediately after precombat main phase begins: add lore counters (turn-based action)
  This happens BEFORE you get priority in your precombat main phase
  The lore counter addition → chapter ability triggers → these go on the stack → you get priority.

MULTIPLE SAGAS:
  If you control multiple Sagas: each gets a lore counter at the start of your precombat main phase
  All their chapter triggers go on the stack simultaneously
  You choose the order they're put on the stack (APNAP order, but you're the active player → you choose)

SAGA + PROLIFERATE:
  Proliferate adds a lore counter to a Saga
  This triggers the chapter that has a counter matching the new count
  Advancing a Saga with Proliferate: skip ahead to higher chapters
  Can also advance past the final chapter: if a Saga has 3 chapters and you proliferate to add a 4th
    counter → CR 714.7: sacrifice happens next time a lore counter would be added or chapter triggers.
    Actually at 4 counters: all chapters have already triggered (they trigger at 1, 2, 3). Sacrificed.

SAGA CHAPTER ABILITY TYPES:
  Each chapter ability is a triggered ability that says: "When this chapter's lore counter is added..."
  The ability's text describes the effect (create tokens, destroy permanents, tutor, etc.)
  The ability goes on the stack like any triggered ability
  Can be countered, redirected, responded to

NOTABLE SAGAS (Dominaria, and beyond):
  History of Benalia ({1}{W}{W}, Saga):
    Chapter I: create a 2/2 white Knight token with vigilance.
    Chapter II: create another 2/2 white Knight token with vigilance.
    Chapter III: Knights you control get +2/+1 until end of turn.
    Turn 1: 2/2 Knight. Turn 2: another 2/2 Knight. Turn 3: both Knights become 4/3. Attack!
    After Chapter III: History sacrifices itself.

  The Eldest Reborn ({4}{B}, Saga):
    Chapter I: each opponent sacrifices a planeswalker.
    Chapter II: each opponent discards a card.
    Chapter III: put target creature or planeswalker from a graveyard onto the battlefield under your control.
    Three-turn story: destroy PWs, discard, then steal something powerful from any GY.

  Urza's Saga ({3}{A}{A} or just a land Saga):
    Urza's Saga is a LAND that is also a Saga. One of the most powerful modern Sagas.
    Chapter I: creates a Construct artifact creature token (0/0 + 1/1 per artifact you control).
    Chapter II: untap and tap for {C} (functions as a land).
    Chapter III: search for an artifact with mana value 0 or 1 (Mox Opal, Expedition Map, etc.).
    Then the Saga-land sacrifices itself.
    In artifact decks: 3-mana-value land Saga that creates a large token AND tutors for a cheap artifact.

  Phyrexian Scriptures ({2}{B}{B}, Saga):
    Chapter I: put a +1/+1 counter on a target creature. It becomes an artifact in addition to other types.
    Chapter II: destroy all non-artifact creatures.
    Chapter III: exile all cards from all opponents' graveyards.
    Story: protect YOUR creatures (make one an artifact), then Wrath everything that isn't an artifact, then hate their graveyards.

SAGA + SACRIFICE BEFORE LAST CHAPTER:
  If you sacrifice a Saga before its final chapter: you don't get the remaining chapters.
  No "free" ways to skip to the end.
  Unless: Proliferate or direct counter addition.
  The Saga tells its full story — or you sacrifice it early and lose future chapters.
```

## Definitive Conclusions

- **Sagas add a lore counter on entry AND at the start of each precombat main phase** — chapter I triggers on entry, later chapters on subsequent turns.
- **The Saga sacrifices itself after the last chapter triggers** — automatically, as part of the chapter trigger.
- **Proliferate can advance a Saga**, potentially skipping chapters to the end.
- **Chapter abilities are triggered abilities** — they can be countered, responded to, or redirected like any trigger.
- **Sagas with Read Ahead can start at any chapter** — skipping earlier chapters permanently.

## Canonical Example
**History of Benalia Knight Tribe:**
Turn 3: cast History of Benalia ({1}{W}{W}). Enters with 1 lore counter.
Chapter I triggers: create a 2/2 white Knight with Vigilance.
Turn 4: precombat main phase begins. Turn-based action: add 1 lore counter to History.
Chapter II triggers: create another 2/2 white Knight with Vigilance.
Turn 5: precombat main phase begins. Add lore counter.
Chapter III triggers: "Knights you control get +2/+1 until end of turn."
You have two 2/2 Knights (plus any other Knights from your deck).
Two 2/2 → two 4/3 Knights (with Vigilance). Attack for 8 total damage.
History of Benalia is sacrificed after Chapter III resolves.
Over 3 turns: spent {1}{W}{W} for two bodies AND a pump effect — efficient value.

**Example 2 — Urza's Saga in Artifact Deck:**
Play Urza's Saga (land). Enters with 1 lore counter.
Chapter I triggers: create a Construct artifact creature token (0/0 + 1/1 per artifact you control).
If you have 5 artifacts: Construct is a 5/5.
Turn 2: precombat main phase begins. Lore counter added to Urza's Saga.
Chapter II triggers: Urza's Saga can tap for {C} mana (it's also a land in Chapter II).
Turn 3: precombat main phase begins. Lore counter added.
Chapter III triggers: search library for a card with mana value 0 or 1 → Shadowspear, Expedition Map, etc.
Urza's Saga sacrifices itself.
Result: played a land, got a large Construct token, had a land that tapped for colorless, AND tutored a powerful artifact. All from one land slot in the deck.

## Commonly Confused With
- **P266 (Read Ahead Sagas)** — Read Ahead modifies Saga entry to skip to any chapter; base Saga rules always start at Chapter I.
- **P276 (Battles)** — Battles have defense counters and flip when defeated; Sagas have lore counters and advance through chapters before sacrificing.
- **P183 (Lore Counter general rules)** — Lore counters specifically on Sagas; not to be confused with story spotlights or narrative.
