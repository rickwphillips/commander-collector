---
id: p430
name: Rebound, Umbra Armor, and Annihilator — Zendikar/Eldrazi Delayed Cast, Aura Shield, and Forced Sacrifice
category: triggered
cr_refs: [702.88a, 702.88b, 702.88c, 702.89a, 702.89b, 702.86a, 702.86b, 702.16k, 702.16l]
tags: [rebound, umbra-armor, totem-armor, annihilator, delayed-trigger, cast-from-hand-condition, exile-on-resolve, destroy-aura-instead, forced-sacrifice, annihilator-stacking, Rite-of-Replication, Gitaxian-Probe, Permeating-Mass, Kor-Spiritdancer, Eldrazi, Emrakul, Ulamog, Kozilek, annihilator-defense, umbra-enchantment-shield, rebound-no-flashback, Zendikar, Rise-of-the-Eldrazi]
created: 2026-03-29
examples_count: 2
---

# P430 — Rebound, Umbra Armor, and Annihilator — Zendikar/Eldrazi Delayed Cast, Aura Shield, and Forced Sacrifice

## Abstract
**Rebound** (702.88) exiles a spell that was cast from hand and lets you cast it for free at the start of your next upkeep. **Umbra Armor** (702.89, formerly "totem armor") is an Aura ability that redirects a destruction effect aimed at the enchanted permanent to destroy the Aura instead. **Annihilator** (702.86) triggers on attack and forces the defending player to sacrifice permanents. Key non-obvious interactions: (1) **rebound only fires if the spell was cast from hand** — copying or flashing back a rebound spell doesn't re-exile it; (2) **rebound's delayed trigger is optional** at your upkeep ("you may cast"); (3) **umbra armor replaces destruction** — it doesn't prevent damage, exile, -1/-1 counters, or "sacrifice"; (4) **annihilator triggers for each attacking creature** — two creatures with annihilator 2 each trigger, forcing 4 sacrifices total; and (5) **annihilator happens before damage** — the defending player sacrifices lands/blockers before damage, potentially removing their own blockers.

## The Definitive Rules

**CR 702.88a** (verbatim): *"Rebound appears on some instants and sorceries. It represents a static ability that functions while the spell is on the stack and may create a delayed triggered ability. 'Rebound' means 'If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.'"*

**CR 702.88b** (verbatim): *"Casting a spell as an effect of its rebound ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.89a** (verbatim): *"Umbra armor is a static ability that appears on some Auras. 'Umbra armor' means 'If enchanted permanent would be destroyed, instead remove all damage marked on it and destroy this Aura.'"*

**CR 702.86a** (verbatim): *"Annihilator is a triggered ability. 'Annihilator N' means 'Whenever this creature attacks, defending player sacrifices N permanents.'"*

**CR 702.86b** (verbatim): *"If a creature has multiple instances of annihilator, each triggers separately."*

## The Pattern

