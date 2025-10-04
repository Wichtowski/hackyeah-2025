import { IncidentReport } from '../model/IncidentReport';

export interface JourneyRadarCapabilities {
  planJourney(params: { origin: string; destination: string }): Promise<any>;
  getJourneyById(id: string): Promise<any>;
  checkHealth(): Promise<{ status: string; domain: string }>;
  reportIncident(incidentReport: IncidentReport): Promise<IncidentReport>;
}
