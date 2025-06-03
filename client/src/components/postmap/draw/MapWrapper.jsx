// src/components/postmap/draw/MapWrapper.jsx
import { useRef, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import LeafletMap from './LeafletMap';


export default function MapWrapper({
  center = [21.0278, 105.8342],
  zoom = 13,
  style = { height: '100vh', width: '100%' },

  khuA,
  ...leafletProps
}) {
  const mapRef = useRef(null);

  const handleMapCreate = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style}
      whenCreated={handleMapCreate}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

     

      {/* All drawing and layer logic */}
      <LeafletMap mapRef={mapRef} khuA={khuA} {...leafletProps} />
    </MapContainer>
  );
}
