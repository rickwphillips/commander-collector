---
id: p390
name: Training, Connive, Squad, and Ravenous — New Keyword Actions and Combat Growth Mechanics
category: triggered
cr_refs: [702.149a, 702.149b, 702.149c, 701.50a, 701.50b, 701.50c, 701.50d, 701.50e, 702.157a, 702.157b, 702.156a]
tags: [training, connive, squad, ravenous, +1/+1-counter-on-attack, draw-discard-counter, token-copies-on-ETB, X-mana-enter-with-counters, attacking-with-higher-power, nonland-discard-counter, Midnight-Hunt, New-Capenna, Innistrad-Crimson-Vow, Vadrik-Astral-Archmage, Glasspool-Mimic, Phabine-Boss, Stun-Sniper, Thundering-Mightmare, Vodalian-Hexcatcher]
created: 2026-03-29
examples_count: 2
---

# P390 — Training, Connive, Squad, and Ravenous — New Keyword Actions and Combat Growth Mechanics

## Abstract
**Training** (702.149) is a triggered ability: whenever this creature AND at least one creature with greater power attack together, this creature gets a +1/+1 counter. **Connive** (701.50) is a keyword action where a creature's controller draws a card, discards a card — if the discarded card was a nonland card, the conniving creature gets a +1/+1 counter (filtering + potential growth). **Squad** (702.157) is a repeatable additional cost: pay the squad cost any number of times as an additional cost, then when the creature enters, create a token copy for each time the cost was paid. **Ravenous** (702.156) is an ETB mechanic for creatures with {X} in their mana cost: the creature enters with X +1/+1 counters, and if X was 5 or more, you draw a card. These four mechanics all appeared in 2021-2022 sets (Innistrad: Midnight Hunt, Streets of New Capenna, Innistrad: Crimson Vow, Dominaria United) and represent "scalable growth" or "go-wide" strategies.

## The Definitive Rules

**CR 702.149a** (verbatim): *"Training is a triggered ability. 'Training' means 'Whenever this creature and at least one other creature with power greater than this creature's power attack, put a +1/+1 counter on this creature.'"*

**CR 702.149b** (verbatim): *"If a creature has multiple instances of training, each triggers separately."*

**CR 702.149c** (verbatim): *"Some creatures with training have abilities that trigger when they train. 'When this creature trains' means 'When a resolving training ability puts one or more +1/+1 counters on this creature.'"*

**CR 701.50a** (verbatim): *"To connive, that permanent's controller draws a card, then discards a card. If a nonland card is discarded this way, that player puts a +1/+1 counter on the conniving permanent."*

**CR 701.50e** (verbatim): *"Connive N is a variant of connive. The permanent's controller draws N cards, discards N cards, then puts a number of +1/+1 counters on the permanent equal to the number of nonland cards discarded this way."*

**CR 702.157a** (verbatim): *"Squad [cost] means 'As an additional cost to cast this spell, you may pay [cost] any number of times' and 'When this creature enters, if its squad cost was paid, create a token that's a copy of it for each time its squad cost was paid.'"*

**CR 702.156a** (verbatim): *"Ravenous means 'This permanent enters with X +1/+1 counters on it' and 'When this permanent enters, if X is 5 or more, draw a card.'"*

## The Pattern

