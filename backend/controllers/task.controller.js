import {Task} from '../models/task.model.js';
import {checkProjectCompletionStatus} from '../utils/checkProjectStatus.js';
import redisClient from '../config/redis.js';
export const createTask = async (req, res) => {
     const { title, description, status, assignee, project } = req.body;
    
      if (!title || !description || !assignee || !project) {
        return res.status(400).json({ error: 'All fields are required (except status)' });
      }
    
      try {
        const newTask = await Task.create({
          title,
          description,
          status,
          assignee,
          project
        });
        await checkProjectCompletionStatus(project || updatedTask.project)
        await redisClient.publish('task-events', JSON.stringify({
          type: 'task-assigned',
          userId: assignee,
          message: `You have been assigned a task: ${title}`
        }));
        
        // For status update
        if (status) {
          await redisClient.publish('task-events', JSON.stringify({
            type: 'status-updated',
            userId: assignee,
            message: `Status changed for task: ${title}`
          }));
        }
        res.status(201).json(newTask);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
          .populate('assignee', 'name email')
          .populate('project', 'title');
    
        res.json(tasks);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export const updateTask = async (req, res) => {
    const { title, description, status, assignee } = req.body;

    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status, assignee },
        { new: true }
      );
  
      if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
      await checkProjectCompletionStatus(updatedTask.project)
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Task not found' });
    
        res.json({ message: 'Task deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}