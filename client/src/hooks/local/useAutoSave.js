// ✅ Refactored useAutoSave.js để trả về danh sách entity đã chỉnh sửa chi tiết

import { useEffect, useRef, useCallback } from 'react';
import { updateArea } from '../../services/areas';
import {
  updateEntityMetadata,
  updateEntityGeometry,
} from '../../services/entities';
import { useAreaContext } from '../../context/AreaContext';
import { isValidAreaId } from '../../utils/areaUtils';
import toast from 'react-hot-toast';
import isEqual from 'lodash/isEqual';

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
    if (!isValidAreaId(areaId) || !areaMetadata?.name) return false;

    const areaChanged = hasAreaChanged(areaMetadata, prevAreaRef.current);
    const entityChanged = entities.some(entity => {
      const prev = prevEntityMapRef.current.get(entity._id);
      return hasEntityChanged(entity, prev);
    });

    return areaChanged || entityChanged;
  }, [areaId, areaMetadata, entities, hasAreaChanged, hasEntityChanged]);

  const saveChanges = useCallback(async () => {
    if (!isValidAreaId(areaId) || !areaMetadata?.name || isSavingRef.current) return;

    isSavingRef.current = true;
    const changes = {
      area: false,
      entities: [], // danh sách chi tiết các entity đã lưu
    };

    try {
      // SAVE AREA
      if (hasAreaChanged(areaMetadata, prevAreaRef.current)) {
        await updateArea(areaId, areaMetadata);
        changes.area = true;
      }

      // SAVE CHANGED ENTITIES
      const updatePromises = entities.flatMap(entity => {
        const prev = prevEntityMapRef.current.get(entity._id);
        const entityChanges = {
          _id: entity._id,
          name: entity.name,
          updated: false,
          metadataUpdated: false,
          geometryUpdated: false,
        };

        const promises = [];

        if (!isValidAreaId(entity.areaId)) return [];

        if (!isEqual(entity.metadata, prev?.metadata)) {
          entityChanges.metadataUpdated = true;
          promises.push(
            updateEntityMetadata(entity.areaId, entity._id, entity.metadata)
              .then(() => {
                entityChanges.updated = true;
              })
              .catch(err => {
                console.error(`Metadata update failed for entity ${entity._id}`, err);
              })
          );
        }

        if (!isEqual(entity.geometry, prev?.geometry)) {
          entityChanges.geometryUpdated = true;
          promises.push(
            updateEntityGeometry(entity.areaId, entity._id, entity.geometry)
              .then(() => {
                entityChanges.updated = true;
              })
              .catch(err => {
                console.error(`Geometry update failed for entity ${entity._id}`, err);
              })
          );
        }

        if (promises.length > 0) {
          changes.entities.push(entityChanges);
        }

        return promises;
      });

      await Promise.all(updatePromises);

      if (changes.area || changes.entities.length > 0) {
        toast.success(`Đã lưu ${changes.entities.length} đối tượng`);
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

    return changes;
  }, [areaId, areaMetadata, entities, hasAreaChanged]);

  useEffect(() => {
    if (!isValidAreaId(areaId) || !areaMetadata?.name) return;

    if (!prevAreaRef.current) {
      prevAreaRef.current = { ...areaMetadata };
    }

    if (prevEntityMapRef.current.size === 0 && entities.length > 0) {
      prevEntityMapRef.current = new Map(
        entities.map(e => [e._id, { ...e }])
      );
    }

    debounceTimeoutRef.current = setTimeout(saveChanges, DEBOUNCE_INTERVAL);
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [areaId, areaMetadata, entities, saveChanges]);

  const manualSave = useCallback(async () => {
    clearTimeout(debounceTimeoutRef.current);
    const result = await saveChanges();
    wasManuallySavedRef.current = true;
    return result;
  }, [saveChanges]);

  return {
    manualSave,
    hasUnsavedChanges,
    wasManuallySaved: wasManuallySavedRef.current,
  };
}
