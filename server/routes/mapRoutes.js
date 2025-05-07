// routes/mapRoutes.js
import express from 'express';
import {
  getMap,
  saveMap,
  uploadImage,
  deleteMapData,
  updateMap,
} from '../controllers/mapController.js';

const router = express.Router();

router.get('/:id', getMap);
router.post('/', saveMap);
router.post('/upload-image', uploadImage);
router.put('/:id', updateMap); // ← ADD THIS
router.delete('/:id', deleteMapData);

export default router;
