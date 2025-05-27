import { Polygon } from 'react-leaflet';

/**
 * Chuẩn hóa GeoJSON Polygon coordinates ([[[lng, lat], ...]])
 * sang mảng [{lat, lng}, ...] để React-Leaflet vẽ.
 */
const normalizeLatlngs = (geoJsonCoords) => {
  // geoJsonCoords phải là mảng chứa ít nhất một linear ring
  if (!Array.isArray(geoJsonCoords) || !Array.isArray(geoJsonCoords[0])) {
    return null;
  }
  // Dùng ring đầu tiên
  return geoJsonCoords[0].map(([lng, lat]) => ({ lat, lng }));
};

const AreaLayer = ({ area }) => {
  // Kiểm tra area.polygon.coordinates tồn tại và là mảng
  if (
    !area ||
    !area.polygon ||
    !Array.isArray(area.polygon.coordinates)
  ) {
    return null;
  }

  const latlngs = normalizeLatlngs(area.polygon.coordinates);
  if (!latlngs) return null;

  const style = {
    color: '#FF5733',
    fillOpacity: area.opacity ?? 0.2,
    weight: 2,
  };

  return <Polygon positions={latlngs} pathOptions={style} />;
};

export default AreaLayer;
