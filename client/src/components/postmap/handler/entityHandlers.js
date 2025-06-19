// components/postmap/handler/entityHandlers
import toast from 'react-hot-toast';
import { updateEntityGeometry, updateEntityMetadata, createEntity  } from '../../../services/entities';
///////////// Entity handler//////////////
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

export function createEntityHandler({ areaId, addEntity, setSelectedEntityId }) {
  return async ({ type, coordinates, geometry }) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước');
      return;
    }

    try {
      const payload = geometry
        ? { type, geometry }
        : {
            type,
            geometry: {
              type: type === 'marker' ? 'Point' : 'Polygon',
              coordinates: type === 'marker' ? coordinates : [coordinates],
            },
          };

      const res = await createEntity(areaId, payload);
      if (!res.success) throw new Error('Tạo đối tượng thất bại');

      addEntity(res.data); // với _id
      setSelectedEntityId(res.data._id);
      toast.success('Đã thêm đối tượng mới');
    } catch (err) {
      console.error(err);
      toast.error('Tạo đối tượng thất bại');
    }
  };
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