---
id: p554
name: Replacement Effect Ordering — CR 616.1 Multiple Effects on Same Event
category: replacement
cr_refs: [616.1, 616.1a, 616.1e, 616.1f, 616.1g, 614.15, 614.17]
tags: [replacement-effect-ordering, multiple-replacements, affected-object-controller, self-replacement, prevention-effects, stacking-replacements, order-of-application, choose-order, nested-events, completely-prevents-event]
created: 2026-03-30
examples_count: 12
---

# P554 — Replacement Effect Ordering — CR 616.1 Multiple Effects on Same Event

## Abstract
When two or more replacement and/or prevention effects attempt to modify the same event affecting an object or player, CR 616.1 establishes a priority hierarchy: **the affected object's controller (or the object's owner if it has no controller) chooses which effect applies first.** Self-replacement effects take precedence (616.1a). Nested events are handled recursively (616.1g): if one replacement applies to an event, and another applies to a contained event, the container replacement applies first. Critically: **if a replacement completely prevents an event from happening, the prevented event cannot be replaced by other replacement effects.** When one replacement applies and creates a new event, that new event is subject to remaining applicable replacements (chains or "stacking"). The ordering choice is not made ahead of time; it's made as the event occurs, and the process repeats after each replacement to see what effects remain applicable.

## The Definitive Rules

**CR 616.1** (verbatim): *"If two or more replacement and/or prevention effects are attempting to modify the way an event affects an object or player, the affected object's controller (or its owner if it has no controller) or the affected player chooses one to apply, following the steps listed below."*

**CR 616.1a** (verbatim): *"If any of the replacement and/or prevention effects are self-replacement effects (see rule 614.15), one of them must be chosen. If not, proceed to rule 616.1b."*

**CR 616.1e** (verbatim): *"Any of the applicable replacement and/or prevention effects may be chosen."*

**CR 616.1f** (verbatim): *"Once the chosen effect has been applied, this process is repeated (taking into account only replacement or prevention effects that would now be applicable) until there are no more left to apply."*

**CR 616.1g** (verbatim): *"If one of the replacement or prevention effects is the effect of a resolving spell or ability, it is applied before other replacement or prevention effects that would affect the same event. If one replacement or prevention effect is applying to an event contained within another event, the effect that applies to the container event is applied first. In each case, once the chosen effect has been applied, this process is repeated."*

**CR 614.15** (verbatim): *"Some replacement effects are not continuous effects. Rather, they are an effect of a resolving spell or ability that replace part or all of that spell or ability's own effect(s). Such effects are called self-replacement effects. The text creating a self-replacement effect is usually part of the ability whose effect is being replaced, but the text can be a separate ability, particularly when preceded by an ability word. When applying replacement effects to an event, self-replacement effects are applied before other replacement effects."*

**CR 614.17** (verbatim): *"Some effects state that something can't happen. These effects aren't replacement effects, but follow similar rules."*

**CR 614.17c** (verbatim): *"If an event can't happen, it can only be replaced by a self-replacement effect (see rule 614.15). Other replacement and/or prevention effects can't modify or replace it."*

## The Pattern

