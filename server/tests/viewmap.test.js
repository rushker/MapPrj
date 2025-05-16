// tests/viewmap.test.js
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

let projectId;
let areaId;

describe('ViewMap API', () => {
  beforeAll(async () => {
    // Setup: create project and area
    const p = await request(app).post('/api/projects').send({ title: 'ViewMap Project' });
    projectId = p.body._id;
    const polygon = { type: 'Polygon', coordinates: [[[0,0],[0,2],[2,2],[2,0],[0,0]]] };
    const a = await request(app).post(`/api/projects/${projectId}/areas`).send({ title: 'View Area', polygon });
    areaId = a.body.areaId;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should not fetch view data before publish', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/view/${areaId}`);
    expect(res.statusCode).toBe(404);
  });

  it('should publish the area', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/view/${areaId}/publish`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Area published');
  });

  it('should fetch view data after publish', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/view/${areaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('area');
    expect(res.body).toHaveProperty('mask');
  });
});
