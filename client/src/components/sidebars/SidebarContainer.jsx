// src/components/sidebars/SidebarContainer.jsx
import { lazy, Suspense, useContext, memo } from 'react';
import { SidebarContext } from '../../context/SidebarContext';

const KhuASidebar = lazy(() => import('./KhuASidebar'));
const KhuCSidebar = lazy(() => import('./KhuCSidebar'));
const MarkerSidebar = lazy(() => import('./MarkerSidebar'));

const sidebarMap = {
  khuA: KhuASidebar,
  khuC: KhuCSidebar,
  marker: MarkerSidebar,
};

function SidebarContainer() {
  const {
    activeTab,
    editingEntity,
    setEditingEntity,
    handleSave,
    handleDelete,
  } = useContext(SidebarContext);

  const SidebarComponent = sidebarMap[activeTab];

  return (
    <div className="w-[300px] bg-white">
      <Suspense fallback={<div className="p-4">Đang tải...</div>}>
        {SidebarComponent && editingEntity ? (
          <SidebarComponent
            entity={editingEntity}
            onChange={setEditingEntity}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : (
          <div className="p-4 text-gray-500">Chọn một đối tượng để chỉnh sửa.</div>
        )}
      </Suspense>
    </div>
  );
}

export default memo(SidebarContainer);
