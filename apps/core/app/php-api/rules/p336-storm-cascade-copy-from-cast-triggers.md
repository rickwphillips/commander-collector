---
id: p336
name: Storm and Cascade — "Cast" Triggers, Copies vs. Casts, and Free Spell Chains
category: stack
cr_refs: [702.40a, 702.40b, 702.85a, 702.85b, 702.85c, 700.2g, 707.10]
tags: [storm, cascade, copy-not-cast, triggered-ability-cast, storm-count, cascade-chain, free-cast, Living-End, Crashing-Footfalls, Brain-Freeze, Tendrils-of-Agony, Grapeshot, Ad-Nauseam, Bloodbraid-Elf, cascade-modal-DFC, storm-combo, Valki-cascade]
created: 2026-03-29
examples_count: 2
---

# P336 — Storm and Cascade — "Cast" Triggers, Copies vs. Casts, and Free Spell Chains

## Abstract
**Storm** creates copies of a spell equal to the number of spells cast before it this turn — the copies are NOT cast (they bypass "when you cast" triggers). **Cascade** is a triggered ability that lets you cast a free spell from the top of your library with mana value less than the cascade spell — the free spell IS cast (it does trigger "when you cast" effects, including cascading again). Both are powerful combo enablers. A crucial distinction: **copies are not casts** — Storm and Fork copies don't trigger Storm, prowess, or any "when you cast a spell" ability. The **storm count** tracks spells cast this turn, including the Storm spell itself.

## The Definitive Rules

**CR 702.40a** (verbatim): *"Storm is a triggered ability that functions on the stack. 'Storm' means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 702.85a** (verbatim): *"Cascade is a triggered ability that functions only while the spell with cascade is on the stack. 'Cascade' means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

**CR 707.10** (verbatim): *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack; a copy of a spell isn't cast and a copy of an activated ability isn't activated."*

## The Pattern

