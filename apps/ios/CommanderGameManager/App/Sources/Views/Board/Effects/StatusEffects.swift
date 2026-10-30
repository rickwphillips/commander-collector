import SwiftUI

// MARK: Monarch

/// The floating crown over the top-left of the life number (web
/// `MonarchCrown`): shimmer while held, slides in from above on gain (a
/// transfer from another seat takes longer and starts later), slides out on
/// loss.
struct MonarchCrown: View {
    @Environment(\.motionEnabled) private var motion
    let isMonarch: Bool
    /// Changes when a crown transfer between seats happened recently.
    let transferHint: Bool
    var size: CGFloat = 56
    @State private var shown = false
    @State private var offset: CGFloat = -80

    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 20, paused: (!shown) || !motion)) { ctx in
            let t = ctx.date.timeIntervalSinceReferenceDate
            let glow = (sin(t / 2 * 2 * .pi) + 1) / 2
            Image(systemName: "crown.fill")
                .font(.system(size: size))
                .foregroundStyle(Theme.gold)
                .brightness(0.6 * glow)
                .shadow(color: Theme.brightGold.opacity(0.4 + 0.6 * glow), radius: 3 + 7 * glow)
                .rotationEffect(.degrees(-25))
                .offset(y: offset)
                .opacity(shown ? 1 : 0)
        }
        .onChange(of: isMonarch, initial: true) { _, now in
            if now {
                let transfer = transferHint
                withAnimation(.easeOut(duration: transfer ? 1 : 0.5).delay(transfer ? 0.5 : 0)) { shown = true; offset = 0 }
            } else {
                withAnimation(.easeIn(duration: 0.5)) { shown = false; offset = -80 }
            }
        }
        .allowsHitTesting(false)
    }
}

// MARK: Initiative

/// Dungeon wall and a drifting, flickering torch (web `InitiativeTorch`).
struct InitiativeTorch: View {
    @Environment(\.motionEnabled) private var motion
    @State private var shown = false

    var body: some View {
        GeometryReader { geo in
            ZStack {
                Image("dungeon").resizable().scaledToFill()
                    .frame(width: geo.size.width, height: geo.size.height)
                    .opacity(0.3)
                TimelineView(.animation(minimumInterval: 1 / 24, paused: !motion)) { ctx in
                    let t = ctx.date.timeIntervalSinceReferenceDate
                    let phase = (t / 42).truncatingRemainder(dividingBy: 1)
                    let drift = Self.drift(at: phase)
                    // Walking speed (torch widths per second) sets the step bob:
                    // a small lift twice a second, only while the hunter moves.
                    let ahead = Self.drift(at: (phase + 0.001).truncatingRemainder(dividingBy: 1))
                    let speed = min(abs(ahead.x - drift.x) / (0.001 * 42), 1)
                    let bob = -abs(sin(t * .pi * 2)) * 5 * speed
                    let flicker = 0.11 + 0.08 * Self.noise(t * 1.7)
                    ZStack {
                        RadialGradient(colors: [Color(hex: 0xFF8C00), Color(hex: 0xFF4500), .clear], center: .center, startRadius: 0, endRadius: 250)
                            .frame(width: 500, height: 500)
                            .opacity(flicker)
                            .offset(y: -105)
                        Torch(t: t)
                            .frame(width: 90, height: 270)
                            .opacity(0.35)
                    }
                    // The torch leans back against the direction of travel.
                    .rotationEffect(.degrees(-drift.angle))
                    .position(x: geo.size.width / 2 + drift.x * 90, y: geo.size.height - 45 + bob)
                }
            }
            .clipped()
            .opacity(shown ? 1 : 0)
        }
        .allowsHitTesting(false)
        .onAppear { withAnimation(.easeIn(duration: 3)) { shown = true } }
    }

    /// The web's torchDrift keyframes (x in torch widths, rotation).
    private static let keyframes: [(p: Double, x: Double, a: Double)] = [
        (0, -6, 12), (0.07, -0.8, 11), (0.14, 0.3, 12), (0.19, -0.2, 10), (0.24, -0.9, 10), (0.31, 0.1, 12), (0.39, 1.5, 13), (0.44, 0.7, 11),
        (0.5, 6, 14), (0.57, 1.2, -12), (0.63, -0.3, -11), (0.68, 0.5, -12), (0.73, 0.2, -10), (0.79, -1.1, -11), (0.85, -6, -13), (0.91, -1.4, 11), (0.96, -6, 12), (1, -6, 12),
    ]
    private static func drift(at p: Double) -> (x: Double, angle: Double) {
        for i in 1..<keyframes.count where p <= keyframes[i].p {
            let a = keyframes[i - 1], b = keyframes[i]
            let f = (p - a.p) / max(b.p - a.p, 0.0001)
            let e = f < 0.5 ? 2 * f * f : 1 - pow(-2 * f + 2, 2) / 2
            return (a.x + (b.x - a.x) * e, a.a + (b.a - a.a) * e)
        }
        return (-6, 12)
    }
    private static func noise(_ t: Double) -> Double {
        (sin(t * 3.1) + sin(t * 7.3 + 1) + sin(t * 13.7 + 2)) / 3 * 0.5 + 0.5
    }

