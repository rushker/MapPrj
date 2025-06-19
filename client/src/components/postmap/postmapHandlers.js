// src/components/postmap/postmapHandlers.js
import toast from 'react-hot-toast';
import { createArea, updateAreaPolygon, updateArea } from '../../services/areas';
import { updateEntityGeometry, updateEntityMetadata } from '../../services/entities';

export function createAreaHandler({ mapRef, setIsCreatingArea, saveAreaId, openSidebar }) {
  return async ({ coordinates, polygon }) => {
    if (!window.confirm('Bạn có chắc muốn tạo khu vực này?')) return;
    
    // Kiểm tra coordinates hợp lệ (giống luồng cũ)
    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length < 3 ||
      coordinates.some(c => 
        !Array.isArray(c) || 
        c.length !== 2 || 
        c.includes(undefined) || 
        c.includes(null)
      )
    ) {
      toast.error('Tọa độ không hợp lệ để tạo khu vực');
      return;
    }

    const currentZoom = mapRef.current?.getZoom();
    const maxZoom = typeof currentZoom === 'number' ? currentZoom : 18;

    setIsCreatingArea(true);
    try {
      const res = await createArea({ coordinates, polygon, maxZoom });
      if (!res.success || !res.data?._id) throw new Error('Tạo khu vực thất bại');

      const newId = res.data._id;
      saveAreaId(newId, coordinates);
      toast.success('Đã tạo khu vực thành công!');
      
      // CHỈ MỞ SIDEBAR KHI THÀNH CÔNG
      if (res.data && openSidebar) {
        openSidebar('area', res.data);
      }
      
      return newId;
    } catch (err) {
      console.error(err);
      toast.error('Tạo khu vực thất bại: ' + err.message);
      return null;
    } finally {
      setIsCreatingArea(false);
    }
  };
}
// THÊM HÀM MỚI CHO EDIT AREA
export const openAreaEditorHandler = ({ areaMetadata, openSidebar }) => {
  return () => {
    if (areaMetadata && openSidebar) {
      openSidebar('area', areaMetadata);
    }
  };
};

export async function updatePolygonHandler({ areaId, coordinates, setAreaMetadata }) {
  if (!areaId) {
    toast.error('Chưa có khu vực để cập nhật polygon');
    return;
  }
  try {
    const res = await updateAreaPolygon(areaId, { polygon: coordinates });
    if (!res.success) throw new Error('Backend cập nhật polygon thất bại');
    setAreaMetadata(res.data);
    toast.success('Cập nhật polygon thành công!');
  } catch (err) {
    console.error(err);
    toast.error('Cập nhật polygon thất bại: ' + err.message);
  }
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
  return (entity) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước khi thêm đối tượng');
      return;
    }
    addEntity(entity);
    setSelectedEntityId(entity._id);
  };
}

export async function saveAreaMetadataHandler({ areaId, metadata, setAreaMetadata }) {
  if (!areaId) {
    toast.error('Không tìm thấy areaId để lưu metadata');
    return;
  }
  try {
    const res = await updateArea(areaId, metadata);
    if (!res.success) throw new Error('Lưu metadata thất bại từ server');
    setAreaMetadata(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
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
