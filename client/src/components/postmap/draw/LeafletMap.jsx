// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';

/**
 * LeafletMap là component trung tâm quản lý bản đồ tương tác:
 *
 * Mục đích chính:
 * - Hiển thị khu vực chính (Area/Khu A) với polygon và metadata
 * - Hiển thị tất cả các entity con (marker, polygon nhỏ - Khu C) của khu vực đó
 * - Tích hợp thư viện leaflet-geoman hỗ trợ vẽ, chỉnh sửa, kéo thả, xóa đối tượng trên bản đồ
 * - Quản lý callback khi user hoàn thành vẽ khu vực hoặc entity mới
 *
 * Luồng dữ liệu và quản lý trạng thái:
 * - areaMetadata: polygon + metadata của khu vực chính, nhận từ props (được fetch và quản lý bên ngoài)
 * - entities: KHÔNG nhận qua props mà được lấy trực tiếp từ AreaContext (toàn bộ entities của khu vực hiện tại)
 * - selectedEntityId & onSelectEntity: props truyền xuống để xử lý focus và tương tác chọn entity con
 * - areaId lấy từ context để đồng bộ id khu vực cho các thao tác vẽ và lưu dữ liệu mới
 *
 * Các control flags (props) cho phép bật tắt các tính năng của leaflet-geoman:
 * - enableDraw, drawShape: bật chế độ vẽ và xác định kiểu shape đang vẽ (Rectangle, Polygon, Marker)
 * - enableEdit: bật chỉnh sửa toàn cục
 * - enableDrag: bật kéo thả toàn cục
 * - enableRemove: bật chế độ xóa
 *
 * Callback:
 * - onCreateArea: khi user vẽ xong polygon khu vực mới
 * - onCreateEntity: khi user vẽ xong một entity mới (polygon/marker)
 *
 * Lưu ý:
 * - areaId   được quản lý trong AreaContext để tránh truyền prop rườm rà, đồng thời đồng bộ dễ dàng
 * - entities được quản lý trong AreaContext để tránh truyền prop rườm rà, đồng thời đồng bộ dễ dàng
 * - LeafletMap chỉ chịu trách nhiệm hiển thị và tương tác, không lưu trữ trực tiếp dữ liệu entities
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
}) {
  const mapRef = useRef(null);
  const { areaId } = useAreaContext();

  // Callback khi vẽ xong khu vực (polygon Khu A)
  const handleCreateArea = (polygon) => {
    // Gắn thêm areaId để đồng bộ với context
    onCreateArea({ ...polygon, areaId });
  };

  // Callback khi vẽ xong entity (polygon/marker Khu C)
  const handleCreateEntity = (entity) => {
    // Gắn thêm areaId để liên kết entity với khu vực hiện tại
    onCreateEntity({ ...entity, areaId });
  };

  // Đăng ký sự kiện leaflet-geoman với các flags và callback xử lý
  useGeomanEvents({
    mapRef,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA: handleCreateArea,
    onCreateEntity: handleCreateEntity,
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
