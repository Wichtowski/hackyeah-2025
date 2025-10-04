# hackyeah-2025

Minimal quick reference.

## 1. Install
```bash
npm install
```
(Automatically builds the SDK.)

## 2. Run Backend (API at http://localhost:3000/api/health)
```bash
npm run dev:backend
```

## 3. Run Frontend (Expo)
```bash
npm run dev:frontend
```
Then press in the Expo CLI: w (web) | i (iOS) | a (Android) | scan QR (device).

## 4. Use On a Physical Device (LAN)
Find your machine LAN IP (macOS example):
```bash
ipconfig getifaddr en0
```
Start Expo pointing to backend:
```bash
EXPO_PUBLIC_API_URL=http://<LAN_IP>:3000 npm run dev:frontend
```

## 5. SDK Example
```ts
import { apiClient, configureApi } from '@journey-radar/sdk';
configureApi({ baseURL: 'http://localhost:3000/api' });
const res = await apiClient.healthCheck();
console.log(res.message);
```

## 6. Tests (Backend)
```bash
npm run test:backend
```

## 7. Rebuild SDK Manually (after editing sdk/src)
```bash
npm run build:sdk
```

## 8. Troubleshooting (Super Short)
| Issue | Fix |
|-------|-----|
| Health check fails | Ensure backend running (step 2) |
| Device can’t connect | Use LAN IP + env var (step 4) |
| CORS error | Add origin via CORS_ORIGINS env if needed |

That’s it. For anything deeper (linting, detailed env, future plans) reintroduce extended docs if required.