```
TRAINING (702.149):
  WHAT IT IS:
    Triggered ability. Condition: this creature AND at least one other creature with GREATER POWER
      than this creature's power attack at the same time.
    "Attack at the same time" = declared as attackers in the same combat phase.
    Result: this creature gets a +1/+1 counter.
  COMPARISON:
    "At least one other creature with power GREATER THAN this creature's power."
    Greater = strictly more. If this creature is a 2/2 training creature:
      You need at least one other attacker with power 3 or greater.
      Another 2/2 does NOT trigger training. Must be strictly greater.
    As the training creature grows: the threshold for triggering increases.
      A 1/1 training creature: any 2+ power creature can trigger training.
      A 3/3 training creature: needs a 4+ power creature co-attacking.
  MULTIPLE TRAINING TRIGGERS:
    702.149b: each instance triggers separately.
    If 3 creatures attack alongside the training creature, each with higher power:
      Training triggers ONCE per creature with higher power? No:
      702.149a: "whenever this creature AND AT LEAST ONE other creature with power greater..."
      The trigger condition is "at least one." If 3 qualifying creatures attack: the trigger fires once.
      Not three times. Just: "did at least one qualifying creature attack?"
      YES: trigger fires once → one +1/+1 counter.
    But: multiple INSTANCES of training on the same creature: each fires separately.
  TRAINING GROWS THE CREATURE:
    After getting a counter: training creature's power increases.
    Next attack: needs even higher-powered co-attacker to trigger again.
    The natural progression: pair with a large beater. Training creature catches up over time.
  WHEN THE CREATURE TRAINS (702.149c):
    "When this creature trains" = linked ability. Fires when training ability resolves and puts counter.
    Example: "Whenever this creature and another... attack, put +1/+1 counter on it. When it trains,
      it also gets flying until end of turn." (Hypothetical.)
    The "trains" trigger fires when the training ability's counter is placed.
    This is NOT the training trigger itself — it's a response to training completing.
  TRAINING TIMING:
    Training triggers fire at the declaration of attackers.
    The trigger is placed on the stack AFTER all attackers are declared.
    The counter is placed when the trigger resolves (before blockers are declared).
    So: the training creature's P/T improves BEFORE blocking decisions are made.

CONNIVE (701.50):
  WHAT IT IS:
    A keyword action: draw a card, then discard a card.
    If the discarded card is a nonland card: put a +1/+1 counter on the conniving creature.
    "Connive" = filter your hand + potentially grow the creature.
  THE DISCARD CONDITION:
    Land card discarded: no counter. (Filtering happened, but no growth.)
    Nonland card discarded: one counter.
    Connive N: draw N, discard N. One counter per nonland card discarded.
  STRATEGIC IMPLICATIONS:
    Connive rewards discarding cards you don't need (duplicates, low-value cards).
    Keep good cards, discard bad ones → get a counter.
    Keep lands if you're flooded → discard the extras → still no counter (lands).
    Connive is both a filtering mechanism AND a potential growth mechanism.
  CONNIVE ON ATTACK:
    Many connive creatures connive "when this attacks" or "whenever this deals combat damage."
    This means: attacking = filtering + potential growth.
    Cards like Raffine, Scheming Seer ({W}{U}{B}: connive X, where X = number of creatures attacking):
      Attack with 3 creatures → Raffine connives 3 (draw 3, discard 3, get up to 3 counters).
      Raffine grows based on the attack swarm.
  CONNIVE AND GRAVEYARD SYNERGIES:
    Discarded nonland cards go to the GY.
    Connive + reanimation = productive discard loop.
    Discard a creature with flashback → you get a counter AND the creature goes to GY for later use.

SQUAD (702.157):
  WHAT IT IS:
    Additional cost: pay the squad cost any number of times during casting.
    The ETB trigger: create a token copy of this creature for each time you paid the squad cost.
    Pay once: 1 copy. Pay twice: 2 copies. Pay N times: N copies.
  TIMING:
    The squad cost is an additional cost paid during the casting process (601.2b).
    You declare how many times you're paying during casting.
    The ETB trigger fires when the creature enters the battlefield and checks how many times paid.
    "If its squad cost was paid": the trigger only fires if you paid at LEAST once.
    If you paid zero times (didn't squad): no trigger, no tokens.
  COPIES ARE TOKENS:
    "Create a token that's a copy of it for each time its squad cost was paid."
    These are creature tokens that are copies of the original (same P/T, abilities, etc.).
    They enter the battlefield simultaneously with the ETB trigger resolving.
    Wait: "create" = they come into existence during the resolution. The original entered earlier.
    The original has an ETB trigger that creates the tokens. The tokens also have ETB triggers
      (because they're copies of the original, which has the squad ETB trigger).
    Do the tokens' ETB triggers fire? They're tokens, not spells. They didn't have a squad cost paid.
    "If its squad cost was paid" — the tokens' "squad cost was paid" = the original was squadded.
    Actually: the ETB trigger of the TOKENS fires (they're copies of the original), and checks:
      "if squad cost was paid for this spell." The tokens were NOT cast as spells.
      So: "if squad cost was paid" — it wasn't (no spell was cast). The trigger fizzles for tokens.
    Squad tokens don't create more tokens (no infinite loop).
  EXAMPLE — PHABINE, BOSS'S CONFIDANT ({3}{R}{G}{W}: 3/3 First Strike, Squad {2}):
    Pay {3}{R}{G}{W} (base) + {2} = 1 token. Or + {2}{2} = 2 tokens. Or + {2}{2}{2} = 3 tokens.
    Each squad payment creates one additional 3/3 with First Strike.
    Paying {3} more for a 3/3 First Strike is fairly cost-efficient.

RAVENOUS (702.156):
  WHAT IT IS:
    Found on creatures with {X} in their mana cost.
    "This permanent enters with X +1/+1 counters on it."
    AND: "When this enters, if X is 5 or more, draw a card."
    The counter placement is a replacement effect. The draw is a triggered ability.
  SCALING WITH X:
    A ravenous creature for X = 3: enters as 3/3 (if it's a 0/0 base + 3 counters).
    For X = 5: enters as 5/5 and you draw a card.
    For X = 10: 10/10 + draw a card.
    The "X ≥ 5" threshold for the draw means: invest enough mana to get card advantage.
  RAVENOUS AND COST REDUCTIONS:
    If you cast a ravenous creature with a cost reduction: X is still the chosen X value.
    Rule 107.3m: "If X is part of the cost and the cost is being paid, X is specified or fixed
      at the time the cost is to be paid."
    X is fixed when you announce the spell. Even if costs are reduced, X was already declared.
    Ravenous uses the CHOSEN X (the X you paid for), not a modified total.
  RAVENOUS AND KICKED:
    Some ravenous creatures also have kicker: "If kicked, this creature has [ability]."
    Kicker doesn't affect X. X is declared separately.
    X determines counter count; kicker determines bonus ability.
  EXAMPLE — HUNGRY FOR MORE (Hypothetical ravenous {X}{B}{G}):
    X = 4: 4 counters. No draw. 4/4 effective creature.
    X = 5: 5 counters. Draw a card. 5/5 effective. Card draw at the threshold.
    X = 7: 7 counters. Draw a card. 7/7 effective. The draw is just one card regardless of how big X is.
    Incentive: always pay at least X = 5 if you can, to get the card draw value.

MULTIPLE INSTANCES:
  TRAINING — MULTIPLE INSTANCES:
    702.149b: "If a creature has multiple instances of training, each triggers separately."
    A 1/1 with two instances of training: attacks alongside a 2/2.
    Both training triggers fire. After resolution: TWO +1/+1 counters.
    The creature becomes a 3/3 instead of 2/2. More instances = faster growth.
  CONNIVE — MULTIPLE CONNIVE:
    If an effect says "connive twice": connive once (draw, discard, counter?), then connive again.
    Each connive is separate. Two separate draws and discards. Up to 2 counters.
  SQUAD — MULTIPLE INSTANCES:
    702.157b: each instance's ETB trigger fires based on its own payment.
    A creature with two squad instances: each creates tokens based on its own payment.
    If both squad costs were paid: two ETB triggers each creating copies. Could be many tokens.
```

