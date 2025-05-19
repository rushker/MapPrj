// routes/projects.js
import express from 'express';
import {
  getAllProjects,
  createProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', createProject);
router.delete('/:projectId', deleteProject);

export default router;
