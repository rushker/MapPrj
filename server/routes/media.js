// routes/media.js
import express from 'express';
import { uploadImage, deleteImage, uploadMiddleware } from '../controllers/mediaController.js';

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadImage);  // Upload ảnh kèm middleware xử lý file
router.post('/delete', deleteImage);                    // Xóa ảnh theo publicId

export default router;

