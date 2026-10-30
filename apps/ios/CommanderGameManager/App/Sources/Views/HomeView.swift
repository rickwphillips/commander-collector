import SwiftUI
import SwiftData
import CommanderGameKit

/// Table-wide setup, the web `GameSetup`: player count, starting life presets
/// or a custom value, turn timer, game type, Random fill, and a rematch of the
/// last saved game. Per-seat player and deck choice happens on the board.
struct HomeView: View {
    @Environment(Session.self) private var session
    @Environment(GameSettingsStore.self) private var settings
    @Environment(\.modelContext) private var context
    @Query(sort: \CachedPlayer.name) private var players: [CachedPlayer]
    @Query(sort: \CachedDeck.name) private var decks: [CachedDeck]
    @Query(sort: \OutboxGame.createdAt, order: .reverse) private var outbox: [OutboxGame]

    @State private var playerCount = 4
    @State private var startingLife = 40
    @State private var customLife = ""
    @State private var timerSeconds = 300
    @State private var gameType: GameType = .standard
    @State private var random = false
    @State private var refreshing = false
    @State private var refreshMessage: String?
    @State private var activeGame: ActiveGame? = ActiveGameStore.load()
    @State private var resume = false
    @State private var setup: GameSetupInput?
    @State private var showJoin = false

    private static let lifePresets = [20, 30, 40]
    private var seatCount: Int { gameType == .twoHeadedGiant ? 4 : playerCount }
    private var lastGame: RematchStore.Entry? { RematchStore.load() }

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
                        if type == .twoHeadedGiant { playerCount = 4 }
                        if customLife.isEmpty { startingLife = type == .twoHeadedGiant ? 30 : playerCount == 2 ? 30 : 40 }
                    }
                    Picker("Players", selection: $playerCount) {
                        ForEach(2...4, id: \.self) { Text("\($0)").tag($0) }
                    }
                    .pickerStyle(.segmented)
                    .disabled(gameType == .twoHeadedGiant)
                    .onChange(of: playerCount) { _, n in if customLife.isEmpty && gameType == .standard { startingLife = n == 2 ? 30 : 40 } }
                    if gameType == .twoHeadedGiant {
                        Text("Two-Headed Giant is always 4 players (two teams of two).").font(.footnote).foregroundStyle(.secondary)
                    }
                    HStack {
                        Text("Starting life")
                        Spacer()
                        Picker("Starting life", selection: Binding(get: { Self.lifePresets.contains(startingLife) && customLife.isEmpty ? startingLife : 0 }, set: { v in if v > 0 { startingLife = v; customLife = "" } })) {
                            ForEach(Self.lifePresets, id: \.self) { Text("\($0)").tag($0) }
                        }
                        .pickerStyle(.segmented).frame(width: 180)
                        TextField("Custom", text: $customLife).keyboardType(.numberPad).textFieldStyle(.roundedBorder).frame(width: 80)
                            .onChange(of: customLife) { _, v in if let n = Int(v), n > 0 { startingLife = n } }
                    }
                    HStack {
                        Text("Turn timer")
                        Spacer()
                        TextField("Seconds", value: $timerSeconds, format: .number).keyboardType(.numberPad).textFieldStyle(.roundedBorder).frame(width: 90)
                        Text("seconds (0 = off)").font(.footnote).foregroundStyle(.secondary)
                    }
                    Toggle(isOn: $random) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Random: auto-fill seats with players and their decks")
                            Text("Each seat gets a different player and one of their own decks. You can still change any seat before starting.").font(.footnote).foregroundStyle(.secondary)
                        }
                    }
                }
                Section {
                    Button { showJoin = true } label: { Label("Join a table nearby", systemImage: "qrcode.viewfinder") }
                } footer: {
                    Text("Use this device as a remote for one seat at another iPad's table.")
                }
                if let last = lastGame {
                    Section("Rematch") {
                        Button {
                            gameType = last.gameType
                            playerCount = last.seats.count
                            startingLife = last.startingLife
                            customLife = Self.lifePresets.contains(last.startingLife) ? "" : String(last.startingLife)
                            start(prefill: last.seats)
                        } label: {
                            VStack(alignment: .leading, spacing: 2) {
                                Label("Rematch last game", systemImage: "arrow.2.squarepath")
                                Text(last.seats.compactMap { $0?.playerName }.joined(separator: ", ")).font(.footnote).foregroundStyle(.secondary)
                            }
                        }
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
                    Button("Continue to seating") { start(prefill: random ? randomPrefill() : []) }
                        .buttonStyle(.borderedProminent)
                        .disabled(players.isEmpty || decks.isEmpty)
                }
            }
            .task {
                timerSeconds = settings.turnTimerEnabled ? settings.turnTimerSeconds : 0
                if DemoMode.wantsBoard && activeGame != nil { resume = true; return }
                if players.isEmpty && !DemoMode.usesFakeAccount { refresh() }
                if !DemoMode.usesFakeAccount {
                    await settings.pull(using: session.client)
                    timerSeconds = settings.turnTimerEnabled ? settings.turnTimerSeconds : 0
                    await UploadService.flush(client: session.client, context: context)
                }
            }
            .onAppear { activeGame = ActiveGameStore.load() }
            .fullScreenCover(isPresented: $showJoin) { JoinTableView() }
            .navigationDestination(isPresented: $resume) {
                if let game = activeGame { BoardView(resuming: game) }
            }
            .navigationDestination(item: $setup) { input in
                BoardView(setup: input)
            }
        }
    }

    private func start(prefill: [GameSetup.Seat?]) {
        setup = GameSetupInput(playerCount: seatCount, startingLife: startingLife, turnTimerSeconds: max(0, timerSeconds), gameType: gameType, prefill: prefill)
    }

    /// Web `buildRandomPrefill`: up to `seatCount` unique players, each with
    /// one of their own decks chosen at random; short when too few qualify.
    private func randomPrefill() -> [GameSetup.Seat?] {
        var byPlayer: [String: [CachedDeck]] = [:]
        for d in decks { byPlayer[d.playerId, default: []].append(d) }
        let chosen = byPlayer.keys.shuffled().prefix(seatCount)
        return chosen.map { pid in
            let deck = byPlayer[pid]!.randomElement()!
            return GameSetup.Seat(playerId: deck.playerId, playerName: deck.playerName, deckId: deck.id, deckName: deck.name,
                                  commander: CommanderInfo(name: deck.commander), partner: deck.partner.map { CommanderInfo(name: $0) })
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
    /// Seats to pre-fill (Random or Rematch); nil entries stay empty.
    var prefill: [GameSetup.Seat?] = []
}

/// The last saved game's seats, for a rematch from the setup screen.
enum RematchStore {
    struct Entry: Codable {
        var seats: [GameSetup.Seat?]
        var startingLife: Int
        var gameType: GameType
    }
    private static let key = "rematch.last"

    static func save(_ state: GameState) {
        let seats: [GameSetup.Seat?] = state.players.map { p in
            GameSetup.isSeatFilled(p) ? GameSetup.Seat(playerId: p.playerId, playerName: p.playerName, deckId: p.deckId, deckName: p.deckName, commander: p.commander, partner: p.partner) : nil
        }
        let entry = Entry(seats: seats, startingLife: state.startingLife, gameType: state.gameType ?? .standard)
        if let data = try? JSONEncoder().encode(entry) { UserDefaults.standard.set(data, forKey: key) }
    }

    static func load() -> Entry? {
        guard let data = UserDefaults.standard.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(Entry.self, from: data)
    }
}
