// src/components/postmap/draw/useGeomanEvents.js
import { useEffect } from 'react';

/**
 * Hook tích hợp leaflet-geoman với nhiều chế độ:
 * - vẽ polygon, rectangle, marker
 * - bật/tắt edit mode, drag mode, removal mode
 *
 * @param {object} mapRef - ref đến Map instance
 * @param {object} options
 * @param {boolean} options.enableDraw - bật/tắt chế độ vẽ
 * @param {string} options.drawShape - loại shape để vẽ: 'Polygon', 'Rectangle', 'Marker', hoặc null
 * @param {boolean} options.enableEdit - bật/tắt chế độ chỉnh sửa polygon, marker đã có
 * @param {boolean} options.enableDrag - bật/tắt chế độ kéo thả các layer
 * @param {boolean} options.enableRemove - bật/tắt chế độ xóa layer
 * @param {function} options.onCreateKhuA - callback khi tạo khu A (polygon/rectangle)
 * @param {function} options.onCreateEntity - callback khi tạo entity khác (polygon, marker)
 */
const useGeomanEvents = ({
  mapRef,
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,
  onCreateKhuA,
  onCreateEntity,
}) => {
  // Thêm controls chỉ 1 lần khi map được tạo
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.pm.addControls({
      position: 'topleft',
      drawPolygon: false,
      drawMarker: false,
      drawRectangle: false,
      editMode: false,
      dragMode: false,
      removalMode: false,
    });

    return () => {
      map.pm.removeControls();
    };
  }, [mapRef]);

  // Effect chính quản lý bật/tắt chế độ và event
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Bật/tắt draw
    if (enableDraw && drawShape) {
      map.pm.enableDraw(drawShape);
    } else if (drawShape) {
      map.pm.disableDraw(drawShape);
    }

    // Bật/tắt edit, drag, remove
    if (enableEdit) {
      map.pm.enableGlobalEditMode();
    } else {
      map.pm.disableGlobalEditMode();
    }

    if (enableDrag) {
      map.pm.enableGlobalDragMode();
    } else {
      map.pm.disableGlobalDragMode();
    }

    if (enableRemove) {
      map.pm.enableGlobalRemovalMode();
    } else {
      map.pm.disableGlobalRemovalMode();
    }

    // Event tạo layer mới
    const handleCreate = (e) => {
      const { layer, shape } = e;
      const geoJson = layer.toGeoJSON();
      const coords = geoJson.geometry.coordinates;

      switch (shape) {
        case 'Rectangle':
        case 'Polygon':
          if (onCreateKhuA) {
            onCreateKhuA(coords);
          } else if (onCreateEntity) {
            onCreateEntity({ type: 'polygon', coordinates: coords });
          }
          break;
        case 'Marker': {
          const latlng = layer.getLatLng();
          if (onCreateEntity) {
            onCreateEntity({ type: 'marker', coordinates: [latlng.lng, latlng.lat] });
          }
          break;
        }
        default:
          break;
      }

      // Remove layer sau khi lấy data, vì ta quản lý layer qua state/entity
      layer.remove();
    };

    map.on('pm:create', handleCreate);

    // Cleanup khi unmount hoặc deps thay đổi
    return () => {
      map.off('pm:create', handleCreate);
      if (drawShape) {
        map.pm.disableDraw(drawShape);
      }
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
      map.pm.disableGlobalRemovalMode();
    };
  }, [
    mapRef,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA,
    onCreateEntity,
  ]);
};

export default useGeomanEvents;
