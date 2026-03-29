---
id: p432
name: Cipher, Evolve, Extort, and Fuse — Ravnica Return Block Mechanics
category: triggered
cr_refs: [702.99a, 702.99b, 702.99c, 702.100a, 702.100b, 702.100c, 702.100d, 702.101a, 702.101b, 702.102a, 702.102b, 702.102c, 702.102d, 709.4]
tags: [cipher, evolve, extort, fuse, encoded, combat-damage-copy, enter-bigger-counter, drain-on-cast, split-card-combined, cipher-and-clone, evolve-trigger-condition, evolve-power-toughness-check, extort-optional, fuse-combined-MV, cipher-encoded-creature-dies, Hands-of-Binding, Totally-Lost, Shambleshark, Zameck-Guildmage, Blind-Obedience, Boros-Charm, Ravnica, Gatecrash, Dragon-Maze]
created: 2026-03-29
examples_count: 2
---

# P432 — Cipher, Evolve, Extort, and Fuse — Ravnica Return Block Mechanics

## Abstract
Four Ravnica: City of Guilds Return mechanics cover diverse rules territory. **Cipher** (702.99) encodes an instant/sorcery onto a creature; that creature copies the cipher spell whenever it deals combat damage to a player. **Evolve** (702.100) puts +1/+1 counters on a creature whenever another creature enters that is bigger in power and/or toughness. **Extort** (702.101) lets you pay {W/B} when casting any spell to drain each opponent 1 life. **Fuse** (702.102) lets you cast both halves of a split card for their combined cost, creating a fused spell with combined characteristics. Key non-obvious interactions: (1) **cipher encodes on the creature as a card in exile** — if the creature dies or leaves the battlefield, the cipher card remains encoded but the copy trigger can never fire (the creature isn't there to deal damage); (2) **evolve checks BOTH power AND toughness independently** — if either is greater, the counter is placed; (3) **extort triggers on each spell you cast** — cantrips and minimal spells still trigger extort; multiple extort instances trigger separately; (4) **fused split cards have combined MV** — relevant for cascade and "mana value matters" effects; and (5) **evolve and -1/-1 counters** — a creature can "evolve" to be the same size as the evolve creature if the counters cancel.

## The Definitive Rules

**CR 702.99a** (verbatim): *"Cipher appears on some instants and sorceries. It represents two abilities. The first is a spell ability that functions while the spell with cipher is on the stack. The second is a static ability that functions while the card with cipher is in the exile zone. 'Cipher' means 'If this spell is represented by a card, you may exile this card encoded on a creature you control' and 'For as long as this card is encoded on that creature, that creature has "Whenever this creature deals combat damage to a player, you may copy the encoded card and you may cast the copy without paying its mana cost."'"*

**CR 702.100a** (verbatim): *"Evolve is a triggered ability. 'Evolve' means 'Whenever a creature you control enters, if that creature's power is greater than this creature's power and/or that creature's toughness is greater than this creature's toughness, put a +1/+1 counter on this creature.'"*

**CR 702.101a** (verbatim): *"Extort is a triggered ability. 'Extort' means 'Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain life equal to the total life lost this way.'"*

**CR 702.102a** (verbatim): *"Fuse is a static ability found on some split cards (see rule 709, 'Split Cards') that applies while the card with fuse is in a player's hand. If a player casts a split card with fuse from their hand, the player may choose to cast both halves of that split card rather than choose one half. This choice is made before putting the split card with fuse onto the stack. The resulting spell is a fused split spell."*

**CR 702.102b** (verbatim): *"A fused split spell has the combined characteristics of its two halves."*

**CR 702.102c** (verbatim): *"The total cost of a fused split spell includes the mana cost of each half."*

## The Pattern

```
CIPHER (702.99a):
  SPELL ABILITY (while on stack): "you may exile this card encoded on a creature you control."
  STATIC ABILITY (while in exile): the encoded creature has "whenever this creature deals combat
    damage to a player, you may copy the encoded card and cast the copy without paying its mana cost."

  ENCODING:
    When the cipher spell resolves: you may exile the cipher card ENCODED on a creature you control.
    The card moves from the stack to exile in this "encoded" state.
    The creature gains the "copy trigger" static ability from the encoded card.
    The cipher card is now in exile, encoded on the creature.

  WHAT HAPPENS WHEN THE CREATURE DIES:
    CR 702.99c: "The card remains encoded on that object even if it changes controller or stops
      being a creature, as long as it remains on the battlefield."
    When the creature LEAVES the battlefield (dies, exiled, bounced): the card remains in exile,
      but the creature it was encoded on no longer exists.
    "For as long as this card is encoded on that creature" — the creature is gone. The card is
      still encoded on the LAST KNOWN INFORMATION of the creature, but practically: there's no
      creature to deal combat damage. The copy trigger can never fire again.
    The cipher card is stranded in exile, useless. It cannot be retrieved.
    SUMMARY: if the encoded creature dies, the cipher card is permanently locked in exile.
    STRATEGY: encode on your most resilient creature (hexproof, indestructible).

  CIPHER COPY IS OPTIONAL:
    "You MAY copy the encoded card and you MAY cast the copy."
    Both optional. You can take the damage without copying; or copy without casting.
    Free effect: no cost to copy and cast (the copy is cast "without paying its mana cost").

  CIPHER AND CLONE:
    If you Clone a creature that has a cipher card encoded on it:
    Clone becomes a copy of the creature. But the cipher card was encoded on the ORIGINAL creature.
    The Clone is a different object. The encoded card's "for as long as this card is encoded on
      that creature" refers to the original creature object.
    Clone doesn't inherit the encoded cipher card — it's not the same object.
    The cipher card stays encoded on the original creature (not the Clone).
    If Clone REPLACES the original (if the original is killed and Clone is the survivor):
      the cipher card is now encoded on a dead object. No more copy triggers.

  CIPHER IN MULTIPLAYER:
    The copy trigger fires "whenever this creature deals combat damage to A PLAYER."
    In multiplayer: the creature can attack different opponents on different turns.
    Each time it deals combat damage to any player: copy trigger fires. Multiple uses per turn
      if the creature deals damage to multiple players (rare, but possible in some multiplayer
      formats with multiple attacks).

EVOLVE (702.100a):
  "Whenever a creature you control enters, if that creature's power is greater than this
   creature's power and/or that creature's toughness is greater than this creature's toughness,
   put a +1/+1 counter on this creature."

  TWO CONDITIONS CHECKED INDEPENDENTLY (AND/OR):
    Power check: is entering creature's power > evolve creature's current power?
    Toughness check: is entering creature's toughness > evolve creature's current toughness?
    EITHER condition being true triggers evolve. OR logic (not AND).
    Example: Evolve creature is 2/2. New creature enters as 3/1.
      Power check: 3 > 2 — YES. Toughness check: 1 > 2 — NO.
      Either is enough. Evolve triggers. 2/2 becomes 3/3.
    Example: Evolve creature is 2/2. New creature enters as 2/2.
      Power: 2 > 2 — NO. Toughness: 2 > 2 — NO. Neither condition met. Evolve DOESN'T trigger.
    Example: Evolve creature is 2/2. New creature enters as 1/3.
      Power: 1 > 2 — NO. Toughness: 3 > 2 — YES. Evolve triggers.

  INTERVENING-IF CLAUSE:
    702.100a uses "if" — this IS an intervening-if clause (CR 603.4).
    Checked at trigger time AND at resolution.
    If the evolve creature grew between trigger time and resolution (from another source),
      and the entering creature is no longer bigger:
      The trigger still goes on the stack (condition was true when it triggered). At resolution,
      check again: "is entering creature's power > evolve creature's power and/or toughness?"
      If the condition is no longer true (evolve creature grew): trigger does nothing.
    Also: if evolve fires for a creature entering, and that entering creature is REMOVED before
      the evolve trigger resolves: the trigger resolves and checks the entering creature's
      LAST KNOWN INFORMATION. If the creature is in the GY: last known P/T is used.

  EVOLVE AND -1/-1 COUNTERS:
    With wither/infect reducing an evolve creature's P/T:
    Evolve creature is 3/3. Gets a -1/-1 counter: now 2/2.
    New 2/2 creature enters: 2 > 2 = false. No trigger. BUT: from base 3/3 perspective, you
      might have expected it to trigger if comparing to printed values. Evolve compares to
      CURRENT P/T (including counters). 2/2 vs 2/2: no trigger.
    New 3/1 creature enters: power 3 > 2 = YES. Evolve triggers. 2/2 becomes 3/3.

  EVOLVE COUNTER AND SUBSEQUENT TRIGGERS:
    When the evolve counter is placed, the evolve creature gets bigger.
    Might trigger OTHER evolve creatures (if they check the evolve creature entering?).
    No — evolve triggers on CREATURES ENTERING, not on counters being placed.
    Getting a counter doesn't re-trigger evolve. Evolve doesn't chain on itself.

  EVOLVE AND TOKENS:
    Tokens entering count as creatures entering. Evolve triggers for tokens.
    Create a token bigger than an evolve creature: evolve fires.

EXTORT (702.101a):
  "Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life
   and you gain life equal to the total life lost this way."

  TRIGGERS ON EVERY SPELL YOU CAST:
    Doesn't matter what the spell is: creature, instant, sorcery, artifact, enchantment.
    Even very cheap spells (cantrips, 0-mana spells) trigger extort.
    You CHOOSE whether to pay {W/B} when the trigger resolves.

  MULTIPLE EXTORT:
    702.101b: each instance triggers separately.
    2 permanents with extort: 2 extort triggers per spell cast.
    Pay {W/B} twice: each opponent loses 2 life, you gain 2 life per opponent.
    Multiple extort with multiple opponents: scales significantly in multiplayer.

  EXTORT IN MULTIPLAYER SCALING:
    "Each opponent loses 1 life." In 4-player: 3 opponents. Pay once: 3 opponents each lose 1.
    You gain 3 life. Pay {W/B} on each extort trigger for each spell: each spell gains you 3
    life per extort trigger. With many extort permanents: 6 triggers × {W/B} = 6 × 3 = 18 life.
    Extort is dramatically more powerful in multiplayer.

  EXTORT TRIGGER TIMING:
    Triggers when you CAST a spell. Goes on stack above the cast spell.
    Extort resolves before the cast spell resolves.
    You pay {W/B}, opponents lose 1 life, you gain life. THEN the spell resolves.

FUSE (702.102a):
  ONLY FROM HAND:
    702.102a: fuse "applies while the card with fuse is in a player's hand."
    You can only cast both halves as a fused spell if casting from hand.
    From GY (with jump-start/retrace): cast only one half (can't fuse from GY).
    From cascade (from exile): cast only one half (can't fuse from exile).
    Wait — technically: fuse is a static ability that functions while in hand. When you cast
      from a non-hand zone (cascade, flashback), fuse doesn't apply. One half only.

  FUSED SPELL CHARACTERISTICS (702.102b):
    "A fused split spell has the combined characteristics of its two halves."
    MV of fused spell: sum of both halves' MV.
    Colors: both halves' colors combined.
    Types: combined.
    Importantly: BOTH halves of the text execute (702.102d: "left half instructions, then
      right half instructions").

  FUSED SPELL AND CASCADE:
    Cascade finds cards with MV less than the cascade spell's MV.
    Split cards in the library have MV = sum of both halves (CR 202.3, P424).
    If you cascade and find a fused split card: you cast ONE HALF (fuse doesn't work from exile).
    The MV of the split card in the library is the sum; this determines whether cascade can hit it.
    When cast from cascade: you cast one half, not both.

  COPY EFFECTS AND FUSED SPELLS:
    Copying a fused split spell: the copy is also a fused split spell with combined characteristics.
    Fork on a fused Rise // Fall ({1}{R} // {1}{U} fused as {2}{R}{U}): copy has both effects.
    The copy executes both halves' instructions.
```

## Definitive Conclusions

- **Cipher encodes the card in exile — if the encoded creature dies, the cipher card is permanently locked in exile** — no retrieval; the copy trigger requires the specific encoded creature to deal combat damage; encode on indestructible/hexproof creatures.
- **Evolve checks power and/or toughness independently** — if either is strictly greater, the counter is placed; an entering 3/1 triggers a 2/2 evolve creature (power 3 > 2); an entering 2/2 does not (neither > 2).
- **Extort triggers on EVERY spell you cast**, regardless of type or cost — multiple extort instances each trigger separately; in multiplayer, each trigger drains all opponents simultaneously.
- **Fuse only works from hand** — cascade, flashback, retrace, and other zone casts can't fuse; you cast one half of the split card from non-hand zones.
- **Fused spells have combined MV** — relevant for cascade (cascade has MV threshold) and other "mana value matters" effects.

## Canonical Example
**Hands of Binding + Cipher on a hexproof creature:**
Cast Hands of Binding ({1}{U}: Sorcery; cipher; "tap target creature. It doesn't untap during its controller's next untap step"):
As it resolves: you may exile it encoded on a creature you control.
You choose Invisible Stalker ({1}{U}: 1/1 hexproof unblockable): encoded on Stalker.
Stalker now has "whenever it deals combat damage to a player, copy Hands of Binding, cast for free."

Each turn: Stalker attacks. Unblockable (can't be blocked). Deals 1 damage. Cipher fires.
Free copy of Hands of Binding: tap target creature. It doesn't untap.
Next turn: repeat. Each attack = free tap of a creature. Locks down opponent's best blocker.

Opponent tries to remove Stalker: can't target Stalker (hexproof). Must use a nontargeting effect
  (Wrath of God, sweepers). If Stalker dies: cipher card stays in exile but can never fire again.

**Example 2 — Fuse + Cascade:**
Boros Charm ({R}{W}: Instant with fuse; each half has a different effect) doesn't have fuse.
Use Turn // Burn ({1}{U}: "target creature loses all abilities and becomes 0/1 until EOT" // {1}{R}:
  "deal 2 damage to target creature or player"; fuse {1}{U}{R}).

From hand: cast both halves fused for {1}{U}{R}. Total cost {3} (1+1+1). Combined MV = 4 ({1}{U} +
  {1}{R} = 4... wait: MV of Turn = 2 ({1}{U}), MV of Burn = 2 ({1}{R}), combined = 4).
Fused spell resolves: execute Turn (make target a 0/1 with no abilities) THEN Burn (deal 2 damage).
Net: opponent's 7/7 Dragon becomes a 0/1 with no abilities (evasion removed), then takes 2 damage.
0/1 with 2 damage marked ≥ 1 toughness: dies.

From cascade (cascade spell MV ≥ 5): find Turn // Burn (combined MV = 4 < 5). Cast ONE HALF.
You choose Turn OR Burn, not both. Fuse doesn't apply from cascade (not from hand).
Less efficient but still a free 2-damage spell from Burn.

## Commonly Confused With
- **P409 (Copy Effects)** — Cipher creates copies via a triggered ability on the encoded creature (similar to conspire's triggered copy). The copy is cast "without paying its mana cost" — additional costs (P427) can be paid. The copy is cast from the encoded card in exile, not from hand — rebound doesn't apply.
- **P424 (Cascade)** — Fused split cards have combined MV in the library; cascade may or may not find them depending on whether their combined MV is less than the cascade spell's MV. You cast only one half from cascade (no fuse from non-hand zones).
- **P423 (Conspire)** — Extort and conspire both trigger on casting spells. Conspire is an additional cost that creates a copy; extort is a life-drain trigger. Both fire "when you cast a spell." Multiple instances of each trigger separately.
- **P418 (Sunburst/Counter ETB)** — Evolve and sunburst both put counters on creatures, but differently. Evolve checks entering creatures' P/T compared to the evolve creature; sunburst counts colors spent on casting. Both are counter-accumulation mechanics that scale with what you play.
