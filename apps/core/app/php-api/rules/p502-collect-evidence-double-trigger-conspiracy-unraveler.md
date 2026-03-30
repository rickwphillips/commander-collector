---
id: p502
name: Collect Evidence — Double-Collection via Conspiracy Unraveler and Linked-Ability Independence
category: costs
cr_refs: [701.59, 607, 601.2]
tags: [collect-evidence, conspiracy-unraveler, evidence-examiner, double-trigger, linked-ability, alternative-cost, additional-cost, mkm, murders-at-karlov-manor]
created: 2026-03-30
examples_count: 2
---

# P502 — Collect Evidence — Double-Collection via Conspiracy Unraveler and Linked-Ability Independence

## Abstract
**Conspiracy Unraveler** ({5}{U}{U}: 6/6 Flying) offers "You may collect evidence 10 rather than pay the mana cost for spells you cast." When you cast a spell using this alternative CE cost AND that spell also has its own CE as an **additional** cost, you collect evidence **twice** — triggering "whenever you collect evidence" abilities twice per cast. However, the two CE actions are tracked independently: using Conspiracy Unraveler's CE does NOT satisfy the **linked** "if evidence was collected" condition on the spell's own additional cost. The two CEs are separate events even when paid simultaneously for the same spell. A secondary rule: you cannot exile a card that is being cast from the graveyard (e.g., via Flashback) to also pay the CE cost — a card can't simultaneously be the spell being cast and a card being exiled as a cost for that same cast.

## The Definitive Rules

**CR 701.59a:** "'Collect evidence N' means 'exile any number of cards from your graveyard with total mana value N or greater.'"

**CR 607 (Linked Abilities):** "An ability that checks 'if evidence was collected' is linked to the specific additional cost of collecting evidence on that same card. It only checks whether that particular additional cost was paid — not other collect evidence actions taken during the same cast."

**Official ruling (2024-02-02, Conspiracy Unraveler):** "If you cast a spell with the alternative collect evidence cost offered by Conspiracy Unraveler and you also collect evidence as an additional cost to cast that spell, abilities of permanents that trigger 'whenever you collect evidence' will trigger twice."

**Official ruling (2024-02-02, Conspiracy Unraveler):** "If a spell has an additional cost that includes collecting evidence, such as that of Analyze the Pollen, any additional effects that occur 'if evidence was collected' will occur only if that additional cost was paid. Using the alternative cost from Conspiracy Unraveler will not cause those additional effects."

**Official ruling (2024-02-02, Conspiracy Unraveler):** "If you are casting a spell from your graveyard (for example, a spell with flashback) you can't also exile that card to pay the alternative collect evidence cost offered by Conspiracy Unraveler."

## The Pattern

```
CONSPIRACY UNRAVELER — ALTERNATIVE CE COST:
  Conspiracy Unraveler ({5}{U}{U}: 6/6 Flying):
    "You may collect evidence 10 rather than pay the mana cost for spells you cast."

  This is an ALTERNATIVE COST (replaces the mana cost with CE 10).
  You still pay any mandatory additional costs.
  You CAN pay optional additional costs on top of the alternative CE 10.

DOUBLE COLLECTION — ALTERNATIVE + ADDITIONAL CE:
  If a spell has BOTH:
    (a) The CE 10 alternative cost via Conspiracy Unraveler (to replace mana cost), AND
    (b) Its own CE as an additional cost to cast:
  You collect evidence TWICE during the cast announcement (CR 601.2).

  Example:
    Crimestopper Sprite ({2}{U}: 2/2 Flying): "As an additional cost to cast this spell,
      you may collect evidence 6. When this creature enters, tap target creature.
      If evidence was collected, put a stun counter on it."
    With Conspiracy Unraveler active:
      → Pay alternative cost: collect evidence 10 (exile cards totaling MV ≥ 10). [CE #1]
      → Pay optional additional cost: collect evidence 6 (exile cards totaling MV ≥ 6). [CE #2]
      → Two separate CE events occurred during this single cast.

  "WHENEVER YOU COLLECT EVIDENCE" TRIGGERS TWICE:
    Evidence Examiner ({G}{U}: 2/2):
      "At the beginning of combat on your turn, you may collect evidence 4."
      "Whenever you collect evidence, investigate."
    With the Crimestopper Sprite cast above (two CEs):
      → Evidence Examiner's "whenever you collect evidence" triggers TWICE.
      → Two Clue tokens are created.
    This applies to ANY "whenever you collect evidence" trigger on the battlefield.

  "IF EVIDENCE WAS COLLECTED" DOES NOT CARRY OVER — LINKED ABILITY RULE:
    The "if evidence was collected" condition on Crimestopper Sprite is a LINKED ABILITY
      (CR 607). It is linked specifically to the CE additional cost on Crimestopper Sprite.
    The CE 10 paid via Conspiracy Unraveler is NOT "collecting evidence" for the linked
      ability's purposes.
    Result:
      → If you paid BOTH CEs (alternative CE 10 + additional CE 6):
          "If evidence was collected" = TRUE (the additional cost was paid). Stun counter applied.
      → If you paid ONLY the alternative CE 10 (skipping the optional CE 6 additional cost):
          "If evidence was collected" = FALSE. No stun counter. Only normal tap.

  THE ASYMMETRY:
    CE-based triggers ("whenever you collect evidence"): track ALL CE events — both fires.
    CE-based conditions ("if evidence was collected"): track ONLY the spell's own CE cost.
    These are different rules mechanisms intentionally.

FLASHBACK + CONSPIRACY UNRAVELER CANNOT COMBINE:
  If you're casting a card from your graveyard via Flashback, you cannot also exile that
    same card to pay the CE 10 from Conspiracy Unraveler.
  Official ruling: "If you are casting a spell from your graveyard, you can't also exile
    that card to pay the alternative collect evidence cost offered by Conspiracy Unraveler."
  The card must be either:
    (a) The spell being cast (from GY via Flashback), OR
    (b) A card being exiled as cost (for CE).
  It cannot be both simultaneously.
  However: OTHER cards in your graveyard can still be exiled for CE — just not the
    Flashback card itself.

X SPELLS WITH CONSPIRACY UNRAVELER:
  If you use CE 10 as an alternative cost for a spell with {X} in its cost:
  Official ruling: "If a spell has {X} in its mana cost, you must choose 0 as the value
    of X when casting it without paying its mana cost."
  X = 0 when the CE alternative replaces the mana cost.

TIMING LOCK — OPPONENTS CANNOT DENY CE MID-PAYMENT:
  Once you announce you're casting a spell (beginning of announcement = CR 601.2a):
  "Players can't take actions until you've finished doing so. Notably, opponents can't try
    to remove cards from your graveyard to stop you from collecting evidence."
  Both CE payments (alternative and additional) are locked in during announcement.
```

