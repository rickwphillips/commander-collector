---
id: p507
name: Phyrexian Mana — Life Payment Is Not Spending Mana, and "No Mana Spent" Conditions
category: costs
cr_refs: [107.4g, 107.4h, 601.2f, 400.7]
tags: [phyrexian-mana, life-payment, spending-mana, no-mana-spent, freestrider-commando, trinisphere, cost-distinction, march-of-the-machine, MOM, outlaws-thunder-junction, OTJ]
created: 2026-03-29
examples_count: 3
---

# P507 — Phyrexian Mana — Life Payment Is Not "Spending Mana," and "No Mana Spent" Conditions

## Abstract

When you choose to pay 2 life for a Phyrexian mana symbol instead of spending colored mana, you are paying a cost with life — not spending mana. This distinction matters for any effect that checks whether "mana was spent" to cast a spell or pay a cost. Freestrider Commando enters with two +1/+1 counters if it "wasn't cast or no mana was spent to cast it." If you cast Freestrider using a spell that has Phyrexian mana in its cost and pay entirely with life, no mana was spent — the condition is satisfied. The same logic applies to Trinisphere (which checks actual mana spent, not life paid) and similar mana-counting effects.

## The Definitive Rules

**CR 107.4g**: *"If a cost or effect has a Phyrexian mana symbol in it, that symbol represents a Phyrexian mana cost. A Phyrexian mana cost can be paid either with one mana of the appropriate color or by paying 2 life."*

**CR 107.4h**: *"If you pay 2 life to pay a Phyrexian mana cost, you are not spending mana. This is a life payment, not a mana payment."*

The key principle: a Phyrexian symbol represents a *choice*. Choosing life means you don't interact with your mana pool at all for that symbol. You are paying a life cost, not a mana cost.

**CR 601.2f**: When you cast a spell, you pay its total cost. If any Phyrexian mana symbols are part of the cost and you opt to pay life for them, those symbols are satisfied by life payment — no mana enters or leaves your mana pool for those symbols.

**Freestrider Commando oracle text**: "Freestrider Commando enters with two +1/+1 counters on it if it wasn't cast or no mana was spent to cast it."

**2024-04-12 Freestrider ruling**: "If Freestrider Commando is cast without paying its mana cost but you paid mana for additional costs or cost increases (such as from Aven Interrupter), Freestrider Commando won't enter with +1/+1 counters."

**Trinisphere ruling**: Trinisphere checks how much *mana* is being spent, not how much total cost (including life) is being paid. Paying life for Phyrexian mana does not count toward Trinisphere's minimum-of-three requirement.

## The Pattern

