// tests/server.test.js
import request from 'supertest';
import app from '../server.js';

describe('Health Check', () => {
  it('should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'healthy' });
  });
});
