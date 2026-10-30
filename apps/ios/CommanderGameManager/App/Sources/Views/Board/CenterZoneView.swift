import SwiftUI
import CommanderGameKit

/// The middle strip of the table (web `CenterZone`). Seating: Roll / Pick for
/// first player with the house rules, then Start. Play: the turn tracker
/// mirrored for both long sides, the big Next Turn (hold for previous), and
/// corner buttons for Settings, Dice & More and the game log. The roll-off,
/// dice, settings and notes all open as overlays on this strip.
struct CenterZoneView: View {
    @Bindable var session: GameSession
    @Binding var showLog: Bool
    let elapsedSeconds: Int
    let onRestart: () -> Void
    @Environment(GameSettingsStore.self) private var settings
    @Environment(Session.self) private var account
    @Environment(\.colorScheme) private var scheme

    @State private var panel: Panel?
    @State private var confirmEnd = false
    @State private var confirmRestart = false
    @State private var notesDraft = ""
    @State private var winnerCountdown: Int?
    @State private var countdownTask: Task<Void, Never>?
    @State private var prevTip = false
    @State private var lpFired = false
    @State private var rollOff = RollOffModel()
    @State private var dice = DiceModel()

    enum Panel { case dice, settings, notes, pick }

    private var state: GameState { session.state }
    private var is2hg: Bool { state.isTwoHeadedGiant }
    private var firstPlayerSet: Bool { state.firstPlayerIdx != nil }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12).fill(Theme.tableBackground(scheme))
                .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(Color.primary.opacity(0.12)))
            if session.isSeating { seatingControls } else { playControls }
            cornerButtons
            if let panel {
                switch panel {
                case .dice: diceOverlay
                case .settings: settingsOverlay
                case .notes: notesOverlay
                case .pick: pickOverlay
                }
            }
            if let w = session.winnerIdx, !session.isSeating { winnerBanner(w) }
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .confirmationDialog("End the game?", isPresented: $confirmEnd, titleVisibility: .visible) {
            Button("End game", role: .destructive) { session.endGame() }
        }
        .confirmationDialog("Restart? This clears the current game and returns to seating with the same players.", isPresented: $confirmRestart, titleVisibility: .visible) {
            Button("Restart", role: .destructive) { onRestart() }
        }
        .onChange(of: session.winnerIdx) { _, winner in
            countdownTask?.cancel()
            guard winner != nil else { winnerCountdown = nil; return }
            winnerCountdown = 15
            countdownTask = Task { @MainActor in
                while let n = winnerCountdown, n > 0, !Task.isCancelled {
                    try? await Task.sleep(for: .seconds(1))
                    if Task.isCancelled { return }
                    winnerCountdown = n - 1
                }
                if !Task.isCancelled, session.winnerIdx != nil { session.endGame() }
            }
        }
    }

    // MARK: Seating

    private var seatingControls: some View {
        HStack(spacing: 16) {
            VStack(spacing: 6) {
                Button { startRoll() } label: {
                    VStack(spacing: 2) { D20Icon(size: 34); Text("Roll").font(.caption.bold()) }.frame(width: 70, height: 70)
                }
                .buttonStyle(.borderedProminent)
                .disabled(!session.allSeatsFilled || rollOff.phase == .rolling || rollOff.phase == .tie)
                Button("Pick") { panel = .pick }.buttonStyle(.bordered).frame(width: 70)
                    .disabled(!session.allSeatsFilled || rollOff.phase == .rolling || rollOff.phase == .tie)
            }
            if !is2hg {
                VStack(alignment: .leading, spacing: 2) {
                    houseRule("Aces High", $rollOff.acesHigh) { on in rollOff.elevenBeatsAces = on; if on { rollOff.adamsRule = false } }
                    houseRule("Eleven Beats Aces", $rollOff.elevenBeatsAces, disabled: !rollOff.acesHigh) { on in if on { rollOff.adamsRule = false } }
                    houseRule("No Loners", $rollOff.noLoners) { on in if on { rollOff.adamsRule = false } }
                    houseRule("Adam's House Rules", $rollOff.adamsRule) { on in if on { rollOff.acesHigh = false; rollOff.elevenBeatsAces = false; rollOff.noLoners = false } }
                }
            }
            VStack(spacing: 6) {
                if let first = state.firstPlayerIdx {
                    Text("\(state.players[first].playerName) goes first").font(.subheadline.bold())
                }
                Button { session.start() } label: {
                    Label("Start game", systemImage: "play.fill").font(.headline).frame(minWidth: 150)
                }
                .buttonStyle(.borderedProminent).controlSize(.large)
                .disabled(!session.allSeatsFilled || !firstPlayerSet)
                Text(!session.allSeatsFilled ? "Seat every player to start" : !firstPlayerSet ? "Roll or pick who goes first" : "")
                    .font(.caption).foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 12)
    }

    private func houseRule(_ label: String, _ on: Binding<Bool>, disabled: Bool = false, change: @escaping (Bool) -> Void) -> some View {
        Toggle(isOn: Binding(get: { on.wrappedValue }, set: { on.wrappedValue = $0; change($0) })) {
            Text(label).font(.system(size: 11))
        }
        .toggleStyle(CheckboxToggleStyle())
        .disabled(disabled)
    }

    private var pickOverlay: some View {
        overlayFrame(title: "Who goes first?") {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 6) {
                ForEach(state.players.indices, id: \.self) { i in
                    Button(state.players[i].playerName.isEmpty ? "Seat \(i + 1)" : state.players[i].playerName) {
                        session.chooseFirstPlayer(i, note: nil); panel = nil
                    }
                    .buttonStyle(.bordered).frame(maxWidth: .infinity)
                }
            }
        }
    }

    // MARK: Play

    private var activeTeam: Int? { is2hg ? state.players[state.currentPlayerIdx].teamNumber : nil }
    private var turnCommanderLabel: String {
        if let t = activeTeam { return Teams.name(t, teamNames: state.teamNames).uppercased() }
        return state.players[state.currentPlayerIdx].commander.name
    }
    private var turnPlayerLabel: String {
        if let t = activeTeam { return state.players.filter { $0.teamNumber == t }.map(\.playerName).joined(separator: " & ") }
        return state.players[state.currentPlayerIdx].playerName
    }
    private var remaining: Int? { state.turnTimerSeconds > 0 ? max(0, state.turnTimerSeconds - elapsedSeconds) : nil }

    private var playControls: some View {
        HStack(spacing: 10) {
            turnTracker.rotationEffect(.degrees(is2hg ? 180 : 90)).frame(width: 110)
            NextTurnButton(remaining: remaining, onNext: { session.dispatch(.passTurn) }, onPrev: { session.dispatch(.prevTurn) })
            turnTracker.rotationEffect(.degrees(is2hg ? 0 : -90)).frame(width: 110)
        }
        .padding(.horizontal, 44)
    }

    private var turnTracker: some View {
        VStack(spacing: 2) {
            Text("Turn \(state.turnNumber)").font(.system(size: 26, weight: .black)).foregroundStyle(Color.accentColor)
            Text(turnCommanderLabel).font(.system(size: 12, weight: .semibold)).lineLimit(2).multilineTextAlignment(.center)
            Text(turnPlayerLabel).font(.system(size: 11)).foregroundStyle(.secondary).lineLimit(1)
        }
        .frame(width: 110)
        .fixedSize()
    }

    private var cornerButtons: some View {
        VStack {
            HStack {
                Spacer()
                cornerButton("gearshape") { panel = .settings }
            }
            Spacer()
            HStack {
                cornerButton("list.bullet.rectangle") { showLog = true }
                Spacer()
                cornerButton("dice") { panel = .dice }
            }
        }
        .padding(6)
    }

    private func cornerButton(_ symbol: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol).font(.system(size: 20)).foregroundStyle(.secondary).frame(width: 36, height: 36).contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func winnerBanner(_ w: Int) -> some View {
        let name = is2hg ? Teams.label(state.players[w].teamNumber, players: state.players, teamNames: state.teamNames) : state.players[w].playerName
        return VStack {
            Spacer()
            HStack(spacing: 12) {
                Text("🏆 \(name) wins" + (winnerCountdown.map { " — ending in \($0)s" } ?? "")).font(.system(size: 16, weight: .black)).lineLimit(1)
                Spacer()
                Button("End now") { session.endGame() }.buttonStyle(.borderedProminent).controlSize(.small)
                Button("Keep playing") { countdownTask?.cancel(); winnerCountdown = nil }.buttonStyle(.bordered).controlSize(.small)
            }
            .padding(.horizontal, 12).padding(.vertical, 8)
            .background(Theme.menuBackground(scheme))
            .overlay(Rectangle().frame(height: 2).foregroundStyle(Color.accentColor), alignment: .top)
        }
    }

    // MARK: Overlays

    private func overlayFrame<C: View>(title: String, onClose: (() -> Void)? = nil, @ViewBuilder content: () -> C) -> some View {
        ZStack {
            Theme.overlayBackground(scheme)
            VStack(spacing: 6) {
                HStack {
                    Text(title.uppercased()).font(.system(size: 11, weight: .bold)).kerning(0.5).foregroundStyle(.secondary)
                    Spacer()
                    Button { onClose?(); panel = nil } label: { Image(systemName: "xmark").font(.system(size: 14)) }.buttonStyle(.plain).foregroundStyle(.secondary)
                }
                content()
            }
            .padding(10)
        }
        .transition(.opacity)
    }

    private var settingsOverlay: some View {
        overlayFrame(title: "Settings") {
            VStack(spacing: 8) {
                HStack(spacing: 14) {
                    Toggle("Timer", isOn: Binding(get: { state.turnTimerSeconds > 0 }, set: { on in
                        let secs = on ? (settings.turnTimerSeconds > 0 ? settings.turnTimerSeconds : 300) : 0
                        session.setTurnTimer(seconds: secs)
                        settings.turnTimerEnabled = on
                        settings.push(using: account.client)
                    }))
                    Toggle("Highlight", isOn: Binding(get: { settings.highlightMode }, set: { settings.highlightMode = $0; settings.push(using: account.client) }))
                    Toggle("Sound", isOn: Binding(get: { settings.soundEnabled }, set: { settings.soundEnabled = $0; settings.push(using: account.client) }))
                    Toggle("Dark", isOn: Binding(get: { settings.darkMode }, set: { settings.darkMode = $0 }))
                }
                .font(.system(size: 12))
                .toggleStyle(.switch)
                .controlSize(.mini)
                HStack(spacing: 8) {
                    Button { notesDraft = state.notes; panel = .notes } label: { Label("Notes", systemImage: "note.text").frame(maxWidth: .infinity) }
                        .tint(state.notes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : .accentColor)
                    Button { panel = nil; showLog = true } label: { Label("Game Log", systemImage: "list.bullet").frame(maxWidth: .infinity) }
                    Button { panel = nil; confirmRestart = true } label: { Label("Restart", systemImage: "arrow.counterclockwise").frame(maxWidth: .infinity) }
                    Button(role: .destructive) { panel = nil; confirmEnd = true } label: { Label("End Game", systemImage: "flag.fill").frame(maxWidth: .infinity) }
                }
                .buttonStyle(.bordered).controlSize(.small).font(.system(size: 11))
            }
        }
    }

    private var notesOverlay: some View {
        overlayFrame(title: "Game notes") {
            TextEditor(text: $notesDraft).font(.system(size: 13)).scrollContentBackground(.hidden)
                .background(RoundedRectangle(cornerRadius: 6).fill(Color.primary.opacity(0.05)))
            HStack {
                Spacer()
                Button("Cancel") { panel = nil }
                Button("Save") { session.setNotes(notesDraft); panel = nil }.buttonStyle(.borderedProminent)
            }
            .controlSize(.small)
        }
    }

    // MARK: Roll for first player

    private func startRoll() {
        panel = .dice
        if is2hg {
            var rng = SystemRandomNumberGenerator()
            let r = GameOutcome.rollForFirstTeam(state, using: &rng)
            session.logRollForFirst(r.rolls.map { (state.players[$0.idx].playerName, $0.roll) }, tiebreak: false)
            rollOff.startTeamRoll(result: r, names: state.players.map(\.playerName), teamLabel: Teams.name(state.players[r.winnerIdx].teamNumber, teamNames: state.teamNames))
        } else {
            rollOff.start(GameOutcome.activeSeats(state), names: state.players.map(\.playerName)) { rolls, tiebreak in
                session.logRollForFirst(rolls, tiebreak: tiebreak)
            }
        }
        SoundService.shared.playD20()
    }

    private var diceOverlay: some View {
        overlayFrame(title: rollOff.phase == .idle ? "Dice / Flips" : "Roll-Off", onClose: { rollOff.cancel() }) {
            ZStack {
                if rollOff.phase != .idle {
                    RollOffView(model: rollOff)
                } else {
                    DiceResultView(model: dice)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            if rollOff.phase != .idle {
                HStack(spacing: 6) {
                    Button(rollOff.phase == .result ? "\(rollOff.winnerName) goes first" : "Accept") {
                        if case .result = rollOff.phase {
                            session.chooseFirstPlayer(rollOff.winnerIdx, note: rollOff.detail)
                            rollOff.cancel(); panel = nil
                        }
                    }
                    .buttonStyle(.borderedProminent).frame(maxWidth: .infinity)
                    .disabled(rollOff.phase != .result)
                    Button("Roll Again") { startRoll() }.buttonStyle(.bordered).frame(maxWidth: .infinity).disabled(rollOff.phase != .result)
                }
                .controlSize(.small)
            } else {
                HStack(spacing: 6) {
                    Button("−") { dice.count = max(1, dice.count - 1) }.buttonStyle(.bordered)
                    Text("\(dice.count)").font(.system(size: 14, weight: .bold)).frame(minWidth: 18)
                    Button("+") { dice.count = min(20, dice.count + 1) }.buttonStyle(.bordered)
                    diceButton("d6", sides: 6)
                    diceButton("d20", sides: 20)
                    diceButton("Flip", sides: nil)
                    if !dice.history.isEmpty { Button("Clear") { dice.history = [] }.foregroundStyle(.secondary) }
                }
                .controlSize(.small).font(.system(size: 11))
            }
        }
    }

    private func diceButton(_ label: String, sides: Int?) -> some View {
        let kind: DiceModel.Kind = sides == 6 ? .d6 : sides == 20 ? .d20 : .coin
        let isLast = dice.history.last?.kind == kind
        let display = isLast ? dice.lastDisplay : nil
        return Button {
            dice.roll(kind)
            if sides == 20 { SoundService.shared.playD20() } else if sides == 6 { SoundService.shared.playD6() }
            session.logDiceRoll(die: dice.history.last?.label ?? label, sides: sides, count: dice.count, rolls: dice.history.last?.rolls ?? [], total: dice.history.last?.total)
        } label: {
            Text(display.map { sides == nil ? $0 : "total \($0)" } ?? label).fontWeight(isLast ? .black : .regular).frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)
        .tint(isLast ? .orange : nil)
    }
}

// MARK: - Next Turn

/// Big square Next Turn: tap advances, hold 0.5 s steps back (with a tip).
/// Pulses faster as the turn timer runs down (≤30 s, ≤20 s, ≤10 s).
struct NextTurnButton: View {
    let remaining: Int?
    let onNext: () -> Void
    let onPrev: () -> Void
    @State private var fired = false
    @State private var tip = false

    private var pulse: Double? {
        guard let r = remaining, r <= 30 else { return nil }
        return r <= 10 ? 0.5 : r <= 20 ? 1 : 1.8
    }

    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 20, paused: pulse == nil)) { ctx in
            let p = pulse.map { (sin(ctx.date.timeIntervalSinceReferenceDate / $0 * 2 * .pi) + 1) / 2 } ?? 0
            Text("Next\nTurn")
                .font(.system(size: 22, weight: .bold)).multilineTextAlignment(.center)
                .foregroundStyle(Color.accentColor)
                .frame(width: 120, height: 120)
                .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(p > 0.5 ? Theme.danger : Color.accentColor, lineWidth: 2))
                .shadow(color: Color(red: 1, green: 80/255, blue: 30/255).opacity(p * (remaining.map { $0 <= 10 } ?? false ? 0.9 : 0.5)), radius: 12)
                .contentShape(Rectangle())
                .overlay(alignment: .top) {
                    if tip { Text("Previous Turn").font(.caption2.bold()).padding(6).background(Capsule().fill(Color(.systemGray))).foregroundStyle(.white).offset(y: -30) }
                }
        }
        .onTapGesture { if fired { fired = false; return }; onNext() }
        .onLongPressGesture(minimumDuration: 0.5) {
            fired = true; onPrev()
            withAnimation { tip = true }
            Task { try? await Task.sleep(for: .milliseconds(700)); withAnimation { tip = false } }
        }
        .sensoryFeedback(.impact, trigger: remaining == nil ? 0 : 1)
    }
}

