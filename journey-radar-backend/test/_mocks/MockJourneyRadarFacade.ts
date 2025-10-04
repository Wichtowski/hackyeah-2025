import { JourneyRadarCapabilities } from '../../src/domain/facade/JourneyRadarCapabilities';

export type CallRecord = {
  method: keyof JourneyRadarCapabilities;
  args: unknown[];
};

export class MockJourneyRadarFacade implements JourneyRadarCapabilities {
  public calls: CallRecord[] = [];
  private healthResponse: any = { status: 'OK', domain: 'Mock' };

  setHealthResponse(response: any): void {
    this.healthResponse = response;
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
}