## Definitive Conclusions

- **Training triggers once per attack** — even if 3 qualifying creatures attack alongside, the trigger fires only once (condition is "at least one"); multiple INSTANCES of training trigger separately (potentially 2 counters if the creature has training twice).
- **Connive draws then discards** — order matters: draw first (selection), then discard (choose what to pitch); counter is placed only if the discarded card is nonland; connive N draws and discards N, with a counter for each nonland discarded.
- **Squad tokens don't create more squad tokens** — the ETB trigger on tokens checks "if squad cost was paid" for the token-as-spell, which it wasn't; no infinite loop.
- **Ravenous places X +1/+1 counters on ETB** — the draw fires as a separate triggered ability only if X ≥ 5; X is fixed at cast time and not modified by cost reductions after the fact.
- **Training's "trains" linked trigger fires when the counter is placed** — it's a separate trigger linked to when the training ability successfully puts counters; useful for giving additional bonuses when the creature grows.

## Canonical Example
**Thundering Mightmare Training Sequence:**
Thundering Mightmare ({4}{G}: 5/5, training, "when this creature trains, put a +1/+1 counter on each other creature you control with training"):
Wait — hypothetical example. Using actual training creature:

Stun Sniper ({1}{R}{W}: 1/1, training, "when this trains, tap target creature an opponent controls"):
Turn 3: Stun Sniper enters as 1/1.
Turn 4: Attack with Stun Sniper and a 3/3 creature.
Training condition: "does at least one other attacker have power > 1?" YES (the 3/3 has power 3 > 1).
Training triggers. Goes on stack. Resolves before blockers are declared.
Stun Sniper gets +1/+1 counter (now 2/2). "When this creature trains" trigger fires.
"Tap target creature an opponent controls." Choose their best blocker. Tap it.
Now Stun Sniper attacks alongside the 3/3. The tapped creature can't block.

