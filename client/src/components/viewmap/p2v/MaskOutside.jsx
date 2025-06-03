// src/components/viewmap/p2v/MaskOutside.jsx
import { GeoJSON } from 'react-leaflet';
import { createBufferedMask } from '@/utils/geometry';

/**
 * Tự động tính khoảng buffer (mét) theo cấp độ zoom
 * @param {number} zoom
 * @returns {number} buffer in meters
 */
function getBufferFromZoom(zoom) {
  const meterPerZoom = {
    22: 1,
    21: 2,
    20: 5,
    19: 10,
    18: 20,
    17: 40,
    16: 80,
    15: 160,
    14: 320,
    13: 640,
    12: 1280,
    11: 2000,
    10: 4000,
  };
  return meterPerZoom[zoom] || 1000;
}

/**
 * MaskOutside - render hiệu ứng vùng mờ bên ngoài Khu A (mask với lỗ)
 * @param {Array<Array<number>>} khuAPolygon - Mảng [lat, lng] của Khu A
 * @param {number} maxZoom - MaxZoom dùng để tính khoảng buffer (viewLock)
 */
export default function MaskOutside({ khuAPolygon, maxZoom = 18 }) {
  if (!khuAPolygon || khuAPolygon.length < 3) return null;

  const buffer = getBufferFromZoom(maxZoom);
  const maskFeature = createBufferedMask(khuAPolygon, buffer);

  if (!maskFeature) return null;

  return (
    <GeoJSON
      data={maskFeature}
      style={{
        color: '#000000',
        fillColor: '#000000',
        fillOpacity: 0.4,
        stroke: false,
      }}
    />
  );
}