## Definitive Conclusions

- **Two CE events fire for one cast** when using Conspiracy Unraveler's alternative CE + the spell's own CE additional cost; "whenever you collect evidence" triggers fire **twice**.
- **"If evidence was collected" does NOT recognize the alternative CE** — only the spell's own linked additional CE satisfies that condition; skipping the additional cost means no "if evidence was collected" bonus even if you collected evidence 10 via Conspiracy Unraveler.
- **Cannot exile a Flashback card to also pay CE** — a card is either the spell being cast from GY or a card being exiled for CE, never both.
- **X = 0 when CE replaces mana cost** — spells with {X} in their mana cost have X=0 when Conspiracy Unraveler's alternative CE is used.

## Canonical Example

**Conspiracy Unraveler + Crimestopper Sprite:**

You control Evidence Examiner ({G}{U}: 2/2; "whenever you collect evidence, investigate") and Conspiracy Unraveler ({5}{U}{U}: 6/6 Flying).

You cast Crimestopper Sprite ({2}{U}: "optional additional cost: collect evidence 6; when it enters, tap a creature; if evidence was collected, stun counter it").

Step 1: You choose Conspiracy Unraveler's alternative cost — collect evidence 10. You exile cards totaling MV ≥ 10 from your graveyard. [CE #1]
→ Evidence Examiner triggers: investigate. Clue token #1.

Step 2: You pay the optional CE 6 additional cost. You exile more cards totaling MV ≥ 6. [CE #2]
→ Evidence Examiner triggers again: investigate. Clue token #2.

Step 3: Crimestopper Sprite resolves. It enters. ETB: tap target creature. "If evidence was collected" — was the additional CE 6 paid? YES. Stun counter applied.

Net: you drew two Clue tokens from Evidence Examiner, and the target creature is tapped with a stun counter.

**Example 2 — Skipping the Additional CE:**

Same setup. You cast Crimestopper Sprite using only CE 10 (skip the optional additional CE 6).

→ Evidence Examiner triggers once: one Clue token.
→ Crimestopper Sprite enters: tap target. "If evidence was collected" — linked to the spell's own CE 6 additional cost. That cost was NOT paid. No stun counter.

Net: one Clue token, target tapped but not stunned.

## Commonly Confused With
- **P492 (Disguise and Collect Evidence basics)** — P492 covers what CE is and how it works as a cost. P502 covers the interaction when two CE events happen for one cast.
- **P459 (Collect Evidence core)** — P459 covers CE as graveyard-exile costs and the MV threshold rules.
- **P487 (Plot)** — Plot is another OTJ alternative-cast mechanic. Conspiracy Unraveler's CE-as-alternative-cost follows similar "mandatory additional costs still apply" rules as Plot's free-cast-from-exile.
