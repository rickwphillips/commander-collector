---
id: p383
name: Class Cards — Level Progression, Unlock Abilities, and Level Rules
category: continuous
cr_refs: [716.1, 716.2, 716.2a, 716.2b, 716.2c, 716.2d, 716.3, 716.4, 702.87a]
tags: [class, class-card, class-level, level-bar, unlock-ability, sorcery-speed-level-up, level-1-free, class-level-2, class-level-3, cumulative-abilities, level-designation, Dungeon-Master, Paladin-Class, Rogue-Class, Wizard-Class, Barbarian-Class, leveler-card-distinction]
created: 2026-03-29
examples_count: 2
---

# P383 — Class Cards — Level Progression, Unlock Abilities, and Level Rules

## Abstract
**Class cards** (rule 716) are enchantments introduced in Adventures in the Forgotten Realms with a unique structure: they enter at Level 1 and can be leveled up by paying mana (as a sorcery-speed special action) to gain new abilities. A Class card has three sections: an inherent ability (Level 1, always active), and two "class level bars" — each a combined activated + static ability that bumps the class to a higher level and grants cumulative abilities. **Class levels are designations, not counters** — they're not copiable, can't proliferate, and don't interact with level-up (702.87) creature mechanics. Key rules: classes start at Level 1 when they enter (not Level 0 — 716.2d treats any permanent without a level as Level 1); the level can only increase (you activate Level N by spending when at Level N-1); abilities of Level N or higher are active as long as the class is at or above that level (cumulative); and each level-up activation is a sorcery-speed action that uses the stack.

## The Definitive Rules

**CR 716.2** (verbatim): *"A class level bar is a keyword ability that represents both an activated ability and a static ability. A class level bar includes the activation cost of its activated ability and a level number. Any abilities printed within the same text box section as the class level bar are part of its static ability."*

**CR 716.2a** (verbatim): *"'[Cost]: Level N — [Abilities]' means '[Cost]: This Class's level becomes N. Activate only if this Class is level N-1 and only as a sorcery' and 'As long as this Class is level N or greater, it has [abilities].'"*

**CR 716.2b** (verbatim): *"A level is a designation that any permanent can have. A Class retains its level even if it stops being a Class. Levels are not a copiable characteristic."*

**CR 716.2c** (verbatim): *"The phrase 'to gain a Class level' means 'to activate an ability indicated by a class level bar.'"*

**CR 716.2d** (verbatim): *"If a rule or effect refers to a permanent's level and that permanent doesn't have a level, it is treated as though its level is 1."*

**CR 716.3** (verbatim): *"Any ability printed on a Class card that isn't preceded by a class level bar is treated normally. In particular, the Class has the ability printed in its top text box section at all times."*

**CR 716.4** (verbatim): *"Some older creature cards, called leveler cards, have level up abilities that add level counters to them. These are not the same as class level abilities. Level counters do not interact with Class cards, and class levels do not interact with leveler cards."*

## The Pattern

