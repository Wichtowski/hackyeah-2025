import app from '../src/index';
import request = require('supertest');

describe('CORS middleware', () => {
  it('should include Access-Control-Allow-Origin for allowed origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:8081');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:8081');
    expect(res.body).toEqual({ message: 'ok from backend' });
  });

  it('should not include Access-Control-Allow-Origin for disallowed origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://malicious.example.com');

    // Express CORS library will block and not set header; supertest still receives response
    // In our custom origin callback we error; Express converts to 500 unless we add error handler.
    // For now we just assert header missing.
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

