// src/components/postmap/draw/PMControls.jsx
import { useEffect } from 'react';
import { useMapEvent } from 'react-leaflet';
import { isValidAreaId } from '../../../utils/areaUtils';

/**
 * Component khởi tạo Geoman và lắng nghe các sự kiện vẽ, chỉnh sửa
 */
export default function PMControls({
  areaId,
  isEditMode,
  mapRef,
  onCreateArea,
  onCreateEntity,
  onUpdatePolygon,
  onUpdateEntityGeometry,
  disableEntityCreation = false, // ✅ Thêm giá trị mặc định
}) {
  const map = useMapEvent('pm:mounted', () => {}); // Chờ map mount xong

  useEffect(() => {
    if (!map?.pm) return;

    // 🔗 Gán ref map về component cha
    if (mapRef) mapRef.current = map;

    // 🎛️ Cấu hình thanh công cụ Geoman
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawMarker: true,
      drawPolygon: true,
      drawRectangle: true,
      editMode: isEditMode,
      dragMode: isEditMode,
      removalMode: isEditMode,
    });

    // ✅ Bật/tắt vẽ entity theo disableEntityCreation
    if (disableEntityCreation) {
      map.pm.disableDraw('Polygon');
      map.pm.disableDraw('Marker');
    } else {
      map.pm.enableDraw('Polygon');
      map.pm.enableDraw('Marker');
    }

    // 🧮 Trích xuất toạ độ tùy theo hình vẽ
    const extractCoordinates = (geoJSON, shape) =>
      shape === 'Marker'
        ? geoJSON.geometry.coordinates
        : geoJSON.geometry.coordinates?.[0] ?? [];

    // 🛠️ Sự kiện tạo hình (marker, polygon, rectangle)
    const handleCreate = async (e) => {
      const { layer, shape } = e;
      const geoJSON = layer.toGeoJSON();
      const coordinates = extractCoordinates(geoJSON, shape);

      if (shape === 'Rectangle' && onCreateArea) {
        layer.options.isAreaLayer = true;
        await onCreateArea({
          type: 'polygon',
          coordinates,
          polygon: geoJSON.geometry,
          maxZoom: map.getZoom(),
        });
        layer.remove(); // Remove rectangle sau khi dùng
        return;
      }

      if (
        (shape === 'Polygon' || shape === 'Marker') &&
        isValidAreaId(areaId) &&
        onCreateEntity
      ) {
        onCreateEntity({
          type: shape.toLowerCase(),
          coordinates,
          geometry: geoJSON.geometry,
          layer,
          geoJSON,
          metadata: { strokeOpacity: 1 }, // default opacity
        });
      }
    };

    // 🔁 Sự kiện chỉnh sửa hình (area hoặc entity)
    const handleUpdate = (e) => {
      const geoJSON = e.layer.toGeoJSON();

      // Nếu là Area
      if (
        geoJSON.geometry.type === 'Polygon' &&
        e.layer.options?.isAreaLayer &&
        onUpdatePolygon
      ) {
        onUpdatePolygon({ coordinates: geoJSON.geometry.coordinates });
      }

      // Nếu là Entity có ID
      if (geoJSON.properties?.entityId && onUpdateEntityGeometry) {
        const coordinates =
          geoJSON.geometry.type === 'Point'
            ? geoJSON.geometry.coordinates
            : geoJSON.geometry.coordinates?.[0];

        onUpdateEntityGeometry({
          entityId: geoJSON.properties.entityId,
          coordinates,
        });
      }
    };

    // 🎧 Lắng nghe sự kiện
    map.on('pm:create', handleCreate);
    map.on('pm:update', handleUpdate);

    // 🧹 Dọn dẹp khi unmount
    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:update', handleUpdate);
      map.pm.removeControls();
    };
  }, [map, isEditMode, areaId, disableEntityCreation]);

  return null;
}
