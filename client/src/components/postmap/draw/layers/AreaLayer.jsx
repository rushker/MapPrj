// components/postmap/draw/layers/AreaLayer.jsx
import { Polygon } from 'react-leaflet';
import { geoToLatLng } from '../../../../utils/geometry';

const AreaLayer = ({ area }) => {
  const geoCoords = area?.polygon?.coordinates?.[0]; // GeoJSON: [[lng, lat], ...]
  if (!geoCoords || geoCoords.length < 3) return null;

  const latlngs = geoToLatLng(geoCoords); // → [[lat, lng], ...]
  const style = {
     color: '#FF5733',     // stroke viền ngoài
  fill: false,          // cố gắng tắt fill
  fillOpacity: 0,       // đảm bảo không có độ trong suốt nào
  weight: 2,
  };
  return <Polygon positions={latlngs} pathOptions={style} />;
};

export default AreaLayer;
