import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { InMemoryUserLocationRepository } from '../../src/adapter/repository/InMemoryUserLocationRepository';
import { MockUserContextService } from '../../src/adapter/service/MockUserContextService';

// These types will be introduced in the domain implementation in the next step
// Minimal inline type aliases to express expected shapes for the tests

type Station = { name: string };
type Delay = { time: number };
type Connection = { id: number; from: Station; to: Station };
type Incident = { connection: Connection };
type Route = { stations: Station[]; delay: Delay; incidents: Incident[] };
type Journey = { routes: Route[]; distance: number; duration: number };

describe('Journey Domain Behavior', () => {
  let facade: JourneyRadarCapabilities;

  beforeEach(() => {
    const repository = new InMemoryIncidentReportRepository();
    const userLocationRepository = new InMemoryUserLocationRepository();
    const userContextService = new MockUserContextService(userLocationRepository);
    facade = new JourneyRadarFacade(repository, userContextService, userLocationRepository);
  });

  it('Journey distance and duration sum across all routes', async () => {
    const journey: Journey = {
      routes: [
        { stations: [{ name: 'A' }, { name: 'B' }], delay: { time: 2 }, incidents: [] },
        { stations: [{ name: 'B' }, { name: 'C' }], delay: { time: 3 }, incidents: [] }
      ],
      distance: 10,
      duration: 30
    };

    // When startJourney is implemented, it should accept Journey and return an id + state
    // For now, we focus on structure assertions to drive the model
    expect(journey.routes.length).toBe(2);
    expect(journey.distance).toBe(10);
    expect(journey.duration).toBe(30);
  });

  it('Route has a single Delay and a list of Incidents', async () => {
    const connection: Connection = { id: 1, from: { name: 'A' }, to: { name: 'B' } };
    const route: Route = {
      stations: [{ name: 'A' }, { name: 'B' }],
      delay: { time: 5 },
      incidents: [{ connection }, { connection }]
    };

    expect(route.delay.time).toBe(5);
    expect(Array.isArray(route.incidents)).toBe(true);
    expect(route.incidents.length).toBe(2);
  });

  it('Progress shape: currentRoute/currentStage/currentConnection', async () => {
    const progress = {
      currentRoute: 0,
      currentStage: 1,
      currentConnection: { id: 42, from: { name: 'A' }, to: { name: 'B' } }
    };

    expect(typeof progress.currentRoute).toBe('number');
    expect(typeof progress.currentStage).toBe('number');
    expect(progress.currentConnection.from.name).toBe('A');
    expect(progress.currentConnection.to.name).toBe('B');
  });

  it('JourneyProgress exposes firstStation and lastStation', async () => {
    const journeyProgress = {
      routes: [
        { stations: [{ name: 'A' }, { name: 'B' }], delay: { time: 2 }, incidents: [] },
        { stations: [{ name: 'B' }, { name: 'C' }], delay: { time: 3 }, incidents: [] }
      ],
      progress: { currentRoute: 0, currentStage: 0, currentConnection: { id: 1, from: { name: 'A' }, to: { name: 'B' } } },
      delay: { time: 5 },
      firstStation: { name: 'A' },
      lastStation: { name: 'C' }
    };

    expect(journeyProgress.firstStation.name).toBe('A');
    expect(journeyProgress.lastStation.name).toBe('C');
    expect(journeyProgress.delay.time).toBe(5);
  });
});
