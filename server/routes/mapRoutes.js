// routes/mapRoutes.js
import express from 'express';
import { uploadArea, getAreas } from '../controllers/mapController.js';
import { upload } from '../middlewares/upload.js'; // Make sure it's imported correctly

const router = express.Router();

router.post('/', upload.single('image'), uploadArea);
router.get('/', getAreas);

export default router;

