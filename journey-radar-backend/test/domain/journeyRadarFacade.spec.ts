import { JourneyRadarFacade } from '../../src/domain/facade/JourneyRadarFacade';
import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';
import { InMemoryIncidentReportRepository } from '../../src/adapter/repository/InMemoryIncidentReportRepository';

describe('JourneyRadarFacade (Domain Logic)', () => {
  let facade: JourneyRadarCapabilities;
  let repository: InMemoryIncidentReportRepository;

  beforeEach(() => {
    repository = new InMemoryIncidentReportRepository();
    facade = new JourneyRadarFacade(repository);
  });

  it('should return a healthy status', async () => {
    const result = await facade.checkHealth();
    expect(result).toEqual({ status: 'OK', domain: 'JourneyRadar' });
  });

  it('should plan a journey and return a result', async () => {
    const params = { origin: 'A', destination: 'B' };
    const result = await facade.planJourney(params);
    expect(result.status).toBe('PLANNED');
    expect(result.id).toBeDefined();
  });
});
