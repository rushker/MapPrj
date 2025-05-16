// routes/viewmapRoutes.js
import express from 'express';
import {
  getViewMap,
  publishArea
} from '../controllers/viewmapController.js';

const router = express.Router({ mergeParams: true });

// /api/projects/:projectId/view/:areaId
router.post('/:areaId/publish', publishArea);
router.get('/:areaId', getViewMap);

export default router;