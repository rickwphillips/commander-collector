---
id: p371
name: Bestow, Tribute, and Dash — Alternative-Cost Creatures with Conditional Outcomes
category: stack
cr_refs: [702.103a, 702.103b, 702.103e, 702.103f, 702.104a, 702.104b, 702.109a]
tags: [bestow, tribute, dash, alternative-cost, aura-creature, enchant-creature, illegal-target-fallback, tribute-not-paid, haste-from-dash, returns-at-end-step, Doomwake-Giant, Nighthowler, Nessian-Demolok, Zurgo-Bellstriker, Ankle-Shanker, bestow-falls-off, Aura-from-creature]
created: 2026-03-29
examples_count: 2
---

# P371 — Bestow, Tribute, and Dash — Alternative-Cost Creatures with Conditional Outcomes

## Abstract
**Bestow** (702.103a) lets you cast an enchantment creature as an Aura instead of a creature, paying the bestow cost: the spell becomes an Aura enchantment that enchants a creature. If the enchanted creature dies, the bestow Aura stops being an Aura and becomes a creature instead of going to the GY (702.103f). If the target is illegal when the bestowed Aura begins resolving, it also falls off and becomes a creature (702.103e). **Tribute** (702.104a) is an ETB static ability: choose an opponent, they may put N +1/+1 counters on the creature as it enters. Objects with tribute have conditional abilities checking "if tribute wasn't paid" — if the opponent declined counters, you get a usually-powerful effect instead. **Dash** (702.109a) is an alternative casting cost: you may cast the creature for the dash cost; if you do, it enters with haste, and at the beginning of the next end step it's returned to your hand. Dash creatures are "temporary aggro" — attack once, go back to hand, cast again next turn.

## The Definitive Rules

**CR 702.103a** (verbatim): *"Bestow represents a static ability that functions in any zone from which you could play the card it's on. 'Bestow [cost]' means 'As you cast this spell, you may choose to cast it bestowed. If you do, you pay [cost] rather than its mana cost.'"*

**CR 702.103b** (verbatim): *"As a spell cast bestowed is put onto the stack, it becomes an Aura enchantment and gains enchant creature. It is a bestowed Aura spell, and the permanent it becomes as it resolves will be a bestowed Aura. These effects last until the spell or the permanent it becomes ceases to be bestowed."*

**CR 702.103e** (verbatim): *"As a bestowed Aura spell begins resolving, if its target is illegal, it ceases to be bestowed and the effect making it an Aura spell ends. It continues resolving as a creature spell. See rule 608.3b."*

**CR 702.103f** (verbatim): *"If a bestowed Aura becomes unattached, it ceases to be bestowed. If a bestowed Aura is attached to an illegal object or player, it becomes unattached and ceases to be bestowed. This is an exception to rule 704.5m."*

**CR 702.104a** (verbatim): *"Tribute is a static ability that functions as the creature with tribute is entering the battlefield. 'Tribute N' means 'As this creature enters, choose an opponent. That player may put an additional N +1/+1 counters on it as it enters.'"*

**CR 702.109a** (verbatim): *"Dash represents three abilities... 'Dash [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's dash cost was paid, return the permanent this spell becomes to its owner's hand at the beginning of the next end step,' and 'As long as this permanent's dash cost was paid, it has haste.'"*

## The Pattern

