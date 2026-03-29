---
id: p441
name: Mutate — Merged Permanents, Topmost Characteristics, and Zone Separation on Death
category: zones
cr_refs: [702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 729.2a, 729.2b, 729.2c, 729.2d, 729.3, 729.3a, 729.3b]
tags: [mutate, merged-permanent, topmost-component, ETB-no-trigger, mutate-trigger, zone-separation, human-restriction, illegal-target, counters-persist, attachments-persist, same-object, legend-rule-mutate, summoning-sickness-mutate, Gemrazer, Illuna-Apex, Pouncing-Shoreshark, Ikoria]
created: 2026-03-29
examples_count: 2
---

# P441 — Mutate — Merged Permanents, Topmost Characteristics, and Zone Separation on Death

## Abstract
**Mutate** (702.140) creates a **merged permanent** — one physical object represented by multiple cards stacked together. The topmost card determines all characteristics (name, P/T, card types, colors); all cards in the stack contribute their abilities (702.140e). Crucially: (1) **mutating does NOT cause the permanent to enter the battlefield** — it's the SAME object that was already there; no ETBs fire for the merging spell (but "whenever this creature mutates" triggers DO fire per 702.140d); (2) **all counters, Auras, Equipment, and effects that applied to the original remain**, because the permanent is the same object (CR 729.2c); (3) **when the merged permanent leaves the battlefield, each component card goes to its own zone simultaneously** — a 3-card mutate stack that dies results in three cards in the graveyard; (4) **if the mutate target is illegal at resolution** (died, became a Human, changed control), the spell ceases to be a mutating spell and enters as a regular creature instead (702.140b).

## The Definitive Rules

**CR 702.140a** (verbatim): *"Mutate appears on some creature cards. It represents a static ability that functions while the spell with mutate is on the stack. 'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.'"*

**CR 702.140d** (verbatim): *"An ability that triggers whenever a creature mutates triggers when a spell merges with a creature as a result of a resolving mutating creature spell."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

**CR 729.2a** (verbatim): *"A merged permanent has only the characteristics of its topmost component, unless otherwise specified by the effect that caused them to merge. This is a copiable effect whose timestamp is the time the objects merged."*

**CR 729.2b** (verbatim): *"As an object merges with a permanent, that object leaves its previous zone and becomes part of an object on the battlefield, but the resulting permanent isn't considered to have just entered the battlefield."*

**CR 729.2c** (verbatim): *"Because a merged permanent is the same object that it was before, it hasn't just come under a player's control, any continuous effects that affected it continue to do so, and so on."*

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

## The Pattern

