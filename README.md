# hackyeah-2025

Minimal quick reference.

## 1. Install
```bash
npm install
```
(Automatically builds the SDK.)

## 2. Run Backend (API at http://localhost:3000/)
```bash
npm run dev:backend
```

## 3. Run Frontend (Expo)
```bash
npm run dev:frontend
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
