import SwiftUI
import CommanderGameKit

/// The `+` menu (web "game state submenu"): Monarch / Initiative / City's
/// Blessing rows with reminder text, Concede (with a turn number and an
/// "are you sure"), Undo Concede once eliminated.
struct StateMenuOverlay: View {
    @Bindable var session: GameSession
    let idx: Int
    @Binding var overlay: SeatOverlay?
    @Binding var concedeTurn: String
    @Environment(\.colorScheme) private var scheme
    @State private var rulesOpen: String?

    private var p: PlayerState { session.state.players[idx] }
    private var confirming: Bool { overlay == .concedeConfirm }

    var body: some View {
        ZStack {
            Theme.overlayBackground(scheme).onTapGesture { overlay = nil }
            VStack(spacing: 8) {
                VStack(spacing: 0) {
                    statusRow("Monarch", color: Theme.gold, active: p.isMonarch, rules: RulesText.monarch, glyph: AnyView(Image(systemName: "crown.fill").foregroundStyle(p.isMonarch ? Theme.gold : .secondary))) {
                        session.dispatch(.toggleMonarch(playerIdx: idx))
                    }
                    Divider()
                    statusRow("Initiative", color: Theme.initiativeBlue, active: p.hasInitiative, rules: RulesText.initiative, glyph: AnyView(InitiativeGlyph().frame(width: 18, height: 18).foregroundStyle(p.hasInitiative ? Theme.initiativeBlue : .secondary))) {
                        session.dispatch(.toggleInitiative(playerIdx: idx))
                    }
                    Divider()
                    statusRow("City's Blessing", color: Theme.cityPurple, active: p.hasCitysBlessing, rules: RulesText.citysBlessing, glyph: AnyView(CityGlyph(active: p.hasCitysBlessing).frame(width: 18, height: 18))) {
                        session.dispatch(.toggleCitysBlessing(playerIdx: idx))
                    }
                    Divider()
                    concedeRow
                }
                .frame(maxWidth: 240)
                .background(RoundedRectangle(cornerRadius: 10).fill(Theme.menuBackground(scheme)))
                .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(Color.primary.opacity(0.12)))
                Text("tap outside to close").font(.caption2).foregroundStyle(.tertiary)
            }
            .padding(12)
        }
    }

    private func statusRow(_ label: String, color: Color, active: Bool, rules: String, glyph: AnyView, toggle: @escaping () -> Void) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 10) {
                glyph.frame(width: 18)
                Text(label).font(.system(size: 13, weight: active ? .bold : .regular)).foregroundStyle(active ? color : .secondary)
                Spacer()
                Button { rulesOpen = rulesOpen == label ? nil : label } label: {
                    Image(systemName: "info.circle").font(.system(size: 14)).foregroundStyle(rulesOpen == label ? Color.accentColor : .secondary)
                }
                .buttonStyle(.plain)
                if active { Circle().fill(color).frame(width: 6, height: 6) }
            }
            .padding(.horizontal, 12).padding(.vertical, 10)
            .contentShape(Rectangle())
            .onTapGesture { toggle(); overlay = nil }
            if rulesOpen == label {
                Text(rules).font(.system(size: 12)).foregroundStyle(.secondary).padding(.horizontal, 12).padding(.bottom, 8)
            }
        }
    }

    @ViewBuilder private var concedeRow: some View {
        if p.isEliminated {
            HStack(spacing: 10) {
                Image(systemName: "person.fill.xmark"); Text("Undo Concede").font(.system(size: 13, weight: .bold))
            }
            .foregroundStyle(Theme.danger).padding(.horizontal, 12).padding(.vertical, 10).frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
            .onTapGesture { session.dispatch(.undoEliminate(playerIdx: idx)); overlay = nil }
        } else if confirming {
            VStack(alignment: .leading, spacing: 6) {
                Text("Are you sure you want to quit?").font(.system(size: 12, weight: .semibold)).foregroundStyle(Theme.gold)
                HStack(spacing: 6) {
                    TextField("Turn #", text: $concedeTurn).keyboardType(.numberPad).textFieldStyle(.roundedBorder).frame(width: 72)
                    Button("✓") { session.dispatch(.eliminate(playerIdx: idx)); concedeTurn = ""; overlay = nil }
                        .buttonStyle(.borderedProminent).tint(Theme.gold).controlSize(.small)
                    Button("✕") { overlay = .stateMenu }.buttonStyle(.bordered).tint(Theme.gold).controlSize(.small)
                }
            }
            .padding(12).background(Theme.gold.opacity(0.12))
        } else {
            HStack(spacing: 10) {
                Image(systemName: "person.fill.xmark"); Text("Concede").font(.system(size: 13))
            }
            .foregroundStyle(.secondary).padding(.horizontal, 12).padding(.vertical, 10).frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
            .onTapGesture { overlay = .concedeConfirm }
        }
    }
}

/// In-panel reminder text for a status icon or tax medallion.
struct RulesTipOverlay: View {
    let title: String
    let text: String
    let onClose: () -> Void
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        ZStack {
            Color.black.opacity(0.35).onTapGesture(perform: onClose)
            VStack(alignment: .leading, spacing: 6) {
                Text(title).font(.system(size: 14, weight: .bold))
                Text(text).font(.system(size: 12)).foregroundStyle(.secondary)
                Text("tap to close").font(.caption2).foregroundStyle(.tertiary)
            }
            .padding(12)
            .frame(maxWidth: 260)
            .background(RoundedRectangle(cornerRadius: 10).fill(Theme.menuBackground(scheme)).shadow(radius: 12))
            .onTapGesture(perform: onClose)
        }
        .transition(.opacity)
    }
}

