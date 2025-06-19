// src/pages/PostMapPage.jsx
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '../routes';
import { AreaProvider, useAreaContext } from '../context/AreaContext';
import useAutoSave from '../hooks/local/useAutoSave';
import PostMapWrapper from '../components/postmap/PostMapWrapper';
import { updateArea } from '../services/areas';
import { updateEntityMetadata } from '../services/entities';

export default function PostMapPage() {
  return (
    <AreaProvider isEditMode={true}>
      <PostMapContent />
    </AreaProvider>
  );
}

function PostMapContent() {
  const navigate = useNavigate();
  const { areaId, setAreaMetadata } = useAreaContext();
  const { manualSave } = useAutoSave();

  // ✅ Callback upload bản đồ
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

  // ✅ Callback lưu metadata khu vực
  const handleSaveAreaMetadata = async (metadata) => {
    if (!areaId) {
      toast.error('Không tìm thấy areaId để lưu metadata');
      return;
    }

    try {
      const res = await updateArea(areaId, metadata);
      if (!res.success) throw new Error('Lưu metadata thất bại từ server');
      setAreaMetadata(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error('Lưu metadata thất bại');
    }
  };

  // ✅ Callback lưu metadata của entity
  const handleSaveEntityMetadata = async (entityId, metadata) => {
    if (!areaId) {
      toast.error('Vui lòng chọn khu vực trước');
      return;
    }

    try {
      await updateEntityMetadata(areaId, entityId, metadata);
      toast.success('Đã cập nhật thông tin đối tượng');
    } catch (err) {
      console.error('Lỗi khi lưu metadata:', err);
      toast.error('Lưu metadata thất bại');
    }
  };

  // ✅ Callback sau khi tạo area thành công
  const handleCreateAreaSuccess = (areaData) => {
    // Có thể dùng cho debug, toast, hoặc mở sidebar thủ công (nếu cần)
    console.log('✅ Area vừa tạo:', areaData);
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

      <main className="flex-1">
        <PostMapWrapper
          onSaveAreaMetadata={handleSaveAreaMetadata}
          onSaveEntityMetadata={handleSaveEntityMetadata}
          onCreateAreaSuccess={handleCreateAreaSuccess}
        />
      </main>
    </div>
  );
}
