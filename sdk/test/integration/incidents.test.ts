import { reportIncident } from '../../src/incidents';
import { IncidentType, CreateIncidentRequest } from '../../src/types';
import type { Server } from 'http';

describe('Incidents Integration Tests', () => {
  let server: Server;
  let BASE_URL: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const backend = require('../../../journey-radar-backend/dist/index.js');
    const app = backend.default || backend.app || backend;
    await new Promise<void>((resolve, reject) => {
      server = app.listen(0, () => resolve());
      server.on('error', reject);
    });
    const address = server.address();
    if (address && typeof address === 'object') {
      BASE_URL = `http://127.0.0.1:${address.port}`;
    } else {
      throw new Error('Failed to determine server port');
    }
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('should report a new incident with only userId and incidentType', async () => {
    const incidentData: CreateIncidentRequest = {
      userId: 'user_123',
      incidentType: IncidentType.DELAY,
      description: 'Train is running 15 minutes late'
    };

    const result = await reportIncident(BASE_URL, incidentData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.incidentType).toBe(IncidentType.DELAY);
    expect(result.description).toBe('Train is running 15 minutes late');
    expect(result.location).toBeDefined(); // Location is inferred
    expect(result.reporter).toBeDefined(); // Reporter is inferred
    expect(result.reporter.id).toBe('user_123');
    expect(result.timestamp).toBeDefined();
  });

  it('should report an incident without description', async () => {
    const incidentData: CreateIncidentRequest = {
      userId: 'user_456',
      incidentType: IncidentType.SEVERE_BLOCKER
    };

    const result = await reportIncident(BASE_URL, incidentData);

    expect(result).toBeDefined();
    expect(result.incidentType).toBe(IncidentType.SEVERE_BLOCKER);
    expect(result.details).toBeDefined(); // Active journey details are inferred
  });

  it('should handle all three incident types', async () => {
    const incidents = [
      { incidentType: IncidentType.ISSUES, description: 'Minor technical issues' },
      { incidentType: IncidentType.DELAY, description: 'Running late' },
      { incidentType: IncidentType.SEVERE_BLOCKER, description: 'Route blocked' }
    ];

    for (const incident of incidents) {
      const result = await reportIncident(BASE_URL, {
        userId: 'user_789',
        ...incident
      });

      expect(result.incidentType).toBe(incident.incidentType);
      expect(result.description).toBe(incident.description);
    }
  });
});
