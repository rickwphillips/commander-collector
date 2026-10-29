// swift-tools-version: 6.0
import PackageDescription

// CommanderGameKit — the platform-neutral core of the native game manager:
// game state, the live-event reducer and the event-log deriver, ported from
// apps/core/app/game-manager/{remoteTransforms,gameLog}.ts. No UI, no
// persistence, so it builds and tests on macOS with plain SwiftPM as well as
// inside the iOS app target.
//
// CommanderAPI — the HTTP client generated at build time from
// commander-collector/docs/openapi.yaml (symlinked into Sources/CommanderAPI),
// so the web and native clients share one contract and a spec change here is
// a compile error there.
let package = Package(
    name: "CommanderGameKit",
    platforms: [.iOS(.v18), .macOS(.v14)],
    products: [
        .library(name: "CommanderGameKit", targets: ["CommanderGameKit"]),
        .library(name: "CommanderAPI", targets: ["CommanderAPI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-openapi-generator", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-openapi-runtime", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-openapi-urlsession", from: "1.0.0"),
    ],
    targets: [
        .target(name: "CommanderGameKit"),
        .target(
            name: "CommanderAPI",
            dependencies: [
                .product(name: "OpenAPIRuntime", package: "swift-openapi-runtime"),
                .product(name: "OpenAPIURLSession", package: "swift-openapi-urlsession"),
            ],
            plugins: [.plugin(name: "OpenAPIGenerator", package: "swift-openapi-generator")]
        ),
        .testTarget(
            name: "CommanderGameKitTests",
            dependencies: ["CommanderGameKit", "CommanderAPI"],
            resources: [.copy("Fixtures")]
        ),
    ]
)
