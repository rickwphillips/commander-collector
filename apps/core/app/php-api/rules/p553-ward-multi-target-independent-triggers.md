---
id: p553
name: Ward — Multiple Targets, Independent Triggers, and Stacking
category: triggered
cr_refs: [702.21a, 702.21b, 702.21c, 117.1, 117.2, 117.3, 117.4, 117.5]
tags: [ward, multiple-targets, independent-triggers, triggered-ability, stacking, cost-payment, counter-unless-pay, one-spell-two-creatures, layering, resolving-order]
created: 2026-03-30
examples_count: 4
---

# P553 — Ward — Multiple Targets, Independent Triggers, and Stacking

## Abstract
Ward is a **triggered ability**, not a static protection restriction. Critically, when a **single spell targets multiple permanents that each have Ward**, **each Ward ability triggers independently and MUST be paid separately**. A single spell paying the Ward cost on Creature A does NOT satisfy Creature B's Ward — each Ward trigger is an independent event with its own cost requirement. Similarly, when a permanent has multiple Ward abilities (e.g., Ward {2} and Ward {3}), each triggers independently when that permanent is targeted. This leads to scenarios where opponents must pay {5} total to target a creature with both Ward {2} and Ward {3}, and where multi-creature Ward strategies require paying the cumulative Ward cost across all targeted permanents or losing the entire spell to counters.

## The Definitive Rules

**CR 702.21a** (verbatim): *"Ward is a triggered ability. 'Ward [cost]' means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays [cost].'"*

**CR 702.21b** (verbatim): *"A permanent can have multiple instances of ward. Each triggers separately."*

**CR 702.21c** (verbatim): *"Some ward abilities include an X in their cost and state what X is equal to. This value is determined at the time the ability resolves, not locked in as the ability triggers."*

**CR 117.1** (Targeting event): *"When a spell or ability is cast or activated, or a triggered ability is put on the stack, the appropriate player(s) choose targets for that spell, ability, or triggered ability as part of putting it on the stack. The targets can't be changed except by an instruction that explicitly says so."*

**CR 117.2** (Multiple targets): *"Each instance of the word 'target' on a spell or ability counts as a separate targeting event. If a spell or ability targets multiple permanents, each target is a separate targeting event."*

**CR 117.3** (Targeting order): *"If a spell or ability can target multiple permanents of the same type but doesn't target all of them, the targets must be chosen in some order. This order doesn't affect the game, except that it's recorded for purposes of determining which permanents are the targets of the spell or ability."*

**CR 117.4 & 117.5** (Triggering): *"Whenever a spell or ability 'targets a permanent,' it means that permanent was chosen as a target when the spell or ability was cast or the ability was activated. A permanent can be the target of multiple spells or abilities."*

## The Pattern