```
MUTATE (702.140a):
  CASTING A MUTATE SPELL:
    Pay mutate cost instead of mana cost.
    Spell targets "a non-Human creature with the same owner as this spell."
    TARGET RESTRICTION: non-Human creatures you own.
      Humans (creature type Human) can't be targeted.
      You can't target opponent's creatures (must share owner with the spell).
      Valid target at time of cast: checked for legality throughout.

  IF TARGET BECOMES ILLEGAL AT RESOLUTION (702.140b):
    "If its target is illegal, it ceases to be a mutating creature spell and
     continues resolving as a creature spell." → Enters as a normal creature.
    Examples of targets becoming illegal:
      - Target creature dies in response → enters as creature normally
      - Target creature becomes a Human in response (type-changing effect) → enters normally
      - Target creature changes control in response → WAIT: mutate requires SAME OWNER.
        Gaining control doesn't change owner. The target is still the same owner's creature.
        But now an OPPONENT controls it. Is this an illegal target? Yes — the spell says
        "a non-Human creature with the same owner as this spell." The owner check is on
        the PERMANENT's owner, not its controller. If the owner changed (very rare, via
        effects like "you may put this permanent into its owner's hand; opponent may steal it"):
        that would matter, but usually ownership stays fixed.

  THE MERGE:
    If target is legal at resolution: the spell doesn't enter the battlefield.
    Instead, it MERGES with the target creature.
    Controller chooses whether the spell goes on TOP or BOTTOM of the existing creature.
    The TOPMOST component determines:
      - Name, mana cost, color, P/T, card types, subtypes (from 729.2a)
    ALL COMPONENTS contribute their activated and triggered abilities (702.140e):
      - Even components under the top contribute all their abilities to the merged stack.
      - The merged permanent has ALL the abilities of ALL cards in the stack.
    The merged permanent is NOT new — it's the SAME OBJECT (729.2b, 729.2c).

  NO ETB FOR THE MERGING SPELL (729.2b):
    "The resulting permanent isn't considered to have just entered the battlefield."
    ETBs triggered by creatures entering do NOT fire for the merging spell.
    "When this creature enters" on the mutating spell: does NOT trigger.
    "Whenever a creature enters" on other permanents: also does NOT trigger for the
      mutating spell (because it doesn't "enter" — it merges into an existing permanent).

  "WHENEVER THIS CREATURE MUTATES" TRIGGERS (702.140d):
    These DO trigger when a mutating spell merges with the creature.
    Each mutation event triggers all "whenever this creature mutates" abilities on the
      merged permanent (including abilities from all components in the stack).
    A merged permanent with 3 "whenever this creature mutates" abilities (from 3 components)
      having a 4th card mutate onto it: all 3 abilities trigger simultaneously.
      Stack resolution: each trigger resolves separately.

  SAME OBJECT — CONTINUITY:
    Counters on the base creature: REMAIN. The merged permanent is the same object.
    Auras enchanting the base creature: REMAIN attached to the merged permanent.
    Equipment attached to the base creature: REMAINS attached.
    Continuous effects (pump spells, "until EOT" effects): CONTINUE to apply.
    Summoning sickness: the merged permanent has the same "history" as the base creature.
      If the base creature could attack this turn: the merged permanent can attack.
      If the base creature had summoning sickness: the merged permanent still has it.
    Commander status: if the base creature is a commander, the merged permanent is
      still a commander (it's the same object).

  CHARACTERISTICS OF THE MERGED PERMANENT:
    TOPMOST component determines: name, mana cost, color indicators, card types,
      subtypes, supertypes, P/T (or CDA for P/T), and "other characteristics" (CR 729.2a).
    ALL components contribute their ABILITIES (activated, triggered, static, keyword).
    Example: Gemrazer ({1}{G}{G}, 4/4, reach, trample; "when this creature mutates,
      destroy target artifact or enchantment") mutates on top of a 2/2 Gilded Goose
      ({G}: bird, 0/2; mana ability):
      Merged permanent characteristics: Gemrazer (4/4, reach, trample, green, artifact creature).
      Wait: Gilded Goose is a Bird, not an artifact. And Gemrazer is a Beast. The top is Gemrazer.
      Merged permanent is Gemrazer's name/P/T/types.
      ALL abilities: Gemrazer's reach, trample, mutate trigger + Gilded Goose's {T}: {G} mana ability.
      The merged Gemrazer can tap for {G} (from Gilded Goose below it).

  WHEN THE MERGED PERMANENT LEAVES THE BATTLEFIELD (729.3):
    "One permanent leaves the battlefield and each individual component is put into
     the appropriate zone."
    All components go to their respective zones simultaneously.
    GY-destined components all go to the GY (or exile if replaced by Leyline, etc.).
    The single "permanent leaving" event means: triggered abilities that fire on
      "when a creature dies" trigger ONCE (for the one permanent leaving), NOT per component.
    BUT: afterlife on a component fires based on the merged permanent dying (one event).
    Graveyard: each component card is now separately a card in the GY. Each can be
      individually targeted by recursion effects.

  LEGEND RULE AND MUTATE:
    The topmost component determines name and supertypes (including Legendary).
    If the top is a legendary creature: the merged permanent is legendary with that name.
    If you control two merged permanents with the same legendary name:
      SBA 704.5j: both go to GY. Each component card goes to GY (729.3 applies to each).
    Mutating a non-legendary on top of a legendary creature:
      Merged permanent: non-legendary name (from top) — no legend rule.
      But you lose the legendary creature's name. Effects that check for "legendary creature"
      look at the topmost component's supertypes.
```

## Definitive Conclusions

