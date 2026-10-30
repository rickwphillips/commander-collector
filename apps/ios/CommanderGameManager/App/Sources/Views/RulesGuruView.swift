import SwiftUI
import WebKit
import CommanderGameKit

/// Rules Guru chat (web `CenterZone` chat dialog): the hosted rules-guru app
/// in a web view, handed the live game as the same `?ctx=` payload the web
/// board sends, and signed in with this app's token so it needs no login.
struct RulesGuruSheet: View {
    let state: GameState
    let elapsedSeconds: Int
    @Environment(Session.self) private var account
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            RulesGuruWebView(url: RulesGuruContext.url(for: state, elapsedSeconds: elapsedSeconds, server: account.server), token: account.token)
                .ignoresSafeArea(edges: .bottom)
                .navigationTitle("Rules Guru — Game Context")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
    }
}

/// Builds the game context the rules guru reads (web `buildRulesGuruContext`
/// + `encodeGameContextParam`: JSON, UTF-8, base64, URL-escaped).
enum RulesGuruContext {
    static func url(for state: GameState, elapsedSeconds: Int, server: URL) -> URL {
        let base: String
        if server.host == "localhost" || server.host == "127.0.0.1" {
            base = "http://localhost:3003"
        } else {
            base = "https://\(server.host ?? "rickwphillips.com")/app/projects/commander/rules"
        }
        let json = (try? JSONSerialization.data(withJSONObject: payload(state, elapsedSeconds: elapsedSeconds), options: [.sortedKeys])) ?? Data("{}".utf8)
        let param = json.base64EncodedString().addingPercentEncoding(withAllowedCharacters: .alphanumerics) ?? ""
        return URL(string: "\(base)/chat?ctx=\(param)")!
    }

    static func payload(_ state: GameState, elapsedSeconds: Int) -> [String: Any] {
        let is2hg = state.isTwoHeadedGiant
        let firstSet = state.firstPlayerIdx != nil
        let current = state.players[state.currentPlayerIdx]
        let activeTeam = is2hg ? current.teamNumber : nil
        let players: [[String: Any]] = state.players.enumerated().map { idx, p in
            var e: [String: Any] = [
                "playerName": p.playerName, "deckName": p.deckName, "commander": p.commander.name,
                "partner": p.partner?.name as Any, "deckId": p.deckId, "life": p.life,
                "isEliminated": p.isEliminated, "isConceded": p.isConceded,
            ]
            if let t = p.teamNumber { e["teamNumber"] = t; e["teamName"] = Teams.name(t, teamNames: state.teamNames) }
            if p.poison > 0 { e["poison"] = p.poison }
            if p.energy > 0 { e["energy"] = p.energy }
            if p.experience > 0 { e["experience"] = p.experience }
            if p.commanderTax > 0 { e["commanderTax"] = p.commanderTax }
            if p.isMonarch { e["isMonarch"] = true }
            if p.hasInitiative { e["hasInitiative"] = true }
            if p.hasCitysBlessing { e["hasCitysBlessing"] = true }
            if let received = state.commanderDamage[idx] {
                var dmg: [String: [Int]] = [:]
                for (src, d) in received where d.fromCommander > 0 || d.fromPartner > 0 {
                    let name = state.players.indices.contains(src) ? state.players[src].playerName : String(src)
                    dmg[name] = d.fromPartner > 0 ? [d.fromCommander, d.fromPartner] : [d.fromCommander]
                }
                if !dmg.isEmpty { e["commanderDamage"] = dmg }
            }
            return e
        }
        return [
            "gameType": state.gameType?.rawValue ?? "commander",
            "players": players,
            "turnNumber": firstSet ? state.turnNumber : NSNull(),
            "currentPlayer": firstSet ? current.playerName : NSNull(),
            "currentTeam": firstSet && is2hg && activeTeam != nil ? Teams.name(activeTeam, teamNames: state.teamNames) : NSNull(),
            "timerSeconds": state.turnTimerSeconds > 0 ? state.turnTimerSeconds : NSNull(),
            "elapsedSeconds": state.turnTimerSeconds > 0 ? elapsedSeconds : NSNull(),
        ]
    }
}

struct RulesGuruWebView: UIViewRepresentable {
    let url: URL
    let token: String?

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        if let token, token != "demo" {
            // The rules guru reads its bearer token from localStorage, as the web
            // app sets it after login. Same origin as our API, our own session.
            let escaped = token.replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "'", with: "\\'")
            let script = WKUserScript(source: "try { localStorage.setItem('auth_token', '\(escaped)'); } catch (e) {}", injectionTime: .atDocumentStart, forMainFrameOnly: true)
            config.userContentController.addUserScript(script)
        }
        let view = WKWebView(frame: .zero, configuration: config)
        view.load(URLRequest(url: url))
        return view
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
