// src/pages/ViewMapPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getPublishedMap } from '../services/mapService';

export default function ViewerPage() {
  const { id } = useParams();
  const mapRef = useRef(null);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const fetchMap = async () => {
      const data = await getPublishedMap(id);
      setMapData(data);
    };
    fetchMap();
  }, [id]);

  useEffect(() => {
    if (!mapData) return;

    const map = L.map('viewer-map', {
      zoomControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const polygon = L.geoJSON(mapData.geometry, {
      style: { color: 'blue', weight: 2 },
    }).addTo(map);

    const bounds = polygon.getBounds();
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    map.setMinZoom(map.getZoom());

    mapData.entities.forEach((entity) => {
      L.geoJSON(entity.geometry, {
        pointToLayer: (geo, latlng) => {
          return L.marker(latlng).bindPopup(entity.name || 'Khu C');
        },
      }).addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [mapData]);

  return <div id="viewer-map" className="w-full h-screen" />;
}
