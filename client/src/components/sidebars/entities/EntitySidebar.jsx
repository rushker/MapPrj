//components/sidebars/entities/EntitySidebar.jsx
import { useState } from 'react';
import { uploadImage, deleteImage } from '../../../services/media';
import { SIDEBAR_CONFIG } from './SIDEBAR_CONFIG';
import ImageUploader from './ImageUploader';

export default function EntitySidebar({ entity, onChange, onDelete, onClose }) {
  if (!entity) return null;

  const config = SIDEBAR_CONFIG[entity.type] || {};
  const [localData, setLocalData] = useState({ ...entity });

  const handleInputChange = (field, value) => {
    const updated = { ...localData };
    if (field.startsWith('metadata.')) {
      updated.metadata = {
        ...updated.metadata,
        [field.split('.')[1]]: value,
      };
    } else {
      updated[field] = value;
    }
    setLocalData(updated);
    onChange(updated); // propagate change
  };

  const handleImageUpload = async (file) => {
    const { url } = await uploadImage(file);
    const updatedImages = [...(localData.images || []), url];
    handleInputChange('images', updatedImages);
  };

  const handleImageDelete = async (url) => {
    const publicId = url.split('/').pop().split('.')[0]; // simplify this extraction
    await deleteImage(publicId);
    const updatedImages = localData.images.filter(img => img !== url);
    handleInputChange('images', updatedImages);
  };

  return (
    <div className="sidebar">
      <h2>{config.title || 'Entity'}</h2>

      {/* Name Field */}
      <label>Tên</label>
      <input
        value={localData.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
      />

      {/* Description Field */}
      <label>Mô tả</label>
      <textarea
        value={localData.metadata?.description || ''}
        onChange={(e) => handleInputChange('metadata.description', e.target.value)}
      />

      {/* Image Upload */}
      <ImageUploader
        images={localData.images || []}
        onUpload={handleImageUpload}
        onDelete={handleImageDelete}
      />

      {/* Action buttons */}
      <div className="actions">
        <button className="btn btn-danger" onClick={onDelete}>Xóa</button>
        <button className="btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}
