// services/entities.js
import axios from './axiosInstance';

// Lấy tất cả entity của 1 area (Khu C + marker cùng chung trong area)
export const getEntitiesByArea = async (projectId, areaId) => {
  const res = await axios.get(`/api/projects/${projectId}/areas/${areaId}/entities`);
  return res.data;
};

// Tạo entity mới (Khu vực C hoặc Marker)
export const createEntity = async (projectId, areaId, entityData) => {
  const res = await axios.post(`/api/projects/${projectId}/areas/${areaId}/entities`, entityData);
  return res.data;
};

// Cập nhật entity (metadata hoặc hình ảnh)
export const updateEntity = async (projectId, areaId, entityId, entityData) => {
  const res = await axios.put(`/api/projects/${projectId}/areas/${areaId}/entities/${entityId}`, entityData);
  return res.data;
};

// Xóa entity
export const deleteEntity = async (projectId, areaId, entityId) => {
  const res = await axios.delete(`/api/projects/${projectId}/areas/${areaId}/entities/${entityId}`);
  return res.data;
};
