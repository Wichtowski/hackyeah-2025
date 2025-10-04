import express from 'express';
import request from 'supertest';
import { createHealthRoutes } from '../../../src/adapter/rest/incoming/healthRoutes';
import { MockJourneyRadarFacade } from '../../_mocks/MockJourneyRadarFacade';

describe('GET /health - Health Routes Adapter', () => {
  let app: express.Express;
  let mockFacade: MockJourneyRadarFacade;

  beforeEach(() => {
    mockFacade = new MockJourneyRadarFacade();
    const healthRouter = createHealthRoutes(mockFacade);
    app = express();
    app.use(healthRouter);
  });

  it('should return 200 and the correct body on success', async () => {
    const expectedResponse = { status: 'HEALTHY', domain: 'TestableMock' };
    mockFacade.setHealthResponse(expectedResponse);

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);

    expect(mockFacade.calls.length).toBe(1);
    expect(mockFacade.calls[0].method).toBe('checkHealth');
  });
});
