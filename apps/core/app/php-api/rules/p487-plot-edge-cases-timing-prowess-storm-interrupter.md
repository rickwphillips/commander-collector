---
id: p487
name: Plot Edge Cases — Special-Action Timing, Prowess/Storm, Aven Interrupter, and Becomes-Plotted Triggers
category: stack
cr_refs: [702.188a, 702.188b, 702.188d, 116.2c, 702.59a, 702.59b]
tags: [plot, special-action, timing, prowess, storm, aven-interrupter, becomes-plotted, triggers, flash, kicker, mandatory-additional-cost, free-cast, OTJ]
created: 2026-03-29
examples_count: 5
---

# P485 — Plot Edge Cases — Special-Action Timing, Prowess/Storm, Aven Interrupter, and Becomes-Plotted Triggers

## Abstract

Plot's rules generate several non-obvious edge cases not addressed in P128 or P477:
(1) Plotting is a special action — it cannot be responded to, and an opponent cannot interact with the card in your hand once you announce the action. (2) Casting a plotted card IS casting a spell — it triggers prowess, storm count, and all "whenever you cast" abilities — but plotting itself does NOT trigger any of these. (3) When Aven Interrupter or another effect plots an opponent's spell, that spell is exiled but its original choices and modes do not carry over when the owner eventually casts it from exile. (4) Some cards have "when this card becomes plotted" triggered abilities (Longhorn Sharpshooter, Aloe Alchemist) — these fire upon any method of becoming plotted, including via Jace Reawakened or Kellan Joins Up. (5) Flash and instant cards that become plotted can still only be cast at sorcery speed.

## The Definitive Rules

**CR 702.188a** (verbatim): *"Plot [cost] means 'You may pay [cost] and exile this card from your hand face up. It becomes plotted. Play this ability only as a sorcery.'"*

**CR 702.188b**: A plotted card may be cast from exile without paying its mana cost during its owner's main phase while the stack is empty.

**CR 702.188d** (Aven Interrupter ruling 2024-04-12): *"If the plotted card's owner casts it, the spell has no relation to the spell that player originally cast. Any choices made for the original spell or effects affecting the original spell aren't carried over to the new one."*

**CR 116.2c**: Special actions don't use the stack and can't be responded to.

**Scryfall ruling 2024-04-12 (multiple Plot cards)**: *"Exiling a card using its plot ability is a special action. Once you announce you're taking that action, no other player can respond by trying to remove that card from your hand."*

**Scryfall ruling 2024-06-07 (Jace Reawakened, Lilah, Aven Interrupter)**: *"If an instant or a card with flash is plotted this way, you can still cast it only when you have priority during your main phase while the stack is empty."*

## The Pattern

```
PLOT — SPECIAL ACTION (no stack, no response):
  Announce: "I am paying {X} and exiling [card] from my hand"
  → This is a special action (CR 116.2c) — no stack
  → Opponent CANNOT respond: "I'll Thoughtseize your hand" during the action
  → Once announced, the action cannot be interrupted
  → Opponent cannot target the card once the special action is in progress

PLOTTING IS NOT CASTING:
  When you pay the plot cost and exile the card:
  → This is NOT a cast event
  → Prowess does NOT trigger
  → Storm count does NOT increase
  → "Whenever you cast a spell" triggers do NOT fire
  → "Whenever a card is exiled" effects DO trigger (if any)

CASTING A PLOTTED CARD IS CASTING:
  When you cast the plotted card from exile on a future turn:
  → This IS a cast event (CR 702.188b says "cast it from exile")
  → Prowess DOES trigger
  → Storm count INCREASES
  → "Whenever you cast a spell" triggers DO fire
  → "Cast without paying its mana cost" rules apply (X=0, no alternative costs)

BECOMES-PLOTTED TRIGGERS (e.g., Longhorn Sharpshooter, Aloe Alchemist):
  "When this card becomes plotted, [effect]"
  → Fires whenever the card enters the "plotted" designation in exile
  → Methods that trigger this:
    - Pay the card's own plot cost from hand (standard)
    - Jace Reawakened +1: exile from hand → becomes plotted → TRIGGERS
    - Kellan Joins Up ETB: exile from hand → becomes plotted → TRIGGERS
    - Aven Interrupter ETB: exile opponent's spell → it becomes plotted → TRIGGERS
      (the plotted card's owner controls this trigger, but Longhorn is YOUR card)
  → The trigger goes on the stack above the effect that caused the plot
  → Longhorn Sharpshooter: when plotted, deals 2 damage to any target
    → This fires even when plotted by Jace or Kellan — you get the damage immediately

FLASH/INSTANT CARDS AND PLOT — SORCERY SPEED LOCK:
  Scenario: You have Aven Interrupter exile an instant spell (opponent's Lightning Bolt)
  → The instant becomes plotted
  → When the opponent casts it from the plotted state:
    → They can cast it ONLY as a sorcery (their main phase, stack empty)
    → The instant keyword is overridden by the plotted-cast sorcery restriction
    → Scryfall ruling 2024-06-07 confirms: "If an instant or a card with flash is plotted
       this way, you can still cast it only when you have priority during your main phase
       while the stack is empty."
  → This is a SIGNIFICANT interaction: Aven Interrupter not only delays a spell but
    CONVERTS it from instant speed to sorcery speed permanently for that cast

AVEN INTERRUPTER — PLOTTED SPELL IS A FRESH SPELL:
  Aven Interrupter exiles opponent's counterspell targeting your spell:
  → The counterspell is now plotted
  → Your spell resolves normally (the counterspell never resolved)
  → Later, the opponent may cast the "plotted counterspell" from exile
  → HOWEVER: it cannot target your ORIGINAL spell — that spell is gone
  → The opponent must find a new target for the new cast
  → "Any choices made for the original spell...aren't carried over" (ruling 2024-04-12)

COUNTERSPELL-PROOF CARDS AND AVEN INTERRUPTER:
  "This spell can't be countered" vs Aven Interrupter:
  → Aven Interrupter's trigger exiles the spell; it does NOT counter it
  → "Can't be countered" is irrelevant — the spell is EXILED, not countered
  → Scryfall ruling 2024-04-12: "Spells that can't be countered can still be exiled by
     Aven Interrupter's triggered ability."
  → The spell does not resolve; it is exiled and becomes plotted

MANDATORY ADDITIONAL COSTS ON PLOTTED CARDS:
  If the plotted card has a MANDATORY additional cost (e.g., sacrifice a creature):
  → When casting from exile, the mandatory cost MUST be paid
  → The free cast waives the mana cost only — additional costs remain
  → Official ruling 2024-04-12: "If the plotted card has any mandatory additional costs,
     those must still be paid to cast the spell."

OPTIONAL ADDITIONAL COSTS ON PLOTTED CARDS:
  Kicker, entwine, and other optional additional costs:
  → CAN be paid when casting a plotted card from exile
  → You choose whether to pay optional costs when casting
  → Paying kicker makes the spell kicked; effects based on being kicked apply

FREESTRIDER COMMANDO — PLOT + "NO MANA SPENT" CHECK:
  Freestrider Commando: "This creature enters with two +1/+1 counters on it if it wasn't
  cast or no mana was spent to cast it."
  → Cast from exile via Plot: the free cast spends no mana cost
  → HOWEVER: if you paid mana for additional costs or cost increases
    (e.g., Aven Interrupter's "+{2} to cast spells from exile" ability),
    mana WAS spent → no bonus counters
  → Official ruling 2024-04-12: "If Freestrider Commando is cast without paying its mana
     cost but you paid mana for additional costs or cost increases... Freestrider Commando
     won't enter with +1/+1 counters."
  → Clean plot cast with no other costs: enters with two +1/+1 counters
```

