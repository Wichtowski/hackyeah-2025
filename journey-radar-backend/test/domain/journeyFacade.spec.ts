import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { InMemoryUserLocationRepository } from '../../src/adapter/repository/InMemoryUserLocationRepository';
import { MockUserContextService } from '../../src/adapter/service/MockUserContextService';

// Contract-aligned minimal types for expectations

type Station = { name: string };
type Delay = { time: number };
type Connection = { id: number; from: Station; to: Station };
type Incident = { connection: Connection };
type Route = { stations: Station[]; delay: Delay; incidents: Incident[] };
type Journey = { routes: Route[]; distance: number; duration: number };
type JourneyStartState = { route_index: number; position_in_route: number; updated_at: string };
type JourneyStartResponse = { journey_id: string; state: JourneyStartState };
type Coordinates = { longitude: number; latitude: number };
type Progress = { currentRoute: number; currentStage: number; currentConnection: Connection };
type JourneyProgress = { journeyId: string; routes: Route[]; progress: Progress; delay: Delay; firstStation: Station; lastStation: Station };

describe('Journey Facade Capabilities', () => {
  let facade: JourneyRadarCapabilities & {
    getJourney(origin: { station: Station }, destination: { station: Station }): Promise<Journey>;
    startJourney(journey: Journey): Promise<JourneyStartResponse>;
    getJourneyProgress(journeyId: string, coordinates: Coordinates): Promise<JourneyProgress>;
  };

  beforeEach(() => {
    const repository = new InMemoryIncidentReportRepository();
    const userLocationRepository = new InMemoryUserLocationRepository();
    const userContextService = new MockUserContextService(userLocationRepository);
    facade = new JourneyRadarFacade(repository, userContextService, userLocationRepository) as any;
  });

  it('getJourney returns Journey type', async () => {
    const origin = { station: { name: 'Rondo Matecznego' } };
    const destination = { station: { name: 'Wawel' } };

    // Implementation will compute, here we assert shape
    const journey = await facade.getJourney(origin, destination);

    expect(Array.isArray(journey.routes)).toBe(true);
    expect(typeof journey.distance).toBe('number');
    expect(typeof journey.duration).toBe('number');
  });

  it('startJourney returns JourneyStartResponse with ISO updated_at', async () => {
    const journey: Journey = {
      routes: [
        { stations: [{ name: 'Rondo Matecznego' }, { name: 'Smolki' }], delay: { time: 2 }, incidents: [] },
        { stations: [{ name: 'Smolki' }, { name: 'Wawel' }], delay: { time: 3 }, incidents: [] }
      ],
      distance: 10,
      duration: 30
    };

    const response = await facade.startJourney(journey);

    expect(typeof response.journey_id).toBe('string');
    expect(response.state.route_index).toBe(0);
    expect(response.state.position_in_route).toBe(0);
    expect(new Date(response.state.updated_at).toISOString()).toBe(response.state.updated_at);
  });

  it('getJourneyProgress returns JourneyProgress with journeyId and first/last stations', async () => {
    const journey: Journey = {
      routes: [
        { stations: [{ name: 'Rondo Matecznego' }, { name: 'Smolki' }], delay: { time: 2 }, incidents: [] },
        { stations: [{ name: 'Smolki' }, { name: 'Wawel' }], delay: { time: 3 }, incidents: [] }
      ],
      distance: 10,
      duration: 30
    };

    const start = await facade.startJourney(journey);

    const progress = await facade.getJourneyProgress(start.journey_id, { longitude: 0, latitude: 0 });

    expect(progress.journeyId).toBe(start.journey_id);
    expect(progress.firstStation.name).toBe('Rondo Matecznego');
    expect(progress.lastStation.name).toBe('Wawel');
    expect(typeof progress.progress.currentRoute).toBe('number');
    expect(typeof progress.progress.currentStage).toBe('number');
    expect(progress.progress.currentConnection.from.name).toBeDefined();
    expect(progress.progress.currentConnection.to.name).toBeDefined();
  });
});
