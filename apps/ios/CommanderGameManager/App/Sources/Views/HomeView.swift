import SwiftUI
import SwiftData
import CommanderGameKit

/// Table-wide setup, the same options as the web GameSetup: player count,
/// starting life, turn timer, game type. Per-seat player and deck choice
/// happens on the board in the seating phase.
struct HomeView: View {
    @Environment(Session.self) private var session
    @Environment(\.modelContext) private var context
    @Query(sort: \CachedPlayer.name) private var players: [CachedPlayer]
    @Query(sort: \CachedDeck.name) private var decks: [CachedDeck]
    @Query(sort: \OutboxGame.createdAt, order: .reverse) private var outbox: [OutboxGame]

    @State private var playerCount = 4
    @State private var startingLife = 40
    @State private var timerEnabled = true
    @State private var timerMinutes = 5
    @State private var gameType: GameType = .standard
    @State private var refreshing = false
    @State private var refreshMessage: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Table") {
                    Picker("Game type", selection: $gameType) {
                        Text("Standard").tag(GameType.standard)
                        Text("Two-Headed Giant").tag(GameType.twoHeadedGiant)
                    }
                    .pickerStyle(.segmented)
                    .onChange(of: gameType) { _, type in
                        if type == .twoHeadedGiant { playerCount = 4; startingLife = 30 } else { startingLife = 40 }
                    }
                    Stepper("Players: \(playerCount)", value: $playerCount, in: 2...4)
                        .disabled(gameType == .twoHeadedGiant)
                    Stepper("Starting life: \(startingLife)", value: $startingLife, in: 20...60, step: 5)
                }
                Section("Turn timer") {
                    Toggle("Turn timer", isOn: $timerEnabled)
                    if timerEnabled {
                        Stepper("\(timerMinutes) min per turn", value: $timerMinutes, in: 1...30)
                    }
                }
                Section {
                    LabeledContent("Players cached", value: "\(players.count)")
                    LabeledContent("Decks cached", value: "\(decks.count)")
                    Button(action: refresh) {
                        HStack {
                            Text("Refresh from web")
                            if refreshing { Spacer(); ProgressView() }
                        }
                    }
                    .disabled(refreshing)
                    if let refreshMessage { Text(refreshMessage).font(.footnote).foregroundStyle(.secondary) }
                } header: {
                    Text("Reference data")
                } footer: {
                    Text("Seating uses the cached players and decks, so the game works with no network.")
                }
                if !outbox.isEmpty {
                    Section("Finished games") {
                        ForEach(outbox) { game in
                            LabeledContent(game.playedAt.formatted(date: .abbreviated, time: .shortened), value: game.status.rawValue.capitalized)
                        }
                    }
                }
            }
            .navigationTitle("New game")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Menu(session.username ?? "Account") {
                        Button("Sign out", role: .destructive) { session.signOut() }
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    NavigationLink("Seat players") {
                        BoardView(setup: GameSetupInput(
                            playerCount: playerCount,
                            startingLife: startingLife,
                            turnTimerSeconds: timerEnabled ? timerMinutes * 60 : 0,
                            gameType: gameType))
                    }
                    .disabled(players.isEmpty || decks.isEmpty)
                }
            }
            .task { if players.isEmpty { refresh() } }
        }
    }

    private func refresh() {
        guard !refreshing else { return }
        refreshing = true
        refreshMessage = nil
        Task {
            defer { refreshing = false }
            do {
                let summary = try await ReferenceDataService.refresh(using: session.client, into: context)
                refreshMessage = "Updated \(summary.players) players and \(summary.decks) decks."
            } catch {
                refreshMessage = "Could not refresh: \(error.localizedDescription). Using cached data."
            }
        }
    }
}

/// What the setup screen hands to the board.
struct GameSetupInput: Hashable {
    var playerCount: Int
    var startingLife: Int
    var turnTimerSeconds: Int
    var gameType: GameType
}
