// routes/media.js
import express from 'express';
import { uploadImage } from '../controllers/mediaController.js';

const router = express.Router();

router.post('/upload', uploadImage); // POST /media/upload

export default router;
