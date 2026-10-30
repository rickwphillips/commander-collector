import AVFoundation
import AudioToolbox
import Foundation

/// The board's sounds. The four web mp3s ship in the bundle; the poison
/// drone and the firework loop are synthesised with AVAudioEngine like the
/// web's AudioContext graphs.
@MainActor
final class SoundService {
    static let shared = SoundService()

    var enabled = true { didSet { if !enabled { stopAll() } } }

    private var players: [String: AVAudioPlayer] = [:]
    private var loops: [String: AVAudioPlayer] = [:]
    private var engine: AVAudioEngine?
    private var droneNodes: [AVAudioNode] = []
    private var fireworkTask: Task<Void, Never>?

    private init() {
        try? AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [.mixWithOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    // MARK: One-shots

    /// The iPhone keyboard's key click, for every plus and minus on the board.
    func playClick() {
        guard enabled else { return }
        AudioServicesPlaySystemSound(1104)
    }

    func playD20() { play("d-20") }
    func playD6() { play("d-6") }
    func playCitysBlessingIntro() { play("citys_blessing_intro") }

    private func play(_ name: String, volume: Float = 1) {
        guard enabled, let url = Bundle.main.url(forResource: name, withExtension: "mp3") else { return }
        let player = players[name] ?? (try? AVAudioPlayer(contentsOf: url))
        guard let player else { return }
        players[name] = player
        player.volume = volume
        player.currentTime = 0
        player.play()
    }

    // MARK: Poison ambience (web usePoisonSound)

    /// Called with the highest poison on the board (eliminated seats excluded).
    /// Drone from 7 (quiet), bubbles from 8, louder at 9+.
    func setPoisonLevel(_ poison: Int) {
        guard enabled, poison >= 7 else { stopPoison(); return }
        let volume: Float = poison == 7 ? 0.18 : poison == 8 ? 0.35 : 1
        startDrone(volume: 0.12 * volume)
        if poison >= 8 {
            startLoop("poison_bubbles", volume: poison == 8 ? 0.35 : 0.7)
        } else {
            stopLoop("poison_bubbles")
        }
        if poison >= 9 { startStabs() } else { stabTask?.cancel(); stabTask = nil }
    }

    func stopPoison() {
        stopLoop("poison_bubbles")
        stopDrone()
        stabTask?.cancel(); stabTask = nil
    }

    // MARK: Violin stabs (poison 9+): a thin high sawtooth with a slow bow
    // attack, every 4 to 11 seconds, like the web's soprano stabs.

    private var stabTask: Task<Void, Never>?

    private func startStabs() {
        guard stabTask == nil else { return }
        stabTask = Task { @MainActor in
            try? await Task.sleep(for: .seconds(3 + Double.random(in: 0...4)))
            while !Task.isCancelled {
                playStab()
                try? await Task.sleep(for: .seconds(4 + Double.random(in: 0...7)))
            }
        }
    }

    private func playStab() {
        let sampleRate = 44_100.0
        let freq = 1100 + Double.random(in: 0...600)
        let duration = 1.2 + Double.random(in: 0...0.8)
        let frames = Int(sampleRate * (duration + 0.05))
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(frames)) else { return }
        buffer.frameLength = AVAudioFrameCount(frames)
        let data = buffer.floatChannelData![0]
        let trem = 7.5 + Double.random(in: 0...2)
        var phase = 0.0
        var bp = 0.0, lp = 0.0
        for i in 0..<frames {
            let t = Double(i) / sampleRate
            phase += freq / sampleRate; if phase > 1 { phase -= 1 }
            let saw = 2 * phase - 1
            // Crude band-pass around 1.4× the pitch: a low-pass minus a lower low-pass.
            let a1 = min(1, freq * 1.4 * 1.6 / sampleRate * 2 * .pi)
            let a2 = min(1, freq * 1.4 * 0.6 / sampleRate * 2 * .pi)
            lp += a1 * (saw - lp)
            bp += a2 * (saw - bp)
            let band = lp - bp
            let env = t < 0.45 ? t / 0.45 : t < duration - 0.5 ? 1 : max(0, (duration - t) / 0.5)
            let tremolo = 1 + 0.25 * sin(t * trem * 2 * .pi)
            data[i] = Float(band * env * tremolo * 0.07)
        }
        let engine = self.engine ?? AVAudioEngine()
        let player = AVAudioPlayerNode()
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        if !engine.isRunning { try? engine.start() }
        self.engine = engine
        player.scheduleBuffer(buffer, completionCallbackType: .dataPlayedBack) { @Sendable _ in
            Task { @MainActor in engine.detach(player) }
        }
        player.play()
    }

    private func startLoop(_ name: String, volume: Float) {
        if let p = loops[name] { p.volume = volume; if !p.isPlaying { p.play() }; return }
        guard let url = Bundle.main.url(forResource: name, withExtension: "mp3"), let p = try? AVAudioPlayer(contentsOf: url) else { return }
        p.numberOfLoops = -1
        p.volume = volume
        p.play()
        loops[name] = p
    }

    private func stopLoop(_ name: String) {
        loops[name]?.stop()
        loops[name] = nil
    }

    /// Low filtered sawtooth with a slow tremolo: the web's "ominous drone".
    private func startDrone(volume: Float) {
        if let engine, engine.isRunning, let mixer = droneNodes.last as? AVAudioMixerNode {
            mixer.outputVolume = volume
            return
        }
        let engine = AVAudioEngine()
        let format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 1)!
        let synth = DroneSynth(sampleRate: Float(format.sampleRate))
        // Rendered on the audio thread: the block must not be main-actor isolated.
        let render: AVAudioSourceNodeRenderBlock = { @Sendable _, _, frameCount, audioBufferList in
            synth.render(frameCount, audioBufferList)
        }
        let source = AVAudioSourceNode(renderBlock: render)
        let mixer = AVAudioMixerNode()
        engine.attach(source)
        engine.attach(mixer)
        engine.connect(source, to: mixer, format: format)
        engine.connect(mixer, to: engine.mainMixerNode, format: format)
        mixer.outputVolume = 0
        do {
            try engine.start()
        } catch { return }
        self.engine = engine
        droneNodes = [source, mixer]
        // Fade in over ~3.5 s like the web.
        Task { @MainActor in
            for step in 1...35 {
                try? await Task.sleep(for: .milliseconds(100))
                guard self.engine === engine else { return }
                mixer.outputVolume = volume * Float(step) / 35
            }
        }
    }

