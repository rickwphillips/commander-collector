import XCTest

/// Drives the real app on a simulator through the whole table flow: setup
/// with Random fill, seating with the in-seat picker, roll for first, the
/// seat panel controls (life, counters, commander damage, focus modal, state
/// menu, concede), the centre zone (turns, dice, settings, log), ending a
/// game, and the Two-Headed Giant board. Uses `-demo` launches (in-memory
/// demo players, no sign-in), so nothing reaches the server.
final class BoardFlowUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUp() {
        continueAfterFailure = false
        // The table is laid out for landscape; keep the device there so the
        // screen and the app's geometry agree for synthesized touches.
        XCUIDevice.shared.orientation = .landscapeRight
    }

    private func launch(_ args: [String]) {
        app = XCUIApplication()
        app.launchArguments = args
        app.launch()
    }

    private func el(_ id: String) -> XCUIElement { app.descendants(matching: .any)[id].firstMatch }

    private func waitFor(_ id: String, timeout: TimeInterval = 15, file: StaticString = #filePath, line: UInt = #line) -> XCUIElement {
        let e = el(id)
        XCTAssertTrue(e.waitForExistence(timeout: timeout), "\(id) did not appear", file: file, line: line)
        return e
    }

    /// Waits until `predicate` (over the element) holds.
    private func expect(_ e: XCUIElement, _ predicate: String, timeout: TimeInterval) -> Bool {
        XCTWaiter().wait(for: [XCTNSPredicateExpectation(predicate: NSPredicate(format: predicate), object: e)], timeout: timeout) == .completed
    }

    /// A real finger hold: raw touches at the element's centre (element.press can
    /// be routed through accessibility activation and arrive as a tap).
    private func hold(_ e: XCUIElement, seconds: Double = 1.0) {
        e.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).press(forDuration: seconds)
    }

    /// Flips a switch: a tap on the row's label does nothing on iPad, so aim at the knob.
    private func flip(_ sw: XCUIElement) {
        let before = sw.value as? String
        sw.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap()
        if (sw.value as? String) == before { sw.tap() }
    }

    private func text(containing s: String) -> XCUIElement {
        app.staticTexts.matching(NSPredicate(format: "label CONTAINS[c] %@", s)).firstMatch
    }

    /// The Random switch on the setup screen; the row's switch is what toggles.
    private func turnOnRandom() {
        let sw = app.switches["randomToggle"].firstMatch
        XCTAssertTrue(sw.waitForExistence(timeout: 15), "Random toggle missing")
        if (sw.value as? String) != "1" { sw.tap() }
        if (sw.value as? String) != "1" { sw.coordinate(withNormalizedOffset: CGVector(dx: 0.97, dy: 0.5)).tap() }
        XCTAssertEqual(sw.value as? String, "1", "Random did not switch on")
    }

    /// The seat panel's counters report their value through the `-value` text.
    private func value(_ id: String) -> String { el("\(id)-value").label }

    // MARK: Setup → seating → roll → play

    func testRandomFillSeatingRollAndStart() {
        launch(["-demo"])
        turnOnRandom()
        waitFor("continueToSeating").tap()

        // Random fill seated every demo player; the Start button is still gated on a first player.
        let start = waitFor("startGame")
        XCTAssertTrue(text(containing: "Rick").waitForExistence(timeout: 10))
        XCTAssertTrue(text(containing: "Sam").exists)
        XCTAssertTrue(text(containing: "Amy").exists)
        XCTAssertTrue(text(containing: "Jo").exists)
        XCTAssertFalse(start.isEnabled)

        // The seat picker opens inside the seat card, not as a sheet: the card
        // for the top seat is rotated, so the picker's Cancel sits where the
        // rotated card puts it, and tapping it still works.
        waitFor("seat-top").tap()
        XCTAssertTrue(app.staticTexts["Top seat"].waitForExistence(timeout: 5), "seat picker did not open in the top seat")
        let cancel = el("seatPickerCancel").exists ? el("seatPickerCancel") : app.buttons["Cancel"].firstMatch
        XCTAssertTrue(cancel.waitForExistence(timeout: 5), "picker Cancel missing")
        cancel.tap()
        XCTAssertFalse(app.staticTexts["Top seat"].waitForExistence(timeout: 2))

        // Roll for first: every seat rolls, the winner is accepted, Start enables.
        waitFor("rollForFirst").tap()
        let accept = waitFor("acceptFirst", timeout: 20)
        XCTAssertTrue(expect(accept, "isEnabled == true", timeout: 15))
        XCTAssertTrue(text(containing: "goes first").exists)
        accept.tap()
        XCTAssertTrue(start.waitForExistence(timeout: 5))
        XCTAssertTrue(expect(start, "isEnabled == true", timeout: 5))
        start.tap()

        // Playing: turn 1, the turn button and the first seat's life number.
        waitFor("nextTurn")
        XCTAssertTrue(text(containing: "Turn 1").waitForExistence(timeout: 5))
        XCTAssertEqual(waitFor("s0-life").value as? String, "40")
    }

    func testPickFirstPlayer() {
        launch(["-demo"])
        turnOnRandom()
        waitFor("continueToSeating").tap()
        waitFor("pickFirst").tap()
        app.buttons["Amy"].firstMatch.tap()
        XCTAssertTrue(text(containing: "Amy goes first").waitForExistence(timeout: 5))
        let start = el("startGame")
        XCTAssertTrue(expect(start, "isEnabled == true", timeout: 5))
    }

    // MARK: Seat panel

    func testLifeTapAndHold() {
        launch(["-demoBoard"])
        let life = waitFor("s0-life")
        XCTAssertEqual(life.value as? String, "40")
        el("s0-life-dec").tap()
        XCTAssertEqual(life.value as? String, "39")
        el("s0-life-inc").tap()
        el("s0-life-inc").tap()
        XCTAssertEqual(life.value as? String, "41")
        // Hold for ±5.
        hold(el("s0-life-dec"))
        XCTAssertTrue(expect(life, "value == '36'", timeout: 3))
    }

    func testCountersAndFocusModal() {
        launch(["-demoBoard"])
        waitFor("s0-poison-inc")
        for _ in 0..<3 { el("s0-poison-inc").tap() }
        XCTAssertEqual(value("s0-poison"), "3")
        el("s0-energy-inc").tap()
        XCTAssertEqual(value("s0-energy"), "1")
        el("s0-xp-inc").tap()
        el("s0-xp-inc").tap()
        XCTAssertEqual(value("s0-xp"), "2")
        el("s0-tax-false-inc").tap()
        XCTAssertEqual(value("s0-tax-false"), "1")

        // Tap the poison value: the focus modal opens inside the panel.
        el("s0-poison-value").tap()
        let big = waitFor("focus-value")
        XCTAssertEqual(big.label, "3")
        el("focus-inc5").tap()
        XCTAssertEqual(big.label, "8")
        el("focus-dec").tap()
        XCTAssertEqual(big.label, "7")
        el("focus-close").tap()
        XCTAssertFalse(el("focus-value").waitForExistence(timeout: 2))
        XCTAssertEqual(value("s0-poison"), "7")
    }

    func testCommanderDamage() {
        launch(["-demoBoard"])
        // Seat 1 (Sam / Thraximundar) hits seat 0.
        waitFor("s0-cmd-1-inc")
        for _ in 0..<4 { el("s0-cmd-1-inc").tap() }
        XCTAssertEqual(value("s0-cmd-1"), "4")
        el("s0-cmd-1-dec").tap()
        XCTAssertEqual(value("s0-cmd-1"), "3")
        // The partner row exists for Jo (Tymna / Thrasios), seat 3.
        XCTAssertTrue(el("s0-cmd-3-partner-inc").exists)
        el("s0-cmd-3-partner-inc").tap()
        XCTAssertEqual(value("s0-cmd-3-partner"), "1")
    }

    func testCommanderSnapshot() {
        launch(["-demoBoard"])
        // Tap an opponent's name in the commander damage drawer: their snapshot
        // opens in the panel, stats and dealt-damage table left, card right.
        waitFor("s0-cmd-1-name").tap()
        XCTAssertTrue(app.staticTexts["CMD DEALT"].waitForExistence(timeout: 5), "snapshot did not open")
        XCTAssertTrue(app.staticTexts["Thraximundar"].firstMatch.exists)
        sleep(3)
        let shot = XCTAttachment(screenshot: app.screenshot())
        shot.name = "commander-snapshot"; shot.lifetime = .keepAlways
        add(shot)
        // Hop to another seat's snapshot from its row, then close.
        app.staticTexts["Amy"].firstMatch.tap()
        XCTAssertTrue(app.staticTexts["Atraxa, Praetors' Voice"].firstMatch.waitForExistence(timeout: 5))
        app.buttons.matching(NSPredicate(format: "label == 'Close' OR label == 'xmark'")).firstMatch.tap()
    }

    func testStateMenuMonarchInitiativeBlessing() {
        launch(["-demoBoard"])
        waitFor("s0-menu").tap()
        waitFor("menu-Monarch").tap()
        let crown = waitFor("s0-status-Monarch")
        XCTAssertEqual(crown.value as? String, "on")
        // The demo gives Amy (seat 2) the monarchy first; it moved to Rick.
        XCTAssertEqual(el("s2-status-Monarch").value as? String, "off")

        el("s0-menu").tap()
        waitFor("menu-Initiative").tap()
        XCTAssertEqual(waitFor("s0-status-Initiative").value as? String, "on")

        el("s0-menu").tap()
        waitFor("menu-City's Blessing").tap()
        XCTAssertEqual(waitFor("s0-status-City's Blessing").value as? String, "on")

        // Tap the crown: its reminder text opens in the panel; tap again to close.
        crown.tap()
        XCTAssertTrue(app.staticTexts["Monarch"].waitForExistence(timeout: 3), "rules tip did not open")
        app.staticTexts["tap to close"].firstMatch.tap()
        XCTAssertTrue(expect(app.staticTexts["tap to close"].firstMatch, "exists == false", timeout: 3), "rules tip did not close")
        // Give the monarchy up from the menu (the header hold is checked by hand; see testTurnsDiceSettingsLog).
        el("s0-menu").tap()
        waitFor("menu-Monarch").tap()
        // With nobody monarch the header crown is not drawn at all.
        XCTAssertTrue(expect(crown, "exists == false OR value == 'off'", timeout: 3))
    }

    func testConcedeAndUndo() {
        launch(["-demoBoard"])
        waitFor("s0-menu").tap()
        waitFor("menu-Concede").tap()
        waitFor("concedeConfirm").tap()
        waitFor("s0-eliminated")
        XCTAssertTrue(app.staticTexts["CONCEDED"].waitForExistence(timeout: 3))
        el("s0-menu").tap()
        waitFor("menu-UndoConcede").tap()
        XCTAssertFalse(el("s0-eliminated").waitForExistence(timeout: 2))
    }

    func testRotatedSeatControlsWork() {
        launch(["-demoBoard"])
        // Seat 2 (Amy) is the top panel, turned 180°; seat 1 (Sam) the left, turned 90°.
        let top = waitFor("s2-life")
        el("s2-life-dec").tap()
        XCTAssertEqual(top.value as? String, "39")
        let left = waitFor("s1-life")
        let before = Int(left.value as? String ?? "") ?? 0
        el("s1-life-inc").tap()
        XCTAssertEqual(left.value as? String, "\(before + 1)")
    }

    // MARK: Centre zone

    func testTurnsDiceSettingsLog() {
        launch(["-demoBoard"])
        // The turn number advances once every seat has passed (four players).
        let turn = waitFor("turnLabel")
        XCTAssertEqual(turn.label, "Turn 1")
        for _ in 0..<4 { el("nextTurn").tap() }
        XCTAssertTrue(expect(turn, "label == 'Turn 2'", timeout: 5))
        // A hold on Next Turn steps back a turn. XCUITest's synthesized press does
        // not register as a hold on this control in the simulator (the life buttons'
        // hold does), so the step-back is covered by the reducer tests and by hand.

        waitFor("openDice").tap()
        waitFor("dice-d20").tap()
        let total = app.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS[c] 'total'")).firstMatch
        XCTAssertTrue(total.waitForExistence(timeout: 8), "d20 result did not show")
        el("closeOverlay").tap()

        waitFor("openSettings").tap()
        XCTAssertTrue(app.switches["Dark"].waitForExistence(timeout: 5))
        XCTAssertTrue(el("endGame").exists)
        // Motion off freezes the effects; the board still responds.
        let motion = app.switches["motionToggle"].firstMatch
        XCTAssertTrue(motion.exists)
        flip(motion)
        XCTAssertTrue(expect(motion, "value == '0'", timeout: 3), "Motion did not switch off")
        el("closeOverlay").tap()
        el("s0-life-dec").tap()
        XCTAssertEqual(el("s0-life").value as? String, "39")
        waitFor("openSettings").tap()
        flip(app.switches["motionToggle"].firstMatch)
        el("closeOverlay").tap()

        waitFor("openLog").tap()
        XCTAssertTrue(app.navigationBars["Game log"].waitForExistence(timeout: 5))
        // Newest entries are last; scroll the list down to them.
        let rolled = text(containing: "Rolled")
        for _ in 0..<6 where !rolled.exists { app.swipeUp() }
        XCTAssertTrue(rolled.waitForExistence(timeout: 5), "the dice roll was not logged")
        app.buttons["Done"].tap()
    }

    func testEndGameAndDiscard() {
        launch(["-demoBoard"])
        waitFor("openSettings").tap()
        waitFor("endGame").tap()
        let confirm = app.buttons.matching(NSPredicate(format: "label == 'End game' AND identifier != 'endGame'")).firstMatch
        XCTAssertTrue(confirm.waitForExistence(timeout: 5), "end confirmation did not appear")
        confirm.tap()
        XCTAssertTrue(app.staticTexts["Final life"].firstMatch.waitForExistence(timeout: 10), "end summary did not appear")
        let discard = el("discardGame")
        for _ in 0..<6 where !discard.exists { app.swipeUp() }
        XCTAssertTrue(discard.waitForExistence(timeout: 5), "discardGame did not appear")
        discard.tap()
        app.buttons["Discard"].firstMatch.tap()
        XCTAssertTrue(app.navigationBars["New game"].waitForExistence(timeout: 10))
    }

    // MARK: Two-Headed Giant

    func testTwoHeadedGiantBoard() {
        launch(["-demo2hg"])
        waitFor("nextTurn")
        XCTAssertTrue(text(containing: "Team 1").waitForExistence(timeout: 10) || text(containing: "TEAM 1").exists)
        el("nextTurn").tap()
        XCTAssertTrue(text(containing: "Turn 2").waitForExistence(timeout: 5))
    }
}

