---
id: p353
name: Protection, Damage Prevention, and Regeneration — DEBT Acronym, Prevention Effects, and Regeneration Shields
category: combat
cr_refs: [702.16a, 702.16b, 702.16c, 702.16d, 702.16e, 702.16f, 702.16j, 615.1, 615.4, 615.6, 615.12, 701.19a, 701.19b, 701.19c, 614.8]
tags: [protection, damage-prevention, regenerate, DEBT-acronym, shroud, hexproof, unblockable, prevention-effect, Sword-of-Fire-and-Ice, Darksteel-Colossus, Teferi-protection, Progenitus, Rootborn-Defenses, Boros-Charm-indestructible, Angel-of-Jubilation, pro-from-everything, unpreventable-damage]
created: 2026-03-29
examples_count: 2
---

# P353 — Protection, Damage Prevention, and Regeneration — DEBT Acronym, Prevention Effects, and Regeneration Shields

## Abstract
**Protection** is a multi-function keyword remembered by the acronym **DEBT**: a permanent with protection from quality X can't be **D**amaged (damage prevented), **E**nchanted/equipped by X, **B**locked by X, or **T**argeted by X. Protection is both a targeting restriction AND a prevention effect AND a blocking restriction AND an attachment restriction (702.16b–f). **Damage prevention effects** (rule 615) are shields that intercept damage events before they happen — they don't apply retroactively (615.4). **Regeneration** (701.19) is a replacement effect replacing "destroy" with "remove damage, tap, remove from combat" — regenerating does NOT prevent toughness-0 death, sacrifice, or exile. Some damage is **unpreventable** (615.12) and prevention effects don't apply to it, but they don't loop trying to apply repeatedly.

## The Definitive Rules

**CR 702.16e** (verbatim): *"Any damage that would be dealt by sources that have the stated quality to a permanent or player with protection is prevented."*

**CR 702.16b** (verbatim): *"A permanent or player with protection can't be targeted by spells with the stated quality and can't be targeted by abilities from a source with the stated quality."*

**CR 702.16c** (verbatim): *"A permanent or player with protection can't be enchanted by Auras that have the stated quality. Such Auras attached to the permanent or player with protection will be put into their owners' graveyards as a state-based action."*

**CR 702.16f** (verbatim): *"Attacking creatures with protection can't be blocked by creatures that have the stated quality."*

**CR 702.16j** (verbatim): *"'Protection from everything' is a variant of the protection ability. A permanent or player with protection from everything has protection from each object regardless of that object's characteristic values. Such a permanent or player can't be targeted by spells or abilities and can't be enchanted by Auras. Such a permanent can't be equipped by Equipment, fortified by Fortifications, or blocked by creatures. All damage that would be dealt to such a permanent or player is prevented."*

**CR 615.1** (verbatim): *"Some continuous effects are prevention effects. Like replacement effects (see rule 614), prevention effects apply continuously as events happen—they aren't locked in ahead of time. Such effects watch for a damage event that would happen and completely or partially prevent the damage that would be dealt. They act like 'shields' around whatever they're affecting."*

**CR 615.6** (verbatim): *"If damage that would be dealt is prevented, it never happens. A modified event may occur instead, which may in turn trigger abilities."*

**CR 615.12** (verbatim): *"Some effects state that damage 'can't be prevented.' If unpreventable damage would be dealt, any applicable prevention effects are still applied to it. Those effects won't prevent any damage, but any additional effects they have will take place. Existing damage prevention shields won't be reduced by damage that can't be prevented."*

**CR 701.19a** (verbatim): *"If the effect of a resolving spell or ability regenerates a permanent, it creates a replacement effect that protects the permanent the next time it would be destroyed this turn. In this case, 'Regenerate [permanent]' means 'The next time [permanent] would be destroyed this turn, instead remove all damage marked on it and its controller taps it. If it's an attacking or blocking creature, remove it from combat.'"*

## The Pattern

