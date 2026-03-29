---
id: p385
name: Reconfigure, Cleave, and Compleated — Equipment Creatures, Text Removal, and Reduced Loyalty
category: costs
cr_refs: [702.151a, 702.151b, 702.148a, 702.148b, 702.150a, 612.1, 301.5c]
tags: [reconfigure, cleave, compleated, equipment-creature, attach-unattach-sorcery, bracketed-text-removal, text-changing-effect, phyrexian-mana-loyalty-reduction, loyalty-minus-two, Kamigawa-Neon-Dynasty, New-Phyrexia, Shadowspear-reconfigure, Lizard-Blades, Grafted-Identity, Tamiyo-Compleated-Sage, Phyrexian-Obliterator-cleave, Cleave-Zephyr-Strike]
created: 2026-03-29
examples_count: 2
---

# P385 — Reconfigure, Cleave, and Compleated — Equipment Creatures, Text Removal, and Reduced Loyalty

## Abstract
**Reconfigure** (702.151) allows Equipment cards that are also creatures to be attached to other creatures as Equipment (stopping being a creature in the process) or unattached (reverting to a creature). Both actions are sorcery-speed activated abilities. **Cleave** (702.148) is an alternative cost that, if paid, removes all text within square brackets from the spell — creating a different (usually stronger) effect. **Compleated** (702.150) is a static ability on some Phyrexian planeswalkers: if any Phyrexian mana symbols in the casting cost were paid with life instead of mana, the planeswalker enters with 2 fewer loyalty counters per such symbol. These three mechanics share a theme of "choose a modified version at a cost."

## The Definitive Rules

**CR 702.151a** (verbatim): *"Reconfigure represents two activated abilities. Reconfigure [cost] means '[Cost]: Attach this permanent to another target creature you control. Activate only as a sorcery' and '[Cost]: Unattach this permanent. Activate only if this permanent is attached to a creature and only as a sorcery.'"*

**CR 702.151b** (verbatim): *"Attaching an Equipment with reconfigure to another creature causes the Equipment to stop being a creature until it becomes unattached from that creature."*

**CR 702.148a** (verbatim): *"Cleave is a keyword that represents two static abilities that function while a spell with cleave is on the stack. 'Cleave [cost]' means 'You may cast this spell by paying [cost] rather than paying its mana cost' and 'If this spell's cleave cost was paid, change its text by removing all text found within square brackets in the spell's rules text.' Casting a spell for its cleave cost follows the rules for paying alternative costs."*

**CR 702.148b** (verbatim): *"Cleave's second ability is a text-changing effect. See rule 612, 'Text-Changing Effects.'"*

**CR 702.150a** (verbatim): *"Compleated is a static ability found on some planeswalker cards. Compleated means 'If this permanent would enter with one or more loyalty counters on it and the player who cast it chose to pay life for any part of its cost represented by Phyrexian mana symbols, it instead enters the battlefield with that many loyalty counters minus two for each of those mana symbols.'"*

## The Pattern

