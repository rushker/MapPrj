// routes/areas.js
import express from 'express';
import {
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
  updatePolygon,
  publishArea,
  cutAndCloneArea
} from '../controllers/areaController.js';

const router = express.Router({ mergeParams: true });

// Dùng projectId từ param
router.post('/', createArea);
router.get('/:areaId', getAreaById);
router.put('/:areaId', updateArea);
router.delete('/:areaId', deleteArea);

router.put('/:areaId/polygon', updatePolygon);
router.put('/:areaId/publish', publishArea);

// Cắt và nhân bản từ polygon mới
router.post('/:areaId/cut', cutAndCloneArea);

export default router;