    private struct Torch: View {
        let t: Double
        var body: some View {
            let wob = sin(t * 14), wob2 = cos(t * 9.3)
            Canvas { ctx, size in
                let sx = size.width / 60, sy = size.height / 180
                func r(_ x: Double, _ y: Double, _ w: Double, _ h: Double, _ rad: Double) {
                    ctx.fill(Path(roundedRect: CGRect(x: x * sx, y: y * sy, width: w * sx, height: h * sy), cornerRadius: rad * sx), with: .color(Color(hex: 0x0A0400)))
                }
                var flame = Path()
                flame.move(to: CGPoint(x: 30 * sx, y: 2 * sy))
                flame.addCurve(to: CGPoint(x: 30 * sx, y: 70 * sy), control1: CGPoint(x: (20 + wob * 3) * sx, y: 18 * sy), control2: CGPoint(x: (14 + wob2 * 2) * sx, y: 58 * sy))
                flame.addCurve(to: CGPoint(x: 30 * sx, y: 2 * sy), control1: CGPoint(x: (46 - wob2 * 2) * sx, y: 58 * sy), control2: CGPoint(x: (40 - wob * 3) * sx, y: 18 * sy))
                ctx.fill(flame, with: .color(Color(hex: 0x0A0400)))
                var inner = Path()
                inner.move(to: CGPoint(x: 30 * sx, y: 14 * sy))
                inner.addCurve(to: CGPoint(x: 30 * sx, y: 60 * sy), control1: CGPoint(x: (25 + wob) * sx, y: 24 * sy), control2: CGPoint(x: 23 * sx, y: 52 * sy))
                inner.addCurve(to: CGPoint(x: 30 * sx, y: 14 * sy), control1: CGPoint(x: 37 * sx, y: 52 * sy), control2: CGPoint(x: (35 - wob) * sx, y: 24 * sy))
                ctx.fill(inner, with: .color(Color(hex: 0x2A1000)))
                r(18, 66, 24, 18, 3); r(24, 84, 12, 88, 3); r(21, 100, 18, 4, 2); r(21, 114, 18, 4, 2); r(21, 128, 18, 4, 2)
                ctx.fill(Path(ellipseIn: CGRect(x: 22 * sx, y: 168 * sy, width: 16 * sx, height: 8 * sy)), with: .color(Color(hex: 0x0A0400)))
            }
        }
    }
}

// MARK: Eliminated

/// ELIMINATED / CONCEDED / POISONED stamp across the panel (web
/// `EliminatedOverlay`): gold with falling tears for a concede, green with a
/// black outline for poison, red otherwise.
struct EliminatedOverlay: View {
    @Environment(\.motionEnabled) private var motion
    let conceded: Bool
    let poisoned: Bool

    private static let tears: [(left: Double, delay: Double, dur: Double)] = [
        (0.12, 0, 2.9), (0.28, 1.1, 3.2), (0.45, 0.4, 2.6), (0.60, 1.7, 3.4), (0.76, 0.7, 2.8), (0.88, 2.0, 3.1),
    ]

    var body: some View {
        GeometryReader { geo in
            ZStack {
                if conceded && !poisoned {
                    Theme.gold.opacity(0.12)
                    TimelineView(.animation(minimumInterval: 1 / 30, paused: !motion)) { ctx in
                        let t = ctx.date.timeIntervalSinceReferenceDate
                        ForEach(Array(Self.tears.enumerated()), id: \.offset) { _, tear in
                            let p = ((t - tear.delay) / tear.dur).truncatingRemainder(dividingBy: 1)
                            let phase = p < 0 ? p + 1 : p
                            let alpha = phase < 0.08 ? phase / 0.08 * 0.85 : phase < 0.4 ? 0.85 - (phase - 0.08) / 0.32 * 0.1 : phase < 0.75 ? 0.75 - (phase - 0.4) / 0.35 * 0.35 : 0.4 * (1 - (phase - 0.75) / 0.25)
                            Capsule()
                                .fill(Color(red: 120/255, green: 190/255, blue: 1).opacity(alpha))
                                .frame(width: 7, height: 11)
                                .shadow(color: Color(red: 120/255, green: 190/255, blue: 1).opacity(0.5), radius: 5)
                                .position(x: geo.size.width * tear.left + sin(phase * 6) * 3, y: -12 + phase * (geo.size.height + 24))
                        }
                    }
                }
                Text(poisoned ? "POISONED" : conceded ? "CONCEDED" : "ELIMINATED")
                    .font(.system(size: min(48, geo.size.width / 8), weight: .black))
                    .kerning(4)
                    .foregroundStyle(poisoned ? Theme.poisonBright : conceded ? Theme.gold : Theme.danger)
                    .shadow(color: .black, radius: 0, x: 1, y: 1)
                    .shadow(color: .black, radius: 0, x: -1, y: -1)
                    .shadow(color: .black, radius: 0, x: 1, y: -1)
                    .shadow(color: .black, radius: 0, x: -1, y: 1)
                    .rotationEffect(.degrees(-15))
                    .frame(width: geo.size.width, height: geo.size.height)
            }
            .clipped()
        }
        .allowsHitTesting(false)
        .transition(.opacity)
    }
}

