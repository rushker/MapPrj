// src/components/sidebars/SidebarContainer.jsx
import { lazy, Suspense, memo } from 'react';
import { useSidebarContext } from '../../../context/SidebarContext';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils.js';


const KhuASidebar = lazy(() => import('./areas/KhuASidebar'));
const EntitySidebar = lazy(() => import('./entities/EntitySidebar'));

const SIDEBAR_COMPONENTS = {
  area: KhuASidebar,
  entity: EntitySidebar,
};

function SidebarContainer({ onSaveAreaMetadata, onSaveEntity }) {
  const {
    sidebarOpen,
    editingType,
    editingData,
    setEditingData,
    closeSidebar,
    handleDelete,
  } = useSidebarContext();

  const {areaId, isEditMode } = useAreaContext();
  if (!isValidAreaId(areaId)) return null;

  if (!sidebarOpen) return null;

  const SidebarComponent = SIDEBAR_COMPONENTS[editingType];

  const commonProps = {
    onClose: closeSidebar,
    onDelete: isEditMode ? handleDelete : null, // Chỉ cho phép xóa khi ở chế độ chỉnh sửa
    isEditMode, // Truyền trạng thái chỉnh sửa xuống component con
  };

  const sidebarProps =
    editingType === 'area'
      ? {
          metadata: editingData,
           onSave: isEditMode ? onSaveAreaMetadata : null, // Chỉ cho phép lưu khi chỉnh sửa
           isEditMode,
          ...commonProps,
        }
      : {
           entity: editingData,
          onChange: isEditMode ? setEditingData : null, // Chỉ cho phép thay đổi khi chỉnh sửa
          onSave: isEditMode ? onSaveEntity : null, // Chỉ cho phép lưu khi chỉnh sửa
          isEditMode,
          ...commonProps,
        };

  return (
    <div className="w-[320px] bg-white border-l h-full shadow-lg">
      <Suspense fallback={<div className="p-4">Đang tải...</div>}>
        {SidebarComponent ? (
          <SidebarComponent {...sidebarProps} />
        ) : (
          <div className="p-4 text-gray-500">Chọn một đối tượng để chỉnh sửa.</div>
        )}
      </Suspense>
    </div>
  );
}

export default memo(SidebarContainer);
