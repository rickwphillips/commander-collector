---
id: p396
name: Bestow and Tribute — Enchantment Creatures as Auras and Opponent Counter Choices
category: zones
cr_refs: [702.103a, 702.103b, 702.103c, 702.103d, 702.103e, 702.103f, 702.104a, 702.104b]
tags: [bestow, tribute, enchantment-creature, bestowed-aura, target-becomes-illegal-enters-as-creature, alternative-cost-enchantment, opponent-chooses-counters, tribute-wasnt-paid, Theros, Nylea-God-of-the-Hunt, Boon-Satyr, Eidolon-of-Blossoms, Nighthowler, Polukranos, Flame-Scorned-Shaman, aura-that-can-be-creature, creature-enchantment-both]
created: 2026-03-29
examples_count: 2
---

# P396 — Bestow and Tribute — Enchantment Creatures as Auras and Opponent Counter Choices

## Abstract
**Bestow** (702.103) is an alternative casting mode for enchantment creatures: pay the bestow cost instead of the normal mana cost, and the spell becomes an Aura that enchants a creature. If the enchanted creature leaves the battlefield while the Aura is attached (or the Aura becomes unattached for any reason), it ceases to be bestowed and immediately becomes a creature. Critically: if the bestow Aura's target is illegal when the spell resolves, instead of being countered (like a normal Aura), the bestow spell instead continues resolving as a creature spell. **Tribute N** (702.104) is an ETB static effect: as the tribute creature enters, you choose an opponent; that opponent may put N additional +1/+1 counters on the creature. If the opponent declines, the tribute creature's abilities that check "if tribute wasn't paid" trigger. The opponent essentially chooses between letting the creature be bigger or letting you get a powerful bonus effect — a classic "opponent's choice" dilemma.

## The Definitive Rules

**CR 702.103a** (verbatim): *"Bestow represents a static ability that functions in any zone from which you could play the card it's on. 'Bestow [cost]' means 'As you cast this spell, you may choose to cast it bestowed. If you do, you pay [cost] rather than its mana cost.' Casting a spell using its bestow ability follows the rules for paying alternative costs (see 601.2b and 601.2f–h)."*

**CR 702.103b** (verbatim): *"As a spell cast bestowed is put onto the stack, it becomes an Aura enchantment and gains enchant creature. It is a bestowed Aura spell, and the permanent it becomes as it resolves will be a bestowed Aura. These effects last until the spell or the permanent it becomes ceases to be bestowed."*

**CR 702.103e** (verbatim): *"As a bestowed Aura spell begins resolving, if its target is illegal, it ceases to be bestowed and the effect making it an Aura spell ends. It continues resolving as a creature spell. See rule 608.3b."*

**CR 702.103f** (verbatim): *"If a bestowed Aura becomes unattached, it ceases to be bestowed. If a bestowed Aura is attached to an illegal object or player, it becomes unattached and ceases to be bestowed. This is an exception to rule 704.5m."*

**CR 702.104a** (verbatim): *"Tribute is a static ability that functions as the creature with tribute is entering the battlefield. 'Tribute N' means 'As this creature enters, choose an opponent. That player may put an additional N +1/+1 counters on it as it enters.'"*

**CR 702.104b** (verbatim): *"Objects with tribute have triggered abilities that check 'if tribute wasn't paid.' This condition is true if the opponent chosen as a result of the tribute ability didn't have the creature enter the battlefield with +1/+1 counters as specified by the creature's tribute ability."*

## The Pattern

