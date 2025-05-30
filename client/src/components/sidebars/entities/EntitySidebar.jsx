// components/sidebars/entities/EntitySidebar.jsx
import { SIDEBAR_CONFIG } from './SIDEBAR_CONFIG';
import ImageUploader from './ImageUploader';
import { uploadImage, deleteImage } from '../../../services/media';
import { useEntityMetadata } from '../../../hooks/local/metadata/useEntityMetadata';

export default function EntitySidebar({ entity, onChange, onSave, onDelete, onClose }) {
  if (!entity) return null;

  const config = SIDEBAR_CONFIG[entity.type] || {};
  const {
    metadata,
    handleInputChange,
  } = useEntityMetadata(entity, onChange);

  const handleImageUpload = async (file) => {
    const { url } = await uploadImage(file);
    const updatedImages = [...(metadata.images || []), url];
    handleInputChange('images')(updatedImages);
  };

  const handleImageDelete = async (url) => {
    const publicId = url.split('/').pop().split('.')[0];
    await deleteImage(publicId);
    const updatedImages = (metadata.images || []).filter(img => img !== url);
    handleInputChange('images')(updatedImages);
  };

  return (
    <div className="sidebar p-4 w-80 bg-white border shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{config.title || 'Entity'}</h2>

      {/* Name Field */}
      <label className="block text-sm font-medium mb-1">Tên</label>
      <input
        className="w-full border px-2 py-1 rounded mb-3"
        value={metadata.name || ''}
        onChange={(e) => handleInputChange('name')(e.target.value)}
        placeholder="Nhập tên"
      />

      {/* Description Field */}
      <label className="block text-sm font-medium mb-1">Mô tả</label>
      <textarea
        className="w-full border px-2 py-1 rounded mb-3"
        value={metadata.metadata?.description || ''}
        onChange={(e) => handleInputChange('metadata.description')(e.target.value)}
        placeholder="Mô tả ngắn"
      />

      {/* Image Upload */}
      <ImageUploader
        images={metadata.images || []}
        onUpload={handleImageUpload}
        onDelete={handleImageDelete}
      />

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button className="btn btn-danger" onClick={onDelete}>Xóa</button>
        <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
        <button className="btn btn-primary" onClick={() => onSave(metadata)}>Lưu</button>
      </div>
    </div>
  );
}

