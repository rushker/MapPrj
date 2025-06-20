// components/sidebars/entities/EntitySidebar.jsx
import { SIDEBAR_CONFIG } from './SIDEBAR_CONFIG';
import ImageUploader from './ImageUploader';
import { uploadImage, deleteImage } from '../../../../services/media';
import { useEntityMetadata } from '../../../../hooks/local/metadata/useEntityMetadata';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function EntitySidebar({ 
  entity,
  onChange,
  onSave,
  onDelete,
  onClose,
  isEditMode = false 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const config = SIDEBAR_CONFIG[entity?.type] || {};

  const {
    entity: currentEntity,
    validate,
    isValid,
    isUnchanged,
    handleInputChange,
    handleImagesChange,
  } = useEntityMetadata(entity, isEditMode ? onChange : null); // Chỉ cho phép onChange khi chỉnh sửa

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
      console.error('Xóa ảnh thất bại:', err);
      toast.error('Xóa ảnh thất bại: ' + err.message);
    }
  };

  const handleSaveClick = async () => {
  if (!isEditMode) return;
  if (!validate()) return;
  setIsLoading(true);
  
  try {
    // Chỉ gửi metadata, không gửi toàn bộ entity
    await onSave(
      currentEntity._id, 
      currentEntity.metadata || {}
    );
    
    toast.success('Đã lưu thông tin thành công');
  } catch (err) {
    toast.error(`Lỗi khi lưu: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
};

  const saveDisabled = !isValid || isUnchanged || isLoading || !isEditMode;

  return (
    <div className="sidebar p-4 w-80 bg-white border shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{config.title || 'Entity'}</h2>

      {/* Name */}
      <label className="block text-sm font-medium mb-1">Tên</label>
      <input
        className={`w-full border px-2 py-1 rounded mb-3 ${!isEditMode ? 'bg-gray-100' : ''}`}
        value={currentEntity.name || ''}
        onChange={isEditMode ? (e) => handleInputChange('name')(e.target.value) : undefined}
        readOnly={!isEditMode}
        placeholder="Nhập tên"
      />

      {/* Description */}
      <label className="block text-sm font-medium mb-1">Mô tả</label>
      <textarea
        className={`w-full border px-2 py-1 rounded mb-3 ${!isEditMode ? 'bg-gray-100' : ''}`}
        value={currentEntity.metadata?.description || ''}
        onChange={isEditMode ? (e) => handleInputChange('metadata.description')(e.target.value) : undefined}
        readOnly={!isEditMode}
        placeholder="Mô tả ngắn"
      />

      {/* Image Upload - Chỉ hiển thị khi ở chế độ chỉnh sửa */}
      {isEditMode && (
        <ImageUploader
          images={currentEntity.metadata?.images || []}
          onUpload={handleImageUpload}
          onDelete={handleImageDelete}
        />
      )}

      {/* Buttons - Chỉ hiển thị khi ở chế độ chỉnh sửa */}
      {isEditMode && (
        <div className="flex justify-between mt-4">
          <button 
            className="btn btn-danger" 
            onClick={onDelete} 
            disabled={isLoading}
          >
            Xóa
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            Đóng
          </button>
          <button
            className={`btn btn-primary ${saveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSaveClick}
            disabled={saveDisabled}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      )}
    </div>
  );
}