// utils/geometry.js
import * as turf from '@turf/turf';

export function metersToDegrees(meters) {
  return meters / 111320;
}

export const latLngToGeo = (latlngs) => latlngs.map(([lat, lng]) => [lng, lat]);

export const geoToLatLng = (geocoords) => geocoords.map(([lng, lat]) => [lat, lng]);

export function getBufferFromZoom(zoom) {
  const meterPerZoom = {
    22: 1, 21: 2, 20: 5, 19: 10, 18: 20, 17: 40,
    16: 80, 15: 160, 14: 320, 13: 640, 12: 1280,
    11: 2000, 10: 4000,
  };
  return meterPerZoom[zoom] || 1000;
}

export function createBufferedMask(khuAPolygon, zoom = 18) {
  if (!Array.isArray(khuAPolygon) || khuAPolygon.length < 3) return null;

  const bufferInMeters = getBufferFromZoom(zoom);
  const coordinatesLngLat = latLngToGeo(khuAPolygon);
  const khuAGeoJson = turf.polygon([coordinatesLngLat]);

  const [minX, minY, maxX, maxY] = turf.bbox(khuAGeoJson);
  const delta = metersToDegrees(bufferInMeters);

  const expandedBBox = [minX - delta, minY - delta, maxX + delta, maxY + delta];
  const outerPolygon = turf.bboxPolygon(expandedBBox);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        outerPolygon.geometry.coordinates[0], // Outer shell
        coordinatesLngLat,                    // Hole
      ],
    },
  };
}