```
RECONFIGURE (702.151):
  WHAT IT IS:
    Equipment creatures in Kamigawa: Neon Dynasty that can EITHER:
      A) Function as a standalone creature (normal creature mode).
      B) Function as Equipment attached to another creature (equipment mode — stops being a creature).
    "Reconfigure [cost]" = two activated abilities, both sorcery-speed.
  ATTACHING (BECOMING EQUIPMENT):
    "[Cost]: Attach this permanent to another target creature you control."
    This is an activated ability. Costs mana/other costs. Sorcery speed.
    After attaching: the Equipment "stops being a creature" (702.151b).
      The Equipment is still a permanent. Still an artifact. Still an Equipment.
      But: not a creature. Its creature-specific abilities (P/T, combat) are no longer relevant.
      The creature it's attached to gains the Equipment's equip bonuses.
    The Equipment follows normal Equipment rules while attached:
      301.5c: "An Equipment that's also a creature can't equip a creature unless the Equipment
        isn't currently a creature."
      So: must unattach first if you want to reattach to a different creature.
  UNATTACHING (REVERTING TO CREATURE):
    "[Cost]: Unattach this permanent. Activate only if this permanent is attached to a creature."
    After unattaching: the Equipment becomes a creature again (702.151b implies it stops being a
      creature while attached → reverting unattachment restores the creature status).
    It's a separate creature. No summoning sickness on unattach (it was already a permanent
      on the battlefield). Can attack immediately if it has haste (or had summoning sickness removed).
      Wait: if the Equipment entered this turn (as a creature), it has summoning sickness.
        After attaching (not a creature), after unattaching (creature again): summoning sickness?
        The permanent is still the same permanent. Summoning sickness applies to the permanent,
          not just when it's a creature.
        "A creature with summoning sickness" is checked at the time it would attack.
        If the permanent entered this turn and was a creature this turn (even briefly as Equipment):
          it still has summoning sickness.
      Rule: summoning sickness is about "been under your control continuously since your most
        recent turn began" (from 302.6). The equipment creature entered this turn: has SS.
        Reconfiguring doesn't reset that clock.
  RECONFIGURE IN PRACTICE:
    Turn 3: Cast Lizard Blades ({2}{R}{R}: 1/1 with double strike, "Reconfigure {3}").
      It enters as a 1/1 creature. Summoning sickness.
    Turn 4: You have a 3/3 creature already. Activate Reconfigure ({3}) as sorcery.
      Lizard Blades attaches to the 3/3. The 3/3 is now equipped: gains double strike.
      Lizard Blades is no longer a creature. Attack with the 3/3 double strike.
    Turn 5: Unattach Lizard Blades ({3}) as sorcery. It becomes a 1/1 creature again.
      It's been in play since turn 3. No summoning sickness (it's been there multiple turns).
      Lizard Blades can attack independently as a 1/1 double striker.
    Reconfigure = the freedom to choose whether the Equipment fights alone or empowers others.
  KEY RULE (301.5c):
    "An Equipment that's also a creature can't equip a creature."
    Standard Equipments (like Sword of Fire and Ice) are NOT creatures.
    Reconfigure creatures ARE creatures (in creature mode). So they can't use normal equip abilities.
    But: reconfigure has its OWN activation that attaches (bypassing the creature check? No):
    Actually: 301.5c says "an Equipment that's ALSO a creature can't equip."
    Reconfigure Equipment in creature mode = can't equip normally.
    But reconfigure's activation "attach this permanent" is a DIFFERENT ability (not the equip ability).
    The reconfigure activation is what attaches it. Not "Equip." So 301.5c doesn't block reconfigure.
    Wait: let me re-read: 301.5c: "An Equipment that's also a creature can't equip a creature
      unless that Equipment isn't currently a creature."
    "Can't equip" = can't use the Equip activated ability.
    Reconfigure is a SEPARATE ability from Equip.
    Therefore: Reconfigure can be activated even while the Equipment is currently a creature.
    Reconfigure is the mechanism for attaching; the standard equip ability isn't on reconfigure cards.
    So the rule is moot for reconfigure cards (they don't have a standard "Equip" ability).

CLEAVE (702.148):
  WHAT IT IS:
    Spells from Innistrad: Crimson Vow with square brackets in their text.
    If you pay the cleave cost (alternative cost — different from the normal mana cost):
      All text within square brackets is REMOVED from the spell's text while it's on the stack.
    This often makes the spell MORE powerful (removes restrictions or the "target [limitation]" text).
  HOW IT WORKS:
    The spell has normal text. Square brackets mark optional/limited text.
    Pay cleave cost: text-changing effect (rule 612) removes the bracketed text.
    The spell behaves AS IF the bracketed text wasn't there.
    After the spell resolves: the card is back to normal (text-changing effects are temporary).
  EXAMPLES:
    Dig Up ({B}: "Search your library for a [basic land] card, reveal it, and put it into your
      hand. Shuffle. Cleave {4}{B}{G}"):
    Normal cast ({B}): search for a basic land only.
    Cleave cost ({4}{B}{G}): "[basic land]" is removed → search for ANY card. Much more powerful.
    Cost: {4}{B}{G} total instead of {B}. A 5-mana unconditional tutor vs. a 1-mana land tutor.

    Defenestrate ({2}{B}: "Destroy target [non-flying] creature. Cleave {4}{B}"):
    Normal cast ({2}{B}): destroy target non-flying creature. 3-mana limited removal.
    Cleave cost ({4}{B}): "[non-flying]" removed → destroy target creature. 5-mana unconditional kill.

  TEXT-CHANGING ON THE STACK (612):
    The cleave text-changing effect applies while the spell is on the stack.
    When the spell resolves: it has the modified text (brackets removed).
    The card back in your GY: has the original printed text. (Cleave doesn't permanently change the card.)
    If the spell is copied: the copy has the modified text (copy uses the spell's current text — 707.2a).

COMPLEATED (702.150):
  WHAT IT IS:
    Some New Phyrexia planeswalkers have Phyrexian mana symbols ({G/P}, {U/P}, etc.) in their cost.
    Phyrexian mana: pay 2 life instead of the colored mana (or pay the colored mana normally).
    Compleated modifies what happens if you chose to pay life for those symbols.
  HOW IT WORKS:
    If any Phyrexian mana symbols were paid with life (not colored mana):
      The planeswalker enters with 2 FEWER loyalty counters per such symbol paid with life.
    If all Phyrexian symbols were paid with their colored mana:
      The planeswalker enters normally (full loyalty).
    Trade-off: 2 life instead of 1 mana, but at the cost of 2 loyalty counters.
  EXAMPLE — TAMIYO, COMPLEATED SAGE ({1}{G}{G}{U}{U} + Compleated):
    Card prints as {1}{G/P}{G/P}{U/P}{U/P} (4 Phyrexian symbols).
    Option 1: Pay {1}{G}{G}{U}{U} (all colored). Full loyalty (enters with however many it has, e.g. 5).
    Option 2: Pay {1}{2 life}{2 life}{U}{U} (pay life for 2 G/P symbols): enters with 5 - 4 = 1 loyalty.
    Option 3: Pay all 4 life symbols: 5 - 8 = -3 loyalty? Doesn't make sense...
    Actually: Compleated says "minus 2 loyalty for each of those mana symbols."
    If Tamiyo normally enters with 5 loyalty:
      Pay 1 Phyrexian with life: enters with 5 - 2 = 3 loyalty.
      Pay 2 Phyrexian with life: enters with 5 - 4 = 1 loyalty.
      Pay 3 Phyrexian with life: 5 - 6 = -1? Can't have negative loyalty.
    Actually: the planeswalker likely only has 2-4 Phyrexian symbols.
    The "loyalty minus 2 per symbol paid with life" is the exact penalty.
  STRATEGIC USE:
    Pay life to cast a planeswalker for less mana: enter sooner (turn 3 vs turn 5).
    But enter with much fewer loyalty counters: less ability to activate.
    High-risk: a 1-loyalty planeswalker immediately dies to any attack.
    Situational: great when you need the planeswalker's passive/ETB ability immediately;
      poor when you need the loyalty to use its abilities.
  COMPLEATED AND DAMAGE:
    Loyalty counters lost from compleated are not "damage." They're simply fewer counters placed.
    "Deals damage to a planeswalker" effects don't trigger from compleated.
    Planeswalker enters with fewer counters — not from damage.

RECONFIGURE AND LAYER SYSTEM:
  EQUIPMENT STATUS:
    While attached (not a creature): the Equipment grants its bonuses to the equipped creature.
    These are continuous effects (Layer 6: ability-adding; Layer 7: P/T modification).
    When unattached (a creature): the Equipment no longer grants those bonuses to any creature.
    The Equipment itself has its printed P/T as a creature.
    If the Equipment had "+2/+2 to equipped creature" and you unattach:
      The formerly equipped creature loses +2/+2.
      The Equipment itself doesn't get "+2/+2" — that's only for "equipped creature."
      The Equipment is a creature with its printed stats.
```

