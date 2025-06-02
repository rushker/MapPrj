// components/postmap/draw/layers/EntityLayer.jsx
import PolygonLayer from '../shapes/PolygonLayer';
import MarkerLayer from '../shapes/MarkerLayer';
import useSeparateEntities from '../../../../hooks/useSeparateEntities';

const EntityLayer = ({ entities = [], selectedEntityId, onSelectEntity }) => {
  const { khuCs, markers } = useSeparateEntities(entities);

  return (
    <>
      <PolygonLayer
        entities={khuCs}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
      <MarkerLayer
        entities={markers}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </>
  );
};

export default EntityLayer;
