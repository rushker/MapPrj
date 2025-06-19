// src/pages/PostMapPage.jsx
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { ROUTES } from '../routes';
import { AreaProvider, useAreaContext } from '../context/AreaContext';
import useAutoSave from '../hooks/local/useAutoSave';
import PostMapWrapper from '../components/postmap/PostMapWrapper';
import { useSidebarContext } from '../context/SidebarContext';
import { isValidAreaId } from '../utils/areaUtils';
import * as api from '../services/areas'; // 🔧 đảm bảo đã import đúng

export default function PostMapPage() {
  return (
    <AreaProvider isEditMode={true}>
      <PostMapContent />
    </AreaProvider>
  );
}

function PostMapContent() {
  const navigate = useNavigate();
  const { areaId, areaMetadata } = useAreaContext();
  const { manualSave } = useAutoSave();
  const { sidebarOpen, editingType } = useSidebarContext();

  // để nhận lại openSidebar từ PostMapWrapper
  const [openSidebarFunc, setOpenSidebarFunc] = useState(null);

  const handleUpload = async () => {
    await manualSave();
    if (!areaId) {
      toast.error('Thiếu areaId để upload');
      return;
    }

    try {
      await api.publishArea(areaId);
      toast.success('Upload bản đồ thành công');
      navigate(ROUTES.VIEW_MAP(areaId));
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload bản đồ thất bại');
    }
  };

  const handleOpenSidebar = () => {
    if (typeof openSidebarFunc === 'function') {
      openSidebarFunc('area', areaMetadata);
    }
  };

  return (
    <div className="flex flex-col h-screen">
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
            disabled={!areaId}
            className="btn btn-primary"
          >
            📤 Upload bản đồ
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

      {/* Nút chỉnh sửa Khu A */}
      {isValidAreaId(areaId) && !sidebarOpen && editingType !== 'area' && (
        <button
          onClick={handleOpenSidebar}
          className="absolute top-4 left-4 z-[1000] bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          ✏️ Chỉnh sửa Khu A
        </button>
      )}

      <main className="flex-1 relative">
        <PostMapWrapper onExposeSidebar={setOpenSidebarFunc} />
      </main>
    </div>
  );
}
