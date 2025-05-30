// components/AreaInitializer.jsx
// ✅ Kiểm tra / tạo areaId tạm nhưng không redirect sang route có areaId

import { useEffect } from 'react';
import { getAreaById, createArea } from '../services/areas';
import toast from 'react-hot-toast';
import { useTempAreaId } from '../../hooks/local/useTempAreaId';

/**
 * AreaInitializer
 * - Kiểm tra areaId hiện tại trong localStorage có hợp lệ không
 * - Nếu không: tạo mới area → lưu vào localStorage
 * - Không thay đổi route (vẫn giữ /areas/edit)
 */
export default function AreaInitializer() {
  const { areaId, saveAreaId, clearAreaId } = useTempAreaId();

  useEffect(() => {
    const init = async () => {
      if (areaId) {
        try {
          const area = await getAreaById(areaId);
          if (area?.isDeleted || area?.status === 'published') {
            clearAreaId();
            throw new Error('Area không hợp lệ hoặc đã xuất bản');
          }
          // ✅ Nếu hợp lệ → giữ nguyên
          return;
        } catch (err) {
          console.warn('Area ID không hợp lệ, tạo mới...');
          toast('Khu A cũ không tồn tại, đang tạo khu mới...');
        }
      }

      try {
        const newArea = await createArea();
        saveAreaId(newArea._id);
        toast.success('Đã tạo khu A mới!');
      } catch (err) {
        console.error('Lỗi tạo area:', err);
        toast.error('Không thể tạo khu A mới!');
      }
    };

    init();
  }, []);

  return <div className="p-4 text-center text-gray-500">Đang chuẩn bị khu vực chỉnh sửa...</div>;
}
