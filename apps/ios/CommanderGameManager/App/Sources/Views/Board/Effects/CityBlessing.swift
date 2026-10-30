import SwiftUI

/// City's Blessing celebration, the web `CityBlessing` scene drawn with the
/// same geometry and timings: god rays from the top-left corner, the castle
/// and house row sliding in from the left, rolling hills, a distant castle on
/// a mountain, a distant skyline, the cathedral sliding in from the right,
/// fireworks, drifting clouds and a row of marching flags flying the
/// commander's art (stolen by the biggest commander-damage threat as that
/// damage climbs). `exiting` runs the fade-out tail.
struct CityBlessing: View {
    let exiting: Bool
    let commanders: [String]
    let threat: ThreatSource?
    @Environment(\.colorScheme) private var scheme
    @State private var start = Date()
    @State private var exitStart: Date?
    @State private var homeArt: [CommanderArtLoader] = []
    @State private var threatArt = CommanderArtLoader()

    var body: some View {
        // Read the loaders in the body (tracked), then hand plain values to the
        // canvas so the scene redraws as art resolves.
        let home = homeArt.map { ($0.image, $0.name ?? "") }
        SceneCanvas(start: start, exitStart: exitStart, dark: scheme == .dark, home: home, threat: threatFlag)
            .allowsHitTesting(false)
            .onAppear {
                homeArt = commanders.map { n in let l = CommanderArtLoader(); l.load(n); return l }
                if let t = threat?.commanderName, !t.isEmpty { threatArt.load(t) }
            }
            .onChange(of: threat?.commanderName) { _, n in if let n, !n.isEmpty { threatArt.load(n) } }
            .onChange(of: exiting) { _, e in exitStart = e ? Date() : nil }
    }

    private struct SceneCanvas: View {

        @Environment(\.motionEnabled) private var motion
        let start: Date
        let exitStart: Date?
        let dark: Bool
        let home: [(UIImage?, String)]
        let threat: (image: UIImage?, name: String, count: Int)?

        var body: some View {
            TimelineView(.animation(minimumInterval: 1 / 30, paused: !motion)) { ctx in
                let age = motion ? ctx.date.timeIntervalSince(start) : 12
                let exitAge = exitStart.map { ctx.date.timeIntervalSince($0) }
                Canvas { gc, size in
                    let scene = Scene(size: size, age: age, exitAge: exitAge, dark: dark)
                    scene.godRays(&gc)
                    scene.hills(&gc)
                    scene.distantCastle(&gc)
                    scene.skyline(&gc)
                    scene.houseRow(&gc)
                    scene.cathedral(&gc)
                    scene.fireworks(&gc)
                    scene.clouds(&gc)
                    scene.flags(&gc, home: home, threat: threat)
                }
            }
            .clipped()
        }
    }

    private var threatFlag: (image: UIImage?, name: String, count: Int)? {
        guard let threat, let img = threatArt.image else { return nil }
        return (img, threat.commanderName, min(threat.damage * 12 / 20, 12))
    }

    // MARK: - Scene

    private struct Scene {
        let size: CGSize
        let age: Double
        let exitAge: Double?
        let dark: Bool
        var w: CGFloat { size.width }
        var h: CGFloat { size.height }

        // Timing helpers (web keyframes: delay, duration, easing).
        func fade(delay: Double, dur: Double, ease: (Double) -> Double = Scene.easeOut) -> Double {
            ease(min(max((age - delay) / dur, 0), 1))
        }
        /// Fade-out tail for a layer, 1 → 0 after `delay` over `dur` once exiting.
        func exitFade(delay: Double, dur: Double) -> Double {
            guard let e = exitAge else { return 1 }
            return 1 - min(max((e - delay) / dur, 0), 1)
        }
        static func easeOut(_ t: Double) -> Double { 1 - pow(1 - t, 2) }
        static func easeIn(_ t: Double) -> Double { t * t }
        static func easeInOut(_ t: Double) -> Double { t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2 }
        static func lerp(_ a: Double, _ b: Double, _ t: Double) -> Double { a + (b - a) * t }
        /// Piecewise-linear keyframe lookup over [0, 1].
        static func key(_ p: Double, _ frames: [(Double, Double)]) -> Double {
            for i in 1..<frames.count where p <= frames[i].0 {
                let a = frames[i - 1], b = frames[i]
                return a.1 + (b.1 - a.1) * ((p - a.0) / max(b.0 - a.0, 0.0001))
            }
            return frames.last!.1
        }

