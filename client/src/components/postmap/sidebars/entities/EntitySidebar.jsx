// src/components/sidebars/entities/EntitySidebar.jsx
import PolygonSidebar from './PolygonSidebar';
import MarkerSidebar from './MarkerSidebar';

/**
 * Wrapper xác định sidebar phù hợp theo entity.type
 */
export default function EntitySidebar(props) {
  const { entity } = props;
  if (!entity) return null;

  switch (entity.type) {
    case 'polygon':
      return <PolygonSidebar {...props} />;
    case 'marker':
      return <MarkerSidebar {...props} />;
    default:
      return <div className="p-4">Loại entity không hỗ trợ</div>;
  }
}
