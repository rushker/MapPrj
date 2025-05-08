// src/pages/BasemapPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { createMap } from '../services/api'; // Thêm hàm createMap
const GeomanControls = ({ onCreated }) => {
  const map = useMap();

  useEffect(() => {
    // Add Geoman draw controls
    map.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircle: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircleMarker: false,
    });

    // Handle polygon creation
    const handleCreate = (e) => {
      if (e.layer instanceof L.Polygon) {
        const geojson = e.layer.toGeoJSON();
        onCreated(geojson);
      }
    };

    map.on('pm:create', handleCreate);

    return () => {
      map.off('pm:create', handleCreate);
    };
  }, [map, onCreated]);

  return null;
};

const BasemapPage = () => {
  const [polygon, setPolygon] = useState(null);
  const navigate = useNavigate();

  const handlePolygonCreated = (geojson) => {
    setPolygon(geojson);
  };

  const handleSave = async () => {
    if (!polygon) return alert('Vui lòng vẽ đa giác trước');
    try {
      const newMap = await createMap({ polygon }); // Gọi API tạo map
      navigate(`/edit/${newMap._id}`); // Chuyển hướng với ID
    } catch (err) {
      alert('Lỗi khi lưu bản đồ');
    }
  };

  return (
    <div className="h-screen">
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeomanControls onCreated={handlePolygonCreated} />
      </MapContainer>

      <button
        className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        onClick={handleSave}
      >
        Lưu và Chỉnh sửa
      </button>
    </div>
  );
};

export default BasemapPage;