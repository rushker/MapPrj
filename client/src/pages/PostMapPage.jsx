// src/pages/PostMapPage.jsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import { createArea } from '../services/areaService';
import { createEntity } from '../services/entityService';

export default function PostMapPage() {
  const mapRef = useRef(null);
  const [polygon, setPolygon] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const map = L.map('map').setView([21.0285, 105.8542], 13); // Hà Nội
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawRectangle: false,
    });

    map.on('pm:create', (e) => {
      if (e.shape === 'Polygon') {
        if (polygon) {
          map.removeLayer(polygon);
        }
        setPolygon(e.layer);
      }
    });

    map.on('click', (e) => {
      if (polygon) {
        const marker = L.marker(e.latlng).addTo(map);
        setMarkers((prev) => [...prev, marker]);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  const handleSave = async () => {
    if (!polygon) return alert('Vui lòng vẽ một khu vực!');

    const polygonGeoJSON = polygon.toGeoJSON().geometry;
    const area = await createArea({
      name: 'Khu A demo',
      type: 'demo',
      geometry: polygonGeoJSON,
    });

    await Promise.all(
      markers.map(async (m, i) => {
        const geo = m.toGeoJSON().geometry;
        await createEntity({
          name: `Khu C ${i + 1}`,
          type: 'marker',
          geometry: geo,
          parentAreaId: area._id,
        });
      })
    );

    alert('Lưu thành công!');
  };

  return (
    <div className="w-full h-screen relative">
      <div id="map" className="w-full h-full"></div>
      <button
        className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Lưu Khu A + C
      </button>
    </div>
  );
}

