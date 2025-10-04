# @journey-radar/sdk

A lightweight TypeScript client for the Journey Radar backend.

## Installation
The package is part of the workspace monorepo; it's linked locally via npm workspaces.

## Usage
```ts
import { apiClient, configureApi } from '@journey-radar/sdk';

// (Optional) configure for a device or tunnel
configureApi({ baseURL: 'http://192.168.0.42:3000/api' });

const health = await apiClient.healthCheck();
console.log(health.message);
```

## API
### configureApi(options)
Recreate the internal Axios instance with a new base URL.

### apiClient.healthCheck()
Fetches `{ message: string }` from `/api/health`.

## Development
Build the SDK:
```bash
npm run build:sdk
```
The build runs automatically after `npm install` (postinstall hook).

