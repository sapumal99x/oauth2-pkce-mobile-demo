import { NextRequest, NextResponse } from "next/server";
import { consumeAuthorizationCode } from "@/lib/auth-store";
import { sha256Base64Url } from "@/lib/pkce";

type TokenRequest = {
  code?: string;
  code_verifier?: string;
};

/**
 * OAuth token endpoint.
 * Input: authorization code + code_verifier from mobile app.
 * Output: mock access token when PKCE validation succeeds.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as TokenRequest;
  const code = body.code?.trim();
  const codeVerifier = body.code_verifier?.trim();

  if (!code || !codeVerifier) {
    return NextResponse.json(
      { error: "Missing required parameters: code, code_verifier" },
      { status: 400 },
    );
  }

  const record = consumeAuthorizationCode(code);
  if (!record) {
    return NextResponse.json({ error: "Invalid or expired authorization code" }, { status: 400 });
  }

  // Validate PKCE proof: hash verifier and compare with original authorize challenge.
  const computedChallenge = sha256Base64Url(codeVerifier);
  if (computedChallenge !== record.codeChallenge) {
    return NextResponse.json({ error: "PKCE verification failed" }, { status: 400 });
  }
  console.log("PKCE validation success", { clientId: record.clientId, code });
  console.log("Token issued", { tokenType: "Bearer", code });

  return NextResponse.json({
    access_token: "mock_token",
    token_type: "Bearer",
  });
}
