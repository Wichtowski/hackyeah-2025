# hackyeah-2025

Full-stack monorepo (mobile + backend + shared SDK) used for the Journey Radar prototype / HackYeah 2025.

## Contents
- Frontend (Expo / React Native) – `journey-radar`
- Backend (Express + Jest tests) – `journey-radar-backend`
- Shared TypeScript SDK (axios wrapper) – `sdk`

The app includes an end‑to‑end health check flow (`GET /api/health`) surfaced in the mobile UI via the `ApiHealthButton` component and consumed through the `@journey-radar/sdk` package.

---
## 1. Repository Structure
```
/ (root)
  package.json (npm workspaces + scripts)
  journey-radar/              # Expo app (React Native + Web)
  journey-radar-backend/      # Express server (port 3000)
  sdk/                        # Shared TS SDK published locally via workspace
```
Workspaces are declared in the root `package.json`; `npm install` automatically builds the SDK via a root `postinstall` script.

---
## 2. Prerequisites
| Tool | Recommended |
|------|-------------|
| Node.js | 20.x LTS (>=18 should work) |
| npm | 10+ |
| Expo Go app (device) | Latest from App / Play Store |
| iOS / Android tooling | (Optional) Xcode / Android Studio for simulators |

Check versions:
```bash
node -v
npm -v
```

---
## 3. Quick Start (5‑minute path)
```bash
# 1. Install dependencies (builds SDK automatically)
npm install

# 2. Start backend (port 3000)
npm run dev:backend
# -> http://localhost:3000/api/health should return JSON

# 3. Start the frontend (Expo dev server)
# From root you can now use:
npm run dev:frontend
# (Equivalent to: cd journey-radar && npm run start)
# In the Expo CLI press: w (web) | i (iOS sim) | a (Android emulator) | scan QR for device
```
The Home tab shows an API button; press it to run the health check. A green dot = success.

---
## 4. Detailed Setup & Commands
### 4.1 Install & Bootstrap
```bash
npm install
```
This will:
1. Install all workspace dependencies.
2. Trigger `postinstall` -> `build:sdk` (compiles `sdk/src` to `sdk/dist`).

### 4.2 Building / Rebuilding the SDK Manually
```bash
npm run build:sdk
```
Outputs to: `sdk/dist` (consumed by the frontend via workspace resolution).

### 4.3 Backend – Development Server
```bash
npm run dev:backend
```
- Starts Express with `ts-node-dev` on `http://localhost:3000`.
- Health endpoint: `GET /api/health` returns JSON `{ "message": "ok from backend" }` and a header `x-health-check: <ISO_TIMESTAMP>`.

Curl example:
```bash
curl -i http://localhost:3000/api/health
```
Expected response (trimmed):
```
HTTP/1.1 200 OK
x-health-check: 2025-10-04T15:59:04.673Z
Content-Type: application/json; charset=utf-8

{"message":"ok from backend"}
```

