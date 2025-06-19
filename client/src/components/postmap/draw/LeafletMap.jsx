// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

// Import Geoman
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export default function LeafletMap({
  areaMetadata = null,
  selectedEntityId = null,
  onSelectEntity = () => {},
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,
  onCreateArea = () => {},
  onCreateEntity = () => {},
  onUpdatePolygon = () => {},
  onUpdateEntityGeometry = () => {},
}) {
  const mapRef = useRef(null);
  const { areaId, isEditMode } = useAreaContext();

  // ✅ Callback khi tạo khu vực
  const handleCreateArea = (polygon) => {
    const coordinates = polygon.coordinates;
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Callback khi tạo entity con
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return;
    onCreateEntity({ ...entity, areaId });
  };

  // ✅ Gắn sự kiện Geoman
  useGeomanEvents({
    mapRef,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA: handleCreateArea,
    onCreateEntity: handleCreateEntity,
    onUpdatePolygon,
    onUpdateEntityGeometry,
    isEditMode,
  });

  // ✅ Khởi tạo bản đồ và thêm thanh công cụ Geoman
  const handleMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;

    if (!mapInstance.pm) {
      console.error('❌ Geoman plugin chưa sẵn sàng trên map');
      return;
    }

    console.log('✅ Leaflet map created');
    mapInstance.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: true,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: true,
      drawPolygon: true,
      editMode: enableEdit,
      dragMode: enableDrag,
      removalMode: enableRemove,
    });
  };

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={handleMapCreated}
      pmIgnore={false} // Quan trọng để Geoman hoạt động
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {areaMetadata && <AreaLayer area={areaMetadata} />}
      <EntityLayer
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </MapContainer>
  );
}
