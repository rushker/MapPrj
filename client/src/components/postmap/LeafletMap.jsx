// src/components/postmap/LeafletMap.jsx
import useGeomanEvents from './draw/useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import PolygonLayer from './shapes/PolygonLayer';
import MarkerLayer from './shapes/MarkerLayer';

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

      {/* Vẽ các khu C */}
      <PolygonLayer
        entities={entities}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />

      {/* Vẽ các marker */}
      <MarkerLayer
        entities={entities}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </>
  );
}
