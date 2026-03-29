---
id: p311
name: The New Object Rule — Losing Memory When Changing Zones
category: zones
cr_refs: [400.7, 400.7a, 400.7b, 400.7d, 400.7e, 400.7j]
tags: [new-object, zone-change, memory, targeting, bounce-recast, counters-lost, Auras-fall-off, legendary-rule, Yorion, Ephemerate, Restoration-Angel, Astral-Slide, flicker]
created: 2026-03-29
examples_count: 2
---

# P311 — The New Object Rule — Losing Memory When Changing Zones

## Abstract
When an object moves from one zone to another, it becomes a **new object** with no memory of its previous existence (CR 400.7). This is one of the most fundamental rules in Magic. A creature that bounces to hand and is recast has forgotten every effect, counter, and attachment it had before. Spells targeting it before it left fail (target became illegal — it's a new object). Auras attached to it fall off. +1/+1 counters are removed. Effects like "until end of turn" that applied to it no longer apply. The rule has important exceptions (listed in 400.7a–m) for specific cases.

## The Definitive Rules

**CR 400.7** (verbatim): *"An object that moves from one zone to another becomes a new object with no memory of, or relation to, its previous existence. This rule has the following exceptions."*

**CR 400.7a** (verbatim): *"Effects from spells, activated abilities, and triggered abilities that change the characteristics or controller of a permanent spell on the stack continue to apply to the permanent that spell becomes."*

**CR 400.7d** (verbatim): *"An ability of a permanent can reference information about the spell that became that permanent as it resolved, including what costs were paid to cast that spell or what mana was spent to pay those costs."*

**CR 400.7e** (verbatim): *"Abilities that trigger when an object moves from one zone to another (for example, 'When this Aura is put into a graveyard from the battlefield') can find the new object that it became in the zone it moved to when the ability triggered, if that zone is a public zone."*

## The Pattern

```
THE CORE RULE:
  Object moves to a new zone → it's a new object.
  The new object has: printed characteristics. Nothing else from before.
  What it LOSES when moving to a new zone:
    - All +1/+1 counters, -1/-1 counters, charge counters, any counters
    - All damage marked on it
    - All "until end of turn" modifications (pump spells, etc.)
    - All Auras enchanting it (they stay on battlefield, but it "falls off" as a new object)
    - All Equipment attached to it (falls off; Equipment stays on battlefield)
    - Any targeted spells/abilities from before it moved (they fizzle — the new object is untargeted)

  MOST COMMON APPLICATIONS:
    (A) Bouncing: return a creature to hand. The creature in hand is a new object.
        Re-cast it: enters fresh. All previous modifications gone.
    (B) Flickering: exile and return immediately.
        The permanent that returns is a new object.
        All counters gone. All Auras fall off. But ETB triggers fire again.
    (C) Dying: creature goes to GY. GY version is new object.
        Reanimated: enters as printed. No memory of any effects from when it was on battlefield.

  FLICKERING (specific case):
    Ephemerate ({W}): "Exile target creature you control, return it to the battlefield at beginning
      of next end step." (Or some versions immediately.)
    Restoration Angel: "Flash. When it enters, target non-Angel creature blinks (temporarily)."
    Yorion, Sky Nomad: "When it enters, exile other nonland permanents you own that came into play
      under your control. Return them at beginning of next end step."

    The flickered permanent returns as a NEW OBJECT.
    Consequences:
      - ETB triggers fire again (great for ETB creatures)
      - All counters are lost (bad if using +1/+1 counter-based growth)
      - All Auras fall off (bad if you had enchantments on the creature)
      - Summoning sickness: it re-entered this turn → can't attack (unless it has haste)
      - "Until end of turn" effects don't transfer (they applied to the old object)
      - Targeted "until EOT" spells targeting the old object: now invalid (new object)

NOTABLE INTERACTIONS:
  TARGETING (spells in response to flicker):
    Player casts Ephemerate on their creature X.
    Opponent responds with Path to Exile targeting creature X.
    Ephemerate resolves first (on stack later): creature X exiles, set to return.
    Path to Exile's target: the original creature X on the battlefield → now gone from battlefield.
    The creature X returned from Ephemerate is a NEW OBJECT → not targeted by Path to Exile.
    Path to Exile: "Target is illegal" → Path fizzles.
    The returned creature survives. Path wasted.

  AURAS FALLING OFF (on bounce/flicker):
    Bestow creatures: if the enchanted creature is flickered, the Aura falls off as a creature.
    Wait: Aura falls off because it's attached to the old object. The new object has no Aura.
    Aura's "enchant creature" ability: if the enchanted permanent leaves, Aura becomes unattached.
    Unattached Aura: goes to GY (SBA 704.5m: Aura not attached to legal permanent → GY).
    Exception: bestow Auras fall off as a creature (per P299 bestow rules).

    Flickering YOUR Aura-enchanted creature: all your Auras on it fall off to GY.
    Strategically: DON'T flicker creatures with Auras you want to keep.
    Or: DO flicker to intentionally remove opponent's Auras (Control Magic, Pacifism) from your creature.
    Opponent enchanted your creature with Pacifism: flicker your creature → Pacifism falls to GY.
    Your creature returns clean!

  COUNTERS LOST ON ZONE CHANGE:
    +1/+1 counters: gone when creature dies, is bounced, is flickered.
    Persist returns creature with a -1/-1 counter: the GY version was a new object (no counters).
    But: persist specifically places the counter on return: "with a -1/-1 counter."
    Undying similarly: the return triggers puts the +1/+1 counter on the NEW object entering.
    The new object enters with the counter as part of the return trigger's effect.
    Proliferate counters: if creature flickers, proliferate can't add counters to it (no counters).

  EQUIPMENT:
    Equipment attached to a creature that leaves battlefield: Equipment stays on battlefield.
    Equipment becomes unattached (falls off the new object).
    Re-enter: equipment must be re-equipped (pay equip cost again).
    Exception: Equipment with "auto-equip" triggers that re-attach on ETB.

  CONTROL EFFECTS:
    "Control target creature until EOT" (Act of Treason etc.):
    Effects applied to the old object on the stack.
    If the creature leaves battlefield and returns: the new object has no memory of the control effect.
    The new object is under the original owner's control.
    Bounce your own "stolen" creature → returns to you as a new object free of the control effect.

EXCEPTIONS TO THE NEW OBJECT RULE (CR 400.7a-m):
  CR 400.7a: Effects from spells/abilities that changed characteristics on the STACK carry over.
    Example: you targeted a spell with "its target becomes blue" and it resolved. If the spell
    becomes a permanent, it's blue. (Because the effect was applied to the spell on the stack.)

  CR 400.7d: A permanent can reference the spell it became for costs/modes paid at cast time.
    Example: Evoke — "if the evoke cost was paid." The permanent knows the spell's cast conditions.

  CR 400.7j: If an effect causes a card to move to a public zone, the effect can still "find" it.
    Example: Wildgrowth Walker's Explore effect puts a land into play → the land is "found" by the effect.

COMMANDER ZONE SPECIFIC:
  CR 903.x: Commander permanents in the command zone are still the "same" commander for damage tracking.
  This is a RULE EXCEPTION to the new object rule for commander purposes.
  The commander's zone changes don't reset commander damage tracking.
  CR 903.11: "21 or more combat damage by the same commander over the course of the game."
  Same commander = identified by the game as the same commander card, regardless of zone changes.

LEGENDARY RULE + NEW OBJECT:
  If a legendary permanent enters while you control one with the same name:
  SBA: you choose one to keep, the other goes to GY.
  BUT: the GY version is a new object → the "legendary rule" just forces you to move it.
  You can then recast it again if you chose to put the original in GY.
  Common play: "Legend rule yourself" to get the ETB trigger again.
  Cast your own copy of a legendary creature, sacrifice the old one → new one enters → ETB fires again.
```

## Definitive Conclusions

- **Objects that change zones become new objects** — all counters, Auras, Equipment, and "until EOT" effects from before are gone.
- **Flickering a creature fires ETB triggers again** — but it enters with summoning sickness and no previous modifications.
- **Targeted spells following a zone change fizzle** — the new object is not the same as the old target.
- **Opponent's Auras/control effects on your creature are removed by bouncing/flickering** — the new object is clean.
- **Commander damage tracking is an exception** — the same commander card tracks cumulative damage across all zone changes.

## Canonical Example
**Restoration Angel Flickering Siege Rhino:**
Board: Siege Rhino (4/5 Trample). You control Restoration Angel.
Opponent has cast Path to Exile targeting Siege Rhino. Path is on the stack.
You respond: flash in Restoration Angel ({3}{W}).
Restoration Angel triggers: "When it enters, exile target non-Angel creature you control."
Target: Siege Rhino. Rhino is exiled (leaves battlefield).
Now Path to Exile is still on stack. Its target: Siege Rhino.
Path resolves: target Siege Rhino. Siege Rhino is NOT on the battlefield.
Path to Exile targets a creature "on the battlefield." Target is now illegal. Path fizzles.
At beginning of next end step (or "immediately" depending on Resto Angel's version):
Siege Rhino returns to battlefield as a NEW OBJECT.
New Siege Rhino enters: ETB trigger fires → drain each opponent 3 life, gain 3 life.
Result: Path countered, Rhino ETB triggered TWICE (original cast + flicker), Restoration Angel in play.

**Example 2 — Flickering to Remove Opponent's Control:**
Opponent casts Act of Treason ({2}{R}): "Until end of turn, gain control of target creature and untap it."
Targets your 5/5 Dragon. Dragon is now under opponent's control.
Opponent attacks with your Dragon.
Your turn: you have Ephemerate ({W}) in hand.
Cast Ephemerate targeting your Dragon (wait: opponent controls it — you can't target an opponent's creature?).
Hmm: Act of Treason gave them control. You don't own it anymore for targeting purposes.
Better: bounce it via your Teferi, Time Raveler (-3: return a spell or permanent to hand).
Teferi -3: return target creature or other permanent to owner's hand.
Return the Dragon (you own it, they control it). Dragon goes to YOUR hand.
The Act of Treason effect: "until end of turn, gain control." The old object left the battlefield.
Dragon returns to battlefield at beginning of next end step (if Teferi bounced to hand: you recast it normally).
Actually: bouncing to hand means the Act of Treason effect ends (old object is gone).
Re-cast Dragon: it's a new object. Act of Treason no longer applies.
Dragon is yours again.
Alternatively: Ephemerate could target the Dragon while opponent controls it if Ephemerate says "target creature" without the "you control" restriction. Check: Ephemerate says "Exile target creature you control." You don't control it. Can't use Ephemerate.
Better: use a bounce effect that doesn't require control ("return target creature to its owner's hand").

## Commonly Confused With
- **P024 (Zone Change Identity)** — P024 covers whether a permanent entering the battlefield is "the same" as before; P311 is the general rule that it's NOT the same (new object rule) with its exceptions.
- **P287 (Phasing)** — Phasing does NOT create a new object (it's an exception): phased permanents retain all counters, status, and attached permanents. The new object rule applies to zone CHANGES, and phasing is not a zone change.
- **P300 (Undying/Persist)** — These mechanics specifically put counters on the NEW object returning to battlefield; the new object has no memory, but the triggered ability adds the counter as part of the return.
- **P293 (Commander Damage)** — Commander damage is the most notable exception to the new object rule: the same commander card tracks all combat damage across the entire game regardless of zone changes.
