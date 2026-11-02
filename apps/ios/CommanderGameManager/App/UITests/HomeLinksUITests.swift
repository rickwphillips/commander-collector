import XCTest

/// The New game screen offers hand-offs to the web app's Games and Decks pages.
final class HomeLinksUITests: XCTestCase {
    func testWebLinksArePresent() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-demo"]
        app.launch()

        let games = app.descendants(matching: .any)["webGames"].firstMatch
        let decks = app.descendants(matching: .any)["webDecks"].firstMatch
        var swipes = 0
        while !games.exists && swipes < 6 { app.swipeUp(); swipes += 1 }
        XCTAssertTrue(games.waitForExistence(timeout: 5), "Games link not found on the New game screen")
        XCTAssertTrue(decks.exists, "Decks link not found on the New game screen")

        let shot = XCTAttachment(screenshot: app.screenshot())
        shot.name = "home-web-links"; shot.lifetime = .keepAlways
        add(shot)
    }
}
