// src/pages/MapViewer.jsx

import Navbar from '../components/Navbar'; // ✅ Add this at the top
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getMapById } from '../services/api';

const MapAutoFit = ({ polygonCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (polygonCoords?.length) {
      const bounds = L.latLngBounds(polygonCoords);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [polygonCoords, map]);
  return null;
};

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconAnchor: [12, 41],
});

export default function MapViewer() {
  const { mapId } = useParams();
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMapById(mapId)
      .then(setMapData)
      .catch(() => setError('Failed to load map'));
  }, [mapId]);

  const polygonCoords = useMemo(() => {
    const coords = mapData?.polygon?.geometry?.coordinates?.[0];
    return coords?.map(([lng, lat]) => [lat, lng]);
  }, [mapData]);

  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!mapData) return <div className="text-center mt-10">Loading map...</div>;

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar /> {/* ✅ Include your Navbar here */}
      <div className="flex-grow">
        <MapContainer
          zoom={2}
          center={[0, 0]}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false} // Prevent edits
          dragging={true}
          zoomControl={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {polygonCoords && (
            <>
              <Polygon positions={polygonCoords} color="blue" />
              <MapAutoFit polygonCoords={polygonCoords} />
            </>
          )}
          {mapData.markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={[marker.latlng.lat, marker.latlng.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{marker.name}</strong>
                  <p className="italic text-gray-500">{marker.type}</p>
                  <p>{marker.description}</p>
                  {marker.imageUrl && (
                    <img
                      src={marker.imageUrl}
                      alt={marker.name}
                      className="mt-2 max-w-xs rounded"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
