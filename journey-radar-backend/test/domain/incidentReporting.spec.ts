import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { IncidentType } from '../../src/domain/model/IncidentReport';
import { MockUserContextService } from '../../src/adapter/service/MockUserContextService';

describe('Incident Reporting', () => {
  let facade: JourneyRadarFacade;
  let repository: InMemoryIncidentReportRepository;
  let userContextService: MockUserContextService;

  beforeEach(() => {
    repository = new InMemoryIncidentReportRepository();
    userContextService = new MockUserContextService();
    facade = new JourneyRadarFacade(repository, userContextService);
  });

  describe('reportIncident', () => {
    it('should save an incident report from a user with inferred context', async () => {
      const userId = 'user_123';

      // Set up user context
      userContextService.setUserLocation(userId, { longitude: 21.0122, latitude: 52.2297 });

      const result = await facade.reportIncident(userId, IncidentType.DELAY, 'Train is running 15 minutes late');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.incidentType).toBe(IncidentType.DELAY);
      expect(result.location.longitude).toBe(21.0122);
      expect(result.location.latitude).toBe(52.2297);
      expect(result.reporter.id).toBe(userId);
      expect(result.description).toBe('Train is running 15 minutes late');
    });

    it('should include active journey in incident report when user is on a journey', async () => {
      const userId = 'user_456';

      // Set up user context with active journey
      userContextService.setUserLocation(userId, { longitude: 21.0122, latitude: 52.2297 });
      userContextService.setUserJourney(userId, {
        origin: 'Warsaw Central',
        destination: 'Krakow Main',
        transportVehicleId: 'train_ic_1234'
      });

      const result = await facade.reportIncident(userId, IncidentType.ISSUES, 'Train has minor technical issues');

      expect(result.details.reportedOnRoute).toBeDefined();
      expect(result.details.reportedOnRoute?.origin).toBe('Warsaw Central');
      expect(result.details.reportedOnRoute?.destination).toBe('Krakow Main');
      expect(result.details.reportedOnRoute?.transportVehicleId).toBe('train_ic_1234');
    });

    it('should use default location when user location is not set', async () => {
      const userId = 'user_789';

      const result = await facade.reportIncident(userId, IncidentType.SEVERE_BLOCKER, 'Route blocked due to severe accident');

      expect(result.location).toBeDefined();
      expect(result.location.longitude).toBe(21.0122); // Default Warsaw location
      expect(result.location.latitude).toBe(52.2297);
    });

    it('should handle all three incident types', async () => {
      const incidents = [
        { incidentType: IncidentType.ISSUES, description: 'Minor technical issues' },
        { incidentType: IncidentType.DELAY, description: 'Running late' },
        { incidentType: IncidentType.SEVERE_BLOCKER, description: 'Route blocked' }
      ];

      for (const incident of incidents) {
        const result = await facade.reportIncident('user_test', incident.incidentType, incident.description);
        expect(result.incidentType).toBe(incident.incidentType);
        expect(result.description).toBe(incident.description);
      }
    });
  });

  describe('Repository operations', () => {
    it('should retrieve incident by id', async () => {
      const userId = 'user_123';
      const result = await facade.reportIncident(userId, IncidentType.DELAY);

      const found = await repository.findById(result.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(result.id);
    });

    it('should retrieve incidents by route', async () => {
      const userId1 = 'user_123';
      const userId2 = 'user_456';

      userContextService.setUserJourney(userId1, {
        origin: 'Warsaw',
        destination: 'Krakow',
        transportVehicleId: 'train_001'
      });

      userContextService.setUserJourney(userId2, {
        origin: 'Warsaw',
        destination: 'Krakow',
        transportVehicleId: 'train_002'
      });

      await facade.reportIncident(userId1, IncidentType.DELAY);
      await facade.reportIncident(userId2, IncidentType.ISSUES);

      const incidents = await repository.findByRoute('Warsaw', 'Krakow');
      expect(incidents).toHaveLength(2);
    });

    it('should retrieve incidents by location within radius', async () => {
      const userId1 = 'user_123';
      const userId2 = 'user_456';
      const userId3 = 'user_789';

      // Warsaw Central Station
      userContextService.setUserLocation(userId1, { longitude: 21.0122, latitude: 52.2297 });

      // Close to Warsaw (within 5km)
      userContextService.setUserLocation(userId2, { longitude: 21.0200, latitude: 52.2350 });

      // Far away (Krakow - over 250km)
      userContextService.setUserLocation(userId3, { longitude: 19.9450, latitude: 50.0647 });

      await facade.reportIncident(userId1, IncidentType.DELAY);
      await facade.reportIncident(userId2, IncidentType.ISSUES);
      await facade.reportIncident(userId3, IncidentType.DELAY);

      const nearbyIncidents = await repository.findByLocation(21.0122, 52.2297, 10);
      expect(nearbyIncidents).toHaveLength(2);
    });
  });
});
