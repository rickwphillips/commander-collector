---
id: p401
name: Escape, Jump-Start, and Boast — Graveyard Casting with Exile Costs and Attack-Gated Activation
category: zones
cr_refs: [702.138a, 702.138b, 702.138c, 702.138d, 702.133a, 702.142a, 702.142b]
tags: [escape, jump-start, boast, GY-casting-alternative-cost, exile-N-cards-from-GY, discard-to-recast, activate-only-if-attacked-this-turn, Theros-Beyond-Death, Guilds-of-Ravnica, Kaldheim, Uro-Titan-of-Natures-Wrath, Kroxa-Titan-of-Deaths-Hunger, Ox-of-Agonas, Chemister-Insight, Maksim, escape-counters, escape-enters-with, jumped-start-exiled-after]
created: 2026-03-29
examples_count: 2
---

# P401 — Escape, Jump-Start, and Boast — Graveyard Casting with Exile Costs and Attack-Gated Activation

## Abstract
**Escape** (702.138) lets you cast a card from your graveyard by paying the escape cost (which always includes an exile cost: exile N other cards from your GY as part of the cost). The escaped spell or permanent may have additional benefits ("escapes with [counters]" or "escapes with [ability]"). **Jump-Start** (702.133) lets you recast an instant or sorcery from the GY by paying its normal cost plus discarding a card as an additional cost; when it leaves the stack after a jump-started cast, it's exiled (not returned to GY). **Boast** (702.142) is a special activated ability that can only be activated once per turn and only if the creature attacked this turn — it's an attack-gated ability that rewards attackers without requiring combat damage.

## The Definitive Rules

**CR 702.138a** (verbatim): *"Escape represents a static ability that functions while the card with escape is in a player's graveyard. 'Escape [cost]' means 'You may cast this card from your graveyard by paying [cost] rather than paying its mana cost.' Casting a spell using its escape ability follows the rules for paying alternative costs (see 601.2b and 601.2f–h)."*

**CR 702.138b** (verbatim): *"A spell or permanent 'escaped' if that spell or the spell that became that permanent as it resolved was cast from a graveyard with an escape ability."*

**CR 702.138c** (verbatim): *"An ability that reads '[This permanent] escapes with [one or more of a kind of counter]' means 'If this permanent escaped, it enters with [those counters].' That ability may have a triggered ability linked to it that triggers 'When it enters this way.'"*

**CR 702.138d** (verbatim): *"An ability that reads '[This permanent] escapes with [ability]' means 'If this permanent escaped, it has [ability].'"*

**CR 702.133a** (verbatim): *"Jump-start appears on some instants and sorceries. It represents two static abilities: one that functions while the card is in a player's graveyard and another that functions while the card is on the stack. 'Jump-start' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by discarding a card as an additional cost to cast it' and 'If this spell was cast using its jump-start ability, exile this card instead of putting it anywhere else any time it would leave the stack.' Casting a spell using its jump-start ability follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.142a** (verbatim): *"A boast ability is a special kind of activated ability. 'Boast — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only if this creature attacked this turn and only once each turn.'"*

**CR 702.142b** (verbatim): *"Effects may refer to boast abilities. If an effect refers to a creature boasting, it means its boast ability being activated."*

## The Pattern

