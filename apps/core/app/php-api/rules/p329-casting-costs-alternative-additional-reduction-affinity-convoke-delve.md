---
id: p329
name: Casting Costs — Alternative Costs, Additional Costs, Cost Reduction, Affinity, Convoke, Delve
category: costs
cr_refs: [601.2b, 601.2f, 601.2g, 601.2h, 118.8, 118.9, 118.9a, 702.41a, 702.51a, 702.51b, 702.66a, 702.66b]
tags: [casting-cost, alternative-cost, additional-cost, cost-reduction, Affinity, Convoke, Delve, flashback, kicker, overload, buyback, suspend, X-spell, cost-locking, Thunderscape-Familiar, Goblin-Electromancer, Tasigur, Treasure-Cruise, Brain-Geyser]
created: 2026-03-29
examples_count: 2
---

# P329 — Casting Costs — Alternative Costs, Additional Costs, Cost Reduction, Affinity, Convoke, Delve

## Abstract
Casting a spell involves determining a **total cost** — which starts as the mana cost, then applies all alternative costs, additional costs, increases, and reductions in a specific order. Once the total cost is **locked in** (CR 601.2f), further changes have no effect. Only **one alternative cost** can apply at a time (CR 118.9a). **Additional costs** stack freely (CR 118.8). Cost reductions can bring the mana component to zero but no lower. **Affinity**, **Convoke**, and **Delve** are cost-payment mechanics that operate differently: Affinity reduces total cost; Convoke and Delve let you pay the ALREADY DETERMINED total cost by alternative means (tapping creatures or exiling graveyard cards). These distinctions matter for interactions.

## The Definitive Rules

**CR 601.2b** (verbatim): *"If the spell has alternative or additional costs that will be paid as it's being cast such as buyback or kicker costs (see rules 118.8 and 118.9), the player announces their intentions to pay any or all of those costs..."*

**CR 601.2f** (verbatim): *"The player determines the total cost of the spell. Usually this is just the mana cost. Some spells have additional or alternative costs. Some effects may increase or reduce the cost to pay, or may provide other alternative costs. Costs may include paying mana, tapping permanents, sacrificing permanents, discarding cards, and so on. The total cost is the mana cost or alternative cost (as determined in rule 601.2b), plus all additional costs and cost increases, and minus all cost reductions. If multiple cost reductions apply, the player may apply them in any order. If the mana component of the total cost is reduced to nothing by cost reduction effects, it is considered to be {0}. It can't be reduced to less than {0}. Once the total cost is determined, any effects that directly affect the total cost are applied. Then the resulting total cost becomes 'locked in.' If effects would change the total cost after this time, they have no effect."*

**CR 118.8** (verbatim): *"Some spells and abilities have additional costs. An additional cost is a cost listed in a spell's rules text, or applied to a spell or ability from another effect, that its controller must pay at the same time they pay the spell's mana cost or the ability's activation cost."*

**CR 118.9a** (verbatim): *"Only one alternative cost can be applied to any one spell as it's being cast."*

**CR 702.41a** (verbatim): *"Affinity is a static ability that functions while the spell with affinity is on the stack. 'Affinity for [text]' means 'This spell costs {1} less to cast for each [text] you control.'"*

**CR 702.51a** (verbatim): *"Convoke is a static ability that functions while the spell with convoke is on the stack. 'Convoke' means 'For each colored mana in this spell's total cost, you may tap an untapped creature of that color you control rather than pay that mana. For each generic mana in this spell's total cost, you may tap an untapped creature you control rather than pay that mana.'"*

**CR 702.51b** (verbatim): *"The convoke ability isn't an additional or alternative cost and applies only after the total cost of the spell with convoke is determined."*

**CR 702.66a** (verbatim): *"Delve is a static ability that functions while the spell with delve is on the stack. 'Delve' means 'For each generic mana in this spell's total cost, you may exile a card from your graveyard rather than pay that mana.'"*

**CR 702.66b** (verbatim): *"The delve ability isn't an additional or alternative cost and applies only after the total cost of the spell with delve is determined."*

## The Pattern

