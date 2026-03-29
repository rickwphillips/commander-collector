---
id: p312
name: The Legendary Rule and World Rule — Multiple Legendary Permanents Trigger SBAs
category: continuous
cr_refs: [704.5j, 704.5k, 400.7]
tags: [legendary-rule, world-rule, legend-rule, same-name, SBA, second-legend, Clone, Riku-of-Many-Paths, Rite-of-Replication, Commander-legendary, Emeria-Shepherd, Thalia-Guardian-of-Thraben]
created: 2026-03-29
examples_count: 2
---

# P312 — The Legendary Rule and World Rule — Multiple Legendary Permanents Trigger SBAs

## Abstract
The "legend rule" is a state-based action: if two or more legendary permanents with the same name are under the same player's control, that player chooses one to keep and the rest go to their owners' graveyards. This triggers immediately as a SBA check — not as a triggered ability. Opponents can each have their own copy of the same legendary. The world rule works similarly for world permanents (oldest survives). Importantly, players can exploit the legend rule strategically: casting a second copy of your own legendary can trigger the ETB of the new copy, then let the legend rule destroy one.

## The Definitive Rules

**CR 704.5j** (verbatim): *"If two or more legendary permanents with the same name are controlled by the same player, that player chooses one of them, and the rest are put into their owners' graveyards. This is called the 'legend rule.'"*

**CR 704.5k** (verbatim): *"If two or more permanents have the supertype world, all except the one that has had the world supertype for the shortest amount of time are put into their owners' graveyards. In the event of a tie for the shortest amount of time, all are put into their owners' graveyards. This is called the 'world rule.'"*

## The Pattern

```
THE LEGEND RULE:
  Condition: same player controls two or more legendaries with the SAME NAME
  SBA fires: player chooses one to keep. Rest go to their owner's GY.
  "Same name" = exact English name match (not card type match)
  Different cards named differently: not affected.
  Both players can each have a copy of the same legendary: that's fine.

  IMPORTANT:
    The player who controls BOTH legends must choose.
    Opponent can't force the choice.
    You choose which one to keep.
    Often: keep the newer one (ETB already triggered, newer state).

STRATEGIC USES OF THE LEGEND RULE:
  (A) Blink/Bounce to re-trigger ETB:
    You control Thalia, Guardian of Thraben.
    Opponent controls Thalia, Guardian of Thraben (both players: fine, different controllers).
    But if YOU control two: legend rule triggers.

  (B) Cast second copy to get ETB twice, then legend-rule the first:
    You control Reclamation Sage (not legendary — bad example).
    Better: Nissa, Who Shakes the World (legendary).
    Control Nissa. Cast second Nissa. Second Nissa enters: ETB fires.
    SBAs: you control two legendary Nissa. Choose: keep the newer one (ETB already triggered).
    Put older Nissa in GY. Net: got ETB trigger twice, now have fresh Nissa.
    This works if the ETB is valuable and you want to reset.

  (C) Legend-ruling the old one to reset equipment/Auras it had:
    Old Tarmogoyf (not legendary), let's use something legendary.
    Actually: more commonly done with commanders in Commander:
    Kill your own commander (to avoid tax) → send to command zone.
    Or: cast the commander from command zone → legend rule with an existing version
    → choose to keep the new one, old one to GY (but Commander can choose command zone instead).

  THE SELF-LEGEND RULE PLAY:
    Often: you want to re-trigger ETBs without flickering.
    Cast your legendary creature. Get ETB.
    Later: recast it from GY (reanimation), or get another copy via clone/copy effects.
    The second copy ETBs. Legend rule fires. You keep the copy (or whichever you choose).
    One of them goes to GY: GY trigger fires ("when this creature dies").
    Chain: ETB → legend rule → death trigger.

CLONE AND LEGEND RULE:
  Clone spells copy a creature: the copy becomes a legendary creature if the original is legendary.
  Two copies of the same legendary under your control: legend rule.
  CLONE YOURSELF:
    You control Emeria Shepherd (legendary Angel).
    You cast Clone, copying Emeria Shepherd.
    Clone enters as a copy = legendary Emeria Shepherd.
    Legend rule: two "Emeria Shepherd" under your control.
    Choose which to keep. Other goes to GY.
    ETB of the Clone-Shepherd already triggered on entry.
    You keep either version.

  CLONE AN OPPONENT'S LEGEND:
    Opponent controls Sheoldred, the Apocalypse.
    You cast Phantasmal Image copying Sheoldred.
    Now YOU control a Sheoldred AND your opponent controls one.
    Different controllers: no legend rule! You each have your own legendary.
    Your Sheoldred triggers on their draws. Their Sheoldred triggers on your draws.
    Both running simultaneously (against each other or for their owners).

RITE OF REPLICATION + LEGENDARY:
  Rite of Replication kicked targeting a legendary creature: creates 5 token copies.
  All 5 copies enter simultaneously (legend rule check).
  You now control: original + 5 copies = 6 total.
  Legend rule: keep ONE. Other five go to GY.
  BUT: all 5 copies entered simultaneously → all 5 ETB triggers fired.
  AND all 5 going to GY → 5 "when creature dies" triggers fire.
  Double-sided explosion: massive ETB chain + death trigger chain.
  Classic Commander play: copy Avenger of Zendikar 5 times → 5 ETB plant token swarms → then 5 die.

WORLD RULE:
  CR 704.5k: "world" supertype. All except the newest world permanent → GY.
  "Newest" = shortest time with world supertype.
  Two worlds entering simultaneously → all go to GY (tied for newest).
  Rarely relevant: only for old cards with World supertype.
  Nether Void ({3}{B}{B}): World Enchantment. "Whenever a player casts a spell, counter it unless
    they pay {3}."
  Two Nether Voids: both have World. Keep the newer one (just entered).

LEGENDARY PERMANENTS OF DIFFERENT TYPES:
  The legend rule is per-name, not per-type.
  Jace, the Mind Sculptor (Planeswalker) entering while you control Jace, the Mindsculptor:
    Same name → legend rule. (Note: there's only one card of that name.)
  Different Jace planeswalkers (different names): Jace Beleren vs. Jace, the Mind Sculptor.
    Different names → no legend rule. Two Jace planeswalkers with different names: both stay.
  "Jace" isn't a name — "Jace, the Mind Sculptor" is the full name.

LEGENDARY LANDS:
  Legendary lands: same rule applies.
  Two copies of Tolarian Academy (legendary land) under one player → legend rule.
  Rarely an issue with 4-of in a 60-card deck, but happens.

COMMANDER SPECIAL RULE:
  In Commander, if the commander would go to GY via legend rule:
    The commander's owner may choose to send it to the command zone instead.
    This applies even to non-commander-legends: the 903.9 rule only applies to YOUR commander.
    Other legendary non-commander permanents still go to GY via normal legend rule.
```