```
PROTECTION — THE DEBT ACRONYM (702.16):
  Remember: protection from X means the protected permanent/player:
    D — can't be DAMAGED by sources with X (damage is prevented, 702.16e)
    E — can't be ENCHANTED/EQUIPPED by permanents with X (702.16c, 702.16d)
    B — can't be BLOCKED by creatures with X (702.16f)
    T — can't be TARGETED by spells/abilities with X (702.16b)

  ALL FOUR apply simultaneously. Protection isn't just "can't be targeted."

  EXAMPLES:
    Sword of Fire and Ice ({3}): equipped creature gains protection from red and blue.
    D: Red/blue sources deal 0 damage to equipped creature (prevented).
    E: Red/blue Auras fall off. Red/blue Equipment can't attach.
    B: Red/blue creatures can't block the equipped attacker.
    T: Red/blue spells/abilities can't target it.
    So: Lightning Bolt (red instant) can't target it, AND if it could, damage prevented.
    Blue Wall of Air (blue creature) can't block it.
    But: a green creature CAN still block it. A white damage spell CAN target it.

  PROTECTION DOESN'T PREVENT:
    - Sacrifice (sacrifice isn't damage or targeting)
    - Board wipes that don't target and deal damage (Wrath of God: "destroy all creatures" — not damage)
    - Proliferate (not damage or targeting)
    - -X/-X global effects (not damage, not targeting — it's a continuous effect)
    - Spreading Plague type effects that use "destroy" without damage

  PROTECTION FROM EVERYTHING (702.16j):
    "Can't be targeted by spells or abilities, can't be enchanted, can't be equipped,
      can't be blocked, all damage prevented."
    Example: Progenitus ({W}{W}{U}{U}{B}{B}{R}{R}{G}{G}): 10/10 "Protection from everything."
    It can't be targeted, enchanted, equipped, or blocked.
    All damage to it is prevented.
    BUT: Progenitus CAN be killed by:
      - Sacrifice effects ("target player sacrifices a creature" - if Progenitus controls target player)
        Wait: that targets a PLAYER, not Progenitus. Player sacrifices. Progenitus can be chosen.
      - Non-targeting board wipes ("destroy all creatures", "exile all creatures")
        Wrath of God doesn't target and doesn't deal damage — kills Progenitus.
        Merciless Eviction (exile all creatures): doesn't target, doesn't damage. Works.
      - Tuck effects that put it into the library (non-targeting, non-damage).
    The protection keyword specifically lists what it prevents. Other game actions still apply.

  PROTECTION AND AURAS (702.16c):
    If a permanent gains protection from an Aura's color AFTER the Aura is already attached:
      The Aura is put into its owner's GY as an SBA.
      Protection retroactively detaches attached Auras.
    Example: Enchant creature X with Pacifism (white Aura). Then give X "protection from white."
      Pacifism immediately falls off (SBA). X is free.
    EXCEPTION (702.16n): Some Auras say "this effect doesn't remove [this Aura]."
      Specifying exception allows the Aura to stay despite protection.

DAMAGE PREVENTION EFFECTS (615):
  WHAT THEY ARE:
    Replacement effects that substitute "0 damage" for "N damage."
    "Prevent all damage that would be dealt to [X] this turn."
    "Prevent the next 3 damage that would be dealt to target creature or player."
  MUST EXIST BEFORE THE DAMAGE EVENT (615.4):
    You can't cast a prevention spell AFTER damage has been dealt.
    "Prevent the next 3 damage" cast while Lava Axe is on the stack (before it resolves):
      The prevention shield exists when Lava Axe resolves.
      When Lava Axe would deal 5 damage, prevention applies: prevent 3, deal 2.
  IF DAMAGE IS PREVENTED: IT NEVER HAPPENS (615.6):
    Prevented damage doesn't trigger "whenever X damage is dealt" abilities.
    Prevented damage doesn't trigger lifelink (nothing was dealt).
    Prevented damage doesn't trigger deathtouch SBA (no damage dealt).
    Wait: protection prevents ALL damage. Lifelink creature blocked by protection creature:
      Lifelink damage to protected creature: prevented. No damage dealt. No life gained.
      Hmm: lifelink is based on damage dealt BY the lifelink source, not damage received.
      Let me clarify: if a lifelink creature is blocked by a protection creature:
        The lifelink creature deals damage to the BLOCKER (blocker doesn't have protection).
        The blocker deals damage to the lifelink creature.
        Lifelink: creature's controller gains life equal to damage dealt BY the lifelink creature.
        The lifelink creature dealt damage to the blocker. That's what causes life gain.
        So: lifelink still triggers from damage the creature DEALS (not receives).
      BUT: if the attacker with lifelink attacks a creature with protection from the attacker's color:
        Attacker deals 0 (prevented). Lifelink: 0 damage dealt = 0 life gained.
  UNPREVENTABLE DAMAGE (615.12):
    Effects that say damage "can't be prevented":
      Example: Skullcrack ({1}{R}): "Players can't gain life this turn. Damage can't be prevented."
      Prevention effects still "apply" but prevent 0 damage (no effect).
      Prevention shields aren't depleted by unpreventable damage.

REGENERATION (701.19):
  WHAT IT DOES:
    Regeneration is a REPLACEMENT EFFECT (614.8).
    "The next time [permanent] would be DESTROYED this turn:
      INSTEAD: remove all damage, tap it, remove from combat if attacking/blocking."
    The permanent DOESN'T die. It stays on battlefield, tapped, cleared of damage.
  WHAT IT DOESN'T DO:
    1. Doesn't prevent toughness-zero death (SBA 704.5f: toughness ≤ 0 = GY — not "destroyed").
       "-X/-X" effects that bring toughness to 0: creature goes to GY. Regeneration can't stop it.
    2. Doesn't stop exile. Exile isn't "destroy." Regeneration can't stop Path to Exile.
    3. Doesn't stop sacrifice. "Sacrifice" isn't "destroy" (701.21a explicitly states this).
       Altar of Dementia sacrificing a creature: regeneration can't save it.
    4. Can't be applied to the same destruction event twice. Once used, the regeneration shield expires.
  ACTIVATING REGENERATION (701.19c):
    Activating a regeneration ability ≠ regenerating the creature.
    The activation creates a SHIELD (replacement effect in waiting).
    Effects that say "can't be regenerated" don't stop the activation — they just prevent the shield from applying.
    Common confusion: players think "target creature can't regenerate this turn" stops you from
      ACTIVATING the ability. No: you can still activate, but the regeneration shield won't apply.

COMBINING PROTECTION AND REGENERATION:
  Protection prevents damage (D). If something bypasses protection (e.g., Wrath: not damage, not targeting):
    Wrath says "destroy all creatures." No targeting, no damage.
    Protection doesn't help. The creature is "destroyed."
    Regeneration can save it here: the destruction is replaced with the regeneration effect.
  Example: Darksteel Colossus ({11}): 11/11 indestructible.
    "Indestructible" prevents destruction SBAs. It can't be destroyed.
    Can't be regenerated (has indestructible: it's never destroyed to need regenerating).
    But: it CAN be exiled, it CAN be sacrificed.
  Example: Mistcutter Hydra ({X}{G}): "Haste, protection from blue."
    Counterspell can't target it? WAIT: protection is about targeting. A spell on the stack targeting
      the Hydra: it's already on the stack, not a permanent with protection.
    Actually: Mistcutter Hydra has protection from blue — it's a permanent (after it resolves and enters).
    While it's a SPELL on the stack: protection doesn't apply (protections are static abilities on permanents).
    Counterspell can counter it while it's a spell on the stack.
    Once it's on the battlefield as a permanent: protection from blue applies.
    Then: blue spells CAN'T target the permanent Hydra.
```

