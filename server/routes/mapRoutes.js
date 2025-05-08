// routes/mapRoutes.js
import express from 'express';
import {
  getMap,
  saveMap,
  updateMap,
  deleteMapData,
  uploadImage,
} from '../controllers/mapController.js';

const router = express.Router();

// 1. Public read-only viewer → GET /api/maps/:id
router.get('/:id', getMap);

// 2. (Optional) allow saving finalized maps  → POST /api/maps
router.post('/', saveMap);

// 3. (Optional) update finalized map           → PUT  /api/maps/:id
router.put('/:id', updateMap);

// 4. (Optional) delete finalized map           → DELETE /api/maps/:id
router.delete('/:id', deleteMapData);

// 5. Image upload (used by EditPage)           → POST /api/maps/upload-image
router.post('/upload-image', uploadImage);

export default router;
