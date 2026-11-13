import SwiftUI
import CommanderGameKit

/// The web board's palette and colour ramps, so the iPad reads the same.
enum Theme {
    static let gold = Color(hex: 0xDAA520)
    static let brightGold = Color(hex: 0xFFD700)
    static let initiativeBlue = Color(hex: 0x4FC3F7)
    static let energyCyan = Color(hex: 0x4FC8FF)
    static let poisonGreen = Color(hex: 0x66BB6A)
    static let poisonBright = Color(hex: 0x00C853)
    static let danger = Color(hex: 0xE53935)
    static let cityPurple = Color(hex: 0x7851A9)
    static let cityMagenta = Color(hex: 0xE040FB)
    static let cityIndigo = Color(hex: 0x311B92)
    static let dealtOrange = Color(hex: 0xE67E22)

    /// Panel and table backgrounds (web: #2A1F14 / #FFF8F0 and #1A1410 / #FFF8F0).
    static func panelBackground(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Color(hex: 0x2A1F14) : Color(hex: 0xFFF8F0)
    }
    static func tableBackground(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Color(hex: 0x1A1410) : Color(hex: 0xFFF8F0)
    }
    static func overlayBackground(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Color(red: 20/255, green: 12/255, blue: 6/255).opacity(0.93) : Color(red: 1, green: 248/255, blue: 240/255).opacity(0.95)
    }
    static func menuBackground(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Color(hex: 0x1E1510) : Color(hex: 0xFFFAF5)
    }

    /// `lifeColor`: greens above the starting life, ambers to reds as it
    /// drops, dark red at 0. nil at exactly the starting life (theme default).
    static func lifeColor(_ life: Int, startingLife: Int) -> Color? {
        if life <= 0 { return Color(hex: 0x6B0000) }
        let start = Double(max(startingLife, 1))
        if life > startingLife {
            let gain = min((Double(life) - start) / start, 1)
            return Color(r: 180 - 140 * gain, g: 120 + 102 * gain, b: 60 - 36 * gain)
        }
        let ratio = max(0, min((start - Double(life)) / start, 1))
        if ratio <= 0 { return nil }
        return Color(r: 180 + 71 * ratio, g: 120 - 120 * ratio, b: 60 - 60 * ratio)
    }

    /// Commander damage taken, shifting from the calm blue through amber to
    /// red as it closes on the lethal 21; `danger` at 21 and above.
    static func commanderDamageColor(_ dmg: Int) -> Color {
        if dmg >= 21 { return danger }
        if dmg <= 0 { return Color(hex: 0x1E88E5) }
        let t = Double(dmg) / 21
        // Blue (30,136,229) → amber (230,126,34) → red (229,57,53).
        if t < 0.5 {
            let u = t / 0.5
            return Color(r: 30 + 200 * u, g: 136 - 10 * u, b: 229 - 195 * u)
        }
        let u = (t - 0.5) / 0.5
        return Color(r: 230 - 1 * u, g: 126 - 69 * u, b: 34 + 19 * u)
    }

    /// A commander-damage stepper value: the plain text colour at 0, warming
    /// toward red as it climbs, `danger` at 21 and above.
    static func commanderDamageValueColor(_ dmg: Int, scheme: ColorScheme) -> Color {
        if dmg >= 21 { return danger }
        if dmg <= 0 { return .primary }
        let t = Double(dmg) / 21
        let base: (r: Double, g: Double, b: Double) = scheme == .dark ? (235, 235, 235) : (40, 40, 40)
        return Color(r: base.r + (229 - base.r) * t, g: base.g + (57 - base.g) * t, b: base.b + (53 - base.b) * t)
    }

    /// Share of starting life lost, 0...1 (1 at or below zero).
    static func lostRatio(_ life: Int, startingLife: Int) -> Double {
        if life <= 0 { return 1 }
        let start = Double(max(startingLife, 1))
        return max(0, min((start - Double(life)) / start, 1))
    }
}

/// Turn-timer presentation for the active seat: green when fresh, amber at
/// the midpoint, red when nearly out; calm blue when the timer is off.
struct TimerTokens {
    var isActive: Bool
    var timerOff: Bool
    var progress: Double
    var isExpired: Bool
    var color: Color

    init(elapsed: Int, total: Int, isActive: Bool) {
        self.isActive = isActive
        timerOff = total == 0
        progress = timerOff ? 0 : min(Double(elapsed) / Double(total), 1)
        isExpired = isActive && !timerOff && elapsed >= total
        color = TimerTokens.color(timerOff: timerOff, progress: progress)
    }

