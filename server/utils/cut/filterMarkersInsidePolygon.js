// utils/cut/filterMarkersInPolygon.js
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

/**
 * Kiểm tra xem một điểm có nằm trong polygon hay không
 * @param {Object} markerLocation - Vị trí marker dạng { lat, lng }
 * @param {Array} polygon - Tọa độ polygon theo định dạng GeoJSON ([[[lng, lat], ...]])
 * @returns {boolean} - Trả về true nếu điểm nằm trong polygon
 */
export const pointInPolygon = (markerLocation, polygon) => {
  // Tạo GeoJSON Point từ tọa độ marker
  const turfPoint = point([markerLocation.lng, markerLocation.lat]);
  
  // Tạo GeoJSON Polygon
  const turfPolygon = {
    type: 'Polygon',
    coordinates: polygon
  };
  
  // Kiểm tra điểm có nằm trong polygon không
  return booleanPointInPolygon(turfPoint, turfPolygon);
};