/// A d20 drawn as the web draws it: hexagon with two overlapping triangles.
struct D20Icon: View {
    var size: CGFloat = 16
    var body: some View {
        Canvas { ctx, s in
            let w = s.width, h = s.height
            func pt(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: x / 24 * w, y: y / 24 * h) }
            var hex = Path(); hex.move(to: pt(12, 1)); [pt(21, 6.5), pt(21, 17.5), pt(12, 23), pt(3, 17.5), pt(3, 6.5)].forEach { hex.addLine(to: $0) }; hex.closeSubpath()
            var up = Path(); up.move(to: pt(12, 1)); up.addLine(to: pt(21, 17.5)); up.addLine(to: pt(3, 17.5)); up.closeSubpath()
            var down = Path(); down.move(to: pt(3, 6.5)); down.addLine(to: pt(21, 6.5)); down.addLine(to: pt(12, 23)); down.closeSubpath()
            let style = StrokeStyle(lineWidth: max(1.5, size / 12), lineCap: .round, lineJoin: .round)
            for p in [hex, up, down] { ctx.stroke(p, with: .color(.primary), style: style) }
        }
        .frame(width: size, height: size)
    }
}

struct CheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button { configuration.isOn.toggle() } label: {
            HStack(spacing: 4) {
                Image(systemName: configuration.isOn ? "checkmark.square.fill" : "square").foregroundStyle(configuration.isOn ? Color.accentColor : .secondary)
                configuration.label
            }
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Roll-off model (web startRollOff + house rules)

@Observable
@MainActor
final class RollOffModel {
    enum Phase: Equatable { case idle, rolling, result, tie }
    var phase: Phase = .idle
    var acesHigh = true
    var elevenBeatsAces = true
    var adamsRule = false
    var noLoners = false

