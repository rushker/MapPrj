// src/hooks/useMapArea.js
import { useState, useEffect, useCallback } from 'react';
import {
  getAreaById,
  createArea,
  updateArea,
  updateAreaPolygon,
  deleteArea,
} from '../../services/areas'; // ✅ sửa đúng path

export default function useArea(areaId) {
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ──────── FETCH ──────── */
  const fetchArea = useCallback(async () => {
    if (!areaId) return;
    setLoading(true);
    try {
      const data = await getAreaById(areaId);
      setArea(data);
    } catch (err) {
      console.error(`❌ [useArea] Failed to fetch area (${areaId}):`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  useEffect(() => {
    fetchArea();
  }, [fetchArea]);

  /* ──────── CREATE OR UPDATE ──────── */
  const saveArea = async (payload) => {
    setLoading(true);
    try {
      const saved = areaId
        ? await updateArea(areaId, payload)
        : await createArea(payload);
      setArea(saved);
      return saved;
    } catch (err) {
      console.error('❌ [useArea] Failed to save area:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ──────── UPDATE POLYGON ONLY ──────── */
  const handleUpdatePolygon = async (polygonPayload) => {
    if (!areaId) return;
    setLoading(true);
    try {
      const updated = await updateAreaPolygon(areaId, polygonPayload);
      setArea(updated);
      return updated;
    } catch (err) {
      console.error('❌ [useArea] Failed to update polygon:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ──────── DELETE ──────── */
  const removeArea = async () => {
    if (!areaId) return;
    setLoading(true);
    try {
      await deleteArea(areaId);
      setArea(null);
    } catch (err) {
      console.error(`❌ [useArea] Failed to delete area (${areaId}):`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    area,
    loading,
    error,
    fetchArea,
    saveArea,
    updatePolygon: handleUpdatePolygon,
    removeArea,
    setArea, // for preview
  };
}
