# @journey-radar/sdk

A lightweight TypeScript client for the Journey Radar backend.

## Installation
The package is part of the workspace monorepo; it's linked locally via npm workspaces.

## Quick start
```ts
import { apiClient, configureApi } from '@journey-radar/sdk';

// Configure the baseURL to include '/api'
configureApi({ baseURL: 'http://localhost:3000/api' });

const health = await apiClient.healthCheck();
console.log(health.message); // "ok from backend"
```

## ApiClient
All methods return typed promises and use the following HTTP verbs and paths.

- `healthCheck(): Promise<{ message: string }>`
  - GET `/health`

- `getJourney(origin: Origin, destination: Destination): Promise<Journey>`
  - GET `/journeys?origin=<name>&destination=<name>`

- `startJourney(journey: Journey): Promise<JourneyStartResponse>`
  - POST `/journeys/start`
  - Body: `Journey`

- `getJourneyStage(journeyId: string, coordinates: Coordinates): Promise<JourneyProgress>`
  - GET `/journeys/{journeyId}/progress?longitude=<num>&latitude=<num>`

## Types (excerpt)
```ts
export interface Station { name: string }
export interface Delay { time: number }
export interface Route { stations: Station[]; delay: Delay; incidents: Incident[] }
export interface Journey { routes: Route[]; distance: number; duration: number }
export interface Origin { station: Station }
export interface Destination { station: Station }
export interface Coordinates { longitude: number; latitude: number }
export interface JourneyStartState { route_index: number; position_in_route: number; updated_at: string }
export interface JourneyStartResponse { journey_id: string; state: JourneyStartState }
export interface Progress { currentRoute: number; currentStage: number; currentConnection: Connection }
export interface JourneyProgress { routes: Route[]; progress: Progress; delay: Delay; firstStation: Station; lastStation: Station }
```

## Examples
```ts
import { apiClient, configureApi } from '@journey-radar/sdk';

configureApi({ baseURL: 'http://192.168.0.42:3000/api' });

const journey = await apiClient.getJourney(
  { station: { name: 'Warsaw' } },
  { station: { name: 'Krakow' } }
);

const started = await apiClient.startJourney(journey);
const progress = await apiClient.getJourneyStage(started.journey_id, { longitude: 21.0, latitude: 52.2 });
```

## Development
Build the SDK:
```bash
npm --workspace sdk run build
```
Run SDK tests (compiles backend first):
```bash
npm --workspace sdk test
```

