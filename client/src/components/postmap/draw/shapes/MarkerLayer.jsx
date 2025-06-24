// src/components/postmap/draw/shapes/MarkerLayer.jsx
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { isAreaIdReady } from '../../../../utils/areaUtils.js';
import { useSafeAreaContext } from '../../../../context/useSafeAreaContext';

const MarkerLayer = ({ selectedEntityId, onSelectEntity, entities: overrideEntities }) => {
  const map = useMap();
  const markerRefs = useRef({});
  const safeContext = useSafeAreaContext();
  if (!safeContext) return null;

  const { areaId, isEditMode, isCreatingArea, entities } = safeContext;
  const markers = (overrideEntities ?? entities).filter(
    (e) => e.type === 'marker' && e.geometry?.coordinates
  );

  useEffect(() => {
    if (!isAreaIdReady({ areaId, isEditMode }) || isCreatingArea) return;
    if (isEditMode || !selectedEntityId) return;

    const selected = markers.find((e) => e._id === selectedEntityId);
    if (selected?.geometry?.coordinates) {
      const [lng, lat] = selected.geometry.coordinates;
      map.flyTo([lat, lng], 18, { duration: 0.5 });
    }

    markerRefs.current[selectedEntityId]?.openPopup();
  }, [selectedEntityId, markers, map, isEditMode, areaId, isCreatingArea]);

  return (
    <>
      {markers.map((entity) => {
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
              isEditMode
                ? {}
                : {
                    click: () => onSelectEntity?.(entity._id),
                  }
            }
            ref={(ref) => {
              if (ref) markerRefs.current[entity._id] = ref;
            }}
          >
            <Popup>
              <strong>{entity.name || 'Điểm'}</strong>
              <br />
              {entity.metadata?.description || 'Không có mô tả'}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MarkerLayer;
