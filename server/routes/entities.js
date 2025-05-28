// routes/entities.js
import express from 'express';
import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntitiesByArea,
} from '../controllers/entityController.js';

const router = express.Router({ mergeParams: true });

// /areas/:areaId/entities
router.get('/', getEntitiesByArea);
router.post('/', createEntity);
router.put('/:entityId', updateEntity);
router.delete('/:entityId', deleteEntity);

export default router;