## Definitive Conclusions

- **Legend rule is an SBA** — fires automatically when two legendary permanents with the same name are under the same player's control.
- **Different controllers can each have a copy** — the rule only checks per-player ownership.
- **Rite of Replication on a legendary creates an ETB + death cascade** — all 5 copies ETB, then legend rule forces 5 to GY.
- **World rule eliminates older world permanents** — the most recently entered world permanent survives.
- **In Commander, commanders can go to the command zone instead of GY** when being "legend-ruled."

## Canonical Example
**Rite of Replication on Avenger of Zendikar — Commander Explosion:**
Board: you control 7 lands, an empty board otherwise.
Cast Rite of Replication kicked ({8}{U}{U}) targeting Avenger of Zendikar.
5 token copies created simultaneously.
Each copy enters: Avenger of Zendikar ETB triggers "create 0/1 Plant tokens for each land you control."
5 ETB triggers: each fires seeing 7 lands → 5 × 7 = 35 Plant tokens created simultaneously.
State-based actions: you now control 5 legendary "Avenger of Zendikar" tokens + the original Avenger.
Plus the original Avenger. Legend rule: keep ONE "Avenger of Zendikar."
You choose: keep one token (or the original). The other 5 go to GY.
"When this creature is put into a GY from the battlefield": 5 death triggers fire.
Each death trigger: depends on the Avenger's text. Avenger doesn't have a death trigger.
But Landfall triggers (if lands came in): each Plant gets +1/+1 per land drop this turn.
35 0/1 Plants + pumps from lands played after.
Attacking next turn: potentially lethal damage from a swarm of Plants.
Total from one Rite of Replication: 35 creatures and a board-wipe position.

**Example 2 — ETB Re-trigger via Legend Rule:**
Board: Asuza, Lost But Seeking (1/2, "You may play two additional land drops each turn") — your commander.
Hand: a second copy of Asuza (from reanimation effect or another means).
Cast Asuza from hand (or recast from command zone for second time this game: pay +{2} tax for second copy).
Actually: in Commander you can only have one copy normally (singleton). Let's use a different scenario.
Alternate: You control Bladewing the Risen ({3}{B}{B}{R}{R}: 4/4 Dragon. "When it enters, return target Dragon from GY to battlefield.").
You want to re-trigger it. Use Flicker (Restoration Angel flicker, wait — Bladewing is not targeted by Resto Angel? Actually Resto Angel can flicker ANY non-Angel creature you control.).
Restoration Angel flickers Bladewing: Bladewing leaves (new object), returns → ETB fires again → return another Dragon from GY.
Result: two Dragon recursions from one Bladewing + Resto Angel.
This exploits the "new object returns → ETB re-triggers" concept, but NOT the legend rule directly.
The legend rule play: only if you have access to two copies (unusual in singleton formats but possible via Copy spells).

## Commonly Confused With
- **P311 (New Object Rule)** — After the legend rule puts a permanent in the GY, the GY version is a new object; the surviving legend retains all counters, attachments, and damage marks.
- **P290 (Planeswalker Loyalty)** — Planeswalkers are legendary; the legend rule applies to planeswalkers too. Two "Jace, the Mind Sculptor" under your control → legend rule.
- **P293 (Commander Format)** — Commander uses the legend rule too; commanders specifically get to go to the command zone instead of GY when being legend-ruled.
- **P281 (Token Rules)** — Tokens created by Rite of Replication targeting a legendary creature become legendary too (they're copies); they're subject to the legend rule.
