// routes/areaRoutes.js
import express from 'express';
import {
  createArea,
  updateArea,
  deleteArea
} from '../controllers/areaController.js';

const router = express.Router({ mergeParams: true });

// /api/projects/:projectId/areas
router.post('/', createArea);
router.put('/:areaId', updateArea);
router.delete('/:areaId', deleteArea);

export default router;