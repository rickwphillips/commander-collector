---
id: p497
name: Bloomburrow Gift, Offspring, and Forage — Deep Interaction Edge Cases
category: costs
cr_refs: [702.187, 702.191, 701.61, 603.12]
tags: [gift, offspring, forage, additional-cost, copy-spell, etb-trigger, token-copy, reflexive-trigger, food, graveyard, bloomburrow, BLB, copy-carries-promise, orphaned-gift, bushy-bodyguard, coruscation-mage, camellia, curious-forager]
created: 2026-03-29
examples_count: 4
---

# P497 — Bloomburrow Gift, Offspring, and Forage — Deep Interaction Edge Cases

## Abstract
**Bloomburrow** (2024; CR 702.187, 702.191, 701.61) introduced three interconnected mechanics with non-obvious edge cases. **Gift** is an optional additional cost — choosing to promise a gift to an opponent is done at cast time; if the spell is countered, no gift is given; if the spell is **copied**, the copy carries the gift promise too (opponent receives the gift twice, caster gets the enhanced effect twice); copying a Gift permanent already on the battlefield does NOT inherit the gift promise. **Offspring** is an optional additional cost paid at cast time — when the creature ETBs, a trigger creates a 1/1 token copy that fires its own ETBs; crucially, if the original creature dies before the token trigger resolves, the token still enters and triggers its ETBs separately; the token copies the creature's current state, not its original printed values. **Forage** is a keyword action (exile 3 from GY OR sacrifice a Food) used as a cost or triggered action — opponents cannot respond mid-payment to deny the forage; a single Food cannot pay two different forage requirements; Camellia the Seedmiser's sacrifice trigger fires separately from the forage action, meaning sacrificing a Food for forage also triggers "whenever you sacrifice a Food" effects.

## The Definitive Rules

**CR 702.187** (verbatim): *"Gift is an optional additional cost..."* The opponent is chosen at cast time. Instants/sorceries deliver the gift during resolution (before other effects). Permanents deliver the gift via an ETB trigger.

**CR 702.191** (verbatim): *"Offspring is an optional additional cost. When the spell resolves, if offspring was paid, an ability triggers that creates a 1/1 token copy of the creature. The token is created with base power and toughness 1/1, regardless of the original creature's power and toughness."*

**CR 701.61** (verbatim): *"'Forage' means 'exile three cards from your graveyard or sacrifice a Food.'"*

**CR 603.12 (Reflexive Triggers):** A reflexive trigger is created by a resolving effect. It fires "when [player] does [action]." The trigger goes on the stack after the action completes. Players can respond to the trigger in the normal way.

## The Pattern