```
BESTOW (702.103):
  THE TWO MODES:
    Mode A (normal cast): pay normal mana cost. The spell is a creature spell.
      It enters the battlefield as an Enchantment Creature.
    Mode B (bestow cast): pay the bestow cost (usually higher). The spell becomes an Aura spell.
      It targets a creature. If it resolves: it enchants that creature.
      It's an Aura AND still has all of its printed abilities.
  THE BESTOWED AURA ON THE BATTLEFIELD:
    A bestow card cast bestowed enters the battlefield as an Aura.
    It has "enchant creature" (gains this when cast bestowed).
    It still has all of its printed text (abilities, creature type, etc.).
    But: while it's a bestowed Aura, its P/T is not relevant (it's an Aura, not a creature).
      The Aura grants its abilities/bonuses to the enchanted creature.
  WHEN THE BESTOWED AURA BECOMES A CREATURE (702.103f):
    "If a bestowed Aura becomes unattached, it ceases to be bestowed."
    Becoming unattached happens when:
      - The enchanted creature leaves the battlefield (dies, exiled, bounced, etc.)
      - The Aura is somehow removed from the creature (an effect that "unattaches" an Aura)
      - The enchanted creature becomes an illegal enchant target
    When it ceases to be bestowed: "it becomes a creature permanent."
    The card stops being an Aura and becomes a creature.
    It's now on the battlefield as an Enchantment Creature (its normal form).
  TARGET BECOMES ILLEGAL DURING RESOLUTION (702.103e):
    CRITICAL RULE: unlike normal Aura spells, a bestow Aura spell that loses its target on the way
      to resolution does NOT get countered for illegal target.
    Normal Aura: "if target is illegal, the spell is countered for illegal target" (rule 608.3b).
    Bestow Aura: "if target is illegal at resolution, it ceases to be bestowed and continues
      resolving as a creature spell."
    This means: even if an opponent kills your target in response to the bestow spell:
      The bestow Aura resolves as a creature. You still get a creature.
    This is the key resilience of bestow: it can never truly be "countered" by removing the target.
    (You do lose the enchantment buff, but you still get the creature.)
  BESTOW AND ETB TRIGGERS:
    When a bestow card enters as a creature (either mode A, or after becoming unattached):
      ETB triggers fire. If it has "when this enters..." — it fires.
    When a bestow card is cast bestowed and becomes a bestowed Aura:
      It enters the battlefield as an Aura. If it has "when this enters as an Aura...": fires.
      If it just says "when this creature enters": doesn't fire (it's not a creature entering — it's an Aura).
      Wait: 702.103b: "becomes an Aura enchantment." When on the battlefield as a bestowed Aura,
        it's an Aura (not a creature). Standard ETB triggers that say "when this creature enters"
        don't fire when it enters as an Aura.
      But: Eidolon of Blossoms ({2}{G}{G}: 2/2, "whenever an enchantment enters under your control,
        draw a card"):
        When any enchantment (including a bestow Aura) enters under your control: draw a card.
        A bestow Aura entering the battlefield IS an enchantment entering. Eidolon triggers.
  BESTOW CASTING AND "CAN CAST CREATURE SPELLS":
    702.103d: "Only its characteristics as modified by the bestow ability are evaluated to determine
      if it can be cast [bestowed]."
    "Aether Storm: creature spells can't be cast." Does this prevent bestow?
      No! When cast bestowed, the spell is an Aura spell (not a creature spell). Aether Storm doesn't apply.
    "You may cast creature spells from the top of your library." (Garruk's Horde effect.)
      Does this let you cast bestow from the top? Only as a CREATURE spell.
      You can cast it as a creature (paying normal cost), not as a bestow Aura from that permission.
      To cast it bestowed from the top: you'd need explicit permission to cast Aura spells.

TRIBUTE (702.104):
  THE MECHANIC:
    As this creature enters: choose an opponent. That opponent may put N +1/+1 counters on it.
    This is a static ability (ETB replacement-like effect). It's not a triggered ability.
    The chosen opponent DECIDES. They are not forced to do either; they "may."
    If they put the counters on it: "tribute was paid." The creature is larger.
    If they don't: "tribute wasn't paid." Triggered abilities on the card that check this condition fire.
  THE "TRIBUTE WASN'T PAID" CONDITION (702.104b):
    Objects with tribute have triggered abilities referencing this condition.
    These triggered abilities fire AFTER the creature enters (when the condition is true).
    If tribute was paid: those abilities DON'T trigger (condition is false).
    If tribute wasn't paid: those abilities trigger.
    The abilities go on the stack after the creature is on the battlefield.
  THE OPPONENT'S DILEMMA:
    The opponent must choose between:
      Option A: Put N counters on the creature → you get a bigger creature, but no bonus effect.
      Option B: Don't put counters → you get the bonus effect (often more powerful than the counters).
    The design intent: neither option is clearly correct. The opponent is always in a lose-lose.
    In practice: the tribute ability bonus is almost always more powerful than the counters.
      Players often don't pay tribute because the bonus ability is what makes tribute creatures strong.
    Example: Nessian Wilds Ravager ({4}{G}{G}: 6/6, tribute 6, "when this creature enters, if tribute
      wasn't paid, you may have this creature fight another target creature"):
      Option A: Opponent pays tribute → Nessian Wilds Ravager enters as 12/12. You get a massive creature.
      Option B: Opponent doesn't pay tribute → Ravager enters as 6/6. "If tribute wasn't paid"
        trigger fires → Ravager fights a target creature (kills something, or trades).
    Usually: opponent pays tribute to avoid the bonus (getting a 12/12 is often better than a 6/6 that
      immediately removes one of their threats).
    But some tribute cards: the bonus is SO good, the opponent must decide carefully.
  CHOOSING THE OPPONENT:
    "Choose an opponent." In 1v1: you must choose your sole opponent.
    In multiplayer: you choose ONE opponent. You might choose strategically:
      - Choose an opponent whose threat you want to remove (with "if tribute wasn't paid" ETB)
      - Or choose an opponent who is most likely to pay tribute (giving you a big creature)
  TRIBUTE N:
    N can be any number. Tribute 2 = 2 counters if paid. Tribute 5 = 5 counters if paid.
    Higher N: larger creature if paid, but the bonus ability is often proportionally better too.
  TRIBUTE WITH NO OPPONENTS:
    Can't happen in normal Commander/multiplayer. In 1v1: always one opponent to choose.
    If somehow you have no opponents: tribute ability can't complete? Very edge case.
  TRIBUTE AND REPLACEMENT EFFECTS:
    The counters are placed "as the creature enters" (it's an ETB static effect).
    If a replacement effect modifies how the creature enters (e.g., "this creature enters with an
      additional +1/+1 counter"):
      Multiple ETB modifications stack.
      Tribute's counters are in addition to other counters placed by other effects.
    If the creature has both tribute and unleash (hypothetical):
      You choose unleash first (your choice), then tribute (opponent's choice).
      All modifications applied as the creature enters.
```

