import { createHash } from "crypto";

function toBase64Url(input: Buffer): string {
  // PKCE requires URL-safe base64 without padding.
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function sha256Base64Url(value: string): string {
  // The OAuth server recomputes challenge from the verifier at /api/token.
  const digest = createHash("sha256").update(value).digest();
  return toBase64Url(digest);
}
