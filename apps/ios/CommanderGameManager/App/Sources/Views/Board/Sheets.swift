import SwiftUI
import SwiftData
import CommanderGameKit

/// Pick who sits at a seat: a player from the cache, then one of their decks
/// (any deck is allowed; the owner's are listed first).
struct SeatPickerSheet: View {
    @Bindable var session: GameSession
    let idx: Int
    let taken: Set<String>
    @Environment(\.dismiss) private var dismiss
    @Query(sort: \CachedPlayer.name) private var players: [CachedPlayer]
    @Query(sort: \CachedDeck.name) private var decks: [CachedDeck]
    @State private var chosenPlayer: CachedPlayer?
    @State private var showAllDecks = false

    var body: some View {
        NavigationStack {
            List {
                if let p = chosenPlayer {
                    Section("Deck for \(p.name)") {
                        let own = decks.filter { $0.playerId == p.id }
                        ForEach(showAllDecks || own.isEmpty ? decks : own) { d in
                            Button {
                                session.seat(idx, GameSetup.Seat(
                                    playerId: p.id, playerName: p.name, deckId: d.id, deckName: d.name,
                                    commander: CommanderInfo(name: d.commander),
                                    partner: d.partner.map { CommanderInfo(name: $0) }))
                                dismiss()
                            } label: {
                                VStack(alignment: .leading) {
                                    Text(d.name).font(.headline)
                                    Text(d.partner.map { "\(d.commander) / \($0)" } ?? d.commander).font(.subheadline).foregroundStyle(.secondary)
                                    if d.playerId != p.id { Text("owned by \(d.playerName)").font(.caption).foregroundStyle(.tertiary) }
                                }
                            }
                        }
                        if !own.isEmpty && !showAllDecks {
                            Button("Show every deck") { showAllDecks = true }
                        }
                    }
                } else {
                    Section("Player") {
                        ForEach(players) { p in
                            Button { chosenPlayer = p } label: {
                                HStack {
                                    Text(p.name)
                                    if taken.contains(p.id) { Spacer(); Text("seated").font(.caption).foregroundStyle(.secondary) }
                                }
                            }
                            .disabled(taken.contains(p.id) && p.id != session.state.players[idx].playerId)
                        }
                    }
                }
            }
            .navigationTitle(chosenPlayer == nil ? "Who sits here?" : "Which deck?")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                if chosenPlayer != nil {
                    ToolbarItem(placement: .navigation) { Button("Back") { chosenPlayer = nil } }
                }
            }
        }
    }
}

/// Commander damage taken by one seat, per opposing commander (and partner).
struct CommanderDamageSheet: View {
    @Bindable var session: GameSession
    let targetIdx: Int
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                ForEach(session.state.players.indices.filter { $0 != targetIdx }, id: \.self) { s in
                    let source = session.state.players[s]
                    let dmg = session.state.commanderDamage[targetIdx, s]
                    Section(source.playerName) {
                        row(label: source.commander.name, value: dmg.fromCommander, lethal: dmg.fromCommander >= 21) { d in
                            session.dispatch(.commanderDamageChange(targetIdx: targetIdx, sourceIdx: s, isPartner: false, delta: d))
                        }
                        if let partner = source.partner {
                            row(label: partner.name, value: dmg.fromPartner, lethal: dmg.fromPartner >= 21) { d in
                                session.dispatch(.commanderDamageChange(targetIdx: targetIdx, sourceIdx: s, isPartner: true, delta: d))
                            }
                        }
                    }
                }
            }
            .navigationTitle("Commander damage to \(session.state.players[targetIdx].playerName)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
    }

    private func row(label: String, value: Int, lethal: Bool, change: @escaping (Int) -> Void) -> some View {
        HStack {
            Text(label)
            Spacer()
            RepeatButton(symbol: "minus", size: 34) { change(-1) }
            Text("\(value)").font(.title2.monospacedDigit().bold()).frame(width: 44)
                .foregroundStyle(lethal ? .red : .primary)
            RepeatButton(symbol: "plus", size: 34) { change(1) }
        }
    }
}

