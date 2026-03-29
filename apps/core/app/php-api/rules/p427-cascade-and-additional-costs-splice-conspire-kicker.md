---
id: p427
name: Cascade and Additional Costs — Splice, Conspire, and Kicker Can Be Paid on Cascaded Spells
category: costs
cr_refs: [702.85a, 601.2b, 601.2f, 702.47a, 702.78a, 702.33a, 107.3]
tags: [cascade, additional-costs, splice, conspire, kicker, without-paying-mana-cost, alternative-cost, free-cast-additional-costs, Bloodbraid-Elf, Glacial-Ray, Evermind, Burn-Trail, Thornscape-Battlemage, cascade-splice-arcane, cascade-conspire, cascade-kicker, 601.2b-additional-costs, free-spell-upgrades]
created: 2026-03-29
examples_count: 2
---

# P427 — Cascade and Additional Costs — Splice, Conspire, and Kicker Can Be Paid on Cascaded Spells

## Abstract
When cascade (702.85a) lets you "cast a card without paying its mana cost," the phrase "without paying its mana cost" is an **alternative cost** — it replaces only the **mana cost** portion of casting. It does NOT prevent paying **additional costs**. Per CR 601.2b–f, alternative costs replace the mana cost but additional costs (kicker, conspire, buyback, splice) are paid alongside the casting. Therefore: **you can pay kicker** on a cascaded creature; **you can tap two creatures for conspire** on a cascaded conspire spell (creating a free copy!); and **you can pay splice** costs to attach additional effects to a cascaded Arcane spell. The spliced text then becomes part of the spell's characteristics (P411), so if the cascaded Arcane spell is copied, the copy also includes the spliced text. This transforms cascade from "free spell" into "free spell + optional upgrades" at the cost of the additional cost payments.

## The Definitive Rules

**CR 702.85a** (verbatim, key excerpt): *"...You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value..."*

**CR 601.2b** (verbatim): *"If the spell is modal, the player announces the mode choice. If the spell has a variable cost such as {X}, the player announces the value chosen for X. If the player has the ability to play the spell for free or its cost is reduced, the player announces that intent. The player then has the option to pay additional costs. ..."*

**CR 601.2f** (verbatim): *"The player determines the total cost of the spell. Usually this is just the mana cost. Some spells have additional or alternative costs. An alternative cost may be paid instead of the spell's mana cost. Additional costs must be paid in addition to all other costs."*

**CR 702.47a** (verbatim, Splice): *"Splice onto [quality] is a static ability that functions while the card with splice is in a player's hand. 'Splice onto [quality] [cost]' means 'You may reveal this card from your hand as you cast a [quality] spell. If you do, copy this card's text box onto that spell and pay [cost] as an additional cost to cast it.'"*

**CR 702.78a** (verbatim, Conspire): *"...'Conspire' means 'As an additional cost to cast this spell, you may tap two untapped creatures you control that each share a color with it' and 'When you cast this spell, if its conspire cost was paid, copy it...'"*

**CR 702.33a** (verbatim, Kicker): *"Kicker is a static ability that functions while the spell with kicker is on the stack. 'Kicker [cost]' means 'You may pay an additional [cost] as you cast this spell.'"*

## The Pattern

