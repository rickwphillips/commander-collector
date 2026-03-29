---
id: p362
name: Storm and Cascade — Triggered Abilities That Care About Spells Cast This Turn
category: stack
cr_refs: [702.40a, 702.40b, 702.85a, 702.85b, 702.85c, 117.5, 603.2c]
tags: [storm, cascade, spell-count, storm-copy, cascade-exile, storm-count, Grapeshot, Tendrils-of-Agony, Empty-the-Warrens, Bloodbraid-Elf, Shardless-Agent, Valki-cascade-interaction, storm-trigger, cascade-cast-without-paying, suspended-storm, counter-copy-difference]
created: 2026-03-29
examples_count: 2
---

# P362 — Storm and Cascade — Triggered Abilities That Care About Spells Cast This Turn

## Abstract
**Storm** (702.40a) is a triggered ability that fires when you cast the spell: create a copy for each other spell cast before it this turn. The storm count = number of spells cast before the storm spell this turn (not including the storm spell itself). **Cascade** (702.85a) is a triggered ability that fires when you cast the spell: exile cards from library until you find a nonland with lower mana value, and you may cast it without paying its mana cost. Both trigger on casting ("when you cast this spell"), so they trigger once per casting event and go on the stack. Storm copies go on the stack all at once (no additional casting triggers). Cascade's cast (the found card) DOES trigger cascade and other "when cast" triggers on the cascaded card. A famous ruling: Cascade into a MDFC like Valki/Tibalt — you exile until you find a nonland with lower MV than the cascade spell; the card's MV is the front face's, but you can only cast it as a spell with appropriate MV.

## The Definitive Rules

**CR 702.40a** (verbatim): *"Storm is a triggered ability that functions on the stack. 'Storm' means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 702.85a** (verbatim): *"Cascade is a triggered ability that functions only while the spell with cascade is on the stack. 'Cascade' means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

## The Pattern

