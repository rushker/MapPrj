// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../contexts/AreaContext';
/**
 * LeafletMap là component trung tâm quản lý bản đồ tương tác:
 * - Hiển thị khu A (AreaLayer) và các entity con (EntityLayer)
 * - Tích hợp leaflet-geoman để hỗ trợ vẽ / chỉnh sửa / xóa
 *
 * Props:
 * @param {object} khuA - đối tượng area chứa polygon và metadata
 * @param {array} entities - danh sách entity con (markers, polygons)
 * @param {string|null} selectedEntityId - id của entity đang được chọn (dùng để focus + popup)
 * @param {function} onSelectEntity - callback khi user click vào một entity
 *
 * Geoman controls:
 * @param {boolean} enableDraw - bật chế độ vẽ
 * @param {string|null} drawShape - loại shape để vẽ: 'Rectangle', 'Polygon', 'Marker'
 * @param {boolean} enableEdit - bật chỉnh sửa global
 * @param {boolean} enableDrag - bật kéo thả global
 * @param {boolean} enableRemove - bật chế độ xóa
 * @param {function} onCreateKhuA - callback khi user vẽ xong khu A
 * @param {function} onCreateEntity - callback khi user vẽ xong entity (polygon / marker)
 */
export default function LeafletMap({
  khuA = null,
  entities = [],
  selectedEntityId = null,
  onSelectEntity = () => {},

  // Geoman control flags
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,

  // Callbacks khi tạo mới
  onCreateKhuA = () => {},
  onCreateEntity = () => {},
}) {
  const mapRef = useRef(null);
   const { areaId } = useAreaContext();
   
  // Tích hợp sự kiện vẽ/sửa/xóa qua leaflet-geoman
  useGeomanEvents({
    mapRef,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA,
    onCreateEntity,
  });
  // Thêm areaId vào các callback
  const handleCreateKhuA = (polygon) => {
    onCreateKhuA({ ...polygon, areaId });
  };

  const handleCreateEntity = (entity) => {
    onCreateEntity({ ...entity, areaId });
  };

  return (
    <MapContainer
      center={[10.762622, 106.660172]} // default: Hồ Con Rùa
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

      {/* Lớp hiển thị polygon khu A */}
      {khuA && <AreaLayer area={khuA} />}

      {/* Lớp hiển thị tất cả các entity (polygon và marker) */}
      <EntityLayer
      areaId={areaId}
        entities={entities}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </MapContainer>
  );
}
