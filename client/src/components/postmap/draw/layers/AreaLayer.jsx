// components/postmap/draw/layers/AreaLayer.jsx
import { Polygon } from 'react-leaflet';
import { geoToLatLng } from '../../../../utils/geometry';

const AreaLayer = ({ area }) => {
  const geoCoords = area?.polygon?.coordinates?.[0];
  if (!geoCoords || geoCoords.length < 3) return null;

  const latlngs = geoToLatLng(geoCoords);

  // Helper: convert {r,g,b} + a to rgba string
  const toRgba = (colorObj, defaultColor = 'rgba(0,0,0,0)') => {
    if (!colorObj || typeof colorObj !== 'object') return defaultColor;
    const { r, g, b, a = 1 } = colorObj;
    return `rgba(${r},${g},${b},${a})`;
  };

  const metadata = area?.metadata ?? {};

  const style = {
    color: toRgba(metadata.strokeColor, '#3388ff'), // viền
    weight: 2,
    opacity: metadata.strokeOpacity ?? metadata.strokeColor?.a ?? 1, // độ trong suốt viền
    fillColor: toRgba(metadata.fillColor, 'transparent'), // màu nền
    fillOpacity: metadata.fillOpacity ?? metadata.fillColor?.a ?? 0, // độ trong suốt nền
  };

  return <Polygon positions={latlngs} pathOptions={style} />;
};

export default AreaLayer;
