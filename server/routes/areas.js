// routes/areas.js
import express from 'express';
import {
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
  updatePolygon,
  publishArea,
  cutAndCloneArea,
  getAreasByProject,
  searchAreas
} from '../controllers/areaController.js';

const router = express.Router({ mergeParams: true });

// Đường dẫn gốc: /projects/:projectId/areas

router.route('/')
  .post(createArea)          // Tạo Khu A mới
  .get(getAreasByProject);   // Lấy danh sách Khu A theo project

router.get('/search', searchAreas);  // Tìm kiếm nâng cao (đặt trước /:areaId để tránh conflict)

router.route('/:areaId')
  .get(getAreaById)          // Lấy chi tiết 1 Khu A
  .put(updateArea)           // Cập nhật metadata Khu A
  .delete(deleteArea);       // Xóa Khu A

// Các route đặc biệt:
router.put('/:areaId/polygon', updatePolygon);     // Cập nhật polygon
router.put('/:areaId/publish', publishArea);       // Publish Khu A
router.post('/:areaId/cut', cutAndCloneArea);      // Cắt & nhân bản thành Khu C


export default router;