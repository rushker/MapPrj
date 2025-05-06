// src/utils/geoUtils.js
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';

/**
 * Check if a given latlng is inside a polygon
 */
export function isPointInPolygon(latlng, geoPolygon) {
  const pt = point([latlng.lng, latlng.lat]);
  return booleanPointInPolygon(pt, geoPolygon);
}

/**
 * Get the area (in square meters) of a polygon
 */
export function getPolygonArea(geoPolygon) {
  try {
    const turfPolygon = polygon(geoPolygon.geometry.coordinates);
    return turf.area(turfPolygon);
  } catch (e) {
    console.error('Invalid polygon:', e);
    return 0;
  }
}

/**
 * Validate polygon structure
 */
export function isValidPolygon(geoPolygon) {
  return (
    geoPolygon &&
    geoPolygon.type === 'Feature' &&
    geoPolygon.geometry?.type === 'Polygon' &&
    Array.isArray(geoPolygon.geometry.coordinates)
  );
}