```
GIFT — SPELL COPY CARRIES THE PROMISE:

  The gift promise is part of the spell's "history" on the stack.
  When a spell is copied, the copy inherits properties of the original including
    whether a gift was promised, and to which opponent.

  OFFICIAL RULING: If you copy an instant or sorcery with Gift where you promised
    the gift, the copy ALSO has the gift promised to the same opponent.
    → Opponent receives the gift TWICE (once per copy, once per original).
    → You get the enhanced effect TWICE (once per copy, once per original).

  This is powerful: a single Twincast targeting a Gift spell produces double gift delivery
    and double enhanced effect.

  COPYING A GIFT PERMANENT (already on the battlefield): DOES NOT inherit promise.
    Official ruling: "If a card or token enters as a copy of a permanent that's already on
      the battlefield, the gift isn't promised for that new permanent, even if it was promised
      for the original."
    → Blinking a Gift creature doesn't re-trigger the gift.
    → Token copies (Strionic Resonator, Clone effects) are not "gifted."

  COUNTERING A GIFT SPELL: OPPONENT GETS NOTHING.
    The gift is delivered upon resolution (instants/sorceries) or upon ETB of the permanent.
    If the spell is countered before it resolves:
      → No resolution → no gift delivery → opponent receives nothing.
      → No enhanced effect for the caster.
    This means a gift-promised spell on the stack is a valid target to prevent the opponent
      from receiving their gift (you might want to counter your OWN spell if the gift is
      something like a Treasure that helps the opponent more than the enhanced effect helps you).

  TARGET BYPASS — GIFT WITHOUT VALID TARGETS:
    Some Gift spells require additional targets ONLY if the gift was promised.
    "You ignore these targeting requirements if the gift isn't promised."
    Conversely: "you can promise the gift on a permanent spell even if you won't be able to
      choose targets for an enters ability of that permanent once the spell resolves."
    → You CAN promise the gift even knowing the ETB target choice will find nothing.
    → Opponent still receives the gift (they don't need you to have targets).
    → The "if gift was promised" enhanced effect still resolves; targeting failures from
      the enters ability are handled at resolution (if no legal targets exist, that part fizzles).

  INSTANTS/SORCERIES — GIFT DELIVERED BEFORE OTHER EFFECTS:
    Official design: gift delivery is the FIRST thing that happens when the spell resolves.
    Example: Starfall Invocation (mass destroy all creatures, if gift was promised return one):
      → Opponent gets their card drawn → THEN all creatures are destroyed → THEN you return one.
    This ordering is relevant for combat tricks or life payments.

  REVERSED GIFT (Kitnap edge case):
    Kitnap ({2}{U}{U}: Aura): "When this Aura enters, tap enchanted creature. If the gift
      wasn't promised, put three stun counters on it. You control enchanted creature."
    Here the BONUS is on NOT gifting. Without gift = stun counters. With gift = just tap.
    Control effect happens either way.
    The gift (opponent draws a card) costs you the stun counter bonus.

OFFSPRING — TOKEN COPY CREATED EVEN IF ORIGINAL DIES:

  OFFSPRING TRIGGER TIMING:
    When the original creature ETBs, an ability triggers: "If offspring was paid, create
      a 1/1 token copy of [this creature]."
    The trigger goes on the stack AFTER the creature enters.
    Between the creature entering and the trigger resolving, opponents can kill the original.

  KEY RULING: "If the spell resolves but the creature with offspring leaves the battlefield
    before the offspring ability resolves, you'll still create a token copy of it."
    → The token is created as a copy of what was printed on the card (last known state).
    → The token is a 1/1.
    → The token enters with all the creature's ETB abilities — they fire as normal.

  WHAT THE TOKEN COPIES:
    The token copies the ORIGINAL creature's printed values, as of when the token ability
      resolves. Specifically:
    → If the original is currently copying something else when the ability resolves,
      the token copies THAT thing (1/1 version).
    → The token does NOT copy: counters, tapped/untapped state, attached Auras/Equipment,
      or non-copy continuous effects (pump spells making it bigger).
    → The token has the original creature's printed abilities, INCLUDING all ETBs.

  ETB DOUBLING — POWERFUL APPLICATIONS:
    Any ETB ability on the creature fires once for the original, once for the token.
    Coruscation Mage ({1}{R}: 2/2 Otter Wizard): "Whenever you cast a noncreature spell,
      this creature deals 1 damage to each opponent."
      With offspring paid: original (2/2) + token (1/1) both have this trigger.
      Every noncreature spell you cast deals 2 total damage across both copies.
    Darkstar Augur ({2}{B}: 2/3 Bat Warlock): upkeep trigger draws a card (lose life = MV).
      With offspring: two upkeep draw triggers fire each upkeep.

  WARREN WARLEADER — "ENTERS ATTACKING" DISTINCTION:
    Warren Warleader ({2}{W}{W}: 4/4 Rabbit Knight): "Whenever you attack, choose one —
      Create a 1/1 white Rabbit creature token tapped and attacking; or creatures you
      control get +1/+1 until end of turn."
    With offspring: the 1/1 token copy also has this "whenever you attack" ability.
    When the token is in play (from Offspring), it creates additional Rabbit tokens on attack.
    BUT: the Rabbit token itself "enters attacking but was never declared an attacker."
    "Whenever a creature attacks" triggers do NOT fire for the Rabbit token created by Warren.
    This is the same rule as Mobilize tokens (P495).

  TOKEN CANNOT CREATE MORE OFFSPRING:
    The Offspring ability triggers because the original creature was CAST with the offspring
      cost. Tokens are not cast. The offspring token's ETB does not trigger more Offspring.

  CORUSCATION MAGE — SPECIFIC RULING:
    "Coruscation Mage's last ability resolves before the spell that caused it to trigger."
    This means the Coruscation trigger (1 damage to each opponent) resolves BEFORE the
      noncreature spell it triggered on. In a chain, keep this in mind for targeting
      or life-loss ordering.

FORAGE — TIMING, DOUBLE-DIPPING LIMITS, AND REFLEXIVE TRIGGERS:

  WHAT FORAGE MEANS:
    "Forage" = choose one:
      (a) Exile exactly three cards from your graveyard, OR
      (b) Sacrifice exactly one Food.
    You must be able to do one of these to forage. Can't do both in one forage.
    Can't do "exile 2 and sacrifice a Food" — must be exactly 3 exiled OR exactly 1 Food.

  OPPONENTS CANNOT RESPOND MID-PAYMENT:
    Official ruling: "Once you announce that you're casting a spell or activating an ability,
      players can't take actions until you've finished doing so. Notably, opponents can't
      try to remove cards from your graveyard or Foods you control to stop you from foraging."
    This means:
      → As soon as you announce the forage cost for a spell, opponents cannot exile your GY
        cards in response to prevent you from meeting the 3-card threshold.
      → As soon as you announce the forage cost, opponents cannot destroy your Food in
        response to prevent the sacrifice.
      → Opponents can still respond to the spell/ability AFTER the cost is paid, but
        cannot preemptively deny the cost once announced.

  ONE FOOD CANNOT PAY MULTIPLE COSTS:
    Official ruling: "You can't sacrifice a Food to pay multiple costs. For example, you
      can't sacrifice a Food token to activate its own ability and also to activate
      Maraleaf Rider's ability."
    → Each forage or sacrifice cost requires a SEPARATE Food or a SEPARATE 3 GY cards.

  CAMELLIA THE SEEDMISER — SACRIFICE TRIGGERS STILL FIRE:
    Camellia the Seedmiser ({1}{B}{G}: 3/3 Squirrel Warlock):
      "Whenever you sacrifice one or more Foods, create a 1/1 green Squirrel token."
      "{2}, Forage: Put a +1/+1 counter on each other Squirrel you control."
    If you forage by sacrificing a Food to activate Camellia's ability:
      → The Food is sacrificed (as the cost for forage).
      → "Whenever you sacrifice one or more Foods" trigger fires: create a Squirrel.
      → Then the ability resolves: counters on all other Squirrels.
    This is NOT double-dipping: the Food is only sacrificed ONCE.
    But two separate effects care about that sacrifice:
      1. The forage cost: forage is paid (triggers the ability resolving).
      2. The separate sacrifice trigger: Camellia's "whenever you sacrifice Foods."
    You cannot sacrifice the same Food for forage AND Camellia's triggered effect simultaneously.
    You get the Squirrel token BECAUSE the sacrifice happened — it's a real sacrifice.

  CURIOUS FORAGER — REFLEXIVE TRIGGER HAS A WINDOW:
    Curious Forager ({2}{G}: 3/2 Squirrel Druid): "When this creature enters, you may forage.
      When you do, return target permanent card from your graveyard to your hand."
    The second ability is a REFLEXIVE TRIGGER (CR 603.12): "When you do [forage], return..."
    The reflexive trigger fires AFTER the forage completes.
    The trigger goes on the stack. Players can respond to it.
    → Opponent can respond to the reflexive trigger (e.g., Stifle it before the permanent
      card goes to your hand).
    → Contrast with: "instantly" or "choose X as you forage" effects which have no window.

  BUSHY BODYGUARD — NO WINDOW DURING RESOLUTION:
    Bushy Bodyguard has an ability that forages during ETB resolution.
    Official ruling: "You decide whether to forage or not as Bushy Bodyguard's last
      ability resolves. Once that ability starts resolving, it's too late for any player
      to respond before [the effect is applied]."
    This is the reverse of Curious Forager: the forage happens WITHIN the ability's
      resolution, so no window exists once the ability begins resolving.

  FORAGE AS ADDITIONAL COST (Feed the Cycle):
    Feed the Cycle ({1}{B}: Instant): "As an additional cost to cast this spell, forage or
      pay {B}. Destroy target creature or planeswalker."
    You can choose forage OR pay {B} as the additional cost.
    If you choose forage AND the spell is countered:
      → The 3 GY cards are already exiled, OR the Food is already sacrificed.
      → The cost cannot be undone. The cards/Food are gone.
    The "forage" option here is an alternative way to pay the additional cost, not a bonus.
```