```
OVERVIEW OF REPLACEMENT EFFECT ORDERING:

When multiple replacement effects apply to the same event:
  1. The affected object's CONTROLLER (or OWNER) chooses order (not the active player).
  2. If any are SELF-REPLACEMENT effects (614.15), one must be chosen.
  3. Once one is applied, check again: which replacements now apply?
  4. Repeat until no more replacements apply.

KEY DISTINCTION: WHO CHOOSES?
  Affected object's controller = owner if the object has no controller.
  A card in hand: the player whose hand it's in is the OWNER.
  A permanent on battlefield: its CONTROLLER (may be different from owner).
  A player being affected: that PLAYER chooses.

  EXAMPLE: Card in your hand is discarded.
    You (the owner) choose the order of replacement effects.
  EXAMPLE: Your opponent casts a spell targeting your creature.
    You (the creature's controller) choose the replacement order.

COMPLETELY PREVENTED EVENTS:
  If a replacement effect prevents an event entirely (e.g., "can't happen"),
  that event does not occur. Other replacement effects that modify
  that event become inapplicable (no event to modify).

  EXAMPLE: Solemnity + Doubling Season
    Solemnity: "Counters can't be put on permanents" (not a replacement).
    Doubling Season: "If a counter would be placed, put two instead" (replacement).
    When a counter would be placed:
      Solemnity's "can't" applies → event is prevented entirely.
      Doubling Season's replacement: the event "counter being placed" never happens.
      Result: No counter is placed. Doubling Season has nothing to replace.

  EXAMPLE: Two "prevent all damage" effects vs. one damage source
    Spell deals 3 damage to you.
    Effect A: "Prevent all damage to you."
    Effect B: "Prevent 1 damage to you."
    You choose A. A applies. 3 damage prevented. Nothing left for B.
    (Or you could choose B: 2 damage gets through.)

REFLEXIVE TRIGGERS & NESTED EVENTS:
  If a replacement creates a NEW event, the replaced event triggers are NOT fired.
  The new event may fire its own triggers.

  EXAMPLE: Creature dies with death trigger.
    Replacement: "Instead of dying, exile it."
    Original event: "creature dies" — NEVER HAPPENS.
    Death trigger: does NOT fire (creature didn't die, it exited battlefield).
    Exile trigger (if any): FIRES (creature was exiled).

  EXAMPLE: Doubling Season + Chasm Skulker (nested events)
    Skulker enters with 1 counter (normal).
    Doubling Season: "If a counter would be placed on a permanent, place twice that many."
    Which applies first?
    Nested rule (616.1g): Doubling Season's replacement applies to the "place counter" event.
    Skulker entering is the CONTAINER event. Placing counters is CONTAINED within it.
    ANSWER: Check which replacement applies to the container (Skulker entering).
    Replacement to entering: control-changing, copy-changing, back-face orientation — none apply.
    So Doubling Season (which modifies a contained event within the counter placement)
    takes precedence.
    Skulker enters, Doubling Season applies to the counter placement,
    Skulker enters with 2 counters instead of 1.

STACKING REPLACEMENTS (CASCADING EFFECTS):
  Once a replacement applies, check what new situation exists.
  If another replacement is now applicable to the NEW situation, it applies next.

  EXAMPLE: Abundance + Sylvan Library
    Library: "Draw 2 additional cards. If you do, choose two cards and pay 4 life or return one to top."
    Abundance: "If you would draw a card, instead choose land or nonland and reveal from top."

    Your draw step: you draw normally, then Library triggers (draw 2 more).
    Each draw from Library: Abundance replaces it.
    You replace both Library draws with Abundance's effect (choosing land/nonland).
    Library's clause: "if you do [draw 2]" — you didn't actually draw (replaced).
    Result: Abundance draws applied, NO life payment, full filtering.

    Each Abundance replacement is applied separately to each draw event.
    (Abundance doesn't apply once to "both draws together" — it applies to each draw separately.)

SELF-REPLACEMENT EFFECTS (PRECEDENCE):
  If a spell/ability that's resolving has a self-replacement effect (like a Modal choice),
  it applies before other replacements to the same event.

  EXAMPLE: "Create a token, but instead, if X happened, do Y"
    The "instead" here is a self-replacement of the token creation.
    It applies before Doubling Season (which would modify token count).

  EXAMPLE: Malakir Rebirth (self-replacement)
    "When this creature dies, return it to the battlefield tapped under your control."
    This is a trigger. But Malakir REBIRTH (the Aura) is the card:
    "If enchanted creature would be put into a graveyard, return it instead."
    This is a REPLACEMENT (self-replacement of the enchanted creature's death).
    It applies before other death-replacement effects competing for the same creature.

MULTIPLE REPLACEMENT CHAINS:
  If applying Replacement A creates an opportunity for Replacement B,
  both are considered part of the same instance of the event.

  EXAMPLE: "Instead of going to the graveyard, exile it" + Leyline
    Event: Creature dies.
    Replacement A: "Instead of going to the graveyard, exile it."
    Replacement B (Leyline): "If it would go to graveyard, exile it instead."
    Both exile to the same location but B has specific conditions ("this way").
    Controller chooses which applies first.
    If A applies: creature goes to exile (not "by Leyline").
    If B applies: creature goes to exile (by Leyline, may trigger secondary effects).

THE ITERATION PROCESS:
  Step 1: Identify all applicable replacements.
  Step 2: If self-replacements exist, chooser must pick one.
  Step 3: Apply the chosen replacement.
  Step 4: NEW situation exists. Identify replacements applicable to the new situation.
  Step 5: If more apply, repeat from Step 2.
  Step 6: If none apply, event resolution is complete.

  EXAMPLE: Teferi's Protection + creature death + other graveyard-redirection
    Creature dies while Teferi's is active (phasing out) and a GY-exile effect active.
    Event: Creature would be put into graveyard.
    Applicable replacements:
      A. Teferi's Protection: phase out instead (not in graveyard, not exiled).
      B. GY-to-exile effect: exile instead.
    You control both effects (both on your permanents). You choose order.
    Choose A: Creature phases out. Now it's not in GY and not in exile.
    Are there other replacements for phasing? No.
    B's condition ("would go to graveyard") no longer applies (creature is phased out).
    Result: Creature is phased out.

    OR

    Choose B: Creature is exiled.
    Now it's in exile (not graveyard).
    Teferi's condition ("would be put into graveyard") no longer applies.
    Result: Creature is exiled.

PREVENTION EFFECTS ("CAN'T") VS. REPLACEMENTS:
  Replacements are "instead" effects. Prevention is "can't" effects.
  Prevention effects are NOT replacements (614.17).

  If something says "can't happen," it's absolute — nothing modifies it further (614.17c).
  Only self-replacement effects can modify a prevented event (614.17c).

  EXAMPLE: Grafdigger's Cage vs. Flashback
    Cage: "Players can't cast spells from graveyards or libraries."
    Flashback would cast from GY. Cage prevents it.
    No replacement can override a "can't" effect (except self-replacement).
    Casting is blocked absolutely.
```

