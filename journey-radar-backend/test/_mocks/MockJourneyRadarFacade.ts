import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';
import { IncidentReport } from '../../src/domain/model/IncidentReport';
import { Coordinates, Destination, Journey, JourneyProgress, JourneyStartResponse, Origin } from '../../src/domain/model/Journey';
import { FinishedJourney } from '../../src/domain/model/FinishedJourney';

export type CallRecord = {
  method: keyof JourneyRadarCapabilities;
  args: unknown[];
};

export class MockJourneyRadarFacade implements JourneyRadarCapabilities {
  public calls: CallRecord[] = [];
  private healthResponse: any = { status: 'OK', domain: 'Mock' };
  private incidentResponse: IncidentReport | null = null;

  setHealthResponse(response: any): void {
    this.healthResponse = response;
  }

  setIncidentResponse(response: IncidentReport): void {
    this.incidentResponse = response;
  }

  private recordCall(method: keyof JourneyRadarCapabilities, args: unknown[]): void {
    this.calls.push({ method, args });
  }

  async planJourney(...args: [params: { origin: string; destination: string }]): Promise<any> {
    this.recordCall('planJourney', args);
    return Promise.resolve({ id: 'mock_journey_1' });
  }

  async getJourneyById(id: string): Promise<any> {
    this.recordCall('getJourneyById', [id]);
    return Promise.resolve({ id });
  }

  async checkHealth(): Promise<{ status: string; domain: string }> {
    this.recordCall('checkHealth', []);
    return Promise.resolve(this.healthResponse);
  }

  async reportIncident(userId: string, incidentType: string, description?: string): Promise<IncidentReport> {
    this.recordCall('reportIncident', [userId, incidentType, description]);
    return Promise.resolve(this.incidentResponse || {
      id: 'mock_incident_1',
      location: { longitude: 21.0122, latitude: 52.2297 },
      reporter: { id: userId, type: 'USER' as any },
      incidentType: incidentType as any,
      details: { reportedOnRoute: null },
      timestamp: new Date(),
      description
    });
  }

  async mockUserLocation(userId: string, longitude: number, latitude: number): Promise<{ userId: string; longitude: number; latitude: number }> {
    this.recordCall('mockUserLocation', [userId, longitude, latitude]);
    return Promise.resolve({ userId, longitude, latitude });
  }

  // New contract-aligned methods
  async getJourney(origin: Origin, destination: Destination): Promise<Journey> {
    this.recordCall('getJourney', [origin, destination]);
    return Promise.resolve({
      routes: [
        { stations: [origin.station, destination.station], delay: { time: 0 }, incidents: [] }
      ],
      distance: 0,
      duration: 0
    });
  }

  async startJourney(journey: Journey): Promise<JourneyStartResponse> {
    this.recordCall('startJourney', [journey]);
    return Promise.resolve({
      journey_id: 'mock_journey_id',
      state: { route_index: 0, position_in_route: 0, updated_at: new Date().toISOString() }
    });
  }

  async getJourneyProgress(journeyId: string, coordinates: Coordinates, userId?: string): Promise<JourneyProgress> {
    this.recordCall('getJourneyProgress', [journeyId, coordinates, userId]);
    const stations = [{ name: 'A' }, { name: 'B' }];
    return Promise.resolve({
      journeyId,
      routes: [
        { stations, delay: { time: 0 }, incidents: [] }
      ],
      progress: { currentRoute: 0, currentStage: 0, currentConnection: { id: 1, from: stations[0], to: stations[1] } },
      delay: { time: 0 },
      firstStation: stations[0],
      lastStation: stations[1]
    });
  }

  async getFinishedJourneys(userId: string): Promise<FinishedJourney[]> {
    this.recordCall('getFinishedJourneys', [userId]);
    return Promise.resolve([]);
  }
}
