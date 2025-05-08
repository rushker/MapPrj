// backend/routes/mapAreaRoutes.js
import express from 'express';
import {
  cutMapArea,
  updateMapArea,
  getMapAreaById,
  getAllMapAreas,
  deleteMapArea,
} from '../controllers/mapAreaController.js';

const router = express.Router();

// 1. Draw & cut → POST new area            (BasemapPage)
router.post('/', cutMapArea);

// 2. Fetch for edit       → GET  /api/map-areas/:id  (EditMapPage)
router.get('/:id', getMapAreaById);

// 3. Fetch all for dashboard → GET /api/map-areas
router.get('/', getAllMapAreas);

// 4. Update markers & metadata → PUT /api/map-areas/:id
router.put('/:id', updateMapArea);

// 5. Delete entire area       → DELETE /api/map-areas/:id
router.delete('/:id', deleteMapArea);

export default router;
