// hooks/local/useTempAreaId.js
import { useContext, useState } from 'react';
import { AreaContext } from '../../context/AreaContext';

const LOCAL_KEY = 'currentAreaId';
const LOCAL_MAP_KEY = 'areaCoordinatesMap';

export function useTempAreaId() {
  // Nếu không dùng Context, ta dùng local state tạm
  const [tempCoordinates, setTempCoordinates] = useState(null);

  let areaId = null;
  let setAreaId = () => {};

  try {
    const context = useContext(AreaContext);
    if (context) {
      areaId = context.areaId;
      setAreaId = context.setAreaId;
    }
  } catch (err) {
    // Không có context → an toàn bỏ qua
  }

  const getCoordinatesMap = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_MAP_KEY)) || {};
    } catch {
      return {};
    }
  };

  const saveAreaId = (id, coords) => {
    if (!id) return;
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

  return {
    areaId,
    saveAreaId,
    clearAreaId,
    getCoordinatesMap,
    tempCoordinates,
    setTempCoordinates,
    hasTempCoordinates: !!tempCoordinates,
    canCreateArea: !!tempCoordinates && !areaId
  };
}
