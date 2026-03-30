---
id: p423
name: Conspire, Prowl, Retrace, and Reinforce — Lorwyn/Shadowmoor Cost-Variant Mechanics
category: costs
cr_refs: [702.78a, 702.78b, 702.76a, 702.81a, 702.77a, 702.77b]
tags: [conspire, prowl, retrace, reinforce, alternative-cost, additional-cost, tap-creatures, combat-damage-condition, discard-land-cost, hand-discard, copy-trigger, color-matching, Wort-Boggart-Auntie, Wort-the-Raidmother, Reiterate, Tribal-Flames, Morsel-Theft, Wurmweaver-Coil, Firespout, conspire-copy, prowl-condition, retrace-discard-land, Shadowmoor, Lorwyn, reinforce-hand-only]
created: 2026-03-29
examples_count: 2
---

# P423 — Conspire, Prowl, Retrace, and Reinforce — Lorwyn/Shadowmoor Cost-Variant Mechanics

## Abstract
Four Lorwyn/Shadowmoor mechanics provide alternative or additional cost options when casting spells. **Conspire** (702.78) is an additional cost (tap two creatures sharing a color with the spell) that creates a copy of the spell when paid. **Prowl** (702.76) is an alternative cost available when a creature of the right type dealt combat damage this turn. **Retrace** (702.81) lets you cast spells from your graveyard by discarding a land as an additional cost. **Reinforce** (702.77) is a hand-only activated ability to put +1/+1 counters on a creature. Key non-obvious interactions: (1) Conspire's copy is created by a triggered ability when the conspire cost is paid — not by replacement — so it can be Stifled; (2) a Conspire copy of a spell doesn't have its conspire cost paid a second time, so it can't create further Conspire copies (no infinite loop); (3) Prowl is an alternative cost — you can't pay BOTH the prowl cost AND additional costs alongside the regular mana cost; (4) Retrace can be used as many times as you have lands to discard; and (5) Reinforce activates in hand only but the activated ability still "exists" on the battlefield (relevant for effects that care about objects having activated abilities).

## The Definitive Rules

**CR 702.78a** (verbatim): *"Conspire is a keyword that represents two abilities. The first is a static ability that functions while the spell with conspire is on the stack. The second is a triggered ability that functions while the spell with conspire is on the stack. 'Conspire' means 'As an additional cost to cast this spell, you may tap two untapped creatures you control that each share a color with it' and 'When you cast this spell, if its conspire cost was paid, copy it. If the spell has any targets, you may choose new targets for the copy.' Paying a spell's conspire cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.78b** (verbatim): *"If a spell has multiple instances of conspire, each is paid separately and triggers based on its own payment, not any other instance of conspire."*

**CR 702.76a** (verbatim): *"Prowl is a static ability that functions on the stack. 'Prowl [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if a player was dealt combat damage this turn by a source that, at the time it dealt that damage, was under your control and had any of this spell's creature types.' Casting a spell for its prowl cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.81a** (verbatim): *"Retrace is a static ability that functions while the card with retrace is in a player's graveyard. 'Retrace' means 'You may cast this card from your graveyard by discarding a land card as an additional cost to cast it.' Casting a spell using its retrace ability follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.77a** (verbatim): *"Reinforce is an activated ability that functions only while the card with reinforce is in a player's hand. 'Reinforce N—[cost]' means '[Cost], Discard this card: Put N +1/+1 counters on target creature.'"*

**CR 702.77b** (verbatim): *"Although the reinforce ability can be activated only if the card is in a player's hand, it continues to exist while the object is on the battlefield and in all other zones. Therefore objects with reinforce will be affected by effects that depend on objects having one or more activated abilities."*

## The Pattern

