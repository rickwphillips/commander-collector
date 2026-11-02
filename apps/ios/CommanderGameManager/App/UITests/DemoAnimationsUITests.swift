import XCTest

/// Drives the demo board through its status effects so a screen recording can
/// capture them: monarch crown, City's Blessing, damage flash and cracks, poison
/// escalation, initiative torch, XP level-ups. Not an assertion suite; every
/// step is best-effort so a missing control never cuts the recording short.
final class DemoAnimationsUITests: XCTestCase {
    private var app: XCUIApplication!
    private func el(_ id: String) -> XCUIElement { app.descendants(matching: .any)[id].firstMatch }
    private func tapIfPresent(_ id: String, wait: TimeInterval = 3) {
        let e = el(id)
        if e.waitForExistence(timeout: wait) { e.tap() } else { print("[anim] missing \(id)") }
    }
    private func pause(_ s: Double) { RunLoop.current.run(until: Date().addingTimeInterval(s)) }

    func testShowcaseStatusEffects() {
        app = XCUIApplication()
        app.launchArguments = ["-demoBoard"]
        app.launch()
        XCTAssertTrue(el("s0-life").waitForExistence(timeout: 20))
        pause(7)                                   // staggered seat reveal

        tapIfPresent("s0-menu"); tapIfPresent("menu-Monarch"); pause(3.5)       // crown slides in
        if el("menu-Monarch").exists { tapIfPresent("closeOverlay", wait: 1) }
        tapIfPresent("s0-menu"); tapIfPresent("menu-City's Blessing"); pause(6)  // fireworks, castle, cathedral
        if el("menu-City's Blessing").exists { tapIfPresent("closeOverlay", wait: 1) }

        for _ in 0..<3 {                           // −5 holds: red flash, claw swipes, cracks deepen
            el("s0-life-dec").coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).press(forDuration: 1.0)
            pause(1.6)
        }

        for _ in 0..<9 { tapIfPresent("s0-poison-inc", wait: 1); pause(0.45) }   // drips, bubbles, boil at 9
        pause(4)

        tapIfPresent("s1-menu"); tapIfPresent("menu-Initiative"); pause(4)      // dungeon torch
        if el("menu-Initiative").exists { tapIfPresent("closeOverlay", wait: 1) }

        for _ in 0..<3 { tapIfPresent("s1-experience-inc", wait: 1); pause(1.2) } // XP badge level-ups
        for _ in 0..<6 { tapIfPresent("s1-energy-inc", wait: 1); pause(0.3) }     // energy glow and jitter
        pause(4)
    }
}