## Definitive Conclusions

- **Protection = DEBT** — Damage prevented, Enchanted/Equipped forbidden (attached Auras fall off), Blocked forbidden (by quality creatures), Targeted forbidden.
- **Protection doesn't stop everything** — non-targeting, non-damage effects (Wrath, exile spells, proliferate, -X/-X) still affect protected permanents.
- **Prevented damage never happens** — it doesn't trigger lifelink, deathtouch, "whenever X damage" effects, or anything dependent on damage being dealt.
- **Regeneration replaces destruction only** — doesn't stop exile, sacrifice, toughness-0, or other non-destroy kill methods.
- **Regeneration shields don't stop abilities from being activated** — "can't be regenerated" prevents the replacement from applying, not the activation.
- **Unpreventable damage depletes prevention shields by 0** — shields remain intact when "can't be prevented" damage hits; the shield doesn't break.
- **Protection from everything prevents all damage** but still susceptible to non-damage, non-targeting kills.

## Canonical Example
**Sword of Fire and Ice — All Four DEBT Elements:**
You equip Sword of Fire and Ice ({3}) on your 3/3 Grizzly Bears ({1}{G}). The equipped creature gains +2/+2 and protection from red and blue.

Your creature: 5/5 with protection from red and blue.

Opponent has:
  Lightning Bolt (red instant): "deal 3 damage to any target" → can't target your creature (T) AND would be prevented anyway (D).
  Counterspell (blue instant): can't counter your creature spells that are permanents (it's already on the battlefield; protection applies to permanent, not spell on stack). But could have countered it while it was a spell being cast.
  Icy Manipulator ({4}): "{1}, {T}: tap target artifact, creature, or land" — Icy itself is colorless. Its ABILITY is from an artifact (colorless). Protection from blue doesn't prevent colorless abilities from targeting. Icy CAN tap your creature.
  Wait: is the Icy Manipulator blue? It has no color. Colorless. Your creature has protection from RED AND BLUE only — not colorless. So colorless abilities can target it.
  Blue creature blocker (Merfolk Looter {1}{U}): can't block your creature (B — can't be blocked by blue creatures). Your creature attacks freely through blue blockers.
  Animate Enchantment (blue Aura): can't enchant your creature (E). If it's already attached (somehow): falls off as SBA.

