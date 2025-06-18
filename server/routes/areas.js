// routes/areas.js
import express from 'express';
import {
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
  updatePolygon,
  publishArea,
  getAllAreas,
  searchAreas
} from '../controllers/areaController.js';
import { checkAreaExists } from '../middleware/areaMiddleware.js';

const router = express.Router({ mergeParams: true });

// Đường dẫn gốc: /areas
router.route('/')
  .post(createArea)        // Tạo mới Khu A
  .get(getAllAreas);       // Lấy toàn bộ Khu A

router.get('/search', searchAreas);  // Tìm kiếm nâng cao

router.route('/:areaId', checkAreaExists)
  .get(getAreaById)          // Lấy chi tiết 1 Khu A
  .put(updateArea)           // Cập nhật metadata Khu A
  .delete(deleteArea);       // Xóa Khu A

// Các route đặc biệt:
router.put('/:areaId/polygon',checkAreaExists, updatePolygon);     // Cập nhật polygon
router.put('/:areaId/publish',checkAreaExists, publishArea);       // Publish Khu A

export default router;
