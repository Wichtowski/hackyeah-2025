import app from '../src/index';
import request = require('supertest');

describe('GET /api/health', () => {
  it('should return a 200 OK status, header and a health message', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'ok from backend' });
    expect(response.headers['x-health-check']).toBeDefined();
  });
});
