// services/media.js
import axios from './axiosInstance';
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    console.error('Upload failed:', err);
    throw new Error('Upload ảnh thất bại');
  }
};

export const deleteImage = async (publicId) => {
  try {
    await axios.post('/api/media/delete', { publicId });
  } catch (err) {
    console.error('Delete failed:', err);
    throw new Error('Xóa ảnh thất bại');
  }
};
