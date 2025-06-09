// components/viewmap/p2v/MaskOutside.jsx
import { GeoJSON } from 'react-leaflet';
import { createBufferedMask } from '../../../utils/geometry';

export default function MaskOutside({ khuAPolygon, maxZoom = 18 }) {
  if (!khuAPolygon || khuAPolygon.length < 3) return null;

  const maskFeature = createBufferedMask(khuAPolygon, maxZoom);

  return maskFeature ? (
    <GeoJSON
      data={maskFeature}
      style={{
        color: '#000',
        fillColor: '#000',
        fillOpacity: 0.4,
        stroke: false,
      }}
    />
  ) : null;
}
