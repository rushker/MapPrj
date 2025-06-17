// utils/areaUtils.js

const LOCAL_MAP_KEY = 'areaCoordinatesMap';

/**
 * Tìm areaId dựa trên coordinates bằng cách so sánh
 * với bản đồ lưu trong localStorage.
 * @param {Array} coords
 * @returns {string|null}
 */
export function findMatchingAreaIdByCoordinates(coords) {
  let map;
  try {
    map = JSON.parse(localStorage.getItem(LOCAL_MAP_KEY)) || {};
  } catch {
    map = {};
  }

  // So sánh JSON stringify để đơn giản (order must match)
  const target = JSON.stringify(coords);
  for (const [id, savedCoords] of Object.entries(map)) {
    if (JSON.stringify(savedCoords) === target) {
      return id;
    }
  }
  return null;
}
export const isValidAreaId = (areaId) => 
  areaId && typeof areaId === 'string' && areaId.length > 0;

export const isAreaIdReady = (context) => 
  isValidAreaId(context?.areaId) && context?.isEditMode;
