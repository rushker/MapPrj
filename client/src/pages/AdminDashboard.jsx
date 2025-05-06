//src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { getAllMaps, deleteMap } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMaps()
      .then(setMaps)
      .catch((err) => console.error('Failed to fetch maps:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this map?')) return;
    try {
      await deleteMap(id);
      setMaps((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete map');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Map Dashboard</h1>
      {maps.length === 0 ? (
        <p>No maps found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
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
                  <td className="px-4 py-2">{map.markers?.length || 0}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/edit/${map._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(map._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
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
