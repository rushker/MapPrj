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

  useEffect(() => {
    const map = L.map('map').setView([0, 0], 2);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: false
    });

    map.on('pm:create', (e) => {
      if (drawnPolygon) {
        map.removeLayer(drawnPolygon);
      }

      const layer = e.layer;
      setDrawnPolygon(layer);

      const geojson = layer.toGeoJSON();
      const areaSqKm = turf.area(geojson) / 1e6;
      const coords = geojson.geometry.coordinates[0];

      setPolygonInfo({
        area: areaSqKm.toFixed(2),
        coordinatesCount: coords.length
      });

      toast.success('Polygon selected!');
    });

    return () => map.remove();
  }, []);

  const handleSaveAndEdit = async () => {
    if (!drawnPolygon) {
      toast.error('Please draw a polygon first.');
      return;
    }

    const geojson = drawnPolygon.toGeoJSON();

    try {
      const res = await createMapArea(geojson);
      toast.success('Map area saved!');
      navigate(`/edit/${res.data._id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save map area.');
    }
  };

  return (
    <div className="h-screen w-screen relative flex">
      <div id="map" className="h-full w-full flex-grow z-0"></div>

      {/* Sidebar Info */}
      <div className="absolute top-4 left-4 bg-white shadow-lg rounded-xl p-4 w-64 z-[1000]">
        <h2 className="text-lg font-semibold mb-2">Polygon Info</h2>
        {polygonInfo ? (
          <ul className="text-sm space-y-1">
            <li>📍 Coordinates: {polygonInfo.coordinatesCount}</li>
            <li>📐 Area: {polygonInfo.area} km²</li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Draw a polygon to begin.</p>
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
