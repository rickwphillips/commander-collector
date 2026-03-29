---
id: p424
name: Cascade — Triggered Exile Chain, Mana Value Thresholds, and Free Casting Rules
category: triggered
cr_refs: [702.85a, 702.85b, 702.85c, 107.3, 202.3, 601.2b]
tags: [cascade, triggered-ability, mana-value-threshold, cascade-chain, free-cast, exile-then-cast, Bloodbraid-Elf, Shardless-Agent, Violent-Outburst, Ardent-Plea, cost-reduction-mv, X-spell-cascade, Grafdigger-Cage-cascade, Stifle-cascade, Maelstrom-Nexus, split-card-cascade, cascade-deck, Modern, Legacy, cascade-into-cascade, land-excluded]
created: 2026-03-29
examples_count: 2
---

# P424 — Cascade — Triggered Exile Chain, Mana Value Thresholds, and Free Casting Rules

## Abstract
**Cascade** (702.85) is a triggered ability that triggers when you cast the spell — it exiles cards from the top of your library until finding a nonland card with a **mana value (MV) strictly less than** the cascade spell's MV, then lets you cast it for free. Key non-obvious interactions: (1) cascade is a **triggered ability** that can be Stifled; (2) **cost reduction does not change the cascade spell's MV** — Goblin Electromancer makes the spell cheaper to cast but the MV threshold for cascade doesn't change, since MV is based on the printed mana cost; (3) **cascading into a cascade spell creates a chain** — the found spell may itself have cascade, triggering a new cascade; (4) **Grafdigger's Cage does NOT stop cascade** — the cascaded card is cast from exile (where it was placed by the cascade process), not from the library; (5) **X spells have MV 0 in zones other than the stack**, making them easily found by cascade but cast with X=0 (typically useless unless they have utility at X=0); and (6) **split cards in a cascade library** have their combined MV (sum of both halves), which can be more restrictive than it appears.

## The Definitive Rules

**CR 702.85a** (verbatim): *"Cascade is a triggered ability that functions only while the spell with cascade is on the stack. 'Cascade' means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

**CR 702.85c** (verbatim): *"If a spell has multiple instances of cascade, each triggers separately."*

**CR 107.3** (verbatim excerpt): *"If a cost or effect requires a player to pay an amount of mana, that amount is defined by a variable (X). Unless the spell or ability specifying the payment defines X, each player pays 0 for X."*

**CR 202.3** (verbatim): *"The mana value of a split card not on the stack is the sum of the mana values of its two halves."*

## The Pattern

