// src/pages/EditMapPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { v4 as uuidv4 } from 'uuid';
import MarkerMetadataForm from '../components/MarkerMetadataForm';
import { getMapAreaById, updateMapArea } from '../services/privateMapApi';
const MapClickHandler = ({ onClick }) => {
  useMapEvents({ click: onClick });
  return null;
};

const EditMapPage = () => {
  const { id } = useParams();
  const mapRef = useRef(null);
  const [mapName, setMapName] = useState('');
  const [polygon, setPolygon] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isMarkerMode, setIsMarkerMode] = useState(false);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const data = await getMapAreaById(id);
        setMapName(data.name || '');
        setPolygon(data.polygon || []);
        setMarkers(data.markers || []);
      } catch (err) {
        alert('Không thể tải dữ liệu bản đồ.');
        console.error(err);
      }
    };
    loadMapData();
  }, [id]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.pm.addControls({ drawPolygon: true, editMode: true, deleteMode: true });

    map.on('pm:create', (e) => {
      if (e.shape === 'Polygon') {
        const latlngs = e.layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
        setPolygon(latlngs);
      }
    });

    map.on('pm:edit', (e) => {
      const layer = e.layer || e.target;
      const latlngs = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
      setPolygon(latlngs);
    });

    map.on('pm:remove', () => {
      setPolygon([]);
    });
  }, []);

  const handleMapClick = (e) => {
    if (!isMarkerMode) return;

    const newMarker = {
      id: uuidv4(),
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      name: '',
      type: '',
      image: '',
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarkerId(newMarker.id);
  };

  const handleMarkerMetadataChange = (updatedMarker) => {
    setMarkers(markers.map((m) => (m.id === updatedMarker.id ? updatedMarker : m)));
  };

  const handleDeleteMarker = (markerId) => {
    setMarkers(markers.filter((m) => m.id !== markerId));
    setSelectedMarkerId(null);
  };

  const handleSave = async () => {
    if (!mapName.trim()) return alert('Vui lòng nhập tên khu vực.');
    if (polygon.length < 3) return alert('Vui lòng vẽ một vùng đa giác hợp lệ.');
    if (markers.length === 0) return alert('Vui lòng tạo ít nhất một marker.');

    const incomplete = markers.some((m) => !m.name || !m.type);
    if (incomplete) return alert('Tất cả marker phải có tên và loại.');

    try {
      await updateMapArea(id, { name: mapName, polygon, markers });
      alert('Đã lưu thành công!');
    } catch (err) {
      console.error(err);
      alert('Lưu thất bại.');
    }
  };

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId);

  return (
    <div className="flex h-screen">
      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={13}
        className="w-2/3 h-full"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <MapClickHandler onClick={handleMapClick} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {polygon.length > 0 && <Polygon positions={polygon} pathOptions={{ color: 'blue' }} />}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            eventHandlers={{ click: () => setSelectedMarkerId(marker.id) }}
          />
        ))}
      </MapContainer>

      <div className="w-1/3 p-4 overflow-y-auto">
        <div className="mb-4">
          <label className="block font-medium">Tên khu vực</label>
          <input
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          onClick={() => setIsMarkerMode(!isMarkerMode)}
          className={`mb-4 px-4 py-2 rounded ${isMarkerMode ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isMarkerMode ? 'Hủy tạo Marker' : 'Tạo Marker'}
        </button>

        <button
          onClick={handleSave}
          className="block w-full bg-green-600 text-white py-2 rounded mb-4"
        >
          Lưu
        </button>

        {selectedMarker && (
          <MarkerMetadataForm
            marker={selectedMarker}
            onChange={handleMarkerMetadataChange}
            onDelete={() => handleDeleteMarker(selectedMarker.id)}
            onClose={() => setSelectedMarkerId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EditMapPage;
