import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';
import { IncidentReport } from '../../src/domain/model/IncidentReport';

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
}
