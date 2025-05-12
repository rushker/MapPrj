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
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const drawnPolygonLayerRef = useRef(null);
  const leafletMarkersRef = useRef([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const { data } = await getMapAreaById(id);
        if (mapRef.current) return;

        const map = L.map('edit-map').setView([0, 0], 2);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        map.pm.addControls({
          drawCircle: false,
          drawPolyline: false,
          drawCircleMarker: false,
          drawRectangle: false,
          drawPolygon: false,
        });

        // Draw and make polygon editable
        const polygonLayer = L.geoJSON(data.polygon, {
          pmIgnore: false,
        }).addTo(map);
        drawnPolygonLayerRef.current = polygonLayer;
        polygonLayer.pm.enable({ allowSelfIntersection: false });
        map.fitBounds(polygonLayer.getBounds());

        // Load and render markers
        const initialMarkers = data.markers || [];
        initialMarkers.forEach((marker, idx) => addMarkerToMap(marker, idx));
        setMarkers(initialMarkers);

        map.on('click', (e) => {
          const newMarker = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.latlng.lng, e.latlng.lat],
            },
            properties: {
              name: '',
              type: '',
              imageUrl: '',
            },
          };
          setMarkers((prev) => {
            const updated = [...prev, newMarker];
            addMarkerToMap(newMarker, updated.length - 1);
            return updated;
          });
        });
      } catch (err) {
        console.error('Failed to load map area', err);
      }
    };

    initMap();

    return () => {
      mapRef.current?.off();
      mapRef.current?.remove();
    };
  }, [id]);

  const addMarkerToMap = (marker, index) => {
    const [lng, lat] = marker.geometry.coordinates;
    const leafletMarker = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);

    leafletMarker.on('click', () => setSelectedMarkerIndex(index));
    leafletMarker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      setMarkers((prev) => {
        const updated = [...prev];
        updated[index].geometry.coordinates = [lng, lat];
        return updated;
      });
    });

    leafletMarkersRef.current[index] = leafletMarker;
  };

  const deleteSelectedMarker = () => {
    if (selectedMarkerIndex === null) return;
    leafletMarkersRef.current[selectedMarkerIndex]?.remove();
    leafletMarkersRef.current.splice(selectedMarkerIndex, 1);
    setMarkers((prev) => prev.filter((_, i) => i !== selectedMarkerIndex));
    setSelectedMarkerIndex(null);
  };

  const handleMetaChange = (field, value) => {
    setMarkers((prev) => {
      const updated = [...prev];
      if (updated[selectedMarkerIndex]) {
        updated[selectedMarkerIndex].properties[field] = value;
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await uploadImage(reader.result);
        handleMetaChange('imageUrl', res.data.imageUrl);
      } catch (err) {
        console.error('Image upload failed', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const geojson = drawnPolygonLayerRef.current?.toGeoJSON();
      if (!geojson) throw new Error('Polygon missing or invalid');

      await updateMapArea(id, {
        polygon: geojson,
        markers,
      });

      alert('Map saved successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error saving map.');
    }
  };

  const selectedMarker = markers[selectedMarkerIndex];

  return (
    <div className="relative h-screen w-screen">
      <div id="edit-map" className="h-full w-full" />

      {selectedMarker && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow z-[1000] w-72">
          <h2 className="font-bold mb-2">Edit Marker</h2>
          <input
            type="text"
            placeholder="Name"
            value={selectedMarker.properties?.name || ''}
            onChange={(e) => handleMetaChange('name', e.target.value)}
            className="w-full mb-2 p-1 border"
          />
          <input
            type="text"
            placeholder="Type"
            value={selectedMarker.properties?.type || ''}
            onChange={(e) => handleMetaChange('type', e.target.value)}
            className="w-full mb-2 p-1 border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mb-2"
          />
          {selectedMarker.properties?.imageUrl && (
            <img
              src={selectedMarker.properties.imageUrl}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
          )}
          <button
            onClick={deleteSelectedMarker}
            className="bg-red-500 text-white px-2 py-1 rounded mt-2 w-full"
          >
            Delete Marker
          </button>
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
