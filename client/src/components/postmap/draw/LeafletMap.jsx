//src/components/postmap/draw/LeafletMap
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';
import { useEffect } from 'react';

export default function LeafletMap({
  areaMetadata,
  selectedEntityId,
  onSelectEntity,
  onCreateArea,
  onCreateEntity,
  onUpdatePolygon,
  onUpdateEntityGeometry,
  mapRef, // ✅ Nhận prop từ PostMapWrapper
}) {
  const { areaId, isEditMode } = useAreaContext();

  // Helper component that runs _once_ after the map is created:
  function PMInit() {
    const map = useMapEvent('pm:mounted', () => {});

    useEffect(() => {
      if (!map.pm) return;

      // ✅ Gán map instance vào ref truyền từ cha
      if (mapRef) {
        mapRef.current = map;
      }

      // 1) Add toolbar
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

      // 2) onCreate handler
      const extractCoordinates = (gj, shape) =>
        shape === 'Marker'
          ? gj.geometry.coordinates
          : gj.geometry.coordinates?.[0] ?? [];

      const handleCreate = async (e) => {
  const { layer, shape } = e;
  const gj = layer.toGeoJSON();
  const coords = extractCoordinates(gj, shape);

  if (shape === 'Rectangle') {
    await onCreateArea({
      type: 'polygon',
      coordinates: coords,
      polygon: gj.geometry,
      maxZoom: map.getZoom(),
    });
    // Không remove layer, chờ AreaLayer render
  } else if ((shape === 'Polygon' || shape === 'Marker') && isValidAreaId(areaId)) {
  // Tạm giữ thông tin để user xác nhận
  onCreateEntity({
    type: shape.toLowerCase(),
    coordinates: coords,
    layer, // ✅ giữ lại layer để hiển thị hoặc remove nếu huỷ
    geoJSON: gj, // phòng trường hợp cần
  });
  }
};
      // 3) onUpdate handler
      const handleUpdate = (e) => {
        const gj = e.layer.toGeoJSON();

        if (
          gj.geometry.type === 'Polygon' &&
          e.layer.options.isAreaLayer &&
          onUpdatePolygon
        ) {
          onUpdatePolygon({ coordinates: gj.geometry.coordinates });
        }

        if (gj.properties?.entityId && onUpdateEntityGeometry) {
          const coords =
            gj.geometry.type === 'Point'
              ? gj.geometry.coordinates
              : gj.geometry.coordinates[0];
          onUpdateEntityGeometry({
            entityId: gj.properties.entityId,
            coordinates: coords,
          });
        }
      };

      map.on('pm:create', handleCreate);
      map.on('pm:update', handleUpdate);

      return () => {
        map.off('pm:create', handleCreate);
        map.off('pm:update', handleUpdate);
        map.pm.removeControls();
      };
    }, [map, isEditMode, areaId]);

    return null;
  }

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      pmIgnore={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PMInit />
      {areaMetadata && <AreaLayer area={areaMetadata} />}
      <EntityLayer
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </MapContainer>
  );
}
