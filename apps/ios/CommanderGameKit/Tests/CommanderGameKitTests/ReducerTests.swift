import XCTest
@testable import CommanderGameKit

/// Behaviour the fixtures cannot express: anything involving the clock, and
/// the unknown-event contract when decoding a log from a newer client.
final class ReducerTests: XCTestCase {
    private func four() -> GameState {
        GameState(players: [
            PlayerState(playerId: "a", deckId: "d", playerName: "Alice", deckName: "A", commander: CommanderInfo(name: "Atraxa"), position: .bottom),
            PlayerState(playerId: "b", deckId: "d", playerName: "Bob", deckName: "B", commander: CommanderInfo(name: "Breya"), position: .left),
            PlayerState(playerId: "c", deckId: "d", playerName: "Carol", deckName: "C", commander: CommanderInfo(name: "Chulane"), position: .top),
            PlayerState(playerId: "d", deckId: "d", playerName: "Dave", deckName: "D", commander: CommanderInfo(name: "Derevi"), position: .right),
        ], firstPlayerIdx: 0)
    }

    func testPassTurnStampsTheClock() {
        let next = GameReducer.applyPassTurn(four(), now: 1_700_000_000_000)
        XCTAssertEqual(next.turnStartTime, 1_700_000_000_000)
        XCTAssertEqual(next.currentPlayerIdx, 1)
    }

    func testDefaultClockIsRecentMilliseconds() {
        let before = Date().timeIntervalSince1970 * 1000
        let next = GameReducer.applyPassTurn(four())
        XCTAssertGreaterThanOrEqual(next.turnStartTime, before.rounded(.down))
        XCTAssertLessThan(next.turnStartTime - before, 5_000)
    }

    func testUnknownEventDecodesAndIsIgnored() throws {
        let json = #"{"type":"view_open","seat":"top","ts":5,"playerIdx":2}"#.data(using: .utf8)!
        let event = try JSONDecoder().decode(LiveGameEvent.self, from: json)
        XCTAssertEqual(event.kind, .unknown(type: "view_open"))
        XCTAssertEqual(event.typeName, "view_open")
        let state = four()
        XCTAssertEqual(GameReducer.applyEvent(state, event), state)
    }

    func testEmptyDamageMapHasZeroRowsForEveryOtherSeat() {
        let map = CommanderDamageMap.empty(seatCount: 3)
        XCTAssertEqual(map.rows.count, 3)
        XCTAssertEqual(map[1]?.keys.sorted(), [0, 2])
        XCTAssertEqual(map[1, 2], .zero)
    }
}
