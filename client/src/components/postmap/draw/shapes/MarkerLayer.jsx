// src/components/postmap/draw/shapes/MarkerLayer.jsx
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useAreaContext } from '../../../../context/AreaContext';

const MarkerLayer = ({ entities = [], selectedEntityId, onSelectEntity}) => {
  const map = useMap();
  const markerRefs = useRef({});
  const { isEditMode } = useAreaContext();
  
  useEffect(() => {
    if (isEditMode || !selectedEntityId) return;

    const selected = entities.find(e => e._id === selectedEntityId && e.type === 'marker');
    if (selected?.geometry?.coordinates) {
      const [lng, lat] = selected.geometry.coordinates;
      map.flyTo([lat, lng], 18, { duration: 0.5 });A
    }

    const marker = markerRefs.current[selectedEntityId];
    if (marker) marker.openPopup();
  }, [selectedEntityId, entities, map,isEditMode]);

  return (
    <>
      {entities
        .filter(e => e.type === 'marker' && e.geometry?.coordinates)
        .map(entity => {
          const [lng, lat] = entity.geometry.coordinates;
          return (
            <Marker
              key={entity._id}
              position={[lat, lng]}
              icon={L.icon({
                iconUrl:
                  entity._id === selectedEntityId
                    ? '/icons/marker-selected.png'
                    : '/icons/marker.png',
                iconSize: [30, 40],
                iconAnchor: [15, 40],
                popupAnchor: [0, -30],
              })}
              eventHandlers={
                // Sử dụng isEditMode thay vì readOnly
                !isEditMode
                  ? {} // Không cho click nếu không phải edit mode
                  : {
                      click: () => onSelectEntity?.(entity._id),
                    }
              }
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
          );
        })}
    </>
  );
};

export default MarkerLayer;
