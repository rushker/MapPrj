// hooks/local/useTempAreaId.js
import { useAreaContext } from '../../context/AreaContext';

const LOCAL_KEY = 'currentAreaId';
const LOCAL_MAP_KEY = 'areaCoordinatesMap';

/**
 * Hook quản lý tạm areaId và map từ areaId → coordinates.
 */
export function useTempAreaId() {
  const { areaId, setAreaId } = useAreaContext();

  // Lấy toàn bộ bản đồ areaId→coordinates
  const getCoordinatesMap = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_MAP_KEY)) || {};
    } catch {
      return {};
    }
  };

  /**
   * Lưu areaId và coords vào localStorage, cũng lưu currentAreaId
   * để có thể restore sau này.
   * @param {string} id
   * @param {Array} coords
   */
  const saveAreaId = (id, coords) => {
    if (!id || id === areaId) return;
    const map = getCoordinatesMap();
    map[id] = coords;
    localStorage.setItem(LOCAL_MAP_KEY, JSON.stringify(map));
    localStorage.setItem(LOCAL_KEY, id);
    setAreaId(id);
  };

  /**
   * Xóa id hiện tại
   */
  const clearAreaId = () => {
    localStorage.removeItem(LOCAL_KEY);
    setAreaId(null);
  };

  return { areaId, saveAreaId, clearAreaId, getCoordinatesMap };
}
