type AuthorizationCodeRecord = {
  codeChallenge: string;
  clientId: string;
  redirectUri: string;
  createdAt: number;
};

const authorizationCodes = new Map<string, AuthorizationCodeRecord>();
const CODE_TTL_MS = 5 * 60 * 1000;

/**
 * Generates a compact random code for demo purposes.
 * Input: none.
 * Output: one-time authorization code string.
 */
function randomCode(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Saves authorization code metadata in memory.
 * Input: PKCE challenge, client id, and redirect URI.
 * Output: newly created authorization code.
 */
export function createAuthorizationCode(input: {
  codeChallenge: string;
  clientId: string;
  redirectUri: string;
}): string {
  const code = randomCode();
  authorizationCodes.set(code, {
    codeChallenge: input.codeChallenge,
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    createdAt: Date.now(),
  });
  return code;
}

/**
 * Reads and invalidates a previously issued authorization code.
 * Input: authorization code string.
 * Output: associated record, or null when invalid/expired.
 */
export function consumeAuthorizationCode(code: string): AuthorizationCodeRecord | null {
  const record = authorizationCodes.get(code);
  if (!record) {
    return null;
  }

  authorizationCodes.delete(code);

  if (Date.now() - record.createdAt > CODE_TTL_MS) {
    return null;
  }

  return record;
}
