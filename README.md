# OAuth2 Authorization Code + PKCE Demo

Full-stack learning project that simulates OAuth2 Authorization Code Flow with PKCE for mobile apps.

## Quick start

```bash
npm run install:all
npm run dev
```

This runs:

- Web auth server on `http://localhost:3000`
- Expo mobile development server

## Project layout

- `apps/auth-server`: Next.js App Router OAuth server + login UI
- `apps/mobile-app`: Expo React Native mobile client
- `docs`: setup, flow, PKCE background, and architecture docs

## Documentation

- `docs/README.md`: overview
- `docs/setup.md`: install/run/device setup
- `docs/flow.md`: step-by-step flow + Mermaid sequence diagram
- `docs/pkce.md`: PKCE concepts and project mapping