        var silhouetteFill: Color { dark ? Color(hex: 0x1a1510) : Color(hex: 0xbcb4a9) }
        var silhouetteStroke: Color { dark ? .black.opacity(0.7) : Color(red: 95/255, green: 85/255, blue: 72/255).opacity(0.45) }

        /// Fills `rect` content drawn by `body` and fades it to transparent
        /// from `from` of its height down (the web's mask-image).
        func masked(_ gc: inout GraphicsContext, rect: CGRect, from: Double, opacity: Double, _ body: (inout GraphicsContext) -> Void) {
            guard opacity > 0.001 else { return }
            gc.drawLayer { layer in
                layer.opacity = opacity
                body(&layer)
                layer.blendMode = .destinationIn
                layer.fill(Path(rect), with: .linearGradient(Gradient(stops: [.init(color: .black, location: 0), .init(color: .black, location: from), .init(color: .clear, location: 1)]),
                                                             startPoint: CGPoint(x: rect.midX, y: rect.minY), endPoint: CGPoint(x: rect.midX, y: rect.maxY)))
            }
        }

        // God rays: polygons from the top-left corner of a 100×100 box stretched
        // over the panel, blurred, fading in over 2 s after 2 s, then pulsing.
        func godRays(_ gc: inout GraphicsContext) {
            let base = fade(delay: 2, dur: 2) * exitFade(delay: 0.3, dur: 1.4)
            let pulse = age > 4 ? Self.key(((age - 4) / 6).truncatingRemainder(dividingBy: 1), [(0, 0.8), (0.4, 1), (0.7, 0.7), (1, 0.8)]) : 0.8
            let opacity = base * pulse
            guard opacity > 0.001 else { return }
            let rays: [(String, Double)] = [
                ("0,0 4,100 22,100", 0.7), ("0,0 26,100 44,100", 0.5), ("0,0 48,100 66,100", 0.6), ("0,0 70,100 88,100", 0.4),
                ("0,0 92,100 100,84", 0.55), ("0,0 100,8 100,16", 0.45), ("0,0 100,38 100,46", 0.35), ("0,0 100,65 100,73", 0.45),
            ]
            let gold = Color(hex: 0xFFE050)
            let shading = GraphicsContext.Shading.linearGradient(
                Gradient(stops: [.init(color: gold.opacity(0.6), location: 0), .init(color: gold.opacity(0.15), location: 0.6), .init(color: gold.opacity(0), location: 1)]),
                startPoint: .zero, endPoint: CGPoint(x: w, y: h))
            gc.drawLayer { layer in
                layer.opacity = opacity
                layer.addFilter(.blur(radius: 4))
                for (pts, op) in rays {
                    let path = Path(svg: "M" + pts + "Z").fitted(viewBox: CGSize(width: 100, height: 100), in: CGRect(origin: .zero, size: size))
                    layer.opacity = opacity * op
                    layer.fill(path, with: shading)
                }
            }
        }

