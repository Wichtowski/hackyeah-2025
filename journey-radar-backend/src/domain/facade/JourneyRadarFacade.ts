import { JourneyRadarCapabilities } from './JourneyRadarCapabilities';
import { IncidentReport } from '../model/IncidentReport';
import { IncidentReportRepository } from '../repository/IncidentReportRepository';

export class JourneyRadarFacade implements JourneyRadarCapabilities {
  constructor(private readonly incidentReportRepository: IncidentReportRepository) {}

  async planJourney(params: { origin: string; destination: string }): Promise<any> {
    console.log(`Domain: Planning journey from ${params.origin} to ${params.destination}...`);
    return { id: 'journey_123', status: 'PLANNED', from: params.origin, to: params.destination };
  }

  async getJourneyById(id: string): Promise<any> {
    console.log(`Domain: Getting journey by id ${id}...`);
    return { id, details: 'Journey details here' };
  }

  async checkHealth(): Promise<{ status: string; domain: string }> {
    return { status: 'OK', domain: 'JourneyRadar' };
  }

  async reportIncident(incidentReport: IncidentReport): Promise<IncidentReport> {
    console.log(`Domain: Reporting incident of type ${incidentReport.incidentType} at location (${incidentReport.location.latitude}, ${incidentReport.location.longitude})`);

    // Save the incident report to the repository
    const savedIncident = await this.incidentReportRepository.save(incidentReport);

    // TODO: Future enhancements:
    // - Notify users on affected routes
    // - Trigger active problem detection for the route
    // - Send notifications to dispatchers if needed

    console.log(`Domain: Incident ${savedIncident.id} reported successfully by ${savedIncident.reporter.type}`);
    return savedIncident;
  }
}
