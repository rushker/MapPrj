// src/components/sidebars/entities/EntitySidebar.jsx
import PolygonSidebar from './PolygonSidebar';
import MarkerSidebar from './MarkerSidebar';

export default function EntitySidebar(props) {
  const { entity } = props;

  if (!entity || !entity.type) {
    return (
      <div className="p-4 text-red-500">
        Không có thông tin entity hoặc thiếu 'type'
      </div>
    );
  }

  switch (entity.type) {
    case 'polygon':
      return <PolygonSidebar {...props} />;
    case 'marker':
      return <MarkerSidebar {...props} />;
    default:
      return (
        <div className="p-4 text-red-500">
          Không hỗ trợ entity loại: <strong>{entity.type}</strong>
        </div>
      );
  }
}
