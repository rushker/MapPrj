//client/src/components/MapViewer.jsx
import { MapContainer, ImageOverlay, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useEffect, useState, useRef } from 'react';
import { fetchMaps, fetchAreas, uploadArea } from '../api/mapApi';

export default function MapViewer() {
  const [map, setMap] = useState(null);
  const [areas, setAreas] = useState([]);
  const fgRef = useRef();

  useEffect(() => {
    (async () => {
      const mapRes = await fetchMaps();
      const areaRes = await fetchAreas();
      setMap(mapRes.data[0]);
      setAreas(areaRes.data);
    })();
  }, []);

  const onCreated = async e => {
    const layer = e.layer;
    if (layer instanceof L.Polygon) {
      const coords = layer.getLatLngs()[0].map(p => ({ lat: p.lat, lng: p.lng }));
      const fd = new FormData();
      fd.append('mapId', map._id);
      fd.append('coordinates', JSON.stringify(coords));
      await uploadArea(fd);
      const updatedAreas = await fetchAreas();
      setAreas(updatedAreas.data);
    }
  };

  if (!map) return <div className="text-center mt-8">Loading map...</div>;

  return (
    <MapContainer center={[500, 500]} zoom={-1} style={{ height: '100%', width: '100%' }}>
      <ImageOverlay url={map.fileUrl} bounds={map.bounds} />
      <FeatureGroup ref={fgRef}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{ rectangle: false, circle: false, polyline: false }}
        />
        {areas.map(a => (
          <Polygon
            key={a._id}
            positions={a.coordinates.map(c => [c.lat, c.lng])}
            pathOptions={{ color: 'blue' }}
          />
        ))}
      </FeatureGroup>
    </MapContainer>
  );
}
