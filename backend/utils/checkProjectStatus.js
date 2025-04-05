import {Task} from '../models/task.model.js';
import {Project} from '../models/projects.model.js';
import redisClient from "../config/redis.js"; 

export const checkProjectCompletionStatus = async (projectId) => {
  const tasks = await Task.find({ project: projectId });
  const project = await Project.findById(projectId);

  const allDone = tasks.every(task => task.status === 'Done');
  const beforeDeadline = new Date() <= new Date(project.deadline);

  const status = allDone && beforeDeadline ? 'completed-on-time' :
                 allDone && !beforeDeadline ? 'completed-late' :
                 'incomplete';

  await redisClient.set(`project:${projectId}:status`, status);
  return status;
};

