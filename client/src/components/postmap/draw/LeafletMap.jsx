// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

/**
 * LeafletMap là component trung tâm quản lý bản đồ tương tác.
 * 
 * ---
 * 📌 Chức năng liên quan đến handleCreateArea:
 * 
 * Khi người dùng vẽ xong hình chữ nhật (rectangle) để tạo khu vực mới (Khu A),
 * callback `onCreateArea()` được gọi với dữ liệu GeoJSON của polygon đó.
 *
 * ❗Tại thời điểm này chưa tồn tại `areaId`, vì vậy LeafletMap KHÔNG được gắn `areaId` vào callback.
 * Trách nhiệm tạo `areaId` (gọi API createArea, hiển thị toast, lưu context) nằm ở component cha `PostMapWrapper`.
 * 
 * ✅ LeafletMap chỉ đóng vai trò "phát hiện người dùng đã vẽ xong" và truyền raw polygon lên callback cha.
 */

export default function LeafletMap({
  areaMetadata = null,
  selectedEntityId = null,
  onSelectEntity = () => {},

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

    // ❌ KHÔNG truyền areaId vì đây là giai đoạn khởi tạo (chưa gọi API)
    // ✅ Đẩy dữ liệu polygon thô về component cha để xử lý createArea
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Callback khi vẽ xong entity con (polygon/marker - Khu C)
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return null;

    // ✅ Với entity thì cần gắn areaId để backend biết entity thuộc khu nào
    onCreateEntity({ ...entity, areaId });
  };

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

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Hiển thị polygon khu vực chính (Khu A) */}
      {areaMetadata && <AreaLayer area={areaMetadata} />}

      {/* Hiển thị các entity con (marker, polygon nhỏ) lấy từ context */}
      <EntityLayer
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </MapContainer>
  );
}
