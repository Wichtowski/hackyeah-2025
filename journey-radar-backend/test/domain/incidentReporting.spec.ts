import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';
import { IncidentReport, IncidentType, ReporterType } from '../../src/domain/model/IncidentReport';

describe('Incident Reporting', () => {
  let facade: JourneyRadarFacade;
  let repository: InMemoryIncidentReportRepository;

  beforeEach(() => {
    repository = new InMemoryIncidentReportRepository();
    facade = new JourneyRadarFacade(repository);
  });

  describe('reportIncident', () => {
    it('should save an incident report from a user', async () => {
      const incidentReport = new IncidentReport(
        'incident_001',
        { longitude: 21.0122, latitude: 52.2297 }, // Warsaw coordinates
        { id: 'user_123', type: ReporterType.USER },
        IncidentType.DELAY,
        { reportedOnRoute: null },
        new Date(),
        'Train is running 15 minutes late'
      );

      const result = await facade.reportIncident(incidentReport);

      expect(result).toEqual(incidentReport);
      expect(result.id).toBe('incident_001');
      expect(result.incidentType).toBe(IncidentType.DELAY);
    });

    it('should save an incident report with route reference', async () => {
      const incidentReport = new IncidentReport(
        'incident_002',
        { longitude: 21.0122, latitude: 52.2297 },
        { id: 'user_456', type: ReporterType.USER },
        IncidentType.ISSUES,
        {
          reportedOnRoute: {
            origin: 'Warsaw Central',
            destination: 'Krakow Main',
            transportVehicleId: 'train_ic_1234'
          }
        },
        new Date(),
        'Train has minor technical issues'
      );

      const result = await facade.reportIncident(incidentReport);

      expect(result.details.reportedOnRoute).toBeDefined();
      expect(result.details.reportedOnRoute?.origin).toBe('Warsaw Central');
      expect(result.details.reportedOnRoute?.destination).toBe('Krakow Main');
    });

    it('should save an incident report from a dispatcher', async () => {
      const incidentReport = new IncidentReport(
        'incident_003',
        { longitude: 19.9450, latitude: 50.0647 }, // Krakow coordinates
        { id: 'dispatcher_789', type: ReporterType.DISPATCHER },
        IncidentType.SEVERE_BLOCKER,
        { reportedOnRoute: null },
        new Date(),
        'Route blocked due to severe accident'
      );

      const result = await facade.reportIncident(incidentReport);

      expect(result.reporter.type).toBe(ReporterType.DISPATCHER);
      expect(result.incidentType).toBe(IncidentType.SEVERE_BLOCKER);
    });

    it('should save an incident report from an external system', async () => {
      const incidentReport = new IncidentReport(
        'incident_004',
        { longitude: 18.6466, latitude: 54.3520 }, // Gdansk coordinates
        { id: 'external_system_001', type: ReporterType.EXTERNAL_SYSTEM },
        IncidentType.ISSUES,
        { reportedOnRoute: null },
        new Date(),
        'Signal failure detected'
      );

      const result = await facade.reportIncident(incidentReport);

      expect(result.reporter.type).toBe(ReporterType.EXTERNAL_SYSTEM);
      expect(result.incidentType).toBe(IncidentType.ISSUES);
    });
  });

  describe('Repository operations', () => {
    it('should retrieve incident by id', async () => {
      const incidentReport = new IncidentReport(
        'incident_005',
        { longitude: 21.0122, latitude: 52.2297 },
        { id: 'user_123', type: ReporterType.USER },
        IncidentType.DELAY,
        { reportedOnRoute: null },
        new Date()
      );

      await facade.reportIncident(incidentReport);
      const found = await repository.findById('incident_005');

      expect(found).toBeDefined();
      expect(found?.id).toBe('incident_005');
    });

    it('should retrieve incidents by route', async () => {
      const incidentReport1 = new IncidentReport(
        'incident_006',
        { longitude: 21.0122, latitude: 52.2297 },
        { id: 'user_123', type: ReporterType.USER },
        IncidentType.DELAY,
        {
          reportedOnRoute: {
            origin: 'Warsaw',
            destination: 'Krakow',
            transportVehicleId: 'train_001'
          }
        },
        new Date()
      );

      const incidentReport2 = new IncidentReport(
        'incident_007',
        { longitude: 21.0122, latitude: 52.2297 },
        { id: 'user_456', type: ReporterType.USER },
        IncidentType.ISSUES,
        {
          reportedOnRoute: {
            origin: 'Warsaw',
            destination: 'Krakow',
            transportVehicleId: 'train_002'
          }
        },
        new Date()
      );

      await facade.reportIncident(incidentReport1);
      await facade.reportIncident(incidentReport2);

      const incidents = await repository.findByRoute('Warsaw', 'Krakow');
      expect(incidents).toHaveLength(2);
    });

    it('should retrieve incidents by location within radius', async () => {
      // Warsaw Central Station
      const incidentReport1 = new IncidentReport(
        'incident_008',
        { longitude: 21.0122, latitude: 52.2297 },
        { id: 'user_123', type: ReporterType.USER },
        IncidentType.DELAY,
        { reportedOnRoute: null },
        new Date()
      );

      // Close to Warsaw (within 5km)
      const incidentReport2 = new IncidentReport(
        'incident_009',
        { longitude: 21.0200, latitude: 52.2350 },
        { id: 'user_456', type: ReporterType.USER },
        IncidentType.ISSUES,
        { reportedOnRoute: null },
        new Date()
      );

      // Far away (Krakow - over 250km)
      const incidentReport3 = new IncidentReport(
        'incident_010',
        { longitude: 19.9450, latitude: 50.0647 },
        { id: 'user_789', type: ReporterType.USER },
        IncidentType.DELAY,
        { reportedOnRoute: null },
        new Date()
      );

      await facade.reportIncident(incidentReport1);
      await facade.reportIncident(incidentReport2);
      await facade.reportIncident(incidentReport3);

      const nearbyIncidents = await repository.findByLocation(21.0122, 52.2297, 10);
      expect(nearbyIncidents).toHaveLength(2);
      expect(nearbyIncidents.map(i => i.id)).toContain('incident_008');
      expect(nearbyIncidents.map(i => i.id)).toContain('incident_009');
    });
  });
});