## Definitive Conclusions

- **Copying a Gift spell also copies the gift promise** — the copy delivers the gift again to the same opponent, and you get the enhanced effect a second time; two copies of the original spell = opponent gets the gift twice.
- **Countering a Gift spell cancels the gift entirely** — opponent receives nothing; no enhanced effect; gift delivery requires resolution.
- **Offspring token enters even if original is dead** — the token trigger is already on the stack when the original dies; the token enters as a 1/1 with all the original's abilities and fires its own ETBs.
- **Offspring token copies current state, not original printing** — if the original is copying something else when the token trigger resolves, the token copies that thing as a 1/1.
- **Forage cost cannot be denied mid-payment** — once you announce the forage cost, opponents cannot remove your GY cards or Foods to prevent it.
- **Camellia's sacrifice trigger fires when you forage with Food** — the sacrifice is real; "whenever you sacrifice a Food" effects trigger separately from the forage action.
- **Curious Forager's reflexive trigger has a priority window** — opponents can Stifle or respond after "you foraged" but before "return a permanent card to hand."

## Canonical Example

**Gift Copy Interaction — Cruelclaw's Heist + Twincast:**

You cast Cruelclaw's Heist ({B}{B}: Sorcery; Gift a card; "target opponent reveals hand, you exile one nonland card; if gift was promised, you may cast that card for as long as it remains exiled, and mana of any type can be spent to cast it").
You promise the gift to Opponent A. You cast Twincast targeting Cruelclaw's Heist.

