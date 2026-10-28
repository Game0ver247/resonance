import SwiftUI
import ScreenCaptureKit
import AVFoundation
import Network

final class WaveServer {
    private var listener: NWListener?
    private var clients: [UUID: NWConnection] = [:]
    private let queue = DispatchQueue(label: "resonance.wave-server")
    func start() throws {
        let options = NWProtocolWebSocket.Options()
        options.autoReplyPing = true
        let params = NWParameters.tcp
        params.defaultProtocolStack.applicationProtocols.insert(options, at: 0)
        params.requiredLocalEndpoint = .hostPort(host: "127.0.0.1", port: 49321)
        let listener = try NWListener(using: params)
        self.listener = listener
        listener.newConnectionHandler = { [weak self] connection in
            guard let self else { return }
            let id = UUID()
            self.clients[id] = connection
            connection.stateUpdateHandler = { [weak self] state in
                switch state { case .failed, .cancelled: self?.clients.removeValue(forKey: id); default: break }
            }
            connection.start(queue: self.queue)
            self.receive(connection, id: id)
        }
        listener.start(queue: queue)
    }
    private func receive(_ connection: NWConnection, id: UUID) {
        connection.receiveMessage { [weak self] _, _, _, error in
            guard let self else { return }
            if error != nil { self.clients.removeValue(forKey: id); connection.cancel(); return }
            self.receive(connection, id: id)
        }
    }
    func publish(_ levels: [Float], active: Bool) {
        let payload: [String: Any] = ["type": "levels", "bands": levels, "active": active]
        guard let data = try? JSONSerialization.data(withJSONObject: payload) else { return }
        queue.async { [weak self] in
            guard let self else { return }
            for connection in self.clients.values {
                guard case .ready = connection.state else { continue }
                let meta = NWProtocolWebSocket.Metadata(opcode: .text)
                let context = NWConnection.ContentContext(identifier: "levels", metadata: [meta])
                connection.send(content: data, contentContext: context, isComplete: true, completion: .idempotent)
            }
        }
    }
}