```
CLASS CARD STRUCTURE:
  THREE SECTIONS:
    Section 1 (top, always active): inherent ability. Active as soon as the class enters.
    Section 2: Level 2 bar. Pay the cost to advance from Level 1 to Level 2 (sorcery speed).
      Abilities in this section: active at Level 2 and above.
    Section 3: Level 3 bar. Pay the cost to advance from Level 2 to Level 3 (sorcery speed).
      Abilities in this section: active at Level 3.
  WHAT "CUMULATIVE" MEANS:
    At Level 1: only Section 1 abilities.
    At Level 2: Section 1 + Section 2 abilities.
    At Level 3: Section 1 + Section 2 + Section 3 abilities.
    All previously gained abilities remain. Leveling up adds, doesn't replace.

LEVEL PROGRESSION (716.2a):
  "Level N" means: current class level equals N.
  TO LEVEL UP:
    716.2a: "[Cost]: This Class's level becomes N. Activate only if this Class is level N-1
      and only as a sorcery."
    Must currently be at Level N-1. Can't skip levels.
    Sorcery speed: only during main phase with empty stack.
    This IS an activated ability — goes on the stack, can be countered/responded to.
  LEVEL DESIGNATION:
    Level is a designation (not a counter, not a token).
    Can't be proliferated (not a counter).
    Can't be copied (716.2b: "not a copiable characteristic").
    Even if the permanent loses its Class subtype: it retains the level.
      "A Class retains its level even if it stops being a Class." (716.2b)
    If Humility removes all abilities from a Class: the class loses its abilities,
      but the level designation persists. (No abilities does it no good, though.)
  ENTERING AT LEVEL 1:
    Classes enter at Level 1 by default (first section active immediately).
    716.2d: if no level, treat as Level 1. Since all Classes gain a level designation when they
      enter (through the Level 1 state being their initial state), they start at Level 1.
    There's no "Level 0." The first section's abilities are always active.

CLASS LEVEL ACTIVATION:
  IT'S AN ACTIVATED ABILITY (USES THE STACK):
    Unlike "level up" of leveler cards (creature special action), class level activation IS
      a proper activated ability. It goes on the stack.
    Opponents CAN respond to it (counter the activation, destroy the class in response).
    If the class is destroyed in response to leveling up:
      The class leaves the battlefield. The activation is still on the stack.
      When it tries to resolve: the class is no longer on the battlefield.
      The activation resolves but has no effect (or is countered — depends on rules).
      Actually: for activated abilities, if the source left the battlefield, the ability
        usually still resolves (unless it specifically requires the source to be present).
      "This Class's level becomes N": the Class isn't there to change. Nothing happens.
  SORCERY SPEED ONLY:
    "Activate only as a sorcery." = during main phase, stack empty.
    Can't level up during opponent's turn.
    Can't level up in response to spells (stack wouldn't be empty).
    Exception: if an effect allows you to activate as though it were an instant (rarely applicable).

DUNGEON MASTER CLASS ({1}{G}):
  Level 1 (free — always active when in play):
    "Whenever another creature enters under your control, it explores."
  Level 2 ({1}{G}: 1 mana to advance): pay {1}{G} during main phase.
    "Creatures you control have haste."
  Level 3 ({4}{G}: 4 more mana to advance from Level 2): pay {4}{G} during main phase.
    "Creatures you control get +4/+4."
  Total to reach Level 3: {1}{G} (cast) + {1}{G} (Level 2) + {4}{G} (Level 3) = {6}{G}{G}.
  But: Level 3 also gives all creatures +4/+4 which is enormous.
  This Class scales with investment.

PALADIN CLASS ({1}{W}):
  Level 1: "If a creature you control attacks alone, it gets +2/+2 until end of turn."
  Level 2 ({1}{W}): "If a creature you control attacks alone, put a +1/+1 counter on it at the
    beginning of combat on your turn."
  Level 3 ({2}{W}{W}): "Creatures you control have first strike and lifelink."
  Level 3 cost: {1}{W} (cast) + {1}{W} (Level 2) + {2}{W}{W} (Level 3) = {4}{W}{W}{W}.
  A powerful end-game enchantment — but expensive to fully level.

ROGUE CLASS ({B}):
  Level 1: "Whenever you draw your second card each turn, target player mills two cards."
  Level 2 ({2}{B}): "Spells you cast cost {1} less if an opponent has eight or more cards in
    their graveyard."
  Level 3 ({2}{B}): "At the beginning of your end step, if an opponent has fifteen or more cards
    in their graveyard, each opponent loses half their life, rounded up."
  This class has a built-in game win condition at Level 3.

WIZARD CLASS ({2}{U}):
  Level 1: "Instant and sorcery spells you cast have jump-start."
  Level 2 ({1}{U}{U}): "When this Class reaches Level 2, draw two cards, then discard a card."
  Level 3 ({U}{U}): "If you would draw a card except for the first one you draw in each of your
    draw steps, instead draw two cards."
  Level 3 doubles most card draws (a massive card advantage engine).

IMPORTANT RULES INTERACTIONS:
  REMOVAL WHILE ADVANCING:
    Opponent destroys the Class in response to your leveling activation:
    The activation is on the stack. The Class leaves the battlefield.
    Activation resolves: "This Class's level becomes 2" — but the Class is gone.
    The effect has no target (the class is gone). Nothing happens.
    You spent the mana with no result. You also lost the Class.
    LESSON: Level up with care when opponents have open mana for removal.
  BOUNCING A CLASS:
    Class bounced back to hand (e.g., Unsummon): goes to hand. Loses level designation.
      Actually: the level designation is on the permanent. When it leaves the battlefield:
        it's a new object (P003: zone change). The card in hand has no level (starts at Level 1 again).
      Re-cast it: it enters at Level 1. Must re-level from scratch.
    Exile + return: same result. Re-enters at Level 1.
  COPYING A CLASS:
    "Levels are not a copiable characteristic" (716.2b).
    A copy of a Class enters at Level 1 (no level from the original is copied).
    The copy has the same Level 1 abilities as the original but hasn't been leveled.
  CLASSES AND "ENCHANTMENT" SYNERGIES:
    Classes ARE enchantments. They have the Enchantment type.
    Constellation (Theros mechanic): triggers when an enchantment ETBs.
      Classes entering = triggers Constellation.
    Enchantress effects: draw when enchantments ETB. Classes ETBing = draw trigger.
    Classes themselves may have the Class subtype, but all are enchantments first.

LEVELER CARDS (702.87) vs. CLASS CARDS (716):
  COMPLETELY SEPARATE SYSTEMS (716.4):
    Leveler cards: creatures with "Level up" activated abilities.
      These put LEVEL COUNTERS on the creature.
      Level counters ARE counters — can be proliferated, are copiable in some ways.
    Class cards: enchantments with class level designations.
      These are NOT counters — not proliferable.
    "Level up" (702.87) is specifically for leveler cards.
    Class level bars (716.2) are specifically for Class enchantments.
    Spells that "put a level counter" on something: don't affect Classes.
    Spells that "refer to a permanent's level": 716.2d says treat without a level as Level 1.
    There is NO crossover between the two systems.
```

