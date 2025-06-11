// src/components/postmap/draw/shapes/PolygonLayer.jsx
import { Polygon, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import { geoToLatLng } from '../../../../utils/geometry';
import L from 'leaflet';
import { useAreaContext } from '../../../../context/AreaContext';
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

const PolygonLayer = ({ entities = [], selectedEntityId, onSelectEntity}) => {
  const map = useMap();
  const polygonRefs = useRef({});
  const { isEditMode } = useAreaContext();

  useEffect(() => {
    if (!isEditMode || !selectedEntityId) return;

    const selected = entities.find(e => e._id === selectedEntityId && e.type === 'polygon');
    if (selected?.geometry?.coordinates) {
      const latLngs = geoToLatLng(selected.geometry.coordinates);
      const bounds = L.latLngBounds(latLngs);
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 0.5 });
      }
    }

    const polygon = polygonRefs.current[selectedEntityId];
    if (polygon) polygon.openPopup();
  }, [selectedEntityId, entities, map,isEditMode]);

  return (
    <>
      {entities
        .filter(e => e.type === 'polygon' && e.geometry?.coordinates)
        .map(entity => {
          const latlngs = geoToLatLng(entity.geometry.coordinates);
          return (
            <Polygon
              key={entity._id}
              positions={latlngs}
              pathOptions={entity._id === selectedEntityId ? selectedStyle : defaultStyle}
              eventHandlers={
                isEditMode
                  ? {} // Không cho click nếu readOnly
                  : {
                      click: () => onSelectEntity?.(entity._id),
                    }
              }
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
          );
        })}
    </>
  );
};

export default PolygonLayer;
