import SwiftUI
import CommanderGameKit

/// One player's panel during play: life, poison, commander damage, counters,
/// status toggles, concede. Every control dispatches an event to the session.
struct SeatPanel: View {
    @Bindable var session: GameSession
    let idx: Int
    @State private var showDamage = false
    @State private var showCounters = false
    @State private var confirmConcede = false
    @State private var lifeFlash = 0

    private var player: PlayerState { session.state.players[idx] }
    private var isActive: Bool {
        guard session.state.firstPlayerIdx != nil else { return false }
        if session.state.isTwoHeadedGiant {
            return session.state.players[session.state.currentPlayerIdx].teamNumber == player.teamNumber
        }
        return session.state.currentPlayerIdx == idx
    }
    private var poisonLethal: Int { session.state.isTwoHeadedGiant ? GameReducer.twoHeadedGiantPoisonThreshold : 10 }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(.secondarySystemGroupedBackground))
                .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(isActive ? Color.accentColor : .clear, lineWidth: 4))
            VStack(spacing: 4) {
                header
                lifeRow
                statusRow
            }
            .padding(10)
            if player.isEliminated {
                eliminatedOverlay
            }
        }
        .sheet(isPresented: $showDamage) { CommanderDamageSheet(session: session, targetIdx: idx) }
        .sheet(isPresented: $showCounters) { CountersSheet(session: session, idx: idx) }
        .confirmationDialog("\(player.playerName) concedes?", isPresented: $confirmConcede, titleVisibility: .visible) {
            Button("Concede", role: .destructive) { session.dispatch(.eliminate(playerIdx: idx)) }
        }
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 0) {
                Text(player.playerName).font(.headline)
                Text(player.partner.map { "\(player.commander.name) / \($0.name)" } ?? player.commander.name)
                    .font(.caption).foregroundStyle(.secondary).lineLimit(1)
            }
            Spacer()
            if player.isMonarch { Image(systemName: "crown.fill").foregroundStyle(.yellow).symbolEffect(.pulse) }
            if player.hasInitiative { Image(systemName: "flame.fill").foregroundStyle(.orange).symbolEffect(.pulse) }
            if player.hasCitysBlessing { Image(systemName: "building.2.fill").foregroundStyle(.teal) }
            if isActive { Image(systemName: "arrowtriangle.right.fill").foregroundStyle(Color.accentColor) }
        }
    }

    private var lifeRow: some View {
        HStack(spacing: 12) {
            lifeButton("minus", -1) { session.dispatch(.lifeChange(playerIdx: idx, delta: -1)); lifeFlash += 1 }
            VStack(spacing: 0) {
                Text("\(player.life)")
                    .font(.system(size: 56, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .frame(minWidth: 96)
                    .contentTransition(.numericText(value: Double(player.life)))
                    .animation(.snappy, value: player.life)
                    .phaseAnimator([false, true], trigger: lifeFlash) { view, flashing in
                        view.foregroundStyle(flashing ? Color.red : Color.primary)
                            .shadow(color: flashing ? .red.opacity(0.8) : .clear, radius: flashing ? 18 : 0)
                    } animation: { _ in .easeOut(duration: 0.35) }
                Text("life").font(.caption2).foregroundStyle(.secondary)
            }
            lifeButton("plus", 1) { session.dispatch(.lifeChange(playerIdx: idx, delta: 1)) }
            Divider().frame(height: 50)
            VStack(spacing: 2) {
                HStack(spacing: 6) {
                    smallButton("minus") { session.dispatch(.poisonChange(playerIdx: idx, delta: -1)) }
                    Text("\(player.poison)")
                        .font(.system(size: 28, weight: .semibold, design: .rounded)).monospacedDigit()
                        .foregroundStyle(player.poison >= poisonLethal - 2 ? Color.green : Color.primary)
                        .frame(minWidth: 40)
                        .contentTransition(.numericText(value: Double(player.poison)))
                        .animation(.snappy, value: player.poison)
                    smallButton("plus") { session.dispatch(.poisonChange(playerIdx: idx, delta: 1)) }
                }
                Text("poison").font(.caption2).foregroundStyle(.secondary)
            }
        }
        .frame(maxHeight: .infinity)
    }

    private var statusRow: some View {
        HStack(spacing: 8) {
            Button { showDamage = true } label: { Label("Cmd dmg", systemImage: "shield.lefthalf.filled") }
            Button { showCounters = true } label: {
                Label(countersLabel, systemImage: "number.circle")
            }
            Spacer()
            toggle("crown", player.isMonarch) { session.dispatch(.toggleMonarch(playerIdx: idx)) }
            toggle("flame", player.hasInitiative) { session.dispatch(.toggleInitiative(playerIdx: idx)) }
            toggle("building.2", player.hasCitysBlessing) { session.dispatch(.toggleCitysBlessing(playerIdx: idx)) }
            Button(role: .destructive) { confirmConcede = true } label: { Image(systemName: "flag.fill") }
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .font(.caption)
    }

    private var countersLabel: String {
        var parts: [String] = []
        if player.commanderTax > 0 { parts.append("tax \(player.commanderTax)") }
        if player.partnerCommanderTax > 0 { parts.append("ptax \(player.partnerCommanderTax)") }
        if player.energy > 0 { parts.append("⚡︎\(player.energy)") }
        if player.experience > 0 { parts.append("xp \(player.experience)") }
        return parts.isEmpty ? "Counters" : parts.joined(separator: " ")
    }

    private var eliminatedOverlay: some View {
        RoundedRectangle(cornerRadius: 20)
            .fill(.black.opacity(0.72))
            .overlay {
                VStack(spacing: 8) {
                    Text(player.isConceded ? "CONCEDED" : (player.poison >= poisonLethal ? "POISONED" : "ELIMINATED"))
                        .font(.system(size: 34, weight: .black, design: .rounded))
                        .foregroundStyle(.white)
                    if let t = player.eliminatedTurn { Text("turn \(t)").foregroundStyle(.white.opacity(0.8)) }
                    if player.isConceded {
                        Button("Undo") { session.dispatch(.undoEliminate(playerIdx: idx)) }
                            .buttonStyle(.borderedProminent).controlSize(.small)
                    } else {
                        Text("Adjust life, poison or commander damage to undo").font(.caption2).foregroundStyle(.white.opacity(0.7))
                        HStack {
                            Button("+1 life") { session.dispatch(.lifeChange(playerIdx: idx, delta: 1)) }
                            Button("−1 poison") { session.dispatch(.poisonChange(playerIdx: idx, delta: -1)) }
                            Button("Cmd dmg") { showDamage = true }
                        }
                        .buttonStyle(.bordered).controlSize(.small).tint(.white)
                    }
                }
            }
            .transition(.opacity)
    }

    private func lifeButton(_ symbol: String, _ delta: Int, action: @escaping () -> Void) -> some View {
        RepeatButton(symbol: symbol, size: 44, action: action)
    }

    private func smallButton(_ symbol: String, action: @escaping () -> Void) -> some View {
        RepeatButton(symbol: symbol, size: 30, action: action)
    }

    private func toggle(_ symbol: String, _ on: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) { Image(systemName: on ? "\(symbol).fill" : symbol) }
            .tint(on ? .accentColor : .secondary)
    }
}

/// A round +/− button that fires once on tap and repeats while held, like the
/// web's long-press steppers.
struct RepeatButton: View {
    let symbol: String
    let size: CGFloat
    let action: () -> Void
    @State private var repeating: Task<Void, Never>?

    var body: some View {
        Image(systemName: symbol)
            .font(.system(size: size * 0.45, weight: .bold))
            .frame(width: size, height: size)
            .background(Circle().fill(Color(.tertiarySystemFill)))
            .contentShape(Circle())
            .onTapGesture { action(); haptic() }
            .onLongPressGesture(minimumDuration: 0.4, perform: {}, onPressingChanged: { pressing in
                if pressing {
                    repeating = Task { @MainActor in
                        try? await Task.sleep(for: .milliseconds(400))
                        while !Task.isCancelled {
                            action(); haptic()
                            try? await Task.sleep(for: .milliseconds(120))
                        }
                    }
                } else {
                    repeating?.cancel(); repeating = nil
                }
            })
            .sensoryFeedback(.increase, trigger: tick)
    }
    @State private var tick = 0
    private func haptic() { tick += 1 }
}
