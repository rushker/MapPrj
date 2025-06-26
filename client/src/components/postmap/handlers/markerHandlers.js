// src/components/postmap/handlers/markerHandlers.js
import toast from 'react-hot-toast';
import { createEntity } from '../../../services/entities';

export function createMarkerEntityHandler({ areaId, addEntity, setSelectedEntityId, openSidebar }) {
  return async ({ coordinates, geometry }) => {
    if (!window.confirm('Bạn có muốn tạo mới vùng này không?')) return;
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    try {
      const payload = geometry ?? {
        type: 'Point',
        coordinates,
      };

      const res = await createEntity(areaId, {
        type: 'marker',
        geometry: payload,
        name: 'Điểm mới',
      });

      if (!res.success || !res.data) throw new Error('API trả về không hợp lệ');

      addEntity(res.data);
      setSelectedEntityId(res.data._id);
      openSidebar?.('entity', res.data); // ✅ MỞ SIDEBAR
      toast.success('Đã thêm marker mới');
    } catch (err) {
      console.error(err);
      toast.error('Tạo Marker thất bại');
    }
  };
}

