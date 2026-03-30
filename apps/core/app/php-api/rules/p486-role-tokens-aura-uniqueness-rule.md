---
id: p486
name: Role Tokens — Aura Uniqueness Rule
category: tokens
cr_refs: [704.5q, 303.4, 400.7, 706.2, 115.1]
tags: [role-token, aura, enchantment, token, state-based-action, uniqueness, wilds-of-eldraine, WOE, blink, copy, doubling-season, protection, hexproof, cursed, monster, royal, sorcerer, wicked, virtuous, young-hero]
created: 2026-03-29
examples_count: 6
---

# P488 — Role Tokens — Aura Uniqueness Rule

## Abstract

Role tokens are colorless Enchantment — Aura Role tokens introduced in Wilds of Eldraine (WOE, 2023). There are seven named Roles: Cursed, Monster, Royal, Sorcerer, Wicked, Young Hero, and Virtuous (Commander). Each Role is an Aura that enchants a creature and grants it different bonuses. The key uniqueness rule: **a player may not control two Roles attached to the same creature simultaneously**. When a second Role would attach, the older one is put into the graveyard as a state-based action. Different Roles from different players CAN coexist on the same creature. Multiple different-named Roles from the same player do NOT both stay — only the most recent survives. A creature can hold at most one Role per controlling player.

## The Definitive Rule

**CR 704.5q**: If a player controls two Roles attached to the same permanent, all but the one with the most recent timestamp are put into the owner's graveyard. This is a state-based action checked continuously.

**Official Rulings (2023-09-01)**:
- "Roles are colorless enchantment tokens. Each one has the Aura and Role subtypes and the enchant creature ability."
- "If a permanent has more than one Role attached to it controlled by the same player, each of those Roles except the one with the most recent timestamp is put into its owner's graveyard. This is a state-based action."
- "If two or more Roles controlled by the same player become attached to a permanent at the same time (perhaps due to an effect such as that of Doubling Season), that player chooses which one to keep and which are put into their owners' graveyards."
- "A permanent can have multiple Roles attached to it if each one is controlled by a different player."
- "Hexproof and shroud won't prevent a Role from becoming attached to a permanent if the ability creating that Role attached to that permanent doesn't target it."
- "Cards in the Wilds of Eldraine main set create six different Role tokens: Cursed, Monster, Royal, Sorcerer, Wicked, and Young Hero. A seventh Role token, Virtuous, is created by Ellivere of the Wild Court."

## All Seven Role Tokens (Full Oracle Text)

| Role | Oracle Text |
|------|-------------|
| **Cursed** | Enchant creature / Enchanted creature has base power and toughness 1/1. |
| **Monster** | Enchant creature / Enchanted creature gets +1/+1 and has trample. |
| **Royal** | Enchant creature / Enchanted creature gets +1/+1 and has ward {1}. |
| **Sorcerer** | Enchant creature / Enchanted creature gets +1/+1 and has "Whenever this creature attacks, scry 1." |
| **Wicked** | Enchant creature / Enchanted creature gets +1/+1. / When this Aura is put into a graveyard from the battlefield, each opponent loses 1 life. |
| **Young Hero** | Enchant creature / Enchanted creature has "Whenever this creature attacks, if its toughness is 3 or less, put a +1/+1 counter on it." |
| **Virtuous** | Enchant creature / Enchanted creature gets +1/+1 for each enchantment you control. |

## Key Cards

**Monstrous Rage** `{R}`
> Target creature gets +2/+0 until end of turn. Create a Monster Role token attached to it. (If you control another Role on it, put that one into the graveyard. Enchanted creature gets +1/+1 and has trample.)

**Ellivere of the Wild Court** `{2}{G}{W}`
> Whenever Ellivere enters or attacks, create a Virtuous Role token attached to another target creature you control. (If you control another Role on it, put that one into the graveyard. Enchanted creature gets +1/+1 for each enchantment you control.)
> Whenever an enchanted creature you control deals combat damage to a player, draw a card.

**Faunsbane Troll** `{2}{B}{G}`
> When this creature enters, create a Monster Role token attached to it. (Enchanted creature gets +1/+1 and has trample.)
> {1}, Sacrifice an Aura attached to this creature: This creature fights target creature you don't control. If that creature would die this turn, exile it instead. Activate only as a sorcery.

