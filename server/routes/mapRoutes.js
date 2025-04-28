// routes/mapRoutes.js
import express from 'express';
import { uploadArea, getAreas } from '../controllers/mapController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadArea);
router.get('/list', getAreas);


export default router;
