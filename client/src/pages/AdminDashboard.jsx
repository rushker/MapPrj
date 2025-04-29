//client/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { fetchMaps, uploadMap } from '../api/mapApi';

export default function AdminDashboard() {
  const [maps, setMaps] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchMaps().then(res => setMaps(res.data));
  }, []);

  const handleUpload = async e => {
    e.preventDefault();
    if (!file || !title) return;
    const fd = new FormData();
    fd.append('title', title);
    fd.append('bounds', JSON.stringify([[0, 0], [1000, 1000]]));
    fd.append('file', file);
    await uploadMap(fd);
    setTitle('');
    setFile(null);
    const updated = await fetchMaps();
    setMaps(updated.data);
  };

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Map title"
          className="border px-2 py-1 rounded w-full"
        />
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          accept=".png,.jpg,.pdf"
          className="w-full"
        />
        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Upload</button>
      </form>
      <div>
        <h3 className="font-semibold">Existing Maps</h3>
        <ul className="space-y-2">
          {maps.map(m => (
            <li key={m._id} className="border p-2 rounded bg-white shadow-sm">
              <span>{m.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