```
REBOUND (702.88a):
  TWO EFFECTS:
    1. Static ability (while on stack): "if this spell was cast from your hand, instead of
       putting it into your GY as it resolves, exile it."
       — This is a replacement: the spell goes to exile instead of GY on resolution.
    2. Delayed triggered ability (created at resolution): "at the beginning of your next
       upkeep, you may cast this card from exile without paying its mana cost."

  KEY RULE: "IF THIS SPELL WAS CAST FROM YOUR HAND":
    Rebound only fires if the spell was cast from hand.
    If cast via flashback (from GY): rebound does NOT exile it. Goes to GY.
    If cast from cascade (from exile): rebound does NOT apply. Goes to GY after resolving.
    If cast via jump-start or other GY mechanisms: no rebound.
    If a COPY of the rebound spell resolves: the copy was not "cast from hand" (it was put
      on stack via copy effect). Rebound doesn't apply to copies. Copy goes to... copies
      cease to exist when leaving the stack (CR 704.5e). It disappears.
    EXCEPTION: if you COPY A REBOUND SPELL BEFORE IT RESOLVES and CAST the copy from your hand
      somehow? No — you can't cast a copy from your hand; you put it on the stack directly.
    SUMMARY: Rebound applies ONLY to the original cast from hand.

  REBOUND'S UPKEEP CAST IS OPTIONAL:
    "You may cast this card from exile without paying its mana cost."
    "May" = optional. You don't have to cast it. The card stays in exile if you don't.
    If you don't cast it at upkeep: the card remains in exile permanently (no second chance).
    The delayed trigger fires once (at the beginning of your next upkeep) and that's it.
    If you miss the window (don't cast when the trigger is on the stack): card exiled forever.

  REBOUND AND EXILE REPLACEMENT:
    If something would redirect the rebound card from exile (e.g., Relic of Progenitus exiles
    all GY cards): that's irrelevant — the card never went to the GY. It went straight to exile.
    Rest in Peace: "whenever a card is put into a graveyard from anywhere, exile it instead."
    If Rest in Peace is in play when a rebound spell resolves: the rebound replacement fires
    first (from the spell's own text) — "instead of putting it into your GY, exile it." Self-
    replacement effects apply before other replacements (CR 614.15). So rebound happens first,
    the spell goes to exile, and RIP's replacement doesn't apply (it was never going to the GY).
    Result: RIP doesn't prevent rebound. The rebound card goes to exile normally.
    WAIT: actually, does the rebound self-replacement prevent RIP from applying? CR 614.15 says
    self-replacement effects apply first. The rebound replacement IS a self-replacement (applies
    to the spell that has rebound). So yes: rebound's exile fires, not RIP's.
    CONFIRMED: Rest in Peace doesn't stop rebound.

  REBOUND AND GRAFDIGGER'S CAGE:
    Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
    Rebound's second cast is from exile. Cage restricts GY/library only.
    Cage does NOT stop the rebound cast from exile. (Same as suspend, cascade, hideaway.)

  REBOUND ADDITIONAL COSTS:
    The upkeep cast is "without paying its mana cost" = alternative cost.
    Additional costs (kicker, splice, conspire) can still be paid (same principle as P427).

UMBRA ARMOR (702.89a):
  "If enchanted permanent would be destroyed, instead remove all damage marked on it
   and destroy this Aura."

  WHAT UMBRA ARMOR PREVENTS:
    Destruction. "Would be destroyed" specifically.
    Examples of destruction: Doom Blade, Wrath of God, "destroy all creatures," lethal damage
      (after damage step, SBA applies: creature with damage ≥ toughness is destroyed).
    Umbra armor replaces the destruction event: the permanent isn't destroyed; the Aura is
      destroyed instead; all damage marked on the permanent is removed.

  WHAT UMBRA ARMOR DOES NOT PREVENT:
    EXILE: Path to Exile, Swords to Plowshares, Oblivion Ring. These exile, not destroy.
      Umbra armor says "would be destroyed" — exile is not destruction. Umbra armor doesn't fire.
    SACRIFICE: Edict effects (Innocent Blood: each player sacrifices a creature), commander tax,
      forced sacrifice from annihilator. "Sacrifice" is distinct from "destroy."
    -1/-1 COUNTERS: wither/infect reducing toughness to 0. The creature's toughness reaches 0 →
      SBA 704.5f: creature with toughness ≤ 0 is put into GY. This is NOT a destruction event.
      704.5f: "regeneration can't replace this event" — same reasoning applies to umbra armor:
      umbra armor applies to "would be destroyed," not "toughness ≤ 0" SBA.
      RESULT: umbra armor doesn't save a creature killed by -1/-1 counters reducing toughness to 0.
    LETHAL DAMAGE (NORMALLY): lethal damage → SBA 704.5g: creature with damage ≥ toughness is
      destroyed. This IS a destruction event. Umbra armor CAN replace this (it's "would be
      destroyed"). All damage is removed, Aura is destroyed. Creature survives lethal damage.

  MULTIPLE UMBRA ARMOR AURAS:
    If a creature has multiple Auras with umbra armor: when it would be destroyed, one umbra
      armor fires (one Aura is destroyed, all damage removed). The creature survives.
    A second destruction effect: another umbra armor fires. Second Aura destroyed.
    Each umbra armor protects once. N Auras with umbra armor = N "lives" for the creature.

  UMBRA ARMOR AND COMMANDER DAMAGE:
    In Commander, if a creature would be destroyed by lethal commander damage:
    Umbra armor applies. Aura is destroyed instead. Commander damage is still tracked
    (damage was dealt; only the destruction was replaced). The next 21 commander damage from
    that source still kills.
    Wait: commander damage: 21 combat damage from the same commander causes the player to lose.
    This is a player-level rule (a player loses), not a creature destruction event.
    Umbra armor on a creature doesn't affect the player losing to commander damage.
    Different direction: umbra armor protects the ENCHANTED PERMANENT from being destroyed.
    Commander damage rule kills the PLAYER, not the creature. Umbra armor doesn't apply.

ANNIHILATOR (702.86a):
  "Whenever this creature attacks, defending player sacrifices N permanents."

  TRIGGERED ABILITY — FIRES ON ATTACK:
    Triggers when the annihilator creature is declared as an attacker.
    NOT at damage. NOT when blocking is declared. When attacking is declared.
    The defending player sacrifices N permanents. This happens BEFORE blocking, BEFORE damage.
    (The trigger resolves in the "declare attackers" step, before "declare blockers".)
    Wait — triggers fire, then priority is given. In "declare attackers step": attackers are
    declared (turn-based action), then triggers go on stack, then priority. Annihilator trigger
    goes on stack in declare attackers step. Players can respond. When it resolves: sacrifice N.
    This is BEFORE the defending player declares blockers.
    RESULT: the defending player may be forced to sacrifice their potential blockers before they
      can declare blocks. The 7/7 attacker may be facing no blockers after annihilator resolves.

  MULTIPLE ANNIHILATOR:
    702.86b: multiple instances trigger separately.
    If a creature has Annihilator 1 and Annihilator 2 (from two sources): TWO triggers.
      One triggers for Annihilator 1 (sacrifice 1 permanent), one for Annihilator 2 (sacrifice 2).
      Total: 3 permanents sacrificed.
    Multiple attacking annihilator creatures: each triggers.
      Emrakul (Annihilator 6) + two other annihilator creatures (Annihilator 2 each):
      Three separate triggers. Defending player sacrifices 6 + 2 + 2 = 10 permanents.
      This can be lethal to a player's board even before damage.

  ANNIHILATOR AND CHOICE:
    The defending player CHOOSES which permanents to sacrifice.
    They can sacrifice lands, creatures, enchantments — any permanents.
    Strategic choice: sacrifice lands to stay alive (tempo loss) vs. creatures (lose blockers).
    If the defending player can't sacrifice N (has fewer than N permanents): sacrifice all.
      There's no "can't sacrifice enough" penalty; they sacrifice as many as possible.
    Wait: "sacrifices N permanents" — if the player has fewer than N permanents, they sacrifice
      all of them. The trigger resolves with maximum available.

  ANNIHILATOR AND PROTECTION/HEXPROOF:
    Annihilator says "defending player sacrifices N permanents." This is not targeted.
    Hexproof prevents targeting. Annihilator doesn't target. Hexproof doesn't help.
    Shroud: same — annihilator doesn't target. Shroud doesn't help.
    Protection from X: annihilator doesn't "target" the permanents being sacrificed. Also doesn't
      deal damage. Protection doesn't prevent annihilator sacrifice.
    No ability on the attacking creature helps the defender avoid annihilator.
    The only way to avoid annihilator sacrifice: prevent the attack from happening (kill the
      annihilator creature before it attacks, or prevent it from being declared as an attacker).

  ANNIHILATOR IN MULTIPLAYER:
    "Defending player" = the player being attacked.
    In multiplayer, if the annihilator creature attacks Player A: Player A sacrifices N.
    If it attacks Player B: Player B sacrifices N.
    If you attack multiple players simultaneously (usually not possible in standard combat
      without special rules): each "defending player" for each attacker.
    Normally, each attacker attacks one player; annihilator applies to that one player.
```

