---
id: p491
name: Descend — Static vs. Triggered Distinction, Threshold Gaming, and Finality Counter Interactions
category: triggered
cr_refs: [207.2c, 603.2, 603.4, 603.6a, 614.1, 400.7, 704.5b, 704.5d, 702.185]
tags: descend, static-ability, triggered-ability, intervening-if, threshold, permanent-cards, gy-count, gaming-the-threshold, finality-counter, ancient-one, uchbenbak, wail-of-the-forgotten, lost-caverns-ixalan
created: 2026-03-29
examples_count: 7
---

# P487 — Descend — Static vs. Triggered Distinction, Threshold Gaming, and Finality Counter Interactions

## Abstract

**Descend N** (CR 207.2c, Lost Caverns of Ixalan 2023) is an ability word that appears in two structurally different forms: (1) **static conditions** ("as long as there are N or more permanent cards in your graveyard, this creature has X") and (2) **triggered abilities with intervening-if clauses** ("when this creature enters, if there are N or more permanent cards in your graveyard, [effect]"). P466 introduces these forms, but this pattern addresses the non-obvious edge cases around gaming the threshold — can you manipulate your GY count after the trigger fires but before it resolves? — and the relationship between descend permanents and **finality counters**, a new counter type introduced in LCI that interacts with descent via self-reanimate abilities (Uchbenbak, the Great Mistake) and prevents repeated looping.

## The Definitive Rules

### Two Structural Forms of Descend (CR 207.2c, 603.6a)

**Form 1 — Static/Continuous:**
Oracle text: "Descend 4 — As long as there are four or more permanent cards in your graveyard, [this permanent has/gets X]."
- This is a static ability. It creates a continuous effect.
- Checked continuously, every moment. If the GY count drops below N mid-turn (exile effects, escape costs), the benefit immediately disappears. If it rises above N, the benefit immediately appears.
- No trigger, no stack, no window to game it.

**Form 2 — Triggered with Intervening-If:**
Oracle text: "Descend 4 — When this creature enters, **if** there are four or more permanent cards in your graveyard, [effect]."
- The "if" in the middle of a triggered ability = intervening-if clause (CR 603.4).
- The condition is checked TWICE: (a) at the moment the trigger would trigger, and (b) again when the trigger resolves.
- If the condition fails at EITHER check, the ability doesn't fire (first check) or doesn't resolve (second check).

**Form 3 — Cast-Time Check:**
Oracle text: "Descend 8 — Choose one. **If** there are eight or more permanent cards in your graveyard **as you cast this spell**, choose one or more instead."
- Wail of the Forgotten and similar cards check the GY count AT THE TIME OF CASTING.
- This check is not at trigger time or resolution — it's at cast time, and the result is locked in when the spell is cast.
- Once the "choose one or more" mode is selected at cast time, it doesn't re-evaluate at resolution.

### Finality Counters (LCI 2023)
Finality counters are a new counter type introduced in LCI. A permanent with a finality counter that would go to the graveyard from the battlefield is exiled instead (CR 704.5q replacement). Key properties:
- Finality counters are NOT keyword counters and grant no abilities to the permanent.
- Multiple finality counters on a single permanent are redundant (one is enough to exile instead of GY).
- A permanent with a finality counter that leaves the battlefield by any route other than to the graveyard (bounced to hand, phased out, returned to library) does so normally — finality counters only redirect graveyard placement.
- If a permanent with a finality counter would be destroyed (SBA, destroy effect), it would normally go to the GY → finality counter exiles it instead.
- Indestructible + finality counter: indestructible means "can't be destroyed," so it never tries to go to the GY from a destroy effect in the first place. Finality counter has nothing to replace. The indestructible creature stays on the battlefield.

### The Ancient One's Reflexive Trigger (CR 603.2)
The Ancient One: "{2}{U}{B}: Draw a card, then discard a card. When you discard a card this way, target player mills cards equal to its mana value."
- The "when you discard a card this way" is a reflexive triggered ability — it triggers when you discard as part of the activated ability's resolution.
- You don't choose a target for the triggered ability when you activate the {2}{U}{B} ability. You choose a target when the reflexive triggered ability goes on the stack.
- This means there is a window between activation and the reflexive trigger's resolution where opponents can respond.

## The Pattern

