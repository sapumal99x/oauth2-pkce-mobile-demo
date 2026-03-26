type AuthorizationCodeRecord = {
  codeChallenge: string;
  clientId: string;
  redirectUri: string;
  createdAt: number;
};

const authorizationCodes = new Map<string, AuthorizationCodeRecord>();
const CODE_TTL_MS = 5 * 60 * 1000;

function randomCode(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

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
