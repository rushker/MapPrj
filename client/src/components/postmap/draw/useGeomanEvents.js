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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Apply drawing tools
    if (enableDraw && drawShape) {
      map.pm.enableDraw(drawShape);
    } else if (drawShape) {
      map.pm.disableDraw(drawShape);
    }

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

    const handleCreate = (e) => {
      const { layer, shape } = e;
      const geoJson = layer.toGeoJSON();
      const coords = geoJson.geometry.coordinates;

      if (shape === 'Rectangle') {
        // Khu A - luôn là rectangle
        if (onCreateKhuA) {
          onCreateKhuA({
            type: 'polygon',
            coordinates: coords,
          });
        }
      } else if (shape === 'Polygon') {
        // Entity - Polygon
        if (onCreateEntity) {
          onCreateEntity({
            type: 'polygon',
            coordinates: coords,
          });
        }
      } else if (shape === 'Marker') {
        // Entity - Marker
        const latlng = layer.getLatLng();
        if (onCreateEntity) {
          onCreateEntity({
            type: 'marker',
            coordinates: [latlng.lng, latlng.lat],
          });
        }
      }

      // Cleanup layer after create
      layer.remove();
    };

    map.on('pm:create', handleCreate);

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