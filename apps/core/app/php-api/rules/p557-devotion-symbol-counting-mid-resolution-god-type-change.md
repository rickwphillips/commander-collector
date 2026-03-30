---
id: p557
name: Devotion — Symbol Counting, Mid-Resolution Evaluation, and God Type-Changing
category: continuous
cr_refs: [700.5, 700.5a, 613.1, 613.3, 613.10]
tags: [devotion, mana-symbols, counting, mid-resolution, god, type-change, nykthos, gray-merchant, thassa, hybrid, phyrexian, etb-replacement, continuous-effect]
created: 2026-03-31
examples_count: 3
---

# P557 — Devotion — Symbol Counting, Mid-Resolution Evaluation, and God Type-Changing

## Abstract

**Devotion to a color counts mana symbols of that color in the mana costs of permanents you control.** It is recalculated continuously and checked at the moment it matters — at resolution for triggered/activated abilities, or continuously for static abilities (like God type-changing). Devotion counting follows a special layer exception (CR 700.5a): it is calculated after copy, control, and text-changing effects (layers 1–3) but BEFORE other characteristic-modifying effects (layers 4–7). This means a God's own mana symbols count toward devotion before the God's type-changing ability is evaluated. Hybrid mana symbols count for BOTH colors. Phyrexian mana symbols count toward their color. Generic, colorless, and numeric symbols ({C}, {X}, {0}, {1}, etc.) do NOT count. Mana symbols in text boxes never count — only mana costs. Auras you control on opponents' permanents still count (you control the Aura).

## The Definitive Rules

**CR 700.5 (Devotion):** *"A player's devotion to [color] is equal to the number of mana symbols of that color among the mana costs of permanents that player controls. A player's devotion to [color 1] and [color 2] is equal to the number of mana symbols among the mana costs of permanents that player controls that are [color 1], [color 2], or both colors."*

**CR 700.5a (Layer Exception):** *"A player's devotion to each color and combination of colors, taking into account any effects that modify devotion, is calculated after considering any copy, control, or text-changing effects but before any other effects that modify the characteristics of permanents. This is an exception to 613.10."*

**Official Ruling (2020-01-24):** *"If an activated ability or triggered ability has an effect that depends on your devotion to a color, you count the number of mana symbols of that color among the mana costs of permanents you control as the ability resolves. The permanent with that ability will be counted if it's still on the battlefield at that time."*

**Official Ruling (2020-01-24):** *"As a God enters the battlefield, your devotion to its color will determine whether any replacement effects that affect creatures entering the battlefield apply to that God. Because replacement effects are considered before the God is on the battlefield, the mana symbols in its mana cost won't be counted when determining this."*

**Official Ruling (2020-01-24):** *"When a God enters the battlefield, your devotion to its color (including the mana symbols in the mana cost of the God itself) will determine if a creature entered the battlefield or not for abilities that trigger whenever a creature enters the battlefield."*

**Official Ruling (2020-01-24):** *"Hybrid mana symbols, monocolored hybrid mana symbols, and Phyrexian mana symbols do count toward your devotion to their color(s)."*

**Official Ruling (2020-01-24):** *"Colorless and generic mana symbols ({C}, {0}, {1}, {2}, {X}, and so on) in mana costs of permanents you control don't count toward your devotion to any color."*

**Official Ruling (2020-01-24):** *"Mana symbols in the text boxes of permanents you control don't count toward your devotion to any color."*

**Official Ruling (2020-01-24):** *"If you put an Aura on an opponent's permanent, you still control the Aura, and mana symbols in its mana cost count towards your devotion."*

## The Pattern