```
BESTOW (702.103a–g):
  WHAT IT IS:
    A static ability on enchantment creatures.
    Two ways to cast:
      Normal: pay mana cost. Enters as a creature (with enchantment type).
      Bestowed: pay bestow cost. Becomes an Aura enchantment targeting a creature.
    The bestow cost is typically higher than the normal mana cost.
    (You pay extra for the Aura ability; or you're "double-dipping" since it can fall off and become a creature.)
  AS AN AURA (702.103b):
    When cast bestowed: becomes an Aura enchantment with "enchant creature."
    You must choose a legal target (a creature). Normal targeting rules apply.
    On resolution: attaches to the enchanted creature. Gives that creature the bestow card's abilities/P/T bonuses.
    The bestow card is NOT a creature while it's an attached Aura (it's an enchantment).
  WHEN THE TARGET DIES (702.103f):
    The bestow Aura is attached to a creature. That creature dies (goes to GY).
    The Aura becomes "unattached."
    "If a bestowed Aura becomes unattached, it ceases to be bestowed."
    Ceasing to be bestowed: the enchantment-becoming-Aura effect ends.
    It's no longer an Aura. It's now a creature (its natural card type).
    "Except to rule 704.5m": normally an unattached Aura goes to the GY (SBA 704.5m).
    But bestow overrides this: a bestowed Aura that becomes unattached becomes a creature instead.
    It enters the battlefield as a creature.
    This is the KEY BENEFIT of bestow: "Aura" that becomes a creature if the enchanted creature dies.
    No card disadvantage — the bestow card stays as a creature.
  WHEN TARGET IS ILLEGAL AT RESOLUTION (702.103e):
    You cast the bestow Aura targeting a creature. Opponent kills the creature in response.
    When the Aura spell "begins resolving" (608.3b): target is illegal.
    702.103e: "it ceases to be bestowed and the effect making it an Aura spell ends."
    "It continues resolving as a creature spell."
    Result: enters the battlefield as a creature (not as an Aura attaching to anything).
    No wasted cast — you still get the creature.
  BESTOW AND ETB TRIGGERS:
    When bestowed Aura falls off and becomes a creature: does it trigger ETB?
    Yes: it's entering the battlefield (as a creature). ETB triggers fire.
    The card that was an Aura is now a creature entering the battlefield — it's a new object entering.
    ETB triggers on the bestow creature fire when it falls off and enters.
  EXAMPLES:
    Nighthowler ({1}{B}{B}): "Bestow {2}{B}{B}. Nighthowler's power and toughness are each equal to the number of creature cards in all graveyards." (Bestowed: enchanted creature gets +X/+X.)
    Nessian Demolok ({3}{G}{G}): "Tribute 3. When this enters, if tribute wasn't paid, destroy target noncreature permanent." (3/3 with tribute; does NOT have bestow.)
    Doomwake Giant ({4}{B}): 4/6 Enchantment Creature — Giant. "Constellation — Whenever this creature or another enchantment you control enters, creatures your opponents control get -1/-1 until end of turn."
      Does NOT have bestow. It's an enchantment creature (triggers constellation on entry).
      The constellation effect is -1/-1 (not -1/-0).
  BESTOW AND AURA SYNERGIES:
    When cast bestowed: it IS an Aura. Cards that count Auras (Kor Spiritdancer) count it.
    When on the battlefield as a creature: it's NOT an Aura. Kor Spiritdancer doesn't count it.
    While attached: gives the enchanted creature the bestow creature's keywords and P/T boost.
    The attached card's power and toughness become buffs to the enchanted creature (not the Aura itself — Auras don't have P/T per se).

TRIBUTE (702.104a–b):
  WHAT IT IS:
    Static ability that fires "as this creature enters."
    Effect: choose an opponent. They MAY put N +1/+1 counters on the creature.
    It's a CHOICE for the opponent.
    "If tribute wasn't paid" abilities: the opponent declining to put counters triggers your bonus effect.
  THE CHOICE:
    Opponent faces a dilemma:
      Pay tribute (put +1/+1 counters): creature is bigger and more dangerous.
      Don't pay tribute: creature is smaller, but you get a triggered bonus effect.
    Classic "lose-lose" design: one of the two outcomes is always bad for the opponent.
    The "tribute wasn't paid" ability is usually so powerful that paying tribute is the lesser evil.
  EXAMPLES:
    Nessian Wilds Ravager ({4}{G}{G}): 6/6. "Tribute 6. When this enters, if tribute wasn't paid, you may have this creature fight another target creature."
      Opponent: pay 6 +1/+1 counters (creature is 12/12) OR let you fight any creature with a 6/6.
      Both bad for opponent. You choose the lesser evil for them.
    Nessian Demolok ({3}{G}{G}): 3/3. "Tribute 3. When this enters, if tribute wasn't paid, destroy target noncreature permanent."
      Pay tribute → 6/6. Don't pay → you destroy their key noncreature permanent.
    Fire-Field Ogre ({U}{B}{R}): no tribute. But similar "dilemma" design precedes tribute.
  TRIBUTE AND MULTIPLAYER:
    "Choose an opponent" — in Commander, you choose ONE of potentially 3 opponents.
    That one opponent makes the tribute decision.
    The others don't get to vote.

DASH (702.109a):
  WHAT IT IS:
    Alternative casting cost with three built-in effects:
    1. Pay dash cost instead of normal cost.
    2. If dash cost was paid: haste (can attack the turn it enters).
    3. If dash cost was paid: return to hand at beginning of next end step.
  DESIGN PURPOSE:
    Dash creatures are meant to be "temporary aggro":
      Pay dash cost → attack immediately → return to hand → cast again next turn.
      Recurring damage without keeping the creature on the battlefield to be killed.
    Can also be cast for normal cost if you want to keep it.
    Dash cost is usually lower than normal cost (incentivizing the temporary use).
  THE RETURN TRIGGER:
    "At the beginning of the next end step": delayed triggered ability created when the creature enters.
    "The permanent this spell becomes" — specifically tied to that permanent.
    If the creature dies before end of turn: the trigger still fires at end of turn, but
      the permanent is no longer on the battlefield. Trigger has no object to return.
      Result: nothing happens. The creature is in the GY (not returned).
    If the creature changes zones before end step: the return trigger looks for it.
      New object rule: if the creature left the battlefield and came back, it's a new object.
      The trigger was created for the specific permanent that the dash spell became.
      That specific permanent is gone. Return trigger fails (can't find the old permanent).
      The creature stays wherever it is (most likely GY or new zone).
  DASH EXAMPLES:
    Zurgo Bellstriker ({R}): "Dash {1}{R}. Zurgo Bellstriker can't block." 2/2.
      Normal cast: {R}. Permanent 2/2. Can attack next turn. No haste.
      Dash: {1}{R}. Haste. Attack immediately. Return at end step.
      With dash: costs 1 more but attacks THIS turn. Then returns to hand to dash again next turn.
    Ankle Shanker ({2}{R}{W}{B}): "Dash {2}{R}{W}{B}. When this attacks, attacking creatures gain
      first strike, deathtouch, and lifelink until end of turn."
      Dash for same cost as normal. But with haste: attack the same turn. Then return to hand.
      Every turn you dash: your entire attack gets first strike, deathtouch, lifelink.
  DASH AND "WHEN THIS ENTERS":
    ETB triggers fire normally when a dashed creature enters. Nothing special.
    If the creature has an ETB: you get it every time you re-cast it (every turn).
    Dashing a creature with a strong ETB repeatedly = recurring ETB value.
  DASH AND COMMANDER:
    Dashing your commander: it has haste, attacks, returns to hand at end step.
    Next turn: dash again (same cost — commander tax doesn't apply since it went to hand, not command zone).
    If the commander would die: you can redirect to command zone instead of GY.
      But if you redirect to command zone: the return trigger fails (commander is in command zone, not the same permanent).
      Command zone redirect = the dash return trigger can't return it. It stays in command zone.
      Next cast: costs commander tax.
    If the commander returns to hand (dash trigger): next cast is from hand, same cost (no tax).
    KEEP IN HAND: dash commanders want to avoid dying (return to hand for free repeat).
```

