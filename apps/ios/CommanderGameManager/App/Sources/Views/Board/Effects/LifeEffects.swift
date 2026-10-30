import SwiftUI

/// Red claw slashes across the life area on a hit (web `LifeSwipes`): two
/// slashes, five when the hit took 5 or more life. Each is a soft red bar that
/// travels diagonally across the container and fades.
struct DamageSwipes: View {
    /// Life lost on the latest hit; 0 means idle.
    let magnitude: Int
    /// Changes on every hit so the animation restarts.
    let trigger: Int

    private struct Slash: Identifiable {
        let id: Int
        let big: Bool
        let fade: Bool
        let delay: Double
        let duration: Double
        let from: CGPoint, to: CGPoint
        let angle: Double
        let alpha: Double
    }
    private static let slashes: [Slash] = [
        Slash(id: 1, big: false, fade: false, delay: 0, duration: 0.6, from: .init(x: -1.7, y: -3), to: .init(x: 3.7, y: 3), angle: 22, alpha: 0.88),
        Slash(id: 2, big: false, fade: true, delay: 0.12, duration: 0.6, from: .init(x: -1.7, y: 3), to: .init(x: 3.7, y: -3), angle: -16, alpha: 0.78),
        Slash(id: 3, big: true, fade: true, delay: 0.28, duration: 0.58, from: .init(x: 3.7, y: -3), to: .init(x: -1.7, y: 3), angle: 30, alpha: 0.68),
        Slash(id: 4, big: true, fade: true, delay: 0.4, duration: 0.6, from: .init(x: 3.7, y: 3), to: .init(x: -1.7, y: -3), angle: -22, alpha: 0.62),
        Slash(id: 5, big: true, fade: true, delay: 0.54, duration: 0.58, from: .init(x: -1.7, y: -3.5), to: .init(x: 3.7, y: 3.5), angle: 38, alpha: 0.58),
    ]

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width * 0.7
            let h = geo.size.height * 0.1
            ZStack {
                ForEach(Self.slashes.filter { magnitude >= 5 || !$0.big }) { s in
                    SlashBar(slash: s, width: w, height: h, trigger: trigger)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height, alignment: .topLeading)
        }
        .allowsHitTesting(false)
    }

    private struct SlashBar: View {
        let slash: Slash
        let width: CGFloat
        let height: CGFloat
        let trigger: Int
        @State private var progress: CGFloat = 0

        var body: some View {
            LinearGradient(colors: [.clear, Color(red: 0.78, green: 0, blue: 0).opacity(0.5), Color(red: 0.92, green: 0, blue: 0).opacity(slash.alpha), Color(red: 0.78, green: 0, blue: 0).opacity(0.5), .clear], startPoint: .leading, endPoint: .trailing)
                .frame(width: width, height: height)
                .rotationEffect(.degrees(slash.angle))
                .offset(x: width * (slash.from.x + (slash.to.x - slash.from.x) * progress),
                        y: height * (slash.from.y + (slash.to.y - slash.from.y) * progress) + height * 4.4)
                .opacity(slash.fade ? (progress > 0 && progress < 1 ? 1 : 0) : (progress < 1 ? 1 : 0))
                .onChange(of: trigger, initial: true) { _, _ in
                    progress = 0
                    withAnimation(.easeIn(duration: slash.duration).delay(slash.delay)) { progress = 1 }
                }
        }
    }
}

/// Crack layers over the life area whose opacity rises with the share of
/// starting life lost (web `LifeCracks`). Five layers from 20 % to 85 % lost;
/// each fades in over the next 15 %. `fingerprint` (the seat index) nudges the
/// origin so no two seats crack identically.
struct LifeCracks: View {
    let fingerprint: Int
    let lostRatio: Double

    nonisolated private static func alpha(_ from: Double, lost: Double) -> Double { min(max((lost - from) / 0.15, 0), 1) }

