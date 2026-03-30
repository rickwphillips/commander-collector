---
id: p519
name: Renew (TDM) — Graveyard Activation, Exile-as-Cost, Sorcery-Speed Restriction, and Same-Turn Window
category: costs
cr_refs: [601.2, 610.1, 116.2b, 702.87]
tags: [renew, ability-word, graveyard, exile-cost, sorcery-speed, activated-ability, counter-grant, tarkir-dragonstorm, TDM, sultai]
created: 2026-03-30
examples_count: 3
---

# P519 — Renew (TDM) — Graveyard Activation, Exile-as-Cost, Sorcery-Speed Restriction, and Same-Turn Window

## Abstract
**Renew** (Tarkir: Dragonstorm, 2025) is an activated ability that can only be activated from the **graveyard**. The cost is mana plus **exile this card from your graveyard** — the card removes itself as it activates, preventing reuse. The effect is applied to a target creature (typically a +1/+1 counter, keyword counter, or special effect). The "Activate only as a sorcery" restriction means you need priority in your main phase with an empty stack. The critical same-turn window rule: **if a card with Renew is put into your graveyard during your turn, you can activate it immediately** before opponents can act — the rules explicitly confirm this narrow activation opportunity. Renew cards are one-shot value engines: they provide extra utility after dying, but each card can only Renew once (since exiling it is the cost).

## The Definitive Rules

**Official Ruling (2025-04-04):** *"If a card with a renew ability is put into your graveyard during your turn, you can activate that ability if it's legal to do so before any other player can take any actions."*

**CR 116.2b (Priority after placing to GY):** After a player receives priority, they may activate abilities. If a permanent goes to the graveyard, its controller gets priority after SBAs are checked — at which point Renew can be activated.

**CR 610.1 (Exile as cost):** Paying a cost that includes exiling a card is a normal cost payment. The card leaves the graveyard zone as part of cost payment.

**CR 601.2 (Casting/activating timing):** "Activate only as a sorcery" restricts activation to your main phase when the stack is empty and you have priority.

## The Pattern

```
RENEW STRUCTURE:

  "Renew — [cost], Exile this card from your graveyard: [effect on target creature].
   Activate only as a sorcery."

  KEY COMPONENTS:
    Zone: The card must be in YOUR graveyard to activate.
    Cost: Mana + exile this card (self-exile is the cost, not the effect).
    Effect: Applied to a TARGET creature (usually your own, sometimes any).
    Restriction: Sorcery speed — your main phase, empty stack.

  EXAMPLES:
    Adorned Crocodile: {B}, Exile: +1/+1 counter on target creature.
    Champion of Dusan: {1}{G}, Exile: +1/+1 counter AND trample counter on target creature.
    Alchemist's Assistant: {1}{B}, Exile: lifelink counter on target creature.
    Agent of Kotis: {3}{U}, Exile: two +1/+1 counters on target creature.
    Constrictor Sage: {2}{U}, Exile: tap target creature + stun counter (defensive use).
    Lasyd Prowler: {1}{G}, Exile: X +1/+1 counters where X = land cards in your GY.
    Naga Fleshcrafter: {2}{U}, Exile: +1/+1 counter on target creature + each OTHER creature
      you control becomes a copy of that creature until end of turn.

ONE-SHOT NATURE:

  Exiling the card is the COST — paid once and done.
  The card is gone after activation. It cannot be Renewed again.
  Even if returned to the graveyard (self-mill, discard, dies again), it's in exile, not GY.
  → Renew is a true one-shot. No repetition from the same card.

  Exception: if an effect returns a card FROM exile to hand/library/battlefield, the
    card could theoretically die again and go to GY. But returning exiled cards is rare
    and the Renew ability only works from the graveyard — so it's still once per death cycle.

SAME-TURN ACTIVATION WINDOW:

  Ruling: "If a card with a renew ability is put into your graveyard during your turn,
    you can activate that ability if it's legal to do so before any other player can act."

  WHAT THIS MEANS:
    When a card moves to the GY on your turn, you receive priority after SBAs are checked.
    At that point, it's your main phase (presumably — if the creature died during combat,
    see below). If the stack is empty: Renew can be activated immediately.

  TIMING CONSTRAINTS:
    Renew requires "activate only as a sorcery" → main phase + empty stack.
    If the creature dies DURING COMBAT (not a main phase):
      → You cannot activate Renew during combat.
      → You must wait until your second main phase.
      → If the opponent plays something before then, you lose the window.

  If the creature dies during YOUR MAIN PHASE (to removal, for example):
    → After the removal spell resolves and the creature goes to GY, you get priority.
    → Stack is empty (just became empty after resolution). Main phase: YES.
    → You can immediately activate Renew before opponents respond.
    → Opponents cannot "race" you to do something first once you have priority.

  PRACTICAL SEQUENCE:
    1. Opponent casts Doom Blade on your Adorned Crocodile (5/3 → dies).
    2. [It's your main phase — Doom Blade was cast in response to something you did.]
    3. Doom Blade resolves → Adorned Crocodile goes to GY.
    4. SBAs checked. You receive priority.
    5. Stack is empty. Your main phase. You activate Renew: {B}, exile → +1/+1 counter on
       another creature. Costs paid. Renew trigger goes on stack. No one can interrupt.

SORCERY SPEED RESTRICTION IN DETAIL:

  Renew activates only as a sorcery. Therefore:
    × Cannot activate during opponent's turn.
    × Cannot activate during your combat phase.
    × Cannot activate if the stack is not empty on your turn.
    × Cannot activate during your upkeep, draw step, etc. (must be a main phase).

  CAN YOU ACTIVATE DURING YOUR UPKEEP?
    → No. Upkeep is not a main phase.
    → Even if a creature dies during your upkeep (say, from an upkeep trigger), you cannot
      activate Renew until your precombat or postcombat main phase.

  PRECOMBAT MAIN PHASE vs. POSTCOMBAT MAIN PHASE:
    Both are main phases. Renew can activate in either.
    The creature just needs to be in your GY at that point.

EXILE AS COST — INTERACTION WITH GRAVEYARD HATE:

  If an opponent exiles your GY (Leyline of the Void, Rest in Peace):
    → Cards never reach your GY in the first place (replaced/exiled on death).
    → Renew cannot be activated because the card is never in your GY.

  If an opponent exiles a specific card from your GY (Tormod's Crypt, Scavenge):
    → That card's Renew can no longer be activated (card is in exile, not GY).
    → This is the primary counter to Renew: exile the card before the player can use it.

RENEW AND GRAVEYARD ORDER:

  Unlike Flashback (cast from GY), Renew is an activated ability.
  Activated abilities can be activated any time you have priority (with restrictions).
  You do NOT need to cast the card — you're activating an ability of a card in your GY.
  The "exile this card" cost means the Renew card's other characteristics don't matter
    during activation (you're not casting it, just activating it as an object with an ability).

COUNTER TYPES FROM RENEW:

  Most Renew cards grant:
    +1/+1 counters (Adorned Crocodile, Agent of Kotis, Lasyd Prowler)
    Keyword counters (trample counter from Champion of Dusan; lifelink counter from Alchemist's Assistant)
    Stun counter (Constrictor Sage — defensive option)
  The counter goes on a TARGET creature — usually your own, but the text specifies.
  If the target is illegal when Renew resolves (creature died), the ability fizzles.
```

