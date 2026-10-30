import Foundation
import Observation
import CommanderAPI

/// Highlight mode, sound and the turn timer default, mirrored from the web's
/// game-settings endpoint. Stored locally so the board works offline; a change
/// here posts to the server and the next sign-in pulls the merged values.
@Observable
@MainActor
final class GameSettingsStore {
    var highlightMode: Bool { didSet { save() } }
    var soundEnabled: Bool { didSet { save(); SoundService.shared.enabled = soundEnabled } }
    var turnTimerEnabled: Bool { didSet { save() } }
    var turnTimerSeconds: Int { didSet { save() } }
    /// The web's Dark toggle; the board forces its own scheme so the table
    /// reads the same in any room light.
    var darkMode: Bool { didSet { save() } }
    /// Persisted per player on the web (`cmdDmgShowPlayer:<id>`); one switch
    /// per seat here too.
    var showPlayerNamesInCmdDamage: Set<String> { didSet { save() } }

    private let defaults = UserDefaults.standard
    private var loaded = false

    init() {
        highlightMode = defaults.object(forKey: "settings.highlight") as? Bool ?? true
        soundEnabled = defaults.object(forKey: "settings.sound") as? Bool ?? true
        turnTimerEnabled = defaults.object(forKey: "settings.timerEnabled") as? Bool ?? true
        turnTimerSeconds = defaults.object(forKey: "settings.timerSeconds") as? Int ?? 300
        darkMode = defaults.object(forKey: "settings.dark") as? Bool ?? true
        showPlayerNamesInCmdDamage = Set(defaults.stringArray(forKey: "settings.cmdShowPlayer") ?? [])
        loaded = true
        SoundService.shared.enabled = soundEnabled
    }

    private func save() {
        guard loaded else { return }
        defaults.set(highlightMode, forKey: "settings.highlight")
        defaults.set(soundEnabled, forKey: "settings.sound")
        defaults.set(turnTimerEnabled, forKey: "settings.timerEnabled")
        defaults.set(turnTimerSeconds, forKey: "settings.timerSeconds")
        defaults.set(darkMode, forKey: "settings.dark")
        defaults.set(Array(showPlayerNamesInCmdDamage), forKey: "settings.cmdShowPlayer")
    }

    /// Pull the server's copy (sign-in and refresh only).
    func pull(using client: Client) async {
        guard let response = try? await client.getGameSettings(), case .ok(let ok) = response,
              let s = try? ok.body.json else { return }
        highlightMode = s.highlightMode
        soundEnabled = s.soundEnabled
        turnTimerEnabled = s.turnTimerEnabled
        turnTimerSeconds = s.turnTimerSeconds
    }

    /// Push a change; failures are ignored (the local copy is authoritative at the table).
    func push(using client: Client) {
        let body = Components.Schemas.GameSettingsInput(
            soundEnabled: soundEnabled, highlightMode: highlightMode,
            turnTimerEnabled: turnTimerEnabled, turnTimerSeconds: turnTimerSeconds)
        Task { _ = try? await client.updateGameSettings(body: .json(body)) }
    }

    func toggleShowPlayerName(_ playerId: String) {
        if showPlayerNamesInCmdDamage.contains(playerId) { showPlayerNamesInCmdDamage.remove(playerId) } else { showPlayerNamesInCmdDamage.insert(playerId) }
    }
}
