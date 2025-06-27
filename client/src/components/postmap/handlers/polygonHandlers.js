// src/components/postmap/handlers/polygonHandlers.js
//sử dụng mô hình Offline-first

import toast from 'react-hot-toast';


export function createPolygonEntityHandler({ areaId, addEntity, setSelectedEntityId, openSidebar }) {
  return ({ coordinates, geometry }) => {
    if (!window.confirm('Bạn có muốn tạo mới vùng này không?')) return;
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const entityData = {
      _id: tempId,
      areaId,
      type: 'polygon',
      name: 'Polygon tạm thời',
      geometry: geometry ?? {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      metadata: {
        strokeColor: '#3388ff',
        fillColor: '#ffffff',
        strokeOpacity: 1,
        fillOpacity: 0.2,
      },
      isTemp: true,
    };

    addEntity(entityData);
    setSelectedEntityId(tempId);
    openSidebar?.('entity', entityData); // Cho phép chỉnh sửa metadata
    toast.success('Đã tạo vùng (polygon) tạm thời');
  };
}

