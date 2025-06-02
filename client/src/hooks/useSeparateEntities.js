// hooks/useSeparateEntities.js
import { useMemo } from 'react';

/**
 * Hook tách entities thành 2 loại: polygon (khuC) và marker
 * @param {Array} entities - mảng entity có trường type: 'polygon' hoặc 'marker'
 * @returns {Object} { khuCs, markers }
 */
export default function useSeparateEntities(entities = []) {
  return useMemo(() => {
    const khuCs = entities.filter(e => e.type === 'polygon');
    const markers = entities.filter(e => e.type === 'marker');
    return { khuCs, markers };
  }, [entities]);
}
