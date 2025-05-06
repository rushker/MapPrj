//src/components/MapEditor.jsx
import { useMap, MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';
import MarkerFormModal from './MarkerFormModal';

export default function MapEditor({ initialData, onSave }) {
  const mapRef = useRef();
  const [markers, setMarkers] = useState(initialData.markers || []);
  const [polygon, setPolygon] = useState(initialData.polygon || null);
  const [modalData, setModalData] = useState(null);

  const onMapCreated = (map) => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        marker: true,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      },
      edit: { featureGroup: drawnItems }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const { layerType, layer } = e;
      if (layerType === 'polygon') {
        setPolygon(layer.toGeoJSON());
        drawnItems.clearLayers(); // Only allow one polygon
        drawnItems.addLayer(layer);
      }
      if (layerType === 'marker') {
        const latlng = layer.getLatLng();
        setModalData({ latlng });
      }
    });
  };

  return (
    <>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '600px' }}
        whenCreated={onMapCreated}
        ref={mapRef}
      >
        <SidebarInfoPanel
            polygon={polygon}
             markers={markers}
             onDeleteMarker={(idx) => {
             setMarkers(markers.filter((_, i) => i !== idx));
             }}
            />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Render existing polygon or markers */}
        
      </MapContainer>

      {modalData && (
        <MarkerFormModal
          latlng={modalData.latlng}
          onSubmit={(marker) => {
            setMarkers([...markers, marker]);
            setModalData(null);
          }}
          onClose={() => setModalData(null)}
        />
      )}

      <button onClick={() => onSave({ polygon, markers })}>Save</button>
    </>
  );
}
