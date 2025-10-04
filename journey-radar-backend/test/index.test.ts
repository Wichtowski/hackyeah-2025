import app from '../src/index';
import request = require('supertest');

describe('GET /', () => {
  it('should return a 200 OK status and the correct message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello from your new Express app!');
  });
});