    private func stopDrone() {
        engine?.stop()
        engine = nil
        droneNodes = []
    }

    // MARK: City's Blessing fireworks (web useSounds)

    /// After the intro fanfare (~33 s), a firework whoosh + thud every 7 to 15 s.
    func setCitysBlessingActive(_ active: Bool) {
        guard active, enabled else { fireworkTask?.cancel(); fireworkTask = nil; return }
        guard fireworkTask == nil else { return }
        fireworkTask = Task { @MainActor in
            try? await Task.sleep(for: .seconds(33 + Double.random(in: 0...4)))
            while !Task.isCancelled {
                playFirework()
                try? await Task.sleep(for: .seconds(7 + Double.random(in: 0...8)))
            }
        }
    }

    private func playFirework() {
        // A short synthesised whoosh (rising band-passed noise) then a sine thud.
        let sampleRate = 44_100.0
        let duration = 0.95
        let frames = Int(sampleRate * duration)
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(frames)) else { return }
        buffer.frameLength = AVAudioFrameCount(frames)
        let data = buffer.floatChannelData![0]
        var bp: Float = 0
        var thudPhase: Double = 0
        for i in 0..<frames {
            let t = Double(i) / sampleRate
            var sample: Float = 0
            if t < 0.45 {
                let noise = Float.random(in: -1...1)
                let cutoff = Float(250 * pow(1800 / 250, t / 0.45))
                let alpha = cutoff / Float(sampleRate) * 2 * .pi
                bp += alpha * (noise - bp)
                let env = Float(t < 0.06 ? t / 0.06 : 1 - (t - 0.06) / 0.39)
                sample += (noise - bp) * env * 0.3
            }
            let bt = t - 0.37
            if bt >= 0 {
                let freq = 120 * pow(45 / 120, min(bt / 0.3, 1))
                thudPhase += freq / sampleRate
                let env = Float(exp(-bt * 9)) * (bt < 0.006 ? Float(bt / 0.006) : 1)
                sample += Float(sin(thudPhase * 2 * .pi)) * env * 0.9
            }
            data[i] = sample * 0.5
        }
        let engine = self.engine ?? AVAudioEngine()
        let player = AVAudioPlayerNode()
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        if !engine.isRunning { try? engine.start() }
        self.engine = engine
        player.scheduleBuffer(buffer, completionCallbackType: .dataPlayedBack) { @Sendable _ in
            Task { @MainActor in engine.detach(player) }
        }
        player.play()
    }

    private func stopAll() {
        players.values.forEach { $0.stop() }
        loops.keys.forEach(stopLoop)
        stopDrone()
        fireworkTask?.cancel(); fireworkTask = nil
        stabTask?.cancel(); stabTask = nil
    }
}

/// Low filtered sawtooth with a slow tremolo (the web's "ominous drone"),
/// generated on the audio render thread.
private final class DroneSynth: @unchecked Sendable {
    private var phase: Float = 0
    private var lfoPhase: Float = 0
    private var lp: Float = 0
    private let sampleRate: Float

    init(sampleRate: Float) { self.sampleRate = sampleRate }

    nonisolated func render(_ frameCount: AVAudioFrameCount, _ audioBufferList: UnsafeMutablePointer<AudioBufferList>) -> OSStatus {
        let buffers = UnsafeMutableAudioBufferListPointer(audioBufferList)
        guard let out = buffers[0].mData?.assumingMemoryBound(to: Float.self) else { return noErr }
        for i in 0..<Int(frameCount) {
            // Sawtooth at 58 Hz (Bb1), one-pole low-pass near 180 Hz, 0.12 Hz tremolo.
            phase += 58 / sampleRate
            if phase > 1 { phase -= 1 }
            let saw = 2 * phase - 1
            let alpha: Float = 180 / sampleRate * 2 * .pi
            lp += alpha * (saw - lp)
            lfoPhase += 0.12 / sampleRate
            if lfoPhase > 1 { lfoPhase -= 1 }
            let trem = 0.75 + 0.25 * sin(lfoPhase * 2 * .pi)
            out[i] = lp * trem
        }
        return noErr
    }
}
