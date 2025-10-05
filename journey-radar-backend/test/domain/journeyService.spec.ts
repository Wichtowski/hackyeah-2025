import { JourneyService } from '../../src/domain/service/JourneyService';
import { Journey } from '../../src/domain/model/Journey';
import { HARDCODED_STOPS } from '../../src/domain/model/hardcodedStops';

describe('JourneyService.computeJourney', () => {
  const service = new JourneyService();

  it('computes a journey based on source and destination hardcoded stops', async () => {
    const originName = 'Rondo Matecznego';
    const destinationName = 'Wawel';

    const origin = { station: { name: originName } } as const;
    const destination = { station: { name: destinationName } } as const;

    const journey: Journey = await service.computeJourney(origin, destination);

    expect(Array.isArray(journey.routes)).toBe(true);
    expect(journey.routes.length).toBeGreaterThanOrEqual(1);

    const route = journey.routes[0];
    expect(route.stations[0].name).toBe(originName);
    expect(route.stations[route.stations.length - 1].name).toBe(destinationName);

    // Should include plausible intermediate tram stops along the corridor
    const stationNames = route.stations.map(s => s.name);
    // Check that all stations are known hardcoded stops
    const hardcodedSet = new Set(HARDCODED_STOPS.map(s => s.name));
    expect(stationNames.every(n => hardcodedSet.has(n))).toBe(true);

    // Expect positive distance and duration
    expect(journey.distance).toBeGreaterThan(0);
    expect(journey.duration).toBeGreaterThan(0);
  });

  it('computes a journey with many intermediate stops (west to east corridor)', async () => {
    const originName = 'Bronowice Małe';
    const destinationName = 'Kombinat';

    const origin = { station: { name: originName } } as const;
    const destination = { station: { name: destinationName } } as const;

    const journey: Journey = await service.computeJourney(origin, destination);

    expect(journey.routes.length).toBeGreaterThanOrEqual(1);
    const route = journey.routes[0];
    expect(route.stations[0].name).toBe(originName);
    expect(route.stations[route.stations.length - 1].name).toBe(destinationName);

    // Expect at least 5 intermediate stations -> total >= 7
    expect(route.stations.length).toBeGreaterThanOrEqual(7);

    const names = route.stations.map(s => s.name);
    const hardcodedSet = new Set(HARDCODED_STOPS.map(s => s.name));
    expect(names.every(n => hardcodedSet.has(n))).toBe(true);
  });

  it('computes a journey with many intermediate stops (north to south corridor)', async () => {
    const originName = 'Górka Narodowa P+R';
    const destinationName = 'Nowy Bieżanów P+R';

    const origin = { station: { name: originName } } as const;
    const destination = { station: { name: destinationName } } as const;

    const journey: Journey = await service.computeJourney(origin, destination);

    expect(journey.routes.length).toBeGreaterThanOrEqual(1);
    const route = journey.routes[0];
    expect(route.stations[0].name).toBe(originName);
    expect(route.stations[route.stations.length - 1].name).toBe(destinationName);
    expect(route.stations.length).toBeGreaterThanOrEqual(7);

    const names = route.stations.map(s => s.name);
    const hardcodedSet = new Set(HARDCODED_STOPS.map(s => s.name));
    expect(names.every(n => hardcodedSet.has(n))).toBe(true);
  });

  it('computes a journey with many intermediate stops (northeast to southwest corridor)', async () => {
    const originName = 'Mistrzejowice';
    const destinationName = 'Czerwone Maki P+R';

    const origin = { station: { name: originName } } as const;
    const destination = { station: { name: destinationName } } as const;

    const journey: Journey = await service.computeJourney(origin, destination);

    expect(journey.routes.length).toBeGreaterThanOrEqual(1);
    const route = journey.routes[0];
    expect(route.stations[0].name).toBe(originName);
    expect(route.stations[route.stations.length - 1].name).toBe(destinationName);
    expect(route.stations.length).toBeGreaterThanOrEqual(7);

    const names = route.stations.map(s => s.name);
    const hardcodedSet = new Set(HARDCODED_STOPS.map(s => s.name));
    expect(names.every(n => hardcodedSet.has(n))).toBe(true);
  });
});