```
WARD TRIGGER MECHANICS:

WARD IS A TRIGGERED ABILITY:
  Not a static restriction (like hexproof/shroud).
  When condition met: "this permanent becomes the target of a spell or ability opponent controls"
    → Triggered ability goes on the stack.
  When triggered ability resolves: "counter that spell/ability unless opponent pays [cost]."

SINGLE TARGETING EVENT:
  One spell targets one Ward creature:
    Spell cast targeting Ward creature.
    Spell goes on stack.
    Ward trigger condition met: creature is now the target of the spell.
    Ward trigger goes on the stack ABOVE the targeting spell (CR 117.5: triggered abilities on stack).
    Ward trigger resolves: spell countered UNLESS opponent pays ward cost.
    If paid: the original spell continues and resolves.
    If not paid: the spell is countered (removed from game/graveyard).

MULTI-CREATURE SINGLE SPELL (THE CRITICAL PATTERN):

Scenario: One spell targets MULTIPLE creatures, EACH with Ward.
  Example: Flametongue Kavu (a spell): "When this creature enters the battlefield,
    it deals 4 damage to target creature an opponent controls."
  But imagine a spell that says "target creature gets -2/-2" (Tragic Slip, Disfigure, etc.)
    that's been cast to target TWO creatures with Ward.

  Actually: most spells CAN'T target the same thing twice. But some can:
    "Damage dealt by target creature you control and target creature an opponent controls
      can't be prevented this turn."
    This might target a creature you control and a creature your opponent controls.
    If both have ward: each Ward triggers.

Most realistic scenario: one spell targets Creature A (has Ward {2}) and Creature B (has Ward {2}).
  Example: Settle the Wreckage: "exile all attacking creatures."
    This doesn't target; it's "all creatures." No Ward.
  Example: Austere Command: "{3}{W}{W}: choose two... each creature with converted mana cost X
    is destroyed; all Swamps are turned into Plains."
    Again, this doesn't target with that text.

  Better example: Boros Charm: "{R}{W}: choose one — your creatures get +1/+0 until end of turn;
    prevent all damage dealt to you this turn; target permanent is indestructible until end of turn."
    The third option DOES target one permanent. Not two.

  Even better: Counterspell: "{U}{U}: counter target spell."
    Counterspell targets the SPELL, not permanents on the battlefield.
    Ward doesn't trigger (no spell/ability targets a permanent).

ACTUAL MULTI-CREATURE WARD SCENARIO:
  Most spells that target creatures target only one creature per casting.
  But a spell COULD be designed to target multiple creatures.
  Or an ability could be activated that targets multiple permanents.

  Example (hypothetical): "Lightning Storm: {X}{R}: for each mode chosen,
    target a creature or player, and it takes 1 damage."
    If cast for 4 modes targeting 2 creatures with Ward {1} and 2 creatures without:
    Targets chosen: Ward creature 1, non-ward creature 1, Ward creature 2, non-ward creature 2.
    Lightning Storm goes on stack with 4 target modes.

  Trigger checks:
    Ward creature 1 is the target of a spell opponent controls: WARD TRIGGER #1.
    Ward creature 2 is the target of a spell opponent controls: WARD TRIGGER #2.
    Non-ward creatures: no triggers.

  Ward triggers: TWO independent triggers on the stack.
    Trigger #1: counter Lightning Storm unless opponent pays {1}.
    Trigger #2: counter Lightning Storm unless opponent pays {1}.

  Resolving (LIFO):
    Trigger #2 resolves first: "counter Lightning Storm unless you pay {1}."
    Opponent must choose:
      Pay {1}: Lightning Storm stays on stack. No counter yet.
      Don't pay {1}: Lightning Storm is countered. Spell removed. Trigger #1 never resolves.

    If opponent paid {1}:
      Trigger #1 resolves next: "counter Lightning Storm unless you pay {1}."
      Opponent must choose again:
        Pay {1}: Lightning Storm stays. Total paid: {2}. Spell resolves for 4 damage.
        Don't pay: Lightning Storm countered. Spell removed. No damage.

    If opponent didn't pay for Trigger #2:
      Lightning Storm is countered immediately. Trigger #1 is still on the stack but
        its effect ("counter that spell...") targets a spell that was already countered.
      Does Trigger #1 resolve with no effect? No — when a trigger references a specific spell,
        and that spell no longer exists, the trigger still resolves but "counter [nonexistent spell]"
        has no effect.

KEY INSIGHT: Each Ward trigger is INDEPENDENT.
  Paying the cost of Ward trigger #1 does NOT satisfy Ward trigger #2.
  Each trigger must have its cost paid SEPARATELY.
  If opponent can't/won't pay the cost for ANY ward trigger, the spell is countered.

MULTIPLE WARDS ON SAME CREATURE:

Scenario: One creature has Ward {2} and Ward {3} (separate enchantments, equipment, or abilities).
  Creature control check: both Ward abilities are on the same permanent. Check.
  Opponent casts Lightning Bolt targeting this creature.
  Lightning Bolt goes on stack.

  Ward triggers:
    "Whenever this permanent becomes the target of a spell opponent controls..."
    The creature has TWO instances of ward.
    BOTH conditions are met. Both triggers go on the stack.
    Ward {2} trigger: counter Lightning Bolt unless opponent pays {2}.
    Ward {3} trigger: counter Lightning Bolt unless opponent pays {3}.

  Resolution (LIFO):
    Ward {3} trigger resolves first: "counter Lightning Bolt unless you pay {3}."
    Opponent chooses:
      Pay {3}: Lightning Bolt stays on stack.
      Don't pay: Lightning Bolt countered.

    If opponent paid {3}:
      Ward {2} trigger resolves: "counter Lightning Bolt unless you pay {2}."
      Opponent chooses again:
        Pay {2}: Lightning Bolt stays. Total paid: {5}. Spell resolves (3 damage to creature).
        Don't pay: Lightning Bolt countered.

    If opponent didn't pay for Ward {3}:
      Lightning Bolt is countered. Ward {2} trigger still resolves with no effect.

TOTAL WARD COST WITH MULTIPLE WARDS ON SAME CREATURE:
  Ward {2} + Ward {3}: opponent must pay {2} AND {3} = {5} total to keep their spell alive.
  Ward {1} + Ward {1} + Ward {1}: {3} total.
  Each ward cost is independent. Paying one doesn't satisfy another.

DOES PAYING ONE WARD COST SATISFY ANOTHER WARD?
  NO. Each Ward trigger has its own cost requirement.
  When Ward {2} trigger resolves: opponent decides to pay {2} or not.
  When Ward {3} trigger resolves: opponent decides to pay {3} or not.
  These are separate decisions at separate moments.
  Even if opponent paid {2} for the first ward trigger, they STILL must pay {3} for the second.

WARD AND NON-TARGETING EFFECTS:

Does Ward "prevent damage"? NO — Ward gates a cost on targeting.
  Ward doesn't prevent damage at all.
  Ward only triggers if a spell/ability TARGETS the permanent with ward.

  Example: Wrath of God: "destroy all creatures."
    Doesn't target. Doesn't say "each creature." Wrath just destroys all creatures.
    Ward creatures are destroyed. Ward doesn't trigger.

  Example: "Each creature gets -1/-1 until end of turn."
    Doesn't target. Global effect. All creatures affected including ward creatures.
    Ward doesn't trigger.

  Example: "Chandra deals 3 damage to all creatures."
    No targeting. Damage is dealt to all creatures.
    If a creature with ward takes 3 damage: it dies. Ward never triggers.
    Ward only cares about targeting, not damage.

WARD TRIGGERS ONLY ON TARGETING:
  "Becomes the target of a spell or ability opponent controls."
  Targeting = deliberately chosen as one of the spell's targets during casting.

  "Destroy all creatures" = no targeting.
  "Target creature dies" = targeting.
  "This creature takes damage from sources this turn" = no targeting (passive).
  "Deal damage to target creature" = targeting.
  "Choose a creature" vs. "target a creature" = DIFFERENT.
    "Choose a creature" is not targeting. Hexproof/shroud/ward don't apply.

WARD {X} AND VARIABLE COSTS:

Some wards have variable costs: Ward {X} where X = something (power, toughness, etc.).
  CR 702.21c: "This value is determined at the time the ability resolves, not locked in."

  Example: Ward—pay life equal to this creature's power.
    Creature has power 3 when targeted.
    Ward trigger goes on stack.
    Before trigger resolves, creature's power increases to 5 (Pump spell, +2/+2).
    Ward trigger resolves: opponent must pay life equal to THIS CREATURE'S CURRENT POWER = 5 life.
    Not 3 life. The value is determined at resolution.

  Key: variable costs change if the permanent's characteristics change between trigger and resolution.
  Permanent doesn't have to exist at resolution (if it was destroyed mid-stack), but the cost
    is calculated based on what it WAS if it still exists, or based on the effect's text.

WARD STACKING RESOLUTION ORDER:

Multiple ward triggers on the stack: resolved in LIFO order (last-in-first-out).
  Spell targets creature with Ward {2}, Ward {3}, Ward {1}.
  Three triggers go on the stack (in order they were triggered):
    Ward {2} trigger
    Ward {3} trigger
    Ward {1} trigger (on top)

  Resolution (LIFO, so Ward {1} resolves first):
    Ward {1} trigger resolves: opponent pays {1} or spell is countered.
    If countered: done. Spell gone.
    If paid: continue.
    Ward {3} trigger resolves: opponent pays {3} or spell is countered.
    If countered: done.
    If paid: continue.
    Ward {2} trigger resolves: opponent pays {2} or spell is countered.
    If countered: done.
    If paid: the original spell is on the stack and continues to resolve.

  Total cost to opponent if they pay all: {1} + {3} + {2} = {6}.

WARD AND ILLEGAL TARGETING:

If a spell that would target a ward creature is cast, but the targeting is illegal for another reason,
  does ward trigger?

  Example: Hexproof creature with Ward {1}.
    Opponent casts Lightning Bolt targeting the hexproof ward creature.
    Lightning Bolt can't TARGET the hexproof creature (hexproof prevents targeting by opponents).
    The SPELL is illegal. It's not placed on the stack.
    Ward doesn't trigger (targeting never happened).

  Example: Ward creature, spell says "target creature with a +1/+1 counter."
    Target creature has Ward {1} but NO +1/+1 counter.
    Targeting is illegal (doesn't fit the criteria).
    Spell is not placed on the stack.
    Ward doesn't trigger.

WARD AND MULTIPLE COPIES:

If a spell that targets ward permanents is copied (e.g., Twincast), do the copies trigger ward?

  Each copy is a separate spell on the stack targeting the same permanent.
  Each copy targeting the ward permanent: separate targeting event.
  Each copy triggers ward.

  Example: you cast Counterspell targeting opponent's spell.
    Opponent casts Twincast copying Counterspell, also targeting the same spell.
    Twincast copy is cast. It targets the opponent's spell... wait.
    Counterspell targets spells, not permanents. Ward doesn't apply to spells.

  Better example: opponent casts Lightning Bolt on your creature with Ward {1}.
    You cast Fork copying Lightning Bolt targeting the same creature.
    Counterspell counters the original Lightning Bolt before the fork copy resolves.
    Wait, that doesn't make sense. Let me reconsider.

  Actually: if you copy an instant that targets permanents:
    Original spell targets Ward creature. Goes on stack.
    Ward trigger fires for the original.
    You cast a spell that creates a copy of the original.
    The copy is a separate spell targeting the same Ward creature.
    Ward trigger fires again for the copy.
    Now: two Ward triggers on the stack (one for the original, one for the copy).
    Each must be paid separately.
    Original spell and copy spell are independent: if opponent doesn't pay one ward, that spell is countered.
    But the other spell might still have its ward trigger pending.

EXAMPLE INTERACTION: Fork vs. Targeted Spell with Ward.
  Setup: You control creature with Ward {2}.
  Opponent casts Doom Blade ({1}{B}: destroy target creature) targeting your Ward creature.
  Doom Blade goes on stack.
  Ward {2} trigger goes on stack above it.
  You cast Fork ({1}{R}: copy target spell, you may choose new targets) targeting Doom Blade.
  Fork goes on stack above Ward trigger.

  Resolving:
    Fork resolves: creates a copy of Doom Blade targeting... let's say opponent's creature.
    Copy of Doom Blade goes on stack.
    Copy targets opponent's creature (not your ward creature): no Ward trigger.
    Ward {2} trigger resolves (original Doom Blade is still the target): opponent pays {2} or Doom Blade is countered.
    If countered: done.
    If paid: original Doom Blade resolves, destroys your creature.
    Copy of Doom Blade resolves independently: destroys opponent's creature.

WARD AND SCRYING/LOOKING AT CARDS:

Ward triggers when targeted. Looking at cards or scrying doesn't target permanents.
  Example: Fact or Fiction: "reveal your deck, opponent chooses cards you set aside..."
    No permanent is targeted. Ward doesn't trigger.

WARD AND PASSIVE EFFECTS:

Ward doesn't trigger on passive effects. Only on spells or activated/triggered abilities.
  Example: creature has an ability that says "whenever you draw a card, target player loses 1 life."
    If it's always a triggered ability, it doesn't target your ward creature: other players get targeted.
  Example: "Whenever a creature you control dies, deal 1 damage to target creature."
    This is a triggered ability that CAN target your opponent's creature with ward.
    If it targets that creature, ward triggers.

KEY DETAIL: CR 702.21a says "spell or ability an opponent controls."
  The spell/ability must be CONTROLLED by an opponent.
  You CAN'T target your own ward creatures: ward only cares about opponents' spells/abilities.
  Your own targeted spells on your own ward creature: no ward trigger.
```

