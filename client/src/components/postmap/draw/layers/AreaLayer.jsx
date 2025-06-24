// components/postmap/draw/layers/AreaLayer.jsx
import { Polygon } from 'react-leaflet';
import { geoToLatLng } from '../../../../utils/geometry';

const AreaLayer = ({ area }) => {
  const geoCoords = area?.polygon?.coordinates?.[0];
  if (!geoCoords || geoCoords.length < 3) return null;

  const latlngs = geoToLatLng(geoCoords);

  const style = {
    color: '#FF5733',
    weight: 2,
    opacity: area?.metadata?.strokeOpacity ?? 1,  // 👈 chỉ áp dụng cho stroke
    fillColor: 'transparent', // 💡 đảm bảo không có fill bên trong
    fillOpacity: 0,
  };

  return <Polygon positions={latlngs} pathOptions={style} />;
};

export default AreaLayer;