```
CASCADE SEQUENCE (702.85a):
  Triggers WHEN you cast the spell (while it's on the stack).
  The trigger is a separate triggered ability on the stack above the cascade spell.
  LIFO: the cascade trigger resolves FIRST, before the original cascade spell resolves.

  SEQUENCE:
    1. Cast cascade spell (e.g., Bloodbraid Elf {2}{R}{G}: 3/2 haste; cascade).
    2. Cascade trigger goes on the stack above Bloodbraid Elf.
    3. Players may respond to the cascade trigger (Stifle it, let it resolve, etc.).
    4. Cascade trigger resolves:
       Exile cards from top of library one-by-one until finding a nonland with MV < 4
       (Bloodbraid's MV = 4: {2}{R}{G} = 2+1+1 = 4).
       You MAY cast that card without paying its mana cost.
       Cards that aren't cast go to the bottom of the library in random order.
    5. If a cascaded spell is cast: it goes on the stack. Opponents can respond.
    6. Cascaded spell resolves.
    7. Bloodbraid Elf resolves (enters battlefield as 3/2 haste).

CASCADE IS STIFLE-ABLE:
  Cascade is a triggered ability. It can be countered by:
    Stifle ({U}), Disallow ({1}{U}{U}), Voidslime ({G}{U}{U}), etc.
  If cascade trigger is countered: cascade doesn't happen. The original spell still resolves.
  Bloodbraid Elf enters normally without the free spell.

MANA VALUE THRESHOLD:
  The CASCADE SPELL'S MV determines the ceiling.
  MV is based on the PRINTED mana cost, not the cost paid.
  COST REDUCTION DOES NOT CHANGE MV:
    Goblin Electromancer ({1}{R}: 2/2; "instant and sorcery spells you cast cost {1} less"):
    Cast Violent Outburst ({1}{R}{G}: instant with cascade) with Electromancer: you pay {R}{G}
      instead of {1}{R}{G}. But Violent Outburst's MV is still 3 (printed: {1}{R}{G} = 1+1+1).
    Cascade still looks for cards with MV < 3. The threshold didn't change.
    WHY: MV is a characteristic of the spell based on its printed cost (rule 202).
      Cost reduction modifies what you PAY, not what the spell's MV is.
  X SPELLS AS THE CASCADE SPELL:
    If you cast an X spell with cascade (rare, but possible), X is defined by what you paid.
    For X spells ON THE STACK: MV includes X. If you paid X=5 for a spell costing {X}{R}{G},
      your MV on the stack = 5+1+1 = 7. Cascade looks for cards with MV < 7.
    This matters if you ever design a deck with X cascade spells.

X SPELLS FOUND BY CASCADE:
  X spells in your LIBRARY have MV equal to the non-X portion (X=0 in zones other than the stack).
  Wheel of Fate ({4}{R}: sorcery; "each player discards their hand, draws 7 cards"):
    Wait — Wheel of Fate doesn't have X. Let me use Walking Ballista ({X}{X}: 0/0 artifact creature;
    "enters with X +1/+1 counters; {2}: put a counter on it; remove a counter, deal 1 damage").
  Walking Ballista MV in library = 0 (X=0, so {X}{X} = 0+0 = 0).
  Bloodbraid Elf (cascade, MV 4): cascade looks for cards with MV < 4. Walking Ballista = 0 < 4.
  Cascade can find Walking Ballista. You cast it for FREE without paying its mana cost.
  But: when cast for free, X = 0 (the alternative cost is "without paying its mana cost" = pay
    nothing for the mana cost, which means X is 0 since no mana is paid for the X).
  Walking Ballista cast for free with X=0: enters as a 0/0. SBAs: 0/0 creature is immediately
    put into the GY (P704.5f). You effectively cascaded into a wasted slot.
  PRACTICAL CONSEQUENCE: X spells are POOR cascade hits. They're found easily (low MV) but
    resolve as useless 0/0s (or spells that do nothing at X=0).
  EXCEPTION: some X spells have utility at X=0 (e.g., Ancestral Vision has suspend, not X;
    but some X=0 spells do useful things). Generally avoid X spells in cascade libraries.

CASCADE CHAINS:
  If a cascaded spell also has cascade: the NEW cascade trigger fires when that spell is cast.
  Example:
    Cast Maelstrom Nexus ({W}{U}{B}{R}{G}: enchantment; "the first spell you cast each turn has
      cascade"):
    Actually: cast Maelstrom Wanderer ({5}{U}{R}{G}: 7/5; cascade; cascade — has TWO cascades).
    Wanderer enters stack. CASCADE trigger 1 fires. CASCADE trigger 2 fires. Both on stack.
    Cascade trigger 2 resolves first (LIFO): exile until finding MV < 8. Find Bloodbraid Elf
      (MV 4). Cast Bloodbraid for free.
    Bloodbraid Elf enters stack. Bloodbraid's CASCADE trigger fires.
    Bloodbraid's cascade resolves: exile until finding MV < 4. Find... something cheap.
    That spell resolves. Bloodbraid resolves.
    Now: Cascade trigger 1 (Wanderer's first cascade) resolves: exile until finding MV < 8.
      Find another card. Cast it for free.
    That cascaded spell resolves. Maelstrom Wanderer resolves (enters as 7/5).
    CHAIN: Wanderer → two cascade triggers → Bloodbraid → another cascade → small spell.
    Three free spells total from one Wanderer cast.

GRAFDIGGER'S CAGE AND CASCADE:
  Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
  Cascade exiles cards from the TOP OF THE LIBRARY to find a spell.
  The card is cast FROM EXILE (the card is in exile at the moment of casting).
  Cage prevents casting from "graveyards or libraries" — not from exile.
  RESULT: Grafdigger's Cage does NOT stop cascade.
  The card moves: library → exile (during cascade) → cast from exile (not from library).
  This is commonly misunderstood. Cage definitely stops flashback (GY cast) and retrace (GY cast),
    but NOT cascade (exile cast) or hideaway (exile cast) or suspend (exile cast).

LANDS AND CASCADE:
  "Exile cards from the top of your library until you exile a nonland card whose MV is less than..."
  Lands are skipped. You keep exiling past lands until finding a nonland.
  Lands exiled this way go to the bottom of the library with other non-cast cards.
  You can't choose to "stop" cascade and cast a land — cascade only finds nonland cards.

SPLIT CARDS IN A CASCADE LIBRARY:
  CR 202.3: split cards NOT on the stack have MV = sum of both halves.
  Example: Fire // Ice ({1}{R} // {1}{U}): MV = (1+1) + (1+1) = 4. Not on stack: MV = 4.
  Cascade from Bloodbraid Elf (MV 4): Fire // Ice has MV 4. Cascade requires MV STRICTLY LESS
    THAN the cascade spell's MV. 4 is not less than 4. Fire // Ice is SKIPPED.
  Cascade from Violent Outburst (MV 3): Fire // Ice MV = 4. 4 is not less than 3. Skipped.
  You'd need a cascade spell with MV ≥ 5 to cascade into Fire // Ice (MV 4).
  This is a common deckbuilding mistake: split cards appear to have cheap halves but have
    high combined MV in the library, making them harder cascade targets.

DOUBLE CASCADE (702.85c):
  Multiple instances of cascade trigger separately.
  Each instance fires its own trigger independently.
  Pay one instance's cost (it's a triggered ability, no cost): you get one cascade.
  Both instances of cascade on the same spell = two cascade triggers = two free spells.
  Stifle one trigger: only one cascade happens.

REBOUND AND CASCADE:
  Rebound (702.88a): if cast from hand, exile at resolution; at beginning of next upkeep,
    cast for free from exile.
  If you cascade into a spell with rebound: the cascaded spell resolves, is put into exile
    with rebound.  At your next upkeep: cast it for free again. Rebound fires because
    the spell was originally "cast from hand"? Wait — the cascade cast is "without paying its
    mana cost" not "from hand." Was it cast from hand? The card was in exile (from the cascade
    process), not in hand. So rebound says "if this spell was cast FROM YOUR HAND." The cascade
    cast was from exile. Rebound DOESN'T TRIGGER.
  CONFIRMED: cascading into a rebound card doesn't create the rebound effect. The rebound's
    "cast from hand" condition isn't met.
```

