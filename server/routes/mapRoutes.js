// routes/mapRoutes.js
import express from 'express';
import {
  getMapData,
  updateMapData,
  uploadImage
} from '../controllers/mapController.js';
import { uploader } from '../uploads/cloudinary.js'; // ✅ use this one

const router = express.Router();

router.get('/:id', getMapData);
router.put('/:id', updateMapData);
router.post('/upload-image', uploader.single('image'), uploadImage); // ✅ actual usage

export default router;
