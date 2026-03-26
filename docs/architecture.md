# Architecture

## Overview

This project demonstrates OAuth2 Authorization Code Flow with PKCE for a mobile app and adds an educational mock SSO provider.

## Components

### Expo Mobile App (`apps/mobile-app`)

- Initiates login flow.
- Generates PKCE values (`code_verifier`, `code_challenge`).
- Opens browser to auth server login.
- Handles deep link callback (`myapp://callback`).
- Exchanges authorization code for access token.

### Next.js Auth Server (`apps/auth-server`)

- Hosts login UI (`/login`) and SSO simulation pages.
- Issues authorization codes at `/api/authorize`.
- Validates PKCE and issues token at `/api/token`.
- Simulates an external identity provider at `/api/sso-provider`.

## Responsibilities

- **Mobile app**: public OAuth client behavior.
- **Auth server**: authorization server behavior and token endpoint.
- **SSO provider simulation**: identity provider behavior without external APIs.

## Data flow

1. Mobile app sends `client_id`, `redirect_uri`, and `code_challenge`.
2. User authenticates via local form or SSO mock flow.
3. Auth server stores code metadata in memory and returns redirect with `code`.
4. Mobile app posts `code` + `code_verifier` to `/api/token`.
5. Auth server verifies PKCE and returns `access_token`.
