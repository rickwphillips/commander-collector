---
id: p262
name: Cleave, Boast, and Demonstrate — Remove Bracketed Text and Special Activations
category: stack
cr_refs: [702.148a, 702.142a, 702.144a]
tags: [cleave, boast, demonstrate, text-change, activated-ability, copy-spell, Innistrad-Crimson-Vow, Kaldheim, Strixhaven, Wash-Away, Koma-Cosmos-Serpent, Culmination-of-Studies]
created: 2026-03-28
examples_count: 2
---

# P262 — Cleave, Boast, and Demonstrate — Remove Bracketed Text and Special Activations

## Abstract
Three mechanics from 2021. **Cleave**: an alternative cost that, if paid, removes all bracketed text from the spell's rules text — turning a conditional or limited effect into a broader one. **Boast**: a special activated ability on creatures that can only be activated if the creature attacked this turn, and only once per turn — rewarding aggressive play. **Demonstrate**: a triggered ability when you cast the spell — you may copy it and choose a new controller for one copy (giving an opponent a free copy of your spell in exchange for you getting to cast it for its original cost, with the idea of it being beneficial to you).

## The Definitive Rules

**CR 702.148a** (verbatim): *"Cleave is a keyword that represents two static abilities that function while a spell with cleave is on the stack. 'Cleave [cost]' means 'You may cast this spell by paying [cost] rather than paying its mana cost' and 'If this spell's cleave cost was paid, change its text by removing all text found within square brackets in the spell's rules text.' Casting a spell for its cleave cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.142a** (verbatim): *"A boast ability is a special kind of activated ability. 'Boast — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only if this creature attacked this turn and only once each turn.'"*

**CR 702.144a** (verbatim): *"Demonstrate is a triggered ability. 'Demonstrate' means 'When you cast this spell, you may copy it and you may choose new targets for the copy. If you copy the spell, choose an opponent. That player copies the spell and may choose new targets for that copy.'"*

## The Pattern

```
CLEAVE:
  Alternative cost: pay cleave cost instead of normal mana cost
  If paid: change text by REMOVING all text in square brackets
  The square brackets indicate "optional restrictions" that disappear with cleave

  CLEAVE EXAMPLES:
    Wash Away ({1}{U}, Cleave {3}{U}): "Counter target spell [that wasn't cast from its owner's hand]."
    Normal ({1}{U}): counter only spells not cast from hand (cascade, rebound, suspend, etc.)
    Cleave ({3}{U}): remove the bracket → counter target spell (ANY spell!)
    Normal: niche counterspell. Cleave: hard counter anything for {3}{U}.
    The bracket text was the restriction: paying cleave removes the restriction.

  CLEAVE EXPANSION:
    Some cleave cards gain text when brackets are removed:
    The spell might say: "[Draw a card. If you can't,] lose 3 life."
    Wait: actually cleave REMOVES the bracket text. So bracketed text removed = narrower effect becomes broader.
    Typically: the bracket text is a limitation that disappears when paid.

  CLEAVE + COPYING:
    Copy of a cleave spell cast for the cleave cost: does the copy have the modified text?
    When the spell was cast with cleave: its text was changed (text-changing effect via CR 702.148b and 612)
    The copy should have the same modified text (the bracket text was removed)
    Yes: copies of cleave spells (cast with cleave cost) retain the bracket-removed text.

  CLEAVE CARDS (Innistrad: Crimson Vow):
    Wash Away (as above): best cleave example.
    Dig Up ({G}): normal = search for basic land. Cleave {2}{B}{G} = search for any card.
    Cemetery Protector ({2}{W}{W}): creature with cleave. Cleave removes restrictions on its ETB.

BOAST:
  Special activated ability: functions only when the creature attacked this turn
  Can only be activated ONCE each turn
  "Attacked this turn" = this creature was declared as an attacker in the current turn
  Activated at any time priority is available AFTER the creature attacked (during or after combat)

  BOAST + TIMING:
    Turn 1: creature doesn't attack → can't boast.
    Turn 2 (creature has haste or it's next turn): attacks → can boast.
    When: during combat (after declare attackers step) OR after combat (second main phase).
    One activation per turn (even if creature is somehow un-tapped and re-attacks).

  BOAST + VIGILANCE:
    Vigilance: attacks without tapping. The creature attacked this turn → boast is available.
    Can activate boast AND still be untapped (since vigilance prevents tapping when attacking).
    Vigilance + Boast: attack, keep the creature available for blocking, AND activate boast.

  BOAST CARDS (Kaldheim):
    Koll, the Forgemaster ({R}{W}): 2/2, Boast {1}: "Return target creature token you control to hand."
      Attack with Koll, then boast to get back a creature token (like a pumped Servo or Treasure).
    Tundra Fumarole ({2}{U}{U}): not a boast card... Let me use actual Kaldheim boast creatures.
    Varragoth, Bloodsky Sire ({2}{B}): 2/3 Deathtouch, Boast {1}{B}: "target player searches for a card, puts it on top of library."
      Attack with Varragoth → boast to tutor ANY card to the top of any player's library (including yours).
      Varragoth is a boast tutor: attack to enable your tutor.

  BOAST LIMITATIONS:
    "Only once each turn" — even if the creature makes multiple attacks (extra combat phases): still once.
    "Only if this creature attacked this turn" — checks the creature's attack history this turn.

DEMONSTRATE:
  Triggered: "when you cast this spell"
  Optional: you may copy it (choose new targets for copy)
  If you copy it: you MUST choose an opponent. That opponent ALSO copies the spell (and may choose new targets).
  Net: cast spell, get a copy for yourself, give opponent a copy (symmetrical).
  Why use Demonstrate? When the spell's effect is good for you and situationally bad for the opponent.

  DEMONSTRATE + SYMMETRY:
    Demonstrate is symmetrical: BOTH players get a copy.
    You must want the effect enough to give the opponent an equal copy.
    Best on spells that draw/ramp: you both draw, but you initiated → chose better targets.

  DEMONSTRATE CARDS (Strixhaven):
    Culmination of Studies ({X}{U}{R}): Demonstrate. "Exile top X cards. For each land, draw a card. For each instant/sorcery, deal 1 damage per instant/sorcery revealed."
      Demonstrate: you and an opponent both exile X cards from library and get the effects.
      In your deck with 25+ spells: hit big damage. Opponent might not be set up the same way.
    Solve the Equation ({2}{U}): Sorcery — Demonstrate. "Search library for instant or sorcery, put in hand."
      Demonstrate: you and opponent both tutor. But you tutor for your win con; opponent tutors for their answer.
      Usually don't demonstrate this (too much benefit to opponent).
    Reflective Golem: creates extra copies... Actually: Crystalline Resonance, Codie, etc.
```