```
CONSPIRE (702.78a):
  TWO PARTS:
  1. Static ability: "As an additional cost to cast this spell, you may tap two untapped
     creatures you control that each share a color with it."
  2. Triggered ability: "When you cast this spell, if its conspire cost was paid, copy it.
     If the spell has any targets, you may choose new targets for the copy."

  KEY RULES:
    ADDITIONAL COST (not alternative): You pay the full mana cost PLUS tap two creatures.
      This differs from prowl (alternative): conspire is on top of the normal cost.
    COLOR-SHARING:
      The two tapped creatures must each share a color with the conspire spell.
      A green spell: both creatures must be green (or have green in their color identity).
      A multicolor spell (say {G}{U}): each creature must share EITHER green OR blue (not both
        — they just need to share "a" color, not necessarily the same one).
      Colorless creatures: can't be used for conspire (no color to share).
    THE COPY IS CREATED BY A TRIGGERED ABILITY:
      This is crucial! The copy trigger: "when you cast this spell, if conspire cost was paid, copy it."
      This trigger goes on the stack AFTER the spell is cast (same as any triggered ability).
      The trigger CAN be Stifled/Disallowed — countering the trigger prevents the copy.
      The original spell still resolves normally (you just don't get the copy).
    CONSPIRE ON A COPY:
      The copy of the conspire spell is created by the trigger. It's a copy, not a new casting.
      Did the copy have its conspire cost paid? NO — the conspire cost was paid for the ORIGINAL.
        The copy is not cast; it's created by the trigger. "If its conspire cost was paid" is
        a condition about the casting of the spell. The copy is not cast; it's created.
        Wait — the conspire copy: does it re-trigger the conspire trigger?
        The triggered ability says "when you CAST this spell, if its conspire cost was paid."
        The copy wasn't CAST. The trigger doesn't re-fire for copies created this way.
        Result: NO conspire chain. Conspire creates exactly one copy. No infinite recursion.
    MULTIPLE CONSPIRE:
      702.78b: if a spell has multiple instances of conspire, each is paid separately.
        Pay for both: you can create two copies (one from each conspire trigger).
        Pay for one but not the other: only the paid-for conspire fires.
    CONSPIRE ON SPLIT SPELLS, COPIES:
      If you Fork/Reverberate a conspire spell: the copy also has conspire (it's copiable text,
        from P409/P411 principles). But the copy was not CAST, so the conspire trigger doesn't
        fire again. Conspire on the copy is text that exists but can't trigger (no casting event).

PROWL (702.76a):
  WHAT IT IS:
    Alternative cost: "you may pay [prowl cost] rather than this spell's mana cost" if a
      creature of the right type dealt combat damage to a player this turn.
  KEY RULES:
    CONDITION CHECKED:
      "If a player was dealt combat damage this turn by a source that... was under your control
        and had any of this spell's creature types."
      CREATURE TYPE MATCHING: The source that dealt combat damage must have a creature type
        that matches one of this spell's creature types.
      Prowl spells are typically Tribal Instant/Sorcery cards with creature types on their
        type line (e.g., "Tribal Instant — Rogue" means the spell has the Rogue type).
      For prowl: you need a source with the matching type to deal combat damage.
    ALTERNATIVE COST RULES:
      Prowl is an alternative cost (601.2b). You pay EITHER the normal mana cost OR the prowl
        cost — you can't pay both.
      You CAN still pay additional costs on top of prowl (kicker, etc.).
    CHANGELING + PROWL:
      A Changeling dealing combat damage satisfies the prowl condition for EVERY tribe.
        (Covered in P422 — any prowl card can be cast at prowl cost after Changeling deals damage.)
    TIMING:
      Prowl checks "this turn" — any combat damage dealt by a qualifying source this turn.
        Opponent's combat damage doesn't count (must be "under your control").
      Once the condition is met, it applies to all prowl spells you cast that turn.
    TRIBAL INSTANTS/SORCERIES:
      Many prowl cards are Tribal Instants or Tribal Sorceries (from Lorwyn block).
      They have creature types on the type line but aren't creatures.
      Their prowl cost works based on those types (not the card itself, which is a spell).

RETRACE (702.81a):
  WHAT IT IS:
    Static ability in GY: "You may cast this card from your graveyard by discarding a land
      card as an additional cost to cast it."
  KEY RULES:
    CAST FROM GY (not a special play from exile): casts from the GY via normal casting rules.
    ADDITIONAL COST: discard a land from hand.
      You still pay the full mana cost PLUS discard a land.
      You can pay additional costs on top of retrace (e.g., kicker costs).
    MULTIPLE RETRACES:
      You can retrace the same card multiple times per turn (if you have lands to discard).
      Each retrace is a new cast from the GY. After resolving, the card goes back to the GY
        (assuming no exile replacement effect). You can retrace it again.
      This creates a potential loop: retrace each turn as long as you have lands in hand.
    GRAFDIGGER'S CAGE:
      Grafdigger's Cage says "players can't cast spells from graveyards or libraries."
      Retrace casts from the GY → Cage STOPS retrace.
      (Unlike suspend/dredge/hideaway which are exile-based; retrace is explicitly from GY.)
    LAND DROPPING AND RETRACE:
      Discarding a land for retrace doesn't use your land drop for the turn. It's a discard cost,
        not playing a land. You still have your normal land drop available.
    RETRACE AND FLASHBACK:
      Both are GY cast mechanics. Key difference:
        Flashback: alternative cost (pay flashback cost instead of mana cost); exiles on resolve.
        Retrace: additional cost (discard a land on top of mana cost); returns to GY on resolve.
      Retrace cards can be cast multiple times (if you keep discarding lands); flashback only once.
    RETRACE AND LEYLINE OF THE VOID:
      If Leyline of the Void is in play ("if a card would be put into an opponent's graveyard
        from anywhere, exile it instead"):
      When a retrace card would resolve and go back to your GY: does Leyline redirect it?
      Leyline says "opponent's graveyard." If the retrace card is yours: Leyline doesn't apply
        (Leyline refers to opponents' GYs, not your own). Your retrace card returns to your GY.
      If your opponent controls Rest in Peace: "whenever a card is put into a graveyard from
        anywhere, exile it instead." This affects YOUR GY too. Retrace card would be exiled
        instead of going to your GY → you lose the retrace card (it's gone from GY).

REINFORCE (702.77a, 702.77b):
  WHAT IT IS:
    Activated ability ONLY while in hand: "[Cost], Discard this card: Put N +1/+1 counters
      on target creature."
  KEY RULES:
    HAND-ONLY ACTIVATION: you can ONLY activate reinforce while the card is in your hand.
      You can't activate it from the battlefield, GY, etc.
    BUT THE ABILITY EXISTS IN ALL ZONES (702.77b):
      The reinforce ability continues to exist on the object in all zones.
      Effects that care about "objects with activated abilities" treat reinforce permanents
        as having an activated ability — even on the battlefield, even in GY.
      Example: Vedalken Shackles ({3}: artifact; "{2}{T}: gain control of target creature with power
        ≤ the number of Islands you control for as long as this artifact remains tapped"): not directly relevant.
      Better: Biomancer's Familiar ({G}{U}: 2/2; "activated abilities of creatures you
        control cost {2} less to activate"): reduces activated ability costs. If you have a
        reinforce creature on the battlefield, does Biomancer's Familiar reduce the reinforce
        cost? The reinforce ability IS an activated ability that exists on the battlefield (702.77b),
        but can only be ACTIVATED from the hand. Biomancer's Familiar would reduce the cost... but
        the ability can't be activated from the battlefield anyway. In practice: no interaction.
    REINFORCE IS NOT A MANA ABILITY:
      Reinforce doesn't add mana. It's a non-mana activated ability.
      It costs {cost} AND the reinforce card itself (discard): you lose the card.
    REINFORCE vs CYCLING:
      Both cycle the card away (you discard it). Cycling draws a card; reinforce puts counters.
      Reinforce doesn't trigger "when you cycle a card" effects.
      Cycling is a keyword action; reinforce is an activated ability with a discard cost.
```

