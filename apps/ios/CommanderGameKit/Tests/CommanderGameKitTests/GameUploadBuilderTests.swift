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
}