    /// Every slot shown, in original order.
    private(set) var labels: [String] = []
    private(set) var rolls: [Int] = []
    private(set) var revealed: [Bool] = []
    private(set) var active: [Bool] = []
    private(set) var locked: [Bool] = []
    private(set) var done = false
    private(set) var winnerIdx = 0
    private(set) var winnerName = ""
    private(set) var detail: String?
    private(set) var tiedNames: [String] = []
    private(set) var lockedHighestNames: [String] = []
    private(set) var noLonersTie = false
    private var task: Task<Void, Never>?
    private var originalIndices: [Int] = []
    private var lastRound: [Int: Int] = [:]

    func cancel() {
        task?.cancel(); task = nil
        phase = .idle; done = false; labels = []; rolls = []
    }

    private func score(_ roll: Int, all: [Int]) -> Double {
        if acesHigh && elevenBeatsAces && all.contains(1) {
            if roll == 11 { return 21 }
            if roll == 1 { return 20.5 }
            return Double(roll)
        }
        if acesHigh { return roll == 1 ? 21 : Double(roll) }
        return Double(roll)
    }

    func start(_ contenders: [Int], names: [String], lockedIn: [(idx: Int, roll: Int)] = [], original: [Int]? = nil, log: @escaping ([(String, Int)], Bool) -> Void) {
        task?.cancel()
        let orig = original ?? contenders
        originalIndices = orig
        let tiebreak = original != nil && (orig.count > contenders.count || !lockedIn.isEmpty)
        let display = tiebreak ? orig : contenders
        let lockedSet = Set(lockedIn.map(\.idx))
        active = display.map { contenders.contains($0) }
        locked = display.map { lockedSet.contains($0) }
        let newRolls = contenders.map { _ in Int.random(in: 1...20) }
        var k = 0
        rolls = display.enumerated().map { i, idx in
            if active[i] { defer { k += 1 }; return newRolls[k] }
            if let l = lockedIn.first(where: { $0.idx == idx }) { return l.roll }
            return lastRound[idx] ?? 0
        }
        labels = display.map { names[$0] }
        revealed = active.map { !$0 }
        done = false
        phase = .rolling
        log(zip(contenders, newRolls).map { (names[$0], $1) }, tiebreak)

        task = Task { @MainActor in
            var shown = 0
            for i in display.indices where active[i] {
                try? await Task.sleep(for: .milliseconds(shown == 0 ? 600 : 230))
                if Task.isCancelled { return }
                revealed[i] = true
                shown += 1
            }
            try? await Task.sleep(for: .milliseconds(800))
            if Task.isCancelled { return }
            done = true
            for (idx, r) in zip(contenders, newRolls) { lastRound[idx] = r }
            let allRolls = lockedIn.map(\.roll) + newRolls
            let allIdx = lockedIn.map(\.idx) + contenders
            let scores = allRolls.map { score($0, all: allRolls) }
            let top = scores.max() ?? 0
            if noLoners {
                var counts: [Int: Int] = [:]
                for r in allRolls { counts[r, default: 0] += 1 }
                if !allRolls.contains(where: { counts[$0]! > 1 }) {
                    finish(winner: allIdx[scores.firstIndex(of: top)!], names: names)
                } else {
                    let uniqueTop = scores.filter { $0 == top }.count == 1
                    var next: [Int] = [], nextLocked: [(idx: Int, roll: Int)] = []
                    for (pos, r) in allRolls.enumerated() {
                        if scores[pos] == top && uniqueTop { nextLocked.append((allIdx[pos], r)) }
                        else if counts[r]! > 1 { next.append(allIdx[pos]) }
                    }
                    lockedHighestNames = nextLocked.map { names[$0.idx] }
                    tiedNames = (next + nextLocked.map(\.idx)).map { names[$0] }
                    noLonersTie = true
                    phase = .tie
                    try? await Task.sleep(for: .milliseconds(2500))
                    if Task.isCancelled { return }
                    start(next, names: names, lockedIn: nextLocked, original: orig, log: log)
                }
            } else {
                let leaders = scores.enumerated().filter { $0.element == top }.map { allIdx[$0.offset] }
                if leaders.count == 1 {
                    finish(winner: leaders[0], names: names)
                } else {
                    tiedNames = leaders.map { names[$0] }
                    lockedHighestNames = []
                    noLonersTie = false
                    phase = .tie
                    try? await Task.sleep(for: .milliseconds(2500))
                    if Task.isCancelled { return }
                    start(leaders, names: names, original: orig, log: log)
                }
            }
        }
    }