        // Castle + house row: 640×240 box at bottom -55, left -80, width w+80, height 150.
        func houseRow(_ gc: inout GraphicsContext) {
            let t = fade(delay: 0, dur: 1.8)
            let exitT = exitAge.map { Self.easeIn(min(max(($0 - 1.6) / 1.6, 0), 1)) } ?? 0
            let dx = -280 * (1 - t) - 280 * exitT
            let opacity = t * (1 - exitT)
            guard opacity > 0.001 else { return }
            let rect = CGRect(x: -80 + dx, y: h + 55 - 150, width: w + 80, height: 150)
            let vb = CGSize(width: 640, height: 240)
            gc.drawLayer { layer in
                layer.opacity = opacity
                let body = Path(svg: "M0,240 L0,62 L40,26 L80,62 L80,92 L86,92 L86,80 L94,80 L94,92 L102,92 L102,80 L110,80 L110,92 L118,92 L118,80 L126,80 L126,92 L126,68 L150,42 L174,68 L174,92 L182,92 L182,80 L190,80 L190,92 L198,92 L198,80 L206,80 L206,92 L214,92 L214,80 L222,80 L222,92 L220,62 L260,30 L300,62 L300,148 L320,118 L340,148 L360,130 L380,148 L380,138 L396,84 L412,138 L432,112 L452,138 L452,142 L472,96 L492,142 L512,120 L532,142 L532,136 L550,82 L568,136 L588,116 L608,138 L608,142 L624,106 L640,132 L640,240 Z").fitted(viewBox: vb, in: rect)
                layer.fill(body, with: .color(silhouetteFill))
                layer.stroke(body, with: .color(silhouetteStroke), lineWidth: 1.2)
                func r(_ x: Double, _ y: Double, _ wd: Double, _ ht: Double, _ a: Double) {
                    layer.fill(Path(roundedRect: CGRect(x: x, y: y, width: wd, height: ht), cornerRadius: 1).fitted(viewBox: vb, in: rect), with: .color(.black.opacity(a)))
                }
                func line(_ x1: Double, _ y1: Double, _ x2: Double, _ y2: Double, _ a: Double, _ lw: Double) {
                    var p = Path(); p.move(to: CGPoint(x: x1, y: y1)); p.addLine(to: CGPoint(x: x2, y: y2))
                    layer.stroke(p.fitted(viewBox: vb, in: rect), with: .color(.black.opacity(a)), lineWidth: lw)
                }
                for (x, y, wd, ht) in [(28.0, 100.0, 5.0, 20.0), (48, 100, 5, 20), (248, 100, 5, 20), (268, 100, 5, 20), (147, 112, 6, 24)] { r(x, y, wd, ht, 0.7) }
                line(2, 130, 78, 130, 0.5, 1.5); line(222, 130, 298, 130, 0.5, 1.5); line(80, 160, 220, 160, 0.4, 1.5)
                line(2, 170, 78, 170, 0.3, 1); line(2, 200, 78, 200, 0.3, 1); line(222, 170, 298, 170, 0.3, 1); line(222, 200, 298, 200, 0.3, 1)
                for (x, y, wd, ht) in [(326.0, 154.0, 5.0, 18.0), (400, 150, 5, 18), (460, 150, 5, 18), (556, 150, 5, 18), (616, 150, 4, 16)] {
                    layer.fill(Path(roundedRect: CGRect(x: x, y: y, width: wd, height: ht), cornerRadius: 1).fitted(viewBox: vb, in: rect), with: .color(silhouetteFill))
                }
                for (x, y, wd, ht) in [(305.0, 130.0, 8.0, 11.0), (363, 138, 8, 10), (416, 148, 8, 11), (436, 148, 8, 11), (496, 150, 8, 11), (516, 148, 8, 11), (572, 146, 7, 10), (592, 148, 7, 10)] { r(x, y, wd, ht, 0.7) }
                for (x, y) in [(340.0, 148.0), (380, 138), (412, 138), (452, 138), (492, 142), (532, 136), (568, 136), (608, 138)] { line(x, y, x, 240, 0.35, 1) }
            }
        }

