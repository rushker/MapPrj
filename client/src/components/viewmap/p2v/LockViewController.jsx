// components/viewmap/p2v/LockViewController.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import { latLngToGeo } from '../../../utils/geometry.js';

const LockViewController = ({ khuAPolygon = [], maxZoom = 18 }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || khuAPolygon.length < 3) return;

    const geoCoords = latLngToGeo(khuAPolygon);
    const polygon = turf.polygon([geoCoords]);
    const bounds = turf.bbox(polygon); // [minX, minY, maxX, maxY]

    const southWest = [bounds[1], bounds[0]];
    const northEast = [bounds[3], bounds[2]];
    const padded = turf.bboxPolygon(bounds);
    const buffered = turf.buffer(padded, 100, { units: 'meters' }); // buffer = 100m

    const bufferedBBox = turf.bbox(buffered); // [minX, minY, maxX, maxY]
    const sw = [bufferedBBox[1], bufferedBBox[0]];
    const ne = [bufferedBBox[3], bufferedBBox[2]];

    map.setMaxBounds([sw, ne]);
    map.setMaxZoom(maxZoom);

    return () => {
      map.setMaxBounds(null);
    };
  }, [map, khuAPolygon, maxZoom]);

  return null;
};

export default LockViewController;