```
STORM (702.40a):
  WHAT IS "STORM COUNT"?
    The number of OTHER spells cast before the storm spell this turn.
    NOT including the storm spell itself.
    All spells count (instants, sorceries, creatures, artifacts, planeswalkers, enchantments, etc.).
    "This turn" = current turn from beginning.
  HOW IT WORKS:
    You cast a storm spell (e.g., Grapeshot for {1}{R} = "deal 1 damage to any target, storm").
    Storm is a triggered ability: "when you cast this spell."
    Trigger goes on stack ABOVE the original storm spell.
    When trigger resolves: "copy for each other spell cast before it this turn."
    Storm count = N. Create N copies of the storm spell on the stack.
    Copies are NOT "cast" — no prowess triggers, no "when you cast" effects.
    Each copy can have new targets chosen (if the spell has targets).
    Then: copies resolve from top to bottom (LIFO). Original storm spell still resolves after.
  STORM COPIES VS. ORIGINAL:
    Original storm spell still on stack (below all copies). It resolves last.
    If storm count = 5: 5 copies + 1 original = 6 total Grapeshot instances (6 damage total if
      all hit the same target, for example).
  SUSPENDED SPELLS AND STORM:
    If a storm spell is cast from suspend (all time counters removed, then "cast it without paying"):
      "Cast" it = casting event occurs. Storm triggers. Storm counts ALL spells cast "this turn."
      But: suspended spells are "cast" when removed from suspend (at the beginning of your main phase).
      Does the storm count spells cast earlier this turn? YES — "this turn" = all spells cast that turn.
      If you cast 3 spells before the suspended storm spell resolves: storm count includes those 3.
  COPYING STORM SPELLS:
    Copied spells don't trigger storm (copies aren't cast).
    Fork copying a Grapeshot: Fork creates 1 copy (not via storm). Storm doesn't trigger on the copy.
    But: if storm triggers, the copies created by storm are also copies (not cast).
  OPPONENT COPYING STORM SPELL:
    Some cards let opponents copy spells. If opponent copies your Grapeshot:
      The copy is put on the stack under your opponent's control. Not cast. Storm doesn't trigger.
      But the COPY has storm... wait: copying a spell copies characteristics. Does the copy have storm?
      Yes: storm is part of the card's rules text. The copy has storm.
      When the COPY "resolves"... storm doesn't trigger (storm triggers "when you CAST this spell").
      The copy was never cast. Storm on the copy doesn't trigger.

CASCADE (702.85a):
  WHAT IT DOES:
    When you cast a cascade spell: trigger fires.
    Exile cards from top of library until you exile a nonland card with LOWER MV than the cascade spell.
    You MAY cast that card without paying its mana cost.
    Put all other exiled cards on the bottom of library in random order.
  KEY RULES:
    The found card's MV must be LESS THAN the cascade spell's MV (not equal to, not less-or-equal).
    If the cascade spell is MV 4: the found card must be MV 3 or lower.
    You may choose NOT to cast it (the "may" in "you may cast").
    Casting is optional: if you don't want to cast the found card, it goes to the bottom too.
  WHAT COUNTS AS MV FOR CASCADE?
    For split cards, MDFCs: the card's MV as used in non-stack zones.
    Split card (Fire//Ice): both halves' MVs combined = front+back. If combined MV < cascade spell: eligible.
    MDFC (Valki, God of Lies // Tibalt): the FRONT face's MV counts for cascade eligibility.
      Valki front face: MV 2. Tibalt back face: MV 7.
      A cascade spell of MV 3+ would "find" Valki (front face MV 2 < 3).
      When you "may cast" the found card: the ruling is you can only cast it as a spell with MV < cascade spell.
        If you cast Valki (front, MV 2): fine. MV 2 < 3. Legal.
        If you try to cast Tibalt (back, MV 7): MV 7 > 3. The resulting spell's MV MUST be less than cascade.
          702.85a: "if the resulting spell's mana value is less than this spell's mana value."
          Casting Tibalt (MV 7): resulting spell MV 7. Not less than the cascade spell's MV (3). Can't cast it.
        Rulings: you can only cast the front face (Valki) via cascade when the back face's MV exceeds the cascade spell.
  CASTING FROM CASCADE — IS IT A "CAST"?
    YES: you CAST the found card (as a spell). This IS a casting event.
    This means:
      - Prowess triggers on the cascade-caster (if they cast a spell, prowess fires).
      - Cascade on the found card triggers again (if the found card has cascade).
      - "When you cast [X type of spell]" triggers fire.
    STORM INTERACTION: You cast a storm spell via cascade. Storm triggers. The storm count includes
      all spells cast before this cascaded storm spell this turn.
      Wait: you're casting the found card. If it's a storm spell: storm triggers.
  CHAINED CASCADE:
    Cascade into another cascade: the found card is cast, its cascade triggers, cascade again.
    Example: Shardless Agent (MV 3) cascades. Finds Ancestral Vision (MV 0, suspended).
      Wait: Ancestral Vision has MV 0 (no mana cost). Can cascade find MV 0?
      702.85a: "nonland card whose mana value is less than this spell's mana value."
      MV 0 < MV 3: yes! Cascade finds it.
      "You may cast that card without paying its mana cost."
      Ancestral Vision has no mana cost (it's a suspended card that normally has no casting cost):
        When you cascade into it: cast it without paying its mana cost. It just resolves.
        But Ancestral Vision says "target player draws 3 cards" when resolved normally.
        Wait: Ancestral Vision has suspend 4 (cast it from suspend). Does it have "suspend only"? No.
        Cascade can cast it directly. Result: draw 3 cards immediately from cascade.

STORM VS. CASCADE — KEY DIFFERENCE:
  STORM: copies are created. Original stays on stack. Multiple instances resolve separately.
    Storm doesn't "cast" the copies; they're put on the stack.
  CASCADE: the found card is CAST. New casting event. Triggers "when you cast" effects.
    Cascade is more like cheating a single spell out. Storm multiplies the original.

WINNING WITH STORM:
  Ad Nauseam ({3}{B}{B}): "Reveal the top card of your library, put it into your hand, and pay life equal to its mana value. Repeat this process until you choose to stop."
    Non-storm spell but fuels storm.
  Grapeshot ({1}{R}): "Grapeshot deals 1 damage to any target. Storm (when you cast this spell, copy it for each other spell cast before it this turn)."
    Storm count 10: Grapeshot + 10 copies = 11 instances of "deal 1 damage" = 11 damage total to one target.
    Win condition: cast enough rituals/cantrips to build storm count, then Grapeshot for lethal.
  Tendrils of Agony ({2}{B}{B}): "Target player loses 2 life and you gain 2 life. Storm."
    Storm count 10: 11 instances × (opponent -2 life, you +2 life) = opponent -22 life, you +22 life.
    Classic storm win: "going off" with enough rituals to reach storm count for lethal.
```

## Definitive Conclusions

