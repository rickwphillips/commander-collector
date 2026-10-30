import SwiftUI
import SwiftData
import CommanderGameKit
import CommanderAPI

/// Per-seat picker (web `SeatPickerModal`): choose a deck (the seated
/// player's own decks first, then everyone's), the player, the commander
/// with Scryfall search and art preview, an optional partner, or create a
/// new deck for the player from here.
struct SeatPickerSheet: View {
    @Bindable var session: GameSession
    let idx: Int
    let taken: Set<String>
    @Environment(\.dismiss) private var dismiss
    @Query(sort: \CachedPlayer.name) private var players: [CachedPlayer]
    @Query(sort: \CachedDeck.name) private var decks: [CachedDeck]

    @State private var playerId = ""
    @State private var deckId = ""
    @State private var commander = CommanderField()
    @State private var hasPartner = false
    @State private var partner = CommanderField()
    @State private var error: String?
    @State private var deckSearch = ""
    @State private var showNewDeck = false

    private var seat: PlayerState { session.state.players[idx] }
    private var ownDecks: [CachedDeck] { decks.filter { $0.playerId == playerId && matches($0) } }
    private var otherDecks: [CachedDeck] { decks.filter { $0.playerId != playerId && matches($0) } }
    private func matches(_ d: CachedDeck) -> Bool {
        deckSearch.isEmpty || d.name.localizedCaseInsensitiveContains(deckSearch) || d.commander.localizedCaseInsensitiveContains(deckSearch) || d.playerName.localizedCaseInsensitiveContains(deckSearch)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Player", selection: $playerId) {
                        Text("Select a player").tag("")
                        ForEach(players) { p in
                            Text(p.name + (taken.contains(p.id) && p.id != seat.playerId ? " (seated)" : "")).tag(p.id)
                                .selectionDisabled(taken.contains(p.id) && p.id != seat.playerId)
                        }
                    }
                } header: {
                    Text("\(seat.position.rawValue.capitalized) seat")
                }
                Section {
                    TextField("Search decks", text: $deckSearch)
                    if !ownDecks.isEmpty {
                        deckRows(ownDecks, header: "Player's decks")
                    }
                    deckRows(otherDecks, header: ownDecks.isEmpty ? nil : "Other decks")
                    Button { showNewDeck = true } label: { Label("New deck…", systemImage: "plus.circle") }
                        .disabled(playerId.isEmpty && players.isEmpty)
                } header: {
                    Text("Deck")
                }
                Section("Commander") {
                    CommanderSearchField(label: "Commander", field: $commander)
                    Toggle("Partner commander?", isOn: $hasPartner)
                    if hasPartner { CommanderSearchField(label: "Partner commander", field: $partner) }
                }
                if let error { Section { Text(error).foregroundStyle(.red) } }
            }
            .navigationTitle("Choose player & deck")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) { Button("Save seat") { confirm() }.bold() }
            }
            .sheet(isPresented: $showNewDeck) {
                DeckEditorSheet(playerId: playerId.isEmpty ? (players.first?.id ?? "") : playerId) { deck in
                    choose(deck)
                }
            }
            .onAppear {
                if GameSetup.isSeatFilled(seat) {
                    playerId = seat.playerId
                    deckId = seat.deckId
                    commander = CommanderField(name: seat.commander.name)
                    hasPartner = seat.partner != nil
                    partner = CommanderField(name: seat.partner?.name ?? "")
                }
            }
        }
    }

    @ViewBuilder private func deckRows(_ list: [CachedDeck], header: String?) -> some View {
        if let header { Text(header).font(.caption).foregroundStyle(.secondary) }
        ForEach(list) { d in
            Button { choose(d) } label: {
                HStack {
                    VStack(alignment: .leading, spacing: 1) {
                        Text(d.name).foregroundStyle(.primary)
                        Text(d.partner.map { "\(d.commander) / \($0)" } ?? d.commander).font(.caption).foregroundStyle(.secondary)
                        if d.playerId != playerId { Text(d.playerName).font(.caption2).foregroundStyle(.tertiary) }
                    }
                    Spacer()
                    if deckId == d.id { Image(systemName: "checkmark").foregroundStyle(Color.accentColor) }
                }
            }
        }
    }

    /// Web `handleDeckChange`: picking a deck fills the commander (and
    /// partner) and, when no player is chosen yet, its owner if they are free.
    private func choose(_ d: CachedDeck) {
        deckId = d.id
        if playerId.isEmpty, !taken.contains(d.playerId) || d.playerId == seat.playerId { playerId = d.playerId }
        commander = CommanderField(name: d.commander)
        hasPartner = d.partner != nil
        partner = CommanderField(name: d.partner ?? "")
    }

    private func confirm() {
        guard !playerId.isEmpty else { error = "Pick a player."; return }
        guard !deckId.isEmpty else { error = "Pick a deck."; return }
        guard !commander.name.isEmpty else { error = "Commander is required."; return }
        if hasPartner && partner.name.isEmpty { error = "Partner commander is required (or turn Partner off)."; return }
        let player = players.first { $0.id == playerId }
        let deck = decks.first { $0.id == deckId }
        session.seat(idx, GameSetup.Seat(
            playerId: playerId, playerName: player?.name ?? "Player", deckId: deckId, deckName: deck?.name ?? "",
            commander: CommanderInfo(name: commander.name), partner: hasPartner ? CommanderInfo(name: partner.name) : nil))
        dismiss()
    }
}

