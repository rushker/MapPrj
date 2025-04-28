// server/routes/mapRoutes.js
import express from 'express';
import upload from '../middlewares/upload.js';
import {
  createMap,
  getMaps,
  getMapById,
  updateMap,
  deleteMap
} from '../controllers/mapController.js';

const router = express.Router();

// Base map CRUD
router.route('/')
  .get(getMaps)
  .post(upload.single('file'), createMap);

router.route('/:id')
  .get(getMapById)
  .put(upload.single('file'), updateMap)
  .delete(deleteMap);

export default router;
