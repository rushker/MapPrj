// src/components/postmap/draw/shapes/PolygonLayer.jsx
import { Polygon, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { geoToLatLng } from '../../../../utils/geometry';
import { useSafeAreaContext } from '../../../../context/useSafeAreaContext.js';
import { isAreaIdReady } from '../../../../utils/areaUtils.js';
import centroid from '@turf/centroid';
import * as turf from '@turf/turf';

// Style khi được chọn
const selectedStyle = {
  color: '#ff5722',
  weight: 3,
  fill: false,
  fillColor: '#ffffff',
  fillOpacity: 0.2,
};

// Style mặc định
const getPolygonStyle = (entity, isSelected) => {
  if (isSelected) return selectedStyle;

  return {
    color: entity?.metadata?.strokeColor || '#3388ff',
    weight: 2,
    opacity: entity?.metadata?.strokeOpacity ?? 1,
    fill: true,
    fillColor: entity?.metadata?.fillColor || '#ffffff',
    fillOpacity: entity?.metadata?.fillOpacity ?? 0,
  };
};

/**
 * Tính tâm polygon từ geoJSON coordinates bằng @turf/centroid
 * @param {Array} coordinates - geoJSON Polygon coordinates ([[lng, lat], ...])
 * @returns {L.LatLng | null}
 */
const getPolygonCenterFromTurf = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return null;

  try {
    const turfPolygon = turf.polygon([coordinates]);
    const [lng, lat] = centroid(turfPolygon).geometry.coordinates;
    return L.latLng(lat, lng);
  } catch (err) {
    console.warn('Lỗi khi tính center bằng turf:', err);
    return null;
  }
};

const PolygonLayer = ({ selectedEntityId, onSelectEntity, entities: overrideEntities }) => {
  const map = useMap();
  const polygonRefs = useRef({});
  const safeContext = useSafeAreaContext();
  if (!safeContext) return null;

  const { areaId, isEditMode, isCreatingArea, entities } = safeContext;

  const polygons = (overrideEntities ?? entities).filter(
    (e) => e.type === 'polygon' && Array.isArray(e.geometry?.coordinates)
  );

  // Zoom tới polygon đang được chọn
  useEffect(() => {
    if (!isAreaIdReady({ areaId, isEditMode }) || isCreatingArea) return;

    const selected = polygons.find((e) => e._id === selectedEntityId);
    if (!selected?.geometry?.coordinates || selected?.isTemp) return;

    const latLngs = geoToLatLng(selected.geometry.coordinates);
    const bounds = L.latLngBounds(latLngs);
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 0.5 });
    }

    polygonRefs.current[selectedEntityId]?.openPopup?.();
  }, [selectedEntityId, polygons, map, isEditMode, areaId, isCreatingArea]);

  return (
    <>
      {polygons.map((entity) => {
        const latlngs = geoToLatLng(entity.geometry.coordinates);
        const style = getPolygonStyle(entity, entity._id === selectedEntityId);
        const rawCoords = entity.geometry.coordinates?.[0] ?? [];
        const center = getPolygonCenterFromTurf(rawCoords);

        return (
          <Polygon
            key={entity._id}
            positions={latlngs}
            pathOptions={style}
            eventHandlers={
              isEditMode
                ? {}
                : {
                    click: () => onSelectEntity?.(entity._id),
                  }
            }
            ref={(ref) => {
              if (ref) polygonRefs.current[entity._id] = ref;
            }}
          >
            {center && (
              <Popup position={center}>
                <strong>{entity.name || 'Khu vực'}</strong>
                <br />
                {entity.description || 'Không có mô tả'}
              </Popup>
            )}
          </Polygon>
        );
      })}
    </>
  );
};

export default PolygonLayer;