**Twisted Sewer-Witch** `{3}{B}{B}`
> When this creature enters, create a 1/1 black Rat creature token with "This creature can't block." Then for each Rat you control, create a Wicked Role token attached to that Rat. (If you control another Role on it, put that one into the graveyard. Enchanted creature gets +1/+1. When this token is put into a graveyard, each opponent loses 1 life.)

**Not Dead After All** `{B}`
> Until end of turn, target creature you control gains "When this creature dies, return it to the battlefield tapped under its owner's control, then create a Wicked Role token attached to it."

**Asinine Antics** `{2}{U}{U}`
> You may cast this spell as though it had flash if you pay {2} more to cast it.
> For each creature your opponents control, create a Cursed Role token attached to that creature. (If you control another Role on it, put that one into the graveyard. Enchanted creature has base power and toughness 1/1.)

## The Pattern

```
ROLE UNIQUENESS — PER PLAYER:
  A player may not control more than one Role on the same creature.
  State-based action (CR 704.5q) checks this continuously.

  Player A attaches Monster Role to Creature X.
  Player A then attaches Royal Role to Creature X.
  → SBA: Player A controls two Roles on X → older one (Monster) goes to graveyard.
  → Result: only the Royal Role remains.

  NOTE: Name does NOT matter for the uniqueness rule.
    A Monster Role and a Royal Role from the same player are still "two Roles from same player."
    The rule is per-player, not per-name.

SIMULTANEOUS ROLE CREATION (Doubling Season):
  If two Roles are created for the same player at the same time
    (e.g., Doubling Season doubles a single-Role creation event)
    → The controlling player chooses which one to keep.
    → The other goes to the graveyard as a state-based action.
  Doubling Season effectively wastes the second Role in almost all cases.
  EXCEPTION: if the creature has no Role yet, both enter at the same time,
    and the player immediately chooses one to keep (the other goes to graveyard).

MULTI-PLAYER ROLES:
  Different players can each control a Role on the same creature.
  Example: Opponent uses Asinine Antics → Cursed Role on your creature (opponent controls it).
  You use Monstrous Rage on the same creature → Monster Role on same creature (you control it).
  Result: your creature has BOTH Cursed Role (opponent's) AND Monster Role (yours).
  The creature is 1/1 base (from Cursed), +1/+1 from Monster, and has trample.
  Each player controls their respective Role.

ROLE + BLINK INTERACTION:
  Blinking a creature (exile + return) makes it a new object (P003, P024).
  Auras fall off a creature when it leaves the battlefield (CR 303.4c).
  Any Role tokens attached to the creature when it blinks go to the graveyard as SBAs
    when the Aura finds itself without a legal permanent to enchant.
  The creature returns as a new object with no Roles attached.
  Any "if it was bargained" or Role-related ETB abilities that triggered as the creature
    entered the battlefield do not re-trigger on the blink return
    unless the returning card has its own ETB Role-creation ability.

ROLE + PROTECTION:
  If a creature gains protection from enchantments (e.g., Mother of Runes activates),
    existing Role tokens attached to it are put into the graveyard (SBA — can't legally enchant).
  Creating a new Role targeting that creature fails if the ability targets — "illegal target."
  BUT: if the Role-creation ability doesn't target the creature (it targets a different object
    or has no target), hexproof and protection don't prevent attachment.
  Example: Twisted Sewer-Witch's ETB attaches Wicked Roles to Rats — if a Rat has
    protection from enchantments at the moment of resolution, that Rat doesn't get a Role,
    but other Rats do.

ROLE + COPY EFFECTS:
  If you copy a creature that has a Role attached, the COPY does not get the Role.
  Roles are separate Aura permanents. Copying the creature creates a new creature token
    that is a copy of that creature's copiable characteristics — Auras attached to it
    are NOT part of the creature's copiable value (CR 706.2).
  The original creature keeps its Role(s). The copy has none.
  To give the copy a Role, you need a separate Role-creation effect.

FAUNSBANE TROLL — SACRIFICING ROLES AS AURAS:
  Faunsbane Troll has: {1}, Sacrifice an Aura attached to this creature: fight...
  Role tokens on Faunsbane Troll are Auras. They can be sacrificed to activate this ability.
  After sacrifice, the Role goes to the graveyard.
  If the Role sacrificed was a Wicked Role: its "when put into graveyard" trigger fires,
    making each opponent lose 1 life.
  This creates an engine: Wicked Role on Troll → sacrifice to fight → opponent loses 1 life
    → repeat with new Wicked Roles from other sources.

WICKED ROLE GRAVEYARD TRIGGER:
  Wicked Role: "When this Aura is put into a graveyard from the battlefield,
    each opponent loses 1 life."
  This triggers any time a Wicked Role is put into the graveyard from the battlefield.
  This includes:
    - Being displaced by a new Role (SBA puts old Role to graveyard) → triggers.
    - Being sacrificed (Faunsbane Troll, Bargain cost) → triggers.
    - Creature dying (Aura goes to graveyard when creature leaves battlefield) → triggers.
    - Creature being exiled (does the Aura go to graveyard first, or follow to exile?)
        → Auras attached to a creature being exiled go to the graveyard (CR 303.4c),
           NOT to exile with the creature. Wicked Role trigger fires.
  EXCEPTION: if the creature phases out, the Role phases with it — no zone change,
    no graveyard trigger (P016 — phasing is not a zone change).

NOT DEAD AFTER ALL — ROLE CREATION ON RETURN:
  "When this creature dies, return it to the battlefield tapped under its owner's control,
    then create a Wicked Role token attached to it."
  The creature dies → goes to graveyard → triggers fire.
  The creature returns to battlefield.
  If the creature returns as a noncreature permanent, the Wicked Role isn't created.
  If the creature already has a Role when it returns (unlikely — it just died and returned
    with no Roles from blink), the new Wicked Role would displace the old one.

CURSED ROLE AND BASE P/T:
  Cursed Role makes the enchanted creature have "base power and toughness 1/1."
  This is a layer 7b effect (setting base P/T).
  This is applied BEFORE +1/+1 counters (layer 7c) and P/T modifiers (other layer 7c/7d effects).
  A creature with Cursed Role AND +2/+2 counters is a 3/3.
  A creature with Cursed Role AND a Monster Role (from a different player) is 2/2 with trample
    (1/1 base from Cursed, +1/+1 from Monster).
  Note: this is unusual — base P/T setting usually "wins" over many pumps, but layer ordering
    means things applied after the base-set still work.
```

