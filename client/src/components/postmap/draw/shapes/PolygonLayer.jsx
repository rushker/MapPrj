// src/components/postmap/draw/shapes/PolygonLayer.jsx
import { Polygon, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import { geoToLatLng } from '../../../../utils/geometry';
import L from 'leaflet';
import { useSafeAreaContext } from '../../../../context/useSafeAreaContext.js';
import { isAreaIdReady } from '../../../../utils/areaUtils.js';

const defaultStyle = {
  color: '#3388ff',
  weight: 2,
  fill: false,            // 💥 Tắt fill
  fillColor: 'transparent',
  fillOpacity: 0,         // 💥 Đảm bảo không có fill
   opacity: entity.metadata?.strokeOpacity ?? 1,
};

const selectedStyle = {
  color: '#ff5722',
  weight: 3,
  fill: false,
  fillColor: 'transparent',
  fillOpacity: 0,
};

const PolygonLayer = ({ selectedEntityId, onSelectEntity, entities: overrideEntities }) => {
  const map = useMap();
  const polygonRefs = useRef({});
  const safeContext = useSafeAreaContext();
  if (!safeContext) return null;

  const { areaId, isEditMode, isCreatingArea, entities } = safeContext;
  const polygons = (overrideEntities ?? entities).filter(e => e.type === 'polygon' && e.geometry?.coordinates);

  useEffect(() => {
    if (!isAreaIdReady({ areaId, isEditMode }) || isCreatingArea) return;
    if (!isEditMode || !selectedEntityId) return;

    const selected = polygons.find(e => e._id === selectedEntityId);
    if (selected?.geometry?.coordinates) {
      const latLngs = geoToLatLng(selected.geometry.coordinates);
      const bounds = L.latLngBounds(latLngs);
      if (bounds.isValid()) map.flyToBounds(bounds, { padding: [50, 50], duration: 0.5 });
    }

    polygonRefs.current[selectedEntityId]?.openPopup();
  }, [selectedEntityId, polygons, map, isEditMode, areaId, isCreatingArea]);

  return (
    <>
      {polygons.map(entity => {
        const latlngs = geoToLatLng(entity.geometry.coordinates);
        return (
          <Polygon
            key={entity._id}
            positions={latlngs}
            pathOptions={entity._id === selectedEntityId ? selectedStyle : defaultStyle}
            eventHandlers={
              isEditMode
                ? {}
                : {
                    click: () => onSelectEntity?.(entity._id),
                  }
            }
            ref={ref => {
              if (ref) polygonRefs.current[entity._id] = ref;
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
