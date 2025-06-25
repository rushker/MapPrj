// src/components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import PMControls from './PMControls';

import { useAreaContext } from '../../../context/AreaContext';

/**
 * Component khởi tạo Leaflet map + xử lý sự kiện vẽ.
 */
export default function LeafletMap({
  areaMetadata,
  selectedEntityId,
  onSelectEntity,
  onCreateArea,
  onCreateEntity,
  onUpdatePolygon,
  onUpdateEntityGeometry,
  mapRef, // ref từ cha
}) {
  const { areaId, isEditMode } = useAreaContext();

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      pmIgnore={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Khởi tạo Geoman sau khi mount map */}
      <PMControls
        areaId={areaId}
        isEditMode={isEditMode}
        mapRef={mapRef}
        onCreateArea={onCreateArea}
        onCreateEntity={onCreateEntity}
        onUpdatePolygon={onUpdatePolygon}
        onUpdateEntityGeometry={onUpdateEntityGeometry}
      />

      {/* Lớp khu vực (rectangle) */}
      {areaMetadata && <AreaLayer area={areaMetadata} />}

      {/* Lớp thực thể (polygon, marker) */}
      <EntityLayer
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </MapContainer>
  );
}
