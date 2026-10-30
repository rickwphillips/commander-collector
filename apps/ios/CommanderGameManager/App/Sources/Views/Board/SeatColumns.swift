import SwiftUI
import CommanderGameKit

/// Left column of a seat: commander damage taken from each opponent (web
/// `CommanderDamageRow`), collapsible to a 24 pt rail. Behind the rows the
/// most threatening commander's art fades in with an inset red glow.
struct CommanderDamageColumn: View {
    @Bindable var session: GameSession
    let targetIdx: Int
    @Binding var open: Bool
    @Binding var overlay: SeatOverlay?
    let glass: Bool
    let threat: ThreatSource?
    let sizes: SeatPanel.Sizes
    @Environment(GameSettingsStore.self) private var settings
    @State private var threatArt = CommanderArtLoader()

    private var state: GameState { session.state }
    private var me: PlayerState { state.players[targetIdx] }
    private var showPlayer: Bool { settings.showPlayerNamesInCmdDamage.contains(me.playerId) }
    private var high: Bool { (state.commanderDamage[targetIdx] ?? [:]).values.contains { $0.fromCommander >= 21 || $0.fromPartner >= 21 } }

    var body: some View {
        HStack(spacing: 0) {
            if open {
                ZStack {
                    if let threat, threat.intensity > 0 {
                        if let img = threatArt.image {
                            Color.clear.overlay(Image(uiImage: img).resizable().scaledToFill()).clipped().opacity(threat.intensity * 0.28).allowsHitTesting(false)
                        }
                        Rectangle().fill(.clear).shadow(color: Color(red: 160/255, green: 0, blue: 0).opacity(threat.intensity * 0.65), radius: 12).allowsHitTesting(false)
                            .mask(Rectangle().stroke(lineWidth: 40))
                    }
                    VStack(spacing: 0) {
                            HStack(spacing: 4) {
                                Text("CMD DAMAGE").font(.system(size: sizes.label, weight: .semibold)).kerning(0.5).foregroundStyle(.secondary)
                                if high { Text("⚠").font(.system(size: sizes.label)).foregroundStyle(Theme.danger) }
                                Spacer()
                                Button(showPlayer ? "Player" : "CMD") { settings.toggleShowPlayerName(me.playerId) }
                                    .font(.system(size: 9, weight: .semibold)).buttonStyle(.bordered).controlSize(.mini)
                            }
                            .padding(.horizontal, 4).padding(.top, 3)
                        CenteredOrScrolling { compact in
                            VStack(spacing: compact ? SeatPanel.compactDrawerRowSpacing : SeatPanel.drawerRowSpacing) {
                                ForEach(state.players.indices.filter { $0 != targetIdx }, id: \.self) { src in
                                    CommanderDamageRow(session: session, targetIdx: targetIdx, sourceIdx: src, showPlayer: showPlayer, glass: glass, overlay: $overlay, sizes: sizes)
                                }
                            }
                            .padding(.bottom, 3)
                        }
                    }
                }
                .clipped()
                .task(id: threat?.commanderName) { if let n = threat?.commanderName { threatArt.load(n) } }
            }
            rail
        }
    }

