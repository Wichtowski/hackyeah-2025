import express from 'express';
import request from 'supertest';
import { createJourneysRoutes } from '../../../src/adapter/rest/incoming/journeysRoutes';
import { MockJourneyRadarFacade } from '../../_mocks/MockJourneyRadarFacade';

// Minimal helpers
const isISO = (s: string) => new Date(s).toISOString() === s;

describe('Journeys Routes', () => {
  let app: express.Application;
  let mockFacade: MockJourneyRadarFacade;

  beforeEach(() => {
    mockFacade = new MockJourneyRadarFacade();
    app = express();
    app.use(express.json());
    app.use('/api', createJourneysRoutes(mockFacade));
  });

  describe('GET /api/journeys', () => {
    it('should use GET and return Journey for valid origin and destination', async () => {
      const response = await request(app)
        .get('/api/journeys')
        .query({ origin: 'A', destination: 'C' })
        .expect(200);

      expect(Array.isArray(response.body.routes)).toBe(true);
      expect(typeof response.body.distance).toBe('number');
      expect(typeof response.body.duration).toBe('number');

      expect(mockFacade.calls[mockFacade.calls.length - 1].method).toBe('getJourney');
      const args = mockFacade.calls[mockFacade.calls.length - 1].args as any[];
      expect(args[0]).toEqual({ station: { name: 'A' } });
      expect(args[1]).toEqual({ station: { name: 'C' } });
    });

    it('should return 400 when origin or destination is missing', async () => {
      await request(app).get('/api/journeys').query({ origin: 'A' }).expect(400);
      await request(app).get('/api/journeys').query({ destination: 'B' }).expect(400);
      await request(app).get('/api/journeys').expect(400);
    });
  });

  describe('POST /api/journeys/start', () => {
    it('should use POST and return JourneyStartResponse for valid Journey body', async () => {
      const journey = {
        routes: [
          { stations: [{ name: 'A' }, { name: 'B' }], delay: { time: 0 }, incidents: [] },
          { stations: [{ name: 'B' }, { name: 'C' }], delay: { time: 0 }, incidents: [] }
        ],
        distance: 10,
        duration: 30
      };

      const response = await request(app)
        .post('/api/journeys/start')
        .send(journey)
        .expect(201);

      expect(typeof response.body.journey_id).toBe('string');
      expect(isISO(response.body.state.updated_at)).toBe(true);
      expect(response.body.state.route_index).toBe(0);
      expect(response.body.state.position_in_route).toBe(0);

      expect(mockFacade.calls[mockFacade.calls.length - 1].method).toBe('startJourney');
    });

    it('should return 400 when body is missing or invalid', async () => {
      await request(app).post('/api/journeys/start').send({}).expect(400);
      await request(app).post('/api/journeys/start').expect(400);
    });
  });

  describe('GET /api/journeys/:journeyId/progress', () => {
    it('should use GET and return JourneyProgress for valid query coordinates', async () => {
      const response = await request(app)
        .get('/api/journeys/journey_1/progress')
        .query({ longitude: '21.0', latitude: '52.2' })
        .expect(200);

      expect(response.body.firstStation).toBeDefined();
      expect(response.body.lastStation).toBeDefined();
      expect(response.body.progress).toBeDefined();

      expect(mockFacade.calls[mockFacade.calls.length - 1].method).toBe('getJourneyProgress');
      const args = mockFacade.calls[mockFacade.calls.length - 1].args as any[];
      expect(args[0]).toBe('journey_1');
      expect(args[1]).toEqual({ longitude: 21.0, latitude: 52.2 });
    });

    it('should return 400 when coordinates are missing or invalid', async () => {
      await request(app).get('/api/journeys/abc/progress').expect(400);
      await request(app).get('/api/journeys/abc/progress').query({ longitude: 'x', latitude: '52' }).expect(400);
      await request(app).get('/api/journeys/abc/progress').query({ longitude: '21', latitude: 'y' }).expect(400);
    });
  });
});
