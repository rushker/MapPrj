// src/components/postmap/draw/layers/EntityLayer.jsx
import PolygonLayer from '../shapes/PolygonLayer';
import MarkerLayer from '../shapes/MarkerLayer';
import { useSafeAreaContext } from '../../../../context/useSafeAreaContext';
import { isAreaIdReady } from '../../../../utils/areaUtils.js';

/**
 * @param {string} selectedEntityId - ID của entity đang được chọn.
 * @param {function} onSelectEntity - Callback khi người dùng click chọn một entity.
 */
const EntityLayer = ({ selectedEntityId, onSelectEntity }) => {
  const safeContext = useSafeAreaContext();
  if (!safeContext) return null;

  const { areaId, isEditMode, isCreatingArea } = safeContext;

  if (!isAreaIdReady({ areaId, isEditMode }) || isCreatingArea) return null;

  return (
    <>
      <PolygonLayer selectedEntityId={selectedEntityId} onSelectEntity={onSelectEntity} />
      <MarkerLayer selectedEntityId={selectedEntityId} onSelectEntity={onSelectEntity} />
    </>
  );
};

export default EntityLayer;
