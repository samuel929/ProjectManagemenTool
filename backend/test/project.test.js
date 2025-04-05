import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {Project} from '../models/projects.model.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Project API', () => {
  it('should create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({
        title: 'Test Project',
        description: 'Test Description',
        deadline: '2099-12-31'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Test Project');
  });

  it('should fetch all projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