```
STORM — SPELL COUNT DETERMINES COPIES:
  Storm (CR 702.40a): triggered ability firing when you CAST the storm spell.
  "Copy it for each other spell that was cast before it this turn."
  The storm COUNT = number of spells cast BEFORE the storm spell this turn.
    The storm spell itself: doesn't count for its OWN storm count.
    Copies: NOT cast → don't increment the storm count for other copies.
  EXAMPLE STORM COUNT:
    Turn 7 in cEDH Storm combo. You cast: Dark Ritual (1), Cabal Ritual (2), Manamorphose (3),
      Gitaxian Probe (4), Cabal Ritual (5), Tendrils of Agony (storm spell, #6).
    Storm count: 5 (the 5 spells cast before Tendrils).
    Tendrils enters. Storm triggers. Create 5 COPIES of Tendrils.
    Stack: [Copy5] [Copy4] [Copy3] [Copy2] [Copy1] [Original Tendrils]
    Tendrils: "Target player loses 2 life and you gain 2 life."
    Each copy: 2 life loss + 2 gain.
    Original + 5 copies = 6 total → 12 life loss for opponent, 12 life gain for you.
    If opponent at 20 life: 12 life loss → 8 life. Not lethal.
    Need storm count of 10: 11 Tendrils = 22 life loss. Typically need 11+ for a kill from 20.

  COPIES ARE NOT CASTS:
    Storm's copies don't trigger prowess ("whenever you cast a spell, get +1/+1 until EOT").
    Storm's copies don't trigger storm AGAIN (no infinite loop).
    Storm's copies don't trigger cascade.
    The copies ARE spells on the stack. They can be countered (each separately).
    If original is countered with Stifle before storm resolves: storm never copied. Original dies.
    If storm resolves but then all copies are countered: original still resolves (it resolves last, on the bottom).

  STORM AND TIMING:
    Storm is a TRIGGERED ability. It goes on the stack when you cast the storm spell.
    After casting Tendrils: both Tendrils AND the storm trigger are on the stack.
    Storm trigger on top → resolves first → creates copies.
    Then the copies resolve (top to bottom).
    Then the original Tendrils resolves last.

  CLASSIC STORM SPELLS:
    Tendrils of Agony ({2}{B}{B}): storm. "Target player loses 2 life, you gain 2 life." Life drain × storm count.
    Grapeshot ({1}{R}): storm. "This spell deals 1 damage to any target." + copies = × storm count.
    Brain Freeze ({1}{U}): storm. "Target player mills 3 cards." + copies = × storm count.
    Empty the Warrens ({3}{R}): storm. "Create two 1/1 Goblin tokens." + copies = 2 × (storm count+1) tokens.
    Past in Flames ({3}{R}): storm. Gives all instant/sorcery in GY flashback until EOT.
      Storm count on Past in Flames: the copies let you cast MORE spells from GY → build storm count further.

CASCADE — FREE CAST FROM LIBRARY:
  Cascade (CR 702.85a): triggered ability when you CAST a spell with cascade.
  "Exile cards from top of library until you find a nonland card with MV less than this spell's MV."
  You MAY cast that card without paying its mana cost.
  Everything else exiled is put on the bottom in random order.

  CASCADE IS NOT RANDOM — IT'S CONSTRAINED:
    The found card must have MV LESS THAN the cascade spell.
    You continue exiling until you find a qualifying card.
    Example: Bloodbraid Elf (MV 4, cascade). Exile until you find a card with MV 3 or less.
    You may cast the found card for free. The card resolves normally.
  THE FREE CAST IS A REAL CAST:
    CR 702.85a: "You may CAST that card without paying its mana cost."
    Casting via cascade = CAST. Triggers "when you cast" effects.
    Prowess triggers from a cascade spell.
    Storm count increases if you cascade into a storm spell.
    Another cascade spell found via cascade: that spell also triggers its OWN cascade!
    This creates a CHAIN: Cascade → free cast → free cast triggers cascade again (if the cascaded spell also has cascade).
  THE CHAIN:
    Shardless Agent (MV 3, cascade): cascade into a card with MV 2 or less.
      If you cascade into another cascade card with MV 2 (rare), that triggers cascade too.
    But: most cascade spells have higher MV, so the chain rarely happens naturally.
    Exception: Cascade + zero-MV spells in the deck on purpose:
      Living End (suspend, cascade, MV 0 on stack... wait: MV of suspend spells):
        Living End has MV 3 in other contexts, but when exiled for suspend, its MV is 0.
        Actually: Living End has no mana cost. Its MV is 0.
        Wait: cascade looks for MV < cascade spell's MV.
        If cascade spell has MV 3: looks for MV < 3.
        Living End has MV 0 (no mana cost) → qualifies.
        Cascade always finds Living End in a deck built around it.
      Crashing Footfalls: {0} suspend. MV 0. Cascade finds it.
        Suspend cascade: cast Shardless Agent (MV 3, cascade). Cascade finds Crashing Footfalls (MV 0).
        Cast Crashing Footfalls "without paying its mana cost" → 4 tokens!
        Wait: Crashing Footfalls says "Suspend 4 — {G}." Its mana cost is BLANK (0).
        When cast with cascade: you cast it. It goes on the stack normally (not exiled for suspend).
        It resolves: "Create two 3/3 green Rhino creature tokens with trample."
        Free 4 power in tokens from cascading for free.

  CASCADE AND MODAL DFC (THE VALKI COMBO):
    Modern controversy: Valki, God of Lies // Tibalt, Cosmic Impostor.
    Valki: {1}{B} (MV 2). Tibalt: {5}{B}{R} (MV 7).
    Cascade spell with MV ≥ 8 (e.g., Shardless Agent MV 3 < 8: wouldn't work).
    Better: Ardent Plea or Bloodbraid Elf cascade.
    Wait: the controversy was: cascade at MV 4 finds Valki/Tibalt in library.
      Valki's front face MV is 2 (less than 4). Cascade finds it.
      Can you then cast the BACK FACE (Tibalt, MV 7) instead?
    CR 702.85a: "if the resulting spell's mana value is less than this spell's mana value."
      "The resulting spell's MV" checks the MV of the spell you cast.
      If you cast the back face (Tibalt, MV 7): 7 is NOT less than 4.
      The resulting spell must also have MV less than the cascade spell.
    RULING: You can only cast the front face (Valki, MV 2) for free. Tibalt is not legal.
      This was clarified with a CR update (702.85a revised language).
      Before the clarification: arguments were made for Tibalt via cascade. Now: no.

  BUILDING CASCADE DECKS:
    Cascade decks want to find their TARGET card reliably.
    Strategy: build with ALL cascade triggers finding the SAME card (e.g., only one non-land card with MV < cascade MV).
    Living End Modern: run only MV 0 cards (Living End) and cascade spells with MV 3+.
      Every cascade trigger finds Living End. Opponent can't do much.
    Crashing Footfalls Rhinos: similar structure with Crashing Footfalls as the only 0-MV target.

INTERACTION: COPIES DON'T CASCADE:
  If you COPY a cascade spell (Fork, Reverberate): the copy is NOT CAST.
  Cascade triggered "when you CAST this spell" — copies don't trigger cascade.
  Similarly: storm copies don't trigger storm.
```

