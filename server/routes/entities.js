// routes/entities.js
import express from 'express';
import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntitiesByArea
} from '../controllers/entityController.js';

const router = express.Router({ mergeParams: true });

// CRUD entity (marker / khu C)
router.get('/:areaId', getEntitiesByArea);     // GET /entities/:areaId
router.post('/:areaId', createEntity);         // POST /entities/:areaId
router.put('/update/:entityId', updateEntity); // PUT /entities/update/:entityId
router.delete('/:entityId', deleteEntity);     // DELETE /entities/:entityId

export default router;
