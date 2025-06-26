// src/components/postmap/handlers/entityUtils.js
import toast from 'react-hot-toast';
import {
  updateEntityGeometry,
  updateEntityMetadata,
} from '../../../services/entities';

import { createPolygonEntityHandler } from './polygonHandlers';
import { createMarkerEntityHandler } from './markerHandlers';

export function handleCreateEntityDispatcher({ areaId, addEntity, setSelectedEntityId, openSidebar }) {
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




export async function updateEntityGeometryHandler({
  areaId,
  entityId,
  coordinates,
  contextUpdateEntityGeometry,
}) {
  if (!areaId) {
    toast.error('Không tìm thấy areaId');
    return;
  }
  if (!entityId) {
    toast.error('Không tìm thấy entityId');
    return;
  }

  try {
    await updateEntityGeometry(areaId, entityId, { coordinates });
    contextUpdateEntityGeometry(entityId, { coordinates });
    toast.success('Đã cập nhật vị trí/thể hiện hình học của đối tượng');
  } catch (err) {
    console.error(err);
    toast.error('Cập nhật hình học thất bại');
  }
}

export async function saveEntityMetadataHandler({
  areaId,
  entityId,
  metadata,
  contextUpdateEntityMetadata,
}) {
  if (!areaId) {
    toast.error('Vui lòng chọn khu vực trước');
    return;
  }

  try {
    await updateEntityMetadata(areaId, entityId, metadata);
    contextUpdateEntityMetadata(entityId, metadata);
    toast.success('Đã cập nhật thông tin đối tượng');
  } catch (err) {
    console.error('Lỗi khi lưu metadata:', err);
    toast.error(`Lỗi: ${err.message}`);
  }
}
