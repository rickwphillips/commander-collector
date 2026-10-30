import SwiftUI
import WebKit
import CommanderGameKit

/// The Rules Guru chat (web `CenterZone` chat dialog) kept alive behind the
/// board: minimising hides the sheet but keeps the conversation, the board
/// streams the live game into it every second, and the Guru's "save to
/// notes" lands in the game notes. Closing ends the conversation.
@MainActor
@Observable
final class RulesGuruChat {
    private(set) var webView: WKWebView?
    /// The sheet is on screen.
    var isPresented = false
    /// A conversation exists (on screen or minimised).
    private(set) var isActive = false
    /// An answer arrived while minimised.
    private(set) var hasNewContent = false
    /// The Guru is searching or answering.
    private(set) var searching = false
    var onSaveNotes: ((String) -> Void)?
    private let bridge = Bridge()

    init() { bridge.chat = self }

    func open(url: URL, token: String?) {
        if webView == nil {
            let config = WKWebViewConfiguration()
            if let token, token != "demo" {
                // The rules guru reads its bearer token from localStorage, as
                // the web app sets it after login. Same origin as our API.
                let escaped = token.replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "'", with: "\\'")
                config.userContentController.addUserScript(WKUserScript(source: "try { localStorage.setItem('auth_token', '\(escaped)'); } catch (e) {}", injectionTime: .atDocumentStart, forMainFrameOnly: true))
            }
            // The page talks to its host with window.parent.postMessage; here
            // the page is the main frame, so its own window hears it.
            config.userContentController.addUserScript(WKUserScript(source: "window.addEventListener('message', function (e) { try { window.webkit.messageHandlers.rules.postMessage(e.data); } catch (err) {} });", injectionTime: .atDocumentStart, forMainFrameOnly: true))
            config.userContentController.add(bridge, name: "rules")
            let view = WKWebView(frame: .zero, configuration: config)
            view.load(URLRequest(url: url))
            webView = view
        }
        isActive = true
        hasNewContent = false
        isPresented = true
    }

    func minimize() { isPresented = false }

    func close() {
        isPresented = false
        isActive = false
        hasNewContent = false
        searching = false
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: "rules")
        webView = nil
    }

    /// The web's per-second `rules_timer_update` + `rules_game_state_update`.
    func push(state: GameState, elapsedSeconds: Int) {
        guard isActive, let webView else { return }
        let firstSet = state.firstPlayerIdx != nil
        let timer: [String: Any] = [
            "type": "rules_timer_update",
            "timerSeconds": state.turnTimerSeconds, "elapsedSeconds": elapsedSeconds,
            "remaining": max(0, state.turnTimerSeconds - elapsedSeconds),
            "currentPlayer": firstSet ? state.players[state.currentPlayerIdx].playerName : NSNull(),
            "turnNumber": firstSet ? state.turnNumber : NSNull(),
        ]
        var game = RulesGuruContext.payload(state, elapsedSeconds: elapsedSeconds)
        game["type"] = "rules_game_state_update"
        for message in [timer, game] {
            guard let data = try? JSONSerialization.data(withJSONObject: message), let json = String(data: data, encoding: .utf8) else { continue }
            webView.evaluateJavaScript("window.postMessage(\(json), '*'); undefined") { _, _ in }
        }
    }

    fileprivate func received(_ body: Any) {
        guard let dict = body as? [String: Any], let type = dict["type"] as? String else { return }
        switch type {
        case "rules_save_notes":
            if let content = dict["content"] as? String { onSaveNotes?(content) }
        case "rules_new_content":
            if !isPresented { hasNewContent = true }
        case "rules_loading":
            let on = (dict["value"] as? Bool) ?? ((dict["value"] as? Int).map { $0 != 0 } ?? false)
            searching = on
            if !on && !isPresented { hasNewContent = true }
        default:
            break   // our own pushes echo back through the same listener
        }
    }

    /// WebKit's handler object; kept outside the observable so WebKit holds
    /// a plain NSObject.
    private final class Bridge: NSObject, WKScriptMessageHandler {
        weak var chat: RulesGuruChat?
        nonisolated func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            MainActor.assumeIsolated {
                let body = message.body
                chat?.received(body)
            }
        }
    }
}

struct RulesGuruSheet: View {
    let chat: RulesGuruChat

    var body: some View {
        NavigationStack {
            Group {
                if let webView = chat.webView { ExistingWebView(webView: webView).ignoresSafeArea(edges: .bottom) }
            }
            .navigationTitle("Rules Guru — Game Context")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close", role: .destructive) { chat.close() }.accessibilityIdentifier("rulesClose")
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button { chat.minimize() } label: { Label("Minimise", systemImage: "arrow.down.right.and.arrow.up.left") }.accessibilityIdentifier("rulesMinimize")
                }
            }
        }
    }
}

/// Hosts a web view that outlives the sheet.
struct ExistingWebView: UIViewRepresentable {
    let webView: WKWebView
    func makeUIView(context: Context) -> WKWebView { webView }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
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
