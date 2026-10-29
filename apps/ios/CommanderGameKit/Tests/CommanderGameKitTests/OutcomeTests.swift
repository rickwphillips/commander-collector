import XCTest
@testable import CommanderGameKit

final class OutcomeTests: XCTestCase {
    private func seat(_ name: String, _ pos: SeatPosition, team: Int? = nil) -> GameSetup.Seat {
        GameSetup.Seat(playerId: "p-\(name)", playerName: name, deckId: "d-\(name)", deckName: "\(name)'s deck", commander: CommanderInfo(name: "\(name) Cmdr"))
    }

    private func fourPlayerGame() -> GameState {
        var s = GameSetup.seatingState(playerCount: 4, startingLife: 40, turnTimerSeconds: 300, gameType: .standard)
        for (i, n) in ["Alice", "Bob", "Carol", "Dave"].enumerated() { s = GameSetup.seating(s, idx: i, seat: seat(n, s.players[i].position)) }
        s = GameSetup.chooseFirstPlayer(s, idx: 0)
        return GameSetup.start(s, now: 1000)
    }

    func testSeatingStateMatchesWebShape() {
        let s = GameSetup.seatingState(playerCount: 3, startingLife: 40, turnTimerSeconds: 0, gameType: .standard)
        XCTAssertEqual(s.players.map(\.position), [.bottom, .left, .top])
        XCTAssertEqual(s.phase, .seating)
        XCTAssertEqual(s.commanderDamage[1]?.keys.sorted(), [0, 2])
        XCTAssertFalse(GameSetup.isSeatFilled(s.players[0]))
        let t = GameSetup.seatingState(playerCount: 2, startingLife: 30, turnTimerSeconds: 0, gameType: .twoHeadedGiant)
        XCTAssertEqual(t.players.map(\.teamNumber), [1, 1, 2, 2])
    }

    func testWinnerAndResultsForStandardGame() {
        var s = fourPlayerGame()
        XCTAssertNil(GameOutcome.winnerIdx(s))
        s = GameReducer.applyEvent(s, LiveGameEvent(seat: "bottom", ts: 1, kind: .eliminate(playerIdx: 1)), now: 0)   // Bob turn 1
        s.turnNumber = 4
        s = GameReducer.applyEvent(s, LiveGameEvent(seat: "bottom", ts: 2, kind: .lifeChange(playerIdx: 3, delta: -40)), now: 0) // Dave turn 4
        s.turnNumber = 7
        s = GameReducer.applyEvent(s, LiveGameEvent(seat: "bottom", ts: 3, kind: .poisonChange(playerIdx: 2, delta: 10)), now: 0) // Carol turn 7
        XCTAssertEqual(GameOutcome.winnerIdx(s), 0)
        let r = GameOutcome.results(s)
        XCTAssertEqual(r.map(\.playerId), ["p-Alice", "p-Carol", "p-Dave", "p-Bob"])
        XCTAssertEqual(r.map(\.finishPosition), [1, 2, 3, 4])
        XCTAssertEqual(r.map(\.eliminatedTurn), [nil, 7, 4, 1])
    }

    func testResultsForTwoHeadedGiant() {
        var s = GameSetup.seatingState(playerCount: 4, startingLife: 30, turnTimerSeconds: 0, gameType: .twoHeadedGiant)
        for (i, n) in ["Alice", "Bob", "Carol", "Dave"].enumerated() { s = GameSetup.seating(s, idx: i, seat: seat(n, s.players[i].position)) }
        s = GameSetup.start(GameSetup.chooseFirstPlayer(s, idx: 2), now: 0)
        s.turnNumber = 5
        s = GameReducer.applyEvent(s, LiveGameEvent(seat: "bottom", ts: 1, kind: .lifeChange(playerIdx: 0, delta: -30)), now: 0)
        XCTAssertEqual(GameOutcome.winnerIdx(s), 2)
        let r = GameOutcome.results(s)
        XCTAssertEqual(r.map(\.finishPosition), [2, 2, 1, 1])
        XCTAssertEqual(r.map(\.teamNumber), [1, 1, 2, 2])
        XCTAssertEqual(r.map(\.eliminatedTurn), [5, 5, nil, nil])
    }

    func testCleanNotesStripsKillTags() {
        XCTAssertEqual(GameOutcome.cleanNotes("[cmdkill:2:0] Amy eliminated (turn 6)\nreal note"), "Amy eliminated (turn 6)\nreal note")
        XCTAssertNil(GameOutcome.cleanNotes("[poisonkill:0] "))
        XCTAssertEqual(GameOutcome.cleanNotes("[lifekill:1:3] kept"), "[lifekill:1:3] kept")
    }

    func testRollOffPicksHighestAndRerollsTies() {
        struct Fixed: RandomNumberGenerator {
            var values: [UInt64]
            mutating func next() -> UInt64 { values.isEmpty ? 0 : values.removeFirst() }
        }
        let s = fourPlayerGame()
        var rng = SystemRandomNumberGenerator()
        for _ in 0..<20 {
            let r = GameOutcome.rollForFirstPlayer(s, using: &rng)
            XCTAssertTrue((0..<4).contains(r.winnerIdx))
            XCTAssertTrue(r.detail.hasSuffix("goes first."))
            let t = GameOutcome.rollForFirstTeam(s, using: &rng)
            XCTAssertTrue((0..<4).contains(t.winnerIdx))
        }
        var fixed = Fixed(values: [])
        let r = GameOutcome.rollForFirstPlayer(s, using: &fixed)
        XCTAssertEqual(r.winnerIdx, 0, "all-ties fall back to the first contender")
    }
}
