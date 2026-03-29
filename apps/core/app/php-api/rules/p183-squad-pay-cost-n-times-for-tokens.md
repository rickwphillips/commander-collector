---
id: p183
name: Squad — Pay Additional Cost Multiple Times for Tokens
category: costs
cr_refs: [702.157a, 702.157b]
tags: [squad, additional-cost, token-copy, multiply, Dominaria-United, Yotian-Soldier, scaling]
created: 2026-03-28
examples_count: 2
---

# P183 — Squad — Pay Additional Cost Multiple Times for Tokens

## Abstract
Squad is an optional additional cost that can be paid multiple times. Each time you pay the squad cost, you pay it once more. When the creature enters, if the squad cost was paid, you create a token copy of the creature for EACH time you paid the squad cost. So paying the squad cost twice creates two token copies; paying it zero times creates no tokens. Squad scales: the more times you pay, the more creatures you get. This is a "pay to multiply" mechanic — the base creature is one copy; additional squad payments each add another copy.

## The Definitive Rules

**CR 702.157a** (verbatim): *"Squad is a keyword that represents two linked abilities. The first is a static ability that functions while the creature spell with squad is on the stack. The second is a triggered ability that functions when the creature with squad enters the battlefield. 'Squad [cost]' means 'As an additional cost to cast this spell, you may pay [cost] any number of times' and 'When this creature enters, if its squad cost was paid, create a token that's a copy of it for each time its squad cost was paid.' Paying a spell's squad cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
SQUAD:
  Additional cost: may pay [squad cost] any number of times during casting
  ETB triggered: if squad cost was paid (at least once), create one token copy per payment

  SQUAD + PAYMENT COUNT:
    Pay 0 times: no additional cost paid → no tokens created
    Pay 1 time: 1 additional cost → 1 token copy created
    Pay 2 times: 2 additional cost payments → 2 token copies created
    Pay N times: N additional cost payments → N token copies created

  SQUAD + TOKEN COPIES:
    Tokens are copies of the creature (same P/T, abilities, name, type)
    They enter the battlefield → ETB triggers fire for each token
    Tokens are the same as the original creature for all intents (except being tokens)

  SQUAD + SCALING:
    As mana increases: squad gives you more bodies
    Small squad cost + lot of mana = army of token creatures
    Example: Squad {1}: pay 1 extra 4 times → 4 tokens + the original = 5 creatures total for (original CMC + 4)

  SQUAD + LINKED TRIGGER:
    "If its squad cost was paid" — only if paid at least once
    The trigger doesn't fire if squad wasn't paid (0 payments)
    "For each time its squad cost was paid" — counts all payments

  SQUAD + X COSTS:
    If the creature has an X cost: the copy tokens also have the same X? Yes, tokens are copies
    But tokens don't have mana costs as played — they enter with the same characteristics
    The tokens will have the same characteristics as the squad creature when it entered

  SQUAD + ETB:
    Each squad token enters → any ETB triggers fire for each
    A squad creature with "when this enters, deal 2 damage": each token fires its ETB
    5 tokens of a "deal 2 damage on entry" creature = 10 damage

SQUAD SYNERGIES:
  Doubling Season: "If a token would be created under your control, create twice as many"
  Squad + Doubling Season: each squad payment creates TWO token copies instead of one
  Pay squad 3 times + Doubling Season: 6 tokens instead of 3

SQUAD CARDS:
  Yotian Soldier (Squad {2}): 1/2 Vigilance, each payment creates a copy
  Vodalian Mindsinger (Squad {2}): when it enters, control target creature until end of turn
    Each token enters → each triggers "control target creature" → control multiple creatures
```

## Definitive Conclusions

- **Squad allows paying the additional cost multiple times** — each payment creates one token copy.
- **No payments = no tokens** — the trigger fires only if squad was paid.
- **ETB triggers fire for each token** — powerful with ETB-heavy creatures.
- **Doubling Season doubles** each payment's token creation.
- **Scales linearly** with mana investment — more money, more bodies.

## Canonical Example
**Yotian Soldier (1/2 Vigilance, Squad {2}):**
Pay {W} + {2}{2}{2} (squad 3 times) = {7} total.
When Yotian Soldier enters: create 3 token copies.
Board: 4 × 1/2 Vigilance creatures (original + 3 tokens).
All can attack and still block — vigilance synergizes with the token army.
Swarm strategy for a single card investment.

**Example 2 — Vodalian Mindsinger (3/3, Squad {2}, ETB: gain control of target creature until end of turn):**
Pay squad cost 2 times → 2 tokens.
Three total creatures enter (original + 2 tokens).
Each triggers "gain control of target creature" → control 3 opponents' creatures this turn.
Three attackers stolen, three 3/3s attacking → massive swing.

## Commonly Confused With
- **P183 vs Replicate (P101)** — Replicate pays per copy of the SPELL. Squad pays per copy of the CREATURE TOKEN on entry.
- **P162 (Myriad)** — Myriad creates tokens in combat. Squad creates tokens on ETB from payment.
- **P121 (Fabricate)** — Fabricate chooses tokens OR counters. Squad pays for any number of tokens.