    var body: some View {
        let lost = lostRatio
        Canvas { ctx, size in
            let ox = Double(38 + fingerprint % 7)
            let oy = Double(32 + fingerprint % 5)
            let sx = size.width / 100, sy = size.height / 100
            func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: x * sx, y: y * sy) }
            func stroke(_ pts: [(Double, Double)], _ width: Double, _ op: Double, layer: Double) {
                let a = Self.alpha(layer, lost: lost) * op
                guard a > 0.001, let first = pts.first else { return }
                var path = Path()
                path.move(to: p(first.0, first.1))
                for pt in pts.dropFirst() { path.addLine(to: p(pt.0, pt.1)) }
                ctx.stroke(path, with: .color(Color(red: 10/255, green: 0, blue: 0).opacity(a)), style: StrokeStyle(lineWidth: width * min(sx, sy) * 1.3, lineCap: .round, lineJoin: .round))
            }
            // Layer 1 (20 %): the main radiating cracks.
            stroke([(ox, oy), (ox-14, oy-18), (ox-22, oy-32)], 1.6, 0.95, layer: 0.2)
            stroke([(ox, oy), (ox+8, oy-22), (ox+5, 0)], 1.5, 0.92, layer: 0.2)
            stroke([(ox, oy), (ox+28, oy-14), (ox+48, oy-26), (100, oy-18)], 1.4, 0.9, layer: 0.2)
            stroke([(ox, oy), (ox+22, oy+18), (ox+38, oy+42), (100, oy+60)], 1.3, 0.88, layer: 0.2)
            stroke([(ox, oy), (ox+4, oy+28), (ox-2, oy+52), (ox+6, 100)], 1.3, 0.87, layer: 0.2)
            stroke([(ox, oy), (ox-18, oy+22), (ox-34, oy+48), (0, oy+62)], 1.2, 0.85, layer: 0.2)
            stroke([(ox, oy), (ox-28, oy+6), (0, oy+14)], 1.2, 0.84, layer: 0.2)
            // Layer 2 (35 %): branches.
            stroke([(ox-14, oy-18), (ox-30, oy-12), (0, oy-8)], 1.0, 0.88, layer: 0.35)
            stroke([(ox-14, oy-18), (ox-8, oy-34), (0, oy-48)], 0.9, 0.85, layer: 0.35)
            stroke([(ox+8, oy-22), (ox+22, oy-14), (ox+40, oy-20), (100, oy-30)], 0.9, 0.85, layer: 0.35)
            stroke([(ox+28, oy-14), (ox+22, oy+6), (ox+36, oy+18)], 0.85, 0.82, layer: 0.35)
            stroke([(ox+22, oy+18), (ox+10, oy+32), (ox+16, oy+50)], 0.85, 0.82, layer: 0.35)
            stroke([(ox+4, oy+28), (ox+18, oy+36), (ox+28, oy+58), (ox+18, 100)], 0.8, 0.8, layer: 0.35)
            stroke([(ox-18, oy+22), (ox-6, oy+34), (ox-12, oy+52)], 0.8, 0.8, layer: 0.35)
            stroke([(ox-28, oy+6), (ox-18, oy-6), (ox-10, oy-20)], 0.8, 0.8, layer: 0.35)
            // Layer 3 (50 %).
            stroke([(ox-30, oy-12), (ox-42, oy-24), (ox-36, oy-40), (0, oy-52)], 0.75, 0.82, layer: 0.5)
            stroke([(ox-8, oy-34), (ox+4, oy-48), (ox-2, oy-62), (ox+10, oy-80)], 0.72, 0.8, layer: 0.5)
            stroke([(ox+40, oy-20), (ox+50, oy-8), (ox+62, oy-16)], 0.7, 0.78, layer: 0.5)
            stroke([(ox+36, oy+18), (ox+52, oy+28), (ox+68, oy+20), (100, oy+32)], 0.7, 0.78, layer: 0.5)
            stroke([(ox+16, oy+50), (ox+30, oy+62), (ox+22, oy+78), (ox+36, 100)], 0.68, 0.76, layer: 0.5)
            stroke([(ox-12, oy+52), (ox-24, oy+64), (ox-14, oy+80), (0, oy+90)], 0.68, 0.76, layer: 0.5)
            stroke([(ox-42, oy-24), (ox-52, oy-10), (0, oy-4)], 0.65, 0.74, layer: 0.5)
            stroke([(ox+10, oy-80), (ox+22, oy-72), (ox+36, oy-82)], 0.62, 0.72, layer: 0.5)
            // Layer 4 (70 %).
            stroke([(ox-22, oy-32), (ox-6, oy-22), (ox+4, oy-38)], 0.6, 0.8, layer: 0.7)
            stroke([(ox+5, 0), (ox-10, oy-44), (ox-20, oy-58)], 0.55, 0.78, layer: 0.7)
            stroke([(ox+48, oy-26), (ox+58, oy-14), (ox+72, oy-22)], 0.55, 0.76, layer: 0.7)
            stroke([(ox+62, oy-16), (ox+76, oy-6), (ox+84, oy+8)], 0.52, 0.74, layer: 0.7)
            stroke([(ox+28, oy+58), (ox+44, oy+68), (ox+38, oy+84)], 0.52, 0.74, layer: 0.7)
            stroke([(ox-24, oy+64), (ox-38, oy+72), (ox-28, oy+86)], 0.5, 0.72, layer: 0.7)
            stroke([(ox-52, oy-10), (ox-62, oy+4), (ox-50, oy+18)], 0.5, 0.72, layer: 0.7)
            stroke([(ox+22, oy+6), (ox+14, oy+18), (ox+24, oy+30)], 0.48, 0.7, layer: 0.7)
            // Layer 5 (85 %): shatter around the origin.
            stroke([(ox-6, oy+8), (ox+4, oy+14), (ox-2, oy+22)], 0.45, 0.8, layer: 0.85)
            stroke([(ox+10, oy+4), (ox+18, oy+12), (ox+12, oy+22)], 0.42, 0.78, layer: 0.85)
            stroke([(ox+6, oy-10), (ox+14, oy-4), (ox+8, oy+6)], 0.42, 0.76, layer: 0.85)
            stroke([(ox-10, oy-6), (ox-4, oy+4), (ox-12, oy+12)], 0.4, 0.74, layer: 0.85)
            stroke([(ox-36, oy-40), (ox-28, oy-30), (ox-38, oy-22)], 0.4, 0.72, layer: 0.85)
            stroke([(ox+36, oy-82), (ox+48, oy-76), (ox+42, oy-64)], 0.38, 0.7, layer: 0.85)
            stroke([(ox+84, oy+8), (ox+90, oy+22), (ox+80, oy+34)], 0.38, 0.7, layer: 0.85)
            stroke([(ox+44, oy+68), (ox+54, oy+80), (ox+44, oy+92)], 0.36, 0.68, layer: 0.85)
            stroke([(ox-62, oy+4), (ox-72, oy+16), (ox-62, oy+28)], 0.36, 0.68, layer: 0.85)
        }
        .blendMode(.multiply)
        .animation(.easeInOut(duration: 0.5), value: lostRatio)
        .allowsHitTesting(false)
    }
}

