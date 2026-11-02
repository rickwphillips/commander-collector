import Foundation

/// Pages of the Commander Collector web app that the iPad hands off to Safari.
/// The site is the record of finished games and the full deck editor; the
/// native app only tracks the live table.
enum CommanderWeb {
    static let base = URL(string: "https://rickwphillips.com/app/projects/commander/")!
    static let games = base.appending(path: "games/")
    static let decks = base.appending(path: "decks/")
}