## Definitive Conclusions

- **The affected object's controller chooses replacement order** (or its owner if the object has no controller, or the affected player if the replacement affects a player). This is NOT the active player necessarily.
- **Self-replacement effects take absolute precedence** (614.15) — if a spell/ability has its own "instead" clause, it applies before continuous replacement effects.
- **Nested events are handled container-first** (616.1g) — if one replacement applies to a parent event and another to a contained event, the parent applies first.
- **Completely prevented events cannot be modified by other replacements** — if a replacement prevents an event entirely, the prevented event is gone; other replacements looking for that event find nothing to modify.
- **Replacements iterate until none apply** (616.1f) — after each replacement is applied, the system checks again for applicable replacements to the NEW situation.
- **The replaced event never happens** — if a replacement prevents or replaces an event, triggers looking for that original event do not fire. Only the new event (if created) fires triggers.
- **Prevention ("can't") effects are not replacements** — a "can't happen" effect is absolute and overrides replacement effects, except for self-replacement effects (614.17c).
- **Multiple replacements to the same event apply in chosen order** — the order is chosen immediately as the event occurs, not ahead of time. The choice is made once per event instance.

## Canonical Examples

**Example 1 — Malakir Rebirth + Lich's Mastery Competing Replacements:**
Your creature dies while you control both Malakir Rebirth (aura: "if enchanted creature would be put into a graveyard, return it to the battlefield tapped instead") and Lich's Mastery ("if you would lose the game, instead shuffle your library into your hand and you gain 10 life").

Event: Creature dies (would go to graveyard).
Applicable replacements:
  A. Malakir Rebirth: return to battlefield instead.
  B. Lich's Mastery: if your death would be caused by this, prevent it instead.

Actually, these don't compete for the SAME event. Malakir prevents the creature from entering the graveyard. Lich's only applies if you would LOSE the game. These address different events.

**TRUE COMPETING EXAMPLE: Malakir Rebirth + Panharmonicon:**
(Panharmonicon: "If a creature enters the battlefield, trigger its ETB abilities twice.")
Your creature dies. Malakir Rebirth returns it to the battlefield.
Panharmonicon triggers on the "enters the battlefield" event.
These are NOT competing replacements — Malakir is a replacement (instead of GY, enter).
Panharmonicon's trigger fires on the entering. No competition.

**Example 2 — Solemnity + Doubling Season (Preventing Event):**
You control both Solemnity ("counters can't be put on permanents") and Doubling Season ("if a counter would be placed, put twice that many instead").

Event: A counter would be placed on a permanent.
Effect A (Solemnity): "can't be put" — prevention, not replacement.
Effect B (Doubling Season): replacement.

Solemnity's "can't" applies: counter placement is prevented entirely.
Doubling Season's replacement: the event "place a counter" never happens; nothing to double.
Result: No counter placed. Doubling Season is inapplicable (the event was prevented).