/// Faint italic copies of the most threatening commander's name pulsing over
/// the life area as commander damage approaches 21 (web `ThreatNames`).
struct ThreatNames: View {
    let name: String
    let intensity: Double
    let fingerprint: Int

    private static let positions: [(x: Double, y: Double, rotate: Double)] = [
        (0.02, 0.10, -18), (0.20, 0.74, 11), (0.44, 0.42, -6), (0.06, 0.84, 20), (0.30, 0.22, -9),
    ]

    var body: some View {
        GeometryReader { geo in
            ForEach(Array(Self.positions.enumerated()), id: \.offset) { i, pos in
                PulsingName(text: name.uppercased(), size: 18 + CGFloat(i % 3) * 4, rotate: pos.rotate + Double(fingerprint % 3) * 5,
                            lo: intensity * (0.09 + Double(i) * 0.02), hi: intensity * (0.18 + Double(i) * 0.04),
                            period: 1.8 + Double(i) * 0.3, glow: intensity * 0.4)
                    .position(x: geo.size.width * pos.x + 60, y: geo.size.height * pos.y)
            }
        }
        .clipped()
        .allowsHitTesting(false)
    }

    private struct PulsingName: View {

        @Environment(\.motionEnabled) private var motion
        let text: String
        let size: CGFloat
        let rotate: Double
        let lo: Double, hi: Double
        let period: Double
        let glow: Double
        var body: some View {
            TimelineView(.animation(minimumInterval: 1 / 20, paused: !motion)) { ctx in
                let t = ctx.date.timeIntervalSinceReferenceDate
                let phase = (sin(t / period * 2 * .pi) + 1) / 2
                Text(text)
                    .font(.system(size: size, weight: .black, design: .serif).italic())
                    .kerning(1.5)
                    .foregroundStyle(Theme.danger)
                    .shadow(color: Color(red: 0.7, green: 0, blue: 0).opacity(glow), radius: 8)
                    .opacity(lo + (hi - lo) * phase)
                    .scaleEffect(1 + 0.06 * phase)
                    .rotationEffect(.degrees(rotate))
                    .fixedSize()
            }
        }
    }
}