```
THE COST DETERMINATION SEQUENCE (CR 601.2f):
  Step 1: Start with mana cost (or alternative cost if one is being used).
  Step 2: Add all additional costs.
  Step 3: Add all cost increases.
  Step 4: Subtract all cost reductions.
  Step 5: Apply any effects that directly affect total cost.
  Step 6: LOCK IN the total cost. No further changes.
  Step 7: Activate mana abilities (CR 601.2g).
  Step 8: Pay the locked-in total cost (CR 601.2h).

  ORDER OF REDUCTIONS: If multiple reductions apply, player chooses the order.
  FLOOR: Mana component can't go below {0}.
  Non-mana costs (sacrifice, discard): can't be reduced or eliminated by most effects.
    Exception: specific effects that say "you may skip the sacrifice cost" etc.

ALTERNATIVE COSTS (CR 118.9):
  ONLY ONE alternative cost can apply. Can't stack two alternatives.
  Alternative costs are phrased:
    - "You may cast this without paying its mana cost"
    - "You may pay [different cost] rather than pay this spell's mana cost"
    - Flashback: "Cast this from your graveyard by paying [cost] instead"
    - Overload: "You may cast this by paying [overload cost]" (changes "target" to "each")
    - Bestow: "You may cast this as an Aura by paying [bestow cost]"
    - Surge: "You may cast this by paying [surge cost] if an ally cast a spell this turn"
    - Suspend (exile for free at end): technically a special action, not a cast alternative
  MUTUALLY EXCLUSIVE: if a spell has both flashback and can be cast "without paying its mana cost"
    (from Show and Tell, etc.), you must choose ONE. You can't stack both.
  Note: "without paying its mana cost" means the mana cost is 0 — but additional costs still apply!
    Example: Chaos Warp says opponent can cast top card "without paying its mana cost."
    If that card has an additional cost (sacrifice a creature), they still pay that.

ADDITIONAL COSTS (CR 118.8):
  Additional costs are listed in rules text or applied by effects.
  They're PAID IN ADDITION to the mana cost (or alternative cost).
  MULTIPLE additional costs can stack:
    - Kicker: optional additional cost for bonus effect.
    - Entwine: additional cost to choose all modes.
    - Buyback: optional additional cost to return card to hand.
    - Ward: mandatory additional cost for opponents targeting your permanents.
  Critical: Additional costs don't change the spell's mana cost for reference purposes.
    (CR 118.8d: "Additional costs don't change a spell's mana cost, only what its controller has to pay.")
    Goblin Electromancer: "Instant and sorcery spells you cast cost {1} less to cast."
    This reduces total cost. But Storm Crow's mana cost is still {1}{U} for Storm purposes.

COST REDUCTION:
  Effects that reduce the cost to cast spells.
  Applied AFTER alternative/additional costs are added.
  Goblin Electromancer ({U}{R}): instants and sorceries cost {1} less.
  Helm of Awakening ({2}: artifact): "Spells cost {1} less to cast." (All spells, not just yours.)
  Multiple reductions: apply in any order (player chooses). Result is the same.
  REDUCTION FLOOR: mana component can't go below {0}. Non-mana costs still apply.
    Example: A spell costs {3} + "sacrifice a creature." Two Helm of Awakening effects reduce by {2}.
    Total: {1} + sacrifice. Further reduction brings mana to {0}, but sacrifice remains.

LOCKING IN (CR 601.2f):
  Once total cost is determined AND locked in: effects that change cost after this have no effect.
  Example: You cast Thunderscape Familiar ({R}: instants cost {1} less for you).
    Familiar reduces your spell costs. BUT: if you sacrifice Familiar as an additional cost
    (e.g., Altar's Reap requires sacrificing a creature), the lock-in rule saves you:
    The cost is LOCKED IN before you pay. So Familiar's cost reduction was calculated first.
    Even though you sacrifice Familiar during payment, you paid the reduced cost.
    (See the CR 601.2h example about exactly this scenario.)
  This lock-in prevents a player from trying to "undo" a cost reduction mid-payment.

AFFINITY (CR 702.41a):
  "Affinity for [artifacts/etc.]" = "This spell costs {1} less for each [thing] you control."
  Affinity is a cost REDUCTION — it reduces the total cost in step 4.
  If Affinity reduces total mana cost to {0}: the spell costs {0} to cast (but still has other costs).
  Affinity for artifacts: original Mirrodin block artifact decks. Arcbound Ravager, Cranial Plating.
    Frogmite ({4}): Affinity for artifacts. If you control 4 artifacts: costs {0}. Free 2/2.
    Myr Enforcer ({7}): Affinity for artifacts. 7 artifacts: costs {0}. Free 4/4.
  Modern era: Affinity for other things. "Affinity for Plains" = costs {1} less per Plains.
  Affinity is NOT Convoke or Delve: Affinity reduces the COST ITSELF. The other two let you pay the cost differently.

CONVOKE (CR 702.51a, 702.51b):
  Convoke: "For each colored/generic mana in total cost, tap a creature of matching color (or any creature for generic)."
  Convoke applies AFTER total cost is determined (locked in).
  Convoke is NOT an alternative or additional cost — it's a way to PAY the existing cost.
  Why does this matter?
    If a cost reduction applies (e.g., Goblin Electromancer on a convoke sorcery): reduce first, THEN convoke applies to the reduced total.
    A convoke sorcery that costs {5}{G}{G}: with Goblin Electromancer → {4}{G}{G}.
    You can tap up to 2 green creatures (for the two {G}) and up to 4 other creatures for the 4 generic.
  IMPORTANT: creatures tapped for Convoke can't also be used for other costs in the same spell.
    CR 118.10: each payment applies only to one cost.
    But Convoke itself: a single creature taps to pay for ONE mana symbol.
  Example: Chord of Calling ({X}{G}{G}{G}, Convoke — puts a creature from library onto battlefield):
    With 4 green creatures to convoke: {4}{G}{G}{G}{G} worth of convoke → reduces payment significantly.
    Wait: total cost for X=4 is {4}{G}{G}{G}. Convoke: tap 3 green creatures (pay {G}{G}{G}) and one more creature (pay one generic). Plus mana for {4} remaining generic.

DELVE (CR 702.66a, 702.66b):
  Delve: "For each generic mana in total cost, exile a card from your graveyard rather than pay that mana."
  Same as Convoke: applies AFTER total cost is locked in. NOT an alternative/additional cost.
  Can only substitute for GENERIC mana, not colored mana.
  Treasure Cruise ({7}{U} — Draw 3 cards, Delve): Mana cost has {7} generic + {U}.
    If you have 7 cards in graveyard: exile all 7 → pay only {U}. Draw 3 for {U}. BROKEN.
    Banned in most formats for this reason.
  Tasigur, the Golden Fang ({5}{B}, Delve — 4/5):
    With 5 GY cards: exile 5, pay {B}. 4/5 for {B}. Also broken. Sees Modern play.
  Delve INTERACTS WITH COST REDUCTIONS:
    If Tasigur's cost were reduced by {1} (somehow), total cost becomes {4}{B}.
    Then Delve: can exile up to 4 cards for the 4 generic mana.
    Reduction applies first (step 4), then Delve applies to reduced total.

FLASHBACK (CR 702.36a):
  Alternative cost: cast from graveyard by paying the flashback cost instead of mana cost.
  Once you use flashback to cast, the spell is exiled (not returned to GY) when it resolves.
  Flashback is an alternative cost: you may ONLY use it if the card is in your GY.
  Combining flashback with cost reduction works: "Instants and sorceries cost {1} less" applies to flashback-cast spells.
    Faithless Looting has Flashback {2}{R}. With Goblin Electromancer: flashback costs {1}{R}.
    The reduction applies to the flashback cost (the alternative cost being used).

KICKER (CR 702.33a):
  Optional additional cost. Pay it for a bonus effect.
  Kicker is ADDITIONAL (not alternative): it stacks on top of mana cost.
  Multiple kicker costs possible on a single card (some have two kicker abilities).
  Kicked spells: the spell's mana cost is unchanged; it just has an extra cost.
  Important: storm counts if a kicked spell was cast (it was cast, so storm triggers).

SUSPEND (CR 702.62a):
  Alternative to casting: pay suspend cost to exile the card with time counters.
  At the start of your upkeep with the card suspended: remove a time counter.
  When last time counter removed: cast for free (without paying mana cost — special rule).
    This free cast is NOT "cast without paying its mana cost" from an outside effect.
    It's a special rule for suspended cards. But the effect is the same: free cast.
  Additional costs still apply on the free cast from suspend.

X SPELLS (CR 107.3a):
  If the mana cost includes {X}: announce X when casting.
  While on the stack: X = announced value.
  Cost reduction: If Goblin Electromancer reduces a Fireball's cost, the reduction is applied to the total after X is determined.
    Announce X=5. Fireball costs {X}{R} = {5}{R} = 6 mana total.
    Electromancer reduces by {1}: total cost {4}{R} = 5 mana.
    Fireball's X value is still 5 (you announced 5). Just cost less to cast.
  "Cast without paying mana cost": X = 0 in this case (CR 107.3b).
    Unless the effect specifically defines X.
```

