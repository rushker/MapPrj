// utils/geoUtils.js

/**
 * Convert [lat, lng] → [lng, lat]
 * @param {Array<Array<number>>} coordinates 
 * @returns {Array<Array<number>>}
 */
export const convertToGeoJSON = (coordinates) =>
  coordinates.map(([lat, lng]) => [lng, lat]);

/**
 * Convert Polygon (array of rings) to GeoJSON-compatible format
 * @param {Array<Array<Array<number>>>} polygon 
 * @returns {Array<Array<Array<number>>>}
 */
export const convertPolygonToGeoJSON = (polygon) =>
  polygon.map(ring => convertToGeoJSON(ring));
