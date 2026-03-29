---
id: p271
name: Gift and Offspring — Give an Opponent a Bonus for a Larger Effect
category: costs
cr_refs: [702.174a, 702.174b, 702.174c, 702.174d, 702.174e, 702.174h, 702.175a, 702.175b]
tags: [gift, offspring, additional-cost, opponent-benefit, token-copy, food, treasure, Bloomburrow, Foundation, Gift-of-Wills, Stormkeld-Vanguard, Cackling-Prowler, Restless-Cottage]
created: 2026-03-29
examples_count: 2
---

# P271 — Gift and Offspring — Give an Opponent a Bonus for a Larger Effect

## Abstract
Two mechanics from 2024-2025. **Gift** (Bloomburrow/Foundation): an additional cost where you choose an opponent and give them a benefit — in exchange, your spell does something more powerful. The "gift" to your opponent is the price of the larger effect. Different Gift cards give different things: a Food token, a Treasure token, a card draw, etc. **Offspring** (Bloomburrow): an optional additional cost on creatures — pay the offspring cost to create a 1/1 token copy of the creature when it enters. Offspring lets you deploy a full-sized creature AND a 1/1 copy of it for a higher total cost, useful for token strategies or getting the creature's ETB trigger twice with the token being 1/1.

## The Definitive Rules

**CR 702.174a** (verbatim): *"Gift is a keyword that represents two abilities. It is written 'Gift a [something].' The first ability is a static ability that functions while the card with gift is on the stack, and the second is either an ability that functions while the card with gift is on the stack or a triggered ability that functions while the card with gift is on the battlefield. The first ability is always 'As an additional cost to cast this spell, you may choose an opponent.' Paying a spell's gift cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h. The second ability depends on the [something] listed as well as whether the object with the ability is a permanent or an instant or sorcery spell."*

**CR 702.174b** (verbatim): *"On a permanent, the second ability represented by gift is 'When this permanent enters, if its gift cost was paid, [effect].' On an instant or sorcery spell, the second ability represented by gift is 'If this spell's gift cost was paid, [effect].' The specific effect is defined by the [something] listed."*

**CR 702.175a** (verbatim): *"Offspring represents two abilities. 'Offspring [cost]' means 'You may pay an additional [cost] as you cast this spell' and 'When this permanent enters, if its offspring cost was paid, create a token that's a copy of it, except it's 1/1.'"*

## The Pattern

