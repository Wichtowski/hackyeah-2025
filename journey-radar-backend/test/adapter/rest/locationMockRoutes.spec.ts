import request from 'supertest';
import express from 'express';
import { createLocationMockRoutes } from '../../../src/adapter/rest/incoming/locationMockRoutes';
import { MockJourneyRadarFacade } from '../../_mocks/MockJourneyRadarFacade';

describe('Location Mock Routes', () => {
  let app: express.Application;
  let mockFacade: MockJourneyRadarFacade;

  beforeEach(() => {
    mockFacade = new MockJourneyRadarFacade();
    app = express();
    app.use(express.json());
    app.use('/api', createLocationMockRoutes(mockFacade));
  });

  describe('POST /api/mock/location', () => {
    it('should mock user location and return 200', async () => {
      const locationData = {
        userId: 'user_123',
        longitude: 21.0122,
        latitude: 52.2297
      };

      const response = await request(app)
        .post('/api/mock/location')
        .send(locationData)
        .expect(200);

      expect(response.body.message).toBe('User location mocked successfully');
      expect(response.body.userId).toBe('user_123');
      expect(response.body.longitude).toBe(21.0122);
      expect(response.body.latitude).toBe(52.2297);

      expect(mockFacade.calls).toHaveLength(1);
      expect(mockFacade.calls[0].method).toBe('mockUserLocation');
      expect(mockFacade.calls[0].args).toEqual(['user_123', 21.0122, 52.2297]);
    });

    it('should return 400 if userId is missing', async () => {
      const response = await request(app)
        .post('/api/mock/location')
        .send({ longitude: 21.0122, latitude: 52.2297 })
        .expect(400);

      expect(response.body.error).toContain('userId');
    });

    it('should return 400 if coordinates are not numbers', async () => {
      const response = await request(app)
        .post('/api/mock/location')
        .send({ userId: 'user_123', longitude: 'invalid', latitude: 52.2297 })
        .expect(400);

      expect(response.body.error).toContain('longitude and latitude');
    });

    it('should return 400 if longitude is out of range', async () => {
      const response = await request(app)
        .post('/api/mock/location')
        .send({ userId: 'user_123', longitude: 200, latitude: 52.2297 })
        .expect(400);

      expect(response.body.error).toContain('Longitude must be between -180 and 180');
    });

    it('should return 400 if latitude is out of range', async () => {
      const response = await request(app)
        .post('/api/mock/location')
        .send({ userId: 'user_123', longitude: 21.0122, latitude: 100 })
        .expect(400);

      expect(response.body.error).toContain('Latitude must be between -90 and 90');
    });
  });
});

