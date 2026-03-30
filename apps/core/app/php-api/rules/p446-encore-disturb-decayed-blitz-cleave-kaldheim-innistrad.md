---
id: p446
name: Encore, Disturb, Decayed, Blitz, and Cleave — Kaldheim/Innistrad GY and Alternative-Cost Mechanics
category: costs
cr_refs: [702.141a, 702.146a, 702.146b, 702.147a, 702.152a, 702.152b, 702.148a, 702.148b, 704.5j, 614.15]
tags: [encore, disturb, decayed, blitz, cleave, alternative-cost, GY-mechanic, legendary-encore, disturb-exile, blitz-blink, blitz-draw, decayed-sacrifice, cleave-text-change, token-copy-ETB, Amphin-Mutineer, Dorothea-Vengeful-Victim, Jadar-Ghoulcaller, Tenacious-Underdog, Dig-Up, Kaldheim, Innistrad-Midnight-Hunt, Streets-of-New-Capenna]
created: 2026-03-29
examples_count: 2
---

# P446 — Encore, Disturb, Decayed, Blitz, and Cleave — Kaldheim/Innistrad GY and Alternative-Cost Mechanics

## Abstract
Five mechanics from the Kaldheim/Innistrad/New Capenna era. **Encore** (702.141) is a GY activated ability that exiles the card and creates a token copy for each opponent that attacks that opponent this turn, then sacrifices at the next end step — token copies include ETB abilities. **Disturb** (702.146) casts a DFC card from the GY transformed (back face up), typically as an Aura whose back face permanently exiles itself instead of going to the GY. **Decayed** (702.147) gives a creature two properties: can't block + sacrificed at end of combat when it attacks. **Blitz** (702.152) is an alternative cost (like Dash) that adds haste and a GY-draw trigger, then sacrifices at the next end step. **Cleave** (702.148) is an alternative cost that removes bracketed text from the spell, typically upgrading what's being searched/targeted. Key non-obvious interactions: (1) **encore with legendary creatures creates multiple legendary tokens** — the legend rule (SBA 704.5j) immediately reduces your tokens to one; same issue as legendary myriad (P434); (2) **disturb Aura faces permanently exile themselves** instead of going to the GY (self-replacement effect per 614.15); (3) **blitz + blink permanently keeps the creature** (same principle as dash + blink, P433) — new object, sacrifice trigger fizzles; (4) **decayed creature dying in combat means the end-of-combat sacrifice does nothing** — the trigger fires but the creature is already gone.

## The Definitive Rules

**CR 702.141a** (verbatim): *"Encore is an activated ability that functions while the card with encore is in a graveyard. 'Encore [cost]' means '[Cost], Exile this card from your graveyard: For each opponent, create a token that's a copy of this card that attacks that opponent this turn if able. The tokens gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.'"*

**CR 702.146a** (verbatim): *"Disturb is an ability found on the front face of some double-faced cards. 'Disturb [cost]' means 'You may cast this card transformed from your graveyard by paying [cost] rather than its mana cost.'"*

**CR 702.147a** (verbatim): *"Decayed represents a static ability and a triggered ability. 'Decayed' means 'This creature can't block' and 'When this creature attacks, sacrifice it at end of combat.'"*

**CR 702.152a** (verbatim): *"Blitz represents three abilities: two static abilities that function while the card with blitz is on the stack... 'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

**CR 702.148a** (verbatim): *"Cleave is a keyword that represents two static abilities... 'Cleave [cost]' means 'You may cast this spell by paying [cost] rather than paying its mana cost' and 'If this spell's cleave cost was paid, change its text by removing all text found within square brackets in the spell's rules text.'"*

## The Pattern