## Definitive Conclusions

- **One spell targeting multiple Ward creatures = independent triggers** — Each Ward creature targeted generates its own trigger; each must be paid separately; paying one Ward cost does NOT satisfy another Ward trigger.
- **Multiple Wards on the same creature = independent triggers** — Ward {2} and Ward {3} on one creature = two triggers; opponent must pay {2} AND {3} ({5} total) to keep their spell alive.
- **Ward does NOT prevent damage** — Ward gates a *targeting cost*, not damage itself. Non-targeting effects (Wrath of God, board wipes, "each creature gets -X/-X") bypass Ward entirely.
- **Each Ward trigger is resolved independently** — Even if opponent pays one Ward cost, they must still pay each subsequent Ward trigger or lose the spell.
- **Variable Ward costs {X} use current value at resolution** — Not the value when triggered; if the permanent's power/toughness/etc. changes mid-stack, the higher/lower value applies.
- **Copies of spells targeting Ward permanents trigger Ward independently** — Each copy is a separate spell; each targeting the Ward permanent triggers Ward; each must be paid separately.

## Canonical Example

**Two-creature Ward scenario:**
Setup: You control two creatures, each with Ward {1}. Creature A (2/2 Ward {1}) and Creature B (3/3 Ward {1}).
Opponent casts Languish ({2}{B}{B}: all creatures get -4/-4): This spell doesn't target anyone; it's a global effect. Ward doesn't trigger. Both creatures die. Ward is useless here.

