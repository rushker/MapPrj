// src/components/MapView.jsx
import { MapContainer, ImageOverlay, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const MapView = ({ mapImageUrl }) => {
  const [bounds, setBounds] = useState([
    [21.05, 105.83], // Default bounds
    [21.01, 105.87],
  ]);

  useEffect(() => {
    // You can add logic here to calculate bounds based on the image
  }, [mapImageUrl]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        crs={L.CRS.EPSG4326}
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="rounded-lg shadow-xl"
      >
        <ZoomControl position="topright" />
        <ImageOverlay
          url={mapImageUrl || '/map.png'}
          bounds={bounds}
          opacity={1}
          zIndex={10}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;