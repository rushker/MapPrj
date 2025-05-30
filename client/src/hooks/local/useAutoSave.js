// hooks/local/useAutoSave.js
import { useEffect, useRef } from 'react';

const AUTO_SAVE_KEY = 'autosaveAreaState';

/**
 * useAutoSave
 * - Lưu định kỳ metadata khu A và entityList mỗi 20 giây vào localStorage
 * - Dùng để khôi phục nếu trình duyệt reload hoặc crash
 *
 * @param {string} areaId
 * @param {object} areaMetadata
 * @param {Array} entityList
 */
export default function useAutoSave(areaId, areaMetadata, entityList) {
  const prevSnapshotRef = useRef('');

  useEffect(() => {
    if (!areaId) return;

    const interval = setInterval(() => {
      const snapshot = JSON.stringify({ areaMetadata, entityList });

      // Nếu dữ liệu không đổi → bỏ qua lưu
      if (prevSnapshotRef.current === snapshot) return;

      prevSnapshotRef.current = snapshot;

      const payload = {
        areaId,
        tempAreaData: areaMetadata,
        tempEntities: entityList,
        lastSaved: new Date().toISOString(),
      };

      try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(payload));
        console.log('[AutoSave] Đã lưu tạm dữ liệu vào localStorage');
      } catch (err) {
        console.warn('[AutoSave] Không thể lưu:', err);
      }
    }, 20000); // mỗi 20 giây

    return () => clearInterval(interval);
  }, [areaId, areaMetadata, entityList]);
}

/**
 * Hàm tiện ích: Lấy lại dữ liệu autosave nếu có
 */
export function getAutoSavedData() {
  try {
    const data = localStorage.getItem(AUTO_SAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('[AutoSave] Không thể đọc dữ liệu:', err);
    return null;
  }
}

/**
 * Hàm tiện ích: Xóa dữ liệu autosave thủ công nếu cần
 */
export function clearAutoSavedData() {
  localStorage.removeItem(AUTO_SAVE_KEY);
}