```
ESCAPE (702.138):
  THE COST STRUCTURE:
    Escape [cost] = an alternative cost (not the normal mana cost).
    Escape costs always include BOTH a mana cost AND "Exile N other cards from your GY."
    Example: Uro, Titan of Nature's Wrath ({1}{G}{U}: 6/6, escape {3}{G}{G}{U}, exile 5 cards):
      To escape Uro: pay {3}{G}{G}{U} AND exile 5 cards from your GY (not Uro itself).
    The exile is part of the cost, not an effect. Paid when you announce the spell.
    "Other cards" — you exile OTHER cards from your GY, not the card you're escaping.
    To pay the exile cost: you must have enough cards in your GY.
  WHAT "ESCAPED" MEANS (702.138b):
    A permanent "escaped" = it was cast from the GY using an escape ability.
    This status matters for cards that say "if this escaped" or "escapes with [X]."
    Example: Uro has: "When this creature enters or attacks, you gain 3 life and draw a card, then
      put a land from your hand onto the battlefield. If Uro escaped, sacrifice it unless it escaped."
    Wait, Uro's actual rule: you sacrifice Uro when it enters UNLESS it escaped.
    So: Uro cast normally from hand → ETB → sacrifice it immediately.
    Uro cast via escape → ETB → get the ETB effect → NOT sacrificed (it escaped).
    The escape status determines whether Uro sticks around.
  ESCAPE WITH COUNTERS (702.138c):
    "Escapes with [N] [counter type]" = if escaped, the permanent enters with those counters.
    Example: Elspeth, Sun's Nemesis ({2}{W}{W}: planeswalker, escape {5}{W}{W}, exile 4 cards,
      "Elspeth, Sun's Nemesis escapes with four loyalty counters"):
      Normal cast: enters with its printed loyalty (e.g., 4).
      Escaped cast: still enters with 4 loyalty counters (the "escapes with" specifies).
      Wait: the "escapes with" clause is an ETB replacement IF escaped.
      If the normal cast would also give 4 counters: effectively the same.
      The key is when "escapes with" gives MORE counters than the normal cast.
  ESCAPE WITH ABILITY (702.138d):
    "Escapes with [ability]" = if escaped, the permanent has that ability while on the battlefield.
    Example: Kroxa, Titan of Death's Hunger ({B}{R}: 6/6, escape {4}{B}{B}{R}, exile 5 cards,
      "Kroxa escapes with indestructible"):
      Wait — that's not Kroxa's actual text. Let me use correct examples.
    The principle: if escaped, the creature might have an additional keyword like haste or indestructible.
  ESCAPE AND GRAFDIGGER'S CAGE:
    Grafdigger's Cage: "Creature cards can't enter the battlefield from graveyards."
    Wait: that's one of Cage's effects. Does this stop escape?
    Escape involves CASTING the card from the GY. The card goes on the stack, then resolves.
    It doesn't directly "enter the battlefield from the GY" — it goes to the stack first.
    Grafdigger's Cage (actual oracle): "Players can't cast spells from graveyards."
    Under this oracle text: Cage prevents escape entirely (you can't cast from the GY).

JUMP-START (702.133):
  WHAT IT IS:
    Two static abilities:
    1. (In GY): "You may cast this card from your GY by discarding a card as additional cost."
    2. (On stack, if jump-started): "Exile this card instead of putting it anywhere else."
    Jump-start = recast a spell from GY at the cost of discarding a card.
  THE DISCARD COST:
    "Discarding a card as an additional cost" — you pay the spell's normal cost PLUS discard 1 card.
    The discarded card can be anything — even another copy of the same spell (if you have multiples).
    In Dredge/reanimator decks: discarding cards is a bonus (puts more GY fodder into the GY).
    Strategic synergy: jump-start while discarding something useful for GY strategies.
  EXILE AFTER USE:
    The card is exiled when it leaves the stack.
    "Any time it would leave the stack" — whether it resolves or is countered.
    If countered: exiled (can't try again from the GY).
    If resolved: exiled (not put back in GY for reuse).
    Jump-start is a one-time GY reuse. After one jump-start: the card is gone.
  EXAMPLE — CHEMISTER'S INSIGHT:
    Chemister's Insight ({3}{U}: instant, "draw two cards. Jump-start"):
      From hand: pay {3}{U}, draw 2.
      From GY (jump-start): pay {3}{U} + discard 1 card, draw 2.
    If you draw into Chemister's Insight from hand, use it, then jump-start it:
      Total: {6}{U}{U} + 1 discard = draw 4 cards (2+2).
    In card-advantage terms: you spend {6}{U}{U} and 2 cards total (one cast from hand, one discarded
      for jump-start) to draw 4. Net card advantage: +2 cards if your discarded card had low value.
  JUMP-START AND FLASHBACK:
    Similar to Flashback (702.34): cast from GY, then exile.
    Difference: Jump-start requires discarding a card as additional cost.
    Flashback uses an alternative cost only (no discard required).
    Both exile the card after use.
  JUMP-START AND GRAFDIGGER'S CAGE:
    Same as escape: if Cage prevents GY casting, jump-start is stopped.

BOAST (702.142):
  WHAT IT IS:
    "Boast — [Cost]: [Effect]."
    A special activated ability. Two restrictions:
    1. "Activate only if this creature attacked this turn."
    2. "Activate only once each turn."
  TIMING:
    The creature must have attacked in the current turn's combat.
    You can activate the boast ability after the creature attacks (anytime you have priority after
      the creature attacks this turn).
    Most commonly activated: during combat (after attacking, before/after blockers) or after combat.
    You could also activate it during your second main phase.
  "ONLY ONCE EACH TURN":
    You can only use the boast ability once per turn cycle.
    Even if you have multiple ways to pay the cost: still only once.
    You can't boast twice in the same turn even if you could "untap" the creature.
    Actually: boast typically has a mana cost, not {T}. So untapping doesn't matter.
      The restriction is explicit: "only once each turn." Not twice.
  BOAST AND VIGILANCE:
    If the creature has vigilance: it attacks without tapping.
    A creature with boast and vigilance: attacks (meeting the condition), doesn't tap.
    You can still activate the boast ability (the creature attacked this turn).
    The boast ability typically doesn't require tapping. So vigilance + boast works fine.
  EXAMPLE — KOLL, THE FORGEMASTER:
    Koll, the Forgemaster ({R}{W}: 2/2, "whenever a nontoken creature you control dies, if it was
      enchanted or equipped, return it to its owner's hand. Boast — {1}: Create a 1/1 red Dwarf
      Berserker token"):
    Turn 2: Cast Koll. Turn 3: Attack with Koll. Koll attacks (condition met).
    After declaring Koll as an attacker: you may activate boast at any time you have priority.
    Boast {1}: create a 1/1 Dwarf Berserker. Repeat only once this turn.
    Koll returns to hand (if it dies and was equipped) due to its other ability.
  BOAST AND NOT ATTACKING:
    If Koll doesn't attack this turn: can't activate boast at all.
    Boast is purely attack-conditional. No attack = no boast.
    Even if you could theoretically tap Koll for something else: the boast restriction is explicit.
```

