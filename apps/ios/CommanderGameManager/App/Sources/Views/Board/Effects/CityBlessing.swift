import SwiftUI

/// City's Blessing celebration (web `CityBlessing`): god rays from the top,
/// a castle sliding in from the left and a cathedral from the right, a city
/// skyline along the bottom, drifting clouds, fireworks, and a row of
/// marching flags. `exiting` runs the 3.8 s fade-out tail.
struct CityBlessing: View {
    let exiting: Bool
    @State private var entered = false

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width, h = geo.size.height
            ZStack {
                // God rays
                TimelineView(.animation(minimumInterval: 1 / 20)) { ctx in
                    let t = ctx.date.timeIntervalSinceReferenceDate
                    let pulse = 0.8 + 0.2 * sin(t / 6 * 2 * .pi)
                    Canvas { gc, size in
                        let origin = CGPoint(x: size.width * 0.5, y: -size.height * 0.4)
                        for i in 0..<9 {
                            let a = -1.15 + Double(i) * 0.29 + sin(t / 11 + Double(i)) * 0.03
                            let len = size.height * 1.8
                            var p = Path()
                            p.move(to: origin)
                            p.addLine(to: CGPoint(x: origin.x + cos(.pi / 2 + a - 0.045) * len, y: origin.y + sin(.pi / 2 + a - 0.045) * len))
                            p.addLine(to: CGPoint(x: origin.x + cos(.pi / 2 + a + 0.045) * len, y: origin.y + sin(.pi / 2 + a + 0.045) * len))
                            p.closeSubpath()
                            gc.fill(p, with: .linearGradient(Gradient(colors: [Color(hex: 0xFFF1C4).opacity(0.28 * pulse), .clear]), startPoint: origin, endPoint: CGPoint(x: origin.x, y: size.height)))
                        }
                    }
                }
                // Clouds
                TimelineView(.animation(minimumInterval: 1 / 15)) { ctx in
                    let t = ctx.date.timeIntervalSinceReferenceDate
                    ForEach(0..<3, id: \.self) { i in
                        let p = ((t + Double(i) * 23) / 60).truncatingRemainder(dividingBy: 1)
                        Cloud().fill(.white.opacity(p < 0.08 ? p / 0.08 * 0.3 : p > 0.88 ? 0.25 * (1 - (p - 0.88) / 0.12) : 0.28))
                            .frame(width: 90 + CGFloat(i) * 30, height: 36 + CGFloat(i) * 8)
                            .position(x: w + 140 - p * (w + 420), y: h * (0.12 + Double(i) * 0.1))
                    }
                }
                // Castle (left) and cathedral (right)
                Castle().fill(Color(hex: 0x3B2A1A).opacity(0.55))
                    .frame(width: min(w * 0.42, 260), height: min(h * 0.5, 150))
                    .position(x: entered ? min(w * 0.42, 260) / 2 + 4 : -200, y: h - min(h * 0.5, 150) / 2 - 10)
                Cathedral().fill(Color(hex: 0x2E2117).opacity(0.55))
                    .frame(width: min(w * 0.3, 180), height: min(h * 0.6, 190))
                    .position(x: entered ? w - min(w * 0.3, 180) / 2 - 4 : w + 200, y: h - min(h * 0.6, 190) / 2 - 6)
                // Skyline along the bottom
                Skyline().fill(Color(hex: 0x1B1410).opacity(0.5))
                    .frame(width: w, height: min(h * 0.22, 70))
                    .position(x: w / 2, y: h - min(h * 0.22, 70) / 2)
                    .opacity(entered ? 1 : 0)
                // Fireworks
                Fireworks(size: geo.size)
                // Flags marching along the bottom edge
                Flags(width: w).frame(height: 60).position(x: w / 2, y: h - 30)
                    .offset(y: entered ? 0 : 220)
            }
            .clipped()
            .opacity(exiting ? 0 : 1)
            .animation(.easeInOut(duration: exiting ? 3.6 : 0.4), value: exiting)
        }
        .allowsHitTesting(false)
        .onAppear { withAnimation(.easeOut(duration: 1.6)) { entered = true } }
    }

    // MARK: Shapes

    private struct Cloud: Shape {
        func path(in r: CGRect) -> Path {
            var p = Path()
            p.addEllipse(in: CGRect(x: r.minX, y: r.midY - r.height * 0.3, width: r.width * 0.5, height: r.height * 0.6))
            p.addEllipse(in: CGRect(x: r.minX + r.width * 0.25, y: r.minY, width: r.width * 0.5, height: r.height * 0.9))
            p.addEllipse(in: CGRect(x: r.minX + r.width * 0.5, y: r.midY - r.height * 0.35, width: r.width * 0.5, height: r.height * 0.7))
            return p
        }
    }

    private struct Castle: Shape {
        func path(in r: CGRect) -> Path {
            var p = Path()
            let w = r.width, h = r.height
            // Two towers and a wall with crenellations.
            p.addRect(CGRect(x: 0, y: h * 0.25, width: w * 0.22, height: h * 0.75))
            p.addRect(CGRect(x: w * 0.78, y: h * 0.18, width: w * 0.22, height: h * 0.82))
            p.addRect(CGRect(x: w * 0.2, y: h * 0.52, width: w * 0.6, height: h * 0.48))
            for i in 0..<6 { p.addRect(CGRect(x: w * (0.2 + Double(i) * 0.1), y: h * 0.44, width: w * 0.05, height: h * 0.1)) }
            for i in 0..<3 { p.addRect(CGRect(x: w * Double(i) * 0.08, y: h * 0.17, width: w * 0.05, height: h * 0.1)) }
            for i in 0..<3 { p.addRect(CGRect(x: w * (0.78 + Double(i) * 0.08), y: h * 0.1, width: w * 0.05, height: h * 0.1)) }
            p.move(to: CGPoint(x: w * 0.11, y: 0)); p.addLine(to: CGPoint(x: w * 0.0, y: h * 0.25)); p.addLine(to: CGPoint(x: w * 0.22, y: h * 0.25)); p.closeSubpath()
            // Gate
            p.addRoundedRect(in: CGRect(x: w * 0.42, y: h * 0.7, width: w * 0.16, height: h * 0.3), cornerSize: CGSize(width: w * 0.08, height: w * 0.08))
            return p
        }
    }

    private struct Cathedral: Shape {
        func path(in r: CGRect) -> Path {
            var p = Path()
            let w = r.width, h = r.height
            p.addRect(CGRect(x: w * 0.15, y: h * 0.45, width: w * 0.7, height: h * 0.55))
            p.move(to: CGPoint(x: w * 0.5, y: 0)); p.addLine(to: CGPoint(x: w * 0.3, y: h * 0.45)); p.addLine(to: CGPoint(x: w * 0.7, y: h * 0.45)); p.closeSubpath()
            p.addRect(CGRect(x: w * 0.46, y: h * 0.1, width: w * 0.08, height: h * 0.35))
            p.addRect(CGRect(x: 0, y: h * 0.6, width: w * 0.15, height: h * 0.4))
            p.addRect(CGRect(x: w * 0.85, y: h * 0.6, width: w * 0.15, height: h * 0.4))
            p.move(to: CGPoint(x: w * 0.075, y: h * 0.4)); p.addLine(to: CGPoint(x: 0, y: h * 0.6)); p.addLine(to: CGPoint(x: w * 0.15, y: h * 0.6)); p.closeSubpath()
            p.move(to: CGPoint(x: w * 0.925, y: h * 0.4)); p.addLine(to: CGPoint(x: w * 0.85, y: h * 0.6)); p.addLine(to: CGPoint(x: w, y: h * 0.6)); p.closeSubpath()
            return p
        }
    }

    private struct Skyline: Shape {
        func path(in r: CGRect) -> Path {
            var p = Path()
            var x: CGFloat = 0
            var i = 0
            while x < r.width {
                let bw = CGFloat(18 + (i * 37) % 30)
                let bh = r.height * CGFloat(0.35 + Double((i * 53) % 65) / 100)
                p.addRect(CGRect(x: x, y: r.height - bh, width: bw, height: bh))
                x += bw + 3
                i += 1
            }
            return p
        }
    }

    private struct Fireworks: View {
        let size: CGSize
        var body: some View {
            TimelineView(.animation(minimumInterval: 1 / 24)) { ctx in
                let t = ctx.date.timeIntervalSinceReferenceDate
                Canvas { gc, _ in
                    for i in 0..<3 {
                        let period = 4.5 + Double(i) * 1.3
                        let p = ((t + Double(i) * 1.7) / period).truncatingRemainder(dividingBy: 1)
                        let x = size.width * (0.2 + Double(i) * 0.3)
                        let burstY = size.height * (0.18 + Double(i % 2) * 0.12)
                        if p > 0.6 && p < 0.82 {
                            // Rocket rising.
                            let f = (p - 0.6) / 0.22
                            let y = size.height - (size.height - burstY) * f
                            gc.fill(Path(ellipseIn: CGRect(x: x - 1.5, y: y, width: 3, height: 10)), with: .color(.white.opacity(0.55 * (1 - f * 0.5))))
                        } else if p >= 0.82 && p < 0.96 {
                            // Burst: ring of sparks expanding and fading.
                            let f = (p - 0.82) / 0.14
                            let radius = 10 + 60 * f
                            let color = [Theme.brightGold, Theme.cityMagenta, Color(hex: 0x4FC3F7)][i]
                            for k in 0..<14 {
                                let a = Double(k) / 14 * 2 * .pi
                                let px = x + cos(a) * radius, py = burstY + sin(a) * radius + 25 * f * f
                                gc.fill(Path(ellipseIn: CGRect(x: px - 2, y: py - 2, width: 4, height: 4)), with: .color(color.opacity(0.9 * (1 - f))))
                            }
                            gc.fill(Path(ellipseIn: CGRect(x: x - 20 * (1 - f), y: burstY - 20 * (1 - f), width: 40 * (1 - f), height: 40 * (1 - f))), with: .color(.white.opacity(0.5 * (1 - f))))
                        }
                    }
                }
            }
        }
    }

    private struct Flags: View {
        let width: CGFloat
        var body: some View {
            TimelineView(.animation(minimumInterval: 1 / 24)) { ctx in
                let t = ctx.date.timeIntervalSinceReferenceDate
                let count = max(3, Int(width / 70))
                HStack(spacing: 0) {
                    ForEach(0..<count, id: \.self) { i in
                        let gust = sin(t * 2.2 + Double(i) * 0.9) * 0.5 + sin(t * 5.1 + Double(i)) * 0.5
                        ZStack(alignment: .topLeading) {
                            Rectangle().fill(Color(hex: 0x3B2A1A)).frame(width: 3, height: 60)
                            FlagShape(wave: gust)
                                .fill(LinearGradient(colors: [Theme.cityMagenta, Theme.cityPurple, Theme.cityIndigo], startPoint: .leading, endPoint: .trailing))
                                .frame(width: 40, height: 26)
                                .offset(x: 3, y: 2)
                                .transformEffect(CGAffineTransform(a: 1, b: 0, c: CGFloat(gust) * 0.06, d: 1, tx: 0, ty: 0))
                        }
                        .rotationEffect(.degrees(13 + 7 * gust), anchor: .bottomLeading)
                        .frame(width: width / CGFloat(count), alignment: .leading)
                    }
                }
            }
        }
    }

    private struct FlagShape: Shape {
        var wave: Double
        var animatableData: Double { get { wave } set { wave = newValue } }
        func path(in r: CGRect) -> Path {
            var p = Path()
            p.move(to: CGPoint(x: 0, y: 0))
            p.addLine(to: CGPoint(x: r.width + wave * 3, y: -wave * 2))
            p.addLine(to: CGPoint(x: r.width + wave * 2, y: r.height + wave * 3))
            p.addLine(to: CGPoint(x: 0, y: r.height))
            p.closeSubpath()
            return p
        }
    }
}