### 4.4 Frontend – Expo App
You can launch from the root or inside the workspace:
```bash
# Root convenience script
npm run dev:frontend

# Or manually
cd journey-radar
npm run start   # alias for: npx expo start
```
Choose a platform:
- Press `w` for web (runs at something like http://localhost:8081 / 19006 depending on Expo version).
- Press `i` for iOS simulator (macOS only, requires Xcode).
- Press `a` for Android emulator.
- Scan the QR code in Expo Go for a physical device (make sure the device and your computer share the same LAN).

### 4.5 Environment Variables (Frontend)
The Expo app reads the following at runtime (must be prefixed with `EXPO_PUBLIC_` to be exposed):

| Variable | Purpose | Example |
|----------|---------|---------|
| `EXPO_PUBLIC_API_URL` | Base backend origin (without `/api` or with) | `http://192.168.0.42:3000` |
| `EXPO_PUBLIC_API_DEBUG` | Enable verbose SDK request/response logs (`1` = on) | `1` |

Set before starting Expo, e.g.:
```bash
EXPO_PUBLIC_API_URL=http://192.168.0.42:3000 \
EXPO_PUBLIC_API_DEBUG=1 \
npx expo start
```
`ApiHealthButton` normalizes the value and ensures `/api` suffix exists.

### 4.6 Environment Variables (Backend)
| Variable | Purpose | Default |
|----------|---------|---------|
| `CORS_ORIGINS` | Comma-separated additional allowed origins | (none) |
| (not yet configurable) `PORT` | Server port (currently fixed) | `3000` |

Example:
```bash
CORS_ORIGINS=http://localhost:19006,http://localhost:8081 npm run dev:backend
```
The server logs allowed origins on startup.

---
## 5. Using the SDK
```ts
import { apiClient, configureApi, enableApiDebug } from '@journey-radar/sdk';

configureApi({ baseURL: 'http://localhost:3000/api' });
enableApiDebug(true); // optional

const res = await apiClient.healthCheck();
console.log(res.message); // ok from backend
console.log(res.headerTimestamp); // value of x-health-check header
```
If you set `EXPO_PUBLIC_API_URL` the frontend auto-configures this for you.

---
## 6. Tests
Backend Jest tests:
```bash
npm run test:backend
```
Outputs 4 passing suites (health + CORS).

(There are currently no automated tests for the SDK or frontend; contributions welcome.)

---
## 7. Type Checking & Linting
SDK build (includes type check):
```bash
npm run build:sdk
```
Backend type check (no emit):
```bash
npx --workspace journey-radar-backend tsc --noEmit
```
Frontend type check:
```bash
cd journey-radar
npx tsc --noEmit
```
Lint (Expo recommended config):
```bash
cd journey-radar
npm run lint
```

---
## 8. Health Check Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Button stays gray / Idle | Backend not started | Run `npm run dev:backend` |
| Red status / Error alert | Wrong `EXPO_PUBLIC_API_URL` or network | Use correct LAN IP, verify curl works |
| CORS error in console | Origin not allowed | Add origin via `CORS_ORIGINS` env var |
| SDK logs missing | Debug not enabled | Set `EXPO_PUBLIC_API_DEBUG=1` |
| Using device, request fails | Phone not on same Wi-Fi / firewall | Ensure same network; avoid VPN isolation |

---
## 9. Common Workflows
### Re-point frontend to machine LAN IP
Find your IP:
```bash
ipconfig getifaddr en0   # macOS (Wi-Fi)
```
Start backend (already listening on all interfaces if using default):
```bash
npm run dev:backend
```
Start Expo with env:
```bash
EXPO_PUBLIC_API_URL=http://<LAN_IP>:3000 npx expo start
```
Press health button -> should go green.

### Force rebuild after SDK edits
```bash
npm run build:sdk
# Restart Expo (it resolves the built dist files)
```

---
## 10. Project Logs & Debugging Aids
- Backend logs health requests with a timestamp: `[health] OK <ISO>`.
- SDK debug mode prints `[SDK][request]`, `[SDK][response]`, `[SDK][error]` lines.
- CORS denials log: `[CORS] Blocked origin: ...`.

---
## 11. Future Enhancements (Ideas)
- Parametrize backend port via env variable.
- Add CI (lint + test + type check) workflow.
- Extend SDK with more endpoints & error normalization.
- Add frontend unit & component tests (e.g., react-testing-library / detox).
- Add E2E contract test verifying header presence.
- Publish SDK to a registry (private or public) with semantic versioning.

---
## 12. FAQ
**Q: The SDK can’t reach the backend on my device.**  
A: Ensure `EXPO_PUBLIC_API_URL` points to your computer’s LAN IP (not 127.0.0.1) and both are on same network.

**Q: I changed SDK code but frontend still uses old logic.**  
A: Run `npm run build:sdk` again (or re-run `npm install`), then restart Expo.

**Q: How do I see the health header in the app?**  
A: Enable debug (`EXPO_PUBLIC_API_DEBUG=1`) – the response log includes headers.

---
## 13. License
Internal / prototype usage. Add a proper license before open-sourcing.

---
## 14. Changelog (Selected)
- Added full-stack health check (Express route, SDK method, button component).
- Added CORS configuration with dynamic origins.
- Improved SDK interceptor typing to resolve TypeScript build error.
- Added root script `dev:frontend` for running Expo from monorepo root.

---
Happy hacking! ✨
