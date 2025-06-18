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
  const [isCreatingArea, setIsCreatingArea] = useState(false); // Thêm state này
  /**
   * Triggers manual save (auto-save chạy theo debounce),
   * rồi gọi API publish/upload area và chuyển hướng.
   */
  const handleUpload = async () => {
    // 1. Lưu tất cả thay đổi còn chờ
    await manualSave();
    if (!areaId) {
      toast.error('Thiếu areaId để upload');
      return;
    }

    try {
      // 2. Gọi API uploadArea (tương tự publish)
      await api.publishArea(areaId);
      toast.success('Upload bản đồ thành công');
      // 3. Điều hướng sang trang xem public
      navigate(ROUTES.VIEW_MAP(areaId));
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload bản đồ thất bại');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between p-4 bg-gray-100">
        <button
          onClick={() => navigate(ROUTES.MANAGER_PAGE)}
          className="text-blue-600 hover:underline"
        >
          ← Quay lại danh sách
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.info('🟩 Kích hoạt chế độ vẽ Rectangle. Click lên bản đồ để bắt đầu.');
              setIsCreatingArea(true);
            }}
            disabled={isCreatingArea}
            className="btn btn-primary"
          >
            🟩 Vẽ Rectangle
          </button>
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

      {/* Map & Sidebar */}
      <main className="flex-1">
          {/* TRUYỀN STATE XUỐNG WRAPPER */}
        <PostMapWrapper 
        isCreatingArea={isCreatingArea} 
        setIsCreatingArea={setIsCreatingArea} 
        />

      </main>
    </div>
  );
}
