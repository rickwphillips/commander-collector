import SwiftUI
import SwiftData
import CommanderGameKit

/// Table-wide setup, the web `GameSetup`: player count, starting life presets
/// or a custom value, turn timer, game type, Random fill, and a rematch of the
/// last saved game. Per-seat player and deck choice happens on the board.
struct HomeView: View {
    @Environment(Session.self) private var session
    @Environment(GameSettingsStore.self) private var settings
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.modelContext) private var context
    @Environment(\.horizontalSizeClass) private var sizeClass
    @Query(sort: \CachedPlayer.name) private var players: [CachedPlayer]
    @Query(sort: \CachedDeck.name) private var decks: [CachedDeck]
    @Query(sort: \OutboxGame.createdAt, order: .reverse) private var outbox: [OutboxGame]

    @State private var playerCount = 4
    @State private var startingLife = 40
    @State private var customLife = ""
    @State private var timerSeconds = 300
    /// What the setup offers. 1v1 2HG is a 2HG table where one player pilots
    /// both heads of a team.
    private enum TableMode: Hashable { case standard, twoHeadedGiant, oneVsOne2hg }
    @State private var mode: TableMode = .standard
    private var gameType: GameType { mode == .standard ? .standard : .twoHeadedGiant }
    @State private var random = false
    @State private var refreshing = false
    @State private var refreshMessage: String?
    @State private var confirmClear = false
    @State private var lastRefreshAt = Date.distantPast
    /// Minimum gap between automatic foreground refreshes.
    private static let foregroundRefreshInterval: TimeInterval = 5 * 60
    @State private var activeGame: ActiveGame? = ActiveGameStore.load()
    @State private var resume = false
    @State private var setup: GameSetupInput?
    @State private var showJoin = false
    @State private var showNewDeck = false

    private static let lifePresets = [20, 30, 40]

    private var startingLifeControls: some View {
        HStack {
            Picker("Starting life", selection: Binding(get: { Self.lifePresets.contains(startingLife) && customLife.isEmpty ? startingLife : 0 }, set: { v in if v > 0 { startingLife = v; customLife = "" } })) {
                ForEach(Self.lifePresets, id: \.self) { Text("\($0)").tag($0) }
            }
            .pickerStyle(.segmented).frame(width: 180)
            TextField("Custom", text: $customLife).keyboardType(.numberPad).textFieldStyle(.roundedBorder).frame(width: 80)
                .onChange(of: customLife) { _, v in if let n = Int(v), n > 0 { startingLife = n } }
        }
    }

    private var continueButton: some View {
        Button("Continue to seating") { start(prefill: random ? randomPrefill() : []) }
            .buttonStyle(.borderedProminent)
            .accessibilityIdentifier("continueToSeating")
            .disabled(players.isEmpty || decks.isEmpty)
    }
    private var seatCount: Int { gameType == .twoHeadedGiant ? 4 : playerCount }
    private var lastGame: RematchStore.Entry? { RematchStore.load() }

    var body: some View {
        NavigationStack {
            Form {
                // A phone's narrow bar folds trailing buttons into "…": give
                // the primary action its own row at the top instead.
                if sizeClass == .compact {
                    Section { continueButton.frame(maxWidth: .infinity).controlSize(.large) }
                }
                if let game = activeGame {
                    Section("Game in progress") {
                        LabeledContent("Started", value: game.startedAt.formatted(date: .abbreviated, time: .shortened))
                        LabeledContent("Turn", value: "\(game.state.turnNumber)")
                        Button { resume = true } label: { Label("Resume game", systemImage: "play.circle.fill") }
                        Button("Discard it", role: .destructive) { ActiveGameStore.clear(); activeGame = nil }
                    }
                }
                Section("Table") {
                    Picker("Game type", selection: $mode) {
                        Text("Standard").tag(TableMode.standard)
                        Text("Two-Headed Giant").tag(TableMode.twoHeadedGiant)
                        Text("1v1 2HG").tag(TableMode.oneVsOne2hg)
                    }
                    .pickerStyle(.segmented)
                    .accessibilityIdentifier("gameType")
                    .onChange(of: mode) { _, mode in
                        if mode != .standard { playerCount = 4 }
                        if customLife.isEmpty { startingLife = mode != .standard ? 30 : playerCount == 2 ? 30 : 40 }
                    }
                    Picker("Players", selection: $playerCount) {
                        ForEach(2...4, id: \.self) { Text("\($0)").tag($0) }
                    }
                    .pickerStyle(.segmented)
                    .disabled(mode != .standard)
                    .onChange(of: playerCount) { _, n in if customLife.isEmpty && mode == .standard { startingLife = n == 2 ? 30 : 40 } }
                    if mode == .twoHeadedGiant {
                        Text("Two-Headed Giant is always 4 players (two teams of two).").font(.footnote).foregroundStyle(.secondary)
                    }
                    if mode == .oneVsOne2hg {
                        Text("1v1 2HG is a Two-Headed Giant game for two players: each plays both decks of a team. Four seats, same rules.").font(.footnote).foregroundStyle(.secondary)
                    }
                    // A phone in portrait has no room beside the label: the
                    // controls drop under it instead of wrapping the label.
                    ViewThatFits(in: .horizontal) {
                        HStack { Text("Starting life"); Spacer(); startingLifeControls }
                        VStack(alignment: .leading, spacing: 6) { Text("Starting life"); startingLifeControls }
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
                            Text(mode == .oneVsOne2hg
                                 ? "Each team gets a different player and two of their own decks. You can still change any seat before starting."
                                 : "Each seat gets a different player and one of their own decks. You can still change any seat before starting.").font(.footnote).foregroundStyle(.secondary)
                        }
                    }
                    .accessibilityIdentifier("randomToggle")
                }
                Section {
                    Button { showJoin = true } label: { Label("Join a table nearby", systemImage: "qrcode.viewfinder") }
                } footer: {
                    Text("Use this device as a remote for one seat at another iPad's table.")
                }
                if let last = lastGame {
                    Section("Rematch") {
                        Button {
                            mode = last.gameType != .twoHeadedGiant ? .standard : last.onePilotPerTeam == true ? .oneVsOne2hg : .twoHeadedGiant
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
                    Button { showNewDeck = true } label: { Label("New deck", systemImage: "plus.rectangle.on.rectangle") }
                        .disabled(players.isEmpty)
                        .accessibilityIdentifier("newDeck")
                    if let refreshMessage { Text(refreshMessage).font(.footnote).foregroundStyle(.secondary) }
                    Button(role: .destructive) { confirmClear = true } label: { Label("Clear cached data", systemImage: "trash") }
                        .disabled(refreshing || (players.isEmpty && decks.isEmpty))
                        .accessibilityIdentifier("clearCache")
                        .confirmationDialog("Clear cached players and decks?", isPresented: $confirmClear, titleVisibility: .visible) {
                            Button("Clear and refresh", role: .destructive) { clearCache(thenRefresh: true) }
                            Button("Clear only", role: .destructive) { clearCache(thenRefresh: false) }
                            Button("Cancel", role: .cancel) {}
                        } message: {
                            Text("Finished games waiting to upload and a game in progress are kept.")
                        }
                } header: {
                    Text("Reference data")
                } footer: {
                    Text("Seating uses the cached players and decks, so the game works with no network. The cache refreshes when the app returns to the foreground.")
                }
                Section {
                    Link(destination: CommanderWeb.games) { Label("Games", systemImage: "list.bullet.rectangle") }
                        .accessibilityIdentifier("webGames")
                    Link(destination: CommanderWeb.decks) { Label("Decks", systemImage: "rectangle.stack") }
                        .accessibilityIdentifier("webDecks")
                } header: {
                    Text("Commander Collector on the web")
                } footer: {
                    Text("Opens in Safari. Game history, stats and deck editing live on the website.")
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
                    Menu(accountLabel) {
                        Button("Sign out", role: .destructive) { session.signOut() }
                    }
                }
                if sizeClass != .compact {
                    ToolbarItem(placement: .topBarTrailing) { continueButton }
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
            // Decks deleted or added on the website should show up without a
            // manual refresh: pull again whenever the app comes back to the front,
            // throttled so flipping between apps does not hammer the API.
            .onChange(of: scenePhase) { _, phase in
                guard phase == .active, !DemoMode.usesFakeAccount, !players.isEmpty else { return }
                if Date.now.timeIntervalSince(lastRefreshAt) > Self.foregroundRefreshInterval { refresh() }
            }
            .fullScreenCover(isPresented: $showJoin) { JoinTableView() }
            // The same editor the seat picker uses; a deck created here is
            // saved to the web app, then the cache is pulled fresh.
            .sheet(isPresented: $showNewDeck) {
                DeckEditorSheet(playerId: defaultDeckOwner, onDone: { showNewDeck = false }, onCreated: { _ in refresh() })
                    .presentationDetents([.large])
            }
            .navigationDestination(isPresented: $resume) {
                if let game = activeGame { BoardView(resuming: game) }
            }
            .navigationDestination(item: $setup) { input in
                BoardView(setup: input)
            }
        }
    }

    /// The signed-in user's player name when a player row is linked to the
    /// account, else the login name.
    private var accountLabel: String {
        if let uid = session.userId, let me = players.first(where: { $0.userId == uid }) { return me.name }
        return session.username ?? "Account"
    }

    /// The signed-in user's own player when linked, else the first player.
    private var defaultDeckOwner: String {
        if let uid = session.userId, let me = players.first(where: { $0.userId == uid }) { return me.id }
        return players.first?.id ?? ""
    }

    private func start(prefill: [GameSetup.Seat?]) {
        setup = GameSetupInput(playerCount: seatCount, startingLife: startingLife, turnTimerSeconds: max(0, timerSeconds), gameType: gameType, onePilotPerTeam: mode == .oneVsOne2hg, prefill: prefill)
    }

    /// Web `buildRandomPrefill`: up to `seatCount` unique players, each with
    /// one of their own decks chosen at random; short when too few qualify.
    private func randomPrefill() -> [GameSetup.Seat?] {
        var byPlayer: [String: [CachedDeck]] = [:]
        for d in decks { byPlayer[d.playerId, default: []].append(d) }
        func seat(_ deck: CachedDeck) -> GameSetup.Seat {
            GameSetup.Seat(playerId: deck.playerId, playerName: deck.playerName, deckId: deck.id, deckName: deck.name,
                           commander: CommanderInfo(name: deck.commander), partner: deck.partner.map { CommanderInfo(name: $0) })
        }
        // 1v1 2HG: two players with at least two decks each; seats run team 1, team 1, team 2, team 2.
        if mode == .oneVsOne2hg {
            return byPlayer.values.filter { $0.count >= 2 }.shuffled().prefix(2).flatMap { $0.shuffled().prefix(2).map(seat) }
        }
        let chosen = byPlayer.keys.shuffled().prefix(seatCount)
        return chosen.map { pid in
            let deck = byPlayer[pid]!.randomElement()!
            return GameSetup.Seat(playerId: deck.playerId, playerName: deck.playerName, deckId: deck.id, deckName: deck.name,
                                  commander: CommanderInfo(name: deck.commander), partner: deck.partner.map { CommanderInfo(name: $0) })
        }
    }

    private func clearCache(thenRefresh: Bool) {
        do {
            try ReferenceDataService.clearCache(in: context)
            refreshMessage = "Cache cleared."
        } catch {
            refreshMessage = "Could not clear the cache: \(error.localizedDescription)"
            return
        }
        if thenRefresh { refresh() }
    }

    private func refresh() {
        guard !refreshing else { return }
        refreshing = true
        refreshMessage = nil
        Task {
            defer { refreshing = false }
            do {
                let summary = try await ReferenceDataService.refresh(using: session.client, into: context)
                lastRefreshAt = .now
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
    /// 1v1 2HG: one player pilots both heads of a team.
    var onePilotPerTeam = false
    /// Seats to pre-fill (Random or Rematch); nil entries stay empty.
    var prefill: [GameSetup.Seat?] = []
}

/// The last saved game's seats, for a rematch from the setup screen.
enum RematchStore {
    struct Entry: Codable {
        var seats: [GameSetup.Seat?]
        var startingLife: Int
        var gameType: GameType
        var onePilotPerTeam: Bool?
    }
    private static let key = "rematch.last"

    static func save(_ state: GameState) {
        let seats: [GameSetup.Seat?] = state.players.map { p in
            GameSetup.isSeatFilled(p) ? GameSetup.Seat(playerId: p.playerId, playerName: p.playerName, deckId: p.deckId, deckName: p.deckName, commander: p.commander, partner: p.partner) : nil
        }
        let entry = Entry(seats: seats, startingLife: state.startingLife, gameType: state.gameType ?? .standard, onePilotPerTeam: state.onePilotPerTeam)
        if let data = try? JSONEncoder().encode(entry) { UserDefaults.standard.set(data, forKey: key) }
    }

    static func load() -> Entry? {
        guard let data = UserDefaults.standard.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(Entry.self, from: data)
    }
}