```
PHYREXIAN MANA CHOICE — LIFE VS MANA:
  A Phyrexian mana symbol (e.g., {W/P}, {U/P}, {B/P}) has two payment options:
    Option A: Pay 1 mana of the matching color → mana was spent
    Option B: Pay 2 life → no mana spent (life payment)

  These are NOT equivalent for "mana was spent" checks.

"NO MANA WAS SPENT TO CAST IT" CHECKS:
  Freestrider Commando asks: was any mana spent to cast this?
  → If cast via Plot (free cast, no mana cost): no mana spent → gets counters
  → If cast via Cascade / Discover (free cast): no mana spent → gets counters
  → If cast via Sneak Attack or similar "put into play" effect (not cast): not cast → gets counters
  → If you flash it in with Teferi, Time Raveler (still must pay mana cost): mana spent → no counters
  → IF the spell had Phyrexian mana and you paid ALL symbols with life:
      no mana spent → gets counters
      (But Freestrider Commando has no Phyrexian symbols — this applies to
       hypothetical cards with both conditions or to similar-condition cards)

  CRITICAL: "No mana was spent" means literally zero mana left your mana pool
  during the casting of that spell. Even 1 generic mana to pay a cost increase
  counts as "mana was spent."

TRINISPHERE INTERACTION:
  Trinisphere: "As long as Trinisphere is on the battlefield, each spell that
  would cost less than three mana to cast costs three mana to cast."
  → Trinisphere counts MANA, not life payments
  → A spell with two Phyrexian mana symbols paid entirely by life costs 0 mana
  → Trinisphere raises it to 3 mana that must be paid
  → The life you chose to pay is separate and still paid, but you also owe 3 mana

  Example: Gitaxian Probe {U/P}
    Without Trinisphere: pay U or 2 life. If paying life, 0 mana cost.
    With Trinisphere: Trinisphere sees 0 mana → demands 3 mana minimum.
    You must pay {3} (or more) mana PLUS any life you chose.

MANA VALUE AND PHYREXIAN SYMBOLS:
  The mana value of a spell with Phyrexian mana symbols counts the Phyrexian
  symbols as 1 each (regardless of how you pay them).
  → Gitaxian Probe MV = 1
  → Chrome Host Seedshark incubate trigger: uses MV, which counts Phyrexian
    symbols as 1 each → a {1}{U/P} creature spell would have MV 2

ADDITIONAL COSTS AND MANA:
  If you cast a spell for free (no mana cost) but pay mana for an additional
  cost (kicker, enlist, etc.), mana WAS spent — even though you didn't pay
  the base mana cost.
  → This satisfies "was mana spent" checks
  → This is explicit in Freestrider's rulings (Aven Interrupter case)
```

## Definitive Conclusions

- **Paying life for Phyrexian mana is not spending mana.** Life payment and mana payment are distinct payment types. Effects that check "was mana spent" or "no mana was spent" are unaffected by life paid for Phyrexian symbols.
- **Trinisphere sees only mana spending, not life payments.** If you dodge mana entirely via Phyrexian life payments, Trinisphere still demands you spend 3 mana.
- **Freestrider Commando's counter condition is about zero mana from the mana pool.** Free casts (Plot, Cascade, Sneak Attack "put into play"), and all-life Phyrexian payments, satisfy "no mana was spent." Any mana spent on cost increases or kickers disqualifies the counters.
- **Mana value always counts Phyrexian symbols as 1,** regardless of how you pay. Incubate and similar MV-based effects use this fixed value.

## Canonical Examples

**Freestrider Commando via Plot:**
You Plot Freestrider Commando (pay {3}{G} to exile). On a later turn, you cast it for free from exile (no mana cost paid). No mana was spent to cast it → enters with two +1/+1 counters.

**Freestrider Commando via free cast + Aven Interrupter:**
Aven Interrupter is on the battlefield (your opponents' spells cost {1} more). You cast Freestrider for free via Plot, but Aven Interrupter adds {1} to the cost. You pay {1} mana for that cost increase. Mana was spent → Freestrider does NOT get the two +1/+1 counters.

**Gitaxian Probe + Trinisphere:**
Trinisphere is in play. You cast Gitaxian Probe ({U/P}) choosing to pay 2 life. Trinisphere sees 0 mana being spent → raises minimum to 3. You must also pay {3} mana. Total cost: {3} mana + 2 life. You cannot pay around Trinisphere with life.

**Hypothetical: spell with all Phyrexian symbols, no additional costs:**
Cast a hypothetical {U/P}{U/P} noncreature spell, paying 2+2=4 life. No mana entered or left your mana pool. Chrome Host Seedshark trigger fires: incubate X where X = MV = 2 (each Phyrexian symbol = 1 in MV). You create an Incubator token with 2 counters.

## Commonly Confused With
- **P015 (Mana Ability Identification)** — P015 covers what makes an ability a mana ability vs. a regular activated ability. P504 covers how paying Phyrexian mana with life interacts with mana-counting effects.
- **P025 (Counter Placement — Cost vs. Effect)** — P025 covers whether Doubling Season doubles loyalty counters added as costs. P504 covers whether life payments count as "spending mana."
- **CR 107.4 (general)** — The foundational rule distinguishing the two payment modes for Phyrexian mana symbols.
