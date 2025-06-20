// src/components/postmap/handlers/sharedEntityUtils.js
import toast from 'react-hot-toast';
import {
  updateEntityGeometry,
  updateEntityMetadata,
} from '../../../services/entities';

export function handleCreateEntityDispatcher({ areaId, addEntity, setSelectedEntityId }) {
  return async ({ type, coordinates, geometry }) => {
    const common = { areaId, addEntity, setSelectedEntityId };

    if (type === 'polygon') {
      await createPolygonEntityHandler(common)({ coordinates, geometry });
    } else if (type === 'marker') {
      await createMarkerEntityHandler(common)({ coordinates, geometry });
    } else {
      console.warn(`Không hỗ trợ type: ${type}`);
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
