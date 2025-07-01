// src/components/postmap/handlers/markerHandlers.js
//sử dụng mô hình Offline-first
import toast from 'react-hot-toast';

export function createMarkerEntityHandler({ areaId, addEntity, setSelectedEntityId, openSidebar }) {
  return ({ coordinates, geometry }) => {
    if (!window.confirm('Bạn có muốn tạo mới điểm này không?')) return;
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const entityData = {
      _id: tempId,
      areaId,
      type: 'marker',
      geometry: geometry ?? {
        type: 'Point',
        coordinates,
      },
      name: 'Điểm tạm thời',
      metadata: {
        strokeOpacity: 1,
        fillColor: '#ffffff',
      },
      isTemp: true,
    };

    addEntity(entityData);
    setSelectedEntityId(tempId);
    openSidebar?.('entity', entityData); // Mở sidebar để chỉnh sửa
    toast.success('Đã tạo marker tạm thời');

    // ✅ Gọi panel nếu chưa hiện
    if (typeof window.__triggerEntityPanelOnce === 'function') {
      window.__triggerEntityPanelOnce();
    }
  };
}
