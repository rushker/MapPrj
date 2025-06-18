// routes/index.js
import express from 'express';
import areaRoutes from './areas.js';
import entityRoutes from './entities.js';
import mediaRoutes from './media.js';

const router = express.Router();

// ✅ Route cho Area (Khu A) – gốc: /api/areas
router.use('/areas', areaRoutes);

// ✅ Route cho Entity (Marker, Polygon) thuộc Area – gốc: /api/areas/:areaId/entities
router.use('/areas/:areaId/entities', entityRoutes);

// ✅ Route cho media (upload, delete image) – gốc: /api/media
router.use('/media', mediaRoutes);

export default router;
