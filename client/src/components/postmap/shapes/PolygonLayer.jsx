// src/components/postmap/shapes/PolygonLayer.jsx
import { Polygon, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

const defaultStyle = {
  color: '#3388ff',
  weight: 2,
  fillOpacity: 0.2,
};

const selectedStyle = {
  color: '#ff5722',
  weight: 3,
  fillOpacity: 0.4,
};

const PolygonLayer = ({ entities = [], selectedEntityId, onSelectEntity }) => {
  const map = useMap();
  const polygonRefs = useRef({});

  useEffect(() => {
    if (!selectedEntityId) return;

    const selected = entities.find(e => e._id === selectedEntityId && e.type === 'polygon');
    if (selected?.coordinates) {
      // Fly map to center of polygon bounds
      const latLngs = selected.coordinates;
      const bounds = latLngs.length && latLngs[0] && L.latLngBounds(latLngs);
      if (bounds && bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 0.5 });
      }
    }

    // Mở popup polygon được chọn
    const polygon = polygonRefs.current[selectedEntityId];
    if (polygon) {
      polygon.openPopup();
    }
  }, [selectedEntityId, entities, map]);

  return (
    <>
      {entities
        .filter(entity => entity.type === 'polygon' && entity.coordinates)
        .map(entity => (
          <Polygon
            key={entity._id}
            positions={entity.geometry.coordinates.map(coord => [coord[1], coord[0]])}
            pathOptions={entity._id === selectedEntityId ? selectedStyle : defaultStyle}
            eventHandlers={{
              click: () => onSelectEntity?.(entity._id),
            }}
            ref={ref => {
              if (ref) {
                polygonRefs.current[entity._id] = ref;
              }
            }}
          >
            <Popup>
              <strong>{entity.name || 'Khu vực'}</strong>
              <br />
              {entity.description || 'Không có mô tả'}
            </Popup>
          </Polygon>
        ))}
    </>
  );
};

export default PolygonLayer;
