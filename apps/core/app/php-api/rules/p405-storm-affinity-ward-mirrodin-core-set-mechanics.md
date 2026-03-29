---
id: p405
name: Storm, Affinity, and Ward — Spell Copying, Cost Reduction, and Targeted-Ability Tax
category: stack
cr_refs: [702.40a, 702.40b, 702.41a, 702.41b, 702.21a, 702.21b]
tags: [storm, affinity, ward, copy-per-spell-this-turn, cost-reduction-per-permanent, counter-unless-pay-cost, storm-count, Mirrodin, Onslaught, Kaldheim, Tendrils-of-Agony, Brain-Freeze, Grapeshot, Mox-Diamond-Affinity, Ornithopter, Briarbridge-Tracker, Farewell, ward-2, hexproof-difference, storm-copies-not-spells]
created: 2026-03-29
examples_count: 2
---

# P405 — Storm, Affinity, and Ward — Spell Copying, Cost Reduction, and Targeted-Ability Tax

## Abstract
**Storm** (702.40) is a triggered ability: when you cast a storm spell, copy it for each other spell cast before it this turn. The copies go on the stack and can have new targets chosen. Storm creates massive effects from cheap spells by rewarding long spell chains. **Affinity for [text]** (702.41) is a static ability that reduces the spell's cost by {1} for each permanent of the specified type you control. **Ward** (702.21) is a triggered ability: whenever the permanent with ward becomes the target of a spell or ability an opponent controls, counter that spell unless the opponent pays the ward cost. Ward is "conditional hexproof" — it doesn't prevent targeting, but makes opponents pay to keep their spells alive.

## The Definitive Rules

**CR 702.40a** (verbatim): *"Storm is a triggered ability that functions on the stack. 'Storm' means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 702.40b** (verbatim): *"If a spell has multiple instances of storm, each triggers separately."*

**CR 702.41a** (verbatim): *"Affinity is a static ability that functions while the spell with affinity is on the stack. 'Affinity for [text]' means 'This spell costs {1} less to cast for each [text] you control.'"*

**CR 702.41b** (verbatim): *"If a spell has multiple instances of affinity, each of them applies."*

**CR 702.21a** (verbatim): *"Ward is a triggered ability. Ward [cost] means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays [cost].'"*

**CR 702.21b** (verbatim): *"Some ward abilities include an X in their cost and state what X is equal to. This value is determined at the time the ability resolves, not locked in as the ability triggers."*

## The Pattern

