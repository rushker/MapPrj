// tests/project.test.js
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Project from '../models/Project.js';

describe('Project API', () => {
  let projectId;

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Test Project' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Project');
    projectId = res.body._id;
  });

  it('should fetch all projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch project by ID', async () => {
    const res = await request(app).get(`/api/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(projectId);
  });

  it('should update the project', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ title: 'Updated Project' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Project');
  });

  it('should delete the project', async () => {
    const res = await request(app).delete(`/api/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Project deleted');
  });
});