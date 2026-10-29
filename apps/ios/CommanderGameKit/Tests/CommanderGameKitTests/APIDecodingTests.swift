import XCTest
import Foundation
import OpenAPIRuntime
@testable import CommanderAPI

/// Real responses from the PHP API (captured from the local stack, names
/// anonymised) must decode through the generated client. This is the guard
/// against the drift that broke the iPad's first refresh on 2026-10-29: MySQL
/// returning win_rate and card_count as strings while the contract said number.
final class APIDecodingTests: XCTestCase {
    private func data(_ file: String) throws -> Data {
        let url = try XCTUnwrap(Bundle.module.url(forResource: file, withExtension: "json", subdirectory: "Fixtures"))
        return try Data(contentsOf: url)
    }

    func testPlayersListDecodes() throws {
        let players = try JSONDecoder().decode([Components.Schemas.PlayerWithStats].self, from: data("api-players"))
        XCTAssertGreaterThan(players.count, 0)
        XCTAssertFalse(players[0].value1.name.isEmpty)
        XCTAssertNotNil(players[0].value2.totalGames)
    }

    func testDecksListDecodes() throws {
        let decks = try JSONDecoder().decode([Components.Schemas.DeckWithPlayer].self, from: data("api-decks"))
        XCTAssertGreaterThan(decks.count, 0)
        XCTAssertFalse(decks[0].value1.commander.isEmpty)
        XCTAssertNotNil(decks[0].value2.cardCount)
        XCTAssertEqual(decks[0].value2.playerName, "Player X")
    }

    func testStringNumbersAreRejected() throws {
        // The pre-5.25.2 shape. If this ever decodes, the generated types have
        // become lenient and the PHP cast could regress unnoticed.
        var json = try JSONSerialization.jsonObject(with: data("api-decks")) as! [[String: Any]]
        json[0]["card_count"] = "100"
        let bad = try JSONSerialization.data(withJSONObject: json)
        XCTAssertThrowsError(try JSONDecoder().decode([Components.Schemas.DeckWithPlayer].self, from: bad))
    }
}
