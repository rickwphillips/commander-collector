import SwiftUI

/// A little bug that now and then wanders in from the edge of the table,
/// roams about and walks off again. Tap it and it pops with a squish, leaves
/// a splat and fades away. It belongs to the effects: Motion off keeps it
/// away (the table only shows this view while Motion is on) and Sound off
/// silences the squish.
struct BoardBug: View {
    /// Testing only: true makes bugs walk in straight away and keep coming.
    /// Normally false, a rare visitor; the settings menu's Bug item sends one
    /// on demand.
    static let appearsImmediately = false
    static var schedule: BugSchedule { appearsImmediately ? .testing : .standard }

    /// Changes when a bug is asked for from the settings menu.
    var spawnSignal = 0
    /// The chance (0...1) that this check sends a bug in, read from the game
    /// as it stands at that moment.
    var chance: () -> Double = { BoardBug.schedule.baseChance }

    @State private var walkers: [BugWalker] = []
    @State private var splats: [Splat] = []

    struct Splat: Identifiable, Equatable {
        let id = UUID()
        var point: CGPoint
        var heading: Angle
        var seed: Int
    }

    var body: some View {
        GeometryReader { geo in
            ZStack {
                ForEach(splats) { splat in
                    SplatView(splat: splat) { splats.removeAll { $0.id == splat.id } }
                        .position(splat.point)
                }
                ForEach(walkers) { walker in
                    // Placed frame by frame (not by an implicit animation) so
                    // the bug is tappable exactly where it is drawn.
                    TimelineView(.animation) { ctx in
                        let pose = walker.pose(at: ctx.date, in: geo.size)
                        BugDrawing(stride: pose.stride)
                            .frame(width: BugDrawing.size, height: BugDrawing.size)
                            .rotationEffect(pose.heading)
                            .frame(width: 64, height: 64)
                            .contentShape(Rectangle())
                            .onTapGesture { squish(walker, pose) }
                            .position(pose.point)
                            .accessibilityIdentifier("boardBug")
                    }
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
            // The table's own schedule: every so often, roll against the
            // chance the game state gives right now. A roll that passes may
            // bring company, so now and then several are out at once.
            .task {
                let schedule = Self.schedule
                var sinceCheck = 0.0
                while !Task.isCancelled {
                    try? await Task.sleep(for: .milliseconds(500))
                    if Task.isCancelled { return }
                    // Those that have walked off the table are done.
                    walkers.removeAll(where: \.gone)
                    sinceCheck += 0.5
                    guard sinceCheck >= schedule.checkEvery else { continue }
                    sinceCheck = 0
                    guard Double.random(in: 0..<1) < chance() else { continue }
                    spawn(in: geo.size)
                    while Double.random(in: 0..<1) < schedule.companyChance, walkers.count < schedule.maxBugs {
                        spawn(in: geo.size)
                    }
                }
            }
            // Asked for from the settings menu: one walks in now.
            .onChange(of: spawnSignal) { _, _ in spawn(in: geo.size) }
        }
        .clipped()
    }

    /// Sends one in, unless the table already has as many as it allows.
    private func spawn(in size: CGSize) {
        guard walkers.count < Self.schedule.maxBugs else { return }
        walkers.append(BugWalker(in: size))
    }

    private func squish(_ walker: BugWalker, _ pose: BugWalker.Pose) {
        SoundService.shared.playSquish()
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred()
        splats.append(Splat(point: pose.point, heading: pose.heading, seed: Int.random(in: 0..<10_000)))
        walkers.removeAll { $0 === walker }
    }
}

/// When the table sends bugs in by itself: every `checkEvery` seconds it
/// rolls a random number against a chance picked from the game state. The
/// interval, the chances and the cap are the knobs to tune.
struct BugSchedule {
    /// Seconds between checks.
    var checkEvery: Double
    /// Chance per check in ordinary play.
    var baseChance: Double
    /// Chance per check at the moment the player whose turn it is runs the
    /// turn timer into the red.
    var redChance: Double
    /// Where the chance tops out the longer they sit there.
    var redChanceMax: Double
    /// How far through the turn timer (0...1) counts as "in the red".
    var redFrom = 0.8
    /// Timer progress at which the chance reaches `redChanceMax` (2 = the
    /// turn has taken twice its time).
    var redPeakAt = 2.0
    /// After a bug is sent, the chance another follows right behind it
    /// (rolled again for each one that does).
    var companyChance: Double
    /// Most bugs on the table at once.
    var maxBugs = 6

    /// A rare visitor: about one every two hours of ordinary play, so many
    /// games never see one. In the red it starts near one every ten minutes
    /// and climbs, the longer the turn drags on, to about one a minute.
    static let standard = BugSchedule(checkEvery: 30, baseChance: 0.004, redChance: 0.05, redChanceMax: 0.4, companyChance: 0.15)
    static let testing = BugSchedule(checkEvery: 2, baseChance: 0.6, redChance: 0.8, redChanceMax: 1, companyChance: 0.35)

    func chance(turnTimerSeconds: Int, elapsedSeconds: Int) -> Double {
        guard turnTimerSeconds > 0 else { return baseChance }
        let progress = Double(elapsedSeconds) / Double(turnTimerSeconds)
        guard progress >= redFrom else { return baseChance }
        let climb = min((progress - redFrom) / max(redPeakAt - redFrom, 0.01), 1)
        return redChance + (redChanceMax - redChance) * climb
    }
}

/// The bug's route: in from one edge, a handful of short walks with pauses to
/// look around, then out over an edge. Positions are computed for a given
/// moment, so the view can draw (and hit-test) it frame by frame.
@MainActor
final class BugWalker: Identifiable {
    struct Pose {
        var point: CGPoint
        var heading: Angle
        /// Cycles as the legs step; frozen while the bug stands still.
        var stride: Double
    }

    private(set) var gone = false
    private var from: CGPoint
    private var to: CGPoint
    private var legStart: Date
    private var legDuration: Double
    private var pause: Double
    private var stopsLeft: Int
    private var leaving = false
    private var heading: Double
    private var previousHeading: Double
    private var walked: Double = 0

    private static let margin: CGFloat = 40
    private static let speed: ClosedRange<Double> = 55...95
    private static let turnSeconds = 0.3
    /// Points walked per full leg cycle.
    private static let strideLength = 16.0

    init(in size: CGSize) {
        let start = Self.edgePoint(in: size)
        let first = Self.insidePoint(in: size)
        from = start
        to = first
        legStart = .now
        legDuration = Self.duration(start, first)
        pause = Double.random(in: 0.2...1.2)
        stopsLeft = Int.random(in: 5...10)
        heading = Self.angle(start, first)
        previousHeading = heading
    }

    func pose(at date: Date, in size: CGSize) -> Pose {
        // Step through any walks that have finished since the last frame.
        while !gone, date.timeIntervalSince(legStart) > legDuration + pause {
            walked += Self.distance(from, to)
            if leaving { gone = true; break }
            legStart = legStart.addingTimeInterval(legDuration + pause)
            from = to
            stopsLeft -= 1
            if stopsLeft <= 0 {
                leaving = true
                to = Self.edgePoint(in: size)
                pause = 0
            } else {
                to = Self.insidePoint(in: size)
                pause = Double.random(in: 0...1.6)
            }
            legDuration = Self.duration(from, to)
            previousHeading = heading
            heading = Self.angle(from, to)
        }
        let t = date.timeIntervalSince(legStart)
        let progress = legDuration > 0 ? min(max(t / legDuration, 0), 1) : 1
        let point = CGPoint(x: from.x + (to.x - from.x) * progress, y: from.y + (to.y - from.y) * progress)
        // Turn towards the new direction over the first moments of a walk,
        // the short way round.
        let turn = min(max(t / Self.turnSeconds, 0), 1)
        var delta = heading - previousHeading
        while delta > .pi { delta -= 2 * .pi }
        while delta < -.pi { delta += 2 * .pi }
        let facing = previousHeading + delta * turn
        let stride = (walked + Self.distance(from, to) * progress) / Self.strideLength
        return Pose(point: point, heading: .radians(facing + .pi / 2), stride: stride)
    }

    private static func distance(_ a: CGPoint, _ b: CGPoint) -> Double { Double(hypot(b.x - a.x, b.y - a.y)) }
    private static func angle(_ a: CGPoint, _ b: CGPoint) -> Double { Double(atan2(b.y - a.y, b.x - a.x)) }
    private static func duration(_ a: CGPoint, _ b: CGPoint) -> Double { distance(a, b) / Double.random(in: speed) }

    /// Somewhere on the table, never too far in one go so it changes
    /// direction often.
    private static func insidePoint(in size: CGSize) -> CGPoint {
        CGPoint(x: CGFloat.random(in: margin...max(margin + 1, size.width - margin)),
                y: CGFloat.random(in: margin...max(margin + 1, size.height - margin)))
    }

    /// Just off one of the four edges.
    private static func edgePoint(in size: CGSize) -> CGPoint {
        let off: CGFloat = 50
        switch Int.random(in: 0..<4) {
        case 0: return CGPoint(x: -off, y: .random(in: 0...size.height))
        case 1: return CGPoint(x: size.width + off, y: .random(in: 0...size.height))
        case 2: return CGPoint(x: .random(in: 0...size.width), y: -off)
        default: return CGPoint(x: .random(in: 0...size.width), y: size.height + off)
        }
    }
}

/// The bug, facing up: six legs that step with `stride`, a round red shell
/// with spots, a dark head and two feelers.
struct BugDrawing: View {
    static let size: CGFloat = 34
    var stride: Double
    /// Squashed flat: legs splayed wide and still.
    var flattened = false
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        Canvas { gc, size in
            let w = size.width, h = size.height
            let c = CGPoint(x: w / 2, y: h / 2)
            // Near-black legs and feelers. On the dark table a faint pale
            // edge is drawn under them so they do not disappear into it.
            let limb = Color(hex: 0x120B09)
            let edge: Color? = scheme == .dark ? Color.white.opacity(0.22) : nil
            let shell = Color(hex: 0xC62828)
            let dark = Color(hex: 0x1B1210)

            // Legs: three a side, front and back pairs stepping against the middle pair.
            for side in [-1.0, 1.0] {
                for (i, y) in [-0.16, 0.02, 0.2].enumerated() {
                    let phase = stride * 2 * .pi + (i == 1 ? .pi : 0) + (side < 0 ? 0 : .pi)
                    let swing = flattened ? 0 : sin(phase) * 0.09
                    let reach = flattened ? 0.5 : 0.4
                    let root = CGPoint(x: c.x + side * w * 0.14, y: c.y + h * y)
                    let knee = CGPoint(x: c.x + side * w * (reach * 0.72), y: c.y + h * (y + (Double(i) - 1) * 0.07 + swing * 0.5))
                    let foot = CGPoint(x: c.x + side * w * reach, y: c.y + h * (y + (Double(i) - 1) * 0.16 + swing))
                    var leg = Path()
                    leg.move(to: root); leg.addLine(to: knee); leg.addLine(to: foot)
                    if let edge { gc.stroke(leg, with: .color(edge), style: StrokeStyle(lineWidth: 3.2, lineCap: .round, lineJoin: .round)) }
                    gc.stroke(leg, with: .color(limb), style: StrokeStyle(lineWidth: 1.8, lineCap: .round, lineJoin: .round))
                }
            }
            // Feelers.
            for side in [-1.0, 1.0] {
                var feeler = Path()
                feeler.move(to: CGPoint(x: c.x + side * w * 0.05, y: c.y - h * 0.3))
                feeler.addQuadCurve(to: CGPoint(x: c.x + side * w * 0.2, y: c.y - h * 0.47),
                                    control: CGPoint(x: c.x + side * w * 0.06, y: c.y - h * 0.44))
                if let edge { gc.stroke(feeler, with: .color(edge), style: StrokeStyle(lineWidth: 2.6, lineCap: .round)) }
                gc.stroke(feeler, with: .color(limb), style: StrokeStyle(lineWidth: 1.3, lineCap: .round))
            }
            // Head, then the shell over its back edge.
            gc.fill(Path(ellipseIn: CGRect(x: c.x - w * 0.11, y: c.y - h * 0.36, width: w * 0.22, height: h * 0.2)), with: .color(dark))
            let body = CGRect(x: c.x - w * 0.2, y: c.y - h * 0.22, width: w * 0.4, height: h * 0.5)
            gc.fill(Path(ellipseIn: body), with: .color(shell))
            gc.stroke(Path(ellipseIn: body), with: .color(dark.opacity(0.7)), lineWidth: 1)
            var seam = Path()
            seam.move(to: CGPoint(x: c.x, y: body.minY + 2)); seam.addLine(to: CGPoint(x: c.x, y: body.maxY - 1))
            gc.stroke(seam, with: .color(dark.opacity(0.8)), lineWidth: 1)
            for (dx, dy) in [(-0.09, -0.08), (0.09, -0.08), (-0.1, 0.07), (0.1, 0.07), (-0.06, 0.19), (0.06, 0.19)] {
                gc.fill(Path(ellipseIn: CGRect(x: c.x + w * dx - 1.6, y: c.y + h * dy - 1.6, width: 3.2, height: 3.2)), with: .color(dark))
            }
            // A small highlight so the shell looks domed.
            gc.fill(Path(ellipseIn: CGRect(x: c.x - w * 0.13, y: c.y - h * 0.17, width: w * 0.1, height: h * 0.12)), with: .color(.white.opacity(0.28)))
        }
        .accessibilityHidden(true)
    }
}

/// What is left after a tap: the bug pops outward, flat, over a splash of
/// goo, lingers and slowly fades away. Press the splat while it is still
/// there and it is squished further: flatter, wider, more goo flung out. The
/// fade keeps its own clock from the first squish, so however much it is
/// pressed it still vanishes on time.
private struct SplatView: View {
    let splat: BoardBug.Splat
    let onDone: () -> Void
    @State private var popped = false
    @State private var faded = false
    /// Extra presses after the first squish.
    @State private var level = 0