## Definitive Conclusions

- **Same player, any two Roles on same creature = SBA removes older one.** It does not matter if they are different named Roles — the uniqueness rule is per-player, not per-name.
- **Different players can stack Roles on the same creature.** In multiplayer formats this creates complex interactions — you may have multiple Roles on one creature, each owned and controlled by different players.
- **Doubling Season wastes one Role.** If it doubles the Role creation to two simultaneously, both try to attach to the same creature; the player keeps one and the other immediately goes to the graveyard. Net gain: one Role, which is the same as without Doubling Season.
- **Blink removes all Roles.** When a creature blinks, attached Auras (including Roles) go to the graveyard. The Wicked Role graveyard trigger fires for each Wicked Role lost this way.
- **Wicked Role fires on displacement, sacrifice, creature death, and creature exile.** It does not fire on phaseout. This is an important distinction for timing and life-drain in competitive play.
- **Protection from enchantments removes existing Roles immediately via SBA.** Granting a creature pro-enchantments mid-game strips all Roles (including Wicked Roles — their graveyard triggers fire for each one).
- **Copying a creature does not copy its Roles.** Roles are separate permanents that happen to be attached. Only the creature's intrinsic copiable values transfer to a copy.

## Canonical Examples

**Example 1 — Role Displacement Chain (Wicked Role drain):**
Your opponent has a 4/4 with a Monster Role on it (they control). You cast Monstrous Rage on their creature (you control the resulting Monster Role from Monstrous Rage?). Wait — Monstrous Rage creates a Role you control on a creature you target. If you target an opponent's creature, you'd control the Monster Role on their creature. The opponent's Monster Role and your Monster Role are from different players — both coexist (different controllers). Now the opponent's creature is a 4/4 (base) +1/+1 (their Monster) +1/+1 (your Monster) with trample = 6/6 trample.

