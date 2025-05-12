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

  // Initialize Leaflet Map
  useEffect(() => {
    
    setDrawnPolygon(null);
    setPolygonInfo(null);

    const leafletMap = L.map('map').setView([0, 0], 2);
    mapRef.current = leafletMap;

    addTileLayer(leafletMap);
    enableDrawingControls(leafletMap);

    leafletMap.on('pm:create', (e) => handlePolygonDraw(e, leafletMap));

    return () => leafletMap.remove(); // Cleanup map instance on unmount
  }, []);

  // Add base OSM tile layer
  const addTileLayer = (map) => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  };

  // Enable drawing controls with only polygon tool
  const enableDrawingControls = (map) => {
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: false
    });
  };

  // Handle polygon draw event
  const handlePolygonDraw = (e, map) => {
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

    toast.success('Polygon selected!');
  };

  // Save polygon and redirect to edit page
  const handleSaveAndEdit = async () => {
  if (!drawnPolygon) {
    toast.error('Please draw a polygon first.');
    return;
  }

  try {
    const geojson = drawnPolygon.toGeoJSON();
    const { data } = await createMapArea(geojson);
    
    if (!data?._id) {
      throw new Error('Server response missing area ID');
    }
    
    toast.success('Map area saved!');
    navigate(`/edit/${data._id}`);
    
  } catch (err) {
    console.error('Save error:', err);
    toast.error(err.response?.data?.error || err.message || 'Failed to save map area');
  }
};

  return (
   <div className="h-screen w-screen relative flex">
      <div id="map" className="h-full w-full flex-grow z-0"></div>

      {/* Polygon Info Sidebar */}
     <div className="absolute top-4 right-4 bg-white shadow-lg rounded-xl p-4 w-64 z-[1000]">
  <h2 className="text-lg font-semibold mb-2 border-b pb-2">Polygon Info</h2>
  {polygonInfo ? (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-gray-500 mr-2">📍</span>
        <span>Coordinates: {polygonInfo.coordinatesCount}</span>
      </div>
      <div className="flex items-center">
        <span className="text-gray-500 mr-2">📐</span>
        <span>Area: {polygonInfo.area} km²</span>
      </div>
    </div>
  ) : (
    <p className="text-gray-500 text-sm italic">Draw a polygon to begin</p>
  )}
  <button
    onClick={handleSaveAndEdit}
    disabled={!drawnPolygon}
    className={`mt-4 w-full px-4 py-2 rounded transition-all ${
      drawnPolygon 
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
    }`}
  >
    Save & Edit
  </button>
</div>
    </div>
  );
};

export default BasemapPage;
