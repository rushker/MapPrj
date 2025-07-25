// components/postmap/handler/areaHandlers
import toast from 'react-hot-toast';
import { createArea, updateAreaPolygon, updateArea } from '../../../services/areas';

///////////// Area Handler /////////////////////
export function createAreaHandler({ mapRef, setIsCreatingArea, saveAreaId, openSidebar,setAreaMetadata  }) {
  return async ({ coordinates, polygon, maxZoom }) => {
    if (!window.confirm('Bạn có chắc muốn tạo khu vực này?')) return;

    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length < 3 ||
      coordinates.some(c =>
        !Array.isArray(c) || c.length !== 2 || c.includes(undefined) || c.includes(null)
      )
    ) {
      toast.error('Tọa độ không hợp lệ để tạo khu vực');
      return;
    }

    const zoom = typeof maxZoom === 'number'
      ? maxZoom
      : mapRef.current?.getZoom() ?? 18;

    setIsCreatingArea(true);
    try {
      const res = await createArea({ coordinates, polygon, maxZoom: zoom });
      console.log('>>> API RESPONSE:', res);
      if (!res.success || !res.data?._id) throw new Error('Tạo khu vực thất bại');
       setAreaMetadata?.(res.data);

      saveAreaId(res.data._id, coordinates);
      toast.success('Đã tạo khu vực thành công!');

      openSidebar?.('area', res.data);
      return res.data._id;
    } catch (err) {
      console.error('>>> CREATE ERROR:', err);
      toast.error('Tạo khu vực thất bại: ' + err.message);
      return null;
    } finally {
      setIsCreatingArea(false);
    }
  };
}
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