- **Storm count = number of OTHER spells cast this turn before the storm spell** — all spell types count; the storm spell itself doesn't count itself.
- **Storm copies are NOT cast** — they don't trigger prowess, other "when you cast" effects, or cascade; copies go on stack and resolve.
- **Cascade's found card IS cast** — it triggers prowess, cascade on the found card, and other "when you cast" effects; it's a real cast event.
- **Cascade MV check: the resulting spell's MV must be less than the cascade spell's MV** — for MDFCs, you can only cast the face whose MV is less than the cascade spell.
- **Storm uses "this turn" for its count** — includes all spells cast at any point in the current turn, not just the current main phase.
- **Cascade finds a card, then you OPTIONALLY cast it** — you can choose not to cast the found card; it goes to the bottom of the library.

## Canonical Example
**Grapeshot Storm Win in Legacy Storm:**
You're playing Legacy Storm. Your hand: Gitaxian Probe, Dark Ritual, Dark Ritual, Cabal Ritual, Cabal Ritual, Cabal Ritual, Grapeshot.
Opponent at 20 life.

Turn 3 (you have 3 lands):
Cast Gitaxian Probe (paying 2 life, storm count: 0 before). Cast it → storm count goes to 1.
Draw a card. Good card? Doesn't matter.
Cast Dark Ritual → storm count 2. Gain {B}{B}{B}.
Cast Dark Ritual → storm count 3. Gain {B}{B}{B}.
Cast Cabal Ritual → storm count 4. Gain {B}{B}{B}.
Cast Cabal Ritual → storm count 5. Gain {B}{B}{B}.
Cast Cabal Ritual → storm count 6. Gain {B}{B}{B}.
Now: 6 spells cast before Grapeshot. Storm count = 6.
Cast Grapeshot targeting opponent.
Grapeshot's storm triggers: "copy for each spell cast before it this turn." 6 copies.
Stack: Grapeshot (bottom) + 6 copies = 7 total instances, each dealing 1 damage to opponent.
7 instances × 1 damage = 7 damage to opponent. Not quite lethal (need 20).
For a real kill: need storm count ≥ 19 (for 20 damage). Modern Storm decks build much higher counts.
OR: aim each copy at different targets, or use Tendrils (2 damage per instance).

**Example 2 — Bloodbraid Elf Cascading into Valki/Tibalt:**
You control Bloodbraid Elf ({2}{R}{G}): MV 4, cascade.
Cascade triggers: exile cards until you find nonland with MV < 4.
You find Valki, God of Lies // Tibalt, Cosmic Impostor.
Valki front face: MV 2. Tibalt back face: MV 7.
CARD'S MV for cascade eligibility: front face MV = 2 < 4. Eligible!
You may cast it. But which face?
  Cast Valki (MV 2): MV 2 < 4 (cascade spell). "If the resulting spell's mana value is less than this spell's mana value" — Valki's resulting spell MV = 2. 2 < 4. Legal. Valki enters.
  Cast Tibalt (MV 7): "If the resulting spell's mana value is less than this spell's mana value" — Tibalt's resulting spell MV = 7. 7 > 4. NOT less than cascade spell's MV. Cannot be cast.
Result: you can only cascade into Valki (front face). Tibalt is off limits.
This ruling was controversial when it first came up in competitive play. Some players tried to cast Tibalt "for free" (it's the same card). The ruling: you can only cast the face whose MV qualifies (< cascade spell's MV).

## Commonly Confused With
- **P355 (Copy Effects)** — Storm creates copies of the storm spell on the stack. These copies are copy effects (707.10). Copies are not cast (707.10: "a copy of a spell isn't cast"). Storm copies use copy rules: same targets by default, you may choose new targets for each.
- **P346 (Cycling/Kicker/Adventure)** — Cascade "costs" you find a nonland card and cast it for free. Kicker is an additional cost when casting. Cascade and kicker both modify how you interact with costs, but cascade is a triggered spell-chaining ability while kicker is a casting modification.
- **P344 (Split/MDFC/MV)** — Cascade's MV interaction with MDFCs is covered in P344 (which covers MV rules for those card types) and here in P362 (which covers cascade's specific MV check). The key: in non-stack zones, MDFC's MV = front face's MV; cascade checks MV of the resulting spell on the stack.
- **P006 (Intervening "If" Clause)** — Neither storm nor cascade uses an intervening "if" clause. Storm triggers unconditionally on cast; cascade triggers unconditionally on cast. There's no double-check.