Turn 5: Attack with Stun Sniper (now 2/2) and a 4/4 creature.
Training: does the 4/4 have power > 2? YES (4 > 2). Trigger fires.
Stun Sniper becomes 3/3. Trains. Tap another creature.
Each turn: Stun Sniper grows AND taps a blocker.

Turn 6: Stun Sniper is 3/3. Need a 4+ power co-attacker.
If your biggest attacker is a 3/3: Stun Sniper doesn't train this turn.
This is the "ceiling" issue with training: the creature needs to be outpaced to grow.
Solution: use pump spells or have a large creature in play.

**Example 2 — Raffine Connive 3 Attack:**
Raffine, Scheming Seer ({W}{U}{B}: 1/4 flying, "whenever you attack, each attacking creature connives X, where X = number of attacking creatures"):

Attack with 3 creatures (including Raffine). X = 3.
Each attacking creature connives 3: draw 3 cards, discard 3 cards.
Raffine draws 3 + 2 other creatures draw 3 each = 9 total cards drawn across board.
Wait: "each attacking creature connives X" — each creature draws 3, discards 3.
Raffine connives 3: draw 3, discard 3 (discard nonlands → up to 3 counters on Raffine).

Hand: had 5 cards. Drew 3 more = 8 cards. Must discard 3.
Strategic discards:
- Discard 3 land cards: no counters on Raffine. Hand went from 5 to 8. Now discard 3 to go back to 5.
  Filtered out 3 lands. Kept better stuff.
- Discard 2 lands + 1 useless creature: 1 counter on Raffine. Hand: 5 cards (with better composition).
- Discard 3 creatures with flashback/graveyard synergy: 3 counters on Raffine. GY full of useful stuff.

Best case (3 nonlands discarded for Raffine): Raffine gains 3 counters (becomes 4/7 flying).
After repeated turns: Raffine grows into a massive threat AND your hand is consistently filtered.
Plus: the other attacking creatures also connive (their counters go on themselves).

## Commonly Confused With
- **P384 (Exert/Amass/Explore)** — All four mechanics in P390 relate to attacking or creature growth, similar to exert. Training fires at attack declaration; exert is a choice during attack declaration. Both are "combat growth" mechanics but work differently.
- **P011 (ETB Triggers)** — Squad's token creation is an ETB triggered ability on the creature. Ravenous' counter placement is a replacement effect (not ETB trigger); the draw is a separate ETB trigger. These are linked but mechanically distinct.
- **P006 (Intervening If — Condition at Trigger and Resolution)** — Training's trigger condition is checked when triggering: "do this creature and another with greater power attack?" This is checked at declaration time and also at resolution (the intervening-if pattern). If the other creature left combat between trigger and resolution, the counter may not be placed.
- **P369 (Infect/Wither/Toxic)** — +1/+1 counters from training/connive/ravenous function normally with infect/wither interactions. If a creature with training also has infect: it deals poison and damage normally; the training counter makes it more effective at dealing infect damage over time.