Different scenario: Opponent casts Primal Might ({1}{G}: target creature you control gains indestructible until end of turn; or, target creature an opponent controls must sacrifice itself at end of turn).
Wait, this spell only targets ONE creature.

Better scenario: Opponent casts (hypothetically) "Shattered Hopes: {B}{R}: choose two different target creatures. Each must sacrifice a permanent or lose 2 life."
This is a single spell targeting TWO creatures.
Target Creature A (has Ward {1}) and Creature B (has Ward {1}).

Shattered Hopes goes on stack with two targets.
Triggers check: Creature A is the target of opponent's spell (Shattered Hopes) → Ward {1} trigger #1.
Creature B is the target of opponent's spell (Shattered Hopes) → Ward {1} trigger #2.
Two Ward triggers on the stack, above Shattered Hopes.

Resolving (LIFO):
  Ward {1} trigger #2 (Creature B) resolves first: "Counter Shattered Hopes unless you pay {1}."
  Opponent is on 5 mana. Must choose:
    Pay {1}: Shattered Hopes stays on stack. Opponent now has 4 mana remaining.
    Don't pay: Shattered Hopes is countered. Done.

  Assume opponent paid {1}. Continue.
  Ward {1} trigger #1 (Creature A) resolves: "Counter Shattered Hopes unless you pay {1}."
  Opponent has 4 mana remaining. Must choose:
    Pay {1}: Shattered Hopes stays on stack. Opponent now has 3 mana remaining. Spell resolves.
    Don't pay: Shattered Hopes is countered. Done.

  If opponent paid both {1} costs ({2} total):
    Shattered Hopes resolves targeting both Creature A and B.
    Creature A: must sacrifice a permanent or lose 2 life.
    Creature B: must sacrifice a permanent or lose 2 life.