```
THE RULE: "WITHOUT PAYING ITS MANA COST" ≠ "PAY NOTHING AT ALL"

  "Without paying its mana cost" is an ALTERNATIVE COST (601.2b).
  Alternative costs REPLACE the mana cost. They don't prevent paying additional costs.
  From CR 601.2f: "An alternative cost may be paid instead of the spell's mana cost.
    Additional costs must be paid in addition to all other costs."

  The casting process (601.2) still applies fully when cascade lets you cast a card:
    - You announce the spell
    - You may choose modes, choose X values, etc.
    - You may (optionally) pay additional costs
    - You pay the total cost (alternative cost = 0 for the mana portion, + any additional costs)

  "Without paying its mana cost" specifically replaces step: "pay the mana cost."
  Everything else in the casting process proceeds normally.

KICKER + CASCADE:
  Thornscape Battlemage ({2}{G}: 2/2; kicker {W}, kicker {R}; "if kicked with {W}: destroy target
    enchantment"; "if kicked with {R}: destroy target artifact"):
  MV = 3 (just the base {2}{G}).
  Cascade from a MV=4+ spell: cascade finds Thornscape Battlemage (MV 3 < MV of cascade spell).
  You cast Battlemage for FREE (without paying its mana cost = don't pay the {2}{G}).
  But you MAY still pay the kicker costs:
    Pay {W}: kicked with {W} → destroy target enchantment.
    Pay {R}: kicked with {R} → destroy target artifact.
    Pay {W} and {R}: both kicks → destroy an enchantment AND an artifact.
  You spend up to {W}{R} on a "free" spell to get massive ETB utility.

  The alternative cost ("without paying mana cost") removed the {2}{G} payment.
  The additional costs (kicker {W} and/or kicker {R}) are still optional payments.
  RESULT: cascade + kicker = free spell + optional upgrades for kicker cost only.

SPLICE + CASCADE (ARCANE):
  To splice, you must be casting a spell of the quality the splice attaches to.
  Splice onto Arcane (702.47a): "...as you cast a [Arcane] spell."
  Cascade sometimes finds Arcane spells (Kamigawa block Arcane instants/sorceries).
  When you cascade into an Arcane spell, you ARE casting that Arcane spell.
  Therefore: you may reveal Splice cards from your hand and pay their splice costs.

  Example:
    Glacial Ray ({1}{R}: Instant — Arcane; "Glacial Ray deals 2 damage to any target"; Splice
      onto Arcane {2}{R}):
    Evermind (Blue; Instant — Arcane; "draw a card"; Splice onto Arcane {1}{U}):

    Bloodbraid Elf (cascade, MV 4) cascades and finds Glacial Ray (MV 2).
    You cast Glacial Ray for free (without paying the {1}{R}).
    You have Evermind in hand. You may reveal Evermind and pay {1}{U} as a splice additional cost.
    Glacial Ray's text is now: "deal 2 damage to any target; draw a card." (Splice adds draw text.)
    You spend {1}{U} total for this free Arcane spell. Result: 2 damage + draw a card.

  THE KEY FROM P411: spliced text becomes part of the spell's characteristics.
  If the cascaded+spliced Arcane spell is then copied (Fork, Reverberate, storm copies from
    another source), the copy includes the spliced text.
  Example: cascade into Arcane spell, splice Glacial Ray onto it. Then Reverberate copies the
    (now larger) spell. The Reverberate copy deals 2 damage AND draws a card — the spliced
    text is part of the copied spell's characteristics.

CONSPIRE + CASCADE:
  Conspire (702.78a): "As an additional cost to cast this spell, you may tap two untapped
    creatures you control that each share a color with it."
  When cascade lets you cast a conspire spell:
    You ARE casting the spell (cascade results in a genuine cast event).
    You may pay the conspire additional cost: tap two creatures sharing a color with the spell.
  If you pay conspire: the conspire trigger fires ("when you cast this spell, if conspire cost
    was paid, copy it").
  RESULT: free spell (from cascade) + copy of that spell (from conspire) for the cost of
    tapping two creatures.

  Example:
    Cascade finds Burn Trail ({3}{R}: Sorcery; "Burn Trail deals 3 damage to any target"; conspire):
    Cast Burn Trail for FREE (without paying {3}{R}).
    You control two untapped red creatures. You tap them as the conspire additional cost.
    Conspire trigger fires: copy Burn Trail. Choose new target. Choose new target.
    Result: 6 damage total for free from cascade + tapping two creatures.

  INTERACTION WITH P423 (CONSPIRE NOT RE-TRIGGERING):
    The conspire copy was not CAST (it was created by the conspire trigger). The conspire
    trigger on the copy doesn't fire again (copies aren't cast). No infinite loop.
    But: you do get the conspire copy's effect in full. One copy per conspire payment.

BUYBACK + CASCADE:
  Buyback (702.27a): "As an additional cost to cast this spell, you may pay [buyback cost].
    If the buyback cost was paid, put this spell into its owner's hand instead of its GY."
  Can you pay buyback on a cascaded spell? YES — same principle. Buyback is an additional cost.
  If you pay buyback cost on a cascaded spell: the spell returns to your hand on resolution.
  You cascaded into a free spell AND kept it for next turn. Expensive (buyback costs are high)
    but technically legal.

X COSTS + CASCADE:
  If the cascaded spell has an X cost, X=0 is the default when cast for free.
  But: you CAN pay X > 0 as an additional cost? Actually, no — X is not an "additional cost."
    X is part of the mana cost of the spell. When you cast "without paying mana cost," X=0
    because no mana is being paid for the mana cost.
    You can't separately "pay X" because X is within the mana cost structure, not an additional cost.
  RESULT: cascading into an X spell gives you X=0. X is NOT a separately payable additional cost.
  This is different from kicker/splice/conspire (which are truly additional costs, not mana cost X).

MANA COST REDUCTION AFTER CASCADE:
  Cost reduction effects that reduce mana costs (Goblin Electromancer, etc.) don't combine
    with cascade's free cast in a meaningful way.
  If cascade says "cast without paying mana cost," the mana cost is already 0.
    Reducing a 0 cost doesn't change anything.
  Cost reduction would be relevant if cascade said "reduce cost by {2}" or something, but
    cascade replaces the cost with zero, so reduction is moot.
```

