import Foundation

/// One durable game-log entry — `GameLogEvent` on the web and the row shape
/// `game-log.php?action=upload` accepts: a type name, a free-form payload, and
/// an optional ISO-8601 timestamp.
public struct GameLogEvent: Hashable, Sendable, Codable {
    public var type: String
    public var payload: [String: JSONValue]?
    public var ts: String?

    public init(type: String, payload: [String: JSONValue]? = nil, ts: String? = nil) {
        self.type = type
        self.payload = payload
        self.ts = ts
    }
}

/// Event-log derivation — port of apps/core/app/game-manager/gameLog.ts.
///
/// The durable log is derived by diffing successive board states (life, poison,
/// commander damage, turn passes, eliminations, counters, and the turn order the
/// moment a first player is chosen). Die rolls never touch the state and are
/// logged by the UI directly.
public enum GameLog {
    /// The opening event: who is seated, in what order, with which decks.
    public static func gameStartedEvent(_ state: GameState) -> GameLogEvent {
        GameLogEvent(type: "game_started", payload: [
            "gameType": .string((state.gameType ?? .standard).rawValue),
            "startingLife": .int(state.startingLife),
            "players": .array(state.players.enumerated().map { i, p in
                .object([
                    "seat": .int(i),
                    "position": .string(p.position.rawValue),
                    "name": .string(p.playerName),
                    "deck": .string(p.deckName),
                    "commander": .string(p.commander.name),
                    "team": .intOrNull(p.teamNumber),
                ])
            }),
        ])
    }

    /// Names in clockwise play order starting from the first player.
    static func playOrderNames(_ state: GameState, firstIdx: Int) -> [String] {
        let n = state.players.count
        return (0..<n).map { state.players[safe: (firstIdx + $0) % n]?.playerName ?? "" }
    }

    enum KillCause: String { case commanderDamage = "commander_damage", life, poison, unknown }
    struct KillAttribution { var cause: KillCause; var sourceIdx: Int? }

    /// Kill-attribution markers written into notes at elimination time:
    ///   [cmdkill:target:source]      commander damage (source always present)
    ///   [lifekill:target(:source)]   brought to 0 life
    ///   [poisonkill:target(:source)] poison
    /// How a player was eliminated, from the kill tags present in the notes.
    /// Prefers a marker that carries a source index.
    static func parseKillAttribution(_ notes: String, targetIdx: Int) -> KillAttribution {
        // Regex values are not Sendable, so the literal lives here rather than in a static.
        let killTag = /\[(cmdkill|lifekill|poisonkill):(\d+)(?::(\d+))?\]/
        let tags: [KillAttribution] = notes.matches(of: killTag).compactMap { m in
            guard Int(m.2) == targetIdx else { return nil }
            let cause: KillCause = switch m.1 {
            case "cmdkill": .commanderDamage
            case "lifekill": .life
            default: .poison
            }
            return KillAttribution(cause: cause, sourceIdx: m.3.flatMap { Int($0) })
        }
        return tags.first { $0.sourceIdx != nil } ?? tags.first ?? KillAttribution(cause: .unknown, sourceIdx: nil)
    }

