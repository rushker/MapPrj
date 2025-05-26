// src/components/postmap/shapes/MarkerLayer.jsx
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

const MarkerLayer = ({ entities = [], selectedEntityId, onSelectEntity }) => {
  const map = useMap();
  // Ref giữ các marker để mở popup thủ công
  const markerRefs = useRef({});

  useEffect(() => {
    if (!selectedEntityId) return;

    const selected = entities.find(e => e._id === selectedEntityId && e.type === 'marker');
    if (selected?.coordinates) {
      map.flyTo(selected.coordinates, 18, { duration: 0.5 });
    }

    // Mở popup của marker được chọn
    const marker = markerRefs.current[selectedEntityId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedEntityId, entities, map]);

  return (
    <>
      {entities
        .filter(entity => entity.type === 'marker' && entity.coordinates)
        .map(entity => (
          <Marker
            key={entity._id}
            position={[entity.geometry.coordinates[1], entity.geometry.coordinates[0]]}
            icon={L.icon({
              iconUrl:
                entity._id === selectedEntityId
                  ? '/icons/marker-selected.png'
                  : '/icons/marker.png',
              iconSize: [30, 40],
              iconAnchor: [15, 40],
              popupAnchor: [0, -30],
            })}
            eventHandlers={{
              click: () => onSelectEntity?.(entity._id),
            }}
            ref={ref => {
              if (ref) {
                markerRefs.current[entity._id] = ref;
              }
            }}
          >
            <Popup>
              <strong>{entity.name || 'Điểm'}</strong>
              <br />
              {entity.description || 'Không có mô tả'}
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default MarkerLayer;
