import { NextRequest, NextResponse } from "next/server";
import { createAuthorizationCode } from "@/lib/auth-store";

/**
 * Normalizes optional query values to strings.
 */
function getValue(value: string | null): string {
  return value?.trim() ?? "";
}

/**
 * OAuth authorize endpoint.
 * Input: client_id, redirect_uri, code_challenge and optional SSO user fields.
 * Output: Redirect to mobile callback URI with one-time authorization code.
 */
export async function GET(request: NextRequest) {
  const clientId = getValue(request.nextUrl.searchParams.get("client_id"));
  const redirectUri = getValue(request.nextUrl.searchParams.get("redirect_uri"));
  const codeChallenge = getValue(request.nextUrl.searchParams.get("code_challenge"));
  const ssoUserId = getValue(request.nextUrl.searchParams.get("sso_user_id"));
  const ssoUserEmail = getValue(request.nextUrl.searchParams.get("sso_user_email"));

  if (!clientId || !redirectUri || !codeChallenge) {
    return NextResponse.json(
      { error: "Missing required parameters: client_id, redirect_uri, code_challenge" },
      { status: 400 },
    );
  }

  // Save code + PKCE challenge in memory, then redirect user back to app callback URI.
  const code = createAuthorizationCode({ clientId, redirectUri, codeChallenge });
  console.log("Authorization code issued", {
    clientId,
    redirectUri,
    code,
    userId: ssoUserId || "local_user",
    email: ssoUserEmail || "local@example.com",
  });
  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);

  return NextResponse.redirect(redirectUrl);
}
