/ src/components/MarkerFormModal.jsx
import React, { useState } from 'react';
import { uploadImage } from '../../services/mapService.js';

/**
 * MarkerFormModal
 * Used to create a new marker at a given latlng
 * Props:
 *  - latlng: { lat, lng }
 *  - onSubmit: fn(markerData)
 *  - onClose: fn()
 */
export default function MarkerFormModal({ latlng, onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', type: '', description: '', imageUrl: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.type.trim()) errs.type = 'Type is required';
    return errs;
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, imageUrl: url }));
    } catch {
      alert('Image upload failed');
    }
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, lat: latlng.lat, lng: latlng.lng });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Add Marker</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Name *</label>
            <input
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm">Type *</label>
            <input
              className={`w-full p-2 border rounded ${errors.type ? 'border-red-500' : ''}`}
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            />
            {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm">Image</label>
            <input type="file" onChange={handleUpload} className="w-full" />
            {form.imageUrl && <img src={form.imageUrl} alt="marker" className="mt-2 w-24 h-24 object-cover rounded" />}
          </div>
        </div>
        <div className="mt-5 flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}