```
STORM (702.40):
  WHAT IT IS:
    Triggered ability that fires when you CAST the storm spell.
    "Copy it for each other spell cast before it this turn."
    OTHER spell = spells cast this turn BEFORE the storm spell (not counting the storm spell itself).
    Each copy goes on the stack. Copies can have new targets chosen.
  COUNTING THE STORM:
    "Storm count" = number of OTHER spells cast before the storm spell this turn.
    Spell 1, Spell 2, Storm Spell: storm count = 2 (2 spells before storm). 2 copies created.
    Land plays don't count (lands aren't spells).
    Mana abilities that produce mana don't count (they use the stack, but...
      actually: mana abilities don't use the stack. They can't be "spells cast this turn."
    Only SPELLS count: instants, sorceries, creatures, etc. cast from hand/zones.
    Copies of spells already on the stack: do copies count? No — "cast" means going through the
      casting process (601.2). Creating a copy is not casting. Copies don't increment storm count.
  WHAT THE COPIES ARE:
    "Copy it" — the copies are copies of the storm spell, not new castings.
    Copies are not cast. They're put on the stack.
    Prowess (P397) doesn't trigger for copies. Spell-cast triggers don't trigger for copies.
    If the storm spell has targets: each copy CAN have new targets chosen (independently).
    You may keep the same target or choose different targets for each copy.
  COPY ORDER AND RESOLUTION:
    Storm trigger fires when you cast the storm spell. The trigger goes on the stack on top of it.
    When the storm trigger resolves: it creates the copies. All copies go on the stack at once.
    Stack order: copies (created simultaneously), then the original storm spell (already on stack).
    If 3 copies were created: C3, C2, C1, Original — all on the stack.
    Resolution: C3 resolves first (LIFO), then C2, C1, then Original.
  COUNTERING A STORM SPELL:
    If you counter the original storm spell BEFORE the storm trigger resolves:
      The trigger already fired (at cast time). The copies are still created.
      The original is countered, but the N copies are already on the stack.
      Countering the original doesn't prevent the copies.
    If you counter the storm trigger itself:
      The trigger is countered. No copies created. The original still resolves.
    Counterspell the original: original fails, but copies may already be on the stack.
    This is why storm is hard to stop: even countering the original still allows copies to resolve.
  STORM AND GRAPESHOT:
    Grapeshot ({1}{R}: "This spell deals 1 damage to any target. Storm"):
    Turn 1: Cast Mox Opal → 1 spell. Cast Mox Amber → 2 spells. Cast Dark Ritual → 3 spells.
    Cast Grapeshot: storm trigger fires. Storm count = 3 (3 spells before Grapeshot).
    3 copies + 1 original = 4 Grapeshots total, each dealing 1 damage.
    Direct each to different targets or all to one player (4 damage total).
    In a Storm combo deck: storm count of 9+ is typical, dealing 9+ damage with Grapeshot.
  TENDRILS OF AGONY AND STORM:
    Tendrils of Agony ({2}{B}{B}: "Target player loses 2 life and you gain 2 life. Storm"):
    Storm count 9: original + 9 copies = 10 "Tendrils" triggers.
    Each: target player loses 2, you gain 2. Total: 20 life loss + 20 life gain (a 40 life swing).
    This is the classic "Storm Kill" — storm count 9 = lethal Tendrils in a 20-life game.

AFFINITY (702.41):
  WHAT IT IS:
    Static ability. Functions while the spell is on the stack.
    "Affinity for [text]" means this spell costs {1} less for each [text] you control.
    The "text" defines what is counted: artifacts, lands, forests, etc.
    Original Affinity for Artifacts: reduce cost by 1 for each artifact you control.
  KEY RULES:
    Affinity reduces GENERIC mana costs. Can't reduce colored mana requirements.
    A spell that costs {3}{U} with affinity for artifacts, and you control 5 artifacts:
      Reduce by 5 (one per artifact). But can't reduce below {U}? Well, the {3} goes to 0 first.
      Effective cost: {0}{U}. The {3} is reduced to 0 (can't go negative).
      Affinity can't reduce the total cost below 0 (or below the colored mana requirements).
    The count is at the time you CAST the spell. Adding/removing artifacts after casting doesn't change it.
    Affinity for [specific type]: more niche.
      Affinity for Humans: "costs {1} less for each Human you control."
      Affinity for Forests: in a dedicated forests deck.
  AFFINITY AND COLORED MANA:
    Only generic mana is reduced. Colored symbols remain.
    Frogmite ({4}: 2/2, affinity for artifacts):
      Control 4 artifacts: Frogmite costs {4} - 4 = {0}. Free.
      Control 3 artifacts: costs {1}.
    Thoughtcast ({4}{U}: sorcery — draw 2 cards — affinity for artifacts):
      Control 5 artifacts: {4}{U} - 5 = minimum {0}{U} = {U}. Pay {U} for Thoughtcast.
      Can't reduce {U}. Minimum: {U} (1 blue mana).
  MULTIPLE AFFINITY INSTANCES (702.41b):
    Each applies separately. A spell with "affinity for artifacts" twice: costs {2} less per artifact.
    Stacking affinity: uncommon in practice (same type on same card), but each instance applies.

WARD (702.21):
  WHAT IT IS:
    Triggered ability. "Whenever this permanent becomes the TARGET of a spell or ability an
      opponent controls, counter that spell or ability unless that player pays [cost]."
    NOT hexproof. Ward doesn't prevent targeting — it punishes targeting.
  HOW IT WORKS:
    Opponent targets your ward creature with, say, Lightning Bolt.
    Ward triggers: the trigger goes on the stack on top of Lightning Bolt.
    The trigger resolves: "Counter Lightning Bolt unless the opponent pays [cost]."
    If opponent pays the ward cost: Lightning Bolt continues. Resolves.
    If opponent doesn't pay: Lightning Bolt is countered.
  WARD COSTS:
    Typically a mana cost: Ward {2} means pay {2} to keep their spell alive.
    But ward can be any cost: Ward—Sacrifice a permanent. Ward—Pay 4 life. Ward—Discard a card.
    The opponent pays when the WARD TRIGGER RESOLVES, not when they target.
  WARD AND TIMING:
    After the ward trigger resolves: if paid, the original spell continues on the stack.
    If not paid: the original spell is countered. Does it go to GY? Depends on the spell type.
      Countered instants/sorceries → GY.
      Countered activated/triggered abilities → disappear (they don't have cards).
  WARD VS. HEXPROOF:
    Hexproof: "can't be the target of spells/abilities opponents control."
      Prevents targeting entirely.
    Ward: allows targeting but punishes it with a tax.
      The opponent CAN target. They just might lose their spell/ability if they can't pay.
    Why ward instead of hexproof? Ward is interactable (at a cost). Hexproof is absolute.
  WARD {X} WHERE X IS VARIABLE:
    702.21b: "This value is determined at the time the ability resolves, not locked in as it triggers."
    If X = the power of the ward permanent, and the permanent's power changes between trigger and
      resolution: the current power is used when the trigger resolves.
    Example: Ward — pay life equal to this permanent's power. If power increased by the time
      the ward trigger resolves: opponent must pay the HIGHER value.
  WARD AND MULTIPLE TARGETING:
    If one spell targets your ward permanent multiple times (e.g., "deal damage to target creature
      multiple times"): each targeting event triggers ward separately?
      Actually: a spell that "targets a permanent multiple times" still just has one "targeting event"
        per target chosen when the spell is cast. Ward triggers once per targeting event.
      If a single spell targets the ward permanent twice: two ward triggers.
      Each trigger would need to be paid. Opponent must pay ward cost twice if they want the spell to resolve.
  WARD AND COPIES:
    If a copy of a spell that targeted a ward permanent is created:
      The copy "targeting" the same permanent — does ward trigger?
      Actually: copies are "put onto the stack." They're not "cast" or "activated."
      Ward says "becomes the target of a spell or ability AN OPPONENT CONTROLS."
      A copy controlled by an opponent does target the ward permanent. Ward triggers for the copy.
      Each copy: ward triggers again.
```

