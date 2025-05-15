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
  const polygonLayerRef = useRef(null);
  const leafletMarkersRef = useRef([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mapInstance = null;
    const initMap = async () => {
      try {
        const { data } = await getMapAreaById(id);
        if (mapRef.current) return;

        // Initialize map without default view
        mapInstance = L.map('edit-map', { worldCopyJump: true });
        mapRef.current = mapInstance;

        // Configure tile layer with load event
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          noWrap: true
        }).addTo(mapInstance);

        // Configure geoman controls
        mapInstance.pm.addControls({
          drawCircle: false,
          drawPolyline: false,
          drawCircleMarker: false,
          drawRectangle: false,
          drawPolygon: false,
        });

        // Create polygon layer
        const polygonLayer = L.geoJSON(data.polygon, {
          pmIgnore: false,
          style: { color: '#3388ff', weight: 3 }
        }).addTo(mapInstance);

        polygonLayer.pm.enable({ allowSelfIntersection: false });
        polygonLayerRef.current = polygonLayer;

        // Set view after tiles load
        tileLayer.on('load', () => {
          const bounds = polygonLayer.getBounds();
          if (bounds.isValid()) {
            mapInstance.fitBounds(bounds, { padding: [50, 50] });
            mapInstance.setMaxBounds(bounds.pad(0.5)); // Keep view near the polygon
          } else {
            console.error('Invalid polygon bounds:', bounds);
          }
        });

        // Initialize markers
        const initialMarkers = data.markers || [];
        setMarkers(initialMarkers);
        initialMarkers.forEach((marker, idx) => addMarkerToMap(marker, idx));

        // Add marker on click
        mapInstance.on('click', this.handleMapClick);

      } catch (err) {
        console.error('Failed to load map area:', err);
        toast.error('Error loading map area');
        navigate('/');
      }
    };

    const handleMapClick = (e) => {
      const newMarker = createNewMarker(e.latlng);
      setMarkers(prev => [...prev, newMarker]);
      addMarkerToMap(newMarker, markers.length);
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.off('click', handleMapClick);
        mapInstance.remove();
      }
      clearMarkers();
    };
  }, [id]);

  // Helper function to create marker object
  const createNewMarker = (latlng) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [latlng.lng, latlng.lat],
    },
    properties: {
      name: '',
      type: '',
      imageUrl: '',
      createdAt: new Date().toISOString()
    }
  });

  // Marker management functions
  const addMarkerToMap = (marker, index) => {
    const [lng, lat] = marker.geometry.coordinates;
    const leafletMarker = L.marker([lat, lng], {
      draggable: true,
      autoPan: true
    }).addTo(mapRef.current);

    leafletMarker
      .on('click', () => setSelectedMarkerIndex(index))
      .on('dragend', handleMarkerDrag);

    leafletMarkersRef.current[index] = leafletMarker;
  };

  const handleMarkerDrag = (e) => {
    const index = leafletMarkersRef.current.findIndex(m => m === e.target);
    if (index === -1) return;

    const { lat, lng } = e.target.getLatLng();
    setMarkers(prev => prev.map((m, i) => 
      i === index ? {
        ...m,
        geometry: { ...m.geometry, coordinates: [lng, lat] }
      } : m
    ));
  };

  const clearMarkers = () => {
    leafletMarkersRef.current.forEach(marker => marker.remove());
    leafletMarkersRef.current = [];
  };

  // Marker deletion handler
  const deleteSelectedMarker = () => {
    if (selectedMarkerIndex === null || !window.confirm('Delete this marker?')) return;
    
    setMarkers(prev => prev.filter((_, i) => i !== selectedMarkerIndex));
    leafletMarkersRef.current[selectedMarkerIndex]?.remove();
    leafletMarkersRef.current.splice(selectedMarkerIndex, 1);
    setSelectedMarkerIndex(null);
  };

  // Save functionality
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const geojson = polygonLayerRef.current?.toGeoJSON();
      if (!geojson?.geometry) throw new Error('Invalid polygon data');

      await updateMapArea(id, { 
        polygon: geojson, 
        markers,
        lastModified: new Date().toISOString()
      });
      
      toast.success('Map saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Save failed:', err);
      toast.error(err.response?.data?.error || 'Error saving map');
    } finally {
      setIsSaving(false);
    }
  };

  // Selected marker metadata
  const selectedMarker = markers[selectedMarkerIndex];

  return (
    <div className="relative h-screen w-screen">
      <div id="edit-map" className="h-full w-full" />

      {/* Marker editing panel */}
      {selectedMarker && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-xl z-[1000] w-80 space-y-3">
          <h2 className="text-lg font-bold border-b pb-2">Edit Marker</h2>
          
          <InputField
            label="Name"
            value={selectedMarker.properties?.name}
            onChange={v => handleMetaChange('name', v)}
          />
          
          <InputField
            label="Type"
            value={selectedMarker.properties?.type}
            onChange={v => handleMetaChange('type', v)}
          />
          
          <ImageUploader 
            onUpload={handleImageUpload}
            preview={selectedMarker.properties?.imageUrl}
          />
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={deleteSelectedMarker}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="absolute bottom-6 left-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[1000] transition-all hover:bg-green-700 disabled:opacity-50"
      >
        {isSaving ? (
          <span className="flex items-center gap-2">
            <Spinner /> Saving...
          </span>
        ) : 'Save Map'}
      </button>
    </div>
  );
};

// Helper components
const InputField = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const ImageUploader = ({ onUpload, preview }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={onUpload}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {preview && (
      <img
        src={preview}
        alt="Marker preview"
        className="mt-2 rounded-md border object-cover h-32 w-full"
      />
    )}
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default EditMapPage;