// MARK: XP badge

/// Gold diamond with the XP number (web `XpBadge`): ember particles, rune
/// glow, a shimmer sweep, and a level-up flash + ripple on each increment.
/// Hidden at 0 XP.
struct XpBadge: View {
    @Environment(\.motionEnabled) private var motion
    let experience: Int
    @State private var rippleKey = 0
    @State private var flashing = false
    @State private var rippleScale: CGFloat = 0.4
    @State private var rippleOpacity = 0.0

    var body: some View {
        if experience > 0 {
            TimelineView(.animation(minimumInterval: 1 / 24, paused: !motion)) { ctx in
                let t = ctx.date.timeIntervalSinceReferenceDate
                let rune = (sin(t / 2.5 * 2 * .pi) + 1) / 2
                let sweep = (t / 7.5).truncatingRemainder(dividingBy: 1)
                ZStack {
                    // Embers drifting upward.
                    ForEach(0..<4, id: \.self) { i in
                        let dur = 1.1 + Double(i) * 0.35
                        let p = ((t - Double(i) * 0.38) / dur).truncatingRemainder(dividingBy: 1)
                        Circle().fill(i % 2 == 0 ? Theme.brightGold : Color(hex: 0xFFA040))
                            .frame(width: i % 2 == 0 ? 3 : 2, height: i % 2 == 0 ? 3 : 2)
                            .scaleEffect(1 - 0.8 * p)
                            .opacity(0.9 * (1 - p))
                            .offset(x: -12 + CGFloat(i) * 7, y: 2 - 26 * p)
                    }
                    RoundedRectangle(cornerRadius: 2)
                        .fill(LinearGradient(colors: [Theme.brightGold, Color(hex: 0x8B6914)], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(Theme.brightGold.opacity(0.85), lineWidth: 1.5))
                        .overlay {
                            // Shimmer sweep: a thin bright bar crossing the diamond twice per cycle.
                            let x: CGFloat? = sweep > 0.06 && sweep < 0.21 ? CGFloat((sweep - 0.06) / 0.15) : sweep > 0.57 && sweep < 0.69 ? CGFloat((sweep - 0.57) / 0.12) : nil
                            if let x {
                                LinearGradient(colors: [.clear, .white.opacity(0.72), .clear], startPoint: .leading, endPoint: .trailing)
                                    .frame(width: 8)
                                    .offset(x: -18 + 36 * x)
                            }
                        }
                        .clipShape(RoundedRectangle(cornerRadius: 2))
                        .frame(width: 26, height: 26)
                        .rotationEffect(.degrees(45))
                        .scaleEffect(flashing ? 1.3 : 1)
                        .shadow(color: Theme.gold.opacity(flashing ? 1 : 0.55), radius: flashing ? 14 : 4, y: 2)
                    RoundedRectangle(cornerRadius: 2)
                        .strokeBorder(Theme.brightGold.opacity(0.8), lineWidth: 2)
                        .frame(width: 26, height: 26)
                        .rotationEffect(.degrees(45))
                        .scaleEffect(rippleScale)
                        .opacity(rippleOpacity)
                    VStack(spacing: 0) {
                        Image("xp").resizable().frame(width: 10, height: 10).blendMode(.multiply)
                        Text("\(experience)").font(.system(size: 9, weight: .black)).foregroundStyle(Color(hex: 0x111111))
                    }
                }
                .shadow(color: Theme.gold.opacity(0.35 + 0.5 * rune), radius: 2 + 7 * rune)
            }
            .frame(width: 34, height: 34)
            .onChange(of: experience) { old, new in
                guard new > old else { return }
                withAnimation(.easeOut(duration: 0.18)) { flashing = true }
                rippleScale = 0.4; rippleOpacity = 0.9
                withAnimation(.easeOut(duration: 0.7)) { rippleScale = 4; rippleOpacity = 0 }
                Task { try? await Task.sleep(for: .milliseconds(180)); withAnimation(.easeOut(duration: 0.5)) { flashing = false } }
            }
        }
    }
}
