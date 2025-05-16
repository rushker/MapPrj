// tests/area.test.js
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

let projectId;
let area;

describe('Area API', () => {
  beforeAll(async () => {
    // Create a project to add areas to
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Area Test Project' });
    projectId = res.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a new area', async () => {
    const polygon = { type: 'Polygon', coordinates: [[[0,0],[0,1],[1,1],[1,0],[0,0]]] };
    const res = await request(app)
      .post(`/api/projects/${projectId}/areas`)
      .send({ title: 'Test Area', polygon });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('areaId');
    expect(res.body.title).toBe('Test Area');
    area = res.body;
  });

  it('should update the area', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}/areas/${area.areaId}`)
      .send({ title: 'Updated Area' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Area');
  });

  it('should delete the area', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}/areas/${area.areaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Area deleted');
  });
});