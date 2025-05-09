// src/hooks/useMarkerForm.js
import { useState } from 'react';
import { uploadImage } from '../services/mapService.js';

/**
 * Shared hook for marker form state and validation
 */
export default function useMarkerForm(initialData = {}) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    type: initialData.type || '',
    description: initialData.description || '',
    imageUrl: initialData.imageUrl || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.type.trim()) errs.type = 'Type is required';
    return errs;
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, imageUrl: url }));
    } catch {
      alert('Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, errors, setErrors, loading, validate, handleUpload };
}