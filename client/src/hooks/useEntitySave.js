// hooks/useEntitySave.js
import { createEntity, updateEntity } from '../services/entities';
import { uploadImage, deleteImage } from '../services/media';
import { toast } from 'react-hot-toast';

export function useEntitySave(projectId, areaId, onRefresh) {
  const handleImageUpload = async (files) => {
    const uploadedImages = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await uploadImage(formData);
        
        if (!response?.url?.startsWith('https://')) {
          throw new Error('URL ảnh không hợp lệ từ server');
        }
        
        uploadedImages.push(response);
      }
      return uploadedImages;
    } catch (error) {
      // Rollback ngay nếu upload lỗi
      await Promise.allSettled(
        uploadedImages.map(img => 
          deleteImage(img.public_id).catch(console.warn))
      );
      throw error;
    }
  };

  const buildPayload = (entity, uploadedImages) => ({
    ...entity,
    images: [
      ...(entity.images || []),
      ...uploadedImages.map(img => img.url)
    ]
  });

  const saveEntity = async (entity, type, files = []) => {
    let uploadedImages = [];

    try {
      // Bước 1: Upload ảnh (nếu có)
      if (files.length > 0) {
        uploadedImages = await handleImageUpload(files);
      }

      // Bước 2: Tạo payload
      const payload = buildPayload(entity, uploadedImages);

      // Bước 3: Gọi API
      const apiCall = entity._id 
        ? updateEntity(projectId, areaId, entity._id, payload)
        : createEntity(projectId, areaId, { ...payload, type });

      const result = await apiCall;

      // Bước 4: Xử lý sau thành công
      toast.success(entity._id ? 'Cập nhật thành công 🎉' : 'Tạo mới thành công 🚀');
      onRefresh?.();

      return result;
    } catch (err) {
      // Bước 5: Xử lý lỗi
      const errorMessage = err.response?.data?.message || err.message;
      
      // Rollback ảnh đã upload
      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map(img => 
            deleteImage(img.public_id).catch(console.warn))
        );
      }

      toast.error(`Lỗi: ${errorMessage}`);
      throw err;
    }
  };

  return { saveEntity };
}