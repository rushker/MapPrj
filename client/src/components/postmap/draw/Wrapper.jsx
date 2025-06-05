// src/components/postmap/Wrapper.jsx

import { useState } from 'react';
import LeafletMap from './LeafletMap';
import SidebarContainer from '../sidebars/SidebarContainer';
import { createArea } from '../../../services/areas';
import { useTempAreaId } from '../../../hooks/local/useTempAreaId';
import { useAreaContext } from '../../../context/AreaContext';
import toast from 'react-hot-toast';

/**
 * Wrapper.jsx
 * 
 * ✅ Vai trò chính:
 *   - Quản lý toàn bộ giao diện bản đồ và sidebar (chỉnh sửa metadata)
 *   - Xử lý logic tạo khu vực (Khu A) và entity (Khu C, markers)
 *   - Dữ liệu được đồng bộ qua context (`AreaContext`) và localStorage
 * 
 * ⚠️ Lưu ý:
 *   - `areaId` là ID quan trọng dùng để định danh khu vực đang làm việc
 *   - Chỉ khi có `areaId` thì hệ thống mới cho phép thêm/sửa entity, metadata, v.v.
 */
export default function Wrapper() {
  const { saveAreaId } = useTempAreaId();

  const {
    areaId,
    areaMetadata,
    setAreaMetadata,
    entities,
    addEntity,
  } = useAreaContext();

  const [selectedEntityId, setSelectedEntityId] = useState(null);

  /**
   * ✅ Gọi khi người dùng vẽ và xác nhận tạo Khu A
   */
  const handleCreateArea = async (polygon) => {
    const confirmed = window.confirm('Bạn có chắc muốn tạo khu vực này?');
    if (!confirmed) return;

    try {
      const created = await createArea(polygon);
      saveAreaId(created._id);
      setAreaMetadata(created);
      toast.success('Đã tạo khu vực!');
    } catch (err) {
      console.error(err);
      toast.error('Tạo khu vực thất bại');
    }
  };

  /**
   * ✅ Gọi khi người dùng vẽ xong 1 entity
   */
  const handleCreateEntity = (entity) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước khi thêm đối tượng (polygon hoặc marker)');
      return;
    }

    addEntity(entity);
    setSelectedEntityId(entity._id);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1">
        <LeafletMap
          areaMetadata={areaMetadata}
          entities={entities}
          selectedEntityId={selectedEntityId}
          onSelectEntity={setSelectedEntityId}
          onCreateArea={handleCreateArea}
          onCreateEntity={handleCreateEntity}
          enableDraw={true}
          drawShape={null}
          enableEdit={true}
          enableDrag={true}
          enableRemove={true}
        />
      </div>

      <SidebarContainer />
    </div>
  );
}
