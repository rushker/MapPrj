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
import { checkAreaExists } from '../middleware/areaMiddleware.js';

const router = express.Router({ mergeParams: true });
router.use(checkAreaExists);
// Main CRUD
router.get('/', getEntitiesByArea);
router.post('/', createEntity);
router.put('/:entityId', updateEntity);
router.delete('/:entityId', deleteEntity);

// ✅ Updated routes include areaId
router.patch('/:entityId/geometry', updateEntityGeometry);
router.patch('/:entityId/metadata', updateEntityMetadata);

export default router;