/// Energy, experience and commander tax for one seat.
struct CountersSheet: View {
    @Bindable var session: GameSession
    let idx: Int
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        let p = session.state.players[idx]
        NavigationStack {
            List {
                counter("Commander tax", p.commanderTax) { session.dispatch(.commanderTaxChange(playerIdx: idx, delta: $0, isPartner: false)) }
                if p.partner != nil {
                    counter("Partner tax", p.partnerCommanderTax) { session.dispatch(.commanderTaxChange(playerIdx: idx, delta: $0, isPartner: true)) }
                }
                counter("Energy", p.energy) { session.dispatch(.energyChange(playerIdx: idx, delta: $0)) }
                counter("Experience", p.experience) { session.dispatch(.experienceChange(playerIdx: idx, delta: $0)) }
            }
            .navigationTitle("\(p.playerName): counters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
    }

    private func counter(_ label: String, _ value: Int, change: @escaping (Int) -> Void) -> some View {
        HStack {
            Text(label)
            Spacer()
            RepeatButton(symbol: "minus", size: 34) { change(-1) }
            Text("\(value)").font(.title2.monospacedDigit().bold()).frame(width: 44)
            RepeatButton(symbol: "plus", size: 34) { change(1) }
        }
    }
}

/// "Who dealt the final blow?" after a life or poison kill.
struct KillAttributionSheet: View {
    @Bindable var session: GameSession
    let pending: GameSession.PendingKill

    var body: some View {
        let target = session.state.players[pending.targetIdx]
        NavigationStack {
            List {
                Section {
                    ForEach(session.state.players.indices.filter { $0 != pending.targetIdx && session.state.players[$0].teamNumber.map { $0 != target.teamNumber } ?? true }, id: \.self) { s in
                        Button(session.state.players[s].playerName) { session.attributeKill(pending, sourceIdx: s) }
                    }
                    Button("Nobody / unknown") { session.attributeKill(pending, sourceIdx: nil) }
                } header: {
                    Text(pending.cause == .life ? "Who brought \(target.playerName) to 0 life?" : "Whose poison finished \(target.playerName)?")
                }
            }
            .navigationTitle("Elimination")
            .navigationBarTitleDisplayMode(.inline)
        }
        .interactiveDismissDisabled()
    }
}

/// The derived game log, newest last.
struct GameLogSheet: View {
    let log: [GameLogEvent]
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(Array(log.enumerated()), id: \.offset) { _, e in
                VStack(alignment: .leading, spacing: 2) {
                    Text(describe(e)).font(.body)
                    Text(e.type).font(.caption2).foregroundStyle(.tertiary)
                }
            }
            .navigationTitle("Game log")
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
    }

    private func str(_ v: JSONValue?) -> String {
        switch v {
        case .string(let s): s
        case .int(let i): String(i)
        case .double(let d): String(d)
        case .bool(let b): b ? "on" : "off"
        case .array(let a): a.map { str($0) }.joined(separator: ", ")
        default: ""
        }
    }

    private func describe(_ e: GameLogEvent) -> String {
        let p = e.payload ?? [:]
        switch e.type {
        case "game_started": return "Game started (\(str(p["gameType"])), \(str(p["startingLife"])) life)"
        case "turn_order": return "\(str(p["firstPlayer"])) goes first. Order: \(str(p["order"]))"
        case "pass_turn": return "Turn \(str(p["turn"])): \(str(p["to"]))"
        case "turn_revert": return "Turn stepped back to \(str(p["turn"])): \(str(p["to"]))"
        case "turn_change": return "Turn \(str(p["turn"]))"
        case "life_change": return "\(str(p["player"])) life \(str(p["from"])) → \(str(p["to"]))"
        case "poison_change": return "\(str(p["player"])) poison \(str(p["from"])) → \(str(p["to"]))"
        case "commander_damage": return "\(str(p["source"])) dealt commander damage to \(str(p["target"])): \(str(p["from"])) → \(str(p["to"]))"
        case "eliminate":
            let by = p["source"].map { " by " + str($0) } ?? ""
            return "\(str(p["player"])) eliminated (\(str(p["cause"]))\(by)), turn \(str(p["turn"]))"
        case "concede": return "\(str(p["player"])) conceded"
        case "monarch": return "\(str(p["player"])) monarch \(str(p["value"]))"
        case "initiative": return "\(str(p["player"])) initiative \(str(p["value"]))"
        case "citys_blessing": return "\(str(p["player"])) City's Blessing \(str(p["value"]))"
        case "energy_change": return "\(str(p["player"])) energy → \(str(p["to"]))"
        case "experience_change": return "\(str(p["player"])) experience → \(str(p["to"]))"
        case "commander_tax": return "\(str(p["player"])) commander tax → \(str(p["to"]))"
        case "first_player_roll": return str(p["note"])
        case "dice_roll": return "\(str(p["label"])): \(str(p["rolls"])) = \(str(p["total"]))"
        case "game_ended": return "Game ended on turn \(str(p["turn"]))"
        default: return e.type
        }
    }
}
