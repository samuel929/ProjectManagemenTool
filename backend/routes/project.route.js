import express from "express";
const router = express.Router();
import {
  createProjects,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
// Create a project
router.post('/', createProjects);

// Get all projects
router.get('/', getProjects);

// Update a project
router.put('/:id',updateProject);

// Delete a project
router.delete('/:id', deleteProject);

export default router;
