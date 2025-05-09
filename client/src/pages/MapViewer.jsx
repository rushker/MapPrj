// src/pages/MapViewer.jsx
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMap } from '../services/mapService';

const MapViewer = () => {
  const { id } = useParams();
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const { data } = await getMap(id);

        const map = L.map('viewer-map').setView([0, 0], 2);
        mapRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Render the polygon boundary and zoom to fit
        const polygonLayer = L.geoJSON(data.polygon).addTo(map);
        map.fitBounds(polygonLayer.getBounds());

        // Limit panning/zooming to polygon bounds
        map.setMaxBounds(polygonLayer.getBounds());
        map.setMinZoom(map.getZoom());

        // Render markers with popups
        if (data.markers?.length) {
          data.markers.forEach((marker) => {
            const [lng, lat] = marker.geometry.coordinates;
            const { name, type, imageUrl } = marker.properties;
            const popupContent = `
              <strong>${name || 'No name'}</strong><br/>
              Type: ${type || 'N/A'}<br/>
              ${imageUrl ? `<img src="${imageUrl}" alt="${name}" width="100" />` : ''}
            `;
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(popupContent);
          });
        }
      } catch (err) {
        console.error('Failed to load map:', err);
      }
    };

    initMap();
  }, [id]);

  return <div id="viewer-map" className="h-screen w-screen" />;
};

export default MapViewer;