    /// How long it sits before it starts to go, and how long the fade takes.
    private static let holdSeconds = 2.0
    private static let fadeSeconds = 5.0
    /// Presses beyond this still squelch but spread no further.
    private static let maxLevel = 5

    private var spread: Double { 1 + 0.32 * Double(level) }

    var body: some View {
        ZStack {
            Canvas { gc, size in
                var rng = SeededGenerator(seed: UInt64(splat.seed))
                let c = CGPoint(x: size.width / 2, y: size.height / 2)
                let goo = Color(hex: 0x9CCC3D)
                gc.fill(Path(ellipseIn: CGRect(x: c.x - 15, y: c.y - 13, width: 30, height: 26)), with: .color(goo.opacity(0.85)))
                // Droplets flung out around it; every further squish adds more.
                // The generator is seeded, so earlier droplets stay where they landed.
                for _ in 0..<(9 + 6 * level) {
                    let angle = Double.random(in: 0..<(2 * .pi), using: &rng)
                    let reach = Double.random(in: 14...30, using: &rng)
                    let r = Double.random(in: 1.5...4.5, using: &rng)
                    let p = CGPoint(x: c.x + cos(angle) * reach, y: c.y + sin(angle) * reach)
                    gc.fill(Path(ellipseIn: CGRect(x: p.x - r, y: p.y - r, width: r * 2, height: r * 2)), with: .color(goo.opacity(0.8)))
                    var streak = Path()
                    streak.move(to: CGPoint(x: c.x + cos(angle) * 9, y: c.y + sin(angle) * 9)); streak.addLine(to: p)
                    gc.stroke(streak, with: .color(goo.opacity(0.55)), style: StrokeStyle(lineWidth: r * 0.7, lineCap: .round))
                }
            }
            .frame(width: 80, height: 80)
            .scaleEffect(spread)
            // The bug itself gets wider, flatter and fainter each time.
            BugDrawing(stride: 0, flattened: true)
                .frame(width: BugDrawing.size, height: BugDrawing.size)
                .scaleEffect(x: 1.35 + 0.3 * Double(level), y: 1.2 + 0.18 * Double(level))
                .rotationEffect(splat.heading)
                .opacity(max(0.25, 0.9 - 0.15 * Double(level)))
        }
        .scaleEffect(popped ? 1 : 0.55)
        .opacity(faded ? 0 : 1)
        // The tap target sits outside the fading layer: a view at zero
        // opacity takes no touches, and this must stay pressable while it goes.
        .frame(width: 70 * spread, height: 70 * spread)
        .contentShape(Circle())
        .onTapGesture { squishAgain() }
        .task {
            // Pop: overshoots and settles, like something bursting.
            withAnimation(.spring(response: 0.22, dampingFraction: 0.42)) { popped = true }
            try? await Task.sleep(for: .seconds(Self.holdSeconds))
            withAnimation(.easeIn(duration: Self.fadeSeconds)) { faded = true }
            try? await Task.sleep(for: .seconds(Self.fadeSeconds + 0.05))
            onDone()
        }
    }

    private func squishAgain() {
        SoundService.shared.playSquish()
        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        guard level < Self.maxLevel else { return }
        withAnimation(.spring(response: 0.25, dampingFraction: 0.5)) { level += 1 }
    }
}

/// A tiny deterministic generator so a splat keeps its droplets from frame to frame.
private struct SeededGenerator: RandomNumberGenerator {
    private var state: UInt64
    init(seed: UInt64) { state = seed &+ 0x9E3779B97F4A7C15 }
    mutating func next() -> UInt64 {
        state &+= 0x9E3779B97F4A7C15
        var z = state
        z = (z ^ (z >> 30)) &* 0xBF58476D1CE4E5B9
        z = (z ^ (z >> 27)) &* 0x94D049BB133111EB
        return z ^ (z >> 31)
    }
}
