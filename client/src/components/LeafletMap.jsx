//src/components/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ children, bounds, onMapLoad }) {
  return (
    <MapContainer
      style={{ height: '100vh', width: '100%' }}
      bounds={bounds}
      zoom={16}
      scrollWheelZoom={true}
      whenCreated={onMapLoad}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {children}
    </MapContainer>
  );
}
