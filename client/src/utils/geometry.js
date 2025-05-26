// utils/geometry.js
import * as turf from '@turf/turf';

/**
 * Chuyển đổi mét sang độ (approximate, dùng cho bbox mở rộng).
 * 1 độ ≈ 111,320m
 */
export function metersToDegrees(meters) {
  return meters / 111320;
}

/**
 * Tạo mask polygon bao quanh khu A với 1 khoảng buffer, dạng doughnut
 * @param {Array<Array<number>>} khuAPolygon - Mảng [lat, lng]
 * @param {number} bufferInMeters - Khoảng cách từ khu A ra ngoài mask
 * @returns {GeoJSON Feature<Polygon>} - Mask polygon với hole
 */
export function createBufferedMask(khuAPolygon, bufferInMeters = 30) {
  if (!khuAPolygon || khuAPolygon.length < 3) return null;

  // Đổi từ [lat, lng] → [lng, lat] để tạo GeoJSON hợp lệ
  const coordinatesLngLat = khuAPolygon.map(([lat, lng]) => [lng, lat]);
  const khuAGeoJson = turf.polygon([coordinatesLngLat]);

  // Tính bbox và mở rộng theo khoảng buffer (độ)
  const [minX, minY, maxX, maxY] = turf.bbox(khuAGeoJson);
  const delta = metersToDegrees(bufferInMeters);

  const expandedBBox = [
    minX - delta,
    minY - delta,
    maxX + delta,
    maxY + delta,
  ];

  const outerPolygon = turf.bboxPolygon(expandedBBox);

  // Tạo mask dạng doughnut: outer chứa bbox, inner là hole của khu A
  const mask = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        outerPolygon.geometry.coordinates[0], // Outer shell
        coordinatesLngLat,                    // Inner hole (khu A)
      ],
    },
  };

  return mask;
}
