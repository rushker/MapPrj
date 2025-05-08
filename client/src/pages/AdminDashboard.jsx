//src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMaps, deleteMap } from '../services/api';

export default function AdminDashboard() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaps();
    logDevLinks();
  }, []);

  const fetchMaps = async () => {
    try {
      const data = await getAllMaps();
      setMaps(data);
    } catch (err) {
      console.error('❌ Failed to fetch maps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this map?');
    if (!confirmed) return;

    try {
      await deleteMap(id);
      setMaps((prev) => prev.filter((map) => map._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert('Failed to delete map');
    }
  };

  const logDevLinks = () => {
    console.log('🔒 Private Dev Links:');
    console.log('🔹 /basemap - Create new map');
    console.log('🔹 /edit/:id - Add markers & metadata');
    console.log('🔹 /admin - Admin dashboard');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🗺️ Admin Dashboard</h1>

      {loading ? (
        <p>Loading maps...</p>
      ) : maps.length === 0 ? (
        <p>No maps found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Markers</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {maps.map((map) => (
                <tr key={map._id} className="border-t">
                  <td className="px-4 py-2">{map.name || 'Untitled'}</td>
                  <td className="px-4 py-2">
                    {new Date(map.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{map.markers?.length ?? 0}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit/${map._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(map._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