**Example 2 — Blink strips Wicked Role, trigger fires:**
You control a 3/3 with a Wicked Role (you control). Opponent casts Ephemerate targeting your 3/3. Your creature is exiled (Role goes to graveyard → each opponent loses 1 life). Creature returns — new object, no Role. At beginning of your next upkeep, rebound triggers, Ephemerate resolves again, same thing: no Role this time, so no Wicked Role trigger.

**Example 3 — Asinine Antics into Monstrous Rage:**
You cast Asinine Antics. Each of your three opponents' creatures gets a Cursed Role (you control). Each is now 1/1 base. Later you cast Monstrous Rage on one of those creatures (you want to target it for some reason — say, as a distraction). You create a Monster Role on it (you control). You now control two Roles on that one creature — SBA fires, Cursed Role goes to graveyard. Net result: that creature is 2/2 with trample. Your Asinine Antics-Cursed-Roles on the other creatures are untouched.

**Example 4 — Faunsbane Troll + Wicked Role engine:**
Faunsbane Troll enters. Its ETB creates a Monster Role on itself (trample). Later, Eriette's Whisper creates a Wicked Role on Troll (you control it). SBA: you control two Roles on Troll — older Monster Role goes to graveyard (no graveyard trigger on Monster). Troll now has Wicked Role. Activate Troll: {1}, sacrifice Wicked Role (an Aura attached to Troll) → Troll fights target creature. Wicked Role goes to graveyard → each opponent loses 1 life.

**Example 5 — Doubling Season + Splashy Spellcaster:**
You control Doubling Season and cast an instant spell. Splashy Spellcaster triggers: "create a Sorcerer Role token attached to up to one other target creature you control." Doubling Season doubles this — two Sorcerer Role tokens are created, both targeting the same creature. Both are controlled by you. SBA: you control two Roles on the same creature simultaneously. You choose which to keep; the other goes to the graveyard. Net: one Sorcerer Role. Doubling Season had no net benefit here.

**Example 6 — Protection strips Roles, Wicked triggers:**
Your opponent gains protection from enchantments (e.g., Mother of Runes activates). You control a Wicked Role and a Cursed Role (from a previous Asinine Antics cast against opponent) on their creature. Both are now illegal to be enchanting this creature. SBA: both go to graveyard. Wicked Role's trigger fires: each opponent (you and others) lose 1 life. The Cursed Role just goes to graveyard with no trigger. Your opponent now has their creature restored to base stats with no Roles.

## Commonly Confused With

- **P003 (Zone Change Identity)** — When a creature blinks, its Roles fall off because Auras cannot follow a permanent through a zone change. The Roles go to graveyard. This is a direct application of P003 zone-change identity breaking Aura attachment.
- **P002 (Replacement vs. Trigger)** — Wicked Role's graveyard effect is a trigger ("When this Aura is put into a graveyard..."), not a replacement. It goes onto the stack after the Role hits the graveyard. Opponents have a window to respond to it.
- **P005 (Simultaneous Event Ordering)** — When multiple Wicked Roles go to the graveyard simultaneously (creature dies with multiple Wicked Roles from different players attached), each Wicked Role trigger is put onto the stack in APNAP order, and each fires separately. Multiple opponents may each lose 1 life multiple times.
- **P016 (Phasing — Not a Zone Change)** — Phasing does NOT trigger the Wicked Role's graveyard effect. When a creature phases out, attached Auras phase with it (not a zone change). When it phases back, same Roles return. Phasing is the one case where blink-like removal does NOT strip Roles.
- **P025 (Counter Placement — Cost vs. Effect)** — The Virtuous Role gives +1/+1 for each enchantment you control. This is a continuous effect (layer 7c), not a counter. Hardened Scales does not interact with it. The Young Hero Role's "+1/+1 counter when attacking if toughness is 3 or less" IS a counter placement and IS doubled by Doubling Season (and affected by Hardened Scales).
