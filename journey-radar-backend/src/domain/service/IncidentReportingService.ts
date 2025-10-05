import { IncidentReport } from '@domain/model/IncidentReport';
import { IncidentReportRepository } from '@domain/repository/IncidentReportRepository';
import { UserContextService } from './UserContextService';

export class IncidentReportingService {
  constructor(
    private readonly incidentReportRepository: IncidentReportRepository,
    private readonly userContextService: UserContextService,
  ) {}

  async reportIncident(userId: string, incidentType: string, description?: string): Promise<IncidentReport> {
    const location = await this.userContextService.getCurrentLocation(userId);
    const reporter = await this.userContextService.getReporter(userId);
    const activeJourney = await this.userContextService.getActiveJourney(userId);

    const incidentReport = new IncidentReport(
      '',
      location,
      reporter,
      incidentType as any,
      { reportedOnRoute: activeJourney },
      new Date(),
      description
    );
    return await this.incidentReportRepository.save(incidentReport);
  }
}


