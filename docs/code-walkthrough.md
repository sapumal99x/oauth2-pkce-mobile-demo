# Code Walkthrough

## Mobile App

### Login button flow

- File: `apps/mobile-app/App.tsx`
- Function: `handleLogin()`
- Behavior:
  - Generates PKCE values.
  - Builds login URL with OAuth query params.
  - Opens browser session.
  - Parses callback URL and extracts `code`.
  - Exchanges code for token and stores it in `SecureStore`.

### PKCE generation

- File: `apps/mobile-app/src/pkce.ts`
- Functions:
  - `generateCodeVerifier(length)`
  - `generateCodeChallenge(codeVerifier)`
- Behavior:
  - Generates random verifier from RFC-compatible character set.
  - Hashes with SHA256 and converts to base64url challenge.

### Deep link handler

- File: `apps/mobile-app/App.tsx`
- In `handleLogin()` after `openAuthSessionAsync`:
  - Reads callback URL (`myapp://callback?...`).
  - Extracts authorization code from query params.

### Token exchange

- File: `apps/mobile-app/App.tsx`
- Function: `exchangeCodeForToken(code, codeVerifier)`
- Behavior:
  - Sends `POST /api/token`.
  - Handles non-200 responses as errors.
  - Returns token payload on success.

## Next.js Server

### `/api/authorize`

- File: `apps/auth-server/src/app/api/authorize/route.ts`
- Function: `GET(request)`
- Receives:
  - `client_id`
  - `redirect_uri`
  - `code_challenge`
  - optional `sso_user_id`, `sso_user_email`
- Stores:
  - authorization code metadata (in-memory map in `auth-store.ts`)
- Redirect:
  - sends browser to `${redirect_uri}?code=...`

### `/api/token`

- File: `apps/auth-server/src/app/api/token/route.ts`
- Function: `POST(request)`
- PKCE validation logic:
  - loads record for authorization code
  - computes `sha256Base64Url(code_verifier)`
  - compares computed challenge with stored challenge
- Token generation:
  - returns mock JSON token payload when validation succeeds
