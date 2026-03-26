# Setup Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- Expo Go app on your phone (for real-device testing)

## Install dependencies

From the project root:

```bash
npm run install:all
```

## Run both apps together

From the project root:

```bash
npm run dev
```

This starts:

- Auth server: `http://localhost:3000`
- Expo dev server (interactive terminal UI)

## Test on a real device

1. Start both apps with `npm run dev`.
2. In `apps/mobile-app/.env`, set `EXPO_PUBLIC_AUTH_SERVER_URL` to your machine LAN IP (example: `http://192.168.1.10:3000`).
3. Ensure your phone and computer are on the same network.
4. Open Expo Go and launch the app from the QR code.
5. Tap login and complete the browser sign-in flow.
