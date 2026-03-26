# Debugging Guide

## Deep linking debug checklist

- Verify scheme in `apps/mobile-app/app.json`:
  - `"scheme": "myapp"`
- Verify redirect URI generated in app:
  - `AuthSession.makeRedirectUri({ scheme: "myapp", path: "callback" })`
- Verify `/api/authorize` redirect target includes `code`.

## How to inspect logs

- Mobile logs:
  - Expo terminal output from `apps/mobile-app`
  - Look for:
    - `Starting OAuth2 PKCE login flow`
    - `Authorization code received in mobile callback`
- Server logs:
  - Next.js terminal output from `apps/auth-server`
  - Look for:
    - `SSO login started`
    - `User authenticated via SSO`
    - `Authorization code issued`
    - `PKCE validation success`

## Common issues

### Redirect not working

- Wrong `redirect_uri` or app scheme mismatch.
- Ensure callback is `myapp://callback`.

### PKCE mismatch

- `code_verifier` used at `/api/token` must match original `code_challenge`.
- Common cause: generating a second verifier before token exchange.

### Token not returned

- Authorization code may be expired or already consumed.
- Ensure `/api/token` body includes both `code` and `code_verifier`.
