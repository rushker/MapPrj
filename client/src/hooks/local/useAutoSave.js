// hooks/local/useAutoSave.js
import { useEffect, useRef } from 'react';
import { saveFullAreaData } from '../../services/areas'; // API gộp lưu toàn bộ
import toast from 'react-hot-toast';

const DEBOUNCE_INTERVAL = 20000; // 20s

/**
 * useAutoSave
 * - Tự động gọi API lưu toàn bộ metadata (khu A + entities + polygon) sau 20s không thay đổi
 *
 * @param {string} areaId
 * @param {object} areaMetadata
 * @param {Array} entityList
 */
export default function useAutoSave(areaId, areaMetadata, entityList) {
  const prevSnapshotRef = useRef('');
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!areaId) return;

    const snapshot = JSON.stringify({ areaMetadata, entityList });

    // Nếu không thay đổi dữ liệu => không làm gì
    if (prevSnapshotRef.current === snapshot) return;

    prevSnapshotRef.current = snapshot;

    // Nếu có thay đổi → reset debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        await saveFullAreaData(areaId, {
          metadata: areaMetadata,
          entities: entityList,
        });

        console.log('[AutoSave] ✅ Đã lưu toàn bộ dữ liệu lên backend');
        toast.success('Đã tự động lưu bản nháp');
      } catch (err) {
        console.error('[AutoSave] ❌ Lỗi khi lưu:', err);
        toast.error('Tự động lưu thất bại');
      }
    }, DEBOUNCE_INTERVAL);

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [areaId, areaMetadata, entityList]);
}