## Definitive Conclusions

- **Only one alternative cost applies** — can't use flashback AND "without paying mana cost" on the same spell.
- **Multiple additional costs DO stack** — kicker, buyback, and entwine can combine.
- **Total cost locks in before payment** — killing a cost reducer mid-payment doesn't change what you owe.
- **Affinity reduces the cost itself**; **Convoke and Delve let you pay the determined cost by alternate means** — not the same category mechanically.
- **Convoke and Delve apply after total cost is locked in** — cost reductions apply first, then these mechanics substitute for the reduced total.
- **Cost reductions can bring mana to {0}** — but can't reduce non-mana costs (sacrifice, discard).
- **Flashback is an alternative cost** — cost reductions apply to the flashback cost; only one alternative can be used.

## Canonical Example
**Treasure Cruise Delve — Broken Efficiency:**
Turn 4 in Modern. Graveyard contains 7 cards (fetch lands, cantrips from turns 1-3).
Treasure Cruise: mana cost {7}{U}. Total cost to cast: {7}{U}.
Delve: exile 7 cards from graveyard → pay for the 7 generic mana.
Remaining: {U}. Pay {U} from a basic Island.
Result: Draw 3 cards for 1 blue mana.
The lock-in point: total cost was determined as {7}{U}, then Delve let you pay the {7} with GY cards.
Why it's broken: Draw 3 cards for {U} is equivalent to Ancestral Recall ({U}: draw 3), the most powerful card ever printed. Treasure Cruise banned in Modern, Legacy, and Commander as a result.