## Definitive Conclusions

- **Bestow's key feature: if the enchanted creature dies, the bestow card becomes a creature** — instead of going to the GY like a normal Aura, it falls off and enters the battlefield as a creature; no card disadvantage.
- **If a bestow spell's target is illegal at resolution, it becomes a creature anyway** — the spell "falls back" to creature resolution; you always get the creature.
- **Tribute lets the chosen opponent put +1/+1 counters on the creature** — the "tribute wasn't paid" effect fires only if they declined; designed as a lose-lose dilemma.
- **Dash creatures enter with haste and return at end of turn** — the return is a delayed triggered ability; if the creature dies first, there's nothing to return; if it changes zones, the trigger fails to find it.
- **Dashing a commander keeps commander tax at bay** — when it returns to hand (not command zone), it's in hand and cast from hand for the dash cost (no accumulated tax).

## Canonical Example
**Nighthowler Bestowed — Target Dies:**
GY has 8 creature cards total. Nighthowler's P/T = 8/8 (it would be huge).
You cast Nighthowler bestowed ({2}{B}{B}) targeting your 3/3 Soldier.
Nighthowler is on the stack as a bestowed Aura (targeting the Soldier).
Opponent casts Doom Blade on the Soldier in response.
Soldier dies. Now Nighthowler's target (the Soldier) is gone before Nighthowler resolves.