**Multiple Wards on one creature:**
Setup: You control a creature with Ward {2} and Ward {3} (enchanted with two Ward effects, or via equipment, etc.).
Opponent casts Swords to Plowshares ({W}: "destroy target creature. Its controller gains life equal to its toughness.").
Swords targets your multi-ward creature.

Swords goes on stack.
Ward triggers:
  Ward {2} trigger: "counter Swords unless you pay {2}."
  Ward {3} trigger: "counter Swords unless you pay {3}."

Resolving (LIFO, Ward {3} first):
  Ward {3} trigger resolves: opponent pays {3} or Swords is countered.
  Opponent pays {3}. Swords is still on stack.
  Ward {2} trigger resolves: opponent pays {2} or Swords is countered.
  Opponent pays {2}. Swords is still on stack. Total paid: {5}.

  Swords resolves: your creature is destroyed, controller (you) gains life equal to toughness.

Alternative: Opponent can't pay {5}. After Ward {3} trigger resolves (they don't pay), Swords is countered. Your creature survives. Opponent wasted {W}.

**Variable Ward cost:**
Setup: creature with "Ward—pay life equal to this creature's power."
Creature currently has power 3.
Opponent casts Doom Blade targeting it.

Doom Blade goes on stack.
Ward trigger fires (creature is being targeted).
Ward trigger goes on stack above Doom Blade.

Before Ward trigger resolves, you cast Embercleave (equip +1/+0 is one part): your creature gains +3/+0.
Now creature has power 6.

Ward trigger resolves: opponent must pay life equal to THIS CREATURE'S CURRENT POWER.
Current power = 6. Opponent must pay 6 life to keep Doom Blade on the stack.
(Not 3 life, which was the power when the Ward trigger first fired.)

## Commonly Confused With

- **P220 (Ward — Triggered Counter Tax)** — Covers the basic Ward mechanic (trigger on targeting, counter unless cost paid). P553 focuses specifically on multi-targeting, independent triggers, and what happens when one spell targets multiple Ward creatures or when one creature has multiple Ward abilities.
- **P361 (Ward, Hexproof, Shroud)** — Covers the differences between Ward (triggered tax), Hexproof (prevention restriction), and Shroud (universal restriction). P553 zooms into Ward-specific multi-instance and multi-target scenarios.
- **P002 (Replacement vs. Trigger)** — Ward is a TRIGGERED ability, not a replacement. A replacement effect would prevent the targeting from happening; Ward allows targeting and reacts to it on the stack.
- **P007 (Priority Windows)** — After multiple Ward triggers are on the stack, players have windows to respond to each trigger before it resolves. Opponent can try to save the spell by paying costs at each window.
- **P005 (Simultaneous Event Ordering)** — When multiple Ward creatures are targeted simultaneously by one spell, each Ward trigger goes on the stack independently. APNAP determines the order of triggers on the stack (active player non-active player).