Delve interaction with cost reductions: hypothetically, if Goblin Electromancer applied:
Total cost: {7}{U} - {1} reduction = {6}{U}.
Delve can now exile only 6 cards for the generic portion. Saves 1 card from GY exile.
The reduction applies BEFORE Delve counts how many cards to exile.

**Example 2 — Kicker and Alternative Cost Conflict:**
You want to cast Mystical Dispute ({2}{U}, Counterspell with alternative cost {U} if an opponent controls a blue permanent).
Also: Mystical Dispute has no kicker, but let's consider a kicker card instead.

Better example — Fireball ({X}{R}) with Goblin Electromancer:
Scenario: You have {5}{R} available (6 mana), Goblin Electromancer in play.
Announce X=5 (total mana cost would be {5}{R} = 6 mana).
Electromancer's cost reduction: instant/sorcery spells cost {1} less.
Total cost: {5}{R} - {1} = {4}{R} = 5 mana.
But wait: is Fireball a sorcery? Yes. Cost reduction applies.
X is still 5 (announced before reduction). The X value on the stack = 5.
You pay {4}{R} (5 mana) but Fireball deals 5 damage (X=5).
You saved 1 mana but X wasn't reduced.
MISCONCEPTION: "The cost reduction reduced my X to 4." NO. X = what you announced. The mana you PAY can differ from X.
This is an important distinction: X is announced (and locked in as part of the spell's characteristics); the mana you pay is the cost.
If you had announced X=4 instead: cost is {4}{R} - {1} = {3}{R}. Fireball deals 4 damage.

Key: cost reduction never changes the announced X; it changes what you actually pay.

## Commonly Confused With
- **P328 (Mana Types)** — Mana abilities (CR 605.3b) resolve immediately, used in step 601.2g of casting. The mana you produce goes into the pool, then you pay the locked-in cost from that pool.
- **P323 (Modern Keywords)** — Blitz is an alternative cost that adds haste + death trigger. Casualty is an additional cost. Both follow the one-alternative/multiple-additional rules here.
- **P327 (Equipment/Equip)** — Equip activation costs are not spells but activated abilities; the same cost-determination rules (601.2f) apply with "activation cost" substituted for "mana cost."
- **P317 (DFC/Modal)** — Modal DFCs: the chosen face's mana cost is used for casting. Cost reductions apply to that face's cost. X spells on modal DFCs: the X value is announced and locked in separately from cost reductions.