/// Commander snapshot for an opponent (web "commander snapshot overlay"):
/// their art as a backdrop, name and commanders (tap for the card), life,
/// counters, and the commander damage they have dealt to everyone, with your
/// own row first; other rows hop to that seat's snapshot.
struct CommanderSnapshotOverlay: View {
    @Bindable var session: GameSession
    let viewerIdx: Int
    let sourceIdx: Int
    let partner: Bool
    @Binding var overlay: SeatOverlay?
    let sizes: SeatPanel.Sizes
    @Environment(\.colorScheme) private var scheme
    @State private var art = CommanderArtLoader()

    private var state: GameState { session.state }
    private var src: PlayerState { state.players[sourceIdx] }
    private var dealtRows: [(idx: Int, dmg: CommanderDamage)] {
        state.players.indices.filter { $0 != sourceIdx }
            .map { ($0, state.commanderDamage[$0, sourceIdx]) }
            .sorted { a, b in a.0 == viewerIdx && b.0 != viewerIdx }
    }

    var body: some View {
        ZStack {
            (scheme == .dark ? Color(red: 20/255, green: 12/255, blue: 4/255).opacity(0.96) : Color(red: 1, green: 248/255, blue: 240/255).opacity(0.97))
                .onTapGesture { overlay = nil }
            if let img = art.image { Image(uiImage: img).resizable().scaledToFill().opacity(0.15).allowsHitTesting(false).clipped() }
            VStack(alignment: .leading, spacing: 6) {
                HStack(alignment: .top, spacing: 8) {
                    VStack(alignment: .leading, spacing: 1) {
                        HStack(spacing: 4) {
                            Text(src.playerName).font(.system(size: sizes.source, weight: .heavy)).lineLimit(1)
                            if src.isMonarch { Image(systemName: "crown.fill").foregroundStyle(Theme.gold).font(.system(size: sizes.badge)) }
                            if src.hasInitiative { InitiativeGlyph().foregroundStyle(Theme.initiativeBlue).frame(width: sizes.badge, height: sizes.badge) }
                        }
                        Text(src.commander.name).font(.system(size: sizes.label)).foregroundStyle(.secondary).lineLimit(1)
                            .onTapGesture { overlay = .preview(name: src.commander.name) }
                        if let p = src.partner {
                            Text(p.name).font(.system(size: sizes.label)).foregroundStyle(.secondary).lineLimit(1)
                                .onTapGesture { overlay = .preview(name: p.name) }
                        }
                    }
                    Spacer()
                    Text("\(src.life)").font(.system(size: sizes.value * 2, weight: .black).monospacedDigit())
                        .foregroundStyle(Theme.lifeColor(src.life, startingLife: state.startingLife) ?? .accentColor)
                        .strikethrough(src.isEliminated)
                    Button { overlay = nil } label: { Image(systemName: "xmark").font(.system(size: sizes.source)) }.buttonStyle(.plain).foregroundStyle(.secondary)
                }
                Divider()
                HStack {
                    Text("☠ \(src.poison)").foregroundStyle(src.poison >= 10 ? Theme.danger : src.poison > 0 ? Theme.poisonGreen : .secondary)
                    Spacer()
                    Text("⚡ \(src.energy)").foregroundStyle(src.energy > 0 ? Theme.energyCyan : .secondary)
                    Spacer()
                    Text("XP \(src.experience)").foregroundStyle(src.experience > 0 ? Theme.gold : .secondary)
                    Spacer()
                    Text("Tax +\(max(src.commanderTax, src.partnerCommanderTax) * 2)").foregroundStyle(.secondary)
                }
                .font(.system(size: sizes.source, weight: .bold))
                .padding(.horizontal, 8).padding(.vertical, 4)
                .background(RoundedRectangle(cornerRadius: 6).fill(Color.primary.opacity(0.05)))
                Text("CMD DEALT").font(.system(size: sizes.label, weight: .semibold)).kerning(0.5).foregroundStyle(.tertiary)
                ForEach(dealtRows, id: \.idx) { row in
                    let tgt = state.players[row.idx]
                    let isMe = row.idx == viewerIdx
                    HStack(spacing: 6) {
                        CommanderArt(name: tgt.commander.name, height: 22).opacity(isMe ? 1 : 0.75)
                            .onTapGesture { overlay = .preview(name: tgt.commander.name) }
                        Text(tgt.playerName).font(.system(size: sizes.label, weight: isMe ? .bold : .regular)).foregroundStyle(isMe ? Color.accentColor : .secondary).lineLimit(1)
                        Spacer()
                        Text(src.partner != nil ? "\(row.dmg.fromCommander)/\(row.dmg.fromPartner)" : "\(row.dmg.fromCommander)")
                            .font(.system(size: sizes.source, weight: .bold))
                            .foregroundStyle(row.dmg.fromCommander >= 21 || row.dmg.fromPartner >= 21 ? Theme.danger : isMe ? Color.accentColor : .primary)
                    }
                    .contentShape(Rectangle())
                    .onTapGesture { if !isMe { overlay = .snapshot(sourceIdx: row.idx, partner: false) } }
                }
                Spacer(minLength: 0)
            }
            .padding(10)
        }
        .task(id: sourceIdx) { art.load(partner ? (src.partner?.name ?? src.commander.name) : src.commander.name) }
        .transition(.opacity)
    }
}
