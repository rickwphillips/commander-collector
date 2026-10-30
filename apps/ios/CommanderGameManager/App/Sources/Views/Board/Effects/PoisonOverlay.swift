import SwiftUI

/// Phyrexian poison overlay (web `PoisonOverlay`): a green wash, drips from
/// the top and bottom edges that lengthen with progress toward lethal, rising
/// bubbles from 5 poison, boiling bubbles at 9+, large Phyrexian symbols at
/// the edges that grow and tilt with progress and orbit at 9+, and three
/// drifting symbols rising through the panel at 9+.
struct PoisonOverlay: View {
    let poison: Int
    /// 0...1 toward lethal (poison / 10, or / 15 in Two-Headed Giant).
    let progress: Double

    var body: some View {
        if progress > 0 {
            GeometryReader { geo in
                ZStack {
                    Color(red: 0, green: (80 + progress * 60) / 255, blue: 0).opacity(pow(progress, 2) * 0.45)
                    Drips(progress: progress).frame(width: geo.size.width, height: geo.size.height)
                    if poison >= 5 { Bubbles(poison: poison, progress: progress, fast: false) }
                    if poison >= 9 { Bubbles(poison: poison, progress: progress, fast: true) }
                    EdgeSymbol(progress: progress, poison: poison, side: .left, size: geo.size)
                    EdgeSymbol(progress: progress, poison: poison, side: .right, size: geo.size)
                    if poison >= 9 { RisingSymbols(size: geo.size) }
                }
                .clipped()
            }
            .allowsHitTesting(false)
            .transition(.opacity)
        }
    }

    // MARK: Drips

    private struct Drip { let x: Double; let len: Double; let w: Double; let cx: Double; let dark: Bool }
    private static let topDrips: [Drip] = [
        .init(x: 18, len: 140, w: 8, cx: 22, dark: true), .init(x: 55, len: 60, w: 3, cx: -5, dark: false), .init(x: 95, len: 190, w: 10, cx: -18, dark: true),
        .init(x: 148, len: 75, w: 4, cx: 28, dark: false), .init(x: 190, len: 160, w: 7, cx: 8, dark: true), .init(x: 235, len: 45, w: 2, cx: -24, dark: false),
        .init(x: 272, len: 175, w: 9, cx: 14, dark: true), .init(x: 318, len: 85, w: 4, cx: 30, dark: false), .init(x: 360, len: 200, w: 11, cx: -6, dark: true),
        .init(x: 410, len: 55, w: 3, cx: -26, dark: false), .init(x: 448, len: 150, w: 7, cx: 18, dark: true), .init(x: 490, len: 70, w: 4, cx: -32, dark: false), .init(x: 535, len: 120, w: 6, cx: 10, dark: true),
    ]
    private static let bottomDrips: [Drip] = [
        .init(x: 38, len: 110, w: 7, cx: 20, dark: true), .init(x: 80, len: 50, w: 3, cx: -28, dark: false), .init(x: 128, len: 170, w: 9, cx: 10, dark: true),
        .init(x: 175, len: 65, w: 4, cx: -8, dark: false), .init(x: 220, len: 130, w: 6, cx: 26, dark: true), .init(x: 260, len: 40, w: 2, cx: -14, dark: false),
        .init(x: 290, len: 155, w: 8, cx: -30, dark: true), .init(x: 335, len: 90, w: 5, cx: 6, dark: false), .init(x: 378, len: 185, w: 10, cx: 24, dark: true),
        .init(x: 425, len: 60, w: 3, cx: -18, dark: false), .init(x: 462, len: 140, w: 7, cx: 32, dark: true), .init(x: 505, len: 75, w: 4, cx: -10, dark: false),
    ]

