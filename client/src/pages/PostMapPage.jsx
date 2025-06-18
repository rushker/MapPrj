// src/pages/PostMapPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ROUTES } from '../routes';
import { AreaProvider, useAreaContext } from '../context/AreaContext';
import useAutoSave from '../hooks/local/useAutoSave';
import PostMapWrapper from '../components/postmap/PostMapWrapper';

/**
 * PostMapPage:
 * - Wrap AreaProvider để cấp context areaId, metadata, entities
 * - Hiển thị header với nút quay lại và upload
 * - Sử dụng PostMapWrapper để xử lý map + sidebar
 */
export default function PostMapPage() {
  return (
    <AreaProvider isEditMode={true}>
      <PostMapContent />
    </AreaProvider>
  );
}

function PostMapContent() {
  const navigate = useNavigate();
  const { areaId } = useAreaContext();
  const { manualSave } = useAutoSave();

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
          {/* ĐÃ LOẠI BỎ NÚT VẼ RECTANGLE TÙY CHỈNH */}
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

      <main className="flex-1">
        {/* ĐÃ LOẠI BỎ isCreatingArea */}
        <PostMapWrapper />
      </main>
    </div>
  );
}