## Definitive Conclusions

- **Cascade is a triggered ability — Stifle counters it** — the original spell resolves normally; only the free spell is lost.
- **Cost reduction doesn't change MV or cascade threshold** — Goblin Electromancer lets you cast the cascade spell cheaper but the MV threshold stays based on printed cost.
- **X spells have MV 0 in the library** — cascade finds them easily but they're cast with X=0 (usually useless); avoid X spells in cascade decks unless they're useful at X=0.
- **Cascading into a cascade spell creates a chain** — Maelstrom Wanderer's double cascade can generate multiple free spells; Bloodbraid Elf cascaded into another cascade creature extends the chain.
- **Grafdigger's Cage does NOT stop cascade** — cascade casts from exile (where the card was placed), not from the library; Cage only restricts GY and library casting.
- **Split cards have combined MV in the library** — Fire // Ice has MV 4 in the library even though each half costs {1}{R} or {1}{U}; a cascade spell needs MV > 4 to find Fire // Ice.
- **Cascading into a rebound spell doesn't grant rebound** — rebound requires "cast from your hand"; cascade casts from exile, so rebound's condition isn't met.

## Canonical Example
**Bloodbraid Elf + Cost Reduction (Modern Jund):**
You control Goblin Electromancer ({1}{R}: 2/2; "instant and sorcery spells you cast cost {1} less"):

Wait — Bloodbraid Elf is a creature, not instant/sorcery. Electromancer doesn't apply to it.
Better: cast Bloodbraid Elf ({2}{R}{G}: 3/2 haste; cascade) normally. MV = 4.
Cascade trigger fires. Exile from top of library. Looking for MV < 4.
You exile: Graven Cairns (land — skip), Tarmogoyf (MV 2 — found!).
You cast Tarmogoyf for free. Tarmogoyf resolves (enters as X/Y where X = card types in GYs).
Bloodbraid Elf resolves: enters as 3/2 with haste. Attacks this turn.

Opponent Stifles the cascade trigger:
Cascade trigger is countered. No free spell. Bloodbraid Elf still resolves as a 3/2 with haste.
The original spell was unaffected — only the cascade trigger was countered.

**Example 2 — Maelstrom Wanderer Cascade Chain:**
You cast Maelstrom Wanderer ({5}{U}{R}{G}: 7/5; cascade; cascade; "creatures you control have haste"):
MV of Wanderer = 8. Two cascade triggers go on stack.

CASCADE TRIGGER 2 resolves (LIFO): exile until finding MV < 8.
Find Bloodbraid Elf (MV 4). Cast Bloodbraid for free (MV 4 < 8 ✓).
Bloodbraid's cascade trigger fires. Bloodbraid's cascade resolves: exile until MV < 4.
Find Terminate ({B}{R}: destroy target creature; MV 2). Cast Terminate for free.
Terminate resolves: destroy opponent's blocker. Bloodbraid Elf resolves: enters as 3/2 haste.

CASCADE TRIGGER 1 resolves: exile until finding MV < 8.
Find Rhystic Study (MV 3). Cast for free.
Rhystic Study resolves (enters, starts generating draw tax).

Maelstrom Wanderer resolves: 7/5, all your creatures have haste.
Total: Terminate + Bloodbraid Elf + Rhystic Study + Maelstrom Wanderer from one cast.

Note: all creatures (Bloodbraid, Wanderer) have haste from Wanderer's static ability.
All attack immediately.

## Commonly Confused With
- **P409 (Copy Effects and Alternative Costs)** — Copying a cascade spell via Fork/Reverberate: the copy is not "cast," so cascade doesn't trigger on the copy. Cascade is a "when you cast this spell" trigger — copying bypasses the casting event.
- **P423 (Conspire)** — Both conspire and cascade create free copies/casts, but by different mechanisms. Conspire creates a copy via trigger; cascade creates a new cast of a different card from the library. Stifle stops both triggers.
- **P415 (Dredge)** — Cascade and dredge both interact with the library but differently. Dredge replaces a draw; cascade exiles from the top. Grafdigger's Cage stops dredge? No — dredge doesn't cast from GY. Cage stops flashback/retrace (GY casting) but NOT dredge (replacement effect) or cascade (exile casting).
- **P417 (Suspend)** — Cascading into a suspend card casts it for free (alternative cost "without paying its mana cost"). But the creature doesn't gain haste from suspend's haste clause — that applies only when cast via the suspend's last-counter trigger, not cascade.