## Definitive Conclusions

- **Storm copies are created by a triggered ability** — not additional castings; prowess doesn't trigger for copies; countering the original after the storm trigger fires doesn't prevent the copies from resolving.
- **Storm count includes ONLY spells cast before the storm spell this turn** — copies of spells don't count; mana abilities (Llanowar Elves' tap) don't count; lands played don't count.
- **Affinity reduces only generic mana** — can't reduce colored mana; reduces to 0 minimum for generic costs; the permanent count is taken at the moment of casting.
- **Ward doesn't prevent targeting — it counters spells/abilities that don't pay the ward cost** — the triggering spell/ability is on the stack until the ward trigger resolves; if the opponent pays, the original continues.
- **Ward {X} (variable) uses the X value at resolution time** — not when the ward triggered; if the permanent's characteristics changed, the opponent may pay more or less than expected.

## Canonical Example
**Storm Combo — Grapeshot Kill:**
Setup: Storm combo deck. Turn 3. You have enough mana, a Goblin Electromancer in play (noncreature spells cost {1} less).

Cast sequence (spells cast this turn before Grapeshot):
1. Dark Ritual ({B}: add {B}{B}{B}) — storm count: 1
2. Manamorphose ({1}{R/G}: add 2 mana of any combination, draw a card) — storm count: 2
3. Desperate Ritual ({1}{R}: add {R}{R}{R}) — storm count: 3
4. Gitaxian Probe ({U/P}: pay 2 life, look at opponent's hand, draw a card) — storm count: 4
5. Serum Visions ({U}: scry 2, draw a card) — storm count: 5
...continue through more cantrips and rituals...
Storm count reaches 9.

Cast Grapeshot ({1}{R}: "deal 1 damage to any target. Storm").
Goblin Electromancer: costs {1} less, so Grapeshot costs {R}.
Storm trigger fires. Storm count = 9. 9 copies created + 1 original = 10 Grapeshots.
Direct all 10 at the opponent's face (20-life opponent). 10 × 1 = 10 damage. Opponent dies.

Opponent responds with Remand (counter Grapeshot, return to hand)?
Wait: opponent tries to counter the ORIGINAL Grapeshot.
But the storm trigger has ALREADY fired (triggered when cast). 9 copies are on the stack.
Remand resolves: original Grapeshot is countered and returned to your hand.
The 9 copies are still on the stack. Each resolves for 1 damage each. 9 damage total.
Opponent took 9 damage from copies. If they were at 9 or less: still dead.
This illustrates why storm is hard to stop — countering the original doesn't stop the copies.

**Example 2 — Ward 2 Protecting Briarbridge Tracker:**
Briarbridge Tracker ({2}{G}: 3/3, Ward {2}, "whenever you discard a card, investigate"):

Opponent casts Lightning Bolt ({R}: deal 3 damage to any target) targeting Briarbridge Tracker.
Ward triggers: "Counter Lightning Bolt unless that player pays {2}."
Ward trigger goes on the stack on top of Lightning Bolt.

Ward trigger resolves: opponent must pay {2} or Lightning Bolt is countered.
Option A (opponent pays {2}): Lightning Bolt continues. Deals 3 damage to Briarbridge Tracker. It dies (3/3 takes 3 damage).
  Opponent spent {R} + {2} = {R}{2} (3 mana total) to kill the 3/3.
Option B (opponent doesn't pay): Lightning Bolt is countered. Briarbridge Tracker survives.
  Opponent wasted {R} (the cost of Lightning Bolt) — spell was countered for free.

If opponent is tapped out ({2} unavailable): must choose option B. Lightning Bolt is wasted.
This is ward's strength: timing it when opponent is mana-constrained.

Ward comparison to hexproof:
Hexproof creature: Lightning Bolt CAN'T target it. Opponent never casts it (or it's illegal).
Ward creature: Lightning Bolt CAN target it. Ward just punishes them if they can't/won't pay.
Strategically: ward rewards playing around it; hexproof can't be played around (targeting is impossible).

## Commonly Confused With
- **P007 (Priority Windows)** — Storm triggers when you cast the spell. The opponent has a window to respond after the storm trigger is on the stack. If they counter the storm trigger: no copies. If they counter the original: copies already exist.
- **P002 (Replacement Effects)** — Ward is a triggered ability, not a replacement effect. The spell targets the permanent, THEN ward triggers, THEN ward might counter the spell. Replacement effects would prevent the targeting from happening at all.
- **P008 (Can't vs. Can — Hexproof vs. Ward)** — Hexproof says "can't be targeted." Ward allows targeting but counters the spell. This is a classic P008 pattern: one ability prevents the event entirely; the other allows the event but changes the consequence.
- **P388 (Convoke/Affinity)** — Affinity reduces generic mana cost for each qualifying permanent controlled. Convoke reduces cost by tapping creatures to pay mana. Both are cost-reduction mechanics but work at different times (affinity is static; convoke is active during casting).
