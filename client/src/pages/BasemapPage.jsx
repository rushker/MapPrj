// src/pages/BasemapPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
import toast from 'react-hot-toast';
import { createMapArea } from '../services/mapAreaService';

const BasemapPage = () => {
  const mapRef = useRef(null);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const [polygonInfo, setPolygonInfo] = useState(null);
  const navigate = useNavigate();

  // Bounding box (limited visible area for masking)
  const boundingBox = [
    [-10, -10], // Southwest
    [10, 10]    // Northeast
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    const leafletMap = L.map('map').setView([0, 0], 3);
    mapRef.current = leafletMap;

    addTileLayer(leafletMap);
    enableDrawingControls(leafletMap);

    leafletMap.on('pm:create', (e) => handleRectangleDraw(e, leafletMap));

    // Limit panning
    leafletMap.setMaxBounds(boundingBox);

    return () => leafletMap.remove();
  }, []);

  const addTileLayer = (map) => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  };

  const enableDrawingControls = (map) => {
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: true
    });
  };

  const handleRectangleDraw = (e, map) => {
    if (drawnPolygon) {
      map.removeLayer(drawnPolygon);
    }

    const layer = e.layer;
    setDrawnPolygon(layer);

    const geojson = layer.toGeoJSON();
    const areaSqKm = turf.area(geojson) / 1e6;
    const coords = geojson.geometry.coordinates?.[0] || [];

    setPolygonInfo({
      area: areaSqKm.toFixed(2),
      coordinatesCount: coords.length
    });

    toast.success('Area selected!');

    // Add masking effect
    const bounds = turf.bboxPolygon([
      boundingBox[0][1], boundingBox[0][0], boundingBox[1][1], boundingBox[1][0]
    ]);

    const outer = bounds.geometry.coordinates[0];
    const hole = coords;

    const masked = L.polygon([outer, hole], {
      color: '#000',
      weight: 0,
      fillColor: 'black',
      fillOpacity: 0.5,
      interactive: false
    });

    masked.addTo(map);
  };

  const handleSaveAndEdit = async () => {
    if (!drawnPolygon) {
      toast.error('Please draw a rectangle first.');
      return;
    }

    try {
      const geojson = drawnPolygon.toGeoJSON();

      const requestData = {
        polygon: {
          type: 'Polygon',
          coordinates: geojson.geometry.coordinates
        }
      };

      const { data } = await createMapArea(requestData);
      toast.success('Map area saved!');
      navigate(`/edit/${data._id}`);
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to save map area. Check console for details.');
    }
  };

  return (
    <div className="h-screen w-screen relative flex">
      <div id="map" className="h-full w-full flex-grow z-0" />

      {/* Polygon Info Sidebar */}
      <div className="absolute top-4 left-[88px] bg-white shadow-lg rounded-xl p-4 w-64 z-[1000]">
        <h2 className="text-lg font-semibold mb-2">Area Info</h2>
        {polygonInfo ? (
          <ul className="text-sm space-y-1">
            <li>📍 Coordinates: {polygonInfo.coordinatesCount}</li>
            <li>📐 Area: {polygonInfo.area} km²</li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Draw a rectangle to begin.</p>
        )}

        <button
          onClick={handleSaveAndEdit}
          disabled={!drawnPolygon}
          className={`mt-4 w-full px-4 py-2 text-white rounded ${
            drawnPolygon ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save & Edit
        </button>
      </div>
    </div>
  );
};

export default BasemapPage;
