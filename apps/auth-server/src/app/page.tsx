export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: 16, lineHeight: 1.5 }}>
      <h1 style={{ marginBottom: 12 }}>OAuth2 PKCE Demo Server</h1>
      <p style={{ marginBottom: 16 }}>
        Use the Expo mobile app to start the login flow. The app opens
        <code> /login </code>, receives an authorization code via deep link, then exchanges it at
        <code> /api/token </code> with PKCE verification.
      </p>
      <p>
        Manual test URL pattern:
        <br />
        <code>
          /login?client_id=mobile-demo&redirect_uri=myapp%3A%2F%2Fcallback&code_challenge=...
        </code>
      </p>
    </main>
  );
}
