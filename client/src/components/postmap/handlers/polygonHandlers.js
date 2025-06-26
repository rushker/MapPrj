// src/components/postmap/handlers/polygonHandlers.js
import toast from 'react-hot-toast';
import { createEntity } from '../../../services/entities';

export function createPolygonEntityHandler({ areaId, addEntity, setSelectedEntityId, openSidebar }) {
  return async ({ coordinates, geometry }) => {
    if (!window.confirm('Bạn có muốn tạo mới vùng này không?')) return;
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    try {
      const payload = geometry ?? {
        type: 'Polygon',
        coordinates: [coordinates],
      };

      const res = await createEntity(areaId, {
        type: 'polygon',
        geometry: payload,
        name: 'Polygon mới',
      });

      if (!res.success || !res.data) throw new Error('API trả về không hợp lệ');

      const entityData = {
        ...res.data,
        type: res.data.type ?? 'polygon',
        name: res.data.name ?? 'Polygon không tên',
      };

      addEntity(entityData);
      setSelectedEntityId(entityData._id);
      openSidebar?.('entity', entityData); // ✅ MỞ SIDEBAR SAU KHI TẠO
      toast.success('Đã thêm vùng (Polygon)');
    } catch (err) {
      console.error('[createPolygonEntityHandler] Failed:', err);
      toast.error('Tạo Polygon thất bại');
    }
  };
}
