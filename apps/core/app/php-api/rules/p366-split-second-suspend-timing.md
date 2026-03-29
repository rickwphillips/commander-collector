---
id: p366
name: Split Second and Suspend — Timing Exceptions, Can't-Respond Windows, and Delayed Casting
category: stack
cr_refs: [702.61a, 702.61b, 702.61c, 702.62a, 702.62b, 702.62c, 702.62d]
tags: [split-second, suspend, time-counter, cant-respond, cant-cast-in-response, mana-ability-exception, triggered-abilities-still-trigger, haste-from-suspend, Sudden-Death, Krosan-Grip, Ancestral-Vision, Lotus-Bloom, Living-End, cascade-suspend, special-action, no-stack-suspend]
created: 2026-03-29
examples_count: 2
---

# P366 — Split Second and Suspend — Timing Exceptions, Can't-Respond Windows, and Delayed Casting

## Abstract
**Split second** (702.61a) locks down the stack: while the spell is on the stack, players can't cast other spells or activate non-mana abilities. It creates a near-uncounterable window — but triggered abilities still trigger normally (they're not cast or activated), and mana abilities still work (special exception from 702.61b). **Suspend** (702.62a) is three abilities in one keyword: a static ability (pay suspend cost → exile with N time counters; this action doesn't use the stack), a triggered ability (each upkeep: remove one time counter), and a triggered ability (last counter removed → you may cast it without paying its mana cost; creature spells cast this way gain haste). A suspended card is NOT on the battlefield or on the stack during its wait period — it's in exile. When the final counter is removed and the spell goes on the stack, opponents CAN respond normally. The two keywords interact importantly: a suspended storm spell counts other spells cast that turn when it goes on the stack.

## The Definitive Rules

**CR 702.61a** (verbatim): *"Split second is a static ability that functions only while the spell with split second is on the stack. 'Split second' means 'As long as this spell is on the stack, players can't cast other spells or activate abilities that aren't mana abilities.'"*

**CR 702.61b** (verbatim): *"Players may activate mana abilities and take special actions while a spell with split second is on the stack. Triggered abilities trigger and are put on the stack as normal while a spell with split second is on the stack."*

**CR 702.62a** (verbatim): *"Suspend is a keyword that represents three abilities. The first is a static ability that functions while the card with suspend is in a player's hand. The second and third are triggered abilities that function in the exile zone. 'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able. If you don't, it remains exiled. If you cast a creature spell this way, it gains haste until you lose control of the spell or the permanent it becomes.'"*

**CR 702.62b** (verbatim): *"A card is 'suspended' if it's in the exile zone, has suspend, and has a time counter on it."*

## The Pattern

```
SPLIT SECOND (702.61a):
  WHAT IT DOES:
    While the split second spell is on the stack:
      Players CANNOT: cast other spells, activate non-mana abilities.
      Players CAN:
        Activate MANA ABILITIES (702.61b: explicit exception).
        Take special actions (morph, cycling — but cycling has an activated ability...
          wait: cycling is an activated ability. Can you cycle during split second?
          Cycling is "activated ability that functions in hand." Split second: "can't activate abilities."
          Cycling is NOT a mana ability. THEREFORE: you CANNOT cycle during split second.
          BUT: special actions (702.61b) are allowed:
            - Turn a face-down creature face-up (morph): YES (special action, not ability activation).
            - Play a land: YES (special action).
            - Suspend a card from hand: actually this IS a special action → YES.
        Triggered abilities STILL TRIGGER and go on the stack (702.61b):
          If split second spell kills a creature: "dies" triggers fire and go on the stack.
          If a player's upkeep triggers fire during the resolution window: they go on the stack.
          Triggered abilities don't "activate" — they trigger automatically.
          They go on the stack on top of the split second spell.
          This is crucial: even though you can't CAST or ACTIVATE, triggers still happen.
  CANNOT BE COUNTERED (practical effect):
    Counterspell: "Counter target spell." Casting Counterspell is casting a spell.
    While split second is on the stack: you CAN'T cast Counterspell.
    So split second spells are PRACTICALLY uncounterable.
    Exception: if a triggered ability says "counter target spell" (like some storm effects),
      that trigger could fire and counter it. But most counterspells are instants (cast = blocked).
    Stifle: "Counter target activated or triggered ability." Stifle is an INSTANT.
      Casting Stifle = casting a spell. BLOCKED by split second.
      Can't Stifle triggered abilities that fire during split second.
  RESPONDING TO SPLIT SECOND:
    When a player casts a split second spell:
      It goes on the stack.
      At this point (just before it's put on the stack, when it's being cast):
        Other players had the opportunity to respond to the ANNOUNCEMENT...
        Wait: no. Split second locks things down AS LONG AS it's on the stack.
        At the moment you cast it: you had priority, you cast it. Spell goes on stack.
        Now split second locks. No one can respond by casting other spells or activating.
        So effectively: the spell resolves without counterplay (except triggered abilities).
  EXAMPLES:
    Krosan Grip ({2}{G}): "Split second. Destroy target artifact or enchantment."
      Destroying a Pithing Needle or key Equipment: uncounterable.
      Opponent can't cast Counterspell. Can't activate Pithing Needle's ability (if still present).
      BUT: if they have a triggered ability that fires when enchantment is targeted: it still triggers.
    Sudden Death ({1}{B}): "Split second. Target creature gets -4/-4 until end of turn."
      Opponent can't regenerate their creature (regenerate is an activated ability — BLOCKED).
      Opponent can't Giant Growth their creature in response (casting a spell — BLOCKED).
      Opponent CAN: take advantage of triggered abilities if any fire.
    Wipe Away ({2}{U}): "Split second. Return target permanent to its owner's hand."
      Practically: can't be countered. No instants, no activations.
  SPLIT SECOND ON THE STACK WHILE ANOTHER SPELL IS ON THE STACK:
    If there are two spells on the stack and the top one has split second:
      Players can't cast or activate (to respond to the split second spell).
      But once the split second spell resolves (and leaves the stack):
        The restriction ends. Normal priority resumes.
        Players can respond to the remaining spell normally.

SUSPEND (702.62a):
  THE THREE ABILITIES:
    1. STATIC ABILITY (in hand): "You may exile this with N time counters as a special action."
       Cost: [suspend cost]. This is NOT casting. NOT on the stack. Special action.
       Requirements: "if you could begin to cast this card" — checks for restrictions.
         If sorcery: can only begin to cast during your main phase, stack empty.
         So suspend a sorcery: only during your main phase with empty stack.
         If instant: could cast it anytime → can suspend it anytime you have priority.
    2. TRIGGERED ABILITY (in exile): "At the beginning of your upkeep, if suspended: remove a time counter."
       This is YOUR upkeep. Not opponents'. Only your upkeep matters.
       "If suspended" = intervening "if" clause. Checks at trigger time AND resolution.
         (Though this is basically always true while it's suspended — just needs the counters.)
    3. TRIGGERED ABILITY (in exile): "When last time counter is removed: may cast it free."
       "You may play it without paying its mana cost if able."
       "If you don't, it remains exiled." — You can choose NOT to cast it. It stays exiled.
       IMPORTANT: this IS a casting event. The spell goes on the stack. Opponents CAN respond.
       Creature spells gain haste until you lose control or it ceases to be that permanent.
  SUSPEND AND CASCADE:
    Suspend cards have mana value 0 (many have no mana cost, like Ancestral Vision):
      Ancestral Vision: no mana cost → MV 0.
      A cascade spell finding MV < 3: would find Ancestral Vision (MV 0 < 3).
      When cascading into a suspended card: you cast it immediately (without paying mana cost).
      BUT: suspend cards like Ancestral Vision can be "cast" because you cast them from cascade.
      They just resolve immediately (Ancestral Vision draws 3).
    Suspended cards cast from cascade don't actually "suspend" — they're cast on the spot.
  SUSPEND AND STORM:
    When the last time counter is removed and you cast the suspended storm spell:
      That's a casting event — storm triggers. Storm count = spells cast this turn before it.
      Including any you cast earlier THIS turn before the suspend triggered.
    If you cast 3 spells before the suspend trigger resolved: storm count is 3 when the storm spell fires.
  SUSPEND AND "CAN'T CAST":
    702.62c: While determining if you could begin to cast the card with suspend, consider
      any effects that prohibiting casting.
    If you can't begin to cast the card from hand (e.g., rule says "can't play cards from exile"):
      You can't suspend it either (the static ability checks "if you could begin to cast this").
    But CASTING from suspend happens when the last counter is removed —
      That ability says "you may play it without paying its mana cost if able."
      "If able" — if there's a restriction preventing casting, the ability still triggers,
        but you're unable to cast it. It remains exiled (702.62a: "if you don't, it remains exiled").
  SUSPEND INTERACTIONS:
    Proliferate: can add time counters to suspended cards → DELAY their release.
    Clock of Omens + untap combos: can also add time counters (rare, but possible).
    Jhoira of the Ghitu ({2}{U}{R}): "{2}: Exile target nonland card from your hand. Put four time
      counters on it. If it doesn't have suspend, it gains suspend." — puts any card into exile
      with suspend. Allows casting powerful spells for {2} mana (waiting 4 turns).
    Teferi's Ageless Insight / time counter manipulation: many cards interact with time counters.
    REMOVING MULTIPLE COUNTERS AT ONCE:
      If an effect removes multiple time counters at once from a suspended card:
        If the last time counter is removed: the third suspend ability triggers.
        "When the last time counter is removed" — fires when the card goes from any number
          of counters > 0 to 0 counters.
        Doesn't matter if you removed 1 or 5 at once; what matters is the transition to 0.
```

## Definitive Conclusions

- **Split second locks out spell-casting and non-mana ability activations** — while it's on the stack, you can't counter it with Counterspell, you can't regenerate creatures, you can't activate abilities; the window is essentially uncounterable.
- **Triggered abilities still fire during split second** — if a creature dies to the split second effect, "dies" triggers still go on the stack; triggered abilities are not cast or activated.
- **Mana abilities still work during split second** — the explicit exception in 702.61b; tapping lands for mana is fine.
- **Suspending a card is a special action, not a cast** — no priority required, doesn't use the stack; happens at any time you have priority (subject to the "could you begin to cast" restriction).
- **When a suspended spell goes on the stack, opponents CAN respond** — the spell is cast normally at that point; split second and suspend are separate keywords; the "uncounterable" aspect of suspend is just that it wasn't cast from hand (so no response window during suspension), but once on the stack via the triggered ability, it's a normal spell.
- **Creature spells cast from suspend gain haste** — they can attack immediately; this is a unique bonus for suspend's casting.
- **Cascade can find zero-MV suspend cards** — Ancestral Vision (MV 0) is a valid cascade target; when found, it's cast and resolves immediately (no suspension in cascade context).

## Canonical Example
**Krosan Grip vs. Pithing Needle:**
Opponent controls Pithing Needle naming "Arid Mesa" (blocking you from cracking your fetchland).
You need to destroy the Needle.
You cast Krosan Grip ({2}{G}): "Split second. Destroy target artifact or enchantment."
Targeting Pithing Needle.

Krosan Grip goes on the stack. Split second fires as a static ability.
Opponent attempts to respond:
  "In response, I'll activate...": NO. Split second says can't activate non-mana abilities.
  "In response, I'll cast...": NO. Split second says can't cast spells.
  Opponent cannot protect the Pithing Needle in any way.

Krosan Grip resolves. Pithing Needle is destroyed.
Opponent's Needle is gone. No interaction possible.

Compare with regular Naturalize ({1}{G}):
  Opponent sees it coming. Can cast Counterspell in response.
  Can activate abilities in response (maybe activating the Needle before it dies, if useful).
  Can try to redirect priority.
Krosan Grip: none of that is possible.

Note: if Needle had a triggered ability on destruction (it doesn't, but hypothetically):
  That would still trigger even during split second (702.61b: triggered abilities trigger normally).

**Example 2 — Lotus Bloom Suspend:**
Lotus Bloom: Suspend 3—{0}. "{T}, Sacrifice Lotus Bloom: Add {C}{C}{C}."
Turn 1: Pay {0} (the suspend cost), exile Lotus Bloom with 3 time counters. Special action. No stack.
Turn 2 (your upkeep): "At beginning of your upkeep, if suspended: remove a time counter."
  Lotus Bloom had 3 time counters → now 2.
Turn 3 (your upkeep): Remove another. Now 1 time counter.
Turn 4 (your upkeep): Remove the last time counter.
  Last time counter removed: trigger fires! "You may cast this card without paying its mana cost."
  Trigger goes on the stack. You can respond to this trigger.
  (Opponents can also respond — they can counter the TRIGGER itself, or wait for the spell.)
  Trigger resolves. You cast Lotus Bloom from exile. Opponents CAN RESPOND NOW.
    This is a normal casting event. Opponent can Counterspell Lotus Bloom at this point.
  If not countered: Lotus Bloom enters the battlefield. No summoning sickness (it's not a creature).
    Immediately: "{T}, Sacrifice Lotus Bloom: Add {C}{C}{C}." 3 colorless mana.
Note: Lotus Bloom is NOT a creature, so it does NOT gain haste from suspend (haste only for creatures).

This is why Affinity/Azorius Aura decks once ran Lotus Bloom in Modern:
  On turn 4, Lotus Bloom generates {C}{C}{C} without casting it for its actual cost (which is {0}).
  Effectively: spend nothing turn 1 → gain 3 mana turn 4. Free burst of mana after waiting.

## Commonly Confused With
- **P007 (Response Windows)** — Split second specifically closes the response window (can't cast or activate). P007 covers when response windows exist; P366 covers this specific mechanic that eliminates it.
- **P364 (Mana Abilities)** — Split second doesn't stop mana abilities (702.61b explicit exception). Mana abilities bypass the stack (605.3b). The interaction: even during split second, you can tap lands for mana — just can't use that mana to cast a counterspell.
- **P362 (Storm/Cascade)** — Suspended storm spells care about storm count when cast from suspend. Cascade can find zero-MV suspend cards. Both mechanics interact with when spells are "cast" — which suspend triggers as a genuine cast event.
- **P002 (Replacement Effects)** — Suspend's first ability (exiling the card) is a special action, not a replacement effect. But if an effect says "if you would draw a card, instead..." and a suspend trigger resolves: draw replacement effects can apply to draws that result from spell effects of suspended spells.
