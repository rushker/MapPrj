// src/components/MarkerFormModal.jsx
import React from 'react';
import useMarkerForm from '../../hooks/useMarkerForm';

/**
 * MarkerFormModal
 * Used to create a new marker at a given latlng
 * Props:
 *  - latlng: { lat, lng }
 *  - onSubmit: fn(markerData)
 *  - onClose: fn()
 */
export default function MarkerFormModal({ latlng, onSubmit, onClose }) {
  const {
    form,
    setForm,
    errors,
    setErrors,
    loading,
    validate,
    handleUpload
  } = useMarkerForm({});

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
          {/* Name */}
          <div>
            <label className="block text-sm">Name *</label>
            <input
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm">Type *</label>
            <input
              className={`w-full p-2 border rounded ${errors.type ? 'border-red-500' : ''}`}
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            />
            {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm">Image</label>
            <input type="file" onChange={handleUpload} className="w-full" disabled={loading} />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="marker"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
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
