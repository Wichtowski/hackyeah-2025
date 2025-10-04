import request from 'supertest';
import express from 'express';
import { createIncidentRoutes } from '../../../src/adapter/rest/incoming/incidentRoutes';
import { MockJourneyRadarFacade } from '../../_mocks/MockJourneyRadarFacade';
import { IncidentType } from '../../../src/domain/model/IncidentReport';

describe('Incident Routes', () => {
  let app: express.Application;
  let mockFacade: MockJourneyRadarFacade;

  beforeEach(() => {
    mockFacade = new MockJourneyRadarFacade();
    app = express();
    app.use(express.json());
    app.use('/api', createIncidentRoutes(mockFacade));
  });

  describe('POST /api/incidents', () => {
    it('should create an incident report and return 201', async () => {
      const incidentData = {
        userId: 'user_123',
        incidentType: IncidentType.DELAY,
        description: 'Train is running 15 minutes late'
      };

      const response = await request(app)
        .post('/api/incidents')
        .send(incidentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.incidentType).toBe(IncidentType.DELAY);
      expect(response.body.description).toBe(incidentData.description);
      expect(response.body).toHaveProperty('location');
      expect(response.body).toHaveProperty('reporter');
      expect(response.body).toHaveProperty('timestamp');

      expect(mockFacade.calls).toHaveLength(1);
      expect(mockFacade.calls[0].method).toBe('reportIncident');
      expect(mockFacade.calls[0].args[0]).toBe('user_123');
    });

    it('should return 400 if userId is missing', async () => {
      const incidentData = {
        incidentType: IncidentType.DELAY
      };

      const response = await request(app)
        .post('/api/incidents')
        .send(incidentData)
        .expect(400);

      expect(response.body.error).toContain('userId');
    });

    it('should return 400 if incident type is invalid', async () => {
      const incidentData = {
        userId: 'user_123',
        incidentType: 'INVALID_TYPE'
      };

      const response = await request(app)
        .post('/api/incidents')
        .send(incidentData)
        .expect(400);

      expect(response.body.error).toContain('incident type');
    });

    it('should handle all three incident types', async () => {
      const incidents = [
        { incidentType: IncidentType.ISSUES, description: 'Minor technical issues' },
        { incidentType: IncidentType.DELAY, description: 'Running late' },
        { incidentType: IncidentType.SEVERE_BLOCKER, description: 'Route blocked' }
      ];

      for (const incident of incidents) {
        const response = await request(app)
          .post('/api/incidents')
          .send({
            userId: 'user_123',
            ...incident
          })
          .expect(201);

        expect(response.body.incidentType).toBe(incident.incidentType);
      }
    });

    it('should work without description', async () => {
      const incidentData = {
        userId: 'user_456',
        incidentType: IncidentType.ISSUES
      };

      const response = await request(app)
        .post('/api/incidents')
        .send(incidentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.incidentType).toBe(IncidentType.ISSUES);
    });
  });
});
