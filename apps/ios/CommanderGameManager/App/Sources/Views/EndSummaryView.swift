import SwiftUI
import SwiftData
import CommanderGameKit

/// Game over (web `GameEndSummary`): one card per player with their art,
/// final life, poison and commander damage taken, the placements as the save
/// will record them (drag to order the survivors when the game was ended
/// before it was decided), notes, then save for upload or discard.
struct EndSummaryView: View {
    @Bindable var session: GameSession
    let onDone: () -> Void
    @Environment(\.modelContext) private var context
    @Environment(Session.self) private var account
    @State private var notes: String = ""
    @State private var confirmDiscard = false
    @State private var queued = false
    @State private var survivorOrder: [Int] = []

    private var state: GameState { session.state }
    private var undecided: Bool { !state.isTwoHeadedGiant && GameOutcome.activeSeats(state).count > 1 }
    private var results: [GameOutcome.Result] { GameOutcome.results(state, survivorOrder: undecided ? survivorOrder : nil) }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Text("\(state.turnNumber) turns · Starting life: \(state.startingLife)").foregroundStyle(.secondary).frame(maxWidth: .infinity)
                }
                if undecided {
                    Section {
                        ForEach(survivorOrder, id: \.self) { idx in
                            let p = state.players[idx]
                            HStack {
                                Text(ordinal((survivorOrder.firstIndex(of: idx) ?? 0) + 1)).font(.headline).frame(width: 44)
                                Text(p.playerName)
                                Spacer()
                                Text("\(p.life) life").foregroundStyle(.secondary)
                            }
                        }
                        .onMove { from, to in survivorOrder.move(fromOffsets: from, toOffset: to) }
                    } header: {
                        Text("Game ended with \(survivorOrder.count) players alive: drag to order the placements")
                    }
                    .environment(\.editMode, .constant(.active))
                }
                Section("Result") {
                    ForEach(results, id: \.playerId) { r in
                        if let i = state.players.firstIndex(where: { $0.playerId == r.playerId }) {
                            playerCard(state.players[i], idx: i, result: r)
                        }
                    }
                    LabeledContent("Log entries", value: "\(session.log.count)")
                }
                Section("Notes") {
                    TextField("Anything worth remembering", text: $notes, axis: .vertical).lineLimit(2...6)
                }
                Section {
                    Button {
                        queue()
                    } label: {
                        Label(queued ? "Queued for upload" : "Save to the web app", systemImage: queued ? "checkmark.circle.fill" : "icloud.and.arrow.up")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(queued)
                    .accessibilityIdentifier("saveGame")
                    Button(role: .destructive) { confirmDiscard = true } label: {
                        Label("Discard game", systemImage: "trash").frame(maxWidth: .infinity)
                    }
                    .disabled(queued)
                    .accessibilityIdentifier("discardGame")
                } footer: {
                    Text("Saving stores the game on this iPad and uploads it with its log the next time the server is reachable. The table never waits on the network.")
                }
            }
            .navigationTitle("Game over")
            .onAppear {
                notes = GameOutcome.cleanNotes(state.notes) ?? ""
                survivorOrder = GameOutcome.defaultSurvivorOrder(state)
            }
            .confirmationDialog("Discard this game? It will not be recorded.", isPresented: $confirmDiscard, titleVisibility: .visible) {
                Button("Discard", role: .destructive) { session.discard(); onDone() }
            }
        }
    }

    private func playerCard(_ p: PlayerState, idx: Int, result: GameOutcome.Result) -> some View {
        let taken = (state.commanderDamage[idx] ?? [:]).values.reduce(0) { $0 + $1.total }
        let first = result.finishPosition == 1
        return HStack(alignment: .top, spacing: 12) {
            Text(ordinal(result.finishPosition)).font(.title3.bold()).foregroundStyle(first ? Theme.gold : .primary).frame(width: 44)
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(p.playerName).font(.headline)
                    if let t = p.teamNumber {
                        Text("Team \(t)").font(.caption2.bold()).foregroundStyle(.white).padding(.horizontal, 6).padding(.vertical, 2)
                            .background(RoundedRectangle(cornerRadius: 4).fill(t == 1 ? Color.accentColor : .purple))
                    }
                }
                Text("\(p.deckName) · \(p.commander.name)\(p.partner.map { " / \($0.name)" } ?? "")").font(.caption).foregroundStyle(.secondary)
                HStack(spacing: 18) {
                    stat("Final life", "\(p.life)")
                    stat("Poison", "\(p.poison)")
                    stat("Cmd dmg taken", "\(taken)")
                    if let t = result.eliminatedTurn { stat("Eliminated turn", "\(t)") }
                }
            }
            Spacer()
            CommanderArt(name: p.commander.name, height: 50, cornerRadius: 6)
        }
        .padding(.vertical, 4)
        .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(first ? Theme.gold : .clear, lineWidth: 2).padding(-6))
    }

    private func stat(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(label).font(.caption2).foregroundStyle(.secondary)
            Text(value).font(.subheadline.bold())
        }
    }

    private func ordinal(_ n: Int) -> String {
        switch n { case 1: "1st"; case 2: "2nd"; case 3: "3rd"; default: "\(n)th" }
    }

    private func queue() {
        var s = state
        s.notes = notes
        let game = OutboxGame.make(clientGameId: session.clientGameId, playedAt: session.startedAt, state: s,
                                   survivorOrder: undecided ? survivorOrder : nil, log: session.log)
        context.insert(game)
        try? context.save()
        RematchStore.save(s)
        session.discard()
        queued = true
        Task {
            await UploadService.flush(client: account.client, context: context)
            onDone()
        }
    }
}