## Definitive Conclusions

- **Class cards start at Level 1 when they enter** — the Level 1 ability (top section) is always active; there is no "Level 0" state; 716.2d confirms anything without a level is treated as Level 1.
- **Leveling up is a sorcery-speed activated ability on the stack** — opponents can respond to it; if the class is destroyed in response, the activation resolves with no effect; can't skip levels (must be at N-1 to advance to N).
- **Levels are designations, not counters** — can't proliferate levels; can't copy levels; if a Class leaves the battlefield and re-enters, it starts at Level 1 again.
- **Level abilities are cumulative** — at Level 3, all three sections' abilities are active simultaneously; leveling up adds abilities, never removes previous ones.
- **Classes are completely separate from leveler cards** — level counters (702.87) and class levels (716) don't interact; "put a level counter" does nothing to a Class enchantment.

## Canonical Example
**Wizard Class Level-Up Sequence:**
Turn 2: Cast Wizard Class ({2}{U}). Enters at Level 1.
  Level 1 ability active: "Instant and sorcery spells you cast have jump-start."
  Now all your instants/sorceries can be cast from GY by discarding a card.

Turn 3: Mana available. Main phase, stack empty.
  Activate Level 2: pay {1}{U}{U}. This activated ability goes on the stack.
  Opponent has priority after you announce it — they could counter or destroy the class.
  Assuming no response: it resolves. Wizard Class is now Level 2.
  "When this Class reaches Level 2, draw two cards, then discard a card." (Triggered ability.)
  Draw 2, discard 1. You're up a card. Wizard Class at Level 2.
  Level 1 still active: instants/sorceries still have jump-start.
  Level 2 now active: "If you would draw a card except for the first one..." (wait, that's Level 3).
  Actually: Level 2 ability here is the triggered draw effect. Level 3 is the double-draw engine.

Turn 5: Activate Level 3: pay {U}{U}.
  Resolves: Wizard Class at Level 3.
  Level 3: "If you would draw a card except for the first one you draw in each of your draw steps,
    instead draw two cards."
  Now: every cantrip draws 2 instead of 1. Brainstorm draws 2+2+2 = 6? No:
    Brainstorm draws 3 cards. First draw: 1 card. Second draw: 2 cards (replaces). Third: 2 cards.
    Brainstorm now nets you 5 cards drawn. That's broken.
  Every Ponder, Preordain, etc.: one of their draws gets doubled.
  Plus: jump-start still active. All instants/sorceries can be replayed from GY.
  This Level 3 state is extremely powerful in any draw-heavy deck.

Total mana invested: {2}{U} (cast) + {1}{U}{U} (Level 2) + {U}{U} (Level 3) = {3}{U}{U}{U}{U}.
Seven mana total, spread across multiple turns, for the full benefit.

**Example 2 — Class Destroyed Mid-Leveling:**
You control Paladin Class at Level 1.
Main phase: activate Level 2 ({1}{W}). "This Class's level becomes 2" goes on the stack.
Opponent responds: Path to Exile targeting Paladin Class.
Path resolves: Paladin Class is exiled.
Your Level 2 activation resolves: "Paladin Class's level becomes 2." But Paladin Class is gone.
Nothing happens. You spent {1}{W} with no benefit.

After this: you can't recast Paladin Class from exile (no mechanism to).
The Class is permanently gone (unless you have another copy in hand).

Lesson: don't level up against opponents with mana up for instant-speed removal.
Or: use summoning sickness window cleverly — they might have already spent removal.
This is a real strategic consideration with Class cards in Commander.

## Commonly Confused With
- **P377 (Sagas)** — Both Sagas and Classes are enchantments that progress through "levels" of effects. Key difference: Sagas automatically advance (lore counters are added on each precombat main phase); Classes require manual activation with mana. Also: Sagas are sacrificed after the final chapter; Classes stay permanently at their final level.
- **P004 (Layer System)** — Class level abilities are continuous effects. If a Class grants "+2/+2 to creatures," that's a continuous effect. It applies in the appropriate layer as long as the Class is at the required level. Layer timing applies: timestamp order among Class abilities.
- **P003 (Zone Change — New Object)** — When a Class is bounced or exiled and returned to the battlefield, it's a new object (P003). The new permanent has no level designation — it starts at Level 1 again. All leveling progress is lost on any zone change.
- **P011 (ETB Triggers)** — Classes entering the battlefield trigger "when an enchantment enters" effects (Constellation, enchantress effects). The Level 2 activation of Wizard Class also has a triggered ability ("when this class reaches Level 2, draw two cards"). This trigger goes on the stack after the activation resolves.
