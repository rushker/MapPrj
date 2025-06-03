// src/pages/PostMapPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, useSidebarContext } from '../context/SidebarContext';
import MapWrapper from '../components/postmap/MapWrapper';
import SidebarContainer from '../components/sidebars/SidebarContainer';
import { ROUTES } from '../routes'

import useArea from '../hooks/use/useMapArea';
import useMapEntities from '../hooks/use/useMapEntities';

// Tách ra component con để dùng useSidebarContext hook
function PostMapContent({ projectId, areaId }) {
  const navigate = useNavigate();

  const {
    khuA,
    loading: loadingA,
    error: errorA,
    saveKhuA,
    removeKhuA,
    setKhuA,
  } = useArea(projectId, areaId);

  const {
    entities,
    khuCs,
    markers,
    loading: loadingE,
    createEntity,
    updateEntity,
    deleteEntity,
    refresh,
  } = useMapEntities(projectId, areaId);

  useEffect(() => {
    if (khuA?._id) refresh();
  }, [khuA, refresh]);

  const {
    editingEntity,
    openSidebar,
  } = useSidebarContext();

  if (loadingA || loadingE) return <div>Đang tải...</div>;
  if (errorA) return <div>Lỗi: {errorA.message}</div>;

  // Nút chuyển sang ViewMap chỉ hiển thị khi có khuA (areaId)
  const canViewMap = Boolean(khuA?._id);

  return (
    <div className="flex h-screen relative">
      {/* Nút chuyển sang chế độ xem bản đồ */}
      {canViewMap && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={() => navigate(ROUTES.VIEW_MAP(projectId, khuA._id))}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            title="Chuyển sang chế độ xem bản đồ"
          >
            Xem bản đồ
          </button>
        </div>
      )}

      <MapWrapper
        center={[21.0278, 105.8342]}
        zoom={13}
        enableDraw={!khuA}
        drawShape="Rectangle"
        onCreateKhuA={(coords) =>
          setKhuA({ ...khuA, coordinates: coords })
        }
        onSaveKhuA={saveKhuA}
        onDeleteKhuA={removeKhuA}
        khuA={khuA}
        entities={entities}
        selectedEntityId={editingEntity?._id || null}
        onSelectEntity={(id) => {
          const entity = entities.find(e => e._id === id);
          if (entity) openSidebar(entity.type, entity);
        }}
        onUpdateEntity={(id, data) => updateEntity(id, data)}
        onDeleteEntity={(id) => deleteEntity(id)}
        onCreateEntity={(entity) => createEntity(entity.type, entity)}
      />

      <SidebarContainer
        khuA={khuA}
        onSaveKhuA={saveKhuA}
        onDeleteKhuA={removeKhuA}
        khuCs={khuCs}
        markers={markers}
        onSaveEntity={(id, data) =>
          id ? updateEntity(id, data) : createEntity(data.type, data)
        }
        onDeleteEntity={(id) => deleteEntity(id)}
      />
    </div>
  );
}

export default function PostMapPage() {
  const { projectId, areaId } = useParams();

  return (
    <SidebarProvider>
      <PostMapContent projectId={projectId} areaId={areaId} />
    </SidebarProvider>
  );
}