## Definitive Conclusions

- **Conspire creates its copy via a triggered ability** — the copy trigger can be Stifled; the original spell resolves normally without the copy if the trigger is countered.
- **Conspire copies cannot themselves create conspire copies** — the copy was not "cast," so the conspire triggered ability ("when you cast this spell, if conspire cost was paid") doesn't fire again; no infinite recursion.
- **Prowl is an alternative cost** — you pay either the prowl cost OR the normal mana cost, not both; additional costs (kicker) can still be paid on top of the prowl alternative cost.
- **Retrace is an additional cost (not alternative)** — you pay the full mana cost PLUS discard a land; it can be done multiple times per turn; Grafdigger's Cage stops it (casts from GY).
- **Reinforce can only be activated from hand, but the ability "exists" on the permanent** — effects that check whether objects have activated abilities see reinforce as existing even on the battlefield, even though it can't be activated there.
- **A Changeling dealing combat damage satisfies prowl for every tribe** — any prowl card can use its cheaper prowl cost after a Changeling deals combat damage (P422 interaction).

## Canonical Example
**Conspire + Wort, the Raidmother:**
Wort, the Raidmother ({4}{R/G}{R/G}: 3/3 Goblin Shaman; "whenever you cast an instant or sorcery spell, if you control two or more creatures that share a color with it, you may copy that spell"):