## Definitive Conclusions

- **Cleave removes bracketed restrictions** at a higher alternative cost — same spell, broader effect.
- **Boast activates once per turn, only if this creature attacked** — attack to unlock the ability.
- **Demonstrate is symmetrical copying**: you get a copy AND must give an opponent a copy — use when the effect favors you.
- **Vigilance + Boast** is the synergistic combination: attack without tapping, then activate boast.
- **Wash Away cleave** is the premier competitive cleave card: {1}{U} niche counter or {3}{U} hard counter.

## Canonical Example
**Wash Away Cleave in Modern Control:**
Opponent's Turn 4: plays cascading spell. Cascade triggers → exile cards → cast Crashing Footfalls for free.
Crashing Footfalls was NOT cast from hand (it was cast via cascade).
Hold up {1}{U}: use Wash Away without cleave → counter target spell NOT CAST FROM HAND.
Crashing Footfalls was cast via cascade: "not cast from its owner's hand" → valid target.
Counter it for {1}{U}.
Without cleave: surgical counter for spells bypassing the hand.
If opponent casts a regular spell: pay {3}{U} for cleave Wash Away → counter anything.
One card that's either {1}{U} for cascade hate OR {3}{U} for hard counter.

**Example 2 — Varragoth Boast Tutor:**
Turn 3: cast Varragoth ({2}{B}): 2/3 Deathtouch enters.
Turn 4: attack with Varragoth (opponent unlikely to block due to deathtouch).
After declare attackers step: activate Boast {1}{B} → target player (you) searches library for a card, puts it on top.
Tutor ANY card to top of library.
Then draw it on the next draw step (or draw spell).
Cost: {1}{B} activation + an attack (which was probably good anyway due to deathtouch deterrence).
If opponent blocks: deathtouch kills their blocker. Boast still activated (before combat damage).
Varragoth is a recurring tutor that becomes available each turn you attack.

## Commonly Confused With
- **P250 (Overload)** — Overload changes "target" to "each" (text change via alternative cost); Cleave removes BRACKETED limitations (also text change via alternative cost). Both are alternative-cost text changes, but different mechanisms.
- **P246 (Conspire)** — Conspire taps creatures for a free copy; Demonstrate gives you AND an opponent a copy (symmetrical).
- **P252 (Exploit)** — Exploit sacrifices a creature on entry; Boast activates after attacking (different combat-incentivized ability).
