import SwiftUI

/// Loads one commander image (art crop or full card) through CardArtService
/// and republishes it; the views below read it.
@Observable
@MainActor
final class CommanderArtLoader {
    private(set) var image: UIImage?
    private(set) var settled = false
    private(set) var name: String?
    private var full = false

    func load(_ name: String, full: Bool = false) {
        guard name != self.name || full != self.full else { return }
        self.name = name
        self.full = full
        image = nil
        settled = false
        let n = name
        Task {
            let img = full ? await CardArtService.shared.cardImage(for: n) : await CardArtService.shared.artCrop(for: n)
            guard n == self.name else { return }
            image = img
            settled = true
        }
    }
}

/// Header thumbnail: the art crop at the given height, 626:457 like Scryfall's
/// crops, fading in once it resolves. Renders a transparent slot until then so
/// the header never jumps.
struct CommanderArt: View {
    let name: String
    var height: CGFloat = 36
    var cornerRadius: CGFloat = 4
    var revealDelay: Double? = 0
    @State private var loader = CommanderArtLoader()

    var body: some View {
        ZStack {
            if let img = loader.image, let delay = revealDelay {
                Image(uiImage: img)
                    .resizable()
                    .scaledToFill()
                    .transition(.opacity.animation(.easeIn(duration: 0.7).delay(delay)))
            } else if loader.settled, revealDelay != nil {
                CardImageUnavailable(compact: true)
            }
        }
        .frame(width: height * 626 / 457, height: height)
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
        .task(id: name) { loader.load(name) }
        .animation(.easeIn(duration: 0.7), value: loader.image == nil)
    }
}

/// Faded card backdrop for a seat: art at 12 % opacity, or the commander name
/// diagonally at 16 % when there is none. `revealDelay` nil keeps it hidden
/// (no first player yet); a number reveals it after that delay with the web's
/// fade + slight scale-down, and `flash` punctuates the end of the fade.
struct CommanderBackdrop: View {
    let name: String
    let revealDelay: Double?
    var flash = false
    @State private var loader = CommanderArtLoader()
    @State private var shown = false
    @State private var flashing = false

    var body: some View {
        GeometryReader { geo in
            ZStack {
                if loader.settled {
                    if let img = loader.image {
                        Image(uiImage: img).resizable().scaledToFill()
                            .frame(width: geo.size.width, height: geo.size.height)
                            .opacity(0.12)
                    } else {
                        Text(name.uppercased())
                            .font(.system(size: min(geo.size.height * 0.2, 44), weight: .black))
                            .lineLimit(1)
                            .minimumScaleFactor(0.3)
                            .rotationEffect(.degrees(-28))
                            .opacity(0.16)
                            .frame(width: geo.size.width, height: geo.size.height)
                    }
                }
                if flash {
                    RadialGradient(colors: [Color(hex: 0xFFF1D6), Color(hex: 0xFFE6BC).opacity(0)], center: .init(x: 0.5, y: 0.45), startRadius: 0, endRadius: max(geo.size.width, geo.size.height) * 0.6)
                        .opacity(flashing ? 0.32 : 0)
                }
            }
            .opacity(shown ? 1 : 0)
            .scaleEffect(shown ? 1 : 1.06)
            .clipped()
            .allowsHitTesting(false)
        }
        .task(id: name) { loader.load(name) }
        .task(id: revealDelay) {
            guard let delay = revealDelay else { shown = false; return }
            try? await Task.sleep(for: .milliseconds(Int(delay * 1000)))
            withAnimation(.easeInOut(duration: 0.8)) { shown = true }
            guard flash else { return }
            // The flash (0.21 s up, 0.39 s down) ends with the fade, so the
            // art lands at full strength on the flash's last frame.
            try? await Task.sleep(for: .milliseconds(200))
            withAnimation(.easeOut(duration: 0.21)) { flashing = true }
            try? await Task.sleep(for: .milliseconds(210))
            withAnimation(.easeOut(duration: 0.39)) { flashing = false }
        }
    }
}

/// Full-panel card preview: the card image, tap to zoom 2.5× and scroll, tap
/// the backdrop to close. Rendered inside the seat so it faces its player.
struct CardPreviewOverlay: View {
    let name: String
    let onClose: () -> Void
    @State private var loader = CommanderArtLoader()
    @State private var zoomed = false

    var body: some View {
        ZStack {
            Color.black.opacity(0.88).onTapGesture(perform: onClose)
            if let img = loader.image {
                if zoomed {
                    ScrollView([.horizontal, .vertical]) {
                        Image(uiImage: img).resizable().scaledToFit()
                            .frame(width: img.size.width * 1.2, height: img.size.height * 1.2)
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                            .onTapGesture { zoomed = false }
                    }
                    .defaultScrollAnchor(.bottom)
                    .padding(8)
                } else {
                    Image(uiImage: img).resizable().scaledToFit()
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .padding(18)
                        .onTapGesture { zoomed = true }
                }
            } else if loader.settled {
                CardImageUnavailable(name: name).frame(maxWidth: 320).aspectRatio(63 / 88, contentMode: .fit).padding(18)
            } else {
                ProgressView().tint(.white.opacity(0.6))
            }
            VStack {
                HStack {
                    Spacer()
                    Button(action: onClose) {
                        Image(systemName: "xmark").font(.title3.bold()).padding(8)
                            .background(Circle().fill(.black.opacity(0.5)))
                            .foregroundStyle(.white.opacity(0.85))
                    }
                    .padding(8)
                }
                Spacer()
            }
        }
        .task(id: name) { loader.load(name, full: true) }
    }
}

/// What stands in for a card image Scryfall could not supply (web
/// `card-not-found.webp`): a card-shaped frame with the name, or just the
/// frame and a symbol in the compact thumbnail size.
struct CardImageUnavailable: View {
    var name: String? = nil
    var compact = false

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: compact ? 3 : 12)
                .fill(Color(red: 0.16, green: 0.14, blue: 0.12))
            RoundedRectangle(cornerRadius: compact ? 3 : 12)
                .strokeBorder(Color.white.opacity(0.18), style: StrokeStyle(lineWidth: compact ? 1 : 2, dash: compact ? [] : [8, 6]))
            if compact {
                Image(systemName: "photo").font(.system(size: 12)).foregroundStyle(.white.opacity(0.45))
            } else {
                VStack(spacing: 10) {
                    Image(systemName: "photo.on.rectangle.angled").font(.system(size: 40)).foregroundStyle(.white.opacity(0.4))
                    if let name { Text(name).font(.headline).foregroundStyle(.white.opacity(0.85)).multilineTextAlignment(.center).padding(.horizontal, 12) }
                    Text("No card image available").font(.caption).foregroundStyle(.white.opacity(0.5))
                }
            }
        }
    }
}
