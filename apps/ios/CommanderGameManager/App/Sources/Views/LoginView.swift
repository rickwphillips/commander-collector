import SwiftUI
import CommanderAPI

struct LoginView: View {
    @Environment(Session.self) private var session
    @State private var username = ""
    @State private var password = ""
    @State private var error: String?
    @State private var busy = false
    @State private var useLocalServer = false
    @State private var showJoin = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Username", text: $username)
                        .textContentType(.username)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                    SecureField("Password", text: $password)
                        .textContentType(.password)
                        .onSubmit(signIn)
                }
                Section {
                    Toggle("Use local PHP stack (localhost:8081)", isOn: $useLocalServer)
                        .onChange(of: useLocalServer) { _, local in
                            session.useServer(local ? CommanderServer.local : CommanderServer.production)
                        }
                } footer: {
                    Text("Your sign-in is the same account as the web app. The token is kept in the Keychain; the game itself never needs the network.")
                }
                if let error {
                    Section { Text(error).foregroundStyle(.red) }
                }
                Section {
                    Button { showJoin = true } label: { Label("Join a table nearby", systemImage: "qrcode.viewfinder") }
                } footer: {
                    Text("Sitting at an iPad running the game? Scan your seat's QR code; no sign-in needed.")
                }
                Section {
                    Button(action: signIn) {
                        HStack {
                            Text("Sign in")
                            if busy { Spacer(); ProgressView() }
                        }
                    }
                    .disabled(busy || username.isEmpty || password.isEmpty)
                }
            }
            .navigationTitle("Commander")
            .fullScreenCover(isPresented: $showJoin) { JoinTableView() }
            .onAppear { useLocalServer = session.server == CommanderServer.local }
        }
    }

    private func signIn() {
        guard !busy else { return }
        busy = true
        error = nil
        Task {
            defer { busy = false }
            do {
                try await session.signIn(username: username, password: password)
            } catch {
                self.error = error.localizedDescription
            }
        }
    }
}