        // Rolling hills: 600×100 box at bottom 55, full width, height 80, masked below 55 %.
        func hills(_ gc: inout GraphicsContext) {
            let opacity = fade(delay: 0.5, dur: 4) * exitFade(delay: 1.2, dur: 0.8)
            let rect = CGRect(x: 0, y: h - 55 - 80, width: w, height: 80)
            let vb = CGSize(width: 600, height: 100)
            let fill = dark ? Color(hex: 0x3b4a63) : Color(hex: 0x8f9bb3)
            masked(&gc, rect: rect, from: 0.55, opacity: opacity) { layer in
                for (d, a) in [("M0,100 C90,10 200,55 310,22 C430,-5 510,42 600,16 L600,100 Z", 0.35), ("M0,100 C75,25 175,60 295,38 C405,16 505,55 600,36 L600,100 Z", 0.5), ("M0,100 C60,45 160,70 275,54 C382,38 480,66 600,50 L600,100 Z", 0.68)] {
                    layer.fill(Path(svg: d).fitted(viewBox: vb, in: rect), with: .color(fill.opacity(a)))
                }
            }
        }

        // Distant castle on a mountain: 160×200 box at bottom 48, left 3 %, 112×128.
        func distantCastle(_ gc: inout GraphicsContext) {
            let opacity = fade(delay: 0.9, dur: 3.5) * exitFade(delay: 1.4, dur: 0.8)
            let rect = CGRect(x: w * 0.03, y: h - 48 - 128, width: 112, height: 128)
            let vb = CGSize(width: 160, height: 200)
            let fill = dark ? Color(hex: 0x2c3750) : Color(hex: 0x79849e)
            masked(&gc, rect: rect, from: 0.6, opacity: opacity) { layer in
                layer.fill(Path(svg: "M0,200 L46,110 L46,80 L41,80 L56,46 L71,80 L66,80 L66,98 L82,98 L82,62 L76,62 L92,26 L108,62 L102,62 L102,98 L118,98 L118,80 L113,80 L128,46 L143,80 L138,80 L138,110 L160,200 Z").fitted(viewBox: vb, in: rect), with: .color(fill))
                let pennant = Color(red: 200/255, green: 162/255, blue: 60/255).opacity(0.8)
                for d in ["M92,26 L104,29 L92,32 Z", "M56,46 L66,48.5 L56,51 Z", "M128,46 L138,48.5 L128,51 Z"] {
                    layer.fill(Path(svg: d).fitted(viewBox: vb, in: rect), with: .color(pennant))
                }
            }
        }

        // Distant skyline: 800×80 box at bottom 10, full width, height 83.
        func skyline(_ gc: inout GraphicsContext) {
            let opacity = fade(delay: 1.2, dur: 3) * exitFade(delay: 1.6, dur: 0.8)
            let rect = CGRect(x: 0, y: h - 10 - 83, width: w, height: 83)
            let fill = dark ? Color(hex: 0x251e15) : Color(hex: 0xcbc4b9)
            masked(&gc, rect: rect, from: 0.6, opacity: opacity) { layer in
                layer.fill(Path(svg: Self.skylineD).fitted(viewBox: CGSize(width: 800, height: 80), in: rect), with: .color(fill))
            }
        }
        static let skylineD = "M0,80 L0,55 L8,40 L4,40 L14,8 L24,40 L20,40 L22,55 L40,55 L40,62 L55,62 L55,42 L65,14 L75,42 L75,62 L92,62 L92,55 L102,40 L102,26 L106,6 L110,26 L110,40 L120,55 L120,62 L138,62 L138,55 L150,18 L162,55 L162,62 L176,62 L176,55 L186,38 L186,24 L190,5 L194,24 L194,38 L204,55 L204,62 L222,62 L222,55 L235,42 L248,55 L248,62 L262,62 L262,55 L274,40 L274,26 L278,6 L282,26 L282,40 L294,55 L294,62 L312,62 L312,55 L325,42 L338,55 L338,62 L352,62 L352,55 L364,38 L364,24 L368,5 L372,24 L372,38 L384,55 L384,62 L400,62 L400,55 L413,42 L426,55 L426,62 L440,62 L440,55 L450,40 L450,26 L454,6 L458,26 L458,40 L468,55 L468,62 L485,62 L485,55 L498,42 L511,55 L511,62 L525,62 L525,55 L537,38 L537,24 L541,5 L545,24 L545,38 L557,55 L557,62 L574,62 L574,55 L587,42 L600,55 L600,62 L615,62 L615,55 L625,40 L625,26 L629,6 L633,26 L633,40 L643,55 L643,62 L660,62 L660,55 L675,42 L690,55 L690,62 L705,62 L705,55 L717,38 L717,24 L721,5 L725,24 L725,38 L737,55 L737,62 L755,62 L800,62 L800,80 Z"

