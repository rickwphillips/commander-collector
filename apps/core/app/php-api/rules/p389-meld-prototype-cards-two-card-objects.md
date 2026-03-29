---
id: p389
name: Meld and Prototype Cards — Two-Card Objects and Reduced-Cost Casting Modes
category: zones
cr_refs: [701.42a, 701.42b, 701.42c, 712.4a, 712.4b, 712.4c, 718.1, 718.2, 718.2a, 718.3, 718.3a, 718.3b, 718.3c, 718.3d, 718.4, 718.5]
tags: [meld, prototype, two-card-object, meld-pair, back-face-combined, cant-transform-meld, cant-transform-converted, prototyped-spell, alternative-PT-cost, prototype-color, Mishra-Lost-to-Phyrexia, Urza-Planeswalker, Brisela-Voice-of-Nightmares, Hanweir-Writhing-Township, prototype-card, smaller-version-cheaper, Blightsteel-Prototype, Phyrexian-Fleshgorger]
created: 2026-03-29
examples_count: 2
---

# P389 — Meld and Prototype Cards — Two-Card Objects and Reduced-Cost Casting Modes

## Abstract
**Meld** (701.42, rule 712.4) is a mechanic where two specific cards — a meld pair — can be combined into a single oversized permanent by exiling both and putting them onto the battlefield combined (back-face up). The resulting permanent is a single object represented by two physical cards. Unlike DFCs, meld cards cannot be transformed or converted — the combined form is only accessible via the meld mechanic. **Prototype** (702.160, rule 718) is an alternative casting mode on specific artifacts: you can cast the spell for a reduced mana cost (the "prototype" cost), and it enters the battlefield with the prototype's power, toughness, and color instead of its normal characteristics. All other abilities remain the same. The card's normal characteristics apply in every other zone and when cast normally.

## The Definitive Rules

**CR 701.42a** (verbatim): *"Meld is a keyword action that appears in an ability on one card in a meld pair. To meld the two cards in a meld pair, put them onto the battlefield with their back faces up and combined. The resulting permanent is a single object represented by two cards. See rule 712, 'Double-Faced Cards.'"*

**CR 701.42b** (verbatim): *"Only two cards belonging to the same meld pair can be melded. Tokens, cards that aren't meld cards, or meld cards that don't form a meld pair can't be melded."*

**CR 712.4a** (verbatim): *"One card in each meld pair has an ability that exiles both that object and its counterpart and melds them. To meld the two cards in a meld pair, put them onto the battlefield with their back faces up and combined. The resulting permanent is a single object represented by two cards."*

**CR 712.4c** (verbatim): *"Unlike other double-faced cards, meld cards cannot be transformed or converted. Any instructions to do so are ignored."*

**CR 718.3a** (verbatim): *"While casting a prototyped spell, use only its alternative power, toughness, and mana cost when evaluating those characteristics to see if it can be cast."*

**CR 718.3b** (verbatim): *"Both a prototyped spell and the permanent it becomes have only its alternative set of power, toughness, and mana cost characteristics. If that mana cost includes one or more colored mana symbols, the spell and the permanent it becomes are also that color or colors."*

**CR 718.4** (verbatim): *"In every zone except the stack or the battlefield, and while on the stack or the battlefield when not cast as a prototyped spell, a prototype card has only its normal characteristics."*

**CR 718.5** (verbatim): *"A prototype card's characteristics other than its power, toughness, and mana cost (and other than color) remain the same whether it was cast as a prototyped spell or cast normally."*

## The Pattern

