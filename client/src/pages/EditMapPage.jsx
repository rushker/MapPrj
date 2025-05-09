// src/pages/EditMapPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
import { getMapAreaById, updateMapArea } from '../services/mapAreaService';
import { uploadImage } from '../services/mapService';

const EditMapPage = () => {
  const { id } = useParams();
  const mapRef = useRef(null);
  const drawnPolygonRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initMap = async () => {
      const { data } = await getMapAreaById(id);
      const map = L.map('edit-map').setView([0, 0], 2);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      map.pm.addControls({
        drawCircle: false,
        drawPolyline: false,
        drawCircleMarker: false,
        drawRectangle: false,
        drawPolygon: false
      });

      // Draw saved polygon
      const polygonLayer = L.geoJSON(data.polygon).addTo(map);
      map.fitBounds(polygonLayer.getBounds());
      drawnPolygonRef.current = data.polygon;

      // Load existing markers
      if (data.markers?.length) {
        data.markers.forEach(marker => {
          addMarkerToMap(marker);
        });
      }

      map.on('click', (e) => {
        const newMarker = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
          },
          properties: {
            name: '',
            type: '',
            imageUrl: ''
          }
        };
        setMarkers(prev => [...prev, newMarker]);
        addMarkerToMap(newMarker, markers.length);
      });
    };

    initMap();
  }, []);

  const addMarkerToMap = (marker, index = markers.length) => {
    const [lng, lat] = marker.geometry.coordinates;
    const leafletMarker = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);

    leafletMarker.on('click', () => setSelectedMarkerIndex(index));
    leafletMarker.on('dragend', (e) => {
      const newCoords = e.target.getLatLng();
      setMarkers((prev) => {
        const updated = [...prev];
        updated[index].geometry.coordinates = [newCoords.lng, newCoords.lat];
        return updated;
      });
    });
  };

  const handleMetaChange = (field, value) => {
    setMarkers(prev => {
      const updated = [...prev];
      updated[selectedMarkerIndex].properties[field] = value;
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await uploadImage(reader.result);
        handleMetaChange('imageUrl', res.data.imageUrl);
      } catch (err) {
        console.error('Image upload failed', err);
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateMapArea(id, {
        polygon: drawnPolygonRef.current,
        markers
      });
      alert('Map saved.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error saving map.');
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div id="edit-map" className="h-full w-full" />
      {selectedMarkerIndex !== null && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow z-[1000] w-72">
          <h2 className="font-bold mb-2">Edit Marker</h2>
          <input
            type="text"
            placeholder="Name"
            value={markers[selectedMarkerIndex]?.properties.name || ''}
            onChange={(e) => handleMetaChange('name', e.target.value)}
            className="w-full mb-2 p-1 border"
          />
          <input
            type="text"
            placeholder="Type"
            value={markers[selectedMarkerIndex]?.properties.type || ''}
            onChange={(e) => handleMetaChange('type', e.target.value)}
            className="w-full mb-2 p-1 border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mb-2"
          />
          {markers[selectedMarkerIndex]?.properties.imageUrl && (
            <img
              src={markers[selectedMarkerIndex].properties.imageUrl}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
          )}
        </div>
      )}
      <button
        onClick={handleSave}
        className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded shadow z-[1000]"
      >
        Save Map
      </button>
    </div>
  );
};

export default EditMapPage;
