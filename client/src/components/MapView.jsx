// src/components/MapView.jsx
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bounds = [[21.05, 105.83], [21.01, 105.87]]; // chỉnh lại theo ảnh

export default function MapView() {
  return (
    <MapContainer
      crs={L.CRS.EPSG4326}
      bounds={bounds}
      style={{ height: '100%', width: '100%' }}
      zoom={1}
      scrollWheelZoom={true}
    >
      <ImageOverlay
        url="/map.png" // đặt ảnh bản đồ vào public/map.png
        bounds={bounds}
      />
    </MapContainer>
  );
}