## Definitive Conclusions

- **Reconfigure attaching/unattaching is a sorcery-speed activated ability** — can be responded to; the Equipment stops being a creature while attached (702.151b); reconfigure uses its own attach mechanism (not the "Equip" keyword), so 301.5c's restriction doesn't block it.
- **Cleave pays an alternative cost to remove bracketed text** — the text-changing effect applies while the spell is on the stack; copies of a cleaved spell have the modified text; the card returns to its original printed text in any non-stack zone.
- **Compleated penalizes each Phyrexian mana symbol paid with life by 2 loyalty counters** — if you pay the colored mana normally, the planeswalker enters at full loyalty; the loyalty reduction is not damage; it's simply "enters with fewer counters."
- **An Equipment with reconfigure can't use standard "Equip" while it's a creature** — but reconfigure has its own attachment activation that bypasses this (reconfigure ≠ Equip keyword).

## Canonical Example
**Lizard Blades Tactical Switching:**
Battlefield: You control a 4/4 creature. Lizard Blades ({2}{R}{R}: 1/1 double strike, Reconfigure {3}) has been on the battlefield for 2 turns.

Situation A: You want to maximize damage this turn.
Main phase: Reconfigure {3} — activate. Lizard Blades attaches to your 4/4.
The 4/4 now has double strike (from Lizard Blades' ability).
Attack with the 4/4 (now equipped): deals 4 first-strike damage and 4 regular damage. 8 total.
Lizard Blades is not a creature this turn (attached to the 4/4).
After combat: you want Lizard Blades free for blocking.
Main phase 2 (or whenever you have priority): unattach ({3}) — Lizard Blades becomes a creature.
Now Lizard Blades is a 1/1 double striker ready to block or attack next turn.

Situation B: You want both creatures attacking.
Don't reconfigure. Lizard Blades attacks as 1/1 double striker.
Your 4/4 attacks separately.
Total damage: 2 (double strike Lizard Blades) + 4 = 6 damage. Less than the equipped scenario.
But: two separate threat vectors.

Reconfigure gives flexibility to optimize combat for the situation.

**Example 2 — Tamiyo, Compleated Sage — Loyalty Trade-off:**
You have {1}{G}{G}{U}{U} available on turn 5.
Standard cast: Tamiyo enters with full loyalty (e.g., 5 loyalty counters).
Use Tamiyo's +1: "Tap up to two target permanents." Active several turns.

Alternate scenario: Turn 3, you only have {1}{G}{U} + 4 life to spare.
Pay {1}{G/P with life}{G/P with life}{U/P with mana}{U/P with mana}: 2 life payments, 2 colored payments.
Total life paid: 4 (2 × 2). But you spent 4 life, not {G}{G}.
Tamiyo enters with 5 - 4 = 1 loyalty counter.

She has 1 loyalty. You use her +1 immediately (now 2 loyalty). Then opponents attack her.
Opponent attacks with two creatures. Tamiyo loses 2 loyalty from combat damage (she absorbs attacks).
Wait: you don't have to redirect damage. Tamiyo just has 1 loyalty.
Opponent deals damage to Tamiyo: she has 1 loyalty, takes any damage → -1 → SBA: 0 loyalty → removed.
She immediately dies to even 1 combat damage.

The trade-off: 4 life to cast Tamiyo 2 turns earlier, but she's extremely fragile at 1 loyalty.
Better use: cast her turn 3, use her ETB/immediate ability (0 loyalty abilities or -X abilities).
If her -X ability is valuable enough to use ONCE: the trade may be worth it even at 1 loyalty.
Example: Tamiyo's -3: "Draw three cards. You may put a permanent card from your hand onto the
  battlefield." At 1 loyalty, you'd need to +1 twice before using -3. Not achievable.
But her passive: "As long as Tamiyo is on the battlefield, if a spell or ability would cause you
  to discard a card, you discard it and then draw a card instead."
That passive works at any loyalty level. So 1-loyalty Tamiyo still draws-instead-of-discards.
Pay life to protect that passive. Compleated makes sense for passive-ability planeswalkers.

## Commonly Confused With
- **P381 (Morph/Disguise/Face-Down)** — Reconfigure also switches a permanent between two "modes" (creature vs. attached Equipment). But reconfigure is explicit (activated ability, sorcery speed); face-down mechanics use a special action. Reconfigure reveals the card's full identity throughout; face-down mechanics hide it.
- **P004 (Layer System)** — When Reconfigure attaches the Equipment, the bonuses granted to the equipped creature are continuous effects (Layer 6 for ability-granting, Layer 7 for P/T). When it unattaches, those effects end immediately (the source of the effect is no longer attached). The layer system handles the P/T changes accordingly.
- **P002 (Replacement Effects)** — Cleave's text-changing effect (removing brackets) is a text-changing effect (rule 612), not a replacement effect. The spell behaves differently based on the text as modified. This is different from replacement effects that change what happens to the spell or its targets.
- **P378 (Commander Rules)** — Compleated planeswalkers are legal in Commander if their color identity (all mana symbols including Phyrexian) fits the commander. Phyrexian mana symbols like {G/P} count as both colored and Phyrexian — their color (G) is part of the color identity.
