// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

// Import Geoman thay thế cho leaflet.pm
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export default function LeafletMap({
  areaMetadata = null,
  selectedEntityId = null,
  onSelectEntity = () => {},
  isCreatingArea,
  onDrawEnd,

  // Geoman control flags
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,

  // Callbacks
  onCreateArea = () => {},
  onCreateEntity = () => {},
  onUpdatePolygon = () => {},
  onUpdateEntityGeometry = () => {},
}) {
  const mapRef = useRef(null);
  const { areaId, isEditMode } = useAreaContext();

  // ✅ Callback khi vẽ xong khu vực mới (rectangle - Khu A)
  const handleCreateArea = (polygon) => {
    const coordinates = polygon.coordinates;
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Callback khi vẽ xong entity con (polygon/marker - Khu C)
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return null;
    onCreateEntity({ ...entity, areaId });
  };

  // ✅ Hook sự kiện Geoman (vẽ, sửa, xóa)
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
    isEditMode: true,
    onDrawEnd,
  });

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
        // KÍCH HOẠT NÚT VẼ RECTANGLE MẶC ĐỊNH
        mapInstance.pm.addControls({
          position: 'topleft',
          drawCircle: false,
          drawMarker: true,
          drawPolyline: false,
          drawCircleMarker: false,
          drawRectangle: true, // ✅ KÍCH HOẠT NÚT VẼ RECTANGLE
          drawPolygon: true,
          editMode: isEditMode,
          dragMode: isEditMode,
          removalMode: isEditMode,
        });
      }}
      pmIgnore={false}
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