→ Copy resolves first (LIFO): Opponent A draws a card (gift delivered). You exile a nonland card from opponent's hand. If gift was promised on copy (yes it was): you may cast that card for as long as it remains exiled (mana of any type).
→ Original resolves second: Opponent A draws another card (gift delivered again). You exile another nonland card. You may cast that card for as long as it remains exiled too.

Net: Opponent A drew 2 cards. You exiled 2 of their best nonland cards and may cast both using mana of any type.

**Example 2 — Offspring ETB Doubling with Coruscation Mage:**

You cast Coruscation Mage ({1}{R}: 2/2 Otter Wizard; "whenever you cast a noncreature spell, deal 1 damage to each opponent") with offspring {2} paid.

→ 2/2 Mage enters → offspring trigger fires.
→ You cast Lightning Bolt (noncreature spell):
    → 2/2 Mage triggers: 1 damage to each opponent.
→ Offspring trigger resolves: 1/1 Mage token enters → it also has the trigger.
→ You cast another Lightning Bolt:
    → 2/2 Mage triggers: 1 damage.
    → 1/1 Mage triggers: 1 damage.
    → Total: 2 damage to each opponent per noncreature spell.

**Example 3 — Camellia + Forage Sacrifice:**

You control Camellia ({1}{B}{G}: 3/3) and three other Squirrel tokens. You have a Food token.

You pay {2} and activate Camellia's forage ability. You choose to forage by sacrificing the Food.

→ Cost paid: Food sacrificed.
→ "Whenever you sacrifice one or more Foods" trigger fires: create a 1/1 Squirrel token.
→ The forage ability resolves: put a +1/+1 counter on each other Squirrel you control.
   → The 3 existing Squirrels each get a counter. The NEW Squirrel token was just created —
     it's also "another Squirrel" if it entered before the ability resolved (it's on the stack).
     Whether the new Squirrel gets a counter depends on whether the Squirrel trigger
     resolved before or after Camellia's main ability. Since both are on the stack:
     Camellia's ability is on the stack first (cost was paid to activate it), then the
     Squirrel trigger fires and goes on top. Squirrel trigger resolves first: token enters.
     Then Camellia's ability resolves: puts counter on each OTHER Squirrel — the new token
     is also "another Squirrel" and gets the counter.

   Net: 3 original Squirrels + 1 new Squirrel all got +1/+1 counters.

**Example 4 — Forage Denial Attempt:**

You announce you're casting Feed the Cycle ({1}{B}) and choose to forage as the additional cost. You begin to exile 3 cards from your graveyard.

Opponent says: "In response, I'll cast Deathrite Shaman's exile ability to remove cards from your graveyard first!"

→ Too late. Once you announced the forage cost, opponents cannot take actions until you finish paying. The forage payment is complete. The cards are exiled. Feed the Cycle is now on the stack. THEN opponents can respond to the spell on the stack — but they cannot prevent the forage cost.

## Commonly Confused With
- **P130 (Offspring/Gift basics)** — P130 covers the basic mechanics. P497 covers the deep edge cases: gift copy behavior, offspring creature-died-before-token, forage payment timing, and reflexive trigger windows.
- **P460 (Forage/Suspect/Incubate basics)** — P460 has a brief Forage section. P497 expands this with the Camellia interaction, Curious Forager's reflexive trigger window, and the explicit anti-denial ruling.
- **P485 (Bargain)** — Bargain sacrifices one artifact/enchantment/token as an additional cost; Forage is more flexible (3 GY cards OR a Food) but follows similar "cost-paid-before-resolve" rules.
- **P003 (Object Identity)** — The offspring token copies the creature's current state at resolution time, following the standard object identity rules for copy effects.
