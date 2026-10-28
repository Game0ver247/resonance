import SwiftUI
import AppKit
import ScreenCaptureKit
import AVFoundation

struct Track {
    var title = "Your music, in motion."
    var artist = "Connect to Spotify to begin"
    var album = ""
    var uri = ""
    var artwork = ""
    var duration = 0.0
    var position = 0.0
    var playing = false
}

@MainActor final class Player: ObservableObject {
    @Published var track = Track()
    @Published var connected = false
    @Published var message = "Spotify plays. Resonance brings the atmosphere."
    @Published var image: NSImage?
    @Published var sampledAt = Date()
    @Published var commandError: String?
    @Published var sendingCommand = false
    func playbackPosition(at date: Date) -> Double {
        min(track.duration, max(0, track.position + (track.playing && connected ? max(0, date.timeIntervalSince(sampledAt)) : 0)))
    }
    private var timer: Timer?
    private var busy = false
    private let queue = DispatchQueue(label: "resonance.spotify")
    func connect() {
        guard NSWorkspace.shared.runningApplications.contains(where: { $0.bundleIdentifier == "com.spotify.client" }) else {
            NSWorkspace.shared.open(URL(string: "spotify:")!)
            message = "Start a song in Spotify, then connect again."
            return
        }
        poll()
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1.5, repeats: true) { [weak self] _ in Task { @MainActor in self?.poll() } }
    }
    private func run(_ source: String, done: @escaping (NSAppleEventDescriptor?, NSDictionary?) -> Void) {
        queue.async {
            var error: NSDictionary?
            let result = NSAppleScript(source: source)?.executeAndReturnError(&error)
            DispatchQueue.main.async { done(result, error) }
        }
    }
    func poll() {
        guard !busy else { return }
        guard NSWorkspace.shared.runningApplications.contains(where: { $0.bundleIdentifier == "com.spotify.client" }) else {
            connected = false; track.playing = false; message = "Spotify is closed. Open it and reconnect."; return
        }
        busy = true
        run("""
        tell application "Spotify"
            if player state is stopped then return {"", "", "", "", "", 0, 0, "stopped"}
            set t to current track
            return {name of t, artist of t, album of t, id of t, artwork url of t, duration of t, player position, player state as text}
        end tell
        """) { [weak self] result, error in
            guard let self else { return }
            self.busy = false
            if let error {
                self.connected = false
                self.track.playing = false
                let code = error["NSAppleScriptErrorNumber"] as? Int ?? 0
                self.message = code == -1743 ? "Allow Resonance in System Settings → Privacy & Security → Automation, then reconnect." : "Spotify connection failed. Open Spotify, start a track, then reconnect."
                return
            }
            guard let result, result.numberOfItems == 8 else { return }
            self.connected = true
            let value: (Int) -> String = { result.atIndex($0)?.stringValue ?? "" }
            if value(1).isEmpty { self.track = Track(); self.track.artist = "Start a song in Spotify"; self.message = "Connected · Waiting for music"; return }
            let previousArt = self.track.artwork
            self.track = Track(title: value(1), artist: value(2), album: value(3), uri: value(4), artwork: value(5), duration: (result.atIndex(6)?.doubleValue ?? 0) / 1000, position: result.atIndex(7)?.doubleValue ?? 0, playing: value(8) == "playing")
            self.sampledAt = Date()
            self.message = "Connected to Spotify on this Mac"
            if previousArt != self.track.artwork {
                self.image = nil
                let art = self.track.artwork
                if let url = URL(string: art), url.scheme == "https" {
                    Task { [weak self] in
                        guard let (data, _) = try? await URLSession.shared.data(from: url), let self, self.track.artwork == art else { return }
                        self.image = NSImage(data: data)
                    }
                }
            }
        }
    }
    enum PlaybackAction {
        case previous, toggle, next
        var script: String {
            switch self {
            case .previous: return "previous track"
            case .toggle: return "playpause"
            case .next: return "next track"
            }
        }
    }
    func command(_ action: PlaybackAction) {
        guard connected else { connect(); return }
        guard !sendingCommand else { return }
        sendingCommand = true
        commandError = nil
        let source = "tell application id \"com.spotify.client\"\n\(action.script)\nend tell"
        run(source) { [weak self] _, error in
            guard let self else { return }
            self.sendingCommand = false
            if let error {
                let detail = error["NSAppleScriptErrorMessage"] as? String ?? "Spotify rejected the playback command."
                self.commandError = detail
                return
            }
            // Spotify may acknowledge a skip before its current track has changed.
            Task { @MainActor [weak self] in
                try? await Task.sleep(nanoseconds: 350_000_000)
                self?.poll()
                try? await Task.sleep(nanoseconds: 700_000_000)
                self?.poll()
            }
        }
    }
    func openTrack() { NSWorkspace.shared.open(URL(string: track.uri.isEmpty ? "spotify:" : track.uri)!) }
}

