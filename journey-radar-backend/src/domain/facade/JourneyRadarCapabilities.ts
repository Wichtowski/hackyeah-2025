import { IncidentReport } from '../model/IncidentReport';

export interface JourneyRadarCapabilities {
  planJourney(params: { origin: string; destination: string }): Promise<any>;
  getJourneyById(id: string): Promise<any>;
  checkHealth(): Promise<{ status: string; domain: string }>;
  reportIncident(userId: string, incidentType: string, description?: string): Promise<IncidentReport>;
}
