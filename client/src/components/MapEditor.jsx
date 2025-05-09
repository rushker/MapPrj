// src/components/MapEditor.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
import MarkerMetadataForm from './marker/MarkerMetadataForm';

/**
 * MapEditor component
 * Props:
 *  - initialData: { name?, polygon?: GeoJSON, markers?: Array }
 *  - onSave: function({ name, polygon, markers })
 */
export default function MapEditor({ initialData = {}, onSave }) {
  const mapRef = useRef();
  const [mapName, setMapName] = useState(initialData.name || '');
  const [polygon, setPolygon] = useState(initialData.polygon || null);
  const [markers, setMarkers] = useState(initialData.markers || []);
  const [selectedMarkerIdx, setSelectedMarkerIdx] = useState(null);
  const [markerMode, setMarkerMode] = useState(false);

  // Initialize drawing controls
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.pm.setPathOptions({ color: 'blue' });
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: !polygon,
      editMode: !!polygon,
      deleteMode: true,
      drawMarker: false,
    });

    map.on('pm:create', e => {
      if (e.shape === 'Polygon') {
        const geo = e.layer.toGeoJSON();
        setPolygon(geo);
        e.layer.addTo(map);
      }
    });
    map.on('pm:edit', e => {
      const layer = e.layer || e.target;
      setPolygon(layer.toGeoJSON());
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
      map.off('pm:edit');
    };
  }, [mapRef.current, polygon]);

  // Handle map clicks for adding markers
  useMapEvents({
    click(e) {
      if (!markerMode) return;
      const { lat, lng } = e.latlng;
      const newMarker = { lat, lng, name: '', type: '', description: '', imageUrl: '' };
      setMarkers(prev => [...prev, newMarker]);
      setSelectedMarkerIdx(markers.length);
    }
  });

  const handleMarkerChange = (updated) => {
    setMarkers(prev => prev.map((m, i) => (i === selectedMarkerIdx ? updated : m)));
  };

  const handleSave = () => {
    if (!mapName.trim()) return alert('Please enter a map name.');
    if (!polygon) return alert('Please draw a polygon.');
    if (markers.length === 0) return alert('Add at least one marker.');
    onSave({ name: mapName, polygon, markers });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Name input */}
      <div className="p-4 bg-white shadow">
        <input
          type="text"
          value={mapName}
          onChange={e => setMapName(e.target.value)}
          placeholder="Map Name"
          className="w-full p-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      {/* Map & controls */}
      <div className="flex-1 relative">
        <MapContainer
          whenCreated={mapInstance => (mapRef.current = mapInstance)}
          center={[0, 0]}
          zoom={2}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {polygon && (
            <Polygon
              positions={polygon.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
              pathOptions={{ color: 'blue' }}
            />
          )}
          {markers.map((m, i) => (
            <Marker key={i} position={[m.lat, m.lng]} eventHandlers={{ click: () => setSelectedMarkerIdx(i) }}>
              <Popup>{m.name || 'Marker'}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Bottom action bar */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <button
            onClick={() => setMarkerMode(!markerMode)}
            className={
              `px-4 py-2 rounded ${markerMode ? 'bg-red-500' : 'bg-green-500'} text-white`
            }
          >
            {markerMode ? 'Disable Marker' : 'Add Marker'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Map
          </button>
        </div>

        {/* Marker metadata panel */}
        {selectedMarkerIdx !== null && (
          <MarkerMetadataForm
            initialData={markers[selectedMarkerIdx]}
            onSubmit={data => { handleMarkerChange(data); setSelectedMarkerIdx(null); }}
            onClose={() => setSelectedMarkerIdx(null)}
          />
        )}
      </div>
    </div>
  );
}
