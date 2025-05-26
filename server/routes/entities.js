// routes/entities.js
import express from 'express';
import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntitiesByArea
} from '../controllers/entityController.js';

const router = express.Router({ mergeParams: true });

// Đường dẫn gốc: /projects/:projectId/areas/:areaId/entities

router.get('/', getEntitiesByArea);        // Lấy tất cả entities trong Khu A
router.post('/', createEntity);             // Tạo entity mới (Khu C hoặc Marker)
router.put('/:entityId', updateEntity);     // Cập nhật entity
router.delete('/:entityId', deleteEntity);  // Xóa entity

export default router;
