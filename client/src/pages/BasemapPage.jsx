// src/pages/BasemapPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
import { createMapArea } from '../services/mapAreaService';

const BasemapPage = () => {
  const mapRef = useRef(null);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const map = L.map('map').setView([0, 0], 2);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Enable draw mode
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: false
    });

    map.on('pm:create', (e) => {
      // Remove previous if exists
      if (drawnPolygon) {
        map.removeLayer(drawnPolygon);
      }

      setDrawnPolygon(e.layer);
    });

    return () => map.remove();
  }, []);

  const handleSaveAndEdit = async () => {
    if (!drawnPolygon) {
      alert('Please draw a polygon first.');
      return;
    }

    const geojson = drawnPolygon.toGeoJSON();
    try {
      const response = await createMapArea(geojson);
      navigate(`/edit/${response.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save map area.');
    }
  };

  return (
    <div className="h-screen w-screen relative">
      <div id="map" className="h-full w-full"></div>
      <button
        onClick={handleSaveAndEdit}
        className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-[1000]"
      >
        Save & Edit
      </button>
    </div>
  );
};

export default BasemapPage;
