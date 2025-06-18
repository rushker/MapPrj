// components/postmap/draw/useGeomanEvents
import { useEffect } from 'react';

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
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,
  onCreateKhuA,
  onCreateEntity,
  onUpdatePolygon,
  onUpdateEntityGeometry,
  isEditMode = false,
}) => {
  useEffect(() => {
    const map = mapRef.current;
     if (!map || !isEditMode) return;

    // Khởi tạo controls leaflet-geoman (chỉ gọi 1 lần)
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

    // Tắt hết các chế độ cũ trước khi bật mới
    map.pm.disableGlobalEditMode();
    map.pm.disableGlobalDragMode();
    map.pm.disableGlobalRemovalMode();
    if (drawShape) {
      map.pm.disableDraw(drawShape);
    }

    if (enableDraw && drawShape) {
      map.pm.enableDraw(drawShape);
    }

    if (enableEdit) map.pm.enableGlobalEditMode();
    if (enableDrag) map.pm.enableGlobalDragMode();
    if (enableRemove) map.pm.enableGlobalRemovalMode();

    const handleCreate = (e) => {
      const { layer, shape } = e;
      const geoJson = layer.toGeoJSON();
      const coords = geoJson.geometry.coordinates;

      if (shape === 'Rectangle' && typeof onCreateKhuA === 'function') {
        onCreateKhuA({ type: 'polygon', coordinates: coords });
      } else if (shape === 'Polygon' && typeof onCreateEntity === 'function') {
        onCreateEntity({ type: 'polygon', coordinates: coords });
      } else if (shape === 'Marker' && typeof onCreateEntity === 'function') {
        const latlng = layer.getLatLng();
        onCreateEntity({ type: 'marker', coordinates: [latlng.lng, latlng.lat] });
      }

      layer.remove(); // luôn remove layer tạm vẽ sau tạo
    };

    const handleUpdate = (e) => {
  const layer = e.layer;
  const geoJson = layer.toGeoJSON();

  // Khu A polygon
  if (
    geoJson.geometry?.type === 'Polygon' &&
    typeof onUpdatePolygon === 'function' &&
    layer.options?.isAreaLayer
  ) {
    onUpdatePolygon({ coordinates: geoJson.geometry.coordinates });
  }

  // Entity polygon or marker
  if (
    typeof onUpdateEntityGeometry === 'function' &&
    geoJson.properties?.entityId
  ) {
    const updatedCoords =
      geoJson.geometry.type === 'Polygon'
        ? geoJson.geometry.coordinates
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


    map.on('pm:create', handleCreate);
    map.on('pm:update', handleUpdate);

    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:update', handleUpdate);

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
    isEditMode,
  ]);
};

export default useGeomanEvents;