        // Cathedral: 200×220 at bottom -35, right -40, sliding in from the right.
        func cathedral(_ gc: inout GraphicsContext) {
            let t = fade(delay: 0.3, dur: 1.8)
            let exitT = exitAge.map { Self.easeIn(min(max(($0 - 1.8) / 1.6, 0), 1)) } ?? 0
            let dx = 240 * (1 - t) + 240 * exitT
            let opacity = t * (1 - exitT)
            guard opacity > 0.001 else { return }
            let rect = CGRect(x: w + 40 - 200 + dx, y: h + 35 - 220, width: 200, height: 220)
            let vb = CGSize(width: 200, height: 220)
            gc.drawLayer { layer in
                layer.opacity = opacity
                let body = Path(svg: "M0,220 L0,148 L8,148 L8,100 L4,100 L24,12 L44,100 L40,100 L40,148 L52,148 L52,132 L100,96 L148,132 L148,148 L160,148 L160,100 L156,100 L176,12 L196,100 L192,100 L192,148 L200,148 L200,220 Z").fitted(viewBox: vb, in: rect)
                layer.fill(body, with: .color(silhouetteFill))
                layer.stroke(body, with: .color(silhouetteStroke), lineWidth: 1.2)
                for (x, y) in [(17.0, 122.0), (178, 122)] {
                    layer.fill(Path(roundedRect: CGRect(x: x, y: y, width: 5, height: 18), cornerRadius: 2).fitted(viewBox: vb, in: rect), with: .color(.black.opacity(0.7)))
                }
                layer.stroke(Path(ellipseIn: CGRect(x: 89, y: 109, width: 22, height: 22)).fitted(viewBox: vb, in: rect), with: .color(.black.opacity(0.65)), lineWidth: 2.5)
                layer.stroke(Path(ellipseIn: CGRect(x: 95, y: 115, width: 10, height: 10)).fitted(viewBox: vb, in: rect), with: .color(.black.opacity(0.5)), lineWidth: 1.5)
                for (x1, x2, y, a, lw) in [(52.0, 148.0, 156.0, 0.5, 1.5), (2, 48, 164, 0.45, 1.2), (152, 198, 164, 0.45, 1.2)] {
                    var p = Path(); p.move(to: CGPoint(x: x1, y: y)); p.addLine(to: CGPoint(x: x2, y: y))
                    layer.stroke(p.fitted(viewBox: vb, in: rect), with: .color(.black.opacity(a)), lineWidth: lw)
                }
                layer.fill(Path(svg: "M85,220 L85,192 Q100,175 115,192 L115,220 Z").fitted(viewBox: vb, in: rect), with: .color(.black.opacity(0.7)))
            }
        }

