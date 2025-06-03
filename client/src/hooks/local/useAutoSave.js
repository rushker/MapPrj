// hooks/local/useAutoSave.js
import { useEffect, useRef } from 'react';
import { updateArea } from '../../services/areas';
import { updateEntity } from '../../services/entities';
import toast from 'react-hot-toast';

const DEBOUNCE_INTERVAL = 20000;

/**
 * useAutoSave - Hook tự động lưu bản nháp thay đổi area và entity theo chu kỳ
 * 
 * @param {string} areaId - ID của khu vực (area)
 * @param {object} areaMetadata - Thông tin metadata của area
 * @param {Array} entityList - Danh sách các entity (Khu C, marker, ...)
 */
export default function useAutoSave(areaId, areaMetadata, entityList) {
  // Lưu trữ phiên bản trước của area và entities để so sánh thay đổi
  const prevAreaRef = useRef(null);
  const prevEntitiesRef = useRef([]);
  const debounceTimeoutRef = useRef(null);
  const isSavingRef = useRef(false);

  // ----------- So sánh thay đổi area metadata ------------
  const hasAreaChanged = (current, previous) => {
    if (!previous) return true;
    return (
      current?.name !== previous?.name ||
      current?.type !== previous?.type ||
      current?.description !== previous?.description ||
      current?.opacity !== previous?.opacity ||
      current?.lockedZoom !== previous?.lockedZoom
    );
  };

  // ----------- So sánh thay đổi entity dựa trên metadata và geometry ----------
  const hasEntityChanged = (current, previous) => {
    if (!previous) return true;
    return (
      current?.name !== previous?.name ||
      current?.type !== previous?.type ||
      current?.metadata?.description !== previous?.metadata?.description ||
      JSON.stringify(current?.geometry) !== JSON.stringify(previous?.geometry) ||
      JSON.stringify(current?.metadata?.images || []) !==
        JSON.stringify(previous?.metadata?.images || [])
    );
  };

  // ----------- Hàm chính thực hiện lưu dữ liệu ----------
  const saveChanges = async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    try {
      const changes = {
        area: false,
        entities: []
      };

      // 1. Lưu area nếu có thay đổi
      if (hasAreaChanged(areaMetadata, prevAreaRef.current)) {
        await updateArea(areaId, areaMetadata);
        changes.area = true;
      }

      // 2. Tạo map từ _id → entity trước đó để so sánh hiệu quả hơn
      const prevEntityMap = Object.fromEntries(
        prevEntitiesRef.current.map(e => [e._id, e])
      );

      // 3. Duyệt danh sách hiện tại và so sánh từng entity theo _id
      const entityUpdates = entityList.map(entity => {
        const prevEntity = prevEntityMap[entity._id];
        if (hasEntityChanged(entity, prevEntity)) {
          return updateEntity(entity._id, {
            name: entity.name,
            type: entity.type,
            geometry: entity.geometry,
            metadata: {
              description: entity.metadata?.description || '',
              images: entity.metadata?.images || []
            }
          }).then(() => entity._id); // Trả về _id nếu đã cập nhật
        }
        return Promise.resolve(null); // Không thay đổi
      });

      // 4. Thực hiện tất cả các cập nhật song song
      const updatedIds = (await Promise.all(entityUpdates)).filter(Boolean);
      changes.entities = updatedIds;

      // 5. Hiển thị thông báo nếu có thay đổi
      if (changes.area || changes.entities.length > 0) {
        console.log('[AutoSave] ✅ Saved changes:', changes);
        toast.success('Đã tự động lưu bản nháp');

        // Cập nhật reference sau khi lưu thành công
        prevAreaRef.current = { ...areaMetadata };
        prevEntitiesRef.current = [...entityList];
      }
    } catch (err) {
      console.error('[AutoSave] ❌ Save error:', err);
      toast.error('Tự động lưu thất bại');
    } finally {
      isSavingRef.current = false;
    }
  };

  // --------------- Debounce tự động lưu sau mỗi lần thay đổi ----------------
  useEffect(() => {
    if (!areaId) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(saveChanges, DEBOUNCE_INTERVAL);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [areaId, areaMetadata, entityList]);

  // ---------------- Lưu thủ công khi cần thiết (gọi từ ngoài) ---------------
  const manualSave = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    return saveChanges();
  };

  return { manualSave };
}
