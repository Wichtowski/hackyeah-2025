import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { InMemoryUserLocationRepository } from '../../src/adapter/repository/InMemoryUserLocationRepository';
import { MockUserContextService } from '../../src/adapter/service/MockUserContextService';
import { IncidentType } from '../../src/domain/model/IncidentReport';
import { Station } from '../../src/domain/model/Journey';

describe('JourneyRadarFacade (Domain Logic)', () => {
  let facade: JourneyRadarCapabilities;
  let repository: InMemoryIncidentReportRepository;
  let userLocationRepository: InMemoryUserLocationRepository;
  let userContextService: MockUserContextService;

  beforeEach(() => {
    repository = new InMemoryIncidentReportRepository();
    userLocationRepository = new InMemoryUserLocationRepository();
    userContextService = new MockUserContextService(userLocationRepository);
    facade = new JourneyRadarFacade(repository, userContextService, userLocationRepository);
  });

  it('should return a healthy status', async () => {
    const result = await facade.checkHealth();
    expect(result).toEqual({ status: 'OK', domain: 'JourneyRadar' });
  });

  // removed legacy planJourney test

  it('adds an incident and then builds a journey that includes the incident', async () => {
    const facadeImpl = facade as unknown as JourneyRadarFacade;

    const origin: { station: Station } = { station: { name: 'Rondo Matecznego' } };
    const destination: { station: Station } = { station: { name: 'Wawel' } };

    // Simulate user context to tie the incident to the specific route
    const userId = 'user_incident_journey_1';
    userContextService.setUserJourney(userId, {
      origin: origin.station.name,
      destination: destination.station.name,
      transportVehicleId: 'tram_test_1'
    });

    // Set a plausible location for the user so the report has coordinates
    userContextService.setUserLocation(userId, { longitude: 19.94, latitude: 50.06 });

    // Report an incident for this user/route
    const saved = await facadeImpl.reportIncident(userId, IncidentType.DELAY, 'Test delay A->B');
    expect(saved.id).toBeDefined();

    // Now compute a journey for the same origin/destination
    const journey = await facadeImpl.getJourney(origin, destination);

    expect(journey.routes.length).toBeGreaterThan(0);
    const route = journey.routes[0];
    expect(Array.isArray(route.incidents)).toBe(true);
    expect(route.incidents.length).toBeGreaterThan(0);

    // Ensure incident connections are within proposed route stations
    const stationNames = new Set(route.stations.map(s => s.name));
    for (const inc of route.incidents) {
      expect(stationNames.has(inc.connection.from.name)).toBe(true);
      expect(stationNames.has(inc.connection.to.name)).toBe(true);
    }
  });
});
