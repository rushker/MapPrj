// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef, useEffect } from 'react'; // Thêm useEffect
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

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

  // ✅ Callback khi vẽ xong khu vực mới
  const handleCreateArea = (polygon) => {
    const coordinates = polygon.coordinates;
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Callback khi vẽ xong entity con
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return null;
    onCreateEntity({ ...entity, areaId });
  };

  // ✅ Hook sự kiện Geoman
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
    isEditMode, // Truyền isEditMode từ context
  });

  // Sử dụng useEffect để thêm điều khiển khi map được tạo
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    // Thêm điều khiển Geoman
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: true,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: true, // ✅ Kích hoạt nút vẽ Rectangle
      drawPolygon: true,
      editMode: enableEdit,
      dragMode: enableDrag,
      removalMode: enableRemove,
    });

    return () => {
      // Dọn dẹp khi component unmount
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
      }}
      pmIgnore={false} // Quan trọng: cho phép Geoman
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