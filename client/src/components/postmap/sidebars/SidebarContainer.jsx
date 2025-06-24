// src/components/sidebars/SidebarContainer.jsx
import { lazy, Suspense, memo, useEffect } from 'react';
import { useSidebarContext } from '../../../context/SidebarContext';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

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

  const { areaId, isEditMode } = useAreaContext();

  useEffect(() => {
  console.log('[SidebarContainer] type/data:', editingType, editingData);
}, [editingType, editingData]);

  if (!isValidAreaId(areaId) || !sidebarOpen) return null;

  const SidebarComponent = SIDEBAR_COMPONENTS[editingType];

  if (!SidebarComponent) {
    return (
      <div className="w-[320px] bg-white border-l h-full shadow-lg p-4 text-gray-500">
        Không tìm thấy Sidebar phù hợp với type: {editingType}
      </div>
    );
  }

  const commonProps = {
    onClose: closeSidebar,
    onDelete: isEditMode ? handleDelete : null,
    isEditMode,
  };

  const sidebarProps =
    editingType === 'area'
      ? {
          metadata: editingData,
          onSave: isEditMode ? onSaveAreaMetadata : null,
          ...commonProps,
        }
      : {
          entity: editingData,
          onChange: isEditMode ? setEditingData : null,
          onSave: isEditMode ? onSaveEntity : null,
          ...commonProps,
        };

  return (
    <div className="w-[320px] bg-white border-l h-full shadow-lg">
      <Suspense fallback={<div className="p-4">Đang tải...</div>}>
        <SidebarComponent {...sidebarProps} />
      </Suspense>
    </div>
  );
}

export default memo(SidebarContainer);
