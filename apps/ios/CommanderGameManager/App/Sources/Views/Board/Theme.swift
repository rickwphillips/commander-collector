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
