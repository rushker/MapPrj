// hooks/local/useTempAreaId.js
import { useContext } from 'react';
import { AreaContext } from '../../context/AreaContext';

const LOCAL_KEY = 'currentAreaId';
const LOCAL_MAP_KEY = 'areaCoordinatesMap';

/**
 * Hook quản lý tạm areaId và map từ areaId → coordinates.
 * Đảm bảo an toàn khi gọi ở bất kỳ component nào, kể cả khi không có AreaContext.
 */
export function useTempAreaId() {
  let areaId = null;
  let setAreaId = () => {};

  // Nếu trong Context Provider, thì sử dụng nó
  try {
    const context = useContext(AreaContext);
    if (context) {
      areaId = context.areaId;
      setAreaId = context.setAreaId;
    }
  } catch (err) {
    // Không làm gì — nghĩa là đang ở ngoài Provider
  }

  // Lấy toàn bộ bản đồ areaId → coordinates
  const getCoordinatesMap = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_MAP_KEY)) || {};
    } catch {
      return {};
    }
  };

  const saveAreaId = (id, coords) => {
    if (!id || id === areaId) return;
    const map = getCoordinatesMap();
    map[id] = coords;
    localStorage.setItem(LOCAL_MAP_KEY, JSON.stringify(map));
    localStorage.setItem(LOCAL_KEY, id);
    setAreaId?.(id);
  };

  const clearAreaId = () => {
    localStorage.removeItem(LOCAL_KEY);
    setAreaId?.(null);
  };

  return { areaId, saveAreaId, clearAreaId, getCoordinatesMap };
}
