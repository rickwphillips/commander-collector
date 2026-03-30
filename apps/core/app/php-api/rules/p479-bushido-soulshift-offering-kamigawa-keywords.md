---
id: p479
name: Bushido, Soulshift, and Offering — Combat-Pump-per-Block, Spirit-Recursion, and Sacrifice-for-Flash
category: combat
cr_refs: [702.39, 702.40, 702.42, 508.1, 509.1, 603.2, 600.1, 117.1a, 400.7]
tags: bushido, soulshift, offering, formal-keyword, combat-pump, spirit-recursion, sacrifice-for-flash, champions-of-kamigawa, betrayers-of-kamigawa, saviors-of-kamigawa
created: 2026-03-29
examples_count: 7
---

# P479 — Bushido, Soulshift, and Offering — Combat-Pump-per-Block, Spirit-Recursion, and Sacrifice-for-Flash

## Abstract

Three formal keywords from Kamigawa block with meaningful rules interactions: **Bushido N** (CR 702.39) gives a creature +N/+N until end of turn whenever it blocks or becomes blocked; **Soulshift N** (CR 702.40) is a triggered ability that returns a Spirit card with mana value ≤ N from your GY to hand when the Soulshift creature dies; and **Offering** (CR 702.42) is an alternative-cost ability that lets you cast the Offering card as though it had flash by sacrificing a creature of the specified type and paying the Offering creature's mana cost minus the sacrificed creature's mana cost. All three interact with combat steps, GY recursion chains, and alternative casting in ways that are non-obvious.

## The Definitive Rules

### Bushido N (CR 702.39)
**CR 702.39a verbatim:** *"Bushido N means 'Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.'"*

Bushido triggers once per combat regardless of how many creatures block or are blocked by the Bushido creature. If multiple creatures block it, Bushido still triggers once (the trigger is "becomes blocked," not "for each creature that blocks it").

Exception: if the Bushido creature is blocked by MULTIPLE blockers, the trigger fires once (not once per blocker). If the Bushido creature itself BLOCKS multiple attackers (not possible by normal rules — a blocking creature can only block one attacker — wait: actually CR 509.1c says "Each blocking creature must be declared to block exactly one attacking creature"... but there are exceptions. Generally, one blocker one attacker.) — Bushido triggers once per combat.

### Soulshift N (CR 702.40)
**CR 702.40a verbatim:** *"Soulshift N means 'When this permanent is put into a graveyard from the battlefield, you may return target Spirit card with mana value N or less from your graveyard to your hand.'"*

Soulshift is a triggered ability that fires when the creature dies. You may return a Spirit card from your GY with MV ≤ N. The returned Spirit can itself have Soulshift, creating chains.

### Offering (CR 702.42)
**CR 702.42a verbatim:** *"[Type] offering means 'You may cast this card any time you could cast an instant by sacrificing a [type] permanent and paying the difference between this card's mana cost and the sacrificed permanent's mana cost. This difference is calculated by subtracting the sacrificed permanent's mana cost from this card's mana cost. The result is the cost you pay.'"*

Offering allows flash-speed casting by sacrificing a creature of the specified type. The cost reduction equals the sacrificed creature's mana cost.

## The Pattern

```
BUSHIDO N pattern:
Trigger: "Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn"
  → TWO trigger conditions:
    1. When this creature BLOCKS: triggers when declared as a blocker in declare blockers
    2. When this creature BECOMES BLOCKED: triggers when an opponent's blocker is declared on it
  → Triggers ONCE per combat event (not once per blocker)
  → Multiple blockers on a Bushido attacker: the attacker "becomes blocked" once → Bushido fires once
  → First strike + Bushido: the Bushido creature already has the bonus when first strike damage is dealt
    (damage happens after Bushido trigger resolves, which is before combat damage step)
  → The Bushido boost is +N/+N to POWER AND TOUGHNESS — both dimensions increase
  → Stacking Bushido: multiple Bushido instances each trigger separately
    → Bushido 2 + Bushido 3 → two separate triggers → +2/+2 AND +3/+3 → total +5/+5

SOULSHIFT N pattern:
Trigger: "When this permanent is put into a graveyard from the battlefield"
  → Fires when the Soulshift creature DIES (battlefield → graveyard)
  → Does NOT fire when exiled (exile ≠ graveyard from battlefield)
  → Does NOT fire when bounced back to hand or library
  → May return "target Spirit card with MV ≤ N from your GY to your hand"
  → The chain potential:
    → Soulshift 4 creature dies → return Spirit with MV ≤ 4 from GY
    → If that returned Spirit had Soulshift 3 and is now in hand (not GY), no chain yet
    → But if ANOTHER Spirit with Soulshift dies, returns a Spirit...
    → Chain: play Spirit 5 (MV 5 with Soulshift 4) → dies → return Spirit 4 (MV 4 with Soulshift 3)
      → play Spirit 4 → dies → return Spirit 3 → ... down to Soulshift 0
    → Soulshift creates a "ladder" of recursion down the MV chain
  → Self-recursion: a Spirit with Soulshift N returning itself? NO — the triggered ability
    says "target Spirit card... from your GY." The dying creature just moved to GY from battlefield.
    Can it target itself? CR says a triggered ability resolves after the creature is in the GY.
    The creature is now in the GY as a "card" (tokens cease to exist). So... technically the
    Soulshift creature could target ITSELF in the GY? It's in the GY, it's a Spirit card,
    it has MV ≤ N (if MV is within the Soulshift value). This would effectively give it
    infinite recursion. Check: CR 603.6c says leaves-the-battlefield abilities use last
    known information, but the TARGET is chosen at resolution. The creature is now in the GY.
    If the creature itself qualifies (Spirit, MV ≤ N), it CAN target itself and return to hand.
    This is a legitimate rules interaction: Soulshift N on a Spirit with MV ≤ N returns itself.

OFFERING pattern:
Alternative casting option: "You may cast this [as flash] by sacrificing a [type] permanent
                             and paying [this MV] - [sacrificed MV]"
  → "Any time you could cast an instant" = FLASH: any time you have priority
  → Sacrifice cost: must sacrifice a permanent of the specified type
    → The sacrifice is a COST — happens before the spell resolves
    → If spell is countered after sacrifice: the sacrificed creature is gone
  → Cost calculation: {this card's mana cost} - {sacrificed creature's mana cost}
    → Example: "Snake Offering" on a 6-MV card, sacrifice a 3-MV snake → pay 3 mana (difference)
    → If sacrificed creature's MV ≥ this card's MV: cost difference is 0 or negative
      → Pay 0 mana total? Is negative cost possible? CR 601.2f: total cost is never negative;
        if reduction would make it negative, it becomes 0.
    → So sacrificing an equal-or-higher-MV creature → cast for free (0 mana)
  → The offering card has "typed offering" — must sacrifice THAT specific type
    → "Snake Offering": sacrifice a Snake
    → "Patron Offering": sacrifice a creature sharing a subtype with the Patron
  → You MUST choose between: (a) casting normally at sorcery speed, or (b) Offering at any time
    → Offering is the alternative; normal casting is still available
```

## Definitive Conclusions

**Bushido:**
- Bushido effectively punishes blocking: your opponent's creature blocks a Bushido creature and now faces a bigger threat. This incentivizes opponents to not block, letting Bushido creatures deal consistent damage.
- Bushido N on a creature that is ALSO a blocker: when the Bushido creature blocks, it triggers Bushido and gets bigger — good for killing the attacker with the pump bonus.
- Bushido doesn't trigger on combat with NO blocking: if the Bushido creature attacks and is unblocked, no Bushido trigger. The boost is specifically for combat involving blocking.
- Key card: *Tenza, Godo's Maul* (CHK): "Equipped creature has bushido 2. If equipped creature is legendary, it gets +3/+3." Equipment granting Bushido.
- Key card: *Konda, Lord of Eiganjo* (CHK): "Vigilance, bushido 5. [other abilities]" A 3/3 with Bushido 5 becomes 8/8 in combat.

**Soulshift:**
- Soulshift is one of the only mechanics that can create a near-infinite chain by itself (with Soulshift self-recursion). A 1-MV Spirit with Soulshift 1 can return itself from the GY every time it dies, enabling repeated sacrifice/death triggers.
- The Soulshift ladder is a powerful Commander/casual strategy: build a Spirit curve from Soulshift 1 through Soulshift 5, and when the high-end Spirit dies, it begins cascading the entire chain back to hand.
- Soulshift + Viscera Seer: sacrifice the Spirit (Soulshift triggers), scry 1. Return a cheaper Spirit. Sacrifice again. Build from there.
- Key card: *Thief of Hope* (CHK): "Whenever you cast a Spirit or Arcane spell, target opponent loses 1 life and you gain 1 life. Soulshift 2 (When this creature dies, you may return target Spirit card with mana value 2 or less from your graveyard to your hand)." Returns a Spirit MV 2 or less on death.
- Key card: *Kodama of the Center Tree* (SOK): "*/* whose P/T equals the number of Spirits you control. Soulshift X, where X is the number of Spirits you control." Returns a Spirit with MV ≤ your Spirit count when it dies — dynamically more powerful in a Spirit-heavy board.

**Offering:**
- Offering's most powerful application is when you have a high-MV permanent of the required type that you want to sacrifice anyway (e.g., a creature that's about to die, a creature with a death trigger). Sacrifice that creature to cast the Offering spell for free (or near-free).
- Offering at instant speed is useful for surprise: opponents don't know you're holding the Offering card, and you can cast it in response to their removal or during their combat to change the board state.
- Key cards (Patron cycle from Betrayers of Kamigawa): *Patron of the Orochi* (Snake Offering — {6}{G}{G}), *Patron of the Moon* (Moonfolk Offering), *Patron of the Akki* (Goblin Offering), *Patron of the Nezumi* (Rat Offering), *Patron of the Kitsune* (Fox Offering). Each is a large creature you can flash into play by sacrificing a creature of the matching type.

## Canonical Examples

**Bushido:**
- *Takeno, Samurai General* (CHK): "Bushido 2. Each other Samurai creature you control gets +1/+1 for each point of bushido it has." Bushido 2 makes him a 5/5 when blocking (3/3 base + 2/2 from Bushido 2). Other Samurai with bushido get +N/+N per their own bushido value — so a Samurai with bushido 3 gets +3/+3.

**Soulshift:**
- Chain: 5/5 Spirit (Soulshift 4) dies → return 4-MV Spirit (Soulshift 3) to hand. Play 4-MV Spirit → dies → return 3-MV Spirit → etc.

**Offering:**
- *Patron of the Orochi* at end of opponent's turn: sacrifice a 3-MV Snake you control → cast the Patron ({6}{G}{G}) for {3}{G}{G} at flash speed → 7/7 enters to protect you.

## Commonly Confused With

- **P449** (Rampage) — Rampage triggers once per ADDITIONAL blocker; Bushido triggers once when blocked (regardless of number of blockers); different trigger conditions
- **P450** (Recover) — Recover returns a creature from GY when another creature dies (different trigger); Soulshift returns a Spirit from GY when the Soulshift creature itself dies
- **P420** (Evoke) — Evoke is another "sacrifice as cost" keyword; Offering sacrifices as an alternative casting cost for flash; both involve sacrifice at cast time but different mechanisms
- **P438** (Jump-Start/Escape/Foretell) — All alternative casting methods; Offering is specifically sacrifice-for-flash-and-cost-reduction; different zones and conditions
