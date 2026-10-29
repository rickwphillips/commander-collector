import Foundation

/// An action taken at the table. Port of `LiveGameEvent` (apps/core/app/lib/types.ts):
/// a `type` discriminator plus the fields that action needs, stamped with the
/// seat that sent it and a client timestamp in milliseconds. The web's
/// view_open / view_heartbeat / view_close events are server-seat bookkeeping
/// and are decoded as `.unknown`, which the reducer ignores.
public struct LiveGameEvent: Hashable, Sendable, Codable {
    public enum Kind: Hashable, Sendable {
        case lifeChange(playerIdx: Int, delta: Int)
        case poisonChange(playerIdx: Int, delta: Int)
        case commanderTaxChange(playerIdx: Int, delta: Int, isPartner: Bool)
        case energyChange(playerIdx: Int, delta: Int)
        case experienceChange(playerIdx: Int, delta: Int)
        case toggleMonarch(playerIdx: Int)
        case toggleInitiative(playerIdx: Int)
        case toggleCitysBlessing(playerIdx: Int)
        case commanderDamageChange(targetIdx: Int, sourceIdx: Int, isPartner: Bool, delta: Int)
        case eliminate(playerIdx: Int)
        case undoEliminate(playerIdx: Int)
        case passTurn
        case prevTurn
        case setTeamName(team: Int, name: String)
        case checkin
        case lifeKillAttr(playerIdx: Int, sourcePlayerIdx: Int?)
        case poisonKillAttr(playerIdx: Int, sourcePlayerIdx: Int?)
        /// A type this build does not know. Kept so a log written by a newer
        /// client still decodes; the reducer leaves state unchanged.
        case unknown(type: String)
    }

    public var seat: String
    public var ts: Double
    public var kind: Kind

    public init(seat: String, ts: Double, kind: Kind) {
        self.seat = seat
        self.ts = ts
        self.kind = kind
    }

    private enum CodingKeys: String, CodingKey {
        case type, seat, ts, playerIdx, delta, isPartner, targetIdx, sourceIdx, team, name, sourcePlayerIdx
    }

    public var typeName: String {
        switch kind {
        case .lifeChange: "life_change"
        case .poisonChange: "poison_change"
        case .commanderTaxChange: "commander_tax_change"
        case .energyChange: "energy_change"
        case .experienceChange: "experience_change"
        case .toggleMonarch: "toggle_monarch"
        case .toggleInitiative: "toggle_initiative"
        case .toggleCitysBlessing: "toggle_citys_blessing"
        case .commanderDamageChange: "commander_damage_change"
        case .eliminate: "eliminate"
        case .undoEliminate: "undo_eliminate"
        case .passTurn: "pass_turn"
        case .prevTurn: "prev_turn"
        case .setTeamName: "set_team_name"
        case .checkin: "checkin"
        case .lifeKillAttr: "life_kill_attr"
        case .poisonKillAttr: "poison_kill_attr"
        case .unknown(let type): type
        }
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        seat = try c.decode(String.self, forKey: .seat)
        ts = try c.decode(Double.self, forKey: .ts)
        let type = try c.decode(String.self, forKey: .type)
        func idx() throws -> Int { try c.decode(Int.self, forKey: .playerIdx) }
        func delta() throws -> Int { try c.decode(Int.self, forKey: .delta) }
        func sourcePlayer() throws -> Int? { try c.decodeIfPresent(Int.self, forKey: .sourcePlayerIdx) }
        switch type {
        case "life_change": kind = .lifeChange(playerIdx: try idx(), delta: try delta())
        case "poison_change": kind = .poisonChange(playerIdx: try idx(), delta: try delta())
        case "commander_tax_change":
            kind = .commanderTaxChange(playerIdx: try idx(), delta: try delta(),
                                       isPartner: try c.decodeIfPresent(Bool.self, forKey: .isPartner) ?? false)
        case "energy_change": kind = .energyChange(playerIdx: try idx(), delta: try delta())
        case "experience_change": kind = .experienceChange(playerIdx: try idx(), delta: try delta())
        case "toggle_monarch": kind = .toggleMonarch(playerIdx: try idx())
        case "toggle_initiative": kind = .toggleInitiative(playerIdx: try idx())
        case "toggle_citys_blessing": kind = .toggleCitysBlessing(playerIdx: try idx())
        case "commander_damage_change":
            kind = .commanderDamageChange(
                targetIdx: try c.decode(Int.self, forKey: .targetIdx),
                sourceIdx: try c.decode(Int.self, forKey: .sourceIdx),
                isPartner: try c.decodeIfPresent(Bool.self, forKey: .isPartner) ?? false,
                delta: try delta())
        case "eliminate": kind = .eliminate(playerIdx: try idx())
        case "undo_eliminate": kind = .undoEliminate(playerIdx: try idx())
        case "pass_turn": kind = .passTurn
        case "prev_turn": kind = .prevTurn
        case "set_team_name":
            kind = .setTeamName(team: try c.decode(Int.self, forKey: .team), name: try c.decode(String.self, forKey: .name))
        case "checkin": kind = .checkin
        case "life_kill_attr": kind = .lifeKillAttr(playerIdx: try idx(), sourcePlayerIdx: try sourcePlayer())
        case "poison_kill_attr": kind = .poisonKillAttr(playerIdx: try idx(), sourcePlayerIdx: try sourcePlayer())
        default: kind = .unknown(type: type)
        }
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(typeName, forKey: .type)
        try c.encode(seat, forKey: .seat)
        try c.encode(ts, forKey: .ts)
        switch kind {
        case .lifeChange(let i, let d), .poisonChange(let i, let d), .energyChange(let i, let d), .experienceChange(let i, let d):
            try c.encode(i, forKey: .playerIdx); try c.encode(d, forKey: .delta)
        case .commanderTaxChange(let i, let d, let p):
            try c.encode(i, forKey: .playerIdx); try c.encode(d, forKey: .delta); try c.encode(p, forKey: .isPartner)
        case .toggleMonarch(let i), .toggleInitiative(let i), .toggleCitysBlessing(let i), .eliminate(let i), .undoEliminate(let i):
            try c.encode(i, forKey: .playerIdx)
        case .commanderDamageChange(let t, let s, let p, let d):
            try c.encode(t, forKey: .targetIdx); try c.encode(s, forKey: .sourceIdx)
            try c.encode(p, forKey: .isPartner); try c.encode(d, forKey: .delta)
        case .setTeamName(let team, let name):
            try c.encode(team, forKey: .team); try c.encode(name, forKey: .name)
        case .lifeKillAttr(let i, let s), .poisonKillAttr(let i, let s):
            try c.encode(i, forKey: .playerIdx); try c.encode(s, forKey: .sourcePlayerIdx)
        case .passTurn, .prevTurn, .checkin, .unknown:
            break
        }
    }
}
