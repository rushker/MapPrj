// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef, useEffect } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

// ✅ Import Geoman JS + CSS đúng thứ tự
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

  // ✅ Khi tạo Area (Khu A)
  const handleCreateArea = (polygon) => {
    const coordinates = polygon.coordinates;
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Khi tạo entity (Marker, Polygon con)
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return;
    onCreateEntity({ ...entity, areaId });
  };

  // ✅ Hook gắn sự kiện Geoman
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

  // ✅ Hiển thị nút vẽ Geoman
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.pm) {
      console.warn('❌ map or map.pm chưa sẵn sàng');
      return;
    }

    map.pm.addControls({
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

    return () => {
      map.pm.removeControls();
    };
  }, [enableEdit, enableDrag, enableRemove]);

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
        console.log('✅ map created:', mapInstance);
        console.log('✅ map.pm:', mapInstance.pm);
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