@MainActor final class AudioMeter: NSObject, ObservableObject, SCStreamOutput, SCStreamDelegate {
    @Published var bands = Array(repeating: Float(0), count: 48)
    @Published var active = false
    @Published var status = "Ambient · independent animation"
    @Published var starting = false
    private var stream: SCStream?
    private let queue = DispatchQueue(label: "resonance.audio")
    func toggle() {
        if active { Task { await stop() }; return }
        guard !starting else { return }
        starting = true
        Task {
            defer { starting = false }
            do {
                let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
                guard let display = content.displays.first else { status = "No display available for audio capture."; return }
                let filter = SCContentFilter(display: display, excludingApplications: content.applications.filter { $0.bundleIdentifier == Bundle.main.bundleIdentifier }, exceptingWindows: [])
                let config = SCStreamConfiguration()
                config.width = 2; config.height = 2
                config.minimumFrameInterval = CMTime(value: 1, timescale: 1)
                config.capturesAudio = true
                config.excludesCurrentProcessAudio = true
                config.sampleRate = 48000; config.channelCount = 1
                let next = SCStream(filter: filter, configuration: config, delegate: self)
                try next.addStreamOutput(self, type: .audio, sampleHandlerQueue: queue)
                // Consume and discard video frames; only the audio samples are analyzed.
                try next.addStreamOutput(self, type: .screen, sampleHandlerQueue: queue)
                try await next.startCapture()
                stream = next; active = true; status = "System audio · live response"
            } catch {
                status = "Audio unavailable. Allow Screen & System Audio Recording in System Settings, then retry."
            }
        }
    }
    func stop() async {
        try? await stream?.stopCapture(); stream = nil; active = false
        bands = Array(repeating: 0, count: 48)
        status = "Ambient · independent animation"
    }
    nonisolated func stream(_ stream: SCStream, didStopWithError error: Error) {
        Task { @MainActor in self.active = false; self.stream = nil; self.status = "Audio capture stopped. Enable it to retry." }
    }
    nonisolated func stream(_ stream: SCStream, didOutputSampleBuffer buffer: CMSampleBuffer, of type: SCStreamOutputType) {
        guard type == .audio, buffer.isValid, let block = CMSampleBufferGetDataBuffer(buffer) else { return }
        let count = CMBlockBufferGetDataLength(block)
        guard count >= 4 else { return }
        var bytes = [UInt8](repeating: 0, count: count)
        guard CMBlockBufferCopyDataBytes(block, atOffset: 0, dataLength: count, destination: &bytes) == noErr else { return }
        let samples = bytes.withUnsafeBytes { raw -> [Float] in
            let n = min(raw.count / 4, 2048)
            return (0..<n).map { raw.loadUnaligned(fromByteOffset: $0 * 4, as: Float.self) }
        }
        guard !samples.isEmpty else { return }
        // Logarithmically spaced frequency probes with a Hann window.
        let n = samples.count
        let levels: [Float] = (0..<48).map { band in
            let frequency = 45.0 * pow(16000.0 / 45.0, Double(band) / 47.0)
            let omega = 2.0 * Double.pi * frequency / 48000.0
            var re = 0.0, im = 0.0
            for i in 0..<n {
                let window = 0.5 - 0.5 * cos(2.0 * Double.pi * Double(i) / Double(n - 1))
                let x = Double(samples[i]) * window
                re += x * cos(omega * Double(i)); im += x * sin(omega * Double(i))
            }
            return Float(min(1, max(0, (20 * log10(max(0.000001, sqrt(re * re + im * im) / Double(n))) + 75) / 60)))
        }
        Task { @MainActor in self.bands = zip(self.bands, levels).map { max($0 * 0.78, $1) } }
    }
}

