import SwiftUI

/// What an in-panel overlay should show. A seat owns one of these at a time;
/// every control in the panel asks for its overlay through this binding so
/// the overlay renders at the panel root (rotated with the seat), never as a
/// system sheet.
enum SeatOverlay: Equatable, Identifiable {
    case stateMenu
    case rules(title: String, text: String)
    case focus(FocusTarget)
    case snapshot(sourceIdx: Int, partner: Bool)
    case preview(name: String)
    case concedeConfirm

    var id: String {
        switch self {
        case .stateMenu: "menu"
        case .rules(let t, _): "rules-\(t)"
        case .focus(let f): "focus-\(f.id)"
        case .snapshot(let s, let p): "snap-\(s)-\(p)"
        case .preview(let n): "preview-\(n)"
        case .concedeConfirm: "concede"
        }
    }
}

/// Which counter a focus modal edits.
enum FocusTarget: Equatable {
    case life
    case poison
    case energy
    case experience
    case tax(partner: Bool)
    case commanderDamage(sourceIdx: Int, partner: Bool)

    var id: String {
        switch self {
        case .life: "life"
        case .poison: "poison"
        case .energy: "energy"
        case .experience: "xp"
        case .tax(let p): "tax-\(p)"
        case .commanderDamage(let s, let p): "cmd-\(s)-\(p)"
        }
    }
}

/// Sizes for a stepper row; the web scales these to the viewport, the seat
/// panel picks a set from its own height.
struct StepperSize {
    var buttonFont: CGFloat = 20
    var valueFont: CGFloat = 18
    var buttonWidth: CGFloat = 32
    var buttonHeight: CGFloat = 30
    var valueWidth: CGFloat = 30
    var labelFont: CGFloat = 12
    static let compact = StepperSize(buttonFont: 17, valueFont: 15, buttonWidth: 28, buttonHeight: 26, valueWidth: 26, labelFont: 11)
}

/// The one counter primitive (web `StepperControl`): optional glyph + label,
/// `− value +` with long-press ±5 and a transient "+5"/"−5" tip, an optional
/// `/max` denominator (or a reserved blank so sibling rows align), and tap the
/// value to open the focus modal through `overlay`.
struct StepperControl<Label: View>: View {
    let value: Int
    var color: Color = .primary
    var max: Int? = nil
    var reserveMax = false
    var disableDec = false
    var glass = false
    var size: StepperSize = .init()
    var valueBlur: CGFloat = 0
    var focus: FocusTarget? = nil
    @Binding var overlay: SeatOverlay?
    let onChange: (Int) -> Void
    @ViewBuilder let label: () -> Label

    var body: some View {
        HStack(spacing: 4) {
            label()
                .frame(maxWidth: .infinity, alignment: .leading)
            StepButton(symbol: "minus", size: size, disabled: disableDec) { onChange($0 ? -5 : -1) }
            Text("\(value)")
                .font(.system(size: size.valueFont, weight: .bold).monospacedDigit())
                .foregroundStyle(color)
                .frame(minWidth: size.valueWidth)
                .blur(radius: valueBlur)
                .contentTransition(.numericText(value: Double(value)))
                .animation(.snappy(duration: 0.25), value: value)
                .contentShape(Rectangle())
                .onTapGesture { if let focus { overlay = .focus(focus) } }
            StepButton(symbol: "plus", size: size, disabled: false) { onChange($0 ? 5 : 1) }
            if let max {
                Text("/\(max)").font(.system(size: size.labelFont)).foregroundStyle(.secondary).fixedSize().layoutPriority(1)
            } else if reserveMax {
                Text("/00").font(.system(size: size.labelFont)).hidden().fixedSize()
            }
        }
        .padding(.horizontal, 4)
        .padding(.vertical, 2)
        .background(GlassBacking(active: glass))
    }
}

/// `−` / `+`: tap for ±1, hold 0.5 s for ±5 (then a "+5" tip for 0.7 s). A
/// completed hold swallows the trailing tap, as the web's guardClick does.
struct StepButton: View {
    let symbol: String
    var size: StepperSize = .init()
    var disabled = false
    /// true when the hold fired (±5), false for a tap (±1).
    let action: (Bool) -> Void
    @State private var tip = false
    @State private var fired = false
    @State private var tick = 0

