// swift-tools-version: 6.0
import PackageDescription

// CommanderGameKit — the platform-neutral core of the native game manager:
// game state, the live-event reducer and the event-log deriver, ported from
// apps/core/app/game-manager/{remoteTransforms,gameLog}.ts. No UI, no
// networking, no persistence, so it builds and tests on macOS with plain
// SwiftPM as well as inside the iOS app target.
let package = Package(
    name: "CommanderGameKit",
    platforms: [.iOS(.v18), .macOS(.v14)],
    products: [
        .library(name: "CommanderGameKit", targets: ["CommanderGameKit"]),
    ],
    targets: [
        .target(name: "CommanderGameKit"),
        .testTarget(
            name: "CommanderGameKitTests",
            dependencies: ["CommanderGameKit"],
            resources: [.copy("Fixtures")]
        ),
    ]
)
