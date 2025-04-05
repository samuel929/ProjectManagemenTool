import {Task} from '../models//task.model.js';

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