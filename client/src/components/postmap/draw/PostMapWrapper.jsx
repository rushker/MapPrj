// src/components/postmap/PostMapWrapper.jsx

import { useState } from 'react';
import LeafletMap from './LeafletMap';
import SidebarContainer from '../sidebars/SidebarContainer';
import { createArea, updateAreaPolygon,updateArea } from '../../../services/areas';
import { useTempAreaId } from '../../../hooks/local/useTempAreaId';
import { useAreaContext } from '../../../context/AreaContext';
import toast from 'react-hot-toast';
import useAutoSave from '../../../hooks/local/useAutoSave';
/**
 * PostMapWrapper.jsx
 * 
 * Vai trò:
 * - Bao bọc toàn bộ giao diện bản đồ + sidebar chỉnh sửa metadata
 * - Quản lý logic tạo khu vực (Khu A) và entity (Khu C/marker)
 * - Đồng bộ dữ liệu khu vực, entities, areaId qua context và localStorage
 * 
 * Luồng:
 * - Khi tạo khu vực mới: gọi API tạo khu vực (polygon + metadata mặc định)
 * - Khi chỉnh sửa polygon khu vực: gọi API cập nhật polygon
 * - Khi tạo entity mới: thêm entity vào context entities
 * - Truyền callback, flag edit xuống LeafletMap để bật tính năng vẽ, chỉnh sửa
 * - SidebarContainer dùng context để hiện thông tin và chỉnh sửa metadata
 */
export default function PostMapWrapper() {
  const isEditMode = true; // luôn bật chế độ chỉnh sửa ở component này
  useAutoSave();
  const { saveAreaId } = useTempAreaId();
  const { areaId, areaMetadata, setAreaMetadata, addEntity, updateEntity } = useAreaContext();
  const [selectedEntityId, setSelectedEntityId] = useState(null);

  // Khi user hoàn thành vẽ khu vực mới (polygon Khu A)
  const handleCreateArea = async (polygonCoords) => {
    if (!window.confirm('Bạn có chắc muốn tạo khu vực này?')) return;

    try {
      // Chuẩn hóa polygonCoords từ Leaflet (LatLng) sang định dạng backend cần (array 2D: [[lat, lng],...])
      // Giả định polygonCoords: array of LatLng arrays, ví dụ: [[lat, lng], [lat, lng], ...]
      // Backend chờ nhận object polygon GeoJSON hoặc mảng tọa độ => tùy backend ta convert tương ứng

      // Gửi lên backend payload gồm polygon (mảng tọa độ), plus các metadata mặc định (name, type,...)
      const areaPayload = {
        // Backend model mong đợi có dạng GeoJSON polygon
        polygon: polygonCoords,
        name: 'Khu chưa đặt tên',
        type: 'default', // mặc định có thể đổi tùy nghiệp vụ
        opacity: 0.2,
        lockedZoom: false,
      };

      const response = await createArea(areaPayload);

      if (response.success) {
        // Lưu areaId mới vào localStorage và context
        saveAreaId(response.data._id);
        setAreaMetadata(response.data);
        toast.success('Đã tạo khu vực!');

      } else {
        throw new Error('Backend tạo khu vực thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Tạo khu vực thất bại: ' + err.message);
    }
  };

  // Khi user chỉnh sửa polygon khu vực (ví dụ kéo đỉnh, sửa hình)
  // Lưu ý: Cần cung cấp callback cho LeafletMap để gọi khi polygon thay đổi
  const handleUpdatePolygon = async (updatedPolygonCoords) => {
    if (!areaId) {
      toast.error('Chưa có khu vực để cập nhật polygon');
      return;
    }
    try {
      // Gửi lên backend để cập nhật polygon (GeoJSON hoặc mảng tọa độ)
      const response = await updateAreaPolygon(areaId, { polygon: updatedPolygonCoords });
      if (response.success) {
        setAreaMetadata(response.data); // Cập nhật lại metadata khu vực mới nhất
        toast.success('Cập nhật polygon thành công!');
      } else {
        throw new Error('Backend cập nhật polygon thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật polygon thất bại: ' + err.message);
    }
  };

  // Khi user hoàn thành vẽ entity mới (polygon/marker Khu C)
  const handleCreateEntity = (entity) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước khi thêm đối tượng');
      return;
    }

    addEntity(entity);
    setSelectedEntityId(entity._id);
  };

  const handleSaveAreaMetadata = async (metadata) => {
  if (!areaId) {
    toast.error('Không tìm thấy areaId để lưu metadata');
    return;
  }

  try {
    const response = await updateArea(areaId, metadata);
    if (response.success) {
      setAreaMetadata(response.data); // cập nhật metadata mới nhất vào context
      return response.data;
    } else {
      throw new Error('Lưu metadata thất bại từ phía server');
    }
  } catch (err) {
    console.error(err);
    throw err; // cho phép component gọi xử lý lỗi
  }
};
const handleSaveEntityMetadata = async (entityId, updatedMetadata) => {
    try {
      // Lưu vào local context
      updateEntity(entityId, updatedMetadata);

      // Nếu muốn gọi API backend ngay: trường hợp lưu trực tiếp
      // await updateEntityAPI(entityId, updatedMetadata); 

      toast.success('Đã lưu metadata của đối tượng');
    } catch (err) {
      console.error(err);
      toast.error('Lưu metadata thất bại');
    }
  };
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1">
        <LeafletMap
          areaMetadata={areaMetadata}
          selectedEntityId={selectedEntityId}
          onSelectEntity={setSelectedEntityId}

          // Bật full tính năng chỉnh sửa để dùng cho edit mode
          enableDraw={isEditMode}
          drawShape={null} // có thể set từ UI riêng để điều khiển, tạm null
          enableEdit={isEditMode}
          enableDrag={isEditMode}
          enableRemove={isEditMode}

          onCreateArea={handleCreateArea}
          onUpdatePolygon={handleUpdatePolygon}  // thêm callback cập nhật polygon

          onCreateEntity={handleCreateEntity}

          readOnly={!isEditMode} // false để cho phép tương tác chỉnh sửa
        />
      </div>

      {/* Sidebar chỉnh sửa metadata */}
      <SidebarContainer
      onSaveAreaMetadata={handleSaveAreaMetadata}
      onSaveEntity={handleSaveEntityMetadata}
      />
    </div>
  );
}