You cast Firespout ({2}{R/G}: sorcery; "Firespout deals 3 damage to each creature without flying if {R} was spent to cast it, and 3 damage to each creature with flying if {G} was spent"):
Firespout has conspire? Wait — Wort has a triggered ability that copies, not conspire proper.
Let me use a better example for Conspire specifically.

Wurmweaver Coil ({4}{G}{G}: enchantment Aura; "enchanted creature gets +6/+6"; conspire):
You control two untapped green creatures.
Cast Wurmweaver Coil for {4}{G}{G} (6 mana) + tap two green creatures (conspire cost).
Conspire trigger fires: copy the spell. Choose new target for the copy.
Result: two copies of Wurmweaver Coil — two creatures each getting +6/+6.

Can the copy of Wurmweaver Coil trigger a further conspire? No. The copy was created by a trigger,
not cast. The conspire trigger only fires "when you CAST this spell." The copy was never cast.
No infinite recursion. Exactly one copy created.

Opponent Stifles the conspire trigger: the trigger is countered. No copy created.
Wurmweaver Coil resolves normally (enchants one creature for +6/+6). You spent the tap-two-creatures
conspire additional cost for nothing (the cost was paid; the trigger just did nothing).

**Example 2 — Retrace vs. Grafdigger's Cage:**
Your GY: Call the Skybreaker ({5}{U/R}{U/R}: sorcery; "create a 5/5 blue and red Elemental creature token with flying"; retrace).

You have lands in hand and the mana available.
Normal situation: discard a land, pay {5}{U/R}{U/R}, cast Call the Skybreaker from GY.
Resolves: one 5/5 flying Elemental token. Call the Skybreaker goes back to your GY (retrace cards aren't exiled).
Next main phase: retrace it again with another land.

Opponent plays Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
Now: you can't cast Call the Skybreaker from your GY via retrace. Cage explicitly prevents it.
Retrace requires casting from the GY — Cage stops it completely.

Compare: Flashback (P408) is also stopped by Cage. Dredge (P415) is NOT stopped (dredge doesn't cast).
Suspend (P417) is NOT stopped (casts from exile). All three have similar interaction with Cage but
different outcomes because of where the card is cast from.

## Commonly Confused With
- **P407 (Cycling/Kicker/Buyback)** — Retrace is like buyback but from the GY; buyback pays an additional cost to return to hand at resolution; retrace pays an additional cost to cast FROM the GY. Both are "pay more to reuse the spell" but from different zones.
- **P408 (Flashback/Madness)** — Flashback and retrace both cast from the GY but differ critically: flashback is an alternative cost (instead of mana cost) and exiles on resolve; retrace is an additional cost (on top of mana cost) and returns to GY on resolve. Cage stops both.
- **P409 (Copy Effects)** — Conspire creates a copy via a triggered ability; Fork/Reverberate create copies via spell resolution. The conspire trigger is Stifle-able; Fork is not (it's spell resolution). Both copies inherit copiable values.
- **P422 (Changeling)** — Prowl and Changeling interact: Changeling's combat damage enables prowl for every tribe simultaneously. Covered in P422.
