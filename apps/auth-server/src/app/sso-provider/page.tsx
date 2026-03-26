type SsoProviderPageProps = {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    code_challenge?: string;
  }>;
};

/**
 * Mock identity provider UI.
 * Input: OAuth request values.
 * Output: Form submission to /api/sso-provider, which creates a mock user and redirects back.
 */
export default async function SsoProviderPage({ searchParams }: SsoProviderPageProps) {
  const params = await searchParams;
  const clientId = params.client_id ?? "";
  const redirectUri = params.redirect_uri ?? "";
  const codeChallenge = params.code_challenge ?? "";

  return (
    <main style={{ maxWidth: 460, margin: "48px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Mock SSO Provider</h1>
      <p style={{ marginBottom: 18, lineHeight: 1.4 }}>
        This page simulates an external identity provider like Google.
      </p>

      <form action="/api/sso-provider" method="GET" style={{ display: "grid", gap: 12 }}>
        <input name="client_id" type="hidden" value={clientId} />
        <input name="redirect_uri" type="hidden" value={redirectUri} />
        <input name="code_challenge" type="hidden" value={codeChallenge} />
        <button type="submit">Login with Google (Mock)</button>
      </form>
    </main>
  );
}
