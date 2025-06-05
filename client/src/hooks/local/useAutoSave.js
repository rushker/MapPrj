// hooks/local/useAutoSave.js
import { useEffect, useRef, useCallback } from 'react';
import { updateArea } from '../../services/areas';
import { updateEntity } from '../../services/entities';
import { useAreaContext } from '../../context/AreaContext';
import toast from 'react-hot-toast';
import isEqual from 'lodash/isEqual';

const DEBOUNCE_INTERVAL = 20000;

export default function useAutoSave() {
  const { areaId, areaMetadata, entities } = useAreaContext();

  const prevAreaRef = useRef(null);
  const prevEntityMapRef = useRef(new Map());
  const debounceTimeoutRef = useRef(null);
  const isSavingRef = useRef(false);

  // ==== AREA SO SÁNH ====
  const hasAreaChanged = useCallback((current, previous) => {
    if (!current || !previous) return false;
    return (
      current.name !== previous.name ||
      current.description !== previous.description ||
      current.type !== previous.type ||
      current.opacity !== previous.opacity ||
      current.lockedZoom !== previous.lockedZoom
    );
  }, []);

  // ==== ENTITY SO SÁNH ====
  const hasEntityChanged = useCallback((current, previous) => {
    if (!current || !previous) return false;

    return (
      current.name !== previous.name ||
      current.type !== previous.type ||
      !isEqual(current.geometry, previous.geometry) ||
      !isEqual(current.metadata, previous.metadata)
    );
  }, []);

  // ==== HÀM LƯU CHÍNH ====
  const saveChanges = useCallback(async () => {
    if (!areaId || isSavingRef.current) return;

    isSavingRef.current = true;
    const changes = { area: false, entities: [] };

    try {
      // AREA
      if (hasAreaChanged(areaMetadata, prevAreaRef.current)) {
        await updateArea(areaId, areaMetadata);
        changes.area = true;
      }

      // ENTITIES
      const updatePromises = entities
        .filter(entity => {
          const prev = prevEntityMapRef.current.get(entity._id);
          return hasEntityChanged(entity, prev);
        })
        .map(entity =>
          updateEntity(entity._id, entity)
            .then(() => entity._id)
            .catch(() => null)
        );

      const updatedIds = (await Promise.all(updatePromises)).filter(Boolean);
      changes.entities = updatedIds;

      if (changes.area || changes.entities.length > 0) {
        toast.success('Đã tự động lưu bản nháp');
        // Update refs
        prevAreaRef.current = { ...areaMetadata };
        prevEntityMapRef.current = new Map(
          entities.map(e => [e._id, { ...e }])
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Tự động lưu thất bại');
    } finally {
      isSavingRef.current = false;
    }
  }, [areaId, areaMetadata, entities, hasAreaChanged, hasEntityChanged]);

  // ==== DEBOUNCE AUTO SAVE ====
  useEffect(() => {
    if (!areaId) return;

    // Khởi tạo initial
    if (!prevAreaRef.current) {
      prevAreaRef.current = { ...areaMetadata };
    }

    if (prevEntityMapRef.current.size === 0) {
      prevEntityMapRef.current = new Map(
        entities.map(e => [e._id, { ...e }])
      );
    }

    debounceTimeoutRef.current = setTimeout(saveChanges, DEBOUNCE_INTERVAL);

    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, [areaId, areaMetadata, entities, saveChanges]);

  // ==== MANUAL SAVE ====
  const manualSave = useCallback(() => {
    clearTimeout(debounceTimeoutRef.current);
    return saveChanges();
  }, [saveChanges]);

  return { manualSave };
}