**Example 3 — Abundance + Draw Step (Player Chooses Order):**
You have Abundance ("if you would draw a card, choose land or nonland and reveal cards").
You also have an effect that says "if you would draw a card, instead draw two."

You draw during your draw step.
Event: You draw a card.
Applicable replacements:
  A. Abundance: replace with land/nonland reveal.
  B. Draw-two effect: replace with drawing two cards.

YOU (the affected player) choose the order.
Choose A: Abundance applies. You reveal until you find land/nonland, put it in hand.
Now: does B still apply? B says "if you would draw a card" — you didn't draw (A replaced it).
No further replacements apply. (OR, the two-draw effect could be considered inapplicable now.)

OR

Choose B: You draw two cards.
Now: does A apply to each? A replaces draws. You drew two cards, so A could modify those.
System repeats: are there replacements applicable to "you have drawn two cards"?
A is not applicable to that state (A replaces the DRAW, not the "having drawn" state).
Result: You draw two cards.

**Example 4 — Madness + Leyline of the Void (CR 616.1 with player choice):**
(Covered in P410, but including here for completeness.)
You discard a card with madness while Leyline of the Void is on the battlefield.
Event: Card discarded.
Applicable replacements:
  A. Madness: exile instead (and allow casting "exiled this way").
  B. Leyline: exile instead (no "this way" casting).

YOU (the owner of the card) choose the order.
Choose A: Card exiled by madness. Madness trigger fires. Leyline no longer applies (card already in exile).
Result: Madness works.

**Example 5 — Teferi's Protection + Multiple Death Replacements:**
Your creature dies while you control Teferi's Protection ("permanents phase out") and another effect like Malakir Rebirth ("return to battlefield instead").

Event: Creature would be put into graveyard.
Applicable replacements:
  A. Teferi's: phase out instead.
  B. Malakir Rebirth: return to battlefield instead.

