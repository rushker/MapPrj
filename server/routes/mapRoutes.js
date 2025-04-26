// routes/mapRoutes.js
import express from 'express';
import { 
  uploadMapImage,
  deleteMapImage,
  getMapImages
} from '../controllers/mapController.js';
import { uploadSingle } from '../middlewares/uploadMiddleware.js'; 

const router = express.Router();

router.route('/')
  .post(uploadSingle('map'), uploadMapImage)
  .get(getMapImages);

router.route('/:public_id')
  .delete(deleteMapImage);

export default router;
