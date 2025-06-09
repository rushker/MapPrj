// src/components/postmap/draw/layers/EntityLayer.jsx
import PolygonLayer from '../shapes/PolygonLayer';
import MarkerLayer from '../shapes/MarkerLayer';
import useSeparateEntities from '../../../../hooks/useSeparateEntities';
import { useAreaContext } from '../../../../context/AreaContext';

/**
 * @param {string} selectedEntityId - ID của entity đang được chọn.
 * @param {function} onSelectEntity - Callback khi người dùng click chọn một entity.
 * @param {boolean} readOnly - Nếu true, disable các sự kiện tương tác (dùng cho ViewMap).
 */
const EntityLayer = ({ selectedEntityId, onSelectEntity, readOnly = false }) => {
  const { entities } = useAreaContext();
  const { khuCs, markers } = useSeparateEntities(entities);

  return (
    <>
      <PolygonLayer
        entities={khuCs}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
        readOnly={readOnly}
      />
      <MarkerLayer
        entities={markers}
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
        readOnly={readOnly}
      />
    </>
  );
};

export default EntityLayer;
