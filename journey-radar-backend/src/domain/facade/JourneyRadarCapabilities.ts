import { IncidentReport } from '../model/IncidentReport';

export interface JourneyRadarCapabilities {
  planJourney(params: { origin: string; destination: string }): Promise<any>;
  getJourneyById(id: string): Promise<any>;
  checkHealth(): Promise<{ status: string; domain: string }>;
  reportIncident(userId: string, incidentType: string, description?: string): Promise<IncidentReport>;
  mockUserLocation(userId: string, longitude: number, latitude: number): Promise<{ userId: string; longitude: number; latitude: number }>;
}
