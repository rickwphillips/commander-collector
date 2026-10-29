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
    @State private var activeGame: ActiveGame? = ActiveGameStore.load()
    @State private var resume = false

    var body: some View {
        NavigationStack {
            Form {
                if let game = activeGame {
                    Section("Game in progress") {
                        LabeledContent("Started", value: game.startedAt.formatted(date: .abbreviated, time: .shortened))
                        LabeledContent("Turn", value: "\(game.state.turnNumber)")
                        Button { resume = true } label: { Label("Resume game", systemImage: "play.circle.fill") }
                        Button("Discard it", role: .destructive) { ActiveGameStore.clear(); activeGame = nil }
                    }
                }
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
                            VStack(alignment: .leading, spacing: 2) {
                                LabeledContent(game.playedAt.formatted(date: .abbreviated, time: .shortened), value: game.status.rawValue.capitalized)
                                    .accessibilityIdentifier("outbox-\(game.status.rawValue)")
                                if let err = game.lastError, game.status == .failed || game.status == .rejected {
                                    Text(err).font(.caption).foregroundStyle(.red)
                                        .accessibilityIdentifier("outbox-error")
                                }
                            }
                            .swipeActions {
                                if game.status != .uploaded {
                                    Button("Delete", role: .destructive) { context.delete(game); try? context.save() }
                                }
                            }
                        }
                        if outbox.contains(where: { $0.status == .pending || $0.status == .failed }) {
                            Button { Task { await UploadService.flush(client: session.client, context: context) } } label: {
                                Label("Upload now", systemImage: "icloud.and.arrow.up")
                            }
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
            .task {
                if DemoMode.wantsBoard && activeGame != nil { resume = true; return }
                if players.isEmpty && !DemoMode.usesFakeAccount { refresh() }
                if !DemoMode.usesFakeAccount { await UploadService.flush(client: session.client, context: context) }
            }
            .onAppear { activeGame = ActiveGameStore.load() }
            .navigationDestination(isPresented: $resume) {
                if let game = activeGame { BoardView(resuming: game) }
            }
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
