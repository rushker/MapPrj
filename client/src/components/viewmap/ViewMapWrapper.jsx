// src/components/viewmap/ViewMapWrapper.jsx
import { MapContainer, TileLayer } from 'react-leaflet';
import MaskOutside from './MaskOutside';
import AreaLayer from '../postmap/layers/AreaLayer';
import EntityLayer from '../postmap/layers/EntityLayer';
import ViewSidebar from './ViewSidebar';

const isValidPolygon = (polygon) =>
  Array.isArray(polygon) &&
  polygon.length >= 3 &&
  polygon.every(
    (pt) =>
      Array.isArray(pt) &&
      pt.length === 2 &&
      typeof pt[0] === 'number' &&
      typeof pt[1] === 'number'
  );

export default function ViewMapWrapper({ khuA, entities = [] }) {
  if (!khuA) return <div className="p-4">Không có dữ liệu khu A</div>;

  const validPolygon = isValidPolygon(khuA.polygon);
  const mapCenter = validPolygon ? khuA.polygon[0] : [10.762622, 106.660172];

  const khuCs = entities.filter((e) => e.type === 'khuC');
  const markers = entities.filter((e) => e.type === 'marker');

  return (
    <div className="flex relative">
      <div className="flex-1">
        <MapContainer
          center={mapCenter}
          zoom={17}
          style={{ height: '100vh', width: '100%' }}
          scrollWheelZoom={false}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {validPolygon && (
            <>
              <MaskOutside khuAPolygon={khuA.polygon} />
              <AreaLayer area={khuA} showLabel />
              <EntityLayer khuCs={khuCs} markers={markers} />
            </>
          )}
        </MapContainer>
      </div>

      {!validPolygon && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded shadow text-sm text-red-600 z-[1000]">
          Polygon không hợp lệ – không thể hiển thị khu A.
        </div>
      )}

      <ViewSidebar area={khuA} khuCs={khuCs} markers={markers} />
    </div>
  );
}
