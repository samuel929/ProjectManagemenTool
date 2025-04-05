import request from 'supertest';
import app from '../server';
import {Task} from '../models/task.model.js';
import {Project} from '../models/projects.model.js';
import {User} from '../models/user.model.js';

describe('Task API', () => {
  let project, user;

  beforeAll(async () => {
    user = await User.create({ name: 'Test User', email: 'test@x.com', password: 'pass123', role: 'developer' });
    project = await Project.create({ title: 'P1', description: 'D', deadline: '2099-01-01' });
  });

  it('should create a task', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Task 1',
      description: 'Test',
      assignee: user._id,
      project: project._id
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Task 1');
  });

  it('should get tasks by project', async () => {
    const res = await request(app).get(`/api/tasks/project/${project._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
