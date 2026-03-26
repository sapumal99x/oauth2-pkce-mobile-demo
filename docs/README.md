# Project Documentation

This demo simulates OAuth2 Authorization Code Flow with PKCE for a mobile client.

It is designed for learning, so everything is intentionally simple: no database, no auth libraries, and an in-memory authorization code store.

## Architecture

- `apps/mobile-app`: Expo React Native client
- `apps/auth-server`: Next.js app acting as login UI + OAuth endpoints

See the sequence diagram in `docs/flow.md` for the end-to-end interaction.
