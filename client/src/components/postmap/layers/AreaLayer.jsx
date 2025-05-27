// components/postmap/layers/AreaLayer.jsx
import { Polygon } from 'react-leaflet';

const normalizeLatlngs = (polygon) => {
  if (!Array.isArray(polygon)) return null;
  return polygon.map(([lat, lng]) => ({ lat, lng }));
};

const AreaLayer = ({ area, showLabel }) => {
  if (!area || !Array.isArray(area.coordinates)) return null;

  const latlngs = normalizeLatlngs(area.coordinates);

  const style = {
    color: '#FF5733',
    fillOpacity: area.opacity ?? 0.2,
    weight: 2,
  };

  return <Polygon positions={latlngs} pathOptions={style} />;
};

export default AreaLayer;