    static func color(timerOff: Bool, progress: Double) -> Color {
        if timerOff { return Color(r: 66, g: 165, b: 245) }
        if progress <= 0.5 {
            let p = progress * 2
            return Color(r: 102 + 153 * p, g: 187 - 20 * p, b: 106 - 68 * p)
        }
        let p = (progress - 0.5) * 2
        return Color(r: 255 - 26 * p, g: 167 - 110 * p, b: 38 + 15 * p)
    }
}

extension Color {
    init(hex: UInt32) {
        self.init(red: Double((hex >> 16) & 0xFF) / 255, green: Double((hex >> 8) & 0xFF) / 255, blue: Double(hex & 0xFF) / 255)
    }
    init(r: Double, g: Double, b: Double) {
        self.init(red: r.rounded() / 255, green: g.rounded() / 255, blue: b.rounded() / 255)
    }
}

/// Reminder text for the three held statuses, as the web shows on tap.
enum RulesText {
    static let monarch = "Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch."
    static let initiative = "When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative."
    static let citysBlessing = "You have the city's blessing for the rest of the game. Gained when you control ten or more permanents; it persists even if that number later drops below ten."
    static func commanderTax(name: String, tax: Int) -> String {
        "\(name) tax: cast \(tax)× (+\(tax * 2) generic mana)"
    }
}


/// Whether the board runs its status animations (Settings → Motion). Off
/// freezes every effect at a still frame and drops implicit animations.
private struct MotionEnabledKey: EnvironmentKey {
    static let defaultValue = true
}

extension EnvironmentValues {
    var motionEnabled: Bool {
        get { self[MotionEnabledKey.self] }
        set { self[MotionEnabledKey.self] = newValue }
    }
}

/// True on a phone-sized table (short edge under 500 pt): the seats keep
/// their rotation but open with the drawers closed and the life buttons
/// beside the number, the centre strip collapses to one row, and the
/// centre's panels present as sheets.
private struct CompactTableKey: EnvironmentKey {
    static let defaultValue = false
}

extension EnvironmentValues {
    var compactTable: Bool {
        get { self[CompactTableKey.self] }
        set { self[CompactTableKey.self] = newValue }
    }
}

/// How a team's name is drawn. A name the players chose is set in a Magic
/// card-title style face (Cinzel Bold, a free lookalike); the default
/// "Team N" stays in the system face.
enum TeamNameText {
    static let customFace = "Cinzel-Bold"

    /// The name alone.
    static func name(_ team: Int?, teamNames: [Int: String]?, size: CGFloat, weight: Font.Weight = .bold, uppercase: Bool = false) -> Text {
        let name = Teams.name(team, teamNames: teamNames)
        let shown = uppercase ? name.uppercased() : name
        return Teams.hasCustomName(team, teamNames: teamNames)
            ? warped(shown, size: size * customScale)
            : Text(shown).font(.system(size: size, weight: weight))
    }

    /// A custom name is drawn larger than the text around it.
    static let customScale = 1.3
    /// How much taller the middle letters are than the first and last.
    static let bulge = 0.24

    /// The name with a slight warp, like lettering on a banner: the letters
    /// swell towards the middle and sink a little so the line stays centred.
    /// Built letter by letter so it is still a `Text` and can sit in a sentence.
    private static func warped(_ name: String, size: CGFloat) -> Text {
        let letters = Array(name)
        return letters.enumerated().reduce(Text("")) { text, item in
            let t = letters.count > 1 ? Double(item.offset) / Double(letters.count - 1) : 0.5
            let swell = sin(.pi * t)
            let letterSize = size * (1 + bulge * swell)
            return text + Text(String(item.element))
                .font(.custom(customFace, size: letterSize))
                .baselineOffset(-(letterSize - size) * 0.3)
        }
    }

    /// The name and its members, "Name (A / B)"; only the name takes the
    /// face. A custom name stands alone: the players are not listed after it.
    static func label(_ team: Int?, players: [PlayerState], teamNames: [Int: String]?, size: CGFloat, weight: Font.Weight = .bold) -> Text {
        if Teams.hasCustomName(team, teamNames: teamNames) { return name(team, teamNames: teamNames, size: size, weight: weight) }
        let members = String(Teams.label(team, players: players, teamNames: teamNames).dropFirst(Teams.name(team, teamNames: teamNames).count))
        return name(team, teamNames: teamNames, size: size, weight: weight) + Text(members).font(.system(size: size, weight: weight))
    }
}