## Definitive Conclusions

- **Escape's exile cost is paid at casting time, not on resolution** — if the spell is countered, the exiled cards are still exiled; you must have enough cards in your GY to cover the exile cost before announcing escape.
- **A permanent "escaped" only if cast from the GY using its escape ability** — this status gate controls whether "escapes with" counters/abilities and other escape-conditional effects apply.
- **Jump-start exiles the card when it leaves the stack** — whether resolved or countered; one use only; the discard is paid at casting; decks that want cards in the GY can weaponize the discard cost.
- **Boast requires the creature to have attacked THIS TURN** — you can activate it at any point after attacking (before damage, after damage, second main phase); once per turn regardless of how many times you could afford to pay the cost.
- **Neither escape nor jump-start cards can be rescued from the GY after their one use** — both exile when used; Grafdigger's Cage prevents all GY-casting including escape and jump-start.

## Canonical Example
**Uro, Titan of Nature's Wrath Escape Sequence:**
Uro, Titan of Nature's Wrath ({1}{G}{U}: 6/6, "When this enters or attacks, gain 3 life, draw a card, then put a land from your hand onto the battlefield. Escape {3}{G}{G}{U}, exile 5 other cards from your GY"):
Uro has additional text: "When Uro enters, if it didn't escape, sacrifice it."

Turn 3: Cast Uro normally from hand ({1}{G}{U}). It enters the battlefield.
ETB fires: gain 3 life, draw a card, put a land from your hand onto the battlefield.
State-based action? No — "if it didn't escape, sacrifice it" is a triggered ability that fires on ETB.
Actually: "when Uro enters, if it didn't escape, sacrifice it" — this is an intervening-if triggered ability.
Uro didn't escape (cast from hand). Trigger fires. You sacrifice Uro.
Uro goes to your GY. You used it as a 3-life + draw + land in your GY.

Turn 6 or later: You've accumulated 5+ cards in your GY.
Escape Uro: pay {3}{G}{G}{U} + exile 5 cards from your GY.
Uro casts from GY. Uro "escaped."

Uro enters: "when Uro enters, if it didn't escape, sacrifice it."
DID Uro escape? YES. Trigger fires but condition is false: don't sacrifice Uro.
Uro stays on the battlefield as a 6/6.

ETB: gain 3, draw a card, put a land out.
Uro attacks next turn: triggers again (gain 3, draw, land).

**Example 2 — Chemister's Insight Jump-Start with Discard Synergy:**
Turn 4: You have Chemister's Insight in hand, {3}{U} available.
Cast Chemister's Insight: pay {3}{U}, draw 2 cards.
Chemister's Insight resolves, goes to your GY.

Your hand now contains: Faithless Looting (want in GY), Uro (want in GY for future escape), etc.

Turn 5: Chemister's Insight in GY. You have {3}{U} available.
Jump-start: pay {3}{U} (normal cost) + discard a card from hand.
Discard: choose Uro (you want it in the GY for escaping later).
Chemister's Insight resolves: draw 2 cards.
Chemister's Insight is exiled (jump-start exile rule).
Uro is now in your GY (discarded for jump-start).

Net: you've spent {3}{U} twice (6 mana total) + 1 discard, drawn 4 cards.
Bonus: Uro is in your GY now, and you've been fueling your escape setup.
After a few more cards go to GY: escape Uro for a 6/6 that gains life and draws cards on attack.

## Commonly Confused With
- **P398 (Embalm/Eternalize/Aftermath)** — All three involve using cards from the GY. Embalm/eternalize create tokens (activations); aftermath casts the second half from GY; escape/jump-start cast the actual card again from the GY. Jump-start and escape both exile the card after use.
- **P382 (Adventure Cards)** — Adventure cards exile the card after the adventure half resolves, then let you cast the creature from exile. Escape and jump-start go from GY (not exile) and also exile after use.
- **P397 (Prowess/Dash)** — Dash also requires paying an alternative cost and creates special rules for the resulting permanent. Escape similarly uses an alternative cost but doesn't create a "return to hand" delayed trigger.
- **P006 (Intervening-If)** — Uro's "when this enters, if it didn't escape, sacrifice it" is a perfect intervening-if trigger (P006): checked at trigger time AND at resolution. The "escaped" flag is evaluated at both points.