## Definitive Conclusions

- **Plotting cannot be responded to** once announced — it is a special action under CR 116.2c.
- **Plotting ≠ casting**: no prowess, no storm count, no cast triggers. But the eventual free cast IS casting — prowess and storm DO trigger then.
- **Flash/instant plotted cards are locked to sorcery speed** when cast from the plotted state. Aven Interrupter effectively downgrades all opponent instants to sorcery speed.
- **Aven Interrupter can exile uncounterable spells** — "can't be countered" is irrelevant since the effect is exile, not a counter.
- **Plotted spells cast fresh** — any choices on the original spell are gone. A countered counterspell needs new targets.
- **"Becomes plotted" triggers fire regardless of the method** that caused the plot. Jace Reawakened plotting Longhorn Sharpshooter grants immediate damage on the stack.
- **Mandatory additional costs must still be paid** when casting plotted cards for "free."
- **Optional additional costs (kicker) can be paid** on top of the free cast.
- **"No mana spent" checks fail** if any additional cost caused mana payment, even on a plotted free cast.

## Canonical Examples

**Aven Interrupter + Storm spell:**
Opponent casts Grapeshot (storm). You flash in Aven Interrupter (flash allows instant play). Grapeshot is exiled and becomes plotted before it resolves. Storm doesn't fire (the spell was exiled before resolution). The storm spell's copies were never made. Later, opponent casts it from exile for free — but now the storm count may be different, and the spell fires as a sorcery.

**Jace Reawakened + Longhorn Sharpshooter:**
Use Jace's +1 to exile Longhorn Sharpshooter (MV 3 or less check fails for a 4-drop; this works only for MV 3 or less). Assuming it qualifies: exile it from hand → it becomes plotted → "when this card becomes plotted, deal 2 damage to any target" triggers immediately. Get the damage now, cast the creature free later.

**Freestrider Commando plotted through Aven Interrupter zone:**
You plot your Freestrider Commando normally (pay plot cost from hand, no mana spent on cast). Next turn, cast it free — no mana spent casting → enters with two +1/+1 counters. Compare: if opponent controls Aven Interrupter (costs {2} more to cast from exile), you must pay {2} → mana IS spent → no bonus counters.

**Slickshot Show-Off and plot timing:**
Slickshot Show-Off: "Whenever you cast a noncreature spell, this creature gets +2/+0 until end of turn." You plot a sorcery (paying the plot cost). This is NOT casting — Show-Off does NOT trigger. Next turn: cast the plotted sorcery from exile. This IS casting a noncreature spell → Show-Off triggers +2/+0.

**Uncounterable Spell vs. Aven Interrupter:**
Opponent casts Abrupt Decay ("This spell can't be countered"). You flash in Aven Interrupter. The ETB triggers, targeting Abrupt Decay. Abrupt Decay is exiled and becomes plotted. The "can't be countered" clause is completely irrelevant — Aven Interrupter exiles the spell; it does not counter it. Abrupt Decay never resolves.

## Commonly Confused With

- **P128 (Plot — Special Action Exile for Free Future Cast)** — P128 covers the basic timing rules. P485 focuses on the edge cases: becomes-plotted triggers, prowess/storm interaction, Aven Interrupter, and flash-card sorcery conversion.
- **P477 (Plot, Spree, and Offspring)** — P477 is the broad OTJ/Bloomburrow survey. P485 drills into specific edge cases confirmed by official rulings.
- **P007 (Priority Windows)** — Special actions don't use the stack (no priority window). Plot is exempt from the normal priority-based response window.
- **P036 (Storm Count Timing)** — Storm triggers on casting, not on plotting. The delay between plot and cast means the storm spell fires in a different game state.
