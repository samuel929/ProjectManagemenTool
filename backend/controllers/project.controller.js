
import {Project} from '../models/projects.model.js';
export const  createProjects = async (req, res) => {
    const { title, description, deadline, userId } = req.body;
  
    if (!title || !description || !deadline || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const newProject = await Project.create({
        title,
        description,
        deadline,
        createdBy: userId
      });
  
      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name email role');
        res.json(projects);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }    
  }

  export const updateProject = async (req, res) => {
    const { title, description, deadline } = req.body;

    try {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { title, description, deadline },
        { new: true }
      );
  
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
    
        res.json({ message: 'Project deleted' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  }