//src/pages/EditMapPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MapEditor from '../components/MapEditor';
import { getMapById, updateMapData } from '../services/api';

export default function EditMapPage() {
  const { id } = useParams();
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    getMapById(id).then(setMapData).catch(console.error);
  }, [id]);

  const handleSave = async (data) => {
    try {
      await updateMapData(id, data);
      alert('Map saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save map');
    }
  };

  return mapData ? (
    <MapEditor initialData={mapData} onSave={handleSave} />
  ) : (
    <p>Loading...</p>
  );
}
