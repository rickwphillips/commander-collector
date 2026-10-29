import SwiftUI
import CommanderGameKit

/// The middle of the table: start button and first-player roll while seating,
/// then turn number, whose turn, the turn timer, next/previous turn, dice,
/// log, and end game.
struct CenterZoneView: View {
    @Bindable var session: GameSession
    @Binding var showLog: Bool
    @State private var rollResult: GameOutcome.RollResult?
    @State private var confirmEnd = false
    @State private var winnerCountdown: Int?
    @State private var countdownTask: Task<Void, Never>?

    private var state: GameState { session.state }

    var body: some View {
        VStack(spacing: 14) {
            if session.isSeating {
                seatingControls
            } else {
                playControls
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(RoundedRectangle(cornerRadius: 24).fill(Color(.tertiarySystemGroupedBackground)))
        .confirmationDialog("End the game?", isPresented: $confirmEnd, titleVisibility: .visible) {
            Button("End game", role: .destructive) { session.endGame() }
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
        VStack(spacing: 16) {
            Text(state.isTwoHeadedGiant ? "Two-Headed Giant" : "\(state.players.count)-player Commander")
                .font(.title2.bold())
            Text("\(state.startingLife) life" + (state.turnTimerSeconds > 0 ? " · \(state.turnTimerSeconds / 60) min turns" : ""))
                .foregroundStyle(.secondary)
            if let r = rollResult {
                Text(r.detail).font(.footnote).multilineTextAlignment(.center)
                Text("\(state.players[r.winnerIdx].playerName) goes first").font(.headline)
            }
            HStack {
                Button {
                    var rng = SystemRandomNumberGenerator()
                    let r = state.isTwoHeadedGiant
                        ? GameOutcome.rollForFirstTeam(state, using: &rng)
                        : GameOutcome.rollForFirstPlayer(state, using: &rng)
                    rollResult = r
                    session.chooseFirstPlayer(r.winnerIdx, note: r.detail)
                } label: { Label(rollResult == nil ? "Roll for first player" : "Roll again", systemImage: "dice") }
                .buttonStyle(.bordered)
                .disabled(!session.allSeatsFilled)
                Menu {
                    ForEach(state.players.indices, id: \.self) { i in
                        Button(state.players[i].playerName.isEmpty ? "Seat \(i + 1)" : state.players[i].playerName) {
                            rollResult = nil
                            session.chooseFirstPlayer(i, note: nil)
                        }
                    }
                } label: { Label("Pick", systemImage: "hand.point.up.left") }
                .buttonStyle(.bordered)
                .disabled(!session.allSeatsFilled)
            }
            Button {
                session.start()
            } label: {
                Label("Start game", systemImage: "play.fill").font(.title3.bold()).frame(maxWidth: 260)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .disabled(!session.allSeatsFilled || state.firstPlayerIdx == nil)
            if !session.allSeatsFilled {
                Text("Seat every player to start").font(.caption).foregroundStyle(.secondary)
            } else if state.firstPlayerIdx == nil {
                Text("Roll or pick who goes first").font(.caption).foregroundStyle(.secondary)
            }
        }
    }

    // MARK: Play

    private var activeLabel: String {
        let p = state.players[state.currentPlayerIdx]
        if state.isTwoHeadedGiant, let t = p.teamNumber {
            return Teams.label(t, players: state.players, teamNames: state.teamNames)
        }
        return p.playerName
    }

    private var playControls: some View {
        VStack(spacing: 12) {
            if let w = session.winnerIdx {
                let name = state.isTwoHeadedGiant
                    ? Teams.label(state.players[w].teamNumber, players: state.players, teamNames: state.teamNames)
                    : state.players[w].playerName
                VStack(spacing: 4) {
                    Text("🏆 \(name) wins").font(.title.bold())
                    if let n = winnerCountdown { Text("Ending in \(n)s").font(.caption).foregroundStyle(.secondary) }
                    HStack {
                        Button("End now") { session.endGame() }.buttonStyle(.borderedProminent)
                        Button("Keep playing") { countdownTask?.cancel(); winnerCountdown = nil }.buttonStyle(.bordered)
                    }
                }
            }
            Text("Turn \(state.turnNumber)").font(.system(size: 34, weight: .bold, design: .rounded))
            Text(activeLabel).font(.title3)
            TimelineView(.periodic(from: .now, by: 1)) { ctx in
                let elapsed = session.elapsedSeconds(now: ctx.date)
                let over = state.turnTimerSeconds > 0 && elapsed > state.turnTimerSeconds
                Text(String(format: "%d:%02d", elapsed / 60, elapsed % 60))
                    .font(.system(size: 30, weight: .medium, design: .monospaced))
                    .foregroundStyle(over ? Color.red : .secondary)
                    .phaseAnimator([false, true]) { view, phase in
                        view.opacity(over && phase ? 0.4 : 1)
                    } animation: { _ in .easeInOut(duration: 0.6) }
            }
            HStack(spacing: 12) {
                Button {
                    session.dispatch(.prevTurn)
                } label: { Image(systemName: "backward.fill") }
                .buttonStyle(.bordered)
                .disabled(state.turnNumber == 1 && state.currentPlayerIdx == (state.firstPlayerIdx ?? 0))
                Button {
                    session.dispatch(.passTurn)
                } label: { Label("Next turn", systemImage: "forward.fill").font(.title3.bold()).frame(minWidth: 180) }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .sensoryFeedback(.impact, trigger: state.currentPlayerIdx)
            }
            HStack(spacing: 8) {
                Menu {
                    ForEach([4, 6, 8, 10, 12, 20], id: \.self) { sides in
                        Button("d\(sides)") {
                            let r = Int.random(in: 1...sides)
                            session.logDiceRoll(label: "d\(sides)", rolls: [r])
                            lastRoll = "d\(sides): \(r)"
                        }
                    }
                    Button("Coin flip") {
                        let r = Bool.random()
                        session.logDiceRoll(label: "coin", rolls: [r ? 1 : 0])
                        lastRoll = r ? "Heads" : "Tails"
                    }
                } label: { Label(lastRoll ?? "Roll", systemImage: "dice") }
                Button { showLog = true } label: { Label("Log", systemImage: "list.bullet.rectangle") }
                Button(role: .destructive) { confirmEnd = true } label: { Label("End", systemImage: "stop.fill") }
                    .accessibilityIdentifier("endGame")
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
        }
    }
    @State private var lastRoll: String?
}
