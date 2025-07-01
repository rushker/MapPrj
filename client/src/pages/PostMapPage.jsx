// src/pages/PostMapPage.jsx
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ROUTES } from '../routes';
import { AreaProvider, useAreaContext } from '../context/AreaContext';
import useAutoSave from '../hooks/local/useAutoSave';
import PostMapWrapper from '../components/postmap/PostMapWrapper';
import { SidebarProvider, useSidebarContext } from '../context/SidebarContext';
import { isValidAreaId } from '../utils/areaUtils';
import * as api from '../services/areas';
import { openAreaEditorHandler } from '../components/postmap/handlers/areaHandlers';
import EntityChangePanel from '../components/postmap/EntityChangePanel';

export default function PostMapPage() {
  return (
    <AreaProvider isEditMode={true}>
      <SidebarProvider>
        <PostMapContent />
      </SidebarProvider>
    </AreaProvider>
  );
}

function PostMapContent() {
  const navigate = useNavigate();
  const { areaId, areaMetadata, entities, area } = useAreaContext();
  const { manualSave, hasUnsavedChanges } = useAutoSave();
  const { sidebarOpen, editingType, openSidebar } = useSidebarContext();

  const [uploading, setUploading] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [changes, setChanges] = useState(null);
  const [showChangePanel, setShowChangePanel] = useState(() => {
    return localStorage.getItem('entityChangePanelShown') === 'true';
  });

  // 🔁 Gọi hàm này trong handler khi tạo entity xong
  const showEntityPanelOnce = () => {
    if (!localStorage.getItem('entityChangePanelShown')) {
      const tempChanges = {
        area,
        entities,
      };
      setChanges(tempChanges);
      setShowChangePanel(true);
      localStorage.setItem('entityChangePanelShown', 'true');
    }
  };

  // Gắn global (ví dụ trong window) nếu cần gọi từ handler bên ngoài
  useEffect(() => {
    window.__triggerEntityPanelOnce = showEntityPanelOnce;
  }, [entities, area]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'Bạn chưa lưu dữ liệu, chắc chắn muốn rời đi?';
        return 'Bạn chưa lưu dữ liệu, chắc chắn muốn rời đi?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleUpload = async () => {
    if (uploading) return;
    setUploading(true);

    const latestChanges = await manualSave();
    setChanges(latestChanges);

    if (!areaId) {
      toast.error('Thiếu areaId để upload');
      setUploading(false);
      return;
    }

    if (latestChanges?.entities?.length === 0 && !latestChanges?.area) {
      toast('Không có thay đổi mới để upload');
      setUploading(false);
      return;
    }

    try {
      await api.publishArea(areaId);
      toast.success('Upload bản đồ thành công');
      navigate(ROUTES.VIEW_MAP(areaId));
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload bản đồ thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between p-4 bg-gray-100 sticky top-0 z-50">
        <button
          onClick={() => navigate(ROUTES.MANAGER_PAGE)}
          className="text-blue-600 hover:underline"
        >
          ← Quay lại danh sách
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            disabled={!areaId || uploading}
            className="btn btn-primary"
          >
            {uploading ? '⏳ Đang upload...' : '📤 Upload bản đồ'}
          </button>
          <button
            onClick={() => navigate(ROUTES.VIEW_MAP(areaId))}
            disabled={!areaId}
            className="btn btn-secondary"
          >
            👁️ Xem thử
          </button>
        </div>
      </header>

      {/* Button chỉnh sửa khu vực */}
      {isValidAreaId(areaId) && !sidebarOpen && editingType !== 'area' && (
        <button
          onClick={openAreaEditorHandler({ areaMetadata, openSidebar })}
          className="absolute top-4 left-4 z-[1000] bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          ✏️ Chỉnh sửa Khu A
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <PostMapWrapper
          selectedEntityId={selectedEntityId}
          onSelectEntity={setSelectedEntityId}
        />
        {showChangePanel && (
          <EntityChangePanel
            changes={changes}
            onSelectEntity={(id) => setSelectedEntityId(id)}
          />
        )}
      </main>
    </div>
  );
}
