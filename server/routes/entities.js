// routes/entities.js
import express from 'express';
import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntitiesByArea,
  updateEntityGeometry,
  updateEntityMetadata,
} from '../controllers/entityController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getEntitiesByArea);
router.post('/', createEntity);
router.put('/:entityId', updateEntity);
router.patch('/:entityId/geometry', updateEntityGeometry);
router.patch('/:entityId/metadata', updateEntityMetadata);
router.delete('/:entityId', deleteEntity);

export default router;
