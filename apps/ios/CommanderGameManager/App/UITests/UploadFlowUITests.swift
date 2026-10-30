import XCTest

/// End-to-end on a real device: launch into a seeded, started game built from
/// the cached players and decks, end it, save it, and watch the outbox report
/// Uploaded. Uses whatever account is signed in on the device, so the game lands
/// in that account's history; delete it afterwards if it was a test.
final class UploadFlowUITests: XCTestCase {
    func testEndGameSaveAndUpload() throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["REAL_DEVICE"] == "1", "needs a signed-in iPad; set REAL_DEVICE=1")
        let app = XCUIApplication()
        app.launchArguments = ["-demoBoard"]
        app.launch()

        let settings = app.descendants(matching: .any)["openSettings"].firstMatch
        XCTAssertTrue(settings.waitForExistence(timeout: 20), "board did not show the settings button")
        settings.tap()
        let end = app.descendants(matching: .any)["endGame"].firstMatch
        XCTAssertTrue(end.waitForExistence(timeout: 5), "settings did not show End Game")
        end.tap()
        let confirm = app.buttons["End game"]
        XCTAssertTrue(confirm.waitForExistence(timeout: 5), "end confirmation did not appear")
        confirm.tap()

        let save = app.buttons["saveGame"]
        XCTAssertTrue(save.waitForExistence(timeout: 10), "end summary did not show Save")
        save.tap()

        let uploaded = app.descendants(matching: .any)["outbox-uploaded"]
        let failed = app.descendants(matching: .any)["outbox-failed"]
        let rejected = app.descendants(matching: .any)["outbox-rejected"]
        let deadline = Date().addingTimeInterval(60)
        while Date() < deadline {
            if uploaded.exists { return }
            if failed.exists || rejected.exists {
                let error = app.staticTexts.matching(identifier: "outbox-error").firstMatch
                XCTFail("upload failed: \(error.exists ? error.label : "(no error text)")")
                return
            }
            RunLoop.current.run(until: Date().addingTimeInterval(1))
        }
        XCTFail("no Uploaded row within 60s")
    }
}