## Definitive Conclusions

- **Kicker can be paid on cascaded spells** — cascade removes the mana cost; kicker is a separate additional cost that still applies; paying {W} kicker on a free Thornscape Battlemage gives the full kicked ETB effects.
- **Splice can be applied to cascaded Arcane spells** — cascade results in a genuine cast; the "casting an Arcane spell" condition for splice is met; you pay the splice cost as an additional cost on top of the free cast.
- **Conspire can be paid on a cascaded spell** — tapping two creatures as conspire's additional cost is still legal during a cascade cast; the conspire triggered copy fires, giving you a free copy; no infinite loop (the copy wasn't cast, conspire doesn't re-trigger).
- **Buyback can be paid on cascaded spells** — the spell returns to your hand on resolution; expensive but legal.
- **X values can NOT be paid above 0 on cascaded spells** — X is part of the mana cost structure, which is replaced by the "without paying mana cost" alternative; X remains 0 (unlike kicker/splice which are truly separate additional costs).

## Canonical Example
**Bloodbraid Elf cascading into Thornscape Battlemage (kicked):**
You control Bloodbraid Elf ({2}{R}{G}: 3/2 haste; cascade). Cascade trigger fires.
Exile from library until finding MV < 4. Find Thornscape Battlemage ({2}{G}: 2/2; kicker {W}:
  destroy target enchantment; kicker {R}: destroy target artifact).

Cascade lets you cast Thornscape Battlemage without paying its mana cost.
The battlefield has: an opponent's Ensnaring Bridge (artifact) and Blood Moon (enchantment).
You have {W}{R} floating.

Cast Battlemage for free (no {2}{G} paid). Pay kicker {W} + kicker {R} as additional costs.
Two kicks: when Battlemage enters, destroy Ensnaring Bridge AND destroy Blood Moon.
Bloodbraid Elf resolves: 3/2 with haste.

Total spent: {2}{R}{G} (Bloodbraid's cost) + {W}{R} (kicker costs) = {2}{R}{G}{W}{R}.
Total received: Bloodbraid 3/2 haste + Thornscape Battlemage 2/2 + both artifacts/enchantments destroyed.
The kicker made the cascade hit dramatically more valuable.

**Example 2 — Cascade into Arcane Spell + Splice:**
You cascade and find Peer Through Depths ({1}{U}: Instant — Arcane; look at top 5 cards, put an
  instant or sorcery into hand, rest to bottom).
You have in hand: Glacial Ray ({1}{R}: Instant — Arcane; "deal 2 damage to target"; splice onto
  Arcane {2}{R}).

Cast Peer Through Depths for free (cascade's alternative cost). Reveal Glacial Ray and pay {2}{R}
  as additional splice cost.
Peer Through Depths now reads: "look at top 5, take an instant or sorcery; rest to bottom; deal 2
  damage to any target." (Both effects from both spells.)
Peer Through Depths resolves: you look at top 5, take a card, AND deal 2 damage.
Glacial Ray is still in your hand (splice doesn't discard the spliced card — you just pay its cost).

Net: free Arcane filtering + 2 damage for {2}{R}. Glacier Ray stays in hand for another splice.

## Commonly Confused With
- **P424 (Cascade)** — P424 covers cascade's fundamental mechanics (MV threshold, Cage doesn't stop it, chains). P427 is the specific additional-cost interaction: "without paying mana cost" replaces the mana cost but not additional costs.
- **P409 (Copy Effects + Alternative/Additional Costs)** — P409 covers whether copies of kicked/flashed-back spells preserve the cost properties. P427 covers paying the additional costs in real time during a cascade cast. The underlying rule (601.2b) is the same.
- **P411 (Splice + Copy Effects)** — P411 covers that spliced text becomes part of the spell's characteristics, so copies inherit it. P427 covers that cascade casts are genuine casting events where splice can be paid. Together: cascade into Arcane + splice → copy that spell = copy includes spliced text.
- **P423 (Conspire)** — P423 covers conspire as an additional cost with a copy trigger. P427 applies P423's rules to the cascade context: cascade cast enables conspire payment; conspire fires; no infinite loop (copy not cast).
