// src/components/postmap/draw/layers/EntityLayer.jsx
import PolygonLayer from '../shapes/PolygonLayer';
import MarkerLayer from '../shapes/MarkerLayer';
import useSeparateEntities from '../../../../hooks/useSeparateEntities';
import { useAreaContext } from '../../../../context/AreaContext';

/**
 * @param {string} selectedEntityId - ID của entity đang được chọn.
 * @param {function} onSelectEntity - Callback khi người dùng click chọn một entity.
 */
const EntityLayer = ({ selectedEntityId, onSelectEntity }) => {
  const { entities, isEditMode } = useAreaContext();
  const { khuCs, markers } = useSeparateEntities(entities, !isEditMode); // Sử dụng !isEditMode cho readOnly
  
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