@MainActor final class AudioBridge: NSObject, ObservableObject, SCStreamOutput, SCStreamDelegate {
    static let shared = AudioBridge()
    @Published var status = "Starting local audio bridge…"
    @Published var active = false
    @Published var starting = false
    private let server = WaveServer()
    private var stream: SCStream?
    private let audioQueue = DispatchQueue(label: "resonance.spotify-audio")
    private var timer: Timer?
    private var latest = Array(repeating: Float(0), count: 48)
    override init() {
        super.init()
        do { try server.start(); status = "Ready · enable Spotify audio capture" }
        catch { status = "Could not open local port 49321. Quit other audio bridge copies and reopen." }
        timer = Timer.scheduledTimer(withTimeInterval: 0.06, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                self.server.publish(self.latest, active: self.active)
                self.latest = self.latest.map { $0 * 0.90 }
            }
        }
    }
    func start() {
        guard !active, !starting else { return }
        starting = true; status = "Requesting macOS audio capture access…"
        Task {
            defer { starting = false }
            do {
                let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
                guard let display = content.displays.first else { status = "No active display found."; return }
                let spotify = content.applications.filter { $0.bundleIdentifier == "com.spotify.client" }
                guard !spotify.isEmpty else { status = "Open Spotify on this Mac, then retry."; return }
                let filter = SCContentFilter(display: display, excludingApplications: content.applications.filter { $0.bundleIdentifier == Bundle.main.bundleIdentifier }, exceptingWindows: [])
                let config = SCStreamConfiguration()
                config.width = 2; config.height = 2
                config.minimumFrameInterval = CMTime(value: 1, timescale: 1)
                config.capturesAudio = true; config.excludesCurrentProcessAudio = true
                config.sampleRate = 48000; config.channelCount = 1
                let next = SCStream(filter: filter, configuration: config, delegate: self)
                try next.addStreamOutput(self, type: .audio, sampleHandlerQueue: audioQueue)
                try next.addStreamOutput(self, type: .screen, sampleHandlerQueue: audioQueue)
                try await next.startCapture()
                self.stream = next; active = true
                status = "Listening to Mac audio · play Spotify here"
            } catch {
                active = false
                status = "Allow Resonance Audio Bridge in System Settings → Privacy & Security → Screen & System Audio Recording, then retry. You may need to quit and reopen this helper."
            }
        }
    }
    func stop() {
        Task { try? await stream?.stopCapture(); stream = nil; active = false; latest = Array(repeating: 0, count: 48); status = "Audio capture stopped" }
    }
    nonisolated func stream(_ stream: SCStream, didStopWithError error: Error) {
        Task { @MainActor in self.stream = nil; self.active = false; self.status = "Capture stopped. Click Enable audio to retry." }
    }
    nonisolated func stream(_ stream: SCStream, didOutputSampleBuffer buffer: CMSampleBuffer, of type: SCStreamOutputType) {
        guard type == .audio, buffer.isValid, let block = CMSampleBufferGetDataBuffer(buffer) else { return }
        let byteCount = CMBlockBufferGetDataLength(block)
        guard byteCount >= 8 else { return }
        var bytes = [UInt8](repeating: 0, count: byteCount)
        guard CMBlockBufferCopyDataBytes(block, atOffset: 0, dataLength: byteCount, destination: &bytes) == noErr else { return }
        let samples = bytes.withUnsafeBytes { raw in
            (0..<min(raw.count / 4, 2048)).map { raw.loadUnaligned(fromByteOffset: $0 * 4, as: Float.self) }
        }
        let n = samples.count
        let windowed = samples.enumerated().map { Double($0.element) * (0.5 - 0.5 * cos(2 * Double.pi * Double($0.offset) / Double(n - 1))) }
        let levels: [Float] = (0..<48).map { band in
            // Goertzel probes, avoiding per-sample trigonometric functions.
            let frequency = 45.0 * pow(16000.0 / 45.0, Double(band) / 47.0)
            let coefficient = 2 * cos(2 * Double.pi * frequency / 48000.0)
            var a = 0.0, b = 0.0
            for sample in windowed { let next = sample + coefficient * a - b; b = a; a = next }
            let magnitude = sqrt(max(0, a * a + b * b - coefficient * a * b)) / Double(n)
            let level = (20 * log10(max(0.000001, magnitude)) + 72) / 60
            return Float(min(1, max(0, level.isFinite ? level : 0)))
        }
        Task { @MainActor in self.latest = zip(self.latest, levels).map { max($0 * 0.65, $1) } }
    }
}

struct BridgeView: View {
    @ObservedObject var bridge = AudioBridge.shared
    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
            Label("Resonance Audio Bridge", systemImage: "waveform").font(.headline)
            Text(bridge.status).font(.callout).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
            Text("Mac output audio is analyzed locally. Nothing is recorded or uploaded. Playback must be on this Mac; audio playing on your phone cannot be captured here.").font(.caption).foregroundStyle(.secondary)
            HStack {
                Button(bridge.starting ? "Connecting…" : (bridge.active ? "Stop audio" : "Enable audio")) { bridge.active ? bridge.stop() : bridge.start() }.disabled(bridge.starting)
                Button("Hide") { NSApp.hide(nil) }
                Spacer()
                Button("Quit") { NSApp.terminate(nil) }
            }
        }.padding(22).frame(width: 440).preferredColorScheme(.dark)
    }
}

@main struct BridgeApp: App {
    var body: some Scene {
        WindowGroup { BridgeView() }.defaultSize(width: 440, height: 220)
        MenuBarExtra("Resonance Audio", systemImage: "waveform") {
            Text(AudioBridge.shared.status)
            Button("Enable Spotify audio") { AudioBridge.shared.start() }
            Button("Stop capture") { AudioBridge.shared.stop() }
            Button("Quit Audio Bridge") { NSApp.terminate(nil) }
        }
    }
}
