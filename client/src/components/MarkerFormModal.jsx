//src/components/MarkerFormModal.jsx
import { useState } from 'react';
import { uploadImage } from '../services/api';

export default function MarkerFormModal({ latlng, onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', type: '', number: '', description: '', imageUrl: '' });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const url = await uploadImage(file);
    setForm((prev) => ({ ...prev, imageUrl: url }));
  };

  return (
    <div className="modal">
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Type" onChange={(e) => setForm({ ...form, type: e.target.value })} />
      <input placeholder="Number" onChange={(e) => setForm({ ...form, number: e.target.value })} />
      <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="file" onChange={handleUpload} />
      <button onClick={() => onSubmit({ ...form, latlng })}>Add Marker</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
