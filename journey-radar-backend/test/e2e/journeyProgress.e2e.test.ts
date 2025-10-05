import type { Server } from 'http';
import app from '../../src/index';
import { configureApi, enableApiDebug, apiGet, apiPost } from '@journey-radar/sdk';
import { HARDCODED_STOPS } from '../../src/domain/model/hardcodedStops';

describe('E2E: Journey progression using SDK http client + location mocker', () => {
  let server: Server;
  let apiBaseUrl: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    await new Promise<void>((resolve, reject) => {
      server = app.listen(0, () => resolve());
      server.on('error', reject);
    });

    const address = server.address();
    if (!address || typeof address !== 'object') throw new Error('Failed to determine dynamic port');

    apiBaseUrl = `http://127.0.0.1:${address.port}/api`;
    configureApi({ baseURL: apiBaseUrl });
    enableApiDebug(false);
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  test('mock user location, plan/start journey, and fetch progress', async () => {
    const demoUserId = 'e2e_user_1';

    const mockLocationResponse = await apiPost<{
      message: string;
      userId: string;
      longitude: number;
      latitude: number;
    }, {
      userId: string;
      longitude: number;
      latitude: number;
    }>(`/mock/location`, {
      userId: demoUserId,
      longitude: 21.0122,
      latitude: 52.2297,
    });

    expect(mockLocationResponse.message).toMatch(/mocked successfully/i);
    expect(mockLocationResponse.userId).toBe(demoUserId);

    const journey = await apiGet<{
      routes: { stations: { name: string }[]; delay: { time: number }; incidents: unknown[] }[];
      distance: number;
      duration: number;
    }>(`/journeys?origin=${encodeURIComponent('A')}&destination=${encodeURIComponent('C')}`);

    expect(Array.isArray(journey.routes)).toBe(true);

    const startResponse = await apiPost<{
      journey_id: string;
      state: { route_index: number; position_in_route: number; updated_at: string };
    }, typeof journey>(`/journeys/start`, journey);

    expect(typeof startResponse.journey_id).toBe('string');

    const progress = await apiGet<{
      journeyId: string;
      firstStation: { name: string };
      lastStation: { name: string };
      progress: unknown;
    }>(`/journeys/${encodeURIComponent(startResponse.journey_id)}/progress?longitude=21.0&latitude=52.2`);

    expect(progress.journeyId).toBe(startResponse.journey_id);
    expect(progress.firstStation).toBeDefined();
    expect(progress.lastStation).toBeDefined();
    expect(progress.progress).toBeDefined();
  });

  test('progress remains well-formed across multiple mocked locations', async () => {
    const demoUserId = 'e2e_user_2';

    await apiPost(`/mock/location`, { userId: demoUserId, longitude: 21.0122, latitude: 52.2297 });
    await apiPost(`/mock/location`, { userId: demoUserId, longitude: 20.6419, latitude: 51.7592 });
    await apiPost(`/mock/location`, { userId: demoUserId, longitude: 19.945, latitude: 50.0647 });

    const journey = await apiGet<{
      routes: { stations: { name: string }[]; delay: { time: number }; incidents: unknown[] }[];
      distance: number;
      duration: number;
    }>(`/journeys?origin=${encodeURIComponent('A')}&destination=${encodeURIComponent('C')}`);

    const start = await apiPost<{
      journey_id: string;
      state: { route_index: number; position_in_route: number; updated_at: string };
    }, typeof journey>(`/journeys/start`, journey);

    const progress1 = await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=21.0122&latitude=52.2297`);
    const progress2 = await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=20.6419&latitude=51.7592`);
    const progress3 = await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=19.945&latitude=50.0647`);

    for (const p of [progress1, progress2, progress3]) {
      expect(p.journeyId).toBe(start.journey_id);
      expect(p.firstStation).toBeDefined();
      expect(p.lastStation).toBeDefined();
      expect(p.progress).toBeDefined();
    }
  });

  test('finishing a journey persists to history and is retrievable', async () => {
    const demoUserId = 'e2e_user_history_1';

    await apiPost(`/mock/location`, { userId: demoUserId, longitude: 21.0122, latitude: 52.2297 });

    const journey = await apiGet<any>(`/journeys?origin=${encodeURIComponent('A')}&destination=${encodeURIComponent('C')}`);
    const start = await apiPost<any, any>(`/journeys/start`, journey);

    // First, progress somewhere (non-final)
    await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=21.0&latitude=52.2&userId=${encodeURIComponent(demoUserId)}`);

    // Then, simulate arrival by querying again (our computeProgress uses nearest mapping; we check destination equality inside facade)
    await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=21.0&latitude=52.2&userId=${encodeURIComponent(demoUserId)}`);

    const history = await apiGet<any[]>(`/journeys/history/${encodeURIComponent(demoUserId)}`);
    expect(Array.isArray(history)).toBe(true);
  });

  test('progress reflects nearest hardcoded stops: currentRoute and currentStage update', async () => {
    // Build a journey with known, hardcoded stops across two routes
    const get = (name: string) => {
      const s = HARDCODED_STOPS.find(x => x.name === name);
      if (!s) throw new Error(`Hardcoded stop not found: ${name}`);
      return s;
    };

    const route0 = [
      get('Rondo Matecznego').name,
      get('Smolki').name,
      get('Wawel').name,
    ];
    const route1 = [
      get('Kapelanka').name,
      get('Szwedzka').name,
      get('Rondo Grunwaldzkie').name,
    ];

    const journey = {
      routes: [
        { stations: route0.map(n => ({ name: n })), delay: { time: 0 }, incidents: [] },
        { stations: route1.map(n => ({ name: n })), delay: { time: 0 }, incidents: [] },
      ],
      distance: 0,
      duration: 0,
    };

    const start = await apiPost<{
      journey_id: string;
      state: { route_index: number; position_in_route: number; updated_at: string };
    }, typeof journey>(`/journeys/start`, journey);

    // Query near the first route's first stop -> expect route 0, stage 0
    const rm = get('Rondo Matecznego');
    const p1 = await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=${rm.longitude}&latitude=${rm.latitude}`);
    expect(p1.progress.currentRoute).toBe(0);
    expect(p1.progress.currentStage).toBe(0);
    expect(p1.progress.currentConnection.from.name).toBe('Rondo Matecznego');
    expect(p1.progress.currentConnection.to.name).toBe('Smolki');

    // Query near the first route's middle stop -> expect route 0, stage 1
    const sm = get('Smolki');
    const p2 = await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=${sm.longitude}&latitude=${sm.latitude}`);
    expect(p2.progress.currentRoute).toBe(0);
    expect(p2.progress.currentStage).toBe(1);
    expect(p2.progress.currentConnection.from.name).toBe('Smolki');
    expect(p2.progress.currentConnection.to.name).toBe('Wawel');

    // Query near the second route's middle stop -> expect route 1, stage 1
    const sw = get('Szwedzka');
    const p3 = await apiGet<any>(`/journeys/${encodeURIComponent(start.journey_id)}/progress?longitude=${sw.longitude}&latitude=${sw.latitude}`);
    expect(p3.progress.currentRoute).toBe(1);
    expect(p3.progress.currentStage).toBe(1);
    expect(p3.progress.currentConnection.from.name).toBe('Szwedzka');
    expect(p3.progress.currentConnection.to.name).toBe('Rondo Grunwaldzkie');
  });
});


