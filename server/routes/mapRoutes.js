// routes/mapRoutes.js
import express from 'express';
import multer from 'multer';
import {
  getMapData,
  updateMapData,
  uploadImage
} from '../controllers/mapController.js';

const router = express.Router();
const upload = multer({ dest: 'temp/' }); // Temp folder for uploads

router.get('/:id', getMapData);
router.put('/:id', updateMapData);
router.post('/upload-image', upload.single('image'), uploadImage);

export default router;
