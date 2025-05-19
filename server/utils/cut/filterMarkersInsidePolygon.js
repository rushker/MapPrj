// utils/cut/filterMarkersInPolygon.js
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

/**
 * Kiểm tra xem một điểm có nằm trong polygon hay không
 * @param {Object} markerLocation { lat, lng }
 * @param {Object} polygon GeoJSON Polygon (Leaflet format)
 */
export const pointInPolygon = (markerLocation, polygon) => {
  const turfPoint = point([markerLocation.lng, markerLocation.lat]);
  return booleanPointInPolygon(turfPoint, polygon);
};