    private struct Drips: View {
        let progress: Double
        var body: some View {
            Canvas { ctx, size in
                let sx = size.width / 600, sy = size.height / 220
                func drip(_ d: Drip, fromTop: Bool) {
                    let h = d.len * progress
                    let hw = d.w / 2
                    let tipX = d.x + d.cx * 0.3
                    var path = Path()
                    if fromTop {
                        path.move(to: CGPoint(x: (d.x - hw) * sx, y: 0))
                        path.addCurve(to: CGPoint(x: tipX * sx, y: h * sy), control1: CGPoint(x: (d.x - hw + d.cx * 0.9) * sx, y: h * 0.45 * sy), control2: CGPoint(x: (tipX - 1) * sx, y: h * 0.88 * sy))
                        path.addCurve(to: CGPoint(x: (d.x + hw) * sx, y: 0), control1: CGPoint(x: (tipX + 1) * sx, y: h * 0.88 * sy), control2: CGPoint(x: (d.x + hw + d.cx * 0.9) * sx, y: h * 0.45 * sy))
                    } else {
                        let b = 220.0
                        path.move(to: CGPoint(x: (d.x - hw) * sx, y: b * sy))
                        path.addCurve(to: CGPoint(x: tipX * sx, y: (b - h) * sy), control1: CGPoint(x: (d.x - hw + d.cx * 0.9) * sx, y: (b - h * 0.45) * sy), control2: CGPoint(x: (tipX - 1) * sx, y: (b - h * 0.88) * sy))
                        path.addCurve(to: CGPoint(x: (d.x + hw) * sx, y: b * sy), control1: CGPoint(x: (tipX + 1) * sx, y: (b - h * 0.88) * sy), control2: CGPoint(x: (d.x + hw + d.cx * 0.9) * sx, y: (b - h * 0.45) * sy))
                    }
                    path.closeSubpath()
                    let top = d.dark ? Color.black : Theme.poisonBright
                    let bottom = d.dark ? Theme.poisonBright : Color(hex: 0x004D00)
                    let shading = GraphicsContext.Shading.linearGradient(
                        Gradient(colors: [top.opacity(progress * 0.9), bottom.opacity(progress * 0.4)]),
                        startPoint: CGPoint(x: 0, y: fromTop ? 0 : size.height), endPoint: CGPoint(x: 0, y: fromTop ? size.height : 0))
                    ctx.fill(path, with: shading)
                }
                PoisonOverlay.topDrips.forEach { drip($0, fromTop: true) }
                PoisonOverlay.bottomDrips.forEach { drip($0, fromTop: false) }
            }
            .animation(.easeInOut(duration: 4), value: progress)
        }
    }

    // MARK: Bubbles

    private struct Bubble { let left: Double; let size: Double; let delay: Double; let dur: Double; let dark: Bool }
    private static let slowBubbles: [Bubble] = [
        .init(left: 0.12, size: 8, delay: 0, dur: 3.2, dark: false), .init(left: 0.28, size: 5, delay: 0.7, dur: 2.6, dark: true),
        .init(left: 0.42, size: 10, delay: 1.4, dur: 3.8, dark: false), .init(left: 0.55, size: 6, delay: 0.3, dur: 2.9, dark: true),
        .init(left: 0.68, size: 9, delay: 1.1, dur: 3.4, dark: false), .init(left: 0.80, size: 5, delay: 0.5, dur: 2.4, dark: true),
        .init(left: 0.20, size: 7, delay: 2.0, dur: 3.1, dark: true), .init(left: 0.90, size: 6, delay: 1.8, dur: 2.7, dark: false),
    ]
    private static let fastBubbles: [Bubble] = [
        .init(left: 0.05, size: 22, delay: 0, dur: 0.45, dark: true), .init(left: 0.15, size: 8, delay: 0.05, dur: 0.38, dark: false), .init(left: 0.24, size: 30, delay: 0.1, dur: 0.52, dark: false),
        .init(left: 0.33, size: 12, delay: 0.02, dur: 0.41, dark: true), .init(left: 0.40, size: 5, delay: 0.08, dur: 0.35, dark: false), .init(left: 0.48, size: 26, delay: 0.15, dur: 0.48, dark: false),
        .init(left: 0.57, size: 9, delay: 0.03, dur: 0.39, dark: true), .init(left: 0.63, size: 18, delay: 0.12, dur: 0.44, dark: false), .init(left: 0.72, size: 35, delay: 0, dur: 0.55, dark: false),
        .init(left: 0.79, size: 7, delay: 0.07, dur: 0.36, dark: true), .init(left: 0.86, size: 14, delay: 0.09, dur: 0.42, dark: false), .init(left: 0.94, size: 28, delay: 0.04, dur: 0.50, dark: false),
    ]

    private struct Bubbles: View {

