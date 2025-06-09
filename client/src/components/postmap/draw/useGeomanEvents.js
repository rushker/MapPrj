import { useEffect } from 'react';

/**
 * Hook tích hợp leaflet-geoman với nhiều chế độ:
 * - vẽ polygon, rectangle, marker
 * - bật/tắt edit mode, drag mode, removal mode
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
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Khởi tạo controls leaflet-geoman với tắt hết
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Tắt hết trước, tránh trạng thái sót
    map.pm.disableGlobalEditMode();
    map.pm.disableGlobalDragMode();
    map.pm.disableGlobalRemovalMode();
    if (drawShape) {
      map.pm.disableDraw(drawShape);
    }

    // Bật các chế độ theo props nếu có
    if (enableDraw && drawShape) {
      map.pm.enableDraw(drawShape);
    }

    if (enableEdit) {
      map.pm.enableGlobalEditMode();
    }

    if (enableDrag) {
      map.pm.enableGlobalDragMode();
    }

    if (enableRemove) {
      map.pm.enableGlobalRemovalMode();
    }

    // Xử lý sự kiện tạo layer mới
    const handleCreate = (e) => {
      const { layer, shape } = e;
      const geoJson = layer.toGeoJSON();
      const coords = geoJson.geometry.coordinates;

      if (shape === 'Rectangle') {
        if (typeof onCreateKhuA === 'function') {
          onCreateKhuA({
            type: 'polygon',
            coordinates: coords,
          });
        }
      } else if (shape === 'Polygon') {
        if (typeof onCreateEntity === 'function') {
          onCreateEntity({
            type: 'polygon',
            coordinates: coords,
          });
        }
      } else if (shape === 'Marker') {
        const latlng = layer.getLatLng();
        if (typeof onCreateEntity === 'function') {
          onCreateEntity({
            type: 'marker',
            coordinates: [latlng.lng, latlng.lat],
          });
        }
      }

      // Xóa layer vẽ sau khi tạo để tránh lưu layer tạm trên map
      layer.remove();
    };

    map.on('pm:create', handleCreate);

    // Cleanup
    return () => {
      map.off('pm:create', handleCreate);
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
      map.pm.disableGlobalRemovalMode();
      if (drawShape) {
        map.pm.disableDraw(drawShape);
      }
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
