// src/utils/leafletUtils.js

export const getBoundsFromPolygon = (polygonGeoJson) => {
    const coords = polygonGeoJson.geometry.coordinates[0];
    const latLngs = coords.map(([lng, lat]) => [lat, lng]);
    return latLngs;
  };
  