ATTACK:
  Declare creature as attacker. Sword triggers: "when equipped creature deals combat damage to a player, it deals 2 damage to any target and you draw a card."
  Unblocked (opponent has only blue blockers): deals 5 damage to opponent. Sword triggers → 2 more damage to any target (including planeswalkers), draw a card.

**Example 2 — Regeneration vs. Wrath of God and Exile:**
You control a 4/4 Troll creature with "{G}: Regenerate this creature." Board state:
  Opponent casts Wrath of God ({2}{W}{W}): "Destroy all creatures. They can't be regenerated."

This is important: "They can't be regenerated."
Per 701.19c: this doesn't stop you from activating the regeneration ability. It prevents the regeneration shield from applying.

But actually — Wrath of God specifically says "can't be regenerated." So the regeneration SHIELD won't apply when destruction would occur. The Troll dies.

If opponent cast Wrath of God WITHOUT the "can't be regenerated" clause:
  Before Wrath resolves, you activate "{G}: Regenerate this creature."
  Regeneration shield is created.
  Wrath resolves: "destroy all creatures."
  Troll would be destroyed. Replacement effect: instead, remove all damage, tap, remove from combat.
  Troll survives! (Tapped, but on the battlefield.)

Now opponent casts Merciless Eviction ({4}{W}{B}): "Choose one — Exile all artifacts; exile all creatures..."
  Chosen: exile all creatures.
  "Exile" ≠ "destroy." Regeneration doesn't apply to exile.
  Troll is exiled. The regeneration shield in waiting: never triggers (the replacement is for "when destroyed," and exile isn't destruction).
  Troll goes to exile. Gone.

Now consider Assassin's Trophy ({B}{G}): "Destroy target permanent. Its controller searches for a basic land and puts it into play tapped."
  Targeting: the Troll (not protected unless it has protection from green or black).
  "Destroy": regeneration CAN apply (it's destruction).
  Activate regeneration first. Assassin's Trophy resolves: would destroy Troll.
  Regeneration shield: instead remove damage, tap, remove from combat. Troll survives.
  Opponent's basic land search still happens (the Trophy's "its controller searches" is a separate effect — it doesn't say "if the creature is destroyed." It's an unconditional additional effect).

## Commonly Confused With
- **P352 (Lifelink/Deathtouch)** — Deathtouch damage destroyed by protection: if protection prevents the damage from being dealt, deathtouch doesn't fire its SBA. The SBA requires damage to be "dealt" — prevented damage was never dealt.
- **P002 (Replacement Effects)** — Regeneration is a replacement effect (614.8). It replaces "destroy" with an alternate sequence. Understanding regeneration requires understanding replacement effect mechanics: the regeneration shield is a "standing replacement" that watches for destruction events.
- **P335 (Indestructible)** — Indestructible and regeneration both prevent destruction, but differently. Indestructible is a static characteristic that makes destruction SBAs not apply. Regeneration is a replacement effect that fires when destruction would occur and substitutes an alternate outcome. An indestructible creature can't be regenerated (nothing to replace — it's never "about to be destroyed"). A creature with regeneration available can be destroyed if no regeneration shield is active.
- **P008 ("Can't" Restrictions)** — Protection's restrictions (can't target, can't block, etc.) follow P008's "can't" vs. "may" logic. "Can't be targeted" is an absolute prohibition, even if an effect says "may target any creature" — the prohibition overrides.