    private func finish(winner: Int, names: [String]) {
        winnerIdx = winner
        winnerName = names[winner]
        detail = nil
        phase = .result
    }

    /// 2HG: the deciding round is resolved up front; this animates it.
    func startTeamRoll(result: GameOutcome.RollResult, names: [String], teamLabel: String) {
        task?.cancel()
        labels = result.rolls.map { names[$0.idx] }
        rolls = result.rolls.map(\.roll)
        active = rolls.map { _ in true }
        locked = rolls.map { _ in false }
        revealed = rolls.map { _ in false }
        done = false
        phase = .rolling
        task = Task { @MainActor in
            for i in rolls.indices {
                try? await Task.sleep(for: .milliseconds(i == 0 ? 600 : 230))
                if Task.isCancelled { return }
                revealed[i] = true
            }
            try? await Task.sleep(for: .milliseconds(800))
            if Task.isCancelled { return }
            done = true
            winnerIdx = result.winnerIdx
            winnerName = teamLabel
            detail = result.detail
            phase = .result
        }
    }
}

/// The roll-off grid: a spinning d20 per active slot that pops to its number,
/// then the winner in gold, TIE / NO LONERS stamps while re-rolling.
struct RollOffView: View {
    let model: RollOffModel

    var body: some View {
        VStack(spacing: 4) {
            HStack(alignment: .bottom, spacing: 6) {
                ForEach(model.labels.indices, id: \.self) { i in
                    if i > 0 { D20Icon(size: 10).opacity(0.4).padding(.bottom, 10) }
                    VStack(spacing: 2) {
                        Text(model.labels[i]).font(.system(size: 9)).foregroundStyle(nameColor(i)).lineLimit(1)
                        if model.revealed[i] {
                            Text("\(model.rolls[i])").font(.system(size: 30, weight: .black)).foregroundStyle(scoreColor(i))
                                .transition(.scale(scale: 0.3).combined(with: .opacity))
                        } else {
                            SpinningDie(kind: .d20, size: 30)
                        }
                    }
                    .animation(.spring(duration: 0.3, bounce: 0.5), value: model.revealed[i])
                }
            }
            .overlay {
                if model.phase == .tie {
                    Text(model.noLonersTie ? "NO LONERS" : "TIE").font(.system(size: model.noLonersTie ? 26 : 44, weight: .black)).kerning(6)
                        .foregroundStyle(Theme.gold).opacity(0.65).rotationEffect(.degrees(-18)).shadow(color: Theme.brightGold.opacity(0.9), radius: 12)
                }
            }
            if model.phase == .result {
                Text(model.winnerName).font(.system(size: 20, weight: .black)).foregroundStyle(Theme.gold).shadow(color: Theme.brightGold.opacity(0.8), radius: 10)
                    .transition(.scale(scale: 1.5).combined(with: .opacity))
                Text("goes first!").font(.system(size: 13))
            } else if model.phase == .tie {
                Text("Re-rolling: \(model.tiedNames.joined(separator: " vs "))").font(.system(size: 10)).foregroundStyle(.secondary)
            }
        }
        .animation(.spring(duration: 0.5, bounce: 0.5), value: model.phase)
    }

