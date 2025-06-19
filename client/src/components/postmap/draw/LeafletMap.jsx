// components/postmap/draw/LeafletMap.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import useGeomanEvents from './useGeomanEvents';
import AreaLayer from './layers/AreaLayer';
import EntityLayer from './layers/EntityLayer';
import { useAreaContext } from '../../../context/AreaContext';
import { isValidAreaId } from '../../../utils/areaUtils';

// Import Geoman
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export default function LeafletMap({
  areaMetadata = null,
  selectedEntityId = null,
  onSelectEntity = () => {},
  enableDraw = false,
  drawShape = null,
  enableEdit = false,
  enableDrag = false,
  enableRemove = false,
  onCreateArea = () => {},
  onCreateEntity = () => {},
  onUpdatePolygon = () => {},
  onUpdateEntityGeometry = () => {},
}) {
  const mapRef = useRef(null);
  const { areaId, isEditMode } = useAreaContext();
  const [mapReady, setMapReady] = useState(false);

  // ✅ Callback khi tạo khu vực
  const handleCreateArea = (polygon) => {
    const coordinates = polygon.coordinates;
    onCreateArea({ coordinates, polygon, maxZoom: 18 });
  };

  // ✅ Callback khi tạo entity con
  const handleCreateEntity = (entity) => {
    if (!isValidAreaId(areaId)) return;
    onCreateEntity({ ...entity, areaId });
  };

  // ✅ Gắn sự kiện Geoman
  useGeomanEvents({
    mapRef,
    enableDraw,
    drawShape,
    enableEdit,
    enableDrag,
    enableRemove,
    onCreateKhuA: handleCreateArea,
    onCreateEntity: handleCreateEntity,
    onUpdatePolygon,
    onUpdateEntityGeometry,
    isEditMode,
    mapReady,
  });

 // ✅ Khởi tạo bản đồ
  const handleMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;
    console.log('✅ Leaflet map created');
    
    // Thêm timeout để đảm bảo map hoàn toàn khởi tạo
    setTimeout(() => {
      if (mapInstance.pm) {
        console.log('✅ Geoman plugin available');
        setMapReady(true);
      } else {
        console.error('❌ Geoman plugin not available');
      }
    }, 300);
  };

  // ✅ Thêm điều khiển Geoman khi map sẵn sàng
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    
    console.log('🚀 Adding Geoman controls');
    
    // Thêm điều khiển Geoman
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: true,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: true,
      drawPolygon: true,
      editMode: enableEdit,
      dragMode: enableDrag,
      removalMode: enableRemove,
    });

    // Đảm bảo thanh công cụ hiển thị
    const toolbar = document.querySelector('.leaflet-pm-toolbar');
    if (toolbar) {
      toolbar.style.display = 'block';
      toolbar.style.visibility = 'visible';
      toolbar.style.opacity = '1';
    }

  }, [mapReady, enableEdit, enableDrag, enableRemove, enableDraw]);


  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      whenCreated={handleMapCreated}
      pmIgnore={false} // Quan trọng để Geoman hoạt động
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
