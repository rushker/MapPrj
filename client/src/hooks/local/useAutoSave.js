// hooks/local/useAutoSave.js
import { useEffect, useRef, useCallback } from 'react';
import { updateArea } from '../../services/areas';
import { updateEntity } from '../../services/entities';
import { useAreaContext } from '../../context/AreaContext';
import toast from 'react-hot-toast';
import isEqual from 'lodash/isEqual';
/**
 * Hook này cung cấp tính năng tự động lưu (auto-save) và lưu thủ công (manual-save) 
 * cho dữ liệu Area (Khu A) và Entities (Khu C: Polygon, Marker).
 * 
 * Chỉ lưu khi:
 * - Area có thay đổi so với lần lưu trước.
 * - Entity có thay đổi so với lần lưu trước.
 * - Đảm bảo areaId tồn tại và areaMetadata.name không rỗng.
 * 
 * Các ref (`prevAreaRef`, `prevEntityMapRef`) dùng để so sánh dữ liệu hiện tại 
 * với dữ liệu đã lưu trước đó, tránh lưu dư thừa.
 */

const DEBOUNCE_INTERVAL = 20000;

export default function useAutoSave() {
  const { areaId, areaMetadata, entities } = useAreaContext();

  const prevAreaRef = useRef(null);
  const prevEntityMapRef = useRef(new Map());
  const debounceTimeoutRef = useRef(null);
  const isSavingRef = useRef(false);
  const wasManuallySavedRef = useRef(false);

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

  const hasEntityChanged = useCallback((current, previous) => {
    if (!current || !previous) return false;
    return (
      current.name !== previous.name ||
      current.type !== previous.type ||
      !isEqual(current.geometry, previous.geometry) ||
      !isEqual(current.metadata, previous.metadata)
    );
  }, []);

  const hasUnsavedChanges = useCallback(() => {
    if (!areaId || !areaMetadata?.name) return false;

    const areaChanged = hasAreaChanged(areaMetadata, prevAreaRef.current);
    const entityChanged = entities.some(entity => {
      const prev = prevEntityMapRef.current.get(entity._id);
      return hasEntityChanged(entity, prev);
    });

    return areaChanged || entityChanged;
  }, [areaId, areaMetadata, entities, hasAreaChanged, hasEntityChanged]);

  const saveChanges = useCallback(async () => {
    if (!areaId || !areaMetadata?.name || isSavingRef.current) return;

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
        prevAreaRef.current = { ...areaMetadata };
        prevEntityMapRef.current = new Map(
          entities.map(e => [e._id, { ...e }])
        );
        wasManuallySavedRef.current = false;
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
      toast.error('Tự động lưu thất bại');
    } finally {
      isSavingRef.current = false;
    }
  }, [areaId, areaMetadata, entities, hasAreaChanged, hasEntityChanged]);

  useEffect(() => {
    if (!areaId || !areaMetadata?.name) return;

    // Init refs
    if (!prevAreaRef.current) {
      prevAreaRef.current = { ...areaMetadata };
    }

    if (prevEntityMapRef.current.size === 0 && entities.length > 0) {
      prevEntityMapRef.current = new Map(
        entities.map(e => [e._id, { ...e }])
      );
    }

    debounceTimeoutRef.current = setTimeout(saveChanges, DEBOUNCE_INTERVAL);

    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, [areaId, areaMetadata, entities, saveChanges]);

  const manualSave = useCallback(async () => {
    clearTimeout(debounceTimeoutRef.current);
    await saveChanges();
    wasManuallySavedRef.current = true;
  }, [saveChanges]);

  return {
    manualSave,
    hasUnsavedChanges,
    wasManuallySaved: wasManuallySavedRef.current,
  };
}

