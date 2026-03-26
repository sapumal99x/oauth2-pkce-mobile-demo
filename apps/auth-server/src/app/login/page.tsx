type LoginPageProps = {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    code_challenge?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const clientId = params.client_id ?? "";
  const redirectUri = params.redirect_uri ?? "";
  const codeChallenge = params.code_challenge ?? "";

  return (
    <main style={{ maxWidth: 460, margin: "48px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Demo Login</h1>
      <p style={{ marginBottom: 20, lineHeight: 1.4 }}>
        This page simulates the user login step in OAuth2 Authorization Code Flow.
      </p>

      <form action="/api/authorize" method="GET" style={{ display: "grid", gap: 12 }}>
        <input name="client_id" type="hidden" value={clientId} />
        <input name="redirect_uri" type="hidden" value={redirectUri} />
        <input name="code_challenge" type="hidden" value={codeChallenge} />

        <label style={{ display: "grid", gap: 6 }}>
          Username
          <input name="username" defaultValue="demo_user" required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Password
          <input name="password" type="password" defaultValue="password" required />
        </label>

        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
