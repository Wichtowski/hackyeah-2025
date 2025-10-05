import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { InMemoryUserLocationRepository } from '../../src/adapter/repository/InMemoryUserLocationRepository';
import { MockUserContextService } from '../../src/adapter/service/MockUserContextService';

describe('Incident propagation to active journeys', () => {
  it('updates route incidents for active journeys matching the reported route', async () => {
    const incidentRepo = new InMemoryIncidentReportRepository();
    const userLocationRepo = new InMemoryUserLocationRepository();
    const userContext = new MockUserContextService(userLocationRepo);

    const facade = new JourneyRadarFacade(incidentRepo, userContext, userLocationRepo) as any;

    const origin = { station: { name: 'Rondo Matecznego' } };
    const destination = { station: { name: 'Wawel' } };

    // Compute a journey and start a session
    const journey = await facade.getJourney(origin, destination);
    const started = await facade.startJourney(journey);

    // Mark the user's active journey so the incident is attached to this route
    const userId = 'user_propagation_1';
    userContext.setUserJourney(userId, { origin: origin.station.name, destination: destination.station.name, transportVehicleId: 'tram_X' });

    // Report an incident for the user
    const saved = await facade.reportIncident(userId, 'DELAY', 'Test delay incident');
    expect(saved.id).toBeDefined();

    // Now ask for progress, which returns stored journey with routes populated; expect incidents present
    const progress = await facade.getJourneyProgress(started.journey_id, { longitude: 19.94, latitude: 50.06 });
    const updatedJourneyRoutes = progress.routes;
    const matchingRoutes = updatedJourneyRoutes.filter((r: any) => r.stations[0].name === origin.station.name && r.stations[r.stations.length - 1].name === destination.station.name);

    expect(matchingRoutes.length).toBeGreaterThan(0);
    expect(matchingRoutes.some((r: any) => Array.isArray(r.incidents) && r.incidents.length > 0)).toBe(true);
  });
});


