// src/utils/geoUtils.js
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon as turfPolygon } from '@turf/helpers';
import area from '@turf/area';

/**
 * Check if a given [lat, lng] coordinate is inside a GeoJSON Polygon feature.
 * @param {[number, number]} latlng - [lat, lng]
 * @param {object} geoFeature - GeoJSON Feature with Polygon geometry
 * @returns {boolean}
 */
export function isPointInGeoPolygon(latlng, geoFeature) {
  try {
    const pt = point([latlng[1], latlng[0]]);
    return booleanPointInPolygon(pt, geoFeature);
  } catch (err) {
    console.error('isPointInGeoPolygon error:', err);
    return false;
  }
}

/**
 * Compute area of a GeoJSON Polygon feature, in square meters.
 * @param {object} geoFeature - GeoJSON Feature with Polygon geometry
 * @returns {number}
 */
export function getGeoPolygonArea(geoFeature) {
  try {
    const turfPoly = turfPolygon(geoFeature.geometry.coordinates);
    return area(turfPoly);
  } catch (err) {
    console.error('getGeoPolygonArea error:', err);
    return 0;
  }
}

/**
 * Validate that an object is a proper GeoJSON Polygon Feature.
 * @param {object} geoFeature
 * @returns {boolean}
 */
export function isValidGeoPolygonFeature(geoFeature) {
  return (
    geoFeature?.type === 'Feature' &&
    geoFeature.geometry?.type === 'Polygon' &&
    Array.isArray(geoFeature.geometry.coordinates)
  );
}
