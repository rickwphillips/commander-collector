import XCTest
import Foundation
import OpenAPIRuntime
@testable import CommanderAPI
@testable import CommanderGameKit

final class GameUploadBuilderTests: XCTestCase {
    private func finishedGame() -> (GameState, [GameLogEvent]) {
        var s = GameSetup.seatingState(playerCount: 3, startingLife: 40, turnTimerSeconds: 0, gameType: .standard)
        for (i, n) in ["Alice", "Bob", "Carol"].enumerated() {
            s = GameSetup.seating(s, idx: i, seat: GameSetup.Seat(playerId: "p-\(n)", playerName: n, deckId: "d-\(n)", deckName: "\(n) deck", commander: CommanderInfo(name: "\(n) Cmdr")))
        }
        s = GameSetup.start(GameSetup.chooseFirstPlayer(s, idx: 1), now: 0)
        var log = [GameLog.gameStartedEvent(s)]
        for e in [LiveGameEvent(seat: "host", ts: 1, kind: .lifeChange(playerIdx: 0, delta: -40)),
                  LiveGameEvent(seat: "host", ts: 2, kind: .passTurn),
                  LiveGameEvent(seat: "host", ts: 3, kind: .eliminate(playerIdx: 2))] {
            let next = GameReducer.applyEvent(s, e, now: 0)
            log += GameLog.diff(s, next)
            s = next
        }
        s.notes += "\nreal note"
        return (s, log)
    }

    func testBodyMatchesWebPayloadShape() throws {
        let (state, log) = finishedGame()
        let body = try GameUploadBuilder.createGameInput(clientGameId: "11111111-2222-4333-8444-555555555555", playedAt: Date(timeIntervalSince1970: 1_761_700_000), state: state, log: log)
        XCTAssertEqual(body.clientGameId, "11111111-2222-4333-8444-555555555555")
        XCTAssertEqual(body.gameType?.rawValue, "standard")
        XCTAssertEqual(body.results.map(\.finishPosition), [1, 2, 3])
        // Alice and Carol both fell on turn 1, so their order is stable (seat order).
        XCTAssertEqual(body.results.map(\.playerId), ["p-Bob", "p-Alice", "p-Carol"])
        // Only the machine-readable kill tags are stripped; the concede line is a real note.
        XCTAssertEqual(body.notes, "Carol conceded (turn 1)\nreal note")
        XCTAssertEqual(body.events?.count, log.count)
        XCTAssertEqual(body.events?.first?._type, "game_started")

        // The wire JSON uses the PHP field names and carries the payload verbatim.
        let json = try JSONSerialization.jsonObject(with: JSONEncoder().encode(body)) as! [String: Any]
        XCTAssertEqual(json["client_game_id"] as? String, body.clientGameId)
        XCTAssertEqual(json["played_at"] as? String, GameUploadBuilder.playedAtString(Date(timeIntervalSince1970: 1_761_700_000)))
        let results = json["results"] as! [[String: Any]]
        XCTAssertEqual(results[0]["finish_position"] as? Int, 1)
        XCTAssertTrue(results[0]["eliminated_turn"] is NSNull || results[0]["eliminated_turn"] == nil)
        let events = json["events"] as! [[String: Any]]
        let started = events[0]["payload"] as! [String: Any]
        XCTAssertEqual(started["startingLife"] as? Int, 40)
        XCTAssertEqual((started["players"] as? [[String: Any]])?.count, 3)
    }

    /// 1v1 2HG plays as 2HG (four seats, two heads per team) and is saved as
    /// its own game type with one player on both rows of a team.
    func testOneVsOneTwoHeadedGiantUpload() throws {
        var s = GameSetup.seatingState(playerCount: 4, startingLife: 30, turnTimerSeconds: 0, gameType: .twoHeadedGiant, onePilotPerTeam: true)
        XCTAssertEqual(s.players.map(\.teamNumber), [1, 1, 2, 2])
        for (i, (player, deck)) in [("Alice", "A1"), ("Alice", "A2"), ("Bob", "B1"), ("Bob", "B2")].enumerated() {
            s = GameSetup.seating(s, idx: i, seat: GameSetup.Seat(playerId: "p-\(player)", playerName: player, deckId: "d-\(deck)", deckName: deck, commander: CommanderInfo(name: "\(deck) Cmdr")))
        }
        // The start-of-game roll is one die per player, not one per head.
        XCTAssertEqual(GameOutcome.rollOffSeats(s), [0, 2])
        s = GameSetup.start(GameSetup.chooseFirstPlayer(s, idx: 0), now: 0)
        // Unchanged 2HG rules: poison is shared and a team falls at 15, not 10.
        s = GameReducer.applyEvent(s, LiveGameEvent(seat: "host", ts: 1, kind: .poisonChange(playerIdx: 0, delta: 10)), now: 0)
        XCTAssertNil(GameOutcome.winnerIdx(s))
        s = GameReducer.applyEvent(s, LiveGameEvent(seat: "host", ts: 2, kind: .poisonChange(playerIdx: 1, delta: 5)), now: 0)
        XCTAssertEqual(GameOutcome.winnerIdx(s).map { s.players[$0].teamNumber }, 2)
        XCTAssertEqual(Teams.label(1, players: s.players, teamNames: nil), "Team 1 (Alice)")

        let body = try GameUploadBuilder.createGameInput(clientGameId: "11111111-2222-4333-8444-555555555555", playedAt: Date(timeIntervalSince1970: 0), state: s, log: [])
        XCTAssertEqual(body.gameType?.rawValue, "1v1-2hg")
        XCTAssertEqual(body.results.map(\.playerId), ["p-Alice", "p-Alice", "p-Bob", "p-Bob"])
        XCTAssertEqual(body.results.map(\.deckId), ["d-A1", "d-A2", "d-B1", "d-B2"])
        XCTAssertEqual(body.results.map(\.finishPosition), [2, 2, 1, 1])
        XCTAssertEqual(body.results.map(\.teamNumber), [1, 1, 2, 2])

        // A plain 2HG game is still saved as 2hg, and the flag survives a save/resume.
        XCTAssertEqual(try JSONDecoder().decode(GameState.self, from: JSONEncoder().encode(s)).onePilotPerTeam, true)
        let plain = GameSetup.seatingState(playerCount: 4, startingLife: 30, turnTimerSeconds: 0, gameType: .twoHeadedGiant)
        XCTAssertNil(plain.onePilotPerTeam)
        XCTAssertNil(String(data: try JSONEncoder().encode(plain), encoding: .utf8)!.range(of: "onePilotPerTeam"))
    }
}
