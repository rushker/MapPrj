// components/postmap/draw/useGeomanEvents
import { useEffect } from 'react';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
/**
 * Hook tích hợp leaflet-geoman với nhiều chế độ:
 * - vẽ polygon, rectangle, marker
 * - bật/tắt edit mode, drag mode, removal mode
 * - cập nhật tọa độ khi người dùng chỉnh sửa polygon
 *
 * @param {object} mapRef - ref đến Map instance
 * @param {object} options
 * @param {boolean} [options.enableDraw] - bật/tắt chế độ vẽ
 * @param {string|null} [options.drawShape] - loại shape để vẽ: 'Polygon', 'Rectangle', 'Marker', hoặc null
 * @param {boolean} [options.enableEdit] - bật/tắt chế độ chỉnh sửa polygon, marker đã có
 * @param {boolean} [options.enableDrag] - bật/tắt chế độ kéo thả các layer
 * @param {boolean} [options.enableRemove] - bật/tắt chế độ xóa layer
 * @param {function} options.onCreateKhuA - callback khi tạo khu A (polygon/rectangle)
 * @param {function} options.onCreateEntity - callback khi tạo entity khác (polygon, marker)
 * @param {function} [options.onUpdatePolygon] - callback khi cập nhật polygon (sau khi edit)
 */
const useGeomanEvents = ({
  mapRef,
  enableDraw,
  drawShape,
  enableEdit,
  enableDrag,
  enableRemove,
  onCreateKhuA,
  onCreateEntity,
  onUpdatePolygon,
  onUpdateEntityGeometry,
  isEditMode = false,
  mapReady = false,
}) => {
  useEffect(() => {
     // Chỉ khởi tạo khi map đã sẵn sàng
    if (!mapReady) {
      console.log("🕒 Waiting for map to be ready...");
      return;
    }
    const map = mapRef.current;
     if (!map || !map.pm || !isEditMode) {
      console.log("Geoman events not initialized: map or map.pm not ready");
      return;
    }
     console.log("✅ Initializing Geoman events");
    // Xử lý sự kiện tạo hình
    const handleCreate = (e) => {
      const { layer, shape } = e;
      const geoJson = layer.toGeoJSON();
      const coords = geoJson.geometry.coordinates;

      // Xử lý khi vẽ Rectangle
      if (shape === 'Rectangle' && typeof onCreateKhuA === 'function') {
        const coordinates = geoJson.geometry.coordinates[0];
        onCreateKhuA({ 
          type: 'polygon', 
          coordinates,
          polygon: geoJson.geometry
        });
      } 
      // Xử lý khi vẽ Polygon/Marker
      else if ((shape === 'Polygon' || shape === 'Marker') && typeof onCreateEntity === 'function') {
        onCreateEntity({ 
          type: shape.toLowerCase(),
          coordinates: shape === 'Marker' ? coords : coords[0]
        });
      }

      layer.remove();
    };

    // Xử lý sự kiện cập nhật hình
    const handleUpdate = (e) => {
      const layer = e.layer;
      const geoJson = layer.toGeoJSON();
      
      // Cập nhật Khu A (polygon)
      if (
        geoJson.geometry?.type === 'Polygon' &&
        typeof onUpdatePolygon === 'function' &&
        layer.options?.isAreaLayer
      ) {
        onUpdatePolygon({ coordinates: geoJson.geometry.coordinates });
      }
      
      // Cập nhật entity
      if (
        typeof onUpdateEntityGeometry === 'function' &&
        geoJson.properties?.entityId
      ) {
        const updatedCoords =
          geoJson.geometry.type === 'Polygon'
            ? geoJson.geometry.coordinates[0]
            : geoJson.geometry.type === 'Point'
            ? geoJson.geometry.coordinates
            : null;

        if (updatedCoords) {
          onUpdateEntityGeometry({
            entityId: geoJson.properties.entityId,
            coordinates: updatedCoords,
          });
        }
      }
    };

    // Đăng ký sự kiện
    map.on('pm:create', handleCreate);
    map.on('pm:update', handleUpdate);

    // Bật các chế độ theo props
    if (enableEdit) map.pm.enableGlobalEditMode();
    if (enableDrag) map.pm.enableGlobalDragMode();
    if (enableRemove) map.pm.enableGlobalRemovalMode();
    if (enableDraw && drawShape) {
      map.pm.enableDraw(drawShape);
    }

    // Cleanup
    return () => {
       if (!map || !map.pm) return;
      map.off('pm:create', handleCreate);
      map.off('pm:update', handleUpdate);
      
      // Tắt các chế độ
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
      map.pm.disableGlobalRemovalMode();
      
      if (drawShape) {
        map.pm.disableDraw(drawShape);
      }
    };
  }, [
    mapRef.current,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA,
    onCreateEntity,
    onUpdatePolygon,
    onUpdateEntityGeometry,
    isEditMode,
    mapReady,
  ]);
};

export default useGeomanEvents;