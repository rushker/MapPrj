// hooks/local/useTempAreaId.js
// ✅ Hook quản lý areaId tạm thời trong localStorage (không phụ thuộc route)
import { useAreaContext } from '../contexts/AreaContext';

const LOCAL_KEY = 'currentAreaId';

/**
 * useTempAreaId
 * - Lưu và lấy areaId đang chỉnh sửa từ localStorage
 */
export function useTempAreaId() {
  const { areaId, setAreaId } = useAreaContext();

  const saveAreaId = (id) => {
    localStorage.setItem(LOCAL_KEY, id);
    setAreaId(id);
  };

  const clearAreaId = () => {
    localStorage.removeItem(LOCAL_KEY);
    setAreaId(null);
  };

  return { areaId, saveAreaId, clearAreaId };
}