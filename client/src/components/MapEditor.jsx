// src/components/MapEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { v4 as uuidv4 } from 'uuid';

const MarkerMetadataForm = ({ marker, onChange, onClose }) => {
  const [form, setForm] = useState(marker);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(marker);
  }, [marker]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Tên là bắt buộc';
    if (!form.type?.trim()) newErrors.type = 'Loại là bắt buộc';
    return newErrors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) return setErrors(errors);
    
    onChange(form);
    onClose();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg mb-4">
      <h3 className="text-lg font-semibold mb-3">Thông tin Marker</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tên *</label>
          <input
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full p-2 rounded border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Loại *</label>
          <select
            value={form.type || ''}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full p-2 rounded border border-gray-300"
          >
            <option value="">Chọn loại</option>
            <option value="landmark">Địa danh</option>
            <option value="warning">Cảnh báo</option>
            <option value="info">Thông tin</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hình ảnh URL</label>
          <input
            type="url"
            value={form.image || ''}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

const MapEditor = ({ updateMapData }) => {
  const [mapName, setMapName] = useState('');
  const [polygon, setPolygon] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [drawingMode, setDrawingMode] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());

  // Xử lý tạo polygon
  const handleCreatePolygon = useCallback((e) => {
    const newPolygon = e.layer.toGeoJSON().geometry;
    setPolygon(newPolygon);
  }, []);

  // Xử lý click bản đồ để tạo marker
  const handleMapClick = useCallback(
    (e) => {
      if (drawingMode !== 'marker') return;

      const newMarker = {
        id: uuidv4(),
        geometry: {
          type: 'Point',
          coordinates: [e.latlng.lng, e.latlng.lat],
        },
        properties: {
          name: '',
          type: '',
          image: '',
        },
      };

      setMarkers((prev) => [...prev, newMarker]);
      setSelectedMarker(newMarker);
      setDrawingMode(null);
    },
    [drawingMode]
  );

  // Validate trước khi lưu
  const validateBeforeSave = () => {
    const errors = [];
    
    if (!mapName.trim()) errors.push('Tên khu vực là bắt buộc');
    
    if (!polygon || polygon.coordinates[0].length < 3) {
      errors.push('Vui lòng vẽ khu vực hợp lệ (ít nhất 3 điểm)');
    }

    const markerErrors = markers.filter(
      (m) => !m.properties.name?.trim() || !m.properties.type?.trim()
    );
    
    if (markerErrors.length > 0) {
      errors.push(`${markerErrors.length} marker thiếu thông tin bắt buộc`);
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateBeforeSave();
    if (errors.length > 0) return alert(errors.join('\n'));

    const featureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: polygon,
          properties: { name: mapName },
        },
        ...markers.map((m) => ({
          type: 'Feature',
          geometry: m.geometry,
          properties: m.properties,
        })),
      ],
    };

    updateMapData?.(featureCollection);
    alert('Lưu thành công!');
    resetMap();
  };

  const resetMap = () => {
    setMapName('');
    setPolygon(null);
    setMarkers([]);
    setSelectedMarker(null);
    setMapKey(Date.now());
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-100px)]">
      <div className="flex-1 relative">
        <MapContainer
          key={mapKey}
          center={[10.762622, 106.660172]}
          zoom={13}
          className="h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <EditControl
            position="topright"
            draw={{
              polygon: {
                allowIntersection: false,
                showArea: true,
              },
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
            }}
            onCreated={handleCreatePolygon}
          />

          {polygon && (
            <Polygon
              positions={polygon.coordinates[0].map(([lng, lat]) => [lat, lng])}
              color="blue"
            />
          )}

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[
                marker.geometry.coordinates[1],
                marker.geometry.coordinates[0],
              ]}
              eventHandlers={{
                click: () => setSelectedMarker(marker),
              }}
            />
          ))}

          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>

        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
          <button
            onClick={() => setDrawingMode('polygon')}
            className="px-4 py-2 bg-white shadow-md rounded"
          >
            📐 Vẽ khu vực
          </button>
          <button
            onClick={() => setDrawingMode('marker')}
            className="px-4 py-2 bg-white shadow-md rounded"
          >
            📍 Thêm marker
          </button>
        </div>
      </div>

      <div className="md:w-96 p-4 bg-white shadow-lg overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Thông tin bản đồ</h2>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Tên khu vực *</label>
          <input
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập tên khu vực"
          />
        </div>

        {selectedMarker && (
          <MarkerMetadataForm
            marker={selectedMarker}
            onChange={(updated) =>
              setMarkers((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
              )
            }
            onClose={() => setSelectedMarker(null)}
          />
        )}

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            💾 Lưu bản đồ
          </button>
        </div>
      </div>
    </div>
  );
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
};

export default MapEditor;