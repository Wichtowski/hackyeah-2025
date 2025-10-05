import { JourneyProgressService } from '../../src/domain/service/JourneyProgressService';
import { InMemoryJourneyProgressRepository } from '../../src/adapter/repository/InMemoryJourneyProgressRepository';
import { HARDCODED_STOPS } from '../../src/domain/model/hardcodedStops';

describe('JourneyProgressService - coordinate based progress', () => {
  const makeJourney = (...stationNames: string[]) => ({
    routes: [
      { stations: stationNames.map(name => ({ name })), delay: { time: 2 }, incidents: [] },
    ],
    distance: 1,
    duration: 2,
  });

  test('maps nearest hardcoded stop to current stage when present in journey', async () => {
    const repo = new InMemoryJourneyProgressRepository();
    const svc = new JourneyProgressService(repo);

    const a = HARDCODED_STOPS.find(s => s.name === 'Rondo Matecznego');
    const b = HARDCODED_STOPS.find(s => s.name === 'Smolki');
    if (!a || !b) throw new Error('Required hardcoded stops not found');

    const journey = makeJourney(a.name, b.name);

    const progress = await svc.computeProgress(journey as any, { longitude: a.longitude, latitude: a.latitude }, 'jid-1');

    expect(progress.progress.currentRoute).toBe(0);
    expect(progress.progress.currentStage).toBe(0);
    expect(progress.progress.currentConnection.from.name).toBe(a.name);
    expect(progress.progress.currentConnection.to.name).toBe(b.name);
  });

  test('falls back to nearest route station by distance when nearest stop not in route', async () => {
    const repo = new InMemoryJourneyProgressRepository();
    const svc = new JourneyProgressService(repo);

    const a = HARDCODED_STOPS[0];
    const b = HARDCODED_STOPS[1];
    const c = HARDCODED_STOPS[2];

    const journey = makeJourney(b.name, c.name);

    const progress = await svc.computeProgress(journey as any, { longitude: a.longitude, latitude: a.latitude }, 'jid-2');

    expect(progress.progress.currentRoute).toBe(0);
    expect(progress.progress.currentStage).toBeGreaterThanOrEqual(0);
    expect(progress.progress.currentStage).toBeLessThan(journey.routes[0].stations.length);
  });

  test('ensures last stage clamps to valid connection', async () => {
    const repo = new InMemoryJourneyProgressRepository();
    const svc = new JourneyProgressService(repo);

    const a = HARDCODED_STOPS[0];
    const b = HARDCODED_STOPS[1];

    const journey = makeJourney(a.name, b.name);

    const progress = await svc.computeProgress(journey as any, { longitude: 9999, latitude: 9999 }, 'jid-3');

    expect(progress.progress.currentStage).toBe(0);
    expect(progress.progress.currentConnection.from.name).toBe(a.name);
    expect(progress.progress.currentConnection.to.name).toBe(b.name);
  });
});


