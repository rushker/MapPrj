// components/postmap/layers/AreaLayer.jsx
import { Polygon } from 'react-leaflet';

const normalizeLatlngs = (geoJsonCoords) => {
  if (
    !Array.isArray(geoJsonCoords) ||
    !Array.isArray(geoJsonCoords[0])
  ) {
    console.warn('Invalid polygon coordinates:', geoJsonCoords);
    return null;
  }
  // geoJsonCoords: [[[lng, lat], ...], ...]
  return geoJsonCoords[0].map(([lng, lat]) => ({ lat, lng }));
};

const AreaLayer = ({ area }) => {
  const coords = area?.polygon?.coordinates;
  const latlngs = normalizeLatlngs(coords);
  if (!latlngs) return null;

  const style = {
    color: '#FF5733',
    fillOpacity: area.opacity ?? 0.2,
    weight: 2,
  };
  return <Polygon positions={latlngs} pathOptions={style} />;
};

export default AreaLayer;
