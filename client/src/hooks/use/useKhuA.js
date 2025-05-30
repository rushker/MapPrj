// src/hooks/useKhuA.js
import { useState, useEffect, useCallback } from 'react';
import {
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
} from '../../services/areas';

export default function useKhuA(projectId, areaId) {
  const [khuA, setKhuA]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Fetch single area by ID
  const fetchKhuA = useCallback(async () => {
    if (!projectId || !areaId) return;
    setLoading(true);
    try {
      const data = await getAreaById(projectId, areaId);
      setKhuA(data);
    } catch (e) {
      console.error('Failed to load Khu A', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [projectId, areaId]);

  useEffect(() => {
    fetchKhuA();
  }, [fetchKhuA]);

  // Save (create or update) Khu A
  const saveKhuA = async (payload) => {
    setLoading(true);
    try {
      let saved;
      if (areaId) {
        saved = await updateArea(projectId, areaId, payload);
      } else {
        saved = await createArea(projectId, payload);
      }
      setKhuA(saved);
      return saved;
    } catch (e) {
      console.error('Failed to save Khu A', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Delete Khu A
  const removeKhuA = async () => {
    if (!areaId) return;
    setLoading(true);
    try {
      await deleteArea(projectId, areaId);
      setKhuA(null);
    } catch (e) {
      console.error('Failed to delete Khu A', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    khuA,
    loading,
    error,
    fetchKhuA,
    saveKhuA,
    removeKhuA,
    setKhuA, // for live preview during draw
  };
}