## Definitive Conclusions

- **Renew activates from the graveyard with exile-as-cost** — the card removes itself on activation; each card can only Renew once.
- **Renew requires sorcery speed** — main phase, empty stack; cannot be activated during combat, upkeep, or opponent's turn.
- **Same-turn window exists if creature dies in your main phase** — after the stack empties and you receive priority in your main phase, you can immediately activate Renew before opponents can act.
- **Renew cannot be activated if the creature dies in combat** — you must wait until your second main phase; the creature is in the GY but the main phase restriction isn't met during combat.
- **Graveyard exile removes the window** — Tormod's Crypt, Nihil Spellbomb, or Rest in Peace prevents Renew entirely; the card must be in the graveyard as an object with the ability.

## Canonical Example

**Champion of Dusan Dies to Doom Blade (Your Main Phase):**

Your turn, precombat main phase. Your Champion of Dusan ({2}{G}: 4/2 Trample) is on the battlefield. You cast a spell; the opponent responds with Doom Blade targeting Champion of Dusan. Doom Blade resolves. Champion of Dusan goes to your GY.

SBAs checked. Stack is empty. You receive priority. It's your main phase (precombat) with an empty stack — sorcery timing is met. You activate Renew: pay {1}{G}, exile Champion of Dusan from GY. Target: your Grizzly Bears. Renew resolves: Grizzly Bears gets a +1/+1 counter AND a trample counter. It's now a 3/3 with trample.

**Example 2 — Dies in Combat (Deferred Activation):**

Your Adorned Crocodile ({4}{B}: 5/3) blocks an attacker and dies. It goes to your GY during combat. You want to activate Renew ({B}: exile → +1/+1 counter on target creature).

You cannot activate Renew during combat — "activate only as a sorcery" requires a main phase with an empty stack. Combat is not a main phase. After combat ends, your second main phase begins. Stack is empty. You NOW activate Renew targeting a creature you control. Opponents had priority during end of combat / between phases, so they could have exiled your GY card then.

**Example 3 — Same-Turn Window (Instant Sequence):**

Your Adorned Crocodile dies during your main phase after opponent's instant resolved. Stack is empty. Priority passes to you. You immediately activate Renew: {B}, exile Adorned Crocodile → +1/+1 counter on target creature. The opponent has no opportunity to exile your card from the GY between the creature going there and you activating Renew — you had priority first.

## Commonly Confused With
- **P172 (Foretell — Exile Mechanics)** — Foretell exiles cards from hand for future use. Renew exiles from the graveyard as a cost — opposite direction and one-shot.
- **P245 (Flashback)** — Flashback is casting the spell from the GY. Renew is activating an ability from the GY; the card is never cast, so storm, magecraft, and cast-triggers don't fire from Renew.
- **P255 (Suspend)** — Suspend exiles cards for future casting. Renew exiles itself as a cost without returning. Both use exile but in opposite ways.
- **P518 (Endure — TDM)** — Endure buffs the permanent or creates a Spirit when it's on the battlefield or resolving. Renew is a graveyard activation that buffs another creature after this card has died.