```
DESCEND STRUCTURAL FORMS — summary:

  STATIC form: "As long as there are N+ permanent cards in your GY, [effect]"
    → Continuous re-evaluation, no stack, no trigger
    → Combat example: The Ancient One (Descend 8): "can't attack or block unless
      there are 8+ permanent cards in your GY"
      → Checked at the moment you'd declare attackers (or declare blockers)
      → If opponent sacrifices a permanent in response... wait — "in response" doesn't apply
        to static abilities. The check happens at declaration time, not on the stack.
      → IMPORTANT: once The Ancient One has legally attacked or blocked, removing
        permanent cards from your GY so descend 8 no longer applies will NOT
        remove The Ancient One from combat. Combat participation is locked in at declaration.
      → Disrupting static descend: exile effects, escape costs, Rest in Peace,
        Surgical Extraction mid-combat — these can drop you below the threshold
        BEFORE you declare attackers, preventing the attack entirely

  TRIGGERED form with intervening-if: "When X, if N+ permanent cards in GY, [effect]"
    → Double-check: trigger and resolution
    → Gaming the threshold BETWEEN trigger and resolution:
      → Opponent sees your Coati Scavenger enter (Descend 4: return target permanent)
      → Opponent has 3 permanent cards in your GY (counted)
      → Opponent has instant-speed GY exile: can exile a permanent card from your GY
        to drop you below 4, causing the trigger to fizzle at resolution
      → This IS a valid play: use GY exile between trigger time and resolution
      → Conversely, crafter: can sacrifice a permanent between trigger and resolution
        to RAISE their GY count above N if they were borderline
      → The second check creates windows for both players to game the threshold

  CAST-TIME CHECK: "if N+ permanent cards in GY as you cast this spell"
    → Locked at cast time — cannot be changed after spell is on the stack
    → Wail of the Forgotten (Descend 8): once you've cast it choosing "one or more" modes,
      opponent exiling your GY has no effect on how many modes you chose
    → Conversely: opponent cannot exile your GY BEFORE you cast to deny the bonus
      (they can exile in advance to prevent you from reaching N, but once you're casting
      and the condition is met, it's locked)

THRESHOLD GAMING — practical decision tree:

  For STATIC descend (e.g., The Ancient One, Echo of Dusk, Frilled Cave-Wurm):
    → Opponent wants to disrupt? Must remove GY cards BEFORE the static check fires
      (before declare attackers, before the as-long-as condition is evaluated)
    → No "respond to static ability" — static abilities don't use the stack
    → Disruption must be proactive (before the check moment)

  For TRIGGERED descend (e.g., Coati Scavenger, Council of Echoes, Malamet Veteran):
    → Opponent can disrupt between trigger and resolution
    → You can also bolster between trigger and resolution
    → Both players have a window to change the GY count

  For CAST-TIME descend (e.g., Wail of the Forgotten):
    → Locked at cast time
    → Disruption must happen before casting

WHICH CARDS ARE "PERMANENT CARDS" IN THE GRAVEYARD:
  Permanent card types: Artifact, Creature, Enchantment, Land, Planeswalker, Battle
  → Land cards in GY count (even though lands don't go to GY often — discard, mill, sacrifice)
  → Planeswalker cards in GY count
  → Battle cards in GY count
  → Token permanents do NOT count: tokens are not cards (CR 110.5a), and SBAs
    remove tokens from non-battlefield zones before descend is checked (CR 704.5d)
  → Instant and sorcery cards in GY do NOT count (not permanent types)
  → A creature card that was an instant/sorcery through some effect: its type in GY
    reverts to its printed type (CR 400.7a) — a creature card printed as a creature
    always counts as a creature card in the GY for descend purposes

FINALITY COUNTERS + DESCEND INTERACTION:

  Uchbenbak, the Great Mistake:
    "Descend 8 — {4}{U}{B}: Return this card from your graveyard to the battlefield
    with a finality counter on it. Activate only if there are eight or more permanent
    cards in your graveyard and only as a sorcery."
    → Uchbenbak IS in the GY when you activate this ability
    → Uchbenbak itself counts toward the 8 permanent cards in your GY
    → The cost is paid, the ability resolves, Uchbenbak enters with a finality counter
    → On the battlefield with finality counter: if it would die, it's exiled instead
    → Once in exile, descend count drops by 1 (Uchbenbak is no longer in GY)
    → Can Uchbenbak be repeatedly reanimated? NO:
      → After first reanimation: Uchbenbak is on battlefield (not in GY)
      → If Uchbenbak dies: finality counter exiles it (goes to exile, not GY)
      → The ability says "return this card FROM YOUR GRAVEYARD" — it must be in the GY
      → Uchbenbak in exile cannot be targeted by its own ability (wrong zone)
      → Finality counter design explicitly prevents Uchbenbak loops

  Finality counter + GY interactions:
    → A creature entering from GY with finality counter: when it "dies" (goes to GY normally),
      replacement effect exiles it instead → it never goes to GY → descend doesn't count it
    → This means finality counter permanents, when destroyed, go to exile, NOT GY
    → They do NOT contribute to future descend counts after death
    → A permanent that's sacrificed (as a cost) — sacrifice sends it to the GY first...
      Wait: sacrificing sends it to the GY, then the finality counter replacement would exile
      it instead. So even sacrificed finality-counter permanents go to exile, not GY.
    → Bounce (return to hand): finality counter is irrelevant — the permanent goes to hand,
      not GY. The counter does nothing for non-GY exits.
    → Exile (as a cost, e.g., "exile a creature"): finality counter is irrelevant —
      already going to exile, no "would go to GY" event occurs.

THE ANCIENT ONE — special combat rule:
  "Once The Ancient One has legally attacked or blocked, removing permanent cards from
  your graveyard so the descend 8 ability no longer applies won't remove The Ancient One
  from combat." (Official ruling 2023-11-10)
  → This is a unique ruling confirming that static descend abilities are checked at
    declaration time for combat purposes, but once in combat, the creature stays in combat
    regardless of subsequent GY changes.
  → Design intent: attacking/blocking decisions are made, then shouldn't be retroactively
    invalidated by mid-combat GY manipulation.
```

