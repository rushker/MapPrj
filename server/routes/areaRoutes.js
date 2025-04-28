// server/routes/areaRoutes.js
import express from 'express';
import multer from '../middlewares/upload.js';
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  deleteArea
} from '../controllers/areaController.js';

const router = express.Router();

router.route('/')
  .get(getAreas)
  .post(multer.single('image'), createArea);

router.route('/:id')
  .get(getAreaById)
  .put(multer.single('image'), updateArea)
  .delete(deleteArea);

export default router;