    private func isWinner(_ i: Int) -> Bool { model.phase == .result && (model.labels[i] == model.winnerName || model.rolls[i] == model.rolls.max() && model.winnerName.contains("Team")) }
    private func nameColor(_ i: Int) -> Color {
        if isWinner(i) { return Theme.gold }
        if model.phase == .tie && model.lockedHighestNames.contains(model.labels[i]) { return .accentColor }
        if model.phase == .tie && model.tiedNames.contains(model.labels[i]) { return Theme.gold }
        return .secondary
    }
    private func scoreColor(_ i: Int) -> Color {
        if !model.active[i] { return model.locked[i] ? .accentColor : .secondary }
        if isWinner(i) { return .accentColor }
        if model.phase == .tie && model.lockedHighestNames.contains(model.labels[i]) { return .accentColor }
        if model.phase == .tie && model.tiedNames.contains(model.labels[i]) { return Theme.gold }
        return model.done ? .secondary : .accentColor
    }
}

struct SpinningDie: View {
    let kind: DiceModel.Kind
    var size: CGFloat = 30
    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 30)) { ctx in
            let t = ctx.date.timeIntervalSinceReferenceDate
            Group {
                switch kind {
                case .coin: Image(systemName: "circle.circle.fill").font(.system(size: size)).rotation3DEffect(.degrees(t * 2000), axis: (0, 1, 0))
                case .d6: Image(systemName: "die.face.5.fill").font(.system(size: size)).rotationEffect(.degrees(t * 1440))
                case .d20: D20Icon(size: size).rotationEffect(.degrees(t * 1440))
                }
            }
            .foregroundStyle(.secondary).opacity(0.6)
        }
        .frame(height: size)
    }
}

