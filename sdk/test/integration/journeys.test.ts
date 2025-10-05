import { apiClient, configureApi, enableApiDebug } from '../../src';
import type { Server } from 'http';

let server: Server;
let baseUrl: string;

// Helpers
const isISO = (s: string) => new Date(s).toISOString() === s;

describe('SDK integration - journeys endpoints', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const backend = require('../../../journey-radar-backend/dist/index.js');
    const app = backend.default || backend.app || backend;

    await new Promise<void>((resolve, reject) => {
      server = app.listen(0, () => resolve());
      server.on('error', reject);
    });

    const address = server.address();
    if (address && typeof address === 'object') {
      baseUrl = `http://127.0.0.1:${address.port}/api`;
    } else {
      throw new Error('Failed to determine server port');
    }

    configureApi({ baseURL: baseUrl });
    enableApiDebug(false);
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  test('getJourney uses GET with query string and returns Journey', async () => {
    const origin = { station: { name: 'A' } };
    const destination = { station: { name: 'C' } };

    const journey = await (apiClient as any).getJourney(origin, destination);

    expect(Array.isArray(journey.routes)).toBe(true);
    expect(typeof journey.distance).toBe('number');
    expect(typeof journey.duration).toBe('number');
  });

  test('startJourney uses POST with Journey body and returns JourneyStartResponse', async () => {
    const journey = {
      routes: [
        { stations: [{ name: 'A' }, { name: 'B' }], delay: { time: 0 }, incidents: [] },
        { stations: [{ name: 'B' }, { name: 'C' }], delay: { time: 0 }, incidents: [] }
      ],
      distance: 10,
      duration: 30
    };

    const response = await (apiClient as any).startJourney(journey);

    expect(typeof response.journey_id).toBe('string');
    expect(response.state.route_index).toBe(0);
    expect(response.state.position_in_route).toBe(0);
    expect(isISO(response.state.updated_at)).toBe(true);
  });

  test('getJourneyStage uses GET with query string and returns JourneyProgress', async () => {
    const journey = {
      routes: [
        { stations: [{ name: 'A' }, { name: 'B' }], delay: { time: 0 }, incidents: [] },
        { stations: [{ name: 'B' }, { name: 'C' }], delay: { time: 0 }, incidents: [] }
      ],
      distance: 10,
      duration: 30
    };

    const start = await (apiClient as any).startJourney(journey);
    const progress = await (apiClient as any).getJourneyStage(start.journey_id, { longitude: 21.0, latitude: 52.2 });

    expect(progress.journeyId).toBe(start.journey_id);
    expect(progress.firstStation).toBeDefined();
    expect(progress.lastStation).toBeDefined();
    expect(progress.progress).toBeDefined();
  });

  test('Errors surfaced as ApiError with status and message on validation failure', async () => {
    try {
      await (apiClient as any).getJourney({ station: { name: 'A' } }, { station: { name: '' } });
      fail('Expected error');
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(typeof err.message).toBe('string');
    }

    try {
      await (apiClient as any).getJourneyStage('j1', { longitude: Number.NaN, latitude: 52.2 });
      fail('Expected error');
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(typeof err.message).toBe('string');
    }
  });
});
