import express from 'express';
const router = express.Router();
import { createTask ,getTasks,updateTask,deleteTask} from '../controllers/task.controller.js';
// Create a task
router.post('/',createTask );

// Get all tasks for a project
router.get('/project/:projectId', getTasks);

// Update a task
router.put('/:id', updateTask );

// Delete a task
router.delete('/:id', deleteTask);

export default router;
