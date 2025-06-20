// src/components/postmap/handlers/markerHandlers.js
import toast from 'react-hot-toast';
import { createEntity } from '../../../services/entities';

export function createMarkerEntityHandler({ areaId, addEntity, setSelectedEntityId }) {
  return async ({ coordinates, geometry }) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    try {
      const payload = geometry ?? {
        type: 'Point',
        coordinates,
      };

      const res = await createEntity(areaId, { type: 'marker', geometry: payload });
      if (!res.success) throw new Error();

      addEntity(res.data);
      setSelectedEntityId(res.data._id);
      toast.success('Đã thêm marker mới');
    } catch (err) {
      console.error(err);
      toast.error('Tạo Marker thất bại');
    }
  };
}
