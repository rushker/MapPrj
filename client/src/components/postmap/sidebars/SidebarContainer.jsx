// src/components/sidebars/SidebarContainer.jsx
import { lazy, Suspense, memo } from 'react';
import { useSidebarContext } from '../../../context/SidebarContext';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils.js';

const KhuASidebar = lazy(() => import('./areas/KhuASidebar'));
const PolygonSidebar = lazy(() => import('./entities/PolygonSidebar'));
const MarkerSidebar = lazy(() => import('./entities/MarkerSidebar'));

const SIDEBAR_COMPONENTS = {
  area: KhuASidebar,
  polygon: PolygonSidebar,
  marker: MarkerSidebar,
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
  if (!isValidAreaId(areaId)) return null;
  if (!sidebarOpen) return null;

  const SidebarComponent = SIDEBAR_COMPONENTS[editingType];

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