        // Fireworks: five launchers, each a rocket, a flash and eight sparks on its own cycle.
        static let fwDirs: [(Double, Double)] = [(0, -58), (41, -41), (58, 0), (41, 41), (0, 58), (-41, 41), (-58, 0), (-41, -41)]
        static let fwColors: [UInt32] = [0xFFD700, 0xFF4444, 0x4FC3F7, 0x81C784, 0xCE93D8, 0xFF8A65, 0xF06292, 0x80DEEA]
        static let fwConfigs: [(left: Double, top: Double, delay: Double, dur: Double, color: UInt32, angle: Double, scale: Double)] = [
            (0.28, 0.38, 5.5, 6, 0x81C784, -12, 0.7), (0.68, 0.25, 7.7, 7, 0x4FC3F7, 18, 1.4), (0.50, 0.58, 10.0, 6.5, 0xFFD700, -5, 1.0),
            (0.18, 0.62, 6.6, 8, 0xFF8A65, 25, 1.7), (0.80, 0.48, 8.8, 7.5, 0xCE93D8, -20, 0.5),
        ]
        func fireworks(_ gc: inout GraphicsContext) {
            let opacity = exitFade(delay: 0, dur: 0.5)
            guard opacity > 0.001 else { return }
            for fw in Self.fwConfigs where age > fw.delay {
                let p = ((age - fw.delay) / fw.dur).truncatingRemainder(dividingBy: 1)
                let origin = CGPoint(x: w * fw.left, y: h * fw.top)
                gc.drawLayer { layer in
                    layer.opacity = opacity
                    // Rocket: rises along the launch angle between 60 % and 82 %.
                    if p >= 0.6 && p < 0.83 {
                        let f = min((p - 0.6) / 0.22, 1)
                        let y = Self.lerp(500, -8, f)
                        let a = p < 0.61 ? Self.lerp(0, 0.55, (p - 0.6) / 0.01) : Self.lerp(0.55, 0.3, f)
                        var l = layer
                        l.translateBy(x: origin.x, y: origin.y)
                        l.rotate(by: .degrees(fw.angle))
                        l.fill(Path(roundedRect: CGRect(x: -1.5, y: y, width: 3, height: 24), cornerRadius: 1), with: .color(Color(hex: fw.color).opacity(a)))
                    }
                    // Flash + sparks, scaled around the launcher.
                    if p >= 0.82 {
                        var l = layer
                        l.translateBy(x: origin.x, y: origin.y)
                        l.scaleBy(x: fw.scale, y: fw.scale)
                        let fs = Self.key(p, [(0.82, 0), (0.83, 2.2), (0.88, 0.9), (0.93, 0), (1, 0)])
                        let fa = Self.key(p, [(0.82, 0), (0.83, 0.55), (0.88, 0.25), (0.93, 0), (1, 0)])
                        if fa > 0 { l.fill(Path(ellipseIn: CGRect(x: -5 * fs, y: -5 * fs, width: 10 * fs, height: 10 * fs)), with: .color(.white.opacity(fa))) }
                        for (i, (dx, dy)) in Self.fwDirs.enumerated() {
                            let s = Self.key(p, [(0.82, 0), (0.83, 1.3), (0.94, 0.5), (1, 0)])
                            let a = Self.key(p, [(0.82, 0), (0.83, 0.65), (0.94, 0.45), (1, 0)])
                            let m = Self.key(p, [(0.82, 0), (0.83, 0), (0.94, 1), (1, 1.55)])
                            guard a > 0 else { continue }
                            l.fill(Path(ellipseIn: CGRect(x: dx * m - 2 * s, y: dy * m - 2 * s, width: 4 * s, height: 4 * s)), with: .color(Color(hex: Self.fwColors[i]).opacity(a)))
                        }
                    }
                }
            }
        }

        // Clouds: three, drifting right to left across the top.
        static let cloudConfigs: [(top: Double, scale: Double, delay: Double, dur: Double)] = [(0.04, 1.0, 4.5, 28), (0.12, 0.65, 13.5, 34), (0.02, 1.3, 23.5, 22)]
        func clouds(_ gc: inout GraphicsContext) {
            let opacity = exitFade(delay: 0, dur: 1)
            guard opacity > 0.001 else { return }
            for c in Self.cloudConfigs where age > c.delay {
                let p = ((age - c.delay) / c.dur).truncatingRemainder(dividingBy: 1)
                let x = Self.lerp(500, -280, p)
                let a = Self.key(p, [(0, 0), (0.08, 0.3), (0.88, 0.25), (1, 0)]) * opacity
                let rect = CGRect(x: x, y: h * c.top, width: 100 * c.scale, height: 40 * c.scale)
                let vb = CGSize(width: 100, height: 40)
                var cloud = Path()
                cloud.addEllipse(in: CGRect(x: 6, y: 14, width: 44, height: 28))
                cloud.addEllipse(in: CGRect(x: 30, y: 0, width: 40, height: 36))
                cloud.addEllipse(in: CGRect(x: 56, y: 11, width: 36, height: 30))
                cloud.addRect(CGRect(x: 6, y: 28, width: 86, height: 12))
                gc.fill(cloud.fitted(viewBox: vb, in: rect), with: .color(Color(red: 1, green: 245/255, blue: 220/255).opacity(0.18 * a)))
            }
        }

