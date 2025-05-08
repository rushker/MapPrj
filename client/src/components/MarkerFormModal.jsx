// src/components/MarkerFormModal.jsx
import { useState } from 'react';
import { uploadImage } from '../services/api';

export default function MarkerFormModal({ 
  latlng, 
  onSubmit, 
  onClose,
  initialData = {} // Cho phép edit marker
}) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    type: initialData.type || 'default',
    description: initialData.description || '',
    imageUrl: initialData.imageUrl || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Tên marker là bắt buộc';
    if (!form.type.trim()) newErrors.type = 'Loại marker là bắt buộc';
    return newErrors;
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      alert('Lỗi upload ảnh');
    }
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    onSubmit({ 
      ...form,
      latlng,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {initialData.id ? 'Chỉnh sửa Marker' : 'Tạo Marker Mới'}
        </h3>

        <div className="space-y-4">
          <div>
            <label>Tên marker *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`block w-full p-2 border ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label>Loại *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="block w-full p-2 border"
            >
              <option value="default">Mặc định</option>
              <option value="landmark">Địa danh</option>
              <option value="warning">Cảnh báo</option>
            </select>
          </div>

          <div>
            <label>Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="block w-full p-2 border"
              rows="3"
            />
          </div>

          <div>
            <label>Hình ảnh</label>
            <input 
              type="file" 
              onChange={handleUpload} 
              className="block w-full"
            />
            {form.imageUrl && (
              <img 
                src={form.imageUrl} 
                alt="Preview" 
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white"
          >
            {initialData.id ? 'Cập nhật' : 'Tạo'}
          </button>
        </div>
      </div>
    </div>
  );
}