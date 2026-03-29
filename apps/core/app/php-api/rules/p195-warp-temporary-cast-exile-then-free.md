---
id: p195
name: Warp — Alternative Cost to Cast Temporarily, Then Exile and Recast Free
category: costs
cr_refs: [702.185a, 702.185b, 702.185c]
tags: [warp, alternative-cost, temporary-cast, exile-end-step, free-cast, delayed-trigger, Final-Fantasy]
created: 2026-03-28
examples_count: 2
---

# P195 — Warp — Alternative Cost to Cast Temporarily, Then Exile and Recast Free

## Abstract
Warp is a two-part alternative cost mechanic. First, you cast a spell for its warp cost (cheaper than normal). Then, the permanent it becomes is exiled at the beginning of the next end step — it only stays for one turn (or less). But the exile isn't permanent: the card owner may cast it again from exile after the current turn ends, for free. This creates a "try before you buy" pattern: pay a discount to use a creature once (this turn), then potentially get it back free in a later turn. Warp rewards players who have powerful ETB effects or immediate-impact creatures.

## The Definitive Rules

**CR 702.185a** (verbatim): *"Warp represents two static abilities that function while the card with warp is on the stack, one of which may create a delayed triggered ability. 'Warp [cost]' means 'You may cast this card from your hand by paying [cost] rather than its mana cost' and 'If this spell's warp cost was paid, exile the permanent this spell becomes at the beginning of the next end step. Its owner may cast this card after the current turn has ended for as long as it remains exiled.' Casting a spell for its warp cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.185b** (verbatim): *"Some effects refer to 'warped' cards in exile. A warped card in exile is one that was exiled by the delayed triggered ability created by a warp ability."*

**CR 702.185c** (verbatim): *"Some effects refer to whether 'a spell was warped this turn.' This means that a spell was cast for its warp cost this turn."*

## The Pattern

```
WARP:
  Two static abilities:
  1. ALTERNATIVE CAST: "May cast from hand by paying warp cost instead of mana cost"
  2. DELAYED TRIGGER: "If warp cost was paid, exile the permanent at beginning of next end step.
     Its owner may cast it from exile after the current turn has ended."

  WARP + CASTING:
    From hand only: must be cast from hand (not graveyard or other zones)
    Pay warp cost (cheaper than mana cost): cast the spell
    Resolves normally → becomes permanent on battlefield

  WARP + EXILE TIMING:
    "At the beginning of the next end step": the permanent is exiled at end of turn
    This means it's present for the entire current turn (combat, main phase, etc.)
    At end step: gone from battlefield → exiled
    Counters, equipment, enchantments: all lost when it's exiled
    ETB on re-entry from warp: DO trigger when cast from exile and it enters

  WARP + FREE RECAST:
    From exile: owner may cast it "after the current turn has ended for as long as it remains exiled"
    "After the current turn" = starting from the next player's turn
    Cast for FREE from exile: no mana cost or warp cost needed
    Cast at any time you could normally cast it (e.g., creature = main phase; instant = any time with priority)
    When cast from exile: enters battlefield normally (triggers ETBs again)
    If re-cast from exile: does it warp again? No — only original warp ability applies when cast from hand

  WARP + TACTICAL USE:
    Turn N: cast for warp cost (discount) → get immediate value (ETB, attack, block)
    End of Turn N: exiled
    Turn N+1+: cast for free from exile → ETB again, more value
    Pattern: double ETB use (once on warp cast, once on free recast)

  WARP + NOT RE-TRIGGERING WARP:
    When cast from exile (the free cast): the card is not being cast with its warp cost
    The warp ability only triggers when cast with warp cost
    Free recast from exile: permanent stays permanently (not exiled again)
    So after the free recast: permanent sticks around normally

  "WARPED" CARDS:
    CR 702.185b: "warped card in exile" = exiled by the warp delayed trigger
    Some effects specifically interact with "warped" cards
    If the card is exiled by some other means (Path to Exile): it's not a warped card

  "WARPED THIS TURN":
    CR 702.185c: "a spell was warped this turn" = cast for warp cost this turn
    Synergistic effects that reward warping in a single turn

  WARP + FINAL FANTASY:
    From Final Fantasy Universes Beyond set
    Represents instant-teleport mechanics, temporary summons
    Characters summoned with Warp: appear for a battle, then teleport away... then you can call them again

  WARP + ETB SYNERGY (THE BIG COMBO):
    Cast for warp cost (discounted): ETB triggers.
    End of turn: exiled.
    Next turn+: cast for free from exile: ETB triggers AGAIN.
    Net: two ETB triggers for the cost of warp cost (discount) + free.
    Example: creature with powerful "enters" draw 3 cards ability:
    - Warp it: draw 3. End of turn: exiled.
    - Free recast: draw 3 again.
    - Total: 6 cards drawn for the price of warp cost.
```

## Definitive Conclusions

- **Warp is a two-phase mechanic**: pay warp cost to cast → exile at end step → free recast from exile later.
- **Discount first cast, free second** — designed for maximum ETB value.
- **Free recast has no warp trigger** — after the free recast, the permanent stays.
- **Counters/enchantments are lost** on the exile step (new object when re-enters).
- **"Warped" cards** — specific interactions target warp-exiled cards in exile.

## Canonical Example
**Titan with Warp {3} (normal cost {6}, has "enter: deal 6 damage to target creature"):**
Turn 4: Cast for warp cost {3} (discount). ETB: deal 6 damage to a threat. Titan is 6/6 this turn.
End of Turn 4: Titan is exiled (warped card in exile).
Turn 5: Cast Titan from exile for FREE. ETB: deal 6 damage again. Titan is now permanent (no re-warp).
Net: 12 damage to creatures + a permanent 6/6 for just {3} over two turns. Extremely efficient.

**Example 2 — Warp + Attack:**
Hasty creature with Warp {2} (normal cost {5}). Has "enters: create a 1/1 token."
Turn 3: Cast for warp cost {2}. ETB: create token. Hasty creature attacks for 3+ damage.
End of Turn 3: Exiled.
Turn 4 (opponent's turn): Could cast from exile (if instant-speed or if effects allow).
Actually: creatures are cast at sorcery speed. Cast on Turn 4 (your turn next turn).
Turn 4: Cast from exile for free. ETB: create another token. Attacks again. Permanent this time.
Two ETBs, two tokens, two attack opportunities, for just {2} + one free cast.

## Commonly Confused With
- **P161 (Dash)** — Dash returns to hand at end step; Warp exiles the permanent and allows free future cast. Dash = loop; Warp = one-time discount + one free recast.
- **P146 (Suspend)** — Suspend exiles from hand until counters are removed; cast free when last counter removed. Warp exiles after entering battlefield. Different timing and zones.
- **P164 (Rebound)** — Rebound exiles a spell and casts again next upkeep. Warp exiles the permanent and allows casting at any valid time after current turn.