    private var rail: some View {
        Button { open.toggle() } label: {
            Image(systemName: "chevron.right").font(.system(size: 16, weight: .semibold)).foregroundStyle(.secondary)
                .rotationEffect(.degrees(open ? 0 : 180))
                .frame(width: 24).frame(maxHeight: .infinity).contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

/// One opponent in the commander damage column: name (or player), `⚔` damage
/// you dealt them, their status badges, and `− n/21 +` for each of their
/// commanders. Tapping the name opens the commander snapshot.
struct CommanderDamageRow: View {
    @Bindable var session: GameSession
    let targetIdx: Int
    let sourceIdx: Int
    let showPlayer: Bool
    let glass: Bool
    @Binding var overlay: SeatOverlay?
    let sizes: SeatPanel.Sizes

    private var state: GameState { session.state }
    private var source: PlayerState { state.players[sourceIdx] }
    private var isActive: Bool { state.firstPlayerIdx != nil && state.currentPlayerIdx == sourceIdx }
    private var damage: CommanderDamage { state.commanderDamage[targetIdx, sourceIdx] }
    private var dealt: CommanderDamage { state.commanderDamage[sourceIdx, targetIdx] }

    var body: some View {
        VStack(spacing: 0) {
            StepperControl(value: damage.fromCommander, color: damage.fromCommander >= 21 ? Theme.danger : source.isEliminated ? .secondary : .primary,
                           max: 21, disableDec: source.isEliminated, glass: glass, size: sizes.stepper,
                           focus: .commanderDamage(sourceIdx: sourceIdx, partner: false), identifier: "s\(targetIdx)-cmd-\(sourceIdx)", overlay: $overlay,
                           onChange: { session.dispatch(.commanderDamageChange(targetIdx: targetIdx, sourceIdx: sourceIdx, isPartner: false, delta: $0)) }) {
                VStack(alignment: .leading, spacing: 1) {
                    HStack(spacing: 4) {
                        if isActive { Circle().fill(Color.accentColor).frame(width: 7, height: 7).shadow(color: .accentColor.opacity(0.7), radius: 2) }
                        Text(showPlayer ? source.playerName : source.commander.name)
                            .font(.system(size: sizes.source, weight: isActive ? .bold : .regular))
                            .foregroundStyle(source.isEliminated ? .secondary : isActive ? Color.accentColor : .secondary)
                            .strikethrough(source.isEliminated).lineLimit(1).truncationMode(.tail)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .accessibilityIdentifier("s\(targetIdx)-cmd-\(sourceIdx)-name")
                        Text("\u{2694}\u{FE0E}\(source.partner != nil ? "\(dealt.fromCommander)/\(dealt.fromPartner)" : "\(dealt.total)")")
                            .font(.system(size: sizes.source, weight: .black))
                            .foregroundStyle(dealt.total >= 21 ? Theme.danger : dealt.total > 0 ? Theme.dealtOrange : Color.secondary.opacity(0.5))
                            .fixedSize()
                    }
                    .contentShape(Rectangle())
                    .onTapGesture { overlay = .snapshot(sourceIdx: sourceIdx, partner: false) }
                    PlayerStatusBadges(player: source, size: sizes.badge, startingLife: state.startingLife, showPoison: !state.isTwoHeadedGiant, poisonDanger: state.isTwoHeadedGiant ? GameReducer.twoHeadedGiantPoisonThreshold : 10)
                }
            }
            if let partner = source.partner {
                StepperControl(value: damage.fromPartner, color: damage.fromPartner >= 21 ? Theme.danger : source.isEliminated ? .secondary : .primary,
                               max: 21, disableDec: source.isEliminated, glass: glass, size: sizes.stepper,
                               focus: .commanderDamage(sourceIdx: sourceIdx, partner: true), identifier: "s\(targetIdx)-cmd-\(sourceIdx)-partner", overlay: $overlay,
                               onChange: { session.dispatch(.commanderDamageChange(targetIdx: targetIdx, sourceIdx: sourceIdx, isPartner: true, delta: $0)) }) {
                    Text(partner.name).font(.system(size: sizes.source)).foregroundStyle(.secondary).strikethrough(source.isEliminated).lineLimit(1)
                        .contentShape(Rectangle())
                        .onTapGesture { overlay = .snapshot(sourceIdx: sourceIdx, partner: true) }
                }
            }
        }
    }
}

/// Status glyph row for a player (web `PlayerStatusBadges`): monarch, city's
/// blessing, initiative, then ♥life, tax, poison, energy, XP. Zero counters hide.
struct PlayerStatusBadges: View {
    let player: PlayerState
    var size: CGFloat = 10
    var startingLife = 40
    var showLife = true
    var showTax = true
    var showPoison = true
    var poisonDanger = 10

    var body: some View {
        FlowLayout(spacing: 5, rowSpacing: 1) {
            if player.isMonarch { ShimmerCrown(size: size, active: true).frame(width: size, height: size) }
            if player.hasCitysBlessing { CityGlyph(active: true).frame(width: size, height: size) }
            if player.hasInitiative { InitiativeGlyph().foregroundStyle(Theme.initiativeBlue).frame(width: size, height: size) }
            if showLife { Text("♥\(player.life)").font(.system(size: size, weight: .heavy)).foregroundStyle(Theme.lifeColor(player.life, startingLife: startingLife) ?? .accentColor) }
            if showTax && player.commanderTax > 0 {
                HStack(spacing: 2) { CounterGlyph(kind: .tax, size: size, taxValue: player.commanderTax); Text("\(player.commanderTax)").font(.system(size: size, weight: .heavy)).foregroundStyle(.orange) }
            }
            if showPoison && player.poison > 0 {
                HStack(spacing: 2) { CounterGlyph(kind: .poison, size: size, poison: player.poison, poisonDanger: poisonDanger); Text("\(player.poison)").font(.system(size: size, weight: .heavy)).foregroundStyle(player.poison >= poisonDanger ? Theme.danger : Theme.poisonGreen) }
            }
            if player.energy > 0 {
                HStack(spacing: 2) { CounterGlyph(kind: .energy, size: size); Text("\(player.energy)").font(.system(size: size, weight: .heavy)).foregroundStyle(Theme.energyCyan) }
            }
            if player.experience > 0 {
                HStack(spacing: 2) { CounterGlyph(kind: .xp, size: size); Text("\(player.experience)").font(.system(size: size, weight: .heavy)).foregroundStyle(Theme.gold) }
            }
        }
        .lineLimit(1)
    }
}

/// Right column of a seat: Commander Tax (and partner tax), Energy,
/// Experience, Poison. Collapses to a rail that shows a mini summary of the
/// non-zero counters.
struct CountersColumn: View {
    @Bindable var session: GameSession
    let idx: Int
    @Binding var open: Bool
    @Binding var overlay: SeatOverlay?
    let glass: Bool
    let poisonLethal: Int
    let sizes: SeatPanel.Sizes

    private var p: PlayerState { session.state.players[idx] }
    private var poisonProgress: Double { min(Double(p.poison) / Double(poisonLethal), 1) }
    private var blur: CGFloat { poisonProgress > 0 ? CGFloat(pow(poisonProgress, 2.5) * 1.5) : 0 }

    var body: some View {
        HStack(spacing: 0) {
            rail
            if open {
                VStack(alignment: .leading, spacing: 0) {
                    Text("COUNTERS").font(.system(size: sizes.label, weight: .semibold)).kerning(0.5).foregroundStyle(.secondary).padding(.horizontal, 6).padding(.top, 3)
                    CenteredOrScrolling { compact in
                        VStack(spacing: compact ? SeatPanel.compactDrawerRowSpacing : SeatPanel.drawerRowSpacing) {
                            row("Commander Tax", glyph: CounterGlyph(kind: .tax, size: sizes.source, taxValue: p.commanderTax), value: p.commanderTax, color: p.commanderTax > 0 ? .orange : .secondary, focus: .tax(partner: false)) {
                                session.dispatch(.commanderTaxChange(playerIdx: idx, delta: $0, isPartner: false))
                            }
                            if let partner = p.partner {
                                row(partner.name, glyph: CounterGlyph(kind: .tax, size: sizes.source, taxValue: p.partnerCommanderTax), value: p.partnerCommanderTax, color: p.partnerCommanderTax > 0 ? .orange : .secondary, focus: .tax(partner: true)) {
                                    session.dispatch(.commanderTaxChange(playerIdx: idx, delta: $0, isPartner: true))
                                }
                            }
                            row("Energy", glyph: CounterGlyph(kind: .energy, size: sizes.source), value: p.energy, color: p.energy > 0 ? Theme.energyCyan : .secondary, focus: .energy) {
                                session.dispatch(.energyChange(playerIdx: idx, delta: $0))
                            }
                            row("Experience", glyph: CounterGlyph(kind: .xp, size: sizes.source), value: p.experience, color: p.experience > 0 ? Theme.gold : .secondary, focus: .experience, xpGlow: true) {
                                session.dispatch(.experienceChange(playerIdx: idx, delta: $0))
                            }
                            row("Poison", glyph: CounterGlyph(kind: .poison, size: sizes.source, poison: p.poison, poisonDanger: poisonLethal), value: p.poison,
                                color: p.poison >= poisonLethal ? Theme.danger : p.poison > 0 ? Theme.poisonGreen : .secondary, focus: .poison, max: poisonLethal, pulse: p.poison == poisonLethal - 1) {
                                session.dispatch(.poisonChange(playerIdx: idx, delta: $0))
                            }
                        }
                        .padding(.horizontal, 2).padding(.bottom, 3)
                    }
                }
            }
        }
    }

    private func row(_ label: String, glyph: CounterGlyph, value: Int, color: Color, focus: FocusTarget, max: Int? = nil, pulse: Bool = false, xpGlow: Bool = false, onChange: @escaping (Int) -> Void) -> some View {
        StepperControl(value: value, color: color, max: max, reserveMax: max == nil, glass: glass, size: sizes.stepper, valueBlur: blur, focus: focus, identifier: "s\(idx)-\(focus.id)", overlay: $overlay, onChange: onChange) {
            HStack(spacing: 4) {
                glyph
                Text(label).font(.system(size: sizes.label)).foregroundStyle(.secondary).lineLimit(1).minimumScaleFactor(0.6)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .blur(radius: blur)
        }
        .modifier(PoisonPulse(active: pulse))
        .shadow(color: xpGlow && value > 0 ? Theme.gold.opacity(0.5 + 0.5 * min(Double(value) / 10, 1)) : .clear, radius: xpGlow && value > 0 ? 4 + 12 * min(Double(value) / 10, 1) : 0)
    }

    private var rail: some View {
        Button { open.toggle() } label: {
            VStack(spacing: 6) {
                if !open {
                    ForEach(miniSummary, id: \.0) { item in
                        VStack(spacing: 1) { item.1; Text(item.2).font(.system(size: 10, weight: .bold)).foregroundStyle(item.3) }
                    }
                }
                Image(systemName: "chevron.right").font(.system(size: 16, weight: .semibold)).foregroundStyle(.secondary)
                    .rotationEffect(.degrees(open ? 180 : 0))
                    .frame(maxHeight: .infinity)
            }
            .padding(.top, 6)
            .frame(width: 24).frame(maxHeight: .infinity).contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private var miniSummary: [(String, AnyView, String, Color)] {
        var items: [(String, AnyView, String, Color)] = []
        if p.commanderTax > 0 { items.append(("tax", AnyView(TaxMedallion(tax: p.commanderTax, size: 16)), "\(p.commanderTax)", .secondary)) }
        if p.partner != nil, p.partnerCommanderTax > 0 { items.append(("ptax", AnyView(TaxMedallion(tax: p.partnerCommanderTax, size: 16)), "\(p.partnerCommanderTax)", .secondary)) }
        if p.energy > 0 { items.append(("energy", AnyView(CounterGlyph(kind: .energy, size: 14)), "\(p.energy)", Theme.energyCyan)) }
        if p.experience > 0 { items.append(("xp", AnyView(CounterGlyph(kind: .xp, size: 14)), "\(p.experience)", Theme.gold)) }
        if p.poison > 0 { items.append(("poison", AnyView(CounterGlyph(kind: .poison, size: 11, poison: p.poison, poisonDanger: poisonLethal)), "\(p.poison)", p.poison >= poisonLethal ? Theme.danger : Theme.poisonGreen)) }
        return items
    }
}

/// Green flare in/out when poison sits one below lethal.
struct PoisonPulse: ViewModifier {
    @Environment(\.motionEnabled) private var motion
    let active: Bool
    func body(content: Content) -> some View {
        if active {
            TimelineView(.animation(minimumInterval: 1 / 20, paused: !motion)) { ctx in
                let p = (sin(ctx.date.timeIntervalSinceReferenceDate / 2.5 * 2 * .pi) + 1) / 2
                content.opacity(1 - 0.7 * p).scaleEffect(1 - 0.15 * p)
                    .shadow(color: Color(red: 0, green: 200/255, blue: 60/255).opacity(0.9 * (1 - p)), radius: 8 * (1 - p) + 2)
            }
        } else {
            content
        }
    }
}

/// Badges wrap onto further lines inside their column, like the web's
/// `flex-wrap`, instead of forcing the column wider.
struct FlowLayout: Layout {
    var spacing: CGFloat = 4
    var rowSpacing: CGFloat = 2

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowH: CGFloat = 0, maxX: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x > 0 && x + s.width > width { x = 0; y += rowH + rowSpacing; rowH = 0 }
            x += s.width + spacing
            rowH = max(rowH, s.height)
            maxX = max(maxX, x - spacing)
        }
        return CGSize(width: width == .infinity ? maxX : min(maxX, width), height: y + rowH)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x: CGFloat = 0, y: CGFloat = 0, rowH: CGFloat = 0
        for v in subviews {
            let s = v.sizeThatFits(.unspecified)
            if x > 0 && x + s.width > bounds.width { x = 0; y += rowH + rowSpacing; rowH = 0 }
            v.place(at: CGPoint(x: bounds.minX + x, y: bounds.minY + y), proposal: ProposedViewSize(s))
            x += s.width + spacing
            rowH = max(rowH, s.height)
        }
    }
}

/// Drawer rows sit vertically centred when they fit the drawer, and scroll
/// when the panel is too short for them.
struct CenteredOrScrolling<Content: View>: View {
    /// Builds the rows; `compact` asks for the tighter row gap, tried before
    /// giving up on centring and scrolling instead.
    @ViewBuilder let content: (_ compact: Bool) -> Content

    var body: some View {
        // The candidates are measured bare (a flexible frame would always
        // "fit"); the outer frame centres whichever one is chosen.
        ViewThatFits(in: .vertical) {
            content(false)
            content(true)
            ScrollView(.vertical) { content(true) }.scrollBounceBehavior(.basedOnSize)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
    }
}