struct Visualizer: View {
    let bands: [Float]
    let live: Bool
    let style: Int
    let intensity: Double
    let reduceMotion: Bool
    let tint: Color
    var body: some View {
        TimelineView(.animation(minimumInterval: reduceMotion ? 1 : 1.0 / 30)) { time in
            Canvas { context, size in
                let t = reduceMotion ? 0 : time.date.timeIntervalSinceReferenceDate
                if style == 1 {
                    let gap = 5.0
                    let width = max(1, (size.width - gap * 47) / 48)
                    for i in 0..<48 {
                        let phase: Double = Double(i) * 0.19 + t * 0.65
                        let modulation: Double = Double(i) * 0.08 - t * 0.3
                        let ambient: Double = 0.1 + 0.55 * abs(sin(phase)) * abs(cos(modulation))
                        let level: Double = live ? Double(bands[i]) : ambient
                        let h = max(3, level * size.height * 0.8 * intensity)
                        let rect = CGRect(x: Double(i) * (width + gap), y: (size.height - h) / 2, width: width, height: h)
                        context.fill(Path(roundedRect: rect, cornerRadius: width / 2), with: .linearGradient(Gradient(colors: [tint.opacity(0.9), tint.opacity(0.15)]), startPoint: CGPoint(x: 0, y: rect.minY), endPoint: CGPoint(x: 0, y: rect.maxY)))
                    }
                } else {
                    for layer in 0..<9 {
                        var path = Path()
                        for x in stride(from: 0.0, through: size.width, by: 3.0) {
                            let normalized = x / max(1, size.width)
                            let idx = min(47, Int(normalized * 47))
                            let amplitude = live ? Double(bands[idx]) : 0.45
                            let envelope = pow(sin(normalized * Double.pi), 1.3)
                            let wave: Double = sin(normalized * 10 + t * 0.5 + Double(layer) * 0.25)
                            let modulation: Double = cos(normalized * 4 - t * 0.25)
                            let height: Double = Double(size.height) * 0.38 * amplitude * intensity
                            let y: Double = Double(size.height) / 2 + wave * modulation * envelope * height + Double(layer - 4) * 5
                            if x == 0 { path.move(to: CGPoint(x: x, y: y)) } else { path.addLine(to: CGPoint(x: x, y: y)) }
                        }
                        context.stroke(path, with: .color(tint.opacity(0.16 + Double(layer) * 0.07)), lineWidth: layer == 4 ? 2 : 1)
                    }
                }
            }
        }
    }
}


@MainActor final class LyricsModel: ObservableObject {
    @Published var lines: [LyricLine] = []
    @Published var plain = ""
    @Published var status = "Connect Spotify to find lyrics"
    @Published var loading = false
    private var requestedKey = ""
    private var cache: [String: LyricsRecord] = [:]
    func load(_ track: Track) async {
        let key = "\(track.uri)|\(track.title)|\(track.artist)|\(track.album)|\(track.duration)"
        requestedKey = key
        lines = []; plain = ""; loading = false
        guard track.duration > 0 else { status = "Play a track to find lyrics"; return }
        if let record = cache[key] { apply(record); return }
        loading = true; status = "Finding lyrics…"
        var components = URLComponents(string: "https://lrclib.net/api/get")!
        components.queryItems = [URLQueryItem(name: "track_name", value: track.title), URLQueryItem(name: "artist_name", value: track.artist), URLQueryItem(name: "album_name", value: track.album), URLQueryItem(name: "duration", value: String(Int(track.duration.rounded())))]
        var request = URLRequest(url: components.url!)
        request.timeoutInterval = 20
        request.setValue("Resonance/1.1 (personal macOS dashboard)", forHTTPHeaderField: "User-Agent")
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard !Task.isCancelled, requestedKey == key else { return }
            loading = false
            guard let response = response as? HTTPURLResponse else { status = "Lyrics service unavailable"; return }
            if response.statusCode == 404 { status = "No lyrics found for this recording"; return }
            guard response.statusCode == 200 else { status = "Lyrics service unavailable · retry shortly"; return }
            let record = try JSONDecoder().decode(LyricsRecord.self, from: data)
            if cache.count > 40 { cache.removeAll() }
            cache[key] = record
            apply(record)
        } catch {
            guard !Task.isCancelled, requestedKey == key else { return }
            loading = false
            status = "Couldn’t load lyrics · check your connection and retry"
        }
    }
    private func apply(_ record: LyricsRecord) {
        loading = false
        if record.instrumental == true { status = "Instrumental · no lyrics"; return }
        lines = LRCParser.parse(record.syncedLyrics ?? "")
        if !lines.isEmpty { status = "Synced lyrics · LRCLIB"; return }
        plain = record.plainLyrics ?? ""
        status = plain.isEmpty ? "No lyrics available for this recording" : "Plain lyrics · timing unavailable · LRCLIB"
    }
}