```
ENCORE (702.141a):
  ACTIVATION: "[Cost], Exile this card from GY: For each opponent, create a token copy
    that attacks that opponent this turn if able. Tokens gain haste. Sacrifice at beginning
    of next end step. Activate only as a sorcery."

  TOKEN COPIES:
    Each token is a copy of the original card: same P/T, abilities, types.
    Each token's ETB triggers: fire separately when each token enters.
    Amphin Mutineer ({3}{U}: 3/3; "when it enters, exile up to one target non-Salamander creature"):
      3 opponents → 3 tokens; each ETB fires → up to 3 non-Salamander creatures exiled.
    The token is forced to attack the specific opponent it was designated for.
    "Attacks that opponent this turn if able": normal attack rules apply (must be untapped,
      must be able to attack that opponent's direction).

  LEGENDARY ENCORE (= LEGENDARY MYRIAD problem, P434):
    If the original card is legendary: tokens are also legendary (same name).
    3 opponents, 3 legendary tokens with identical names created simultaneously.
    SBA 704.5j: you control multiple legendary permanents with the same name. You must
      choose one to keep; others go to GY.
    Tokens go to GY → they don't exist on the battlefield long enough to attack?
    Actually: SBAs are checked after each game action. The encore ability resolves (tokens
      created). Then before priority is passed: SBAs are checked. 3 legendary tokens with
      same name → SBA fires → choose 1 to keep; 2 go to GY.
    Result: 1 legendary token remains, attacks one opponent.
    The 2 that went to GY had no ETBs fire YET — wait: ETBs fire when permanents enter.
      All 3 tokens entered. All 3 ETBs fired (put on stack). Then SBA reduces to 1 token.
      ETBs from the 2 removed tokens still resolve (they already triggered).
    So: 3 ETBs fire, but only 1 token attacks.

  COMPARE TO MYRIAD (P434):
    Myriad: tokens exiled at end of combat. Encore: tokens sacrificed at beginning of next end step.
    Myriad: creates one token per each other opponent (not counting the actively-attacked one).
    Encore: creates one token PER opponent.
    Both have the legendary token problem. Myriad is at end of combat; encore is at next end step.

DISTURB (702.146a):
  CAST FROM GY TRANSFORMED:
    Disturb: "You may cast this card transformed from your graveyard by paying [disturb cost]."
    The back face is typically an Aura enchantment (for Innistrad DFC creatures).
    Dorothea, Vengeful Victim (front: flying creature; "when Dorothea attacks or blocks,
      sacrifice it at end of combat"; disturb {1}{W}{U}):
      Back face: Dorothea's Retribution (Aura: enchant creature; enchanted creature gets "whenever
        this creature attacks, create a tapped attacking 4/4 Spirit token. Sacrifice at end of combat").
    Cast from GY for {1}{W}{U}: enters as the Aura (back face), NOT as the front-face creature.
    The Aura enchants a target creature.

  DISTURB AURA PERMANENTLY EXILES:
    "If Dorothea's Retribution would be put into a graveyard from anywhere, exile it instead."
    This is a SELF-REPLACEMENT EFFECT (614.15): applies before other replacement effects.
    When the enchanted creature dies → Aura falls off → would go to GY → instead EXILED.
    When the Aura is Disenchanted → would go to GY → instead EXILED.
    The disturb card is permanently removed from the game once the back face leaves the battlefield.
    This prevents infinite disturb recursion (otherwise: die → go to GY → disturb again indefinitely).
    Compare: flashback also exiles (but when it resolves from the stack); disturb exiles
      when the BACK-FACE PERMANENT would go to GY from the battlefield.

  FRONT FACE GY STATUS:
    If the front face is in the GY (the creature died): it can be disturbed (cast from GY).
    Once the back face (Aura) is cast: the card is on the battlefield as the Aura.
    In GY: the card is represented by its front face (per DFC rules 712.4).
    On battlefield as Aura: represented by back face.

DECAYED (702.147a):
  TWO RULES:
    1. Static ability: "This creature can't block."
    2. Triggered ability: "When this creature attacks, sacrifice it at end of combat."

  SACRIFICE AT END OF COMBAT:
    The sacrifice trigger fires when the creature ATTACKS (not when it deals damage).
    Created as a delayed triggered ability (fires at beginning of end of combat step).
    If the creature attacks and DIES IN COMBAT (lethal damage, etc.): the trigger fires at
      end of combat but the creature is no longer on the battlefield.
    The trigger tries to sacrifice the creature → it's not there → trigger does nothing.
    Decayed creatures that die in combat are not additionally sacrificed (they're already gone).
    This means: blocking with decayed is impossible; trading in combat is better than
      waiting to be forced to sacrifice at end of combat.

  SACRIFICE FOR COST BEFORE END OF COMBAT:
    Can you sacrifice a decayed creature to pay a cost BEFORE the end of combat trigger resolves?
    Yes: sacrifice is triggered at end of combat. Before that point, you can use the creature.
    Sacrifice it to Viscera Seer during combat: creature goes to GY. End of combat: trigger fires,
      creature isn't there → nothing happens.
    This "converts" the forced sacrifice into a chosen sacrifice for value.

  CAN'T BLOCK:
    Static ability. The creature never has the option to block.
    Even if an effect says "creatures must block if able": a decayed creature can't block.
    "Can't" overrides "must" per P008.

BLITZ (702.152a):
  "Alternative cost: haste + 'when put into GY from battlefield, draw a card' + sacrifice at next end step."

  SAME AS DASH (P433) + DRAW TRIGGER:
    Dash: returns to hand at end step.
    Blitz: SACRIFICED at end step. You don't get the creature back.
    But: blitz adds "when this permanent is put into a graveyard from the battlefield, draw a card."
      This trigger fires whenever it goes to GY: sacrifice at end step, or destroyed, or dies.
      NOT when it goes to exile (leyline, etc.) — that's not "put into a graveyard."

  BLITZ + BLINK (same principle as P433 Dash + blink):
    Blink the blitz creature before end step.
    Blink exiles → returns to battlefield as new object.
    New object: no "blitz cost was paid" property. No sacrifice scheduled. No haste from blitz.
    The delayed sacrifice trigger fires at end step for the old object (which no longer exists
      on the battlefield). The trigger does nothing.
    Result: blitz creature stays permanently. Same principle as dash + blink (P433).

  BLITZ + EXILE REPLACEMENT (Leyline of the Void, etc.):
    If blitz creature would go to GY but instead goes to exile (opponent's Leyline, etc.):
    The draw trigger condition: "when this permanent is put into a graveyard from the battlefield."
    It's going to EXILE, not GY. Draw trigger does NOT fire.
    No card drawn.
    Important for opponents: exile effects deny the blitz draw.

  BLITZ DRAW AND SACRIFICE:
    Sacrifice at end of step → creature goes to GY → draw trigger fires.
    These are simultaneous events: sacrifice sends to GY, draw trigger fires at that moment.
    Resolution: sacrifice happens, creature is in GY, draw trigger puts on stack, resolves, draw.

CLEAVE (702.148a):
  REMOVES BRACKETED TEXT:
    Alternative cost. If paid: "remove all text found within square brackets in the spell's rules text."
    This is a TEXT-CHANGING EFFECT (CR 702.148b: layer 3 in the layer system).
    Dig Up ({G}: "Search your library for a [basic land] card, [reveal it,] put it into your hand, then shuffle"):
      Cast normally: search for basic land; reveal it; put to hand.
      Cast with cleave ({1}{B}{B}{G}): remove bracketed text →
        "Search your library for a card, put it into your hand, then shuffle."
        Now: search for ANY card, no reveal required.
    The cleave cost is much higher but the effect is dramatically better.

  TEXT CHANGE AT CAST TIME:
    The bracketed text is removed as part of the spell going on the stack.
    While on the stack: the spell has the modified text (no brackets).
    Opponents can see the cleave cost was paid: they know it's searching for any card.

  WHAT GETS REMOVED:
    "[basic land]" → any land (or any card, depending on context).
    "[reveal it,]" → no reveal requirement. Private information.
    "[up to N]" becomes "N" (removing "up to").
    "[nonland]" becomes "permanent" (or omitted, allowing lands).
    "[target]" becomes "each" (similar to overload but text-change mechanics differ).
```

