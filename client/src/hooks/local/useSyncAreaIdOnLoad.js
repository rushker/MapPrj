/**hooks/useSyncAreaIdOnLoad.js
 * test load system  when 
 * 
import { useEffect } from 'react';
import { useAreaContext } from '../../context/AreaContext';

const LOCAL_KEY = 'currentAreaId';
const LOCAL_MAP_KEY = 'areaCoordinatesMap';

/**
 * Đồng bộ areaId từ localStorage vào AreaContext khi load lại trang
 */
/*export function useSyncAreaIdOnLoad() {
  const { areaId, setAreaId } = useAreaContext();

  useEffect(() => {
    // Chỉ sync nếu Context chưa có areaId (đã reload trang hoặc context chưa được khởi tạo)
    if (!areaId) {
      const savedId = localStorage.getItem(LOCAL_KEY);
      if (savedId) {
        setAreaId(savedId);
      }
    }
  }, [areaId, setAreaId]);
}
*/
/* sử dụng trong component root bên trong AreaProvider    
 useSyncAreaIdOnLoad();  ⬅️ tự động sync AreaContext khi reload

mở rộng hook này để:

bộ cả coordinates thì hook này có thể đọc thêm từ LOCAL_MAP_KEY

Fetch metadata theo areaId nếu chưa có?

Đồng bộ coordinates?

Xoá localStorage nếu user rời khỏi trang? */