// utils/geometry.js
import * as turf from '@turf/turf';

/** Mét → độ địa lý xấp xỉ */
export function metersToDegrees(meters) {
  return meters / 111320;
}

/** [lat, lng] → [lng, lat] */
export const latLngToGeo = (latlngs) => latlngs.map(([lat, lng]) => [lng, lat]);

/** [lng, lat] → [lat, lng] */
export const geoToLatLng = (geocoords) => geocoords.map(([lng, lat]) => [lat, lng]);

/**
 * Tạo polygon doughnut mask xung quanh Khu A
 * @param {Array<Array<number>>} khuAPolygon - Mảng [lat, lng]
 * @param {number} bufferInMeters
 */
export function createBufferedMask(khuAPolygon, bufferInMeters = 30) {
  if (!Array.isArray(khuAPolygon) || khuAPolygon.length < 3) return null;

  const coordinatesLngLat = latLngToGeo(khuAPolygon); // [lng, lat]
  const khuAGeoJson = turf.polygon([coordinatesLngLat]);

  const [minX, minY, maxX, maxY] = turf.bbox(khuAGeoJson);
  const delta = metersToDegrees(bufferInMeters);

  const expandedBBox = [
    minX - delta,
    minY - delta,
    maxX + delta,
    maxY + delta,
  ];

  const outerPolygon = turf.bboxPolygon(expandedBBox);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        outerPolygon.geometry.coordinates[0], // Outer shell
        coordinatesLngLat,                    // Hole
      ],
    },
  };
}