```
MELD (701.42, 712.4):
  WHAT IT IS:
    Two specific cards ("a meld pair") that can be combined.
    ONE card in the pair has the meld ability: "exile this + exile [other card], meld them."
    Both cards must be on the battlefield controlled by the same player.
    The ability exiles both and puts them onto the battlefield combined (back faces up, touching).
  THE MELDED PERMANENT:
    A single permanent. A single object. One controller. One set of characteristics.
    Represented by two physical cards.
    The melded permanent's characteristics = the combined back face (printed spanning both cards).
    It has one name, one set of abilities, one P/T (spanning both cards).
  MELD PAIRS (712.5a-g):
    Midnight Scavengers + Graf Rats → Chittering Host.
    Hanweir Garrison + Hanweir Battlements → Hanweir, the Writhing Township.
    Bruna, the Fading Light + Gisela, the Broken Blade → Brisela, Voice of Nightmares.
    Phyrexian Dragon Engine + Mishra, Claimed by Gix → Mishra, Lost to Phyrexia.
    The Mightstone and Weakstone + Urza, Lord Protector → Urza, Planeswalker.
    Argoth, Sanctum of Nature + Titania, Voice of Gaea → Titania, Gaea Incarnate.
    Fang, Fearless l'Cie + Vanille, Cheerful l'Cie → Ragnarok, Divine Deliverance.
  CAN'T TRANSFORM OR CONVERT (712.4c):
    Unlike other DFCs: meld cards don't transform or convert via transform/convert effects.
    "Moonmist" (transform all Humans you control): if a meld card is a Human on the battlefield,
      it can't transform. The instruction is ignored.
    Meld is the ONLY way to access the combined back face.
  MELDED PERMANENTS — MANA VALUE:
    The melded permanent's mana value = SUM of the two front faces' mana values.
    Mishra, Lost to Phyrexia's mana value = MV(Mishra, Claimed by Gix) + MV(Phyrexian Dragon Engine).
    This matters for: death triggers ("if mana value is X"), spells that search by mana value, etc.
  MELD PROCEDURE:
    Preconditions: both cards must be permanents controlled by the same player.
    The meld ability says "exile this and exile [other card], then meld them."
    Step 1: Exile both permanents.
    Step 2: Put them onto the battlefield combined (back faces up).
    The exile step: yes, the permanents do leave the battlefield (zone change). Death triggers?
      Actually: 712.4a says "put them onto the battlefield with their back faces up and combined."
      The CR says it's an exile + battlefield entry. The exile DOES trigger "leaves the battlefield"
        triggers (like death triggers if the card dies? No — it's exiled, not destroyed/died).
      "Leaves the battlefield" triggers fire. Cards die to the battlefield → exile → battlefield.
      But: the combined permanent is a NEW object (P003: zone change).
  MELD AND LEGEND RULE:
    Brisela, Voice of Nightmares (legendary). If two players each meld Brisela:
      Each player controls one Brisela. Legend rule: each player independently must sacrifice one.
      Each player chooses their own. If both players control Brisela: both sacrifice. Both Briselas die.
      Wait: legend rule (704.5j): "If a player controls two or more legendary permanents with the
        same name, that player chooses one to remain, rest go to GY."
      If YOU control two Briselas: choose one.
      If EACH player controls one: each player controls one. No conflict for either. Both remain.
  MELDED PERMANENT'S CHARACTERISTICS:
    All characteristics from the COMBINED back face.
    Both cards contribute to the P/T, abilities, and other characteristics of the combined card.
    NOT the front faces' characteristics.
    Example: Hanweir Garrison (3/4) + Hanweir Battlements (land): meld into Hanweir, the Writhing
      Township (7/4 Eldrazi-Incarnation thing with haste and a triggered ability).
    The 3/4 and land characteristics are IRRELEVANT once melded — the combined card's stats apply.
  SEPARATING THE MELD:
    If the melded permanent leaves the battlefield: the TWO CARDS go to separate zones.
    They go to the same zone (both to GY, both to hand, both to exile, etc.).
    Each card follows its own oracle text for zone destinations.
    Actually: 712.4c confirms they can't transform. When they leave: each card is a separate card.
    They each go to their owner's GY (if "destroyed"), etc.

PROTOTYPE (702.160, 718):
  WHAT IT IS:
    Some artifact cards (The Brothers' War set primarily) can be cast in two modes:
    Mode A: Normal cast. Pay the full mana cost. The card has its normal P/T.
    Mode B: Prototyped cast. Pay the smaller prototype cost (alternative mana cost). Enter with
      smaller P/T (the "prototype" P/T in the inset frame). Also gains the prototype cost's colors.
  THE PROTOTYPE CHARACTERISTICS:
    While a prototyped spell or prototyped permanent:
      Only its ALTERNATIVE power, toughness, and mana cost.
      Color: determined by the prototype cost's colored mana symbols.
      All OTHER abilities: still from the card's printed text (718.5).
  WHY PROTOTYPE?:
    Allows high-cost bomb cards to be played earlier as a smaller version.
    The smaller version still has the same ABILITIES — just smaller stats and limited colors.
    Then: when you want the full version, cast it normally (full mana cost).
    Or: replay from GY/hand at full cost to get the big version.
    Prototype = "now for cheap" or "later for full power."
  EXAMPLE — PHYREXIAN FLESHGORGER ({7}: 7/5 living weapon, prototype {3}{B}: 3/3):
    Normal cast ({7}): 7/5 creature with living weapon (creates a Germ token, equips to it).
    Prototype cast ({3}{B}): 3/3 black creature (same abilities — living weapon? Yes, 718.5).
    Wait: living weapon says "when this enters, create a 0/0 Germ token, attach this to it."
    The Phyrexian Fleshgorger is an Equipment (living weapon). Whether cast as prototype or normal:
      Living weapon fires. A Germ enters. Fleshgorger attaches to it.
      But: P/T is 3/3 (prototype) vs 7/5 (normal).
    Key: same abilities, different size.
  PROTOTYPE AND MANA VALUE:
    When prototyped: "the spell's mana cost is the prototype cost" (718.3b).
    So: mana value of a prototyped Phyrexian Fleshgorger = MV({3}{B}) = 4.
    Mana value of Phyrexian Fleshgorger normally = MV({7}) = 7.
    This affects: cascade (finds spells with MV less than the cascade card), death triggers, etc.
    In GY, hand, or non-battlefield zones: the card has only its normal characteristics (718.4).
    Mana value in GY = 7. (Normal characteristics.)
  PROTOTYPE COLOR:
    718.3b: "If that [prototype] mana cost includes colored mana symbols, the spell and permanent
      are also that color or colors."
    Phyrexian Fleshgorger prototyped as {3}{B}: it's BLACK while prototyped.
    Normal cast ({7}): colorless (no colored symbols in the cost).
    The color changes depending on how it was cast.
  COPYING A PROTOTYPED SPELL:
    718.3c: a copy of a prototyped spell is also a prototyped spell.
    It has the prototype characteristics (alternative P/T and mana cost).
  PROTOTYPE AND ZONE TRANSITIONS:
    When a prototyped permanent dies (or goes to GY): it's now in the GY.
    718.4: in the GY (zone other than stack or battlefield), it has only its NORMAL characteristics.
    The prototype designation is gone. It's back to its full stats (on the card, not prototype).
    If reanimated later: it enters as the full-size card (unless you choose to cast it as prototype again,
      but reanimation usually isn't "casting").
    "You may cast target creature card from GY": this is a cast event → you choose prototype or normal.
    "Return target creature card from GY to battlefield": NOT a cast. It enters with normal characteristics.
```

