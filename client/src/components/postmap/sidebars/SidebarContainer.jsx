// src/components/sidebars/SidebarContainer.jsx
import { lazy, Suspense, memo } from 'react';
import { useSidebarContext } from '../../../context/SidebarContext';

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

  if (!sidebarOpen) return null;

  const SidebarComponent = SIDEBAR_COMPONENTS[editingType];

  const commonProps = {
    onClose: closeSidebar,
    onDelete: handleDelete,
  };

  const sidebarProps =
    editingType === 'area'
      ? {
          metadata: editingData,
          onSave: onSaveAreaMetadata,
          ...commonProps,
        }
      : {
          entity: editingData,
          onChange: setEditingData,
          onSave: onSaveEntity,
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
