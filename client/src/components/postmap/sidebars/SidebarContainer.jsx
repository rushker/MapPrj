// src/components/sidebars/SidebarContainer.jsx
import { lazy, Suspense, memo } from 'react';
import { useSidebarContext } from '../../../context/SidebarContext';

// Lazy load từng sidebar theo loại chỉnh sửa
const KhuASidebar = lazy(() => import('./areas/KhuASidebar'));
const EntitySidebar = lazy(() => import('./entities/EntitySidebar'));

// Mapping sidebar component theo loại
const SIDEBAR_COMPONENTS = {
  area: KhuASidebar,
  entity: EntitySidebar,
};

function SidebarContainer() {
  const {
    sidebarOpen,
    editingType,
    editingEntity,
    setEditingEntity,
    handleSave,
    handleDelete,
    closeSidebar,
  } = useSidebarContext();

  if (!sidebarOpen) return null;

  const SidebarComponent = SIDEBAR_COMPONENTS[editingType];

  return (
    <div className="w-[320px] bg-white border-l h-full shadow-lg">
      <Suspense fallback={<div className="p-4">Đang tải...</div>}>
        {SidebarComponent && editingEntity ? (
          <SidebarComponent
            entity={editingEntity}
            onChange={setEditingEntity}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeSidebar}
          />
        ) : (
          <div className="p-4 text-gray-500">Chọn một đối tượng để chỉnh sửa.</div>
        )}
      </Suspense>
    </div>
  );
}

export default memo(SidebarContainer);