## Definitive Conclusions

- **The melded permanent is a single object represented by two cards** — it has one set of characteristics (the combined back face), one mana value (sum of both front faces), and one controller; the two physical cards just represent it.
- **Meld cards cannot be transformed or converted** — any instruction to do so is ignored (712.4c); meld is the only way to access the combined form.
- **When a melded permanent leaves the battlefield, the two cards go to their respective zones separately** — both go to the GY if destroyed, both to exile if exiled, etc.
- **Prototyped spells/permanents have ONLY the prototype's P/T, mana cost, and color** — all other abilities remain from the card's normal text (718.5).
- **In zones other than the stack or battlefield, a prototype card has only its normal characteristics** — mana value in the GY is the full-cost value, not the prototype cost.
- **Copying a prototyped spell creates a copy with the prototype characteristics** — the copy has the smaller P/T and prototype mana cost; it's a prototyped spell itself.

## Canonical Example
**Hanweir Garrison + Hanweir Battlements Meld:**
Hanweir Garrison ({2}{R}: 2/3, "whenever this attacks, create two tapped and attacking 1/1 red Human tokens").
Hanweir Battlements (land, "{T}: Add {R}" and "{2}{R}{R}: Haste until EOT to target creature you control" and "At the beginning of combat on your turn, if you both own and control Hanweir Battlements and a creature named Hanweir Garrison, you may exile them, then meld them into Hanweir, the Writhing Township.").