struct LyricsPanel: View {
    @ObservedObject var model: LyricsModel
    @ObservedObject var player: Player
    let tint: Color
    @AppStorage("lyricsOffset") private var offset = 0.0
    var body: some View {
        VStack(spacing: 12) {
            if !model.lines.isEmpty {
                TimelineView(.animation(minimumInterval: 0.1)) { timeline in
                    let current = LRCParser.activeIndex(in: model.lines, at: player.playbackPosition(at: timeline.date) + offset)
                    let center = current ?? -1
                    VStack(spacing: 10) {
                        ForEach(-1...1, id: \.self) { relative in
                            let index = center + relative
                            let valid = model.lines.indices.contains(index)
                            let text = valid ? model.lines[index].text : ""
                            Text(text.isEmpty ? "♪" : text)
                                .font(.system(size: relative == 0 ? 25 : 17, weight: relative == 0 ? .semibold : .regular))
                                .foregroundStyle(relative == 0 ? tint : Color.white.opacity(0.35))
                                .opacity(valid || relative == 0 ? 1 : 0)
                                .multilineTextAlignment(.center).lineLimit(2)
                                .frame(maxWidth: .infinity, minHeight: relative == 0 ? 56 : 28)
                        }
                    }.frame(maxWidth: 780)
                }
            } else if !model.plain.isEmpty {
                ScrollView { Text(model.plain).font(.system(size: 18)).lineSpacing(8).multilineTextAlignment(.center).frame(maxWidth: .infinity).padding(.horizontal, 50) }
            } else {
                Spacer(minLength: 0)
                if model.loading { ProgressView().controlSize(.small) }
                Text(model.status).font(.system(size: 14)).foregroundStyle(.secondary)
                if !model.loading && player.track.duration > 0 {
                    Button("Retry lyrics") { Task { await model.load(player.track) } }.buttonStyle(.plain).foregroundStyle(tint)
                }
                Spacer(minLength: 0)
            }
            HStack(spacing: 12) {
                Link(model.lines.isEmpty ? model.status : "Synced lyrics · LRCLIB", destination: URL(string: "https://lrclib.net")!).foregroundStyle(.secondary).lineLimit(1)
                if !model.lines.isEmpty {
                    Button { offset = max(-5, offset - 0.25) } label: { Image(systemName: "minus.circle") }.help("Show lyrics 0.25 seconds later")
                    Button(String(format: "%+.2fs", offset)) { offset = 0 }.monospacedDigit().help("Reset lyric timing. Positive offsets show lyrics earlier.")
                    Button { offset = min(5, offset + 0.25) } label: { Image(systemName: "plus.circle") }.help("Show lyrics 0.25 seconds earlier")
                }
            }.font(.system(size: 10)).buttonStyle(.plain)
        }.padding(.horizontal, 55).padding(.vertical, 12).frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct ContentView: View {
    @StateObject private var player = Player()
    @StateObject private var audio = AudioMeter()
    @StateObject private var lyrics = LyricsModel()
    @AppStorage("showLyrics") private var showLyrics = true
    @AppStorage("visualStyle") private var style = 0
    @AppStorage("intensity") private var intensity = 1.0
    @AppStorage("colorTheme") private var theme = 0
    @AppStorage("focusMode") private var focus = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private var tint: Color { [Color(red: 0.68, green: 0.88, blue: 0.65), Color(red: 0.66, green: 0.72, blue: 1), Color(red: 1, green: 0.68, blue: 0.46)][max(0, min(2, theme))] }
    var body: some View {
        ZStack {
            Color(red: 0.045, green: 0.055, blue: 0.055)
            GeometryReader { geometry in
                if let image = player.image {
                    Image(nsImage: image).resizable().scaledToFill()
                        .frame(width: geometry.size.width, height: geometry.size.height)
                        .blur(radius: 90).opacity(0.10).clipped().allowsHitTesting(false)
                }
            }.allowsHitTesting(false)
            RadialGradient(colors: [tint.opacity(0.09), .clear], center: .center, startRadius: 20, endRadius: 530)
            VStack(spacing: 0) {
                HStack {
                    HStack(spacing: 10) { Image(systemName: "waveform").foregroundStyle(tint); Text("resonance").font(.system(size: 22, weight: .medium, design: .rounded)) }
                    Spacer()
                    Circle().fill(player.connected ? tint : .gray).frame(width: 6, height: 6)
                    Text(player.connected ? "SPOTIFY CONNECTED" : "YOUR LISTENING SPACE").font(.system(size: 10, weight: .medium, design: .monospaced)).tracking(1.8).foregroundStyle(.secondary)
                    Button { showLyrics.toggle() } label: { Label("Lyrics", systemImage: "quote.bubble").foregroundStyle(showLyrics ? tint : Color.secondary) }.help("Toggle synced lyrics")
                    Button { NSApp.keyWindow?.toggleFullScreen(nil) } label: { Image(systemName: "arrow.up.left.and.arrow.down.right") }.help("Toggle fullscreen")
                }.buttonStyle(.plain).padding(.horizontal, 38).padding(.top, 30)
                Spacer(minLength: 24)
                HStack(spacing: 38) {
                    Button { player.openTrack() } label: {
                        Group {
                            if let image = player.image { Image(nsImage: image).resizable().scaledToFill() }
                            else { ZStack { LinearGradient(colors: [tint.opacity(0.32), Color.black], startPoint: .topLeading, endPoint: .bottomTrailing); Image(systemName: "music.note").font(.system(size: 52, weight: .ultraLight)).foregroundStyle(tint) } }
                        }.frame(width: focus ? 140 : (showLyrics ? 220 : 280), height: focus ? 140 : (showLyrics ? 220 : 280)).clipShape(RoundedRectangle(cornerRadius: 12)).shadow(color: .black.opacity(0.4), radius: 25, y: 15)
                    }.buttonStyle(.plain).help("Open this track in Spotify")
                    VStack(alignment: .leading, spacing: 12) {
                        Text(player.track.playing ? "NOW PLAYING" : (player.connected ? "READY WHEN YOU ARE" : "MAKE ROOM FOR MUSIC")).font(.system(size: 10, weight: .medium, design: .monospaced)).tracking(3).foregroundStyle(tint)
                        Text(player.track.title).font(.system(size: focus ? 30 : 36, weight: .medium)).lineLimit(2)
                        Text(player.track.artist).font(.system(size: 19)).foregroundStyle(.secondary).lineLimit(1)
                        if !player.track.album.isEmpty { Text(player.track.album).font(.system(size: 12)).foregroundStyle(.tertiary).lineLimit(1) }
                    }
                    Spacer(minLength: 0)
                }.padding(.horizontal, 64)
                ZStack {
                    Visualizer(bands: audio.bands, live: audio.active, style: style, intensity: intensity, reduceMotion: reduceMotion, tint: tint).padding(.horizontal, 55).opacity(showLyrics ? 0.10 : 1).accessibilityLabel(audio.active ? "Live system audio visualizer" : "Ambient animation")
                    if showLyrics { LyricsPanel(model: lyrics, player: player, tint: tint) }
                }.frame(minHeight: 180, maxHeight: .infinity)
                VStack(spacing: 19) {
                    HStack(spacing: 15) {
                        Text(clock(player.track.position)).monospacedDigit()
                        ProgressView(value: min(player.track.position, max(1, player.track.duration)), total: max(1, player.track.duration)).tint(tint)
                        Text(clock(player.track.duration)).monospacedDigit()
                    }.font(.system(size: 10, design: .monospaced)).foregroundStyle(.secondary).frame(maxWidth: 500)
                    HStack(spacing: 30) {
                        Button { player.command(.previous) } label: { Image(systemName: "backward.end.fill").font(.system(size: 19)).frame(width: 48, height: 48).contentShape(Rectangle()) }.accessibilityLabel("Previous track").help("Previous track").disabled(!player.connected || player.sendingCommand)
                        Button { player.command(.toggle) } label: { Image(systemName: player.track.playing ? "pause.fill" : "play.fill").font(.system(size: 21)).frame(width: 55, height: 55).background(tint).foregroundStyle(.black).clipShape(Circle()) }.help(player.track.playing ? "Pause Spotify" : "Play Spotify").disabled(!player.connected)
                        Button { player.command(.next) } label: { Image(systemName: "forward.end.fill").font(.system(size: 19)).frame(width: 48, height: 48).contentShape(Rectangle()) }.accessibilityLabel("Next track").help("Next track").disabled(!player.connected || player.sendingCommand)
                    }.buttonStyle(.plain)
                    Text(player.commandError ?? player.message).font(.system(size: 11)).foregroundStyle(player.commandError == nil ? Color.secondary : Color.orange).multilineTextAlignment(.center)
                    if !player.connected { Button("Connect to Spotify") { player.connect() }.buttonStyle(.borderedProminent).tint(tint).foregroundStyle(.black) }
                }.padding(.bottom, 28)
                if !focus {
                    Divider().overlay(.white.opacity(0.03))
                    HStack(spacing: 22) {
                        Picker("Visual", selection: $style) { Text("Waves").tag(0); Text("Spectrum").tag(1) }.pickerStyle(.segmented).labelsHidden().frame(width: 175)
                        HStack(spacing: 8) { ForEach(0..<3) { i in Button { theme = i } label: { Circle().fill([Color(red: 0.68, green: 0.88, blue: 0.65), Color(red: 0.66, green: 0.72, blue: 1), Color(red: 1, green: 0.68, blue: 0.46)][i]).frame(width: 13, height: 13).padding(4).overlay(Circle().stroke(theme == i ? .white.opacity(0.7) : .clear)) }.buttonStyle(.plain).accessibilityLabel(["Sage", "Iris", "Amber"][i]) } }
                        HStack { Image(systemName: "waveform.path").foregroundStyle(.secondary); Slider(value: $intensity, in: 0.3...1.5).tint(tint).frame(width: 80).accessibilityLabel("Visual intensity") }
                        Spacer(minLength: 0)
                        Button(audio.starting ? "Connecting…" : (audio.active ? "Stop system audio" : "Use system audio")) { audio.toggle() }.disabled(audio.starting).help("React to all audio playing on your Mac. Requires Screen & System Audio Recording permission.")
                    }.padding(.horizontal, 32).padding(.top, 18)
                    Text(audio.status).font(.system(size: 10, design: .monospaced)).foregroundStyle(.secondary).padding(.top, 10).padding(.bottom, 17)
                }
            }
            VStack { Spacer(); HStack { Spacer(); Button { withAnimation { focus.toggle() } } label: { Image(systemName: focus ? "slider.horizontal.3" : "viewfinder") }.buttonStyle(.plain).help(focus ? "Show settings" : "Focus mode").padding(18) } }
        }.task(id: "\(player.track.uri)|\(player.track.title)|\(player.track.album)") { await lyrics.load(player.track) }
        .tint(tint).preferredColorScheme(.dark).frame(minWidth: 900, minHeight: 740)
    }
    private func clock(_ seconds: Double) -> String { let n = max(0, Int(seconds.isFinite ? seconds : 0)); return String(format: "%d:%02d", n / 60, n % 60) }
}

@main struct ResonanceApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }.windowStyle(.hiddenTitleBar).defaultSize(width: 1120, height: 860)
        .commands { CommandGroup(replacing: .newItem) {} }
    }
}
