/// 2HG team labelling — port of apps/core/app/lib/teams.ts. One source of truth
/// for how a team is named so the native log matches the web's word for word.
public enum Teams {
    /// The editable custom name when set (non-blank), otherwise "Team N".
    public static func name(_ teamNumber: Int?, teamNames: [Int: String]?) -> String {
        if let t = teamNumber, let custom = teamNames?[t]?.trimmingCharacters(in: .whitespacesAndNewlines), !custom.isEmpty {
            return custom
        }
        return "Team \(teamNumber.map(String.init) ?? "null")"
    }

    /// The opposing team's number in a two-team game.
    public static func other(_ teamNumber: Int) -> Int { teamNumber == 1 ? 2 : 1 }

    /// "Name (A / B)".
    public static func label(_ teamNumber: Int?, players: [PlayerState], teamNames: [Int: String]?) -> String {
        let members = players.filter { $0.teamNumber == teamNumber }.map(\.playerName)
        return "\(name(teamNumber, teamNames: teamNames)) (\(members.joined(separator: " / ")))"
    }
}

import Foundation
