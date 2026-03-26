import { NextRequest, NextResponse } from "next/server";
import { createAuthorizationCode } from "@/lib/auth-store";

function getValue(value: string | null): string {
  return value?.trim() ?? "";
}

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

  // Save code + PKCE challenge in memory, then redirect user back to app callback URI.
  const code = createAuthorizationCode({ clientId, redirectUri, codeChallenge });
  console.log("Authorization code generated", { clientId, redirectUri, code });
  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);

  return NextResponse.redirect(redirectUrl);
}