```
WHAT COUNTS TOWARD DEVOTION:

  Devotion to [color] = number of mana symbols of [color]
                        in MANA COSTS of permanents you CONTROL

  Counts:
    - Colored mana symbols in mana costs ({R}, {U}, {B}, {G}, {W})
    - Hybrid symbols count for BOTH colors ({R/G} counts for both R and G)
    - Monocolored hybrid ({2/R}) counts for its color (R)
    - Phyrexian mana ({R/P}) counts for its color (R)
    - Multi-color devotion: symbols that are either or both colors

  Does NOT count:
    - Generic mana ({1}, {2}, {3}, etc.)
    - Colorless mana ({C})
    - Variable costs ({X})
    - Numeric mana ({0})
    - Mana symbols in TEXT BOXES (activated abilities, reminder text, etc.)
    - Mana costs of permanents you DON'T control

  Special: Auras you control on opponents' permanents still count
    (you control the Aura, so its mana cost counts toward YOUR devotion)

WHEN DEVOTION IS CHECKED:

  For TRIGGERED/ACTIVATED abilities:
    - Devotion is counted at RESOLUTION, not at trigger/activation time
    - The permanent with the ability IS counted (if still on battlefield)
    - Respond-to window exists: opponents can remove permanents to lower devotion

  For STATIC abilities (God type-changing):
    - Devotion is checked continuously
    - God's own mana symbols count toward its own devotion threshold
    - Evaluated in layer system per CR 700.5a exception

  For ETB REPLACEMENT effects:
    - Devotion does NOT count the entering permanent's mana cost
    - The God is not yet on the battlefield when replacement effects are checked
    - Example: Panharmonicon asks "is this a creature entering?"
      → Check devotion WITHOUT the God's own mana symbols

  For ETB TRIGGERS:
    - Devotion DOES count the entering permanent's mana cost
    - The God IS on the battlefield when triggers are placed on the stack
    - Example: "Whenever a creature enters" sees the God IF devotion is met

LAYER EXCEPTION (CR 700.5a):

  Devotion calculation happens at a SPECIAL timing in the layer system:
    - AFTER layers 1-3 (copy, control, text-changing effects)
    - BEFORE layers 4-7 (type, color, ability, P/T effects)

  This matters for Gods:
    - God has mana cost {3}{R} and "devotion to red < 5 → not a creature"
    - Devotion is calculated FIRST (layers 1-3 applied)
    - THEN the God's type-changing static ability checks that devotion
    - Result: God's own {R} is always counted before deciding if it's a creature

  Example (from CR 700.5a):
    You control:
      - Altar of the Pantheon (devotion to each color +1)
      - Purphoros, God of the Forge ({3}{R}, "devotion to red < 5 → not creature")
      - Another permanent costing {R}{R}{R}

    Devotion calculation (layers 1-3 done):
      Base symbols: {R} (Purphoros) + {R}{R}{R} (other) = 4
      Altar modifier: +1
      Total devotion to red: 5

    Type-changing check: 5 ≥ 5 → Purphoros IS a creature

GOD ETB TIMING (CRITICAL DISTINCTION):

  Replacement effects (ETB "enters with" / "as enters"):
    → Devotion does NOT include the God (it's not on the battlefield yet)
    → If devotion < threshold, the God enters as a non-creature enchantment
    → Replacement effects that care about "creature entering" won't apply

  Triggered abilities (ETB "when enters"):
    → Devotion DOES include the God (it IS on the battlefield)
    → If devotion (including God) ≥ threshold, a creature entered
    → "Whenever a creature enters" triggers DO see it

  This creates a paradox-like scenario:
    - A God may enter as a NON-creature (replacement effects don't see it)
    - But immediately BECOME a creature (static ability rechecks continuously)
    - And trigger "creature enters" abilities (triggers check after ETB)

DEVOTION AND CONTROL CHANGES:

  If you gain control of an opponent's permanent:
    - Its mana cost now counts toward YOUR devotion (you control it)
    - It no longer counts toward opponent's devotion

  If a permanent is phased out:
    - It's treated as not existing → doesn't count toward devotion

MULTIPLAYER:

  In multiplayer, devotion only counts permanents YOU control.
  Not allies, not all players — just you.
```

## Definitive Conclusions

- **Devotion counts at resolution** — for triggered/activated abilities, the count happens when the ability resolves, not when it triggers.
- **God's own symbols count** — a God with {R} in its cost contributes to your devotion to red for its own type-changing ability.
- **ETB replacement vs trigger split** — replacement effects don't count the entering God; ETB triggers do.
- **Hybrid counts for both colors** — {R/G} adds 1 to both red and green devotion.
- **Text box symbols don't count** — only mana cost symbols matter, not activated ability costs or rules text.
- **Auras on opponents count** — you control the Aura, so its mana cost is yours for devotion.
- **Layer exception (700.5a)** — devotion is calculated between layers 3 and 4, ensuring Gods self-evaluate correctly.

## Canonical Example

**Gray Merchant of Asphodel ETB:**

You control three permanents with a total of 4 black mana symbols in their mana costs. You cast Gray Merchant of Asphodel ({3}{B}{B}). It enters the battlefield.

ETB triggers: "each opponent loses X life, where X is your devotion to black." Devotion is counted at resolution. Gray Merchant is on the battlefield, so its {B}{B} counts. Your devotion to black = 4 (existing) + 2 (Gray Merchant) = 6. Each opponent loses 6 life. You gain life equal to the total life lost.

If an opponent responds by destroying one of your black permanents (removing 2 {B} symbols), devotion at resolution = 2 + 2 = 4 instead.

**Example 2 — Thassa ETB Replacement vs Trigger:**

Your devotion to blue is 3 (not counting Thassa). You cast Thassa, God of the Sea ({2}{U}).

ETB replacement effects check: Is a creature entering? Devotion to blue = 3 (Thassa is NOT yet on the battlefield). 3 < 5, so Thassa is NOT a creature. Replacement effects that affect "creatures entering" do NOT apply.

Thassa enters the battlefield. Now devotion = 3 + 1 (Thassa's {U}) = 4. Still < 5, so Thassa is not a creature (legendary enchantment only).

If your devotion was 4 before casting: replacement effects see 4 (not creature). After entering, devotion = 5 → Thassa IS a creature. "Whenever a creature enters" abilities trigger (they check after the permanent is on the battlefield).

**Example 3 — Nykthos Mana Ability with Devotion:**

You control Nykthos, Shrine to Nyx and permanents with 6 red mana symbols total. You activate Nykthos: "{2}, {T}: Choose a color. Add mana of that color equal to your devotion to that color."

This is a mana ability (produces mana, no target). It doesn't use the stack. You choose red. Your devotion to red = 6. Nykthos adds {R}{R}{R}{R}{R}{R}. Opponents cannot respond.

If an opponent had destroyed a permanent with {R}{R} before you activated: devotion = 4, you add {R}{R}{R}{R}.

## Commonly Confused With

- **P015 (Mana Ability Identification)** — P015 covers what qualifies as a mana ability; Nykthos's devotion ability IS a mana ability despite its complexity.
- **P004 (Continuous Effect Layer Ordering)** — P004 covers general layer conflicts; P557 covers the special devotion layer exception at CR 700.5a.
- **P006 (Intervening If Triggers)** — P006 covers condition-checked-twice triggers; devotion-based Gods use static abilities (continuous), not intervening-if triggers.