## Definitive Conclusions

- **Storm count = spells cast before the storm spell this turn** — copies from storm are not casts and don't count.
- **Storm copies can each be independently countered** — one Counterspell stops one copy.
- **Cascade is a triggered ability from CASTING** — the free spell found via cascade IS cast, triggering all "when you cast" effects.
- **The cascaded spell must have MV less than the cascade spell's MV** — including checking the back face of modal DFCs.
- **Cascade chains are possible** — if a cascaded spell also has cascade, it triggers cascade again.
- **Copies of cascade spells don't cascade** — only casting triggers the cascade ability.

## Canonical Example
**Grapeshot Storm — Counting to Kill:**
Turn 5. You have 5 mana. Grapeshot in hand.
Before casting Grapeshot, build the storm count:
  Cast Simian Spirit Guide (exile from hand: add {R}). Spell #1. Storm count so far: 0 (nothing before it).
  Activate Lotus Petal. Mana ability: no stack, doesn't count for storm.
  Cast Manamorphose ({1}{R/G}): draw a card, add 2 mana of any combination. Spell #2.
    In the drawn card: another Manamorphose.
  Cast that Manamorphose. Spell #3.
    Draw another spell from deck.
  Cast Desperate Ritual ({1}{R}, splice onto arcane: add {R}{R}{R} then {R}{R}{R} from splice). Spell #4.
  Cast Pyretic Ritual ({R}): add {R}{R}{R}. Spell #5.
  Now cast Grapeshot ({1}{R}). Grapeshot is spell #6.
  Storm triggers: 5 spells were cast before Grapeshot. Create 5 copies.
  Grapeshot original + 5 copies = 6 instances of "deal 1 damage to any target."
  Each targets opponent. 6 damage total. Opponent was at 6 life. Dead.

This is the Modern "Splinter Twin" era Storm combo. Counting spells per turn is essential.

**Example 2 — Living End Cascade:**
Modern Living End deck. Deck contents: Living End (MV 0, no mana cost), cascade spells with MV 3-6, cycling/dredge creatures.
Turn 3: You have Violent Outburst ({1}{R}{G}) in hand (MV 3, cascade, instant, "creatures get +1/+0").
Cast Violent Outburst. Cascade triggers.
Exile cards until you find a nonland card with MV less than 3 (MV 0, 1, or 2).
Living End (MV 0): found immediately. No other low-MV cards in deck.
"You may cast Living End without paying its mana cost."
Cast Living End. It's an ACTUAL CAST. Living End goes on stack ABOVE Violent Outburst's cascade trigger.
But wait: cascade trigger is resolving. During resolution, you cast Living End.
Living End resolves: "Each player exiles all creature cards from their graveyard. Then each player returns all creature cards they exiled this way to the battlefield."
Your graveyard has 6 big cycling creatures (Archfiend of Ifnir, etc.). All enter the battlefield.
Opponent's graveyard is empty or small. They get back 0-2 creatures.
Net: you get 6+ power worth of creatures. Opponent gets little.

Living End is CAST (not just "put on the stack"). If someone Stifled the cascade trigger, no free cast.
But if cascade resolves: Living End is cast from exile, goes on the stack, can be countered (Force of Will, etc.).
The free cast is real. It can be interacted with like any spell.

## Commonly Confused With
- **P314 (Copy Effects)** — CR 707.10: copies of spells are not cast. Storm's copies don't trigger cast-related abilities. A copy of Grapeshot doesn't create more storm copies.
- **P329 (Casting Costs)** — Cascade allows casting "without paying its mana cost" — this is an alternative cost. X spells cascaded into have X=0 (CR 107.3b). Additional costs on a cascaded spell still apply.
- **P317 (DFC/Modal)** — The Valki//Tibalt cascade controversy: cascade checks MV of the RESULTING spell. If you cast the back face (Tibalt), resulting MV is 7 which isn't less than the cascade spell's MV. You must cast the front face.
- **P331 (Stack/Priority)** — Storm trigger goes on the stack when you cast the storm spell. Before storm resolves, players can respond. Stifling the storm trigger prevents copies from being created. Individual copies can be countered once created.
