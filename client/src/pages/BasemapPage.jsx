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
  const [drawnRectangle, setDrawnRectangle] = useState(null);
  const [polygonInfo, setPolygonInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const map = L.map('map').setView([0, 0], 2);
    mapRef.current = map;

    addTileLayer(map);
    enableDrawingControls(map);

    map.on('pm:create', (e) => handleRectangleDraw(e, map));

    return () => map.remove();
  }, []);

  const addTileLayer = (map) => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  };

  const enableDrawingControls = (map) => {
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawPolygon: false,
      drawRectangle: true
    });
  };

  const handleRectangleDraw = (e, map) => {
    if (drawnRectangle) {
      map.removeLayer(drawnRectangle);
    }

    const layer = e.layer;
    setDrawnRectangle(layer);

    const geojson = layer.toGeoJSON();
    const areaSqKm = turf.area(geojson) / 1e6;
    const coords = geojson.geometry.coordinates?.[0] || [];

    setPolygonInfo({
      area: areaSqKm.toFixed(2),
      coordinatesCount: coords.length
    });

    toast.success('Area selected!');
  };

  const handleSaveAndEdit = async () => {
    if (!drawnRectangle) {
      toast.error('Please draw a rectangle first.');
      return;
    }

    try {
      const geojson = drawnRectangle.toGeoJSON();
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
      console.error('Error saving map area:', error);
      toast.error('Failed to save map area.');
    }
  };

  return (
    <div className="h-screen w-screen relative flex">
      <div id="map" className="h-full w-full flex-grow z-0" />

      <div className="absolute top-4 left-[88px] bg-white shadow-lg rounded-xl p-4 w-64 z-[1000]">
        <h2 className="text-lg font-semibold mb-2">Selected Area</h2>
        {polygonInfo ? (
          <ul className="text-sm space-y-1">
            <li>📍 Coordinates: {polygonInfo.coordinatesCount}</li>
            <li>📐 Area: {polygonInfo.area} km²</li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Draw a rectangle to select area.</p>
        )}

        <button
          onClick={handleSaveAndEdit}
          disabled={!drawnRectangle}
          className={`mt-4 w-full px-4 py-2 text-white rounded ${
            drawnRectangle ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save & Edit
        </button>
      </div>
    </div>
  );
};

export default BasemapPage;