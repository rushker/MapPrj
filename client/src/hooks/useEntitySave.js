//hooks/useEntitySave.js     -Hook này dùng cho Sidebar nào cũng được (Marker, Khu C...) 
import { createEntity, updateEntity } from '../services/entities';
import { uploadImage, deleteImage } from '../services/media';
import { toast } from 'react-hot-toast';

export function useEntitySave(projectId, areaId, onRefresh) {
  const saveEntity = async (entity, type, files = []) => {
    let uploadedImages = [];
    
    try {
      if (!res.data.url.startsWith('https://')) {
      throw new Error('URL ảnh không hợp lệ');
      }
      // Upload ảnh trước
      if (files.length > 0) {
        uploadedImages = await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return await uploadImage(formData);
          })
        );
      }

      // Tạo payload với URLs ảnh
      const payload = {
        ...entity,
        images: [...(entity.images || []), ...uploadedImages.map(img => img.url)]
      };

      // Gọi API
      if (entity._id) {
        await updateEntity(projectId, areaId, entity._id, payload);
      } else {
        await createEntity(projectId, areaId, { ...payload, type });
      }

      toast.success(entity._id ? 'Cập nhật thành công' : 'Tạo mới thành công');
      onRefresh?.();
    } catch (err) {
      // Rollback ảnh nếu có lỗi
      await Promise.all(
        uploadedImages.map(img => 
          deleteImage(img.public_id).catch(console.error)
        )
      );
      toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  return { saveEntity };
}

