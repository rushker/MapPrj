// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef, useEffect } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

// Import Geoman thay thế cho leaflet.pm
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export default function LeafletMap({
  areaMetadata = null,
  selectedEntityId = null,
  onSelectEntity = () => {},
  isCreatingArea,
  onDrawEnd,

  // Geoman control flags
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,

  // Callbacks
  onCreateArea = () => {},
  onCreateEntity = () => {},
  onUpdatePolygon = () => {},
  onUpdateEntityGeometry = () => {},
}) {
  const mapRef = useRef(null);
  const { areaId, isEditMode } = useAreaContext();

  // ✅ Callback khi vẽ xong khu vực mới (rectangle - Khu A)
  const handleCreateArea = (polygon) => {
    const coordinates = polygon.coordinates;
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Callback khi vẽ xong entity con (polygon/marker - Khu C)
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return null;
    onCreateEntity({ ...entity, areaId });
  };

  // Sử dụng Geoman thay vì leaflet.pm
  useEffect(() => {
    if (!mapRef.current || !isCreatingArea) return;
    
    const map = mapRef.current;
    
    // Kích hoạt chế độ vẽ rectangle
    map.pm.enableDraw('Rectangle', {
      snappable: true,
      snapDistance: 20,
    });
    
    // Xử lý khi hoàn thành vẽ
    const handleCreate = (e) => {
      const layer = e.layer;
      const latLngs = layer.getLatLngs();
      
      // Chuyển đổi sang GeoJSON format
      const coordinates = latLngs[0].map(latLng => [latLng.lng, latLng.lat]);
      const polygon = {
        type: 'Polygon',
        coordinates: [coordinates]
      };
      
      handleCreateArea({ polygon, coordinates });
      map.removeLayer(layer); // Xóa layer tạm
      map.pm.disableDraw(); // Tắt chế độ vẽ
      onDrawEnd(); // Thông báo hoàn thành
    };
    
    map.on('pm:create', handleCreate);
    
    return () => {
      map.off('pm:create', handleCreate);
      map.pm.disableDraw();
    };
  }, [isCreatingArea, onDrawEnd]);

  // Hook sự kiện Geoman
  useGeomanEvents({
    mapRef,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA: handleCreateArea, // Xử lý rectangle
  onCreateEntity: handleCreateEntity, // Xử lý polygon/marker
  onUpdatePolygon: handleUpdatePolygon,
  onUpdateEntityGeometry: handleUpdateEntityGeometry,
    isEditMode,
  });

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
        // Kích hoạt Geoman
        mapInstance.pm.addControls({  
          position: 'topleft',
          drawCircle: false,
        });
      }}
      pmIgnore={false} // Cho phép Geoman hoạt động
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {areaMetadata && <AreaLayer area={areaMetadata} />}

      <EntityLayer
        selectedEntityId={selectedEntityId}
        onSelectEntity={onSelectEntity}
      />
    </MapContainer>
  );
}