## Definitive Conclusions

- **Bestow spells cast bestowed become Aura enchantments on the stack** — they target a creature; if the target is killed in response, the spell doesn't get countered (702.103e); it continues resolving as a creature instead.
- **A bestowed Aura that becomes unattached immediately becomes a creature** (702.103f) — this is an exception to the normal rule that unattached Auras go to the GY; bestow Auras stay on the battlefield as creatures.
- **ETBs on bestow cards don't fire when the card enters as an Aura** — only fire when entering as a creature (either normal cast or after becoming unattached); enchantment-ETB effects like Eidolon of Blossoms DO trigger (any enchantment entering).
- **Tribute's opponent has the choice** (702.104a) — they decide whether to pay; "if tribute wasn't paid" abilities fire when the opponent opts out; the design is a no-win scenario for the opponent.
- **Tribute is a static as-enters ability, not a triggered ability** — the counters are placed as the creature enters (ETB modification), not after; "tribute wasn't paid" is a triggered ability that fires after the creature is on the battlefield.

## Canonical Example
**Boon Satyr Bestow — Target Killed in Response:**
Boon Satyr ({1}{G}{G}: 4/2 Flash, bestow {3}{G}{G}):
You cast Boon Satyr bestowed (paying {3}{G}{G}) targeting your opponent's untapped 2/2 creature.
Wait — why target opponent's creature? You'd bestow your OWN creature for the buff.

Corrected example: Target your 3/3 Grizzly Bears.
Boon Satyr bestowed spell is on the stack. It's a bestowed Aura spell targeting Grizzly Bears.
Opponent casts Lightning Bolt killing Grizzly Bears in response. Target becomes illegal.

702.103e: "as a bestowed Aura spell begins resolving, if its target is illegal, it ceases to be bestowed."
Boon Satyr stops being a bestowed Aura spell. It continues resolving as a creature spell.
Boon Satyr enters the battlefield as a 4/2 Enchantment Creature.

Result: opponent used a removal spell to kill the target, but still got a 4/2 creature on their turn.
Bestow's resilience: you can't "waste" the spell by killing the enchant target.
Best play for opponent: kill Boon Satyr itself (if they can) rather than the target.

**Example 2 — Nessian Wilds Ravager Tribute 6:**
Nessian Wilds Ravager ({4}{G}{G}: 6/6, Tribute 6, "when this creature enters, if tribute wasn't paid, you may have this creature fight another target creature"):

You cast Nessian Wilds Ravager. As it enters: choose an opponent.
Opponent A has a 6/6 Dragon and a 2/2 Soldier.
Opponent A's choice: pay tribute (6 counters → 12/12) OR let you fight a creature with a 6/6.

Option A (pay tribute): Ravager enters as 12/12. You get a massive creature but no fight effect.
Option B (don't pay tribute): Ravager enters as 6/6. "Tribute wasn't paid" trigger fires.
  "When this creature enters, if tribute wasn't paid, you may have this creature fight another target creature."
  You choose: fight the 2/2 Soldier (Ravager kills it, takes 2 damage), or fight the 6/6 Dragon.
  If you fight the Dragon: Ravager and Dragon deal their damage to each other simultaneously.
  6/6 Ravager vs 6/6 Dragon: both take 6 damage. Both die (toughness = 6 = lethal).
  Ravager removes the Dragon, trading itself. Net result: two threats removed for one spell.

In Commander with multiple opponents, you choose the opponent for tribute strategically:
  - Choose the opponent who will most likely NOT pay tribute (so you get the fight effect against their best threat).
  - Or choose the opponent with the highest-value tribute targets.

## Commonly Confused With
- **P382 (Adventure Cards)** — Both bestow and Adventure cards have two casting modes from hand. Adventure spells exile the card then let you cast the creature; bestow directly becomes an Aura or creature. Both follow alternative cost rules.
- **P394 (Renown/Awaken/Devoid)** — Awaken also uses an alternative cost; bestow uses an alternative cost that changes the card to an Aura. Both modify how the spell resolves, but awaken animates a land; bestow makes an enchantment creature into an Aura.
- **P380 (Voting)** — Tribute involves an opponent making a choice. Council's Dilemma (voting) similarly involves opponent choices. The key difference: tribute is one opponent's binary choice (pay/don't pay); voting involves all players choosing simultaneously with majority outcomes.
- **P011 (ETB Triggers)** — Bestow cards don't trigger creature-ETBs when entering as Auras. Understanding which ETBs fire in which entry mode is a core P011 application.
