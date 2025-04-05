import {checkProjectStatus} from '../utils/checkProjectStatus.js';
import {Task} from '../models/task.model.js';
import {Project} from '../models/projects.model.js';
import {User} from '../models/user.model.js';

describe('Project Completion Logic', () => {
  let project, user;

  beforeAll(async () => {
    user = await User.create({ name: 'User', email: 'u@x.com', password: '123', role: 'developer' });
    project = await Project.create({ title: 'Proj', description: 'D', deadline: '2099-01-01' });
  });

  it('should return "incomplete" when not all tasks are done', async () => {
    await Task.create({ title: 'T1', description: 'desc', status: 'In Progress', assignee: user._id, project: project._id });
    const status = await checkProjectStatus(project._id);
    expect(status).toBe('incomplete');
  });

  it('should return "completed-on-time" when all tasks are done before deadline', async () => {
    await Task.updateMany({ project: project._id }, { status: 'Done' });
    const status = await checkProjectStatus(project._id);
    expect(status).toBe('completed-on-time');
  });
});
