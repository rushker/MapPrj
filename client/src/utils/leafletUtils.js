// src/utils/leafletUtils.js
import L from 'leaflet';

/**
 * Convert a GeoJSON Polygon feature to an array of LatLng tuples for Leaflet.
 * @param {object} geoFeature - GeoJSON Feature with Polygon geometry
 * @returns {[number, number][]} Array of [lat, lng]
 */
export function geoJsonToLatLngs(geoFeature) {
  if (!geoFeature?.geometry?.coordinates?.[0]) return [];
  return geoFeature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
}

/**
 * Get a Leaflet LatLngBounds from a GeoJSON Polygon feature.
 * @param {object} geoFeature - GeoJSON Feature with Polygon geometry
 * @returns {L.LatLngBounds} Leaflet bounds instance
 */
export function getBoundsFromGeoJson(geoFeature) {
  const latlngs = geoJsonToLatLngs(geoFeature);
  return L.latLngBounds(latlngs);
}

/**
 * Fit a Leaflet map view to a GeoJSON Polygon feature.
 * @param {L.Map} map - Leaflet map instance
 * @param {object} geoFeature - GeoJSON Feature with Polygon geometry
 * @param {object} [options] - Options for fitBounds
 */
export function fitMapToGeoJson(map, geoFeature, options = { padding: [20, 20] }) {
  const bounds = getBoundsFromGeoJson(geoFeature);
  map.fitBounds(bounds, options);
}

/**
 * Create a standard OpenStreetMap tile layer for Leaflet.
 * @param {object} [opts] - Options to pass to L.tileLayer
 * @returns {L.TileLayer}
 */
export function createOSMTileLayer(opts = {}) {
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    ...opts,
  });
}
