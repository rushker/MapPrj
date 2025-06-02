// src/components/postmap/draw/LeafletMap.jsx
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer'; // ✅ dùng EntityLayer mới đã refactor

export default function LeafletMap({
  mapRef,

  // Khu A
  khuA = null,

  // các entity (khu C + marker)
  entities = [],
  selectedEntityId = null,
  onSelectEntity = () => {},

  // Geoman controls
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,
  onCreateKhuA = () => {},
  onCreateEntity = () => {},
}) {
  // wire up leaflet-geoman
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

  return (
    <>
      {/* Vẽ Khu A nếu có */}
      {khuA && <AreaLayer area={khuA} />}

      {/* Vẽ các khu C + marker thông qua EntityLayer */}
      <EntityLayer
        entities={entities}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </>
  );
}