YOU (the creature's controller) choose.
Choose A: Creature phases out. Malakir's condition ("put into graveyard") is no longer satisfied.
Result: Creature is phased out.

Choose B: Creature returns to battlefield. Teferi's condition ("put into graveyard") is no longer satisfied.
Result: Creature is on the battlefield.

**Example 6 — Doubling Season + Token Creation (Nested Event, 616.1g):**
You cast a spell: "Create 2 tokens" while you control Doubling Season.

Event: 2 tokens would be created.
Applicable replacements:
  A. Doubling Season: "if a token would be created, create two instead."

Doubling Season applies to the token-creation sub-event.
The parent event is "spell resolves and creates tokens."
The contained event is "token creation."
616.1g: the parent-event replacement applies first if it exists. No parent replacement applies here.
Doubling Season applies to the contained event: instead of 1 token, create 2 per original token.
Result: 4 tokens (2 originals are doubled to 4 total).

**Example 7 — Three Competing Replacements (Cascading):**
A permanent dies while Leyline of the Void, Cage of Hands ("return instead"), and Malakir Rebirth are all on the battlefield.

Event: Permanent put into graveyard.
Applicable replacements:
  A. Leyline: exile instead.
  B. Cage of Hands: return to hand instead.
  C. Malakir: return to battlefield instead.

YOU choose one.
Choose A: Permanent exiled. B & C no longer apply (permanent not going to graveyard).

The process does not repeat for B and C — they were inapplicable after A applied because the condition "put into graveyard" was replaced.

**Example 8 — Reflexive Trigger (Replaced Event Does NOT Fire):**
Your creature with "when this creature dies, draw a card" dies.
You control an effect: "if a creature would die, exile it instead."

Event: Creature dies.
Applicable replacement: exile instead.
Replacement applies: creature is exiled, never reaches graveyard.
Original event ("creature dies"): NEVER HAPPENED.
Death trigger: does NOT fire (creature didn't die; it exited the battlefield via replacement).
Result: No draw.

**Example 9 — Abundance + Sylvan Library (Replacement Bypasses Clauses):**
Sylvan Library: "Draw 2 additional cards. If you do, choose two and pay 4 life or return one to top."
Abundance: "If you would draw a card, choose land or nonland and reveal."

Your turn: you draw (Library triggered). Library says "draw 2 more."
Event: Draw 2 cards (from Library).
Applicable replacement: Abundance (applies to each draw).
You choose Abundance order (or the Library's draw applies — depends on timing, but Library's trigger is a resolved spell, so the 2 draws are part of Library's resolution).

Actually, Abundance and Library interact per P002 (replacement effects): Library says "draw 2. If you do, X." If Abundance replaces the draws, you don't "do" the draw (didn't draw), so the clause X doesn't apply.

Library draws 2: Abundance replaces each (or you choose whether to apply Abundance).
If Abundance applies to both: you didn't draw 2 cards (replaced by reveals).
Library's clause: "if you do [draw 2]" — you didn't. No life payment, no choice.
Result: Two reveals via Abundance, no life payment.

**Example 10 — Platinum Angel + Another "If You Would Lose" Effect:**
You would lose the game (deck empty, or other) while controlling both Platinum Angel ("you can't lose the game") and another effect like Lich's Mastery ("instead shuffle your library into hand and gain 10 life").

Event: You would lose the game.
Applicable replacements:
  A. Platinum Angel: you can't lose (not a replacement per se, but a prevention).
  B. Lich's Mastery: replacement.

These actually don't conflict in normal terms — Platinum Angel's "can't lose" is a continuous effect that prevents the loss outright. Lich's replacement wouldn't apply because there's no loss event to replace.

But if BOTH effects are triggered (neither prevents the loss on their own), then:
A applies first if chosen: loss prevented. B is inapplicable.
OR both apply: whichever is considered the "first" prevents loss.

**Example 11 — Draw Replacement Chain (Omniscience + Abundance):**
You have Omniscience on the battlefield (cast spells for free from exile) and Abundance.
You draw a card while Omniscience is active.

Event: Draw a card.
Applicable replacement: Abundance (exile instead, reveal for land/nonland).
Other effect: Omniscience doesn't replace draws; it allows casting from exile.

Abundance applies: you don't draw; you reveal and put a land/nonland in hand.
Result: Omniscience doesn't interact here (draw was replaced before it happens).

**Example 12 — Self-Replacement Effect Precedence (Clone vs. Vesuva):**
A creature is entering the battlefield.
Vesuva (self-replacement): "As Vesuva enters, it becomes a copy of target land."
Leyline of Singularity (external replacement): "If a permanent would enter, if another with the same name is on the battlefield, create a token instead."

Event: Vesuva enters.
Self-replacement (Vesuva's copy): applies first (616.1a).
Vesuva becomes a copy of the chosen land.
Now, is Leyline applicable? Yes, potentially, but Vesuva's self-replacement already applied.
Does Leyline apply to the "now it's a copy of land X" state, or to the entering itself?
Leyline applies to entering — it's already been replaced (it's now entering as a land copy).
Leyline would check: if another land with that name is on battlefield, token instead.
If so, now Leyline applies, and Vesuva would become a token copy instead.
Result depends on board state and which land Vesuva is copying.

## Commonly Confused With

- **P002 (Replacement vs. Trigger)** — P002 establishes that replacements modify events before they happen. P545 focuses on MULTIPLE replacements applying to the SAME event and the ordering rules.
- **P410 (GY Hate vs. Zone Mechanics)** — P410 covers specific graveyard-exile replacements and their interaction with mechanics like madness and flashback. P545 is the generalized framework (CR 616.1) for ANY multiple replacements.
- **P004 (Layer Dependency)** — Layers determine the order of continuous effects. P545 is about replacement effects (which are NOT continuous in the same sense) applied to a single event instance.
- **P006 (Intervening If Clause)** — Triggered abilities have conditions; replacement effects don't. P545 is about multiple replacements, not about intervening conditions.

## Sources & Judge Rulings

- [Interaction of Replacement and/or Prevention Effects — MTG Wiki](https://mtg.fandom.com/wiki/Interaction_of_replacement_and/or_prevention_effects)
- [CR 616 Comprehensive Rules](https://ancestral.vision/spells-abilities-and-effects/interaction-of-replacement-andor-prevention-effects.html)
- [Solemnity and Doubling Season Interaction (MTG Salvation Forums)](https://www.mtgsalvation.com/forums/magic-fundamentals/magic-rulings/783633-solemnity-and-doubling-season)
- [Abundance Rulings — MTG Assist](https://www.mtgassist.com/cards/Tenth-Edition/Abundance/rulings/)
- [Madness vs. Leyline of the Void — P410 canonical example](../p410-replacement-effect-ordering-gy-hate-vs-zone-mechanics.md)