    /// Compare two consecutive states and emit the meaningful actions between
    /// them. `reverse` marks a turn change as a step backwards (logged as
    /// `turn_revert` instead of `pass_turn`).
    public static func diff(_ prev: GameState, _ next: GameState, reverse: Bool = false) -> [GameLogEvent] {
        var events: [GameLogEvent] = []
        let P = prev.players
        let N = next.players
        let is2hg = next.isTwoHeadedGiant

        // 2HG resolves turns, shared life/poison, and joint elimination at the
        // team level, so those name the whole team; per-player counters stay individual.
        func teamLabel(_ teamNumber: Int?) -> String { Teams.label(teamNumber, players: N, teamNames: next.teamNames) }
        func teamActor(_ idx: Int) -> String {
            let t = N[safe: idx]?.teamNumber
            return (is2hg && t != nil) ? teamLabel(t) : (N[safe: idx]?.playerName ?? "")
        }

        // Turn order established: a first player was chosen.
        if prev.firstPlayerIdx == nil, let first = next.firstPlayerIdx {
            let seatOrder = (0..<N.count).map { (first + $0) % N.count }
            let order: [String]
            if is2hg {
                var seen: [Int] = []
                for idx in seatOrder {
                    if let t = N[safe: idx]?.teamNumber, !seen.contains(t) { seen.append(t) }
                }
                order = seen.map { teamLabel($0) }
            } else {
                order = playOrderNames(next, firstIdx: first)
            }
            events.append(GameLogEvent(type: "turn_order", payload: [
                "firstPlayer": .string(teamActor(first)),
                "order": .array(order.map { .string($0) }),
            ]))
        }

        // Turn changes (only once the first player is set).
        if next.firstPlayerIdx != nil && prev.currentPlayerIdx != next.currentPlayerIdx {
            events.append(GameLogEvent(type: reverse ? "turn_revert" : "pass_turn", payload: [
                "to": .string(teamActor(next.currentPlayerIdx)),
                "turn": .int(next.turnNumber),
            ]))
        } else if next.firstPlayerIdx != nil && prev.turnNumber != next.turnNumber {
            events.append(GameLogEvent(type: reverse ? "turn_revert" : "turn_change", payload: [
                "turn": .int(next.turnNumber),
            ]))
        }

        // Per-player field changes. In 2HG the shared fields collapse to one
        // team-labelled entry; firstForTeam is true only the first time a team hits each kind.
        enum Kind: Hashable { case life, poison, elim, concede }
        var teamEmitted: [Kind: Set<Int>] = [:]
        func firstForTeam(_ kind: Kind, _ teamNumber: Int?) -> Bool {
            guard is2hg, let t = teamNumber else { return true }
            if teamEmitted[kind, default: []].contains(t) { return false }
            teamEmitted[kind, default: []].insert(t)
            return true
        }
        // Seats freshly eliminated this diff on a given team (a joint elimination
        // flips both teammates but the kill tag sits on only one).
        func newlyEliminatedSeats(_ teamNumber: Int?) -> [Int] {
            N.indices.filter { N[$0].teamNumber == teamNumber && !(P[safe: $0]?.isEliminated ?? false) && N[$0].isEliminated }
        }

        for i in 0..<min(P.count, N.count) {
            let a = P[i]
            let b = N[i]
            let player = b.playerName   // per-player counters
            let actor = teamActor(i)    // shared/team actions
            let team = b.teamNumber
            if a.life != b.life && firstForTeam(.life, team) {
                events.append(GameLogEvent(type: "life_change", payload: [
                    "player": .string(actor), "from": .int(a.life), "to": .int(b.life), "delta": .int(b.life - a.life),
                ]))
            }
            if a.poison != b.poison && firstForTeam(.poison, team) {
                events.append(GameLogEvent(type: "poison_change", payload: [
                    "player": .string(actor), "from": .int(a.poison), "to": .int(b.poison),
                ]))
            }
            if !a.isEliminated && b.isEliminated && firstForTeam(.elim, team) {
                var payload: [String: JSONValue] = ["player": .string(actor), "turn": .int(next.turnNumber)]
                if b.isConceded {
                    payload["cause"] = "concede"
                } else {
                    let seats = (is2hg && team != nil) ? newlyEliminatedSeats(team) : [i]
                    let attrs = seats.map { parseKillAttribution(next.notes, targetIdx: $0) }
                    let attr = attrs.first { $0.sourceIdx != nil }
                        ?? attrs.first { $0.cause != .unknown }
                        ?? KillAttribution(cause: .unknown, sourceIdx: nil)
                    var cause = attr.cause
                    // Life/poison kills flip elimination before the host attributes
                    // a source; infer the cause from the eliminated player's state.
                    if cause == .unknown {
                        if b.poison >= GameReducer.poisonThreshold { cause = .poison }
                        else if b.life <= 0 { cause = .life }
                    }
                    payload["cause"] = .string(cause.rawValue)
                    if let s = attr.sourceIdx { payload["source"] = .string(teamActor(s)) }
                }
                events.append(GameLogEvent(type: "eliminate", payload: payload))
            }
            // A concede that also eliminates is covered by the eliminate event above.
            if !a.isConceded && b.isConceded && a.isEliminated == b.isEliminated && firstForTeam(.concede, team) {
                events.append(GameLogEvent(type: "concede", payload: ["player": .string(actor), "turn": .int(next.turnNumber)]))
            }
            if a.isMonarch != b.isMonarch {
                events.append(GameLogEvent(type: "monarch", payload: ["player": .string(player), "value": .bool(b.isMonarch)]))
            }
            if a.hasInitiative != b.hasInitiative {
                events.append(GameLogEvent(type: "initiative", payload: ["player": .string(player), "value": .bool(b.hasInitiative)]))
            }
            if a.hasCitysBlessing != b.hasCitysBlessing {
                events.append(GameLogEvent(type: "citys_blessing", payload: ["player": .string(player), "value": .bool(b.hasCitysBlessing)]))
            }
            if a.energy != b.energy {
                events.append(GameLogEvent(type: "energy_change", payload: ["player": .string(player), "to": .int(b.energy)]))
            }
            if a.experience != b.experience {
                events.append(GameLogEvent(type: "experience_change", payload: ["player": .string(player), "to": .int(b.experience)]))
            }
            if a.commanderTax != b.commanderTax {
                events.append(GameLogEvent(type: "commander_tax", payload: ["player": .string(player), "to": .int(b.commanderTax)]))
            }
        }

        // Commander damage changes, target then source in ascending seat order
        // (JavaScript orders integer-like object keys ascending).
        for ti in next.commanderDamage.rows.keys.sorted() {
            let nRow = next.commanderDamage[ti] ?? [:]
            let pRow = prev.commanderDamage[ti] ?? [:]
            for si in nRow.keys.sorted() {
                let pTotal = pRow[si]?.total ?? 0
                let nTotal = nRow[si]?.total ?? 0
                if pTotal == nTotal { continue }
                events.append(GameLogEvent(type: "commander_damage", payload: [
                    "source": .string(N[safe: si]?.playerName ?? ""),
                    "target": .string(N[safe: ti]?.playerName ?? ""),
                    "from": .int(pTotal),
                    "to": .int(nTotal),
                ]))
            }
        }

        return events
    }
}