    var body: some View {
        Image(systemName: symbol)
            .font(.system(size: size.buttonFont * 0.7, weight: .bold))
            .frame(width: size.buttonWidth, height: size.buttonHeight)
            .foregroundStyle(disabled ? Color.secondary.opacity(0.4) : Color.primary)
            .contentShape(Rectangle())
            .overlay(alignment: .top) {
                if tip {
                    Text(symbol == "minus" ? "−5" : "+5")
                        .font(.caption2.bold()).padding(.horizontal, 6).padding(.vertical, 2)
                        .background(Capsule().fill(Color(.systemGray)))
                        .foregroundStyle(.white)
                        .offset(y: -22)
                        .transition(.opacity)
                }
            }
            .onTapGesture {
                guard !disabled else { return }
                if fired { fired = false; return }
                action(false); tick += 1
            }
            .onLongPressGesture(minimumDuration: 0.5) {
                guard !disabled else { return }
                fired = true
                action(true); tick += 1
                withAnimation { tip = true }
                Task { try? await Task.sleep(for: .milliseconds(700)); withAnimation { tip = false } }
            }
            .sensoryFeedback(.increase, trigger: tick)
            .disabled(disabled)
    }
}

/// Enlarged counter editor (web `ControlFocusModal`): big value, ±1 buttons,
/// ±5 row. Rendered at the panel root so it faces the seat's player.
struct FocusModal: View {
    let title: String
    let value: Int
    var color: Color = .primary
    var disableDec = false
    let onChange: (Int) -> Void
    let onClose: () -> Void
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        ZStack {
            Color.black.opacity(0.6).onTapGesture(perform: onClose)
            VStack(spacing: 10) {
                HStack {
                    Text(title).font(.system(size: 15, weight: .bold))
                    Spacer()
                    Button(action: onClose) { Image(systemName: "xmark").font(.footnote.bold()) }.foregroundStyle(.secondary)
                }
                HStack(spacing: 14) {
                    bigButton("minus", disabled: disableDec) { onChange(-1) }
                    Text("\(value)")
                        .font(.system(size: 64, weight: .black).monospacedDigit())
                        .foregroundStyle(color)
                        .frame(minWidth: 90)
                        .contentTransition(.numericText(value: Double(value)))
                        .animation(.snappy, value: value)
                    bigButton("plus", disabled: false) { onChange(1) }
                }
                HStack(spacing: 14) {
                    Button("−5") { onChange(-5) }.disabled(disableDec).frame(width: 56, height: 36)
                    Text("±5").font(.caption).foregroundStyle(.secondary).frame(minWidth: 90)
                    Button("+5") { onChange(5) }.frame(width: 56, height: 36)
                }
                .font(.footnote.bold())
            }
            .padding(16)
            .frame(minWidth: 220)
            .background(RoundedRectangle(cornerRadius: 14).fill(Theme.menuBackground(scheme)).shadow(radius: 16))
            .padding(12)
        }
    }

    private func bigButton(_ symbol: String, disabled: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol).font(.system(size: 30, weight: .bold)).frame(width: 64, height: 64)
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .foregroundStyle(disabled ? Color.secondary.opacity(0.4) : Color.primary)
    }
}

/// Frosted panel behind a control cluster while a busy animation runs, so the
/// numbers stay readable (web `glassBackingSx`). Padding is constant so the
/// toggle causes no layout shift; only the fill fades.
struct GlassBacking: View {
    let active: Bool
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        RoundedRectangle(cornerRadius: 8)
            .fill(scheme == .dark ? Color(red: 16/255, green: 14/255, blue: 12/255).opacity(0.34) : Color(red: 250/255, green: 248/255, blue: 244/255).opacity(0.44))
            .background(RoundedRectangle(cornerRadius: 8).fill(.ultraThinMaterial))
            .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(scheme == .dark ? .black.opacity(0.4) : Color(hex: 0x5C5244).opacity(0.3), lineWidth: 1))
            .opacity(active ? 1 : 0)
            .animation(active ? .easeInOut(duration: 1.5) : .easeInOut(duration: 0.4), value: active)
            .allowsHitTesting(false)
    }
}