/// Screenshots of the effects board before, during and after a Motion
/// toggle, written to `/tmp/commander-motion-shots` when that folder exists
/// (the simulator shares the Mac's filesystem); skipped otherwise. A visual
/// check, not an assertion.
final class MotionShotsUITests: XCTestCase {
    func testMotionToggleShots() throws {
        let dir = "/tmp/commander-motion-shots"
        guard FileManager.default.fileExists(atPath: dir) else { throw XCTSkip("\(dir) does not exist") }
        XCUIDevice.shared.orientation = .landscapeRight
        let app = XCUIApplication()
        app.launchArguments = ["-demoBoard", "-demoEffects"]
        app.launch()
        func shot(_ name: String) {
            let png = XCUIScreen.main.screenshot().pngRepresentation
            try? png.write(to: URL(fileURLWithPath: dir).appendingPathComponent(name + ".png"))
        }
        XCTAssertTrue(app.buttons["openSettings"].firstMatch.waitForExistence(timeout: 15))
        // Motion persists between launches: start from on.
        app.buttons["openSettings"].firstMatch.tap()
        let sw = app.switches["motionToggle"].firstMatch
        XCTAssertTrue(sw.waitForExistence(timeout: 5))
        if (sw.value as? String) == "0" { sw.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap(); sleep(2) }
        app.buttons["closeOverlay"].firstMatch.tap()
        sleep(6)
        shot("1-motion-on")
        // Torch alone on Rick's seat (no blessing there) so the dungeon shows.
        app.descendants(matching: .any)["s0-menu"].firstMatch.tap()
        app.descendants(matching: .any)["menu-Initiative"].firstMatch.tap()
        sleep(5)
        shot("1b-torch-only")
        app.buttons["openSettings"].firstMatch.tap()
        XCTAssertTrue(sw.waitForExistence(timeout: 5))
        sw.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap()
        usleep(300_000); shot("2-fading-out")
        sleep(2); shot("3-motion-off")
        XCTAssertTrue(sw.isEnabled, "switch should be enabled again after settling")
        sw.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap()
        usleep(300_000); shot("4-fading-in")
        sleep(3); shot("5-motion-on-again")
        app.buttons["closeOverlay"].firstMatch.tap()
        sleep(1); shot("6-board")
        app.descendants(matching: .any)["s0-cmd-1-name"].firstMatch.tap()
        sleep(3); shot("7-snapshot")
    }

    func testNewDeckSheetShot() throws {
        let dir = "/tmp/commander-motion-shots"
        guard FileManager.default.fileExists(atPath: dir) else { throw XCTSkip("\(dir) does not exist") }
        XCUIDevice.shared.orientation = .landscapeRight
        let app = XCUIApplication()
        app.launchArguments = ["-demo"]
        app.launch()
        XCTAssertTrue(app.staticTexts["New game"].firstMatch.waitForExistence(timeout: 15))
        let button = app.descendants(matching: .any)["newDeck"].firstMatch
        for _ in 0..<4 where !button.exists { app.swipeUp() }
        XCTAssertTrue(button.waitForExistence(timeout: 5))
        button.tap()
        XCTAssertTrue(app.descendants(matching: .any)["deckEditorCreate"].firstMatch.waitForExistence(timeout: 5))
        app.textFields.element(boundBy: 0).tap()
        app.typeText("Atraxa")
        sleep(3)
        try? XCUIScreen.main.screenshot().pngRepresentation.write(to: URL(fileURLWithPath: dir).appendingPathComponent("9-new-deck.png"))
    }
}