// MARK: - Dice & More

@Observable
@MainActor
final class DiceModel {
    enum Kind: Equatable { case d6, d20, coin }
    struct Entry { let kind: Kind; let label: String; let rolls: [Int]; let total: Int?; let color: Color }
    var count = 1
    var history: [Entry] = []
    private(set) var rolling: (kind: Kind, rolls: [Int], revealed: [Bool])?
    private var task: Task<Void, Never>?

    var lastDisplay: String? {
        guard let e = history.last else { return nil }
        if let t = e.total { return String(t) }
        if e.rolls.count == 1 { return e.kind == .coin ? (e.rolls[0] == 1 ? "H" : "T") : String(e.rolls[0]) }
        return nil
    }

    func roll(_ kind: Kind) {
        task?.cancel()
        let sides = kind == .d6 ? 6 : kind == .d20 ? 20 : 2
        let rolls = (0..<count).map { _ in Int.random(in: 1...sides) }
        let total: Int? = kind == .coin || count == 1 ? nil : rolls.reduce(0, +)
        let color: Color = kind == .d20 && count == 1 ? (rolls[0] == 20 ? Theme.gold : rolls[0] == 1 ? Theme.danger : .accentColor) : .accentColor
        let label = kind == .coin ? (count == 1 ? "Coin Flip" : "\(count)× Coin") : kind == .d6 ? "d6" : "d20"
        history.append(Entry(kind: kind, label: label, rolls: rolls, total: total, color: color))
        rolling = (kind, rolls, rolls.map { _ in false })
        task = Task { @MainActor in
            for i in rolls.indices {
                try? await Task.sleep(for: .milliseconds(i == 0 ? 600 : 230))
                if Task.isCancelled { return }
                rolling?.revealed[i] = true
            }
            try? await Task.sleep(for: .milliseconds(350))
            if !Task.isCancelled { rolling = nil }
        }
    }
}

