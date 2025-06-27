
// src/components/postmap/handlers/entityUtils.js 
import toast from 'react-hot-toast';
import { createPolygonEntityHandler } from './polygonHandlers';
import { createMarkerEntityHandler } from './markerHandlers';

export function handleCreateEntityDispatcher({ 
  areaId, 
  addEntity, 
  setSelectedEntityId, 
  openSidebar 
}) {
  if (!areaId) {
    console.warn('[handleCreateEntityDispatcher] areaId null');
    return () => {};
  }

  const commonProps = { areaId, addEntity, setSelectedEntityId, openSidebar };

  return ({ type, coordinates, geometry }) => {
    if (type === 'polygon') {
      return createPolygonEntityHandler(commonProps)({ coordinates, geometry });
    } else if (type === 'marker') {
      return createMarkerEntityHandler(commonProps)({ coordinates, geometry });
    } else {
      console.warn('[handleCreateEntityDispatcher] Không hỗ trợ type:', type);
    }
  };
}

// Cập nhật geometry chỉ thay đổi trong store local
export function updateEntityGeometryHandler({
  entityId,
  coordinates,
  contextUpdateEntityGeometry, // Hàm cập nhật trong context
}) {
  if (!entityId) {
    toast.error('Không tìm thấy entityId');
    return;
  }

  // Chỉ cập nhật local store, không gọi API
  contextUpdateEntityGeometry(entityId, { coordinates });
  toast.success('Đã cập nhật bản nháp');
}

// Cập nhật metadata chỉ trong store local
export function saveEntityMetadataHandler({
  entityId,
  metadata,
  contextUpdateEntityMetadata, // Hàm cập nhật trong context
}) {
  if (!entityId) {
    toast.error('Không tìm thấy entity');
    return;
  }

  // Chỉ cập nhật local store, không gọi API
  contextUpdateEntityMetadata(entityId, metadata);
  toast.success('Đã lưu thay đổi vào bản nháp');
}