## Definitive Conclusions

- **Rebound only exiles if the spell was cast from hand** — flashback, cascade, or copy effects don't trigger rebound; the spell goes to GY (or ceases to exist if a copy); only the original hand cast qualifies.
- **Rest in Peace doesn't stop rebound** — rebound is a self-replacement effect (CR 614.15) that applies before RIP's replacement; the spell goes to exile via rebound first.
- **Umbra armor protects against destruction, not exile or sacrifice** — "would be destroyed" is narrowly defined; exile effects (Path to Exile), sacrifice effects (annihilator), and toughness-reduction deaths (wither) bypass umbra armor.
- **Umbra armor saves a creature from lethal damage by destroying the Aura and removing all marked damage** — the creature survives at 0 marked damage; the Aura is sacrificed; multiple umbra armor Auras each provide one protection.
- **Annihilator triggers resolve before blockers are declared** — the defending player sacrifices N permanents (which may include would-be blockers) before they can assign blockers; annihilator can eliminate blocker options.
- **Multiple annihilator creatures or instances each trigger independently** — two annihilator 2 creatures attacking means two triggers, four total permanents sacrificed before damage.

## Canonical Example
**Rite of Replication + Rebound:**
You cast Rite of Replication ({2}{U}{U}: Sorcery; "put a token that's a copy of target creature onto the battlefield. Kicker {5}: put five such token copies instead") from your hand. Let's say you also cast a rebound spell — Distortion Strike ({U}: Sorcery; "target creature gets +1/+0 until EOT; that creature is unblockable until EOT; Rebound").

