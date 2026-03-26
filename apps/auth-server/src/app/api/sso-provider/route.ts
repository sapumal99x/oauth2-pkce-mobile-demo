import { NextRequest, NextResponse } from "next/server";

function getValue(value: string | null): string {
  return value?.trim() ?? "";
}

/**
 * Creates demo identity payload that mimics an external IdP response.
 * Input: none.
 * Output: mock user object with id and email.
 */
function createMockIdentity() {
  const id = `mock_user_${Date.now().toString(36)}`;
  const email = `${id}@example.com`;
  return { id, email };
}

/**
 * Mock external IdP endpoint.
 * Input: OAuth query values.
 * Output: Redirect to /api/authorize with SSO user identity included.
 */
export async function GET(request: NextRequest) {
  const clientId = getValue(request.nextUrl.searchParams.get("client_id"));
  const redirectUri = getValue(request.nextUrl.searchParams.get("redirect_uri"));
  const codeChallenge = getValue(request.nextUrl.searchParams.get("code_challenge"));

  if (!clientId || !redirectUri || !codeChallenge) {
    return NextResponse.json(
      { error: "Missing required parameters: client_id, redirect_uri, code_challenge" },
      { status: 400 },
    );
  }

  const user = createMockIdentity();
  console.log("User authenticated via SSO", { userId: user.id, email: user.email });

  const authorizeUrl = new URL("/api/authorize", request.nextUrl.origin);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("sso_user_id", user.id);
  authorizeUrl.searchParams.set("sso_user_email", user.email);

  return NextResponse.redirect(authorizeUrl);
}