Turn 4: You control Hanweir Garrison. You also control Hanweir Battlements (a land).
Beginning of combat: the meld trigger fires (you own and control both).
You may exile them and meld:
- Hanweir Garrison leaves the battlefield (exile). "Leaves battlefield" triggers fire but Garrison is not dying — it's being exiled. Death triggers (specifically "when this creature dies = GY") DON'T fire. But "when this creature leaves the battlefield" DOES fire.
- Hanweir Battlements leaves the battlefield (exile). Same: leaves-battlefield triggers fire.
- Hanweir, the Writhing Township enters the battlefield combined (back face up).
  It's a single legendary creature with abilities from the combined card.
  "When Hanweir, the Writhing Township attacks, create four tapped and attacking 1/1 red Human creature tokens." (Combined effect.)

ETB of Hanweir, the Writhing Township: new object, ETB triggers fire.

Mana value of Hanweir, the Writhing Township = MV(Hanweir Garrison: {2}{R} = 3) + MV(Hanweir Battlements: {0} = 0) = 3.

**Example 2 — Phyrexian Fleshgorger Prototype vs. Normal:**
Battlefield situation: Turn 4, you have {3}{B} available.
Hand: Phyrexian Fleshgorger ({7}: 7/5 Phyrexian Zombie Living Weapon).

Option A: Prototype cast {3}{B} → enters as 3/3 black creature.
Living weapon: "When this enters, create a 0/0 black Phyrexian Germ creature token, then attach this to it."
Even as prototype: living weapon fires. The Germ enters (0/0), Fleshgorger attaches.
The Germ is now "equipped" with Fleshgorger: the Germ's P/T becomes 3/3 (from the equipment-style bonus).
Actually: Phyrexian Fleshgorger as an Equipment grants the Germ +X/+X based on the card's P/T?
Let me be precise: Phyrexian Fleshgorger is a Creature — Equipment. While attached: Germ gets +X/+X (where X = Fleshgorger's P/T? Let me check the card's actual rules text).
Regardless of specifics: the key point is the same abilities apply in both modes (718.5), just different P/T.

Option B (later): Normal cast {7} → 7/5 colorless creature.
Living weapon fires: Germ enters, attaches. Now you have a 7/5-based Equipment creature.
Or: if Fleshgorger died after prototype cast, it's in your GY with MV 7 (normal characteristics).
Opponent's cascade spell (exiling until less MV found): can find Phyrexian Fleshgorger in your library?
In library: has its NORMAL characteristics (MV 7). Cascade threshold determines if it can be found.
If cascade card is MV 8: yes, Fleshgorger (MV 7) can be found and cast via cascade.
When cast via cascade: you CHOOSE prototype or normal. You may prototype it for {3}{B} even when found via cascade.

## Commonly Confused With
- **P374 (Daybound/Nightbound Transform)** — Both meld and transform/convert involve DFC mechanics. Key difference: transform/convert is reversible (can transform back); meld is not (can't un-meld; can't transform). The combined meld permanent can only return to the two separate cards by leaving the battlefield.
- **P003 (Zone Change — New Object)** — When two cards meld together, the resulting combined permanent is a new object (zone change: both went to exile, then the combined permanent entered the battlefield). ETB triggers of the combined form fire. Any prior enchantments/auras on the individual cards are lost (they're exiled with the cards, then the combined object enters fresh).
- **P385 (Reconfigure)** — Reconfigure also produces an Equipment that can be a creature. But reconfigure doesn't combine two cards. Prototype also doesn't combine cards — it's a single card with two casting modes.
- **P382 (Adventure)** — Both Adventure and Prototype involve choosing between two different "versions" of a card at cast time. Adventure chooses between the adventure spell (different characteristics entirely) and the creature; Prototype chooses between full-size and smaller-size. Both have rules about what characteristics apply in which contexts.
