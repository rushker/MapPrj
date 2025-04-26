// routes/mapRoutes.js
import express from 'express';
import { uploadMapImage } from '../controllers/mapController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('map'), uploadMapImage);

export default router;