At the beginning of resolution: target is illegal (Soldier is in GY).
702.103e: Nighthowler ceases to be bestowed. Effect making it an Aura ends.
It continues resolving as a creature spell.
Result: Nighthowler enters the battlefield as an 8/8 creature (with 8 creature cards in GY).

You still got a huge creature despite the target being killed. No card wasted.
If you had cast it as a normal creature ({2}{B}): opponent would have Doom Bladed it later, and you'd have nothing.
Bestow vs. Doom Blade: bestow is resilient — even if the enchanted target is killed in response, you get the creature.

**Example 2 — Zurgo Bellstriker Dash Loop:**
You're playing an aggressive red deck in Modern. Hand: Zurgo Bellstriker, Mountains.
Turn 1: Cast Zurgo Bellstriker ({R}): 2/2, can't block. Enters normally (no haste, no dash).
  Can't attack this turn (summoning sickness). Stays on battlefield.

Instead, try the dash approach:
Turn 1: Dash Zurgo Bellstriker ({1}{R}): haste. Attacks opponent for 2 damage.
  End of turn: return trigger fires. Zurgo returns to your hand.
Turn 2: Dash again ({1}{R}): haste. Attacks for 2 more damage. Opponent at 16. Return to hand.
Turn 3: Dash ({1}{R}): attack for 2. Opponent at 14. Return.

Every turn: {1}{R} (2 mana) for 2 damage. Total: 10 damage after 5 turns for {1}{R} × 5 = 10 mana.
Compare: normal cast ({R}) on turn 1, attacks turn 2 onward for 2 per turn. Can be killed.
Dash: spends 1 extra mana per attack but is NEVER on the battlefield for opponents to kill on their turn.
Opponent can never kill it (it's in your hand during their turn).
Excellent against control decks that might Swords to Plowshares or Counterspell your creatures.

If opponent kills Zurgo during combat (blocks and trades):
  At end of turn: return trigger fires. Zurgo is in GY (not on battlefield).
  Return trigger fails to return it. Nothing happens.
  Zurgo stays in GY.

## Commonly Confused With
- **P354 (Equipment/Auras)** — Bestowed cards are Auras while attached. Normal Aura rules apply (goes to GY when enchanted permanent ceases to exist) — EXCEPT for bestow (702.103f overrides the normal Aura rule and makes it become a creature instead). Normal non-bestow Auras always go to GY.
- **P011 (ETB Triggers)** — When a bestow Aura falls off and becomes a creature (702.103f), it enters the battlefield, triggering ETB abilities. This is a new ETB event even though the bestow card was "already on the battlefield" as an Aura.
- **P357 (Companion)** — Tribute and dash are both "opponent makes a decision" or "you make a decision" designs. Companion's deckbuilding restriction is checked by the player, not an opponent. Not directly related.
- **P362 (Storm/Cascade)** — Cascade can find bestow creatures (if MV qualifies). When cascaded into, bestow creatures are cast as normal creatures (not bestowed) unless you specifically choose bestow. The choice of normal vs. bestow is made when casting — cascade gives you the option to cast it, and you then choose.