Cast Distortion Strike targeting your Emrakul.
Rebound: "this spell was cast from your hand" → YES. At resolution, exile Distortion Strike instead
  of putting it in GY. Delayed trigger created: "at beginning of your next upkeep, you may cast
  Distortion Strike from exile without paying its mana cost."
Distortion Strike resolves: Emrakul gets +1/+0 and unblockable until EOT.

Your next upkeep: rebound trigger fires. "You may cast Distortion Strike from exile."
You cast it again for free (no {U} needed). Target Emrakul again.
Emrakul gets +1/+0 and unblockable again for this turn.
Distortion Strike goes to GY (it was cast from exile, not hand; rebound doesn't apply → GY).

Result: two turns of Emrakul being unblockable for one {U} total. Rebound doubled the spell's utility.

**Example 2 — Umbra Armor vs. Wrath of God + Annihilator:**
Your creature: Emrakul, the Aeons Torn (15/15; annihilator 6; flying; protection from colored spells; etc.)
Wait — Emrakul can't have Auras (protection from colored spells prevents colored Aura attachment).
Use a more practical creature.

Your creature: Garruk's Packleader ({4}{G}: 4/4), enchanted with Snake Umbra (Aura; +1/+1; "whenever enchanted creature deals combat damage to a player, draw a card"; Umbra Armor).
Opponent casts Wrath of God: "destroy all creatures."
Wrath would destroy Garruk's Packleader (4/4).
Umbra Armor fires: "if enchanted permanent would be destroyed, instead remove all damage marked on it and destroy this Aura."
Wrath's destruction is replaced: Snake Umbra is destroyed. Garruk's Packleader survives (no damage marked now).

Opponent tries to follow up with Swords to Plowshares targeting Garruk's Packleader.
Swords EXILES, not destroys. Umbra armor says "would be destroyed" — not "would be exiled."
Umbra armor does NOT apply. Garruk's Packleader is exiled.

Annihilator example:
Cast Emrakul, the Promised End (13/13; annihilator doesn't apply here; has another trigger).
Use It That Betrays (11/11; annihilator 2; "whenever an opponent sacrifices a permanent, put that card onto the battlefield under your control"):
It That Betrays attacks. Annihilator 2 trigger fires.
Defending player must sacrifice 2 permanents BEFORE blockers.
But "whenever an opponent sacrifices a permanent": those sacrificed permanents come to YOUR side.
Annihilator forces sacrifice; It That Betrays steals everything sacrificed. Net: defender sacrifices
2 permanents, you gain 2 permanents, then the 11/11 attacks into a weakened board.

## Commonly Confused With
- **P408 (Flashback)** — Flashback casts from GY without rebound. Rebound casts from exile on next upkeep. Both are "cast again" effects but from different zones and with different conditions ("cast from hand" for rebound; "cast from GY" for flashback).
- **P427 (Cascade + Additional Costs)** — Rebound's upkeep cast is "without paying mana cost" (alternative cost) — additional costs (kicker, splice) can still be paid per P427's principle.
- **P414 (Clone + Face-Down)** — Umbra armor on a face-down morph: if the morph would be destroyed, umbra armor fires, Aura is destroyed instead. The face-down creature retains its face-down state. This is a legitimate use case for umbra armor Auras on morph creatures.
- **P428 (Wither/Infect)** — Umbra armor doesn't protect against wither/infect reducing toughness to 0 (SBA 704.5f, not destruction). P428 covers this in detail.