## Definitive Conclusions

- **Encore with a legendary creature creates multiple legendary tokens but legend rule reduces you to one** — all tokens' ETBs fire (they entered), but SBA 704.5j forces you to choose one to keep; effectively same as legendary myriad (P434).
- **Disturb Aura faces permanently exile themselves instead of going to the GY** — this self-replacement effect (614.15) prevents disturb recursion; the Aura is permanently exiled when it would go to the GY from anywhere.
- **Decayed creature dying in combat means the end-of-combat sacrifice does nothing** — the sacrifice trigger fires at end of combat but the creature is already gone; no double death.
- **Blitz + blink permanently keeps the blitz creature** — same principle as dash + blink (P433); blink creates new object without blitz properties; sacrifice trigger fizzles for the old object.
- **Blitz draw does NOT fire if the creature is exiled instead of going to the GY** — Leyline of the Void, Exile-on-death effects, and similar exile replacements deny the draw trigger.
- **Cleave is a text-changing effect (layer 3)** — the spell's text is permanently modified while on the stack when cleave cost is paid.

## Canonical Example
**Encore + Legendary problem:**
Amphin Mutineer ({3}{U}: 3/3; "when this creature enters, exile up to one target non-Salamander creature; that creature's controller creates a 4/3 blue Salamander Warrior"; encore {4}{U}{U}) is in your GY in a 4-player Commander game.

