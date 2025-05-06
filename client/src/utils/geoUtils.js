// src/utils/geoUtils.js
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import turf from 'turf';

/**
 * Check if a given latlng is inside a polygon
 */
export function isPointInPolygon(latlng, geoPolygon) {
  try {
    const pt = point([latlng.lng, latlng.lat]);
    return booleanPointInPolygon(pt, geoPolygon);
  } catch (error) {
    console.error('Error in isPointInPolygon:', error);
    return false; // Return false if there is an error
  }
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
  try {
    return (
      geoPolygon &&
      geoPolygon.type === 'Feature' &&
      geoPolygon.geometry?.type === 'Polygon' &&
      Array.isArray(geoPolygon.geometry.coordinates)
    );
  } catch (e) {
    console.error('Invalid polygon structure:', e);
    return false;
  }
}
