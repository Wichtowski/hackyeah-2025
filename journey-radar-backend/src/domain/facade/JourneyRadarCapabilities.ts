import { IncidentReport } from '../model/IncidentReport';
import { Coordinates, Destination, Journey, JourneyProgress, JourneyStartResponse, Origin } from '../model/Journey';

export interface JourneyRadarCapabilities {
  planJourney(params: { origin: string; destination: string }): Promise<any>;
  getJourneyById(id: string): Promise<any>;
  checkHealth(): Promise<{ status: string; domain: string }>;
  reportIncident(userId: string, incidentType: string, description?: string): Promise<IncidentReport>;
  mockUserLocation(userId: string, longitude: number, latitude: number): Promise<{ userId: string; longitude: number; latitude: number }>;

  // New contract-aligned capabilities
  getJourney(origin: Origin, destination: Destination): Promise<Journey>;
  startJourney(journey: Journey): Promise<JourneyStartResponse>;
  getJourneyProgress(journeyId: string, coordinates: Coordinates): Promise<JourneyProgress>;
}