- **Mutating does NOT cause an ETB** — the merging spell doesn't enter the battlefield; ETB triggers on the mutating spell don't fire; "whenever a creature enters" triggers on other permanents don't fire; only "whenever this creature mutates" triggers are created.
- **All components' abilities are present on the merged permanent** — a Gilded Goose under Gemrazer gives the merged permanent Gilded Goose's mana ability; mutate stacks accumulate abilities from every layer.
- **Counters, attachments, and effects persist through mutation** — the merged permanent is the same object; Equipment stays attached, Auras stay attached, +1/+1 counters remain, "until end of turn" effects continue.
- **When the merged permanent dies, each component goes to the graveyard separately** — all three cards of a 3-mutate stack each become their own GY entries; each can be individually recurred with Reanimate, Eternal Witness, etc.
- **If the target becomes illegal at resolution, the mutating spell enters as a normal creature** — and its "when this creature enters" ETBs DO fire when it enters this way (since it's entering the battlefield normally, not merging).
- **Summoning sickness is based on the base creature's history** — if you mutate onto a creature you've controlled since before this turn, the merged permanent has no summoning sickness and can attack immediately.

## Canonical Example
**Gemrazer mutating onto an existing creature with auras:**
You control a Grizzly Bears (2/2: Basic bear) enchanted by Rancor (+2/+0 trample, returns to hand on death) and with a +1/+1 counter from last turn. You've controlled the Bears since before this turn.

You cast Gemrazer for its mutate cost {1}{G}{G}: target the Grizzly Bears.
Gemrazer is a mutating creature spell, targeting the Bears.

At resolution: merge. You put Gemrazer on TOP of Grizzly Bears.
The permanent is the same object as Grizzly Bears (729.2c).

Merged permanent characteristics (from Gemrazer on top):
  Name: Gemrazer. P/T: 4/4. Card types: Creature. Subtypes: Mutant. Color: Green.
  Keywords: Reach, Trample.
  "Whenever this creature mutates, destroy target artifact or enchantment."

Abilities from ALL components:
  Gemrazer: reach, trample, mutate trigger.
  Bears: none notable.

Continuity preserved:
  +1/+1 counter from last turn: STILL ON the merged permanent. It's now a 5/5.
  Rancor: STILL attached (same object). +2/+0 trample = merged permanent is a 7/5 with trample.
  No summoning sickness: you've controlled the base creature since before this turn.

"Whenever this creature mutates" triggers: Gemrazer's trigger fires.
Destroy target artifact or enchantment your opponent controls.

The merged permanent can attack this turn: 7/5 trample reach.

**Example 2 — Merged permanent dying, individual components separate:**
You've stacked mutate 3 times: Pouncing Shoreshark (top, 3/3, flash, "when mutates: bounce a creature"), Gemrazer (middle, 4/4, reach, trample), and a base 2/2 Gilded Goose (bottom).

The merged permanent is: Pouncing Shoreshark (name/P/T), with reach, trample from Gemrazer, {T}: {G} from Gilded Goose.

Opponent destroys it with a -13/-13 effect (or similar overwhelming removal).
729.3: "one permanent leaves the battlefield; each component put into appropriate zone."
Result: GY now contains three separate cards: Pouncing Shoreshark (in GY as a creature card with mutate), Gemrazer (in GY with mutate), and Gilded Goose (in GY as a Bird).

Each can be individually recurred: Reanimate one, Eternal Witness another, etc.
The single "permanent leaving" event triggers "when a creature dies" once, not three times.
But each card is now individually available for graveyard interactions.

## Commonly Confused With
- **P431 (Bestow)** — Bestow and mutate both result in permanents that modify another. Bestow Auras are separate permanents attached to creatures; a mutated permanent is a single merged permanent (not attached). When the bestow enchanted creature dies: the Aura becomes a separate creature. When a mutated creature dies: all components go to the GY as separate cards (not as separate permanents).
- **P440 (Afterlife)** — Afterlife triggers "when this permanent is put into a graveyard from the battlefield." For a mutated permanent with afterlife on one component: the one permanent dies, one afterlife trigger fires. The multiple component cards in GY don't create multiple afterlife triggers.
- **P422 (Changeling)** — Changeling grants ALL creature subtypes. Mutate targets "non-Human creature." A Changeling IS a Human (it's every creature type). Changeling creatures CANNOT be targeted by mutate. (Changeling cards have the Human creature type via their CDA.)
- **P433 (Dash)** — Dash and mutate both create complications when blinking. If a mutated permanent is blinked: it re-enters as the topmost component card only (new object, other components left wherever they were during exile), not as the merged stack.