## Definitive Conclusions

**Static vs. Triggered — The Critical Difference:**
- Static descend (continuous effects) cannot be "responded to" — there is no stack, no window. Opponents must proactively exile your GY before the moment when the static check matters (combat declaration, etc.).
- Triggered descend with intervening-if CAN be gamed between trigger and resolution. This creates real gameplay decisions: sacrifice a permanent to push yourself over the threshold (or your opponent sacrifices something to drop you under). Both players get a window.
- Cast-time descend (Wail of the Forgotten) is a third case: locked at cast, no post-cast adjustment.

**Finality Counter Anti-Loop Design:**
- Finality counters are an elegant design solution to the "recurring threat from GY" problem. Uchbenbak can reanimate itself exactly once — the finality counter ensures it goes to exile, not GY, on death, preventing the reanimation loop. This interacts with descend: each use of Uchbenbak's ability removes it from the GY (it enters the battlefield), and if it dies, removes it from the GY permanently (exile). The descend count is unaffected by a finality-countered death — the permanent goes to exile, never to the GY.
- Multiple finality counters are redundant but don't cause issues. Proliferate can spread finality counters to other creatures, permanently marking them for exile-on-death.

**Tokens and Descend:**
- A Goblin token that dies in combat is NOT in your GY by the time descend is checked, even if the combat damage step just happened. SBAs run between steps and phases, and SBAs remove tokens from non-battlefield zones. For all practical purposes, tokens never count toward descend. This is counterintuitive to new players who think "but it was in my graveyard for a moment."

## Canonical Examples

**Gaming triggered descend:**
- Coati Scavenger (LCI): "Descend 4 — When this creature enters, if there are four or more permanent cards in your graveyard, return target permanent card from your graveyard to your hand." You have exactly 4 permanent cards in GY, including Coati Scavenger itself? No — Coati Scavenger is on the battlefield when the trigger fires. You have 3 other permanent cards in GY. Opponent Relic of Progenituses you in response: exiles a permanent card from your GY. Now 2 permanent cards in GY. Trigger resolves → condition fails → no return.

**Static descend and The Ancient One:**
- The Ancient One is in play with 10 permanent cards in your GY. You declare it as an attacker. Mid-combat, opponent exiles 3 permanent cards from your GY (GY drops to 7 — below 8). The Ancient One is still attacking. The "can't attack or block unless" static ability is checked at declaration; once declared, the Ancient One stays in the attack. The opponent's timing was too late to prevent the attack.

**Finality counter prevents Uchbenbak loop:**
- You have 8+ permanent cards in GY including Uchbenbak. Activate: Uchbenbak enters with finality counter. GY now has 7 permanent cards (Uchbenbak is on battlefield, not GY — it's no longer counted). Opponent destroys Uchbenbak. Finality counter exiles it. GY now has 7 permanent cards (no Uchbenbak). You cannot reactivate Uchbenbak's ability because it's not in your GY.

**Wail of the Forgotten cast-time lock:**
- You have 8 permanent cards in GY. Cast Wail of the Forgotten, selecting three modes. Opponent responds with Tormod's Crypt (exile all cards from target player's GY). Your GY becomes empty. Wail resolves with all three modes — the cast-time check was already complete when you cast the spell.

**Permanent type edge cases:**
- You have 7 permanent cards in GY. Opponent discards an instant to draw a card (cycling). The instant in your opponent's GY doesn't count toward YOUR descend (descend checks YOUR GY, and instants don't count regardless). You sacrifice a land (a land in GY = 1 permanent card). Now 8 permanent cards in your GY. Descend 8 achieved.

## Commonly Confused With

- **P466** (Descend/Backup/Eerie) — P466 covers Descend's basic structure, token rule, and intervening-if clause; this pattern covers the static vs. triggered vs. cast-time distinction, threshold gaming windows, and finality counter integration
- **P006** (Intervening If Clause) — General rule for double-checking triggered abilities; Descend triggered form is a key modern application of this rule
- **P461** (Threshold/Metalcraft/Delirium) — Threshold (7+ cards in GY, any type) vs. Descend (N+ permanent CARDS in GY) vs. Delirium (4+ card types in GY) — different GY-count conditions; Threshold counts ALL card types, Descend counts only permanent types
- **P009** (Zone-Change Trigger Race) — Not the same, but related when a permanent's death simultaneously satisfies descend for the first time and triggers something; ordering matters
- **P019** (Mandatory Infinite Loop) — Uchbenbak + finality counter PREVENTS the loop that a GY-reanimation creature without finality would create; relevant contrast for self-reanimate threats