        // Marching flags: twelve on gold poles, rising after 4 s, the row sliding
        // across the panel over 38 s, each pole wiggling and drifting on its own.
        static let flagConfigs: [(left: Double, bottom: Double, rise: Double, wiggleDur: Double, wiggleOff: Double, driftDur: Double, driftOff: Double)] = [
            (0.30, -28, 4.00, 3.2, 0.0, 11.0, 0.0), (0.35, -24, 4.12, 2.7, -0.9, 8.5, -2.3), (0.40, -30, 4.25, 3.6, -1.8, 13.0, -5.1), (0.45, -22, 4.06, 3.0, -2.4, 9.5, -1.4),
            (0.50, -26, 4.38, 2.5, -0.6, 12.0, -3.8), (0.55, -20, 4.18, 3.9, -1.5, 8.0, -6.5), (0.60, -28, 4.44, 2.8, -2.1, 10.5, -0.7), (0.65, -24, 4.08, 3.4, -1.2, 14.0, -4.2),
            (0.37, -18, 4.30, 2.6, -1.7, 9.0, -7.0), (0.48, -16, 4.52, 3.7, -2.7, 11.5, -2.9), (0.57, -18, 4.20, 3.1, -0.4, 7.5, -5.5), (0.63, -15, 4.40, 2.9, -2.0, 12.5, -1.8),
        ]
        static let stealOrder = [6, 1, 10, 3, 8, 0, 11, 4, 7, 2, 9, 5]
        func flags(_ gc: inout GraphicsContext, home: [(UIImage?, String)], threat: (image: UIImage?, name: String, count: Int)?) {
            let opacity = exitFade(delay: 0, dur: 1.1)
            guard opacity > 0.001, !home.isEmpty else { return }
            let march = (Self.lerp(-0.8, 0.8, (age / 38).truncatingRemainder(dividingBy: 1))) * w
            let stolen = Set(Self.stealOrder.prefix(threat?.count ?? 0))
            for (i, cfg) in Self.flagConfigs.enumerated() where age > cfg.rise {
                let riseT = Self.easeOut(min((age - cfg.rise) / 1.4, 1))
                let riseY = 220 * (1 - riseT)
                let riseA = min(riseT / 0.6, 1)
                let drift = Self.key(((age - cfg.driftOff) / cfg.driftDur).truncatingRemainder(dividingBy: 1), [(0, 0), (0.22, 18), (0.45, -10), (0.68, 24), (0.85, -6), (1, 0)])
                let wiggleP = ((age - cfg.wiggleOff) / cfg.wiggleDur).truncatingRemainder(dividingBy: 1)
                let angle = Self.key(wiggleP, [(0, 13), (0.18, 27), (0.36, 9), (0.54, 25), (0.72, 11), (0.88, 24), (1, 13)])
                let skew = Self.key(wiggleP, [(0, 0), (0.04, 0), (0.08, -3), (0.12, 0), (0.16, -3), (0.2, 1), (0.24, -2), (0.27, 0), (0.3, -1), (0.32, 0), (0.4, 5), (0.5, 7), (0.56, 4), (0.58, 0), (0.63, -2), (0.67, 0), (0.71, -2), (0.75, 0), (0.79, -1), (0.83, -1), (0.86, 0), (0.94, 5), (1, 7)])
                let flagW = Self.key(wiggleP, [(0, 58), (0.08, 62), (0.12, 56), (0.16, 61), (0.2, 56), (0.24, 60), (0.3, 59), (0.32, 58), (0.5, 56), (0.58, 58), (0.63, 61), (0.67, 56), (0.71, 60), (0.75, 57), (0.83, 59), (0.86, 58), (1, 56)])
                let flagH = Self.key(wiggleP, [(0, 42), (0.08, 45), (0.12, 39), (0.16, 44), (0.2, 40), (0.24, 43), (0.32, 42), (0.5, 48), (0.58, 42), (0.63, 44), (0.67, 40), (0.71, 43), (0.83, 42), (0.94, 46), (1, 48)])
                let isThreat = stolen.contains(i)
                let (image, name) = isThreat ? (threat?.image, threat?.name ?? "") : home[i % home.count]
                let base = CGPoint(x: w * cfg.left + march + drift, y: h - cfg.bottom + riseY)
                gc.drawLayer { layer in
                    layer.opacity = opacity * riseA
                    layer.translateBy(x: base.x, y: base.y)
                    // Mirrored (web scaleX(-1)): the flag flies to the left of the pole.
                    layer.rotate(by: .degrees(-angle))
                    // Pole and knob.
                    layer.fill(Path(CGRect(x: -3, y: -140, width: 3, height: 140)), with: .linearGradient(Gradient(colors: [Theme.gold, Color(hex: 0x8B6914)]), startPoint: CGPoint(x: -3, y: 0), endPoint: CGPoint(x: 0, y: 0)))
                    layer.fill(Path(ellipseIn: CGRect(x: -5, y: -147, width: 7, height: 7)), with: .radialGradient(Gradient(colors: [Color(hex: 0xFFE066), Theme.gold, Color(hex: 0x8B6914)]), center: CGPoint(x: -2.5, y: -145), startRadius: 0, endRadius: 4))
                    // Flag: a 72×50 panel of art clipped to the waving quad, skewed by the gust.
                    var f = layer
                    f.translateBy(x: -3, y: -140)
                    // Skew in the flag's own space (about the pole top), so the cloth stays on the pole.
                    f.transform = CGAffineTransform(a: 1, b: 0, c: tan(skew * .pi / 180), d: 1, tx: 0, ty: 0).concatenating(f.transform)
                    var quad = Path()
                    quad.move(to: .zero); quad.addLine(to: CGPoint(x: -flagW, y: (42 - flagH) * 0.5)); quad.addLine(to: CGPoint(x: -flagW, y: flagH)); quad.addLine(to: CGPoint(x: 0, y: 42)); quad.closeSubpath()
                    f.addFilter(.shadow(color: .black.opacity(0.65), radius: 4, x: -2, y: 2))
                    f.clip(to: quad)
                    let panel = CGRect(x: -72, y: 0, width: 72, height: 50)
                    if let image {
                        f.draw(f.resolve(Image(uiImage: image)), in: panel)
                    } else {
                        f.fill(Path(panel), with: .color(Color(red: 20/255, green: 12/255, blue: 4/255).opacity(0.9)))
                        f.draw(f.resolve(Text(name).font(.system(size: 7, weight: .heavy)).foregroundColor(Theme.gold)), in: panel.insetBy(dx: 4, dy: 4))
                    }
                    // Ripple highlight sweeping across the cloth.
                    let rp = Self.key(wiggleP, [(0, 0), (0.02, 1), (0.18, 1), (0.26, 0.3), (0.28, 0), (0.53, 0), (0.55, 1), (0.71, 1), (0.79, 0.3), (0.81, 0), (1, 0)])
                    if rp > 0 {
                        let pos = Self.key(wiggleP, [(0, 2), (0.26, -1.7), (0.53, 2), (0.79, -1.7), (1, 2)])
                        f.fill(Path(panel), with: .linearGradient(Gradient(colors: [.clear, .white.opacity(0.15 * rp), .clear]), startPoint: CGPoint(x: -72 - pos * 36, y: 0), endPoint: CGPoint(x: -72 - pos * 36 + 26, y: 0)))
                    }
                }
            }
        }
    }
}
