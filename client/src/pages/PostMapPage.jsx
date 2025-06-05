// src/pages/PostMapPage.jsx
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import useAutoSave from '../hooks/useAutoSave';
import { AreaProvider, useAreaContext } from '../contexts/AreaContext';
import Wrapper from '../components/postmap/Wrapper';
import toast from 'react-hot-toast';
import * as api from '../services/areas'; // Giả định bạn có uploadArea tại đây

// 👉 Bọc toàn bộ page trong AreaProvider
export default function PostMapPage() {
  return (
    <AreaProvider>
      <PostMapContent />
    </AreaProvider>
  );
}

// 👉 Logic chính tách riêng để gọi được useAreaContext
function PostMapContent() {
  const navigate = useNavigate();
  const { manualSave } = useAutoSave();
  const { areaId } = useAreaContext();

  const handleUpload = async () => {
    await manualSave(); // đảm bảo entity + metadata đã được save
    try {
      await api.uploadArea(areaId); // Gọi API upload
      toast.success('Đã upload bản đồ thành công');
      navigate(ROUTES.VIEW_MAP(areaId)); // Điều hướng sau upload
    } catch (error) {
      toast.error('Upload thất bại');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Thanh điều hướng trên cùng */}
      <div className="flex justify-between p-4 bg-gray-100">
        <button onClick={() => navigate(ROUTES.MANAGER_PAGE)}>← Quay lại danh sách</button>
        <div className="flex gap-4">
          <button onClick={handleUpload} className="btn btn-primary">📤 Upload bản đồ</button>
          {areaId && (
            <button onClick={() => navigate(ROUTES.VIEW_MAP(areaId))} className="btn btn-secondary">
              👁️ Xem thử
            </button>
          )}
        </div>
      </div>

      {/* Bản đồ và sidebar */}
      <Wrapper />
    </div>
  );
}