struct DiceResultView: View {
    let model: DiceModel

    var body: some View {
        if let r = model.rolling {
            if r.rolls.count == 1 {
                if r.revealed[0] { big(r.rolls[0], kind: r.kind, color: model.history.last?.color ?? .accentColor) } else { SpinningDie(kind: r.kind, size: 52) }
            } else {
                HStack(alignment: .bottom, spacing: 6) {
                    ForEach(r.rolls.indices, id: \.self) { i in
                        VStack(spacing: 2) {
                            Text("\(i + 1)").font(.system(size: 9)).foregroundStyle(.secondary)
                            if r.revealed[i] { Text(face(r.rolls[i], kind: r.kind)).font(.system(size: 30, weight: .black)).foregroundStyle(model.history.last?.color ?? .accentColor).transition(.scale(scale: 0.3)) }
                            else { SpinningDie(kind: r.kind, size: 30) }
                        }
                        .animation(.spring(duration: 0.3, bounce: 0.5), value: r.revealed[i])
                    }
                }
            }
        } else if let e = model.history.last {
            if e.rolls.count == 1 {
                big(e.rolls[0], kind: e.kind, color: e.color).transition(.scale(scale: 0.4).combined(with: .opacity))
            } else {
                HStack(alignment: .bottom, spacing: 6) {
                    ForEach(e.rolls.indices, id: \.self) { i in
                        VStack(spacing: 2) {
                            Text("\(i + 1)").font(.system(size: 9)).foregroundStyle(.secondary)
                            Text(face(e.rolls[i], kind: e.kind)).font(.system(size: 30, weight: .black)).foregroundStyle(e.color)
                        }
                    }
                }
            }
        } else {
            Text("—").foregroundStyle(.secondary)
        }
    }

    private func face(_ n: Int, kind: DiceModel.Kind) -> String { kind == .coin ? (n == 1 ? "Heads" : "Tails") : String(n) }
    private func big(_ n: Int, kind: DiceModel.Kind, color: Color) -> some View {
        Text(face(n, kind: kind)).font(.system(size: 52, weight: .black)).foregroundStyle(color)
    }
}
