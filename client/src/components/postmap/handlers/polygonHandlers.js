// src/components/postmap/handlers/polygonHandlers.js
import toast from 'react-hot-toast';
import { createEntity } from '../../../services/entities';

export function createPolygonEntityHandler({ areaId, addEntity, setSelectedEntityId }) {
  return async ({ coordinates, geometry }) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    try {
      const payload = geometry ?? {
        type: 'Polygon',
        coordinates: [coordinates],
      };

      const res = await createEntity(areaId, { type: 'polygon', geometry: payload });
      if (!res.success) throw new Error();

      addEntity(res.data);
      setSelectedEntityId(res.data._id);
      toast.success('Đã thêm vùng (Polygon)');
    } catch (err) {
      console.error(err);
      toast.error('Tạo Polygon thất bại');
    }
  };
}