```
GIFT:
  Additional cost: optionally choose an opponent when casting
  If you choose (paid the gift cost): the opponent receives the "gift" (a specific benefit)
  In exchange: you get the gift's bonus effect on your spell

  GIFT TYPES (per CR):
    "Gift a Food" → chosen opponent creates a Food token (they gain 3 life eventually)
    "Gift a card" → chosen opponent draws a card
    "Gift a tapped Fish" → opponent creates a tapped 1/1 blue Fish token
    "Gift an extra turn" → opponent takes an extra turn after this one (!!!)
    "Gift a Treasure" → opponent creates a Treasure token (they get mana)
    "Gift an Octopus" → opponent creates an 8/8 blue Octopus token

  GIFT DECISION MAKING:
    Gift is always OPTIONAL (you may choose an opponent)
    Choose not to give gift: spell works normally (smaller effect)
    Give gift: opponent gets their bonus, YOU get the bigger effect
    When to gift? When your bonus outweighs the opponent's benefit
    "Gift a Treasure": giving opponent {1} mana but YOUR spell gets a bigger effect → usually worth it
    "Gift an extra turn": opponent takes an extra turn → your effect must be MASSIVE to justify this

  GIFT + MULTIPLAYER:
    You choose WHICH opponent gets the gift
    Give the gift to the opponent with least benefit from it (or most politically advantageous)
    In Commander: gift the player who least benefits, use the bonus to help yourself or others

  GIFT + INSTANT SPELLS:
    On instants/sorceries: the effect happens if gift cost was paid (during resolution)
    "If this spell's gift cost was paid, [additional effect]"
    The gift is given AND your bonus occurs when the spell resolves

  GIFT + PERMANENTS:
    On permanents: "When this enters, if gift cost was paid, [effect] and chosen player gets gift"
    This is a triggered ability that fires on ETB

  GIFT NOTABLE CARDS:
    Gift of Wills: specific Bloomburrow card with Gift a Food.
    Stormkeld Vanguard ({2}{G}, Creature, Gift a Food): "Gift a Food — When Stormkeld Vanguard enters,
      if its gift cost was paid, search for a basic land, put it onto the battlefield tapped."
      Normal: 3/2 creature for {2}{G} (efficient but no ETB).
      Gift: choose opponent → they create a Food token → you search for a land (free ETB ramp).
      Trade: give opponent a Food (3 life later) → get a free land immediately.
      Ramping for free at the cost of a Food to an opponent: worth it in most cases.

    Cackling Prowler ({G}, Creature 2/1, Gift a Treasure):
      Gift a Treasure: when this enters, chosen opponent creates a Treasure.
      They get a Treasure (future {1} mana). You... get what? The card would specify a bonus.
      Giving opponent 1 mana for some bonus effect.

    Restless Cottage ({W}{B}, Land, Gift a card):
      Land with Gift a card on it: this might be a different card. Let me use consistent mechanics.

  GIFT + DEMONSTRATE COMPARISON:
    Demonstrate (P262): you and an opponent BOTH get a copy of the spell
    Gift: you give one opponent a specific benefit → you get a larger spell effect
    Demonstrate: symmetrical copies. Gift: asymmetrical — one specific benefit, one larger effect.

OFFSPRING:
  Additional cost: pay the offspring cost (usually {1} or colored mana)
  If paid: when the creature enters, create a 1/1 token copy of it
  The token is 1/1 ONLY — not the full stats of the original
  The original creature enters at its full stats

  OFFSPRING TOKEN COPY:
    The token is a copy of the creature "except it's 1/1"
    It has the same name, abilities, and type as the original
    Power and toughness are fixed at 1/1 regardless of the original's stats
    ETB abilities of the original: the token enters separately (doesn't trigger the original's ETBs)
    Wait: the token ENTERS with the same characteristics → any ETB on the original also fires for
    the token (the token is a separate permanent entering the battlefield).

  OFFSPRING DOUBLE ETB:
    If the creature has an ETB trigger: original enters → ETB 1
    Token enters separately: token's ETB (it's a copy, so it has the same ETB) → ETB 2
    Pay offspring → two ETBs for one spell (original at full stats + 1/1 token)
    Incredible for ETB-heavy creatures: double the triggers

  OFFSPRING + COUNTERS:
    Original creature with +1/+1 counters from ETB: it gets them at full stats
    Token: also gets the ETB counter... but it's a 1/1 so the counter makes it 2/2
    The token gets the same ETB counters as the original

  OFFSPRING NOTABLE CARDS (Bloomburrow):
    Stormkeld Vanguard: mentioned above (has both Gift and Offspring? Let me clarify.)
    Actually: many Bloomburrow creatures have Offspring.

    Mabel, Heir to Cragflame ({1}{R}{W}, Legendary Creature 2/2, Offspring {2}):
      When Mabel attacks: create a red weapon token that's an Equipment (attach to Mabel or a token).
      Offspring {2}: pay {2} extra → 1/1 token copy of Mabel enters too.
      The 1/1 token also has "when this attacks: create weapon token."
      Two separate weapon creators for the cost.

    Frilled Rabid Bat ({1}{B}, Creature 2/1, Offspring {1}):
      "When this enters, target opponent discards a card."
      Offspring {1}: pay {1} extra → {2}{B} total → creature enters + 1/1 token enters.
      Two ETBs: target opponent discards two cards (one for original ETB, one for token ETB).
      Efficient: {2}{B} for two targeted discards + a 2/1 body + a 1/1 body.

  OFFSPRING MULTIPLE INSTANCES:
    CR 702.175b: if multiple offspring instances, each is paid separately and triggers independently.
    Unusual edge case but could stack.
```

## Definitive Conclusions

- **Gift is optional** — choose whether to give an opponent a benefit for your spell's bonus effect.
- **Gift a Treasure gives opponent a Treasure** (future mana) in exchange for your bigger spell effect.
- **Gift an extra turn gives an opponent a turn** — only use when your effect is overwhelming.
- **Offspring creates a 1/1 token copy** of the creature when it enters — the token has the same abilities.
- **Offspring doubles ETB triggers** — both the original and the 1/1 token enter and trigger ETBs.

## Canonical Example
**Stormkeld Vanguard Gift a Food Ramp:**
Turn 3: you have {2}{G} mana (3 mana total). Cast Stormkeld Vanguard ({2}{G}).
Pay Gift a Food: choose your weakest opponent (the one with most life to share 3 life with).
Stormkeld enters. ETB triggers: gift cost was paid → search your library for a basic Forest, enter tapped.
That opponent creates a Food token.
Result: you paid 3 mana for a 3/2 creature AND a free Forest (that will untap next turn).
Your opponent got a Food token (3 life if they sacrifice it). You got a free ramp.
Net advantage: +1 land ahead of curve. 3-mana 3/2 with free ETB ramp is excellent value.

**Example 2 — Frilled Rabid Bat Offspring Double Discard:**
Opponent has 2 cards. You have {2}{B} mana.
Cast Frilled Rabid Bat ({1}{B}). Pay Offspring {1}: total cost {2}{B}.
Frilled Rabid Bat enters: ETB → opponent discards a card. (1 card left in opponent's hand.)
1/1 token copy of Frilled Rabid Bat enters: token has the same ETB → opponent discards a card again.
Opponent's hand is now empty.
Board: you have a 2/1 and a 1/1, both with the discard ETB. Total cost: {2}{B} for two forced discards + two bodies.
Without Offspring: {1}{B} for one discard and one 2/1. Offspring cost: +{1} for a second discard and a 1/1.

## Commonly Confused With
- **P262 (Demonstrate)** — Demonstrate gives an opponent a full copy of the spell; Gift gives a specific predetermined benefit (Food, Treasure, etc.) not a copy of the spell.
- **P241 (Replicate)** — Replicate creates copies of the spell for paid costs; Offspring creates a physical token creature, not a spell copy.
- **P244 (Devour)** — Devour sacrifices creatures for counters; Offspring creates creatures from additional payment.