        @Environment(\.motionEnabled) private var motion
        let poison: Int
        let progress: Double
        let fast: Bool
        var body: some View {
            TimelineView(.animation(minimumInterval: 1 / 30, paused: !motion)) { ctx in
                Canvas { gc, size in
                    let t = ctx.date.timeIntervalSinceReferenceDate
                    let list = fast ? PoisonOverlay.fastBubbles : PoisonOverlay.slowBubbles
                    let intensity = fast ? 1 : max(0, Double(poison - 4) / 6) * (poison >= 9 ? 1 : 0.6)
                    for b in list {
                        var dur = b.dur
                        var delay = b.delay
                        if !fast {
                            if poison >= 9 { dur *= 0.15; delay = 0 } else if poison >= 8 { dur *= 0.3 }
                        }
                        let phase = ((t - delay) / dur).truncatingRemainder(dividingBy: 1)
                        guard phase >= 0 else { continue }
                        // 0→60 %: rise 60 px, grow 1.1; 60→100 %: rise to 110 px, shrink to 0.6, fade out.
                        let rise = fast ? (phase < 0.5 ? phase / 0.5 * 50 : 50 + (phase - 0.5) / 0.5 * 70) : (phase < 0.6 ? phase / 0.6 * 60 : 60 + (phase - 0.6) / 0.4 * 50)
                        let scale = fast ? (phase < 0.5 ? 1 + 0.05 * phase / 0.5 : 1.05 - 0.55 * (phase - 0.5) / 0.5) : (phase < 0.6 ? 1 + 0.1 * phase / 0.6 : 1.1 - 0.5 * (phase - 0.6) / 0.4)
                        let startAlpha = fast ? 1.0 : (poison >= 9 ? 1.0 : 0.8)
                        let midAlpha = fast ? 0.8 : (poison >= 9 ? 0.85 : 0.6)
                        let alpha = phase < 0.6 ? startAlpha + (midAlpha - startAlpha) * phase / 0.6 : midAlpha * (1 - (phase - 0.6) / 0.4)
                        let d = b.size * scale
                        let rect = CGRect(x: size.width * b.left - d / 2, y: size.height + 12 - rise - d / 2, width: d, height: d)
                        let fill: Color = b.dark ? .black.opacity(fast ? 0.85 : intensity) : Color(red: 0, green: (fast ? 200 : 180 + progress * 75) / 255, blue: fast ? 60/255 : 0).opacity(fast ? 0.75 : intensity)
                        let stroke: Color = b.dark ? Color(red: 0, green: 200/255, blue: 60/255).opacity((fast ? 0.6 : intensity * 0.6)) : Color(red: 0, green: 1, blue: 80/255).opacity(fast ? 0.6 : intensity * 0.8)
                        gc.fill(Path(ellipseIn: rect), with: .color(fill.opacity(alpha)))
                        gc.stroke(Path(ellipseIn: rect), with: .color(stroke.opacity(alpha)), lineWidth: 1)
                    }
                }
            }
        }
    }

    // MARK: Phyrexian symbols

    private struct EdgeSymbol: View {

        @Environment(\.motionEnabled) private var motion
        enum Side { case left, right }
        let progress: Double
        let poison: Int
        let side: Side
        let size: CGSize

        var body: some View {
            let dim = 140 + progress * 200
            let inset = -(30 + progress * 20)
            let tilt = progress * 12 * (side == .left ? -1 : 1)
            TimelineView(.animation(minimumInterval: 1 / 15, paused: (poison < 9) || !motion)) { ctx in
                let t = ctx.date.timeIntervalSinceReferenceDate
                let orbit = poison >= 9 ? (side == .left ? (t / 20).truncatingRemainder(dividingBy: 1) : (t / 27).truncatingRemainder(dividingBy: 1)) : 0
                let wobble = poison >= 9 ? sin(orbit * 2 * .pi) : 0
                Image("phyrexian").resizable().renderingMode(.template)
                    .foregroundStyle(.black)
                    .frame(width: dim, height: dim)
                    .opacity(progress * 0.7)
                    .rotationEffect(.degrees(tilt + wobble * 16))
                    .scaleEffect(1 + wobble * 0.3)
                    .position(x: side == .left ? inset + dim / 2 : size.width - inset - dim / 2,
                              y: size.height * (side == .left ? 0.30 : 0.65) + wobble * 12)
            }
            .animation(.easeInOut(duration: 0.8), value: progress)
        }
    }

    private struct RisingSymbols: View {

        @Environment(\.motionEnabled) private var motion
        let size: CGSize
        private static let specs: [(left: Double, size: Double, dur: Double, delay: Double, rotate: Double)] = [
            (0.42, 120, 18, 0), (0.54, 90, 22, 9), (0.35, 140, 25, 14),
        ].map { ($0.0, $0.1, $0.2, $0.3, [-15.0, 20, -8][Int($0.1) % 3]) }

        var body: some View {
            TimelineView(.animation(minimumInterval: 1 / 15, paused: !motion)) { ctx in
                let t = ctx.date.timeIntervalSinceReferenceDate
                ForEach(Array(Self.specs.enumerated()), id: \.offset) { i, s in
                    let phase = ((t - s.delay) / s.dur).truncatingRemainder(dividingBy: 1)
                    let p = phase < 0 ? phase + 1 : phase
                    let y = size.height + s.size + 40 - p * (size.height + s.size + 440) * 0.95
                    let alpha = p < 0.1 ? p / 0.1 * 0.4 : p < 0.45 ? 0.4 + (p - 0.1) / 0.35 * 0.25 : p < 0.88 ? 0.65 * (1 - (p - 0.45) / 0.43) : 0
                    Image("phyrexian").resizable().renderingMode(.template)
                        .foregroundStyle(.black)
                        .frame(width: s.size, height: s.size)
                        .rotationEffect(.degrees(s.rotate + sin(p * 4 * .pi) * 8))
                        .scaleEffect(0.7 + 0.4 * sin(p * .pi))
                        .opacity(alpha)
                        .position(x: size.width * s.left + (i % 2 == 0 ? -8 : 8) * sin(p * 6 * .pi), y: y)
                }
            }
        }
    }
}
