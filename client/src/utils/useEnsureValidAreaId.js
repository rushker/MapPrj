// hooks/utils/useEnsureValidAreaId.js
import { useEffect } from 'react';
import { useAreaContext } from '../context/AreaContext';
import { useTempAreaId } from '../hooks/local/useTempAreaId';
import { findMatchingAreaIdByCoordinates } from '../utils/areaUtils';
import { createArea } from '../services/areas';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook ensureValidAreaId
 * - Đảm bảo context luôn có areaId hợp lệ dựa trên coordinates từ map.
 * - Tự động restore hoặc tạo mới nếu cần.
 * - Dọn URL duplicate areaId nếu có.
 *
 * @param {Function} getCoordinates  Callback trả về coords hiện tại ([[lat,lng],...])
 * @param {number} defaultMaxZoom     Mức zoom mặc định khi khởi tạo
 */
export function useEnsureValidAreaId(getCoordinates, defaultMaxZoom) {
  const { areaId, setAreaId } = useAreaContext();
  const { saveAreaId } = useTempAreaId();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const coords = getCoordinates();
      if (!coords) return; // 1) Chưa vẽ rectangle → skip

      // 2) Nếu chưa có trong context
      if (!areaId) {
        // 2a) Thử restore từ localStorage
        const restored = findMatchingAreaIdByCoordinates(coords);
        if (restored) {
          setAreaId(restored);
          return;
        }
        // 2b) Tạo mới nếu không tìm thấy
        toast.loading('Đang khởi tạo Khu A...');
        try {
          const res = await createArea({ coordinates: coords, maxZoom: defaultMaxZoom });
          const newId = res.data._id;
          saveAreaId(newId, coords);
          toast.success('Đã tạo Khu A mới thành công');
          return;
        } catch (err) {
          console.error('createArea failed', err);
          toast.error('Không thể tạo Khu A mới');
          return;
        }
      }

      // 3) Dọn URL nếu có duplicate /areaId/areaId
      const segments = location.pathname.split('/');
      const unique = [...new Set(segments)];
      const cleanPath = unique.join('/');
      if (location.pathname !== cleanPath) {
        navigate(cleanPath, { replace: true });
      }

      // 4) Nếu areaId lệch coords, cập nhật lại
      const valid = findMatchingAreaIdByCoordinates(coords);
      if (valid && valid !== areaId) {
        saveAreaId(valid, coords);
        toast('Cập nhật lại areaId chính xác');
      }
    })();
  }, [
    areaId,
    getCoordinates,
    defaultMaxZoom,
    setAreaId,
    saveAreaId,
    navigate,
    location.pathname,
  ]);
}
