// src/components/MapEditor.jsx
import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

import MarkerFormModal from './MarkerFormModal';
import SidebarInfoPanel from './SidebarInfoPanel'; // Assuming you have this component

export default function MapEditor({ initialData, onSave, updateMapData }) {
  const [markers, setMarkers] = useState(initialData.markers || []);
  const [polygon, setPolygon] = useState(initialData.polygon || null);
  const [modalData, setModalData] = useState(null);
  const [mapName, setMapName] = useState(initialData.name || '');

  // Update parent if updateMapData is provided
  useEffect(() => {
    if (updateMapData) {
      updateMapData({ name: mapName, polygon, markers });
    }
  }, [mapName, polygon, markers, updateMapData]);

  const handleMarkerSubmit = (marker) => {
    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);
    setModalData(null);
  };

  return (
    <div>
      <input
        type="text"
        className="mb-4 p-2 border rounded"
        placeholder="Map Name"
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
      />

      <SidebarInfoPanel
        polygon={polygon}
        markers={markers}
        onDeleteMarker={(idx) => {
          const updatedMarkers = markers.filter((_, i) => i !== idx);
          setMarkers(updatedMarkers);
        }}
      />

      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '600px' }}
        whenCreated={(map) => setupMap(map, setPolygon, setModalData)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.latlng}>
            <Popup>
              <strong>{marker.name}</strong><br />
              {marker.type}<br />
              {marker.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {modalData && (
        <MarkerFormModal
          latlng={modalData.latlng}
          onSubmit={handleMarkerSubmit}
          onClose={() => setModalData(null)}
        />
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => onSave({ name: mapName, polygon, markers })}
      >
        Save
      </button>
    </div>
  );
}

function setupMap(map, setPolygon, setModalData) {
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      marker: true,
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
    edit: { featureGroup: drawnItems },
  });
  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const geoJson = layer.toGeoJSON();
      drawnItems.clearLayers(); // Ensure only one polygon
      drawnItems.addLayer(layer);
      setPolygon(geoJson);
    }

    if (layerType === 'marker') {
      setModalData({ latlng: layer.getLatLng() });
    }
  });
}
