import SwiftUI
import SwiftData
import CommanderGameKit

/// Placements as the save will record them, then queue the game for upload or
/// throw it away. Queuing is local; the upload worker sends it when it can.
struct EndSummaryView: View {
    @Bindable var session: GameSession
    let onDone: () -> Void
    @Environment(\.modelContext) private var context
    @Environment(Session.self) private var account
    @State private var notes: String = ""
    @State private var confirmDiscard = false
    @State private var queued = false
    /// Seats still alive, best placed first; only shown when the game was
    /// ended before it was decided (the web asks for placements then too).
    @State private var survivorOrder: [Int] = []

    private var undecided: Bool { !session.state.isTwoHeadedGiant && GameOutcome.activeSeats(session.state).count > 1 }
    private var results: [GameOutcome.Result] { GameOutcome.results(session.state, survivorOrder: undecided ? survivorOrder : nil) }

    var body: some View {
        NavigationStack {
            Form {
                if undecided {
                    Section {
                        ForEach(survivorOrder, id: \.self) { idx in
                            let p = session.state.players[idx]
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
                        let p = session.state.players.first { $0.playerId == r.playerId }
                        HStack {
                            Text(ordinal(r.finishPosition)).font(.title3.bold()).frame(width: 44)
                            VStack(alignment: .leading) {
                                Text(p?.playerName ?? r.playerId).font(.headline)
                                Text(p?.deckName ?? r.deckId).font(.subheadline).foregroundStyle(.secondary)
                            }
                            Spacer()
                            if let t = r.eliminatedTurn { Text("out turn \(t)").foregroundStyle(.secondary) }
                            if let team = r.teamNumber { Text("Team \(team)").font(.caption).foregroundStyle(.secondary) }
                        }
                    }
                    LabeledContent("Turns", value: "\(session.state.turnNumber)")
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
                } footer: {
                    Text("Saving stores the game on this iPad and uploads it with its log the next time the server is reachable. The table never waits on the network.")
                }
            }
            .navigationTitle("Game over")
            .onAppear {
                notes = GameOutcome.cleanNotes(session.state.notes) ?? ""
                survivorOrder = GameOutcome.defaultSurvivorOrder(session.state)
            }
            .confirmationDialog("Discard this game? It will not be recorded.", isPresented: $confirmDiscard, titleVisibility: .visible) {
                Button("Discard", role: .destructive) { session.discard(); onDone() }
            }
        }
    }

    private func ordinal(_ n: Int) -> String {
        switch n { case 1: "1st"; case 2: "2nd"; case 3: "3rd"; default: "\(n)th" }
    }

    private func queue() {
        var state = session.state
        state.notes = notes
        let game = OutboxGame.make(clientGameId: session.clientGameId, playedAt: session.startedAt, state: state,
                                   survivorOrder: undecided ? survivorOrder : nil, log: session.log)
        context.insert(game)
        try? context.save()
        session.discard()
        queued = true
        Task {
            await UploadService.flush(client: account.client, context: context)
            onDone()
        }
    }
}
