---
id: p501
name: Renew — Graveyard Activation, Exile as Cost (Not Result), and Death-Trigger Coexistence
category: costs
cr_refs: [702.191, 116.2, 601.2, 603.6c]
tags: [renew, graveyard, exile-as-cost, cost-vs-result, stifle, counterspell, death-trigger, simultaneous, adorned-crocodile, agent-of-kotis, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 3
---

# P501 — Renew — Graveyard Activation, Exile as Cost (Not Result), and Death-Trigger Coexistence

## Abstract
**Renew** (Tarkir: Dragonstorm, 2025) is a keyword for activated graveyard abilities: exile the card from your graveyard to produce an effect, activatable only as a sorcery. The defining rules distinction is that **exile is the COST**, not the result — if an opponent counters the Renew ability (e.g., with Stifle), the card is still exiled (the cost was already paid before the ability went on the stack). This mirrors how other cost-based sacrifice effects work: costs are paid during announcement, before any player can respond. Additionally, if a creature with Renew dies during your turn, you have a priority window to activate Renew from the graveyard in the same turn — the "activate only as a sorcery" restriction doesn't prevent this because it's still your main phase. A death trigger (like Adorned Crocodile's "create a Zombie Druid token") and Renew activation from the same death event are independent — the death trigger fires and the Renew activation can happen in the same priority window.

## The Definitive Rules

**Renew (CR 702.191, paraphrased):** "'Renew — [cost], Exile this card from your graveyard: [effect]. Activate only as a sorcery.' means '[cost], Exile this card from your graveyard: [effect]. Activate this ability only when you could cast a sorcery.'"

**CR 601.2** (Announcing a spell/ability): Costs are announced and paid during announcement. By the time the ability is placed on the stack, all costs (including exile) have already been paid.

**CR 116.2 (Special actions and priority):** Activated abilities can be activated any time the player has priority and the timing condition is met (sorcery speed = main phase, stack empty or empty-passing).

**CR 603.6c (Leaves-the-battlefield triggers):** A triggered ability that fires when a creature dies uses last-known information — the trigger goes on the stack as a separate object, independent of whether the card is still in the graveyard.

## The Pattern

```
RENEW — KEYWORD STRUCTURE:
  Renew = [cost], Exile this card from your graveyard: [effect]. Activate only as a sorcery.

  KEY CARDS:
    Adorned Crocodile ({4}{B}: 5/3 Zombie Crocodile):
      "When this creature dies, create a 2/2 black Zombie Druid creature token."
      "Renew — {B}, Exile this card from your graveyard: Put a +1/+1 counter on
        target creature. Activate only as a sorcery."

    Agent of Kotis ({1}{U}: 2/1 Human Rogue):
      "Renew — {3}{U}, Exile this card from your graveyard: Put two +1/+1 counters
        on target creature. Activate only as a sorcery."

  NOTE: Renew is distinct from Flashback, Escape, and Harmonize:
    Flashback: cast the card from the GY (it's exiled as a RESULT of resolving or leaving
      the stack via any means).
    Escape: alternative cast from GY requiring additional GY exile (MV-based).
    Harmonize: alternative cost with creature-tap reduction; always exiled on leaving stack.
    Renew: an ACTIVATED ABILITY of the card WHILE IN THE GRAVEYARD — not a cast. The
      card is exiled as a COST of activation.

EXILE AS COST — THE CRITICAL DISTINCTION:

  When you activate a Renew ability, the announcement process (CR 601.2) is:
    1. Announce you're activating the Renew ability.
    2. Choose all targets (the creature to receive +1/+1 counter).
    3. Pay the cost: pay {B} (or whatever mana cost) AND exile the card from your GY.
    4. Ability goes on the stack.
    → At this point: the card is already in exile. No one can respond to the COST PAYMENT.

  STIFLE SCENARIO:
    Opponent responds to the Renew ability on the stack with Stifle (counter target
      activated ability).
    The Renew ability is countered — the effect does NOT happen.
    BUT: the cost was already paid. The card is already in exile.
    The card remains in exile. It does NOT return to the graveyard.

  COMPARE TO FLASHBACK:
    If a Flashback spell is countered, the card ALSO goes to exile (Flashback exiles
      on leaving the stack). For Flashback, exile is a result-of-leaving-stack, not a cost.
    For Renew, exile is the cost itself — earlier in the sequence.
    The practical outcome is the same (card is exiled), but the rules mechanism differs.

ACTIVATION TIMING — "ONLY AS A SORCERY":

  Renew can only be activated when you could cast a sorcery:
    → Your main phase.
    → Stack is empty (or you have priority and it's your turn).
    → Cannot be activated at instant speed.
    → Cannot be activated during opponent's turn.
    → Cannot be activated during combat phases.

  IMMEDIATE ACTIVATION ON DEATH (DURING YOUR TURN):
    If a creature with Renew dies during YOUR MAIN PHASE:
      → You receive priority after death triggers go on the stack.
      → If death triggers have resolved (or there are none), you have priority.
      → You're in your main phase.
      → You CAN activate Renew immediately from the graveyard.
    Official ruling (2025-04-04): "If a card with renew enters your graveyard during
      your turn, you can immediately activate the renew ability if timing permits."

    This means: even if your creature was destroyed by an opponent's spell during
      your main phase, once that resolves and you receive priority, you can use Renew
      if it's still your main phase with empty stack.

  DURING COMBAT:
    If a creature with Renew dies in combat (blocked and killed during combat damage):
      → Death happens during the combat damage step.
      → Death triggers go on the stack, resolve.
      → You receive priority in the combat damage step.
      → But Renew requires sorcery speed — you CANNOT activate it during combat.
      → You would need to wait until your post-combat main phase to use Renew.

DEATH TRIGGER COEXISTENCE:

  Adorned Crocodile has BOTH a death trigger AND Renew.
  When it dies:
    → "When this creature dies, create a 2/2 black Zombie Druid creature token." → trigger fires.
    → The card goes to the graveyard.
    → The death trigger goes on the stack.
    → Death trigger resolves: Zombie Druid token is created.
    → Adorned Crocodile is now in your graveyard.

  AFTER DEATH TRIGGER RESOLVES (during your main phase):
    You now have priority. Main phase, stack is empty.
    Adorned Crocodile is in your graveyard. You can activate Renew.
    Pay {B}, exile Adorned Crocodile from your graveyard → put a +1/+1 counter on target.

  The key: the death trigger does NOT depend on the card staying in the graveyard.
    → "When this creature dies" triggers from the zone-change event (battlefield → GY).
    → The trigger goes on the stack at the time of death.
    → The trigger is independent of whether the card REMAINS in the GY after that.
    → Even if you activated Renew BEFORE the death trigger resolved (if somehow possible
      during a sorcery window — unlikely mid-combat), the death trigger would still resolve.
    → In practice: death during your main phase means the trigger fires first, then you
      activate Renew afterward.

  IMPORTANT — DEATH TRIGGER USES LKI:
    The death trigger "When this creature dies" fires based on last-known information.
    The trigger is already on the stack the moment the creature hits the GY.
    Whether you subsequently exile the card via Renew has NO EFFECT on the trigger
    already on the stack — it will resolve and create the token regardless.

RENEW vs. OTHER GRAVEYARD MECHANICS:

  | Mechanic  | Is a Cast? | When Exiled         | Stack Timing |
  |-----------|-----------|---------------------|--------------|
  | Flashback | YES       | When leaving stack  | Stack, stack |
  | Escape    | YES       | Paid as added cost  | Cast phase   |
  | Harmonize | YES       | Always exiled       | Alternative  |
  | Unearth   | YES       | End step (trigger)  | Cast phase   |
  | Renew     | NO        | Paid as COST        | Activation   |

  Renew does NOT trigger "cast" effects:
    → Prowess does NOT trigger from Renew activation (it's not casting a spell).
    → Storm count does NOT increase.
    → "Whenever you cast a spell" effects are irrelevant.
    → "Whenever you activate an ability" effects DO trigger from Renew.
```

## Definitive Conclusions

- **Exile is the cost of Renew, not the result** — if the Renew ability is Stifled, the card is already exiled and does not return to the graveyard.
- **Renew can be activated immediately after a creature dies during your main phase** — the "only as a sorcery" restriction is met during your main phase with an empty stack.
- **Renew cannot be activated during combat** — even if the creature dies during combat, Renew must wait until post-combat main phase.
- **Death triggers and Renew are independent** — the death trigger fires when the creature enters the GY and goes on the stack regardless of subsequent Renew activation; the Zombie Druid token (Adorned Crocodile) is created regardless.
- **Renew is an activated ability, not a cast** — no prowess, storm, or cast-trigger interactions.

## Canonical Example

**Adorned Crocodile Dies During Main Phase:**

Your main phase, stack is empty. Opponent casts Doom Blade targeting Adorned Crocodile. It dies.

Step 1: Adorned Crocodile goes to graveyard. Death trigger fires: "create a 2/2 black Zombie Druid token." Trigger goes on the stack.

Step 2: You receive priority. You could respond now, but let the trigger resolve.

Step 3: Zombie Druid token is created.

Step 4: You receive priority. Main phase, stack is empty. You activate Renew: pay {B}, exile Adorned Crocodile from your graveyard, put a +1/+1 counter on your Zombie Druid (or any other target creature). Renew ability goes on the stack. Opponent Stifles it.

Step 5: Renew ability is countered. BUT: Adorned Crocodile is already exiled. The Zombie Druid token remains, the +1/+1 counter is not placed.

**Example 2 — Combat Death Timing:**

Combat damage step: Adorned Crocodile trades with an attacker. Both die.

Death trigger fires: Zombie Druid token goes on the stack. You're still in the combat damage step (or damage step post-damage).

You CANNOT activate Renew during combat damage step — Renew requires sorcery speed. Death trigger resolves: Zombie Druid created. Combat continues through end of combat. Post-combat main phase begins.

NOW you can activate Renew. Pay {B}, exile Adorned Crocodile. Effect resolves: +1/+1 counter on a creature.

**Example 3 — Agent of Kotis:**

Agent of Kotis ({1}{U}: 2/1 Human Rogue) dies during your main phase (opponent kills it). You receive priority.

Renew — {3}{U}, Exile this card from your graveyard: Put two +1/+1 counters on target creature. Activate only as a sorcery.

You pay {3}{U} = 4 mana total and exile Agent of Kotis. Two +1/+1 counters go on target creature. Agent of Kotis is now in exile permanently (barring effects that retrieve exiled cards).

## Commonly Confused With
- **P487 (Harmonize)** — Also a Tarkir: Dragonstorm graveyard mechanic. Harmonize is an alternative CAST from GY with cost reduction; Renew is an activated ABILITY (not a cast). Key difference: Harmonize triggers prowess; Renew does not.
- **P412 (Flashback)** — Flashback is also cast from GY and also exiles. But Flashback exiles on leaving the stack (as a result), while Renew exiles as a cost.
- **P009 (Persist/Undying)** — Both involve GY interactions after death. Renew requires active player decision and mana payment; Persist/Undying are automatic replacement effects.
