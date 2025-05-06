// routes/mapRoutes.js
import express from 'express';
import multer from 'multer';
import {
  getMapData,
  updateMapData,
  uploadImage,
  deleteMap,
} from '../controllers/mapController.js';

const router = express.Router();
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
}); // For parsing incoming files

router.get('/:id', getMapData);
router.put('/:id', updateMapData);
router.post('/upload-image', upload.single('image'), uploadImage);
router.delete('/:id', deleteMap);

export default router;