/// A commander name with Scryfall autocomplete and an art preview.
struct CommanderField: Equatable {
    var name = ""
}

struct CommanderSearchField: View {
    let label: String
    @Binding var field: CommanderField
    @State private var suggestions: [String] = []
    @State private var searchTask: Task<Void, Never>?
    @State private var editing = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                TextField(label, text: $field.name, onEditingChanged: { editing = $0 })
                    .autocorrectionDisabled()
                    .onChange(of: field.name) { _, v in search(v) }
                if !field.name.isEmpty { CommanderArt(name: field.name, height: 44) }
            }
            if editing && !suggestions.isEmpty {
                ForEach(suggestions.prefix(6), id: \.self) { s in
                    Button(s) { field.name = s; suggestions = [] }.font(.callout).buttonStyle(.plain).foregroundStyle(Color.accentColor)
                }
            }
        }
    }

    private func search(_ q: String) {
        searchTask?.cancel()
        guard q.count >= 2 else { suggestions = []; return }
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))
            guard !Task.isCancelled else { return }
            let list = await CardArtService.shared.autocomplete(q)
            if !Task.isCancelled && list != [q] { suggestions = list.filter { $0 != q } }
        }
    }
}

/// Create a deck for a player (web Decks page). Posts to the web app and
/// adds it to the local cache; colours come from the commander's identity.
struct DeckEditorSheet: View {
    @State var playerId: String
    let onCreated: (CachedDeck) -> Void
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var context
    @Environment(Session.self) private var account
    @Query(sort: \CachedPlayer.name) private var players: [CachedPlayer]
    @State private var name = ""
    @State private var commander = CommanderField()
    @State private var hasPartner = false
    @State private var partner = CommanderField()
    @State private var saving = false
    @State private var error: String?

    var body: some View {
        NavigationStack {
            Form {
                Picker("Owner", selection: $playerId) {
                    ForEach(players) { Text($0.name).tag($0.id) }
                }
                TextField("Deck name", text: $name)
                CommanderSearchField(label: "Commander", field: $commander)
                Toggle("Partner commander?", isOn: $hasPartner)
                if hasPartner { CommanderSearchField(label: "Partner commander", field: $partner) }
                if let error { Text(error).foregroundStyle(.red) }
            }
            .navigationTitle("New deck")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button { save() } label: { if saving { ProgressView() } else { Text("Create").bold() } }
                        .disabled(saving || name.isEmpty || commander.name.isEmpty || playerId.isEmpty)
                }
            }
        }
    }

    private func save() {
        saving = true
        error = nil
        Task {
            defer { saving = false }
            var colors = await CardArtService.shared.colorIdentity(for: commander.name) ?? ""
            if hasPartner, let p = await CardArtService.shared.colorIdentity(for: partner.name) {
                colors = String(Set(colors + p).sorted())
            }
            let body = Operations.CreateDeck.Input.Body.JsonPayload(
                playerId: playerId, name: name, commander: commander.name, partner: hasPartner ? partner.name : nil, colors: colors)
            do {
                let response = try await account.client.createDeck(body: .json(body))
                switch response {
                case .created(let created):
                    let d = try created.body.json
                    let owner = players.first { $0.id == playerId }?.name ?? ""
                    let cached = CachedDeck(id: d.id, playerId: d.playerId, playerName: owner, name: d.name, commander: d.commander, partner: d.partner, colors: d.colors)
                    context.insert(cached)
                    try? context.save()
                    onCreated(cached)
                    dismiss()
                case .badRequest(let bad): error = (try? bad.body.json.error) ?? "Bad request"
                case .forbidden: error = "You can only create decks for your own player."
                case .unauthorized: error = "Sign in again to create a deck."
                case .undocumented(let status, _): error = "Unexpected response \(status)"
                }
            } catch {
                self.error = "Could not reach the web app: \(error.localizedDescription)"
            }
        }
    }
}
