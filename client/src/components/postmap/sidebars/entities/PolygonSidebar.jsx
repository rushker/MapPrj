// src/components/sidebars/entities/PolygonSidebar.jsx
import ImageUploader from './ImageUploader';
import ColorOpacityPicker from '../../draw/ColorOpacityPicker';
import { uploadImage, deleteImage } from '../../../../services/media';
import { useEntityMetadata } from '../../../../hooks/local/metadata/useEntityMetadata';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function PolygonSidebar({ entity, onChange, onDelete, onClose, isEditMode = false }) {
  const [isLoading] = useState(false);
  const {
    entity: currentEntity,
    handleInputChange,
    handleImagesChange,
    handleStyleChange,
  } = useEntityMetadata(entity, isEditMode ? onChange : null);

  if (!entity) return null;

  const handleImageUpload = async (file) => {
    if (!isEditMode) return;
    try {
      const { url } = await uploadImage(file);
      const updatedImages = [...(currentEntity.metadata?.images || []), url];
      handleImagesChange(updatedImages);
    } catch (err) {
      toast.error('Upload ảnh thất bại: ' + err.message);
    }
  };

  const handleImageDelete = async (url) => {
    if (!isEditMode) return;
    try {
      const publicId = url.match(/upload\/(?:v\d+\/)?([^\.]+)/)?.[1];
      if (!publicId) throw new Error('Không thể xác định publicId của ảnh');

      await deleteImage(publicId);
      const updatedImages = (currentEntity.metadata?.images || []).filter((img) => img !== url);
      handleImagesChange(updatedImages);
    } catch (err) {
      toast.error('Xóa ảnh thất bại: ' + err.message);
    }
  };
  
  return (
    <div className="sidebar p-4 w-80 bg-white border shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Khu C</h2>

      <label className="block text-sm font-medium mb-1">Tên</label>
      <input
        className="w-full border px-2 py-1 rounded mb-3"
        value={currentEntity.name || ''}
        onChange={(e) => handleInputChange('name')(e.target.value)}
        readOnly={!isEditMode}
        placeholder="Nhập tên"
      />

      <label className="block text-sm font-medium mb-1">Mô tả</label>
      <textarea
        className="w-full border px-2 py-1 rounded mb-3"
        value={currentEntity.metadata?.description || ''}
        onChange={(e) => handleInputChange('metadata.description')(e.target.value)}
        readOnly={!isEditMode}
        placeholder="Mô tả ngắn"
      />

      {isEditMode && (
        <ImageUploader
          images={currentEntity.metadata?.images || []}
          onUpload={handleImageUpload}
          onDelete={handleImageDelete}
        />
      )}

      {isEditMode && (
        <>
          <ColorOpacityPicker
            label="Màu viền (Stroke)"
            color={currentEntity.metadata?.strokeColor || { r: 51, g: 136, b: 255, a: 1 }}
            onChange={(val) => handleStyleChange('strokeColor', val)}
          />
          <ColorOpacityPicker
            label="Màu nền (Fill)"
            color={currentEntity.metadata?.fillColor || { r: 255, g: 0, b: 0, a: 0.4 }}
            onChange={(val) => handleStyleChange('fillColor', val)}
          />
        </>
      )}

      {isEditMode && (
        <div className="flex justify-between mt-4">
          <button className="btn btn-danger" onClick={onDelete} disabled={isLoading}>Xóa</button>
          <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>Đóng</button>
        </div>
      )}
    </div>
  );
}
