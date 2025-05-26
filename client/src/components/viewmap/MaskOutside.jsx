//components/viewmap/MaskOutside.jsx
import { GeoJSON } from 'react-leaflet';
import { createBufferedMask } from '../../utils/geometry';

/**
 * Hiển thị vùng mask (Khu B) bao quanh Khu A, dạng doughnut.
 * Chỉ nên sử dụng ở ViewMapPage.
 *
 * @param {Array<Array<number>>} khuAPolygon - polygon dạng [lat, lng]
 */
export default function MaskOutside({ khuAPolygon }) {
  if (!khuAPolygon || khuAPolygon.length < 3) return null;

  const mask = createBufferedMask(khuAPolygon, 30); // buffer 30m

  if (!mask) return null;

  return (
    <GeoJSON
      data={mask}
      style={{
        fillColor: 'black',
        fillOpacity: 0.5,
        color: 'black',
        weight: 0,
        stroke: false,
      }}
    />
  );
}