3 opponents. You activate encore: {4}{U}{U} + exile the card.
3 Amphin Mutineer tokens created (one per opponent), each attacks the designated opponent.
Each token: 3/3, non-legendary (Amphin Mutineer is NOT legendary).
ETBs: each token fires "when this creature enters." Each chooses a non-Salamander creature to exile.
3 ETBs → up to 3 creatures exiled. Then 3 tokens attack their designated opponents.
At beginning of next end step: all 3 tokens are sacrificed.

Now contrast: if Amphin were legendary (hypothetically "Legendary Amphin Mutineer"):
3 tokens created, all legendary, same name.
SBA fires: you control 3 legendary permanents with same name → choose 1, other 2 go to GY.
Only 1 token survives. 1 attacks.
But: all 3 ETBs fired when they ENTERED (before SBAs reduced them to 1).
So you still get 3 "exile a non-Salamander creature" triggers. Just 1 token attacks.

**Example 2 — Blitz + exile on death (Leyline interaction):**
You have Tenacious Underdog ({1}{B}: 3/2; blitz {2}{B}{B} + pay 2 life; "when this creature dies, draw a card"; also "you may cast this card from your graveyard using its blitz ability").

You cast Tenacious Underdog for blitz cost {2}{B}{B} + 2 life.
It enters with haste. Has the "when it's put into GY from battlefield, draw a card" trigger.

Opponent controls Leyline of the Void: "If a card would be put into an opponent's graveyard from anywhere, exile it instead."

You attack with Tenacious Underdog. Opponent blocks. Lethal damage to Underdog.
Underdog would go to GY. Leyline replaces: Underdog goes to exile.
"When put into GRAVEYARD from battlefield" — it went to EXILE. Trigger condition: not met.
No card drawn. The blitz draw was denied by the exile replacement.

The sacrifice at end of step: also fires for the same permanent object. The permanent is in exile (not on battlefield). The sacrifice trigger can't sacrifice what's not on the battlefield. Does nothing.

## Commonly Confused With
- **P433 (Dash/Exploit/Prowess)** — Blitz and dash are nearly identical in structure (alternative cost, haste, end-step removal). Dash returns to hand; blitz sacrifices + draws. Blitz + blink and dash + blink both permanently keep the creature (same principle). Both covered by P433's analysis; P446 adds the blitz-specific draw-on-death and exile-denies-draw rules.
- **P434 (Emerge/Myriad)** — Myriad and encore both create multiple token copies attacking opponents. Both have the legendary-token problem where legend rule reduces your tokens. P434 covers myriad's end-of-combat exile; P446 covers encore's next-end-step sacrifice. Same legendary problem, different timing.
- **P437 (Embalm/Eternalize/Aftermath)** — Encore exiles the card and creates tokens (like embalm/eternalize). Encore tokens attack this turn and are sacrificed; embalm/eternalize tokens are permanent. Both copy the original card's ETBs. Encore is strictly "this turn" value; embalm/eternalize are permanent board presence.
- **P436 (Overload)** — Cleave (removes bracketed text) and overload (replaces "target" with "each") are both text-changing effects that modify the spell while on the stack. Overload is an alternative cost applied during casting; cleave is also an alternative cost that removes specific bracketed content. Both are in layer 